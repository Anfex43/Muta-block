const { ipcRenderer } = require('electron');



//const SECRET_KEY = "TESTKEY"; // Ensure users know this but keep it private!

// Display blockchain
function displayBlockchain(blockchain) {
    const blockchainView = document.getElementById('blockchain-view');
    blockchainView.innerHTML = blockchain.chain
        .map(
            (block, index) => `
        <div class="block">
            <h4>Block ${index}</h4>
            <p><b>Data:</b> ${block.data}</p>
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
    ipcRenderer.send('add-block', data);
    document.getElementById('block-data').value = '';
}

// Modify an existing block with local secret key validation
function modifyBlock() {
    const index = parseInt(document.getElementById('block-index').value, 10);
    const newData = document.getElementById('new-data').value;
    const enteredKey = document.getElementById('secret-key').value;
    console.log("Modify block request:", index, newData, enteredKey);
    if (!index || !newData || !enteredKey) {
        alert("Please fill in all fields");
        return;
    }

    // Send to main process for verification
    ipcRenderer.send('modify-block', index, newData, enteredKey);
    
    // Clear input fields
    document.getElementById('block-index').value = '';
    document.getElementById('new-data').value = '';
    document.getElementById('secret-key').value = '';
}


// Validate blockchain
function validateBlockchain() {
    ipcRenderer.send('validate-chain');
}

ipcRenderer.on('modify-error', (event, message) => {
    alert(message);
});

// Update blockchain 
ipcRenderer.on('blockchain-updated', (event, blockchain) => {
    displayBlockchain(blockchain);
});

// Display validation result
ipcRenderer.on('validation-result', (event, isValid) => {
    const resultDiv = document.getElementById('validation-result');
    resultDiv.innerHTML = isValid ? '<span style="color: green;">Blockchain is valid.</span>' : '<span style="color: red;">Blockchain is invalid!</span>';
});
