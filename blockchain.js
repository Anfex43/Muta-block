const crypto = require('crypto');

// Utility class for Chameleon Hashing
class ChameleonHash {
    constructor(secretKey) {
        this.secretKey = "TESTKEY"; 
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

// Block class
class Block {
    constructor(index, data, previousHash, chameleonHashInstance) {
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.previousHash = previousHash;
        this.chameleonHash = chameleonHashInstance;

        // Generate the hash and nonce using the chameleon hash function
        const { hash, nonce } = this.chameleonHash.generateHash(
            this.data + this.previousHash + this.timestamp
        );

        this.hash = hash;
        this.nonce = nonce;
    }

    // Update block data using the chameleon hash instance
    updateData(newData, blockchain) {
        console.log("GETS TO HERE");
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
    
        //Recalculate hash for the next blocks
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
    addBlock(data) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(this.chain.length, data, previousBlock.hash, this.chameleonHash);
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



module.exports = Blockchain;