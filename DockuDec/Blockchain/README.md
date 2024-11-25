# DockuDec Blockchain

## Description
DockuDec Blockchain is a module designed to leverage blockchain technology for the purpose of verifying and securing document transactions. This system is implemented using Solidity, Hardhat, and several supporting libraries.

## Installation
To set up the DockuDec Blockchain project, please follow these instructions:

1. Clone the repository:
   ```bash
   git clone git@github.com:Harjas-Sidhu/SMBhav.git

   cd SMBhav/docku-deck/blockchain

   ```

2. Install the necessary dependencies using npm:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables as specified in `.env.example`.

## Usage
### Compiling the Smart Contracts
To compile the smart contracts, run:
```bash
npx hardhat compile
```

### Deployment
To deploy the smart contracts to the blockchain, run:
```bash
npx hardhat run scripts/DocumentRegistry.js --network <network-name>
```
Replace `<network-name>` with the appropriate network, such as `localhost` for local deployment or `mumbai` for testnet deployment.

### Testing
To run the tests for the smart contracts, use:
```bash
npx hardhat test
```

### Interacting with Contracts
You can interact with the deployed contracts using the Hardhat console:
```bash
npx hardhat console --network <network-name>
```
Replace `<network-name>` with the appropriate network, such as `localhost` for local deployment or `mumbai` for testnet deployment.

## Available Scripts
- `compile`: Compiles the smart contracts.
- `deploy`: Deploys the smart contracts.
- `test`: Runs the contract tests.
- `clean`: Cleans the cache and artifact folders.

### Commit Changes (Optional)
If you make any changes and want to push them to the repository, follow these steps:
bash
```bash 
git add .
git commit -m "Your commit message"
git push origin main
```