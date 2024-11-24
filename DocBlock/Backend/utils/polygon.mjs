import dotenv from "dotenv";
import * as ethers from "ethers";

dotenv.config();

const contractABI = [
    {
        inputs: [{ internalType: "string", name: "", type: "string" }],
        name: "hashToTimestamp",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "string", name: "hash", type: "string" }],
        name: "storeHash",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "string", name: "hash", type: "string" }],
        name: "verifyHash",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];

class Blockchain {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        this.contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            contractABI,
            this.wallet
        );
    }

    /**
     * Stores the given hash in the blockchain.
     * @param {String} hash Hash to store in the blockchain.
     * @returns {Promise<void>}
     * @example
     *      await blockchain.storeHash("0x1234567890abcdef");
     */
    async storeHash(hash) {
        const tx = await this.contract.storeHash(hash);
        await tx.wait();
    }

    /**
     * Verifies the given hash in the blockchain.
     * @param {String} hash Hash to verify in the blockchain.
     * @returns {Promise<Number>} Timestamp when the hash was stored.
     * @example
     *      const timestamp = await blockchain.verifyHash("0x1234567890abcdef");
     * @note If the hash is not found, the timestamp will be 0.
     */
    async verifyHash(hash) {
        return await this.contract.verifyHash(hash);
    }
}

const blockchain = new Blockchain();
export default blockchain;
