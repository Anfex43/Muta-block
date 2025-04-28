# disclamer
This is the repository for Muta-block a final year cyber-security project by Bradley Wilson

Project title: Blockchain and It’s compliance with GDPR, how do we improve it?

project vision: My vision for this project is to create a blockchain based system built in JavaScript that will allow users, either commercial or personal, to remove their data based on special conditions. This is in an attempt to bring traditional blockchain closer to compliance with GDPR and specifically data deletion requirements. The name for the product is currently Muta-Block. However, this is subject to change. As stated above this blockchain product intends to bring traditional blockchain systems inline with GPDR and cyber security focused regulations as a whole. At the end of this project if everything goes well I hope to have a comprehensive system that can be deployed for use. 

Supervisor: Bogdan Ghita


![MutaBlock Logo](MutablockLogo.png)

## Overview
MutaBlock aims to bridge the gap between traditional blockchain immutability and GDPR compliance, specifically addressing data deletion requirements through innovative cryptographic techniques.

## Features
- Optional data encryption and decryption
-  Authorized modifications  
- Chain validation
- GDPR article 17 compliance



### Prerequisites
- Node.js (v22.9.0)
- npm (v10.8.3)  
- Windows (untested on MacOS/Linux due to device limitations) 

### Installation
1. **Clone the repository to your device** 
```powershell
git clone https://github.com/Anfex43/Muta-block.git
```
2. **Change to cloned directory**
```powershell 
cd Muta-block
```
3. **Install dependencies** 
```powershell 
npm install
```
4. **Create and configure .env in the root directory**
```
Secret_key="your_key_here"
```
5. **Run the program**
```
You have two options here. 

Start the program using npm start

or 

Create an .exe with npm run build 
navigate to exe and run.
```



### dependencies
- dotenv: (v16.5.0+)
- electron: (v25.9.8+)
- electron-packager: (v17.1.2) (required if you wish to create an .exe)


