const crypto = require('crypto');

// Utility class for Chameleon Hashing
class ChameleonHash {
    constructor(secretKey) {
        this.secretKey = secretKey 
    }

    // Generate a hash based on data and a random nonce
    generateHash(data) {
        const nonce = crypto.randomBytes(16).toString('hex');
        const hash = crypto
            .createHmac('sha256', this.secretKey)
            .update(data + nonce)
            .digest('hex');
        return { hash, nonce };
    }

    // Verify the hash with a given data and nonce
    verifyHash(data, nonce, hash) {
        const recalculatedHash = crypto
            .createHmac('sha256', this.secretKey)
            .update(data + nonce)
            .digest('hex');
        return recalculatedHash === hash;
    }
}
// Encrypt data with the user defined password
function encryptData(data, password) {
    try {
        const iv = crypto.randomBytes(16); 
        const key = crypto.scryptSync(password, 'Mut4610ck', 32);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted
        }
    } catch (error) {
        throw new Error("Encryption failed: " + error.message);
    }
}
// Decrypt data when user requests it and provides the correct pass
function decryptData(encryptedData, iv, password) {
    try {
        const key = crypto.scryptSync(password, 'Mut4610ck', 32);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        throw new Error('Incorrect password or corrupted data');
    }
}

// Block class
class Block {
    constructor(index, data, previousHash, chameleonHashInstance, password) {
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.previousHash = previousHash;
        this.chameleonHash = chameleonHashInstance;

        if (password) {
            const encrypted = encryptData(data, password);
            this.data = encrypted.encryptedData;
            this.iv = encrypted.iv;
            this.isEncrypted = true;
        } else {
            this.isEncrypted = false;
            this.data = data;
        }
    

        // Generate the hash and nonce using the chameleon hash function
        const { hash, nonce } = this.chameleonHash.generateHash(
            this.data + this.previousHash + this.timestamp
        );

        this.hash = hash;
        this.nonce = nonce;
    }

    // Update block data using the chameleon hash instance
    updateData(newData, blockchain) {
        this.data = newData;
    
        // Recalculate new hash and nonce
        const { hash, nonce } = this.chameleonHash.generateHash(
            this.data + this.previousHash + this.timestamp
        );
        this.hash = hash;
        this.nonce = nonce;
    
        // Ensure blockchain reference exists
        if (!blockchain || !blockchain.chain) {
            throw new Error("Blockchain instance must be provided.");
        }
    
        // Get block index
        const blockIndex = blockchain.chain.indexOf(this);
    
        // Propagate hash update to all next blocks
        for (let i = blockIndex + 1; i < blockchain.chain.length; i++) {
            blockchain.chain[i].previousHash = blockchain.chain[i - 1].hash;
    
        // Recalculate hash for the next blocks
            const { hash, nonce } = blockchain.chameleonHash.generateHash(blockchain.chain[i].data + blockchain.chain[i].previousHash + blockchain.chain[i].timestamp);
            blockchain.chain[i].hash = hash;
            blockchain.chain[i].nonce = nonce;
        }
    }
}

// Blockchain class
class Blockchain {
    constructor(secretKey) {
        this.chain = [];
        this.chameleonHash = new ChameleonHash(secretKey);
        this.createGenesisBlock();
    }

    // Create the first block in the chain
    createGenesisBlock() {
        const genesisBlock = new Block(0, "Genesis Block", "0", this.chameleonHash);
        this.chain.push(genesisBlock);
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the chain
    addBlock(data, encryptionKey) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(this.chain.length, data, previousBlock.hash, this.chameleonHash, encryptionKey);
        this.chain.push(newBlock);
    }

    // Verify the integrity of the blockchain
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!this.chameleonHash.verifyHash(currentBlock.data + currentBlock.previousHash + currentBlock.timestamp, currentBlock.nonce, currentBlock.hash)) 
                {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}



module.exports = {Blockchain, encryptData, decryptData};