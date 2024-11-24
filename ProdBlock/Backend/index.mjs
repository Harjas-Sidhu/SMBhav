import bodyParser from "body-parser";
import contract from "./utils/contract.mjs";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";
import express from "express";
import { generateQRCode } from "./utils/qr.mjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/qrcodes", express.static("qrcodes"));

app.post("/generate", (req, res) => {
	const { packageId } = req.body;

	if (!packageId) {
		return res.status(400).json({
			success: false,
			message: "Package ID is required",
		});
	}

	try {
		const qrPath = `qrcodes/${packageId}.png`;
		generateQRCode(packageId, qrPath);

		res.json({
			success: true,
			message: "QR code generated successfully!",
		});
	} catch (error) {
		console.error("Error generating QR code:", error);
		res.status(500).json({
			success: false,
			message: "Failed to generate QR code",
		});
	}
});

app.post("/register-package", async (req, res) => {
	const { packageId } = req.body;

	if (!packageId) {
		return res.status(400).json({
			success: false,
			message: "Package ID is required",
		});
	}

	try {
		const tx = await contract.registerPackage(packageId);
		await tx.wait();

		res.json({
			success: true,
			message: `Package ${packageId} registered successfully`,
		});
	} catch (error) {
		console.error("Error registering package:", error);
		res.status(500).json({
			success: false,
			message: "Failed to register package",
		});
	}
});

app.post("/register-authority", async (req, res) => {
	const { authorityAddress, name } = req.body;

	if (!ethers.isAddress(authorityAddress)) {
		return res.status(400).json({ error: "Invalid authority address" });
	}

	try {
		const tx = await contract.registerAuthority(authorityAddress, name);
		const receipt = await tx.wait();
		res.status(200).json({
			success: true,
			txHash: receipt.transactionHash,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

app.post("/scan-package", async (req, res) => {
	const { packageId, process } = req.body;

	if (!packageId || !process) {
		return res.status(400).json({
			success: false,
			message: "Package ID and process are required",
		});
	}

	try {
		const tx = await contract.scanPackage(packageId, process);
		await tx.wait();

		res.json({
			success: true,
			message: `Package ${packageId} scanned successfully with process: ${process}`,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.info.error.message,
		});
	}
});

app.post("/update-responsible", async (req, res) => {
	const { packageId, newResponsible } = req.body;

	if (!packageId || !newResponsible) {
		return res.status(400).json({
			success: false,
			message: "Package ID and new responsible party are required",
		});
	}

	try {
		const tx = await contract.updateResponsibleParty(
			packageId,
			newResponsible
		);
		await tx.wait();

		res.json({
			success: true,
			message: `Responsible party for package ${packageId} updated successfully`,
		});
	} catch (error) {
		console.error("Error updating responsible party:", error);
		res.status(500).json({
			success: false,
			message: "Failed to update responsible party",
		});
	}
});

app.get("/package-details/:packageId", async (req, res) => {
	const { packageId } = req.params;

	if (!packageId) {
		return res.status(400).json({
			success: false,
			message: "Package ID is required",
		});
	}

	try {
		const packageData = await contract.getPackageDetails(packageId);

		if (!packageData) {
			return res.status(404).json({
				success: false,
				message: "Package not found",
			});
		}

		const serializedPackageData = {
			id: Number(packageData.id),
			processes: packageData.processes,
			currentResponsible: packageData.currentResponsible,
			scanned: packageData.scanned,
		};

		res.status(200).json({
			success: true,
			package: serializedPackageData,
		});
	} catch (error) {
		console.error("Error fetching package details:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch package details",
		});
	}
});

app.post("/authority-details", async (req, res) => {
	const { authorityAddress } = req.body;

	if (!ethers.isAddress(authorityAddress)) {
		return res.status(400).json({
			success: false,
			message: "Invalid authority address",
		});
	}

	try {
		const authorityData = await contract.getAuthorityDetails(
			authorityAddress
		);

		if (!authorityData) {
			return res.status(404).json({
				success: false,
				message: "Authority not found",
			});
		}

		const serializedAuthorityData = {
			address: authorityData.address,
			name: authorityData.name,
		};

		res.status(200).json({
			success: true,
			authority: serializedAuthorityData,
		});
	} catch (error) {
		console.error("Error fetching authority details:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch authority details",
		});
	}
});

app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

