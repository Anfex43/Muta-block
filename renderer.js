const { ipcRenderer } = require('electron');

// Display blockchain
function displayBlockchain(blockchain) {
    const blockchainView = document.getElementById('blockchain-view');
    blockchainView.innerHTML = blockchain.chain
        .map(
            (block, index) => `
        <div class="block">
            <h4>Block ${index}</h4>
            <p><b>Data:</b> ${block.data}</p>
            <p><b>Encrypted:</b> ${block.isEncrypted ? 'Yes' : 'No'}</p>
            <p><b>Timestamp:</b> ${block.timestamp}</p>
            <p><b>Hash:</b> ${block.hash}</p>
            <p><b>Nonce:</b> ${block.nonce}</p>
        </div>
        `
        )
        .join('');
}

// Add a new block
function addBlock() {
    const data = document.getElementById('block-data').value;
    const encryptionKey = document.getElementById('encryption-key').value;

    ipcRenderer.send('add-block', {data , encryptionKey});
    document.getElementById('block-data').value = '';
    document.getElementById('encryption-key').value = '';
}

// Data decryption function with user key
function decryptBlockData() {
    const index = parseInt(document.getElementById('decrypt-index').value, 10);
    const password = document.getElementById('decrypt-key').value;
    if (!index && index !== 0) {
        alert("Please enter a valid block index to decrypt.");
        return;
    }
    ipcRenderer.send('decrypt-block', index, password);
}

// listener for decryption results 
ipcRenderer.on('decryption-result', (event, result) => {
    const decrypted = document.getElementById('decrypted-data');
    if (result.error) {
        decrypted.innerHTML = `<span style="color: red;">Error: ${result.error}</span>`;
    } else {
        decrypted.innerHTML = `<span style="color: green;">Decrypted Data: ${result.data}</span>`;
    }
});
    

// Modify an existing block 
function modifyBlock() {
    const index = parseInt(document.getElementById('block-index').value, 10);
    const newData = document.getElementById('new-data').value;
    const enteredKey = document.getElementById('secret-key').value;
    console.log("Modify block request:", index, newData, enteredKey);
    if (!index || !newData || !enteredKey) {
        alert("Please fill in all fields");
        return;
    }

    // Send to main for verification
    ipcRenderer.send('modify-block', index, newData, enteredKey);
    
    // Clear input fields
    document.getElementById('block-index').value = '';
    document.getElementById('new-data').value = '';
    document.getElementById('secret-key').value = '';
}
// Display error message
ipcRenderer.on('modify-error', (event, message) => {
    alert(message);
});

// Update blockchain 
ipcRenderer.on('blockchain-updated', (event, blockchain) => {
    displayBlockchain(blockchain);
});

// Validate blockchain
function validateBlockchain() {
    ipcRenderer.send('validate-chain');
}
// Display validation result
ipcRenderer.on('validation-result', (event, isValid) => {
    const resultDiv = document.getElementById('validation-result');
    resultDiv.innerHTML = isValid ? '<span style="color: green;">Blockchain is valid.</span>' : '<span style="color: red;">Blockchain is invalid!</span>';
});
