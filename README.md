# ConsenSys-Project
ConsenSys Final Project for Rene Rosser

## Folder Structure
### Decentragram
* chaindata
* migrations
    * 1_inital_migration.js
    * 2_deploy_contracts.js
* node_modules
* public 
    * favicon.ico
    * index.html
    * manifest.json
* src
    * abis
        * Decentragram.json
        * Migrations.json
    * components
        * App.css
        * App.js
        * Main.js
        * Navbar.js
    * contracts
        * Decentragram.sol
        * Migrations.sol
* test
    * test.js
* .babelrc
* .gitignore
* package-lock.json
* package.json
* truffle-config.js

## Building the Project Locally
1. Clone repo: `git clone https://github.com/renerosser/ConsenSys-Project`
2. Enter code directory `cd ConsenSys-Project` 
3. Install dependencies `npm install`
4. Start Ganache CLI `ganache-cli`
5. Start Geth `geth --dev`
6. Start React `npm run start`
