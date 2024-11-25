# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

## Getting Started

1. **Clone the Repository:**
   ```shell
   git clone <repository-url>
   ```

2. **Navigate to the Project Directory:**
   ```shell
   cd <repository-directory>/Blockchain
   ```

3. **Install Dependencies:**
   ```shell
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables to the `.env` file:
     ```plaintext
     PRIVATE_KEY=<your-private-key>
     POLYGON_MUMBAI_RPC_URL=<testnet-polygon-rpc>
     POLYGONSCAN_API_KEY=<polyscan-api>
     ```
   - You can get these values from your Ethereum wallet provider and Infura account.

5. **Run the Local Ethereum Network:**
   ```shell
   npx hardhat node
   ```

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
