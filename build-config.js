const fs = require('fs');
const path = require('path');

// Default configuration if person doesnt create .env file 
const defaultConfig = {
    Secret_Key: 'default-secret-key-change-when-downloaded!'
};

// Read from .env if it is present
try {
    if (fs.existsSync('.env')) {
        const envConfig = require('dotenv').parse(fs.readFileSync('.env'));
        Object.assign(defaultConfig, envConfig);
    }
} catch (err) {
    console.log('No .env file found, using default configuration');
}

// Write configuration
fs.writeFileSync(
    path.join(__dirname, 'config.json'),
    JSON.stringify(defaultConfig, null, 2)
);