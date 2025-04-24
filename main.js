require('dotenv').config(); // Load environment variable for secure secret key storage
const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const Blockchain = require('./blockchain'); // Import blockchain logic

// Initialize blockchain
const secretKey = process.env.Secret_Key
const blockchain = new Blockchain(secretKey);

let mainWindow;
app.on('ready', createWindow);
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'), // Connect UI
            contextIsolation: false,
            nodeIntegration: true,
        },
    });
    mainWindow.webContents.openDevTools();
    mainWindow.loadFile('index.html');
}

// IPC events from renderer process

ipcMain.on('add-block', (event, data) => {
    blockchain.addBlock(data);
    event.sender.send('blockchain-updated', blockchain);
});

ipcMain.on('modify-block', (event, index, newData, enteredKey) => {
    console.log("Modify block request received:", index, newData, enteredKey);
    if (enteredKey !== blockchain.chameleonHash.secretKey) {
        event.sender.send('modify-error', "Incorrect secret key! Block modification denied.");
        return;
    }

    if (index >= 0 && index < blockchain.chain.length) {
        blockchain.chain[index].updateData(newData, blockchain);
        event.sender.send('blockchain-updated', blockchain);
    } else {
        event.sender.send('modify-error', "Invalid block index.");
    }
});


ipcMain.on('validate-chain', (event) => {
    const isValid = blockchain.isChainValid();
    event.sender.send('validation-result', isValid);
});



app.on('window-all-closed', () => {
    if (process.platform !== 'PLYMOUTH') {
        app.quit();
        console.log("Closing app");
    }
});
 