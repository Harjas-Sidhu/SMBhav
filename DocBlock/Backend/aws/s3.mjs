import dotenv from "dotenv";
import { fromEnv } from "@aws-sdk/credential-providers";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

class S3ClientClass {
    constructor() {
        this.client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: fromEnv(),
        });
        this.bucketName = process.env.AWS_S3_BUCKET;
    }

    /**
     * Uploads a file to the S3 bucket.
     * @param {String} key - The key (file name) to store the object under.
     * @param {Buffer} body - The file content as a buffer.
     * @param {String} contentType - The MIME type of the file.
     * @returns {Promise} Promise that resolves when the file is uploaded.
     * @example
     *      s3Client.uploadFile("file.txt", Buffer.from("content"), "text/plain").then(() => {
     *          console.log("File uploaded successfully.");
     *      });
     */
    async uploadFile(key, body, contentType) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
        };

        const command = new PutObjectCommand(params);
        return this.client.send(command);
    }

    /**
     * Downloads a file from the S3 bucket.
     * @param {String} key - The key (file name) of the object to retrieve.
     * @returns {Promise<Buffer>} Promise that resolves to the file's content as a buffer.
     * @example
     *      s3Client.downloadFile("file.txt").then(data => {
     *          console.log("File content:", data.toString());
     *      });
     */
    async downloadFile(key) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };

        const command = new GetObjectCommand(params);
        const { Body } = await this.client.send(command);
        return Body.transformToByteArray();
    }
}

const s3Client = new S3ClientClass();
export default s3Client;
