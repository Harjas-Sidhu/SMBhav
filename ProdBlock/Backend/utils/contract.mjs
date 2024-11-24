// contract.js
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "packageId",
				type: "uint256",
			},
			{
				indexed: true,
				internalType: "address",
				name: "authority",
				type: "address",
			},
			{
				indexed: false,
				internalType: "string",
				name: "process",
				type: "string",
			},
		],
		name: "PackageScanned",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "packageId",
				type: "uint256",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newResponsible",
				type: "address",
			},
		],
		name: "ResponsiblePartyUpdated",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "authorities",
		outputs: [
			{
				internalType: "address",
				name: "authorityAddress",
				type: "address",
			},
			{
				internalType: "string",
				name: "name",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "authorityAddress",
				type: "address",
			},
		],
		name: "getAuthorityDetails",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "authorityAddress",
						type: "address",
					},
					{
						internalType: "string",
						name: "name",
						type: "string",
					},
				],
				internalType: "struct PackageTracking.Authority",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "packageId",
				type: "uint256",
			},
		],
		name: "getPackageDetails",
		outputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "id",
						type: "uint256",
					},
					{
						internalType: "string[]",
						name: "processes",
						type: "string[]",
					},
					{
						internalType: "address",
						name: "currentResponsible",
						type: "address",
					},
					{
						internalType: "bool",
						name: "scanned",
						type: "bool",
					},
				],
				internalType: "struct PackageTracking.Package",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "packages",
		outputs: [
			{
				internalType: "uint256",
				name: "id",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "currentResponsible",
				type: "address",
			},
			{
				internalType: "bool",
				name: "scanned",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "authorityAddress",
				type: "address",
			},
			{
				internalType: "string",
				name: "name",
				type: "string",
			},
		],
		name: "registerAuthority",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "packageId",
				type: "uint256",
			},
		],
		name: "registerPackage",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "packageId",
				type: "uint256",
			},
			{
				internalType: "string",
				name: "process",
				type: "string",
			},
		],
		name: "scanPackage",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "scannedPackages",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalPackages",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "packageId",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "newResponsible",
				type: "address",
			},
		],
		name: "updateResponsibleParty",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

export default contract;

