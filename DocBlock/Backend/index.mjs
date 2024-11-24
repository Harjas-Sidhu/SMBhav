import blockchain from "./utils/polygon.mjs";
import cors from "cors";
import dotenv from "dotenv";
import dynamoDBClient from "./aws/dynamodb.mjs";
import express from "express";
import fileUpload from "express-fileupload";
import generateHash from "./utils/hash.mjs";
import mime from "mime-types";
import s3Client from "./aws/s3.mjs";

dotenv.config();
const app = express();
app.use(
    cors({
        origin: "*", // Update this with specific allowed origins if needed
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"], // Add required headers
        exposedHeaders: ["Content-Disposition"], // For file downloads
    })
);

app.use(
    fileUpload({
        limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max file(s) size
        abortOnLimit: true,
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// POST /upload
app.post("/upload", async (req, res) => {
    if (!req.files) {
        return res
            .status(400)
            .json({ success: false, message: "No files were uploaded." });
    }

    try {
        const file = req.files.file;
        const fileName = file.name;
        const hash = generateHash(file.data);

        await dynamoDBClient.scanTable().then((data) => {
            for (const item of data.Items) {
                if (item.hash.S === hash) {
                    return res.status(409).json({
                        success: false,
                        message: "File already exists.",
                    });
                }
            }
        });

        await blockchain.storeHash(hash);
        await s3Client.uploadFile(fileName, file.data, file.mimetype);
        await dynamoDBClient.insertData(hash, fileName);

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully.",
            timestamp: new Date().toUTCString(), // Or any relevant timestamp you want to send
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to upload file." });
    }
});

// POST /verify
app.post("/verify", async (req, res) => {
    if (!req.files) {
        return res
            .status(400)
            .json({ success: false, message: "No files were uploaded." });
    }

    try {
        const file = req.files.file;
        const hash = generateHash(file.data);

        const timestamp = await blockchain.verifyHash(hash);
        if (!timestamp) {
            return res
                .status(404)
                .json({ success: false, message: "File not found." });
        } else {
            return res.status(200).json({
                success: true,
                message: "File found.",
                timestamp: new Date(Number(timestamp) * 1000).toUTCString(),
            });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to verify file." });
    }
});

// GET /getAllFiles
app.get("/getAllFiles", async (req, res) => {
    try {
        const files = [];
        await dynamoDBClient.scanTable().then((data) => {
            for (const item of data.Items) {
                files.push({
                    timestamp: item.timestamp,
                    fileName: item.fileName,
                    link: `${
                        req.protocol + "://" + req.get("host") + "/getFile"
                    }/${item.fileName}`,
                });
            }
        });

        return res.status(200).json({
            success: true,
            message: "Files retrieved successfully.",
            files: files,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to get files." });
    }
});

// GET /getFile/:fileName
app.get("/getFile/:fileName", async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const file = await s3Client.downloadFile(fileName);

        if (file !== null) {
            const mimeType =
                mime.lookup(fileName) || "application/octet-stream";

            res.setHeader("Content-Type", mimeType);
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${fileName}"`
            );

            return res.status(200).json({
                success: true,
                message: "File retrieved successfully.",
                file: file,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get file.",
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
