import fs from "fs";
import elasticClient from "../elastic/elasticClient.mjs";
import { processFileWithTika } from "../tika/processFile.mjs";
import dynanoDBClient from "../aws/dynanoDBClient.mjs";
import { analyzeDocument } from "../nlp/nlpProcessor.mjs";
import s3Client from "../aws/s3Client.mjs";
import e from "cors";

export const fileUpload = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        const { content, metadata } = await processFileWithTika(file.path);

        if (typeof metadata !== 'object' || metadata === null) {
            throw new Error("Invalid metadata format");
        }
        
        const { summary, keywords, embedding } = await analyzeDocument(content);

        const document = {
            fileName: file.originalname,
            content: content.trim(),
            metadata: metadata,
            summary: summary.summary_text,
            keywords: keywords.join(", "),
            uploadDate: new Date(),
        };

        const esResponse = await elasticClient.indexDocument(
            "documents",
            document
        );

        const additionalParams = {
            summary,
            keywords,
        };

        s3Client.uploadFile(
            esResponse._id + ".json",
            JSON.stringify(embedding.data)
        );

        await dynanoDBClient.saveMetadata(
            metadata,
            esResponse._id,
            additionalParams
        );

        fs.unlinkSync(file.path);

        res.status(200).send({
            message: "File uploaded and processed successfully.",
            documentId: esResponse._id,
        });
    } catch (err) {
        console.error("File upload failed:", err);
        res.status(500).send("Failed to process the file.");
    }
};
