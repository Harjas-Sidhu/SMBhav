import { fromEnv } from "@aws-sdk/credential-providers";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    DynamoDBDocument,
    GetCommand,
    PutCommand,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

dotenv.config();

class DynamoDbClient {
    constructor() {
        this.client = new DynamoDBClient({
            region: process.env.AWS_REGION,
            credentials: fromEnv(),
        });
        this.dynamoDBDocumentClient = DynamoDBDocument.from(this.client);
        this.tableName = process.env.DYNAMODB_TABLE_NAME;
    }

    /**
     * Save metadata to DynamoDB
     * @async
     * @param {Object} metadata - Metadata to save
     * @param {string} documentId - Document ID
     * @returns {Promise} - Promise object represents the result of the save operation
     * @memberof DynamoDbClient
     * @example
     *      const metadata = {
     *          title: "My Document",
     *      };
     *      const documentId = "123";
     *      dynamoDbClient.saveMetadata(metadata, documentId);
     */
    async saveMetadata(metadata, documentId, additionalParams = {}) {
        const params = {
            TableName: this.tableName,
            Item: {
                documentId: documentId,
                metadata: metadata,
                keywords: additionalParams.keywords || [],
                summary: additionalParams.summary || "",
                createdAt: new Date().toISOString(),
            },
        };
        return this.dynamoDBDocumentClient.send(new PutCommand(params));
    }

    /**
     * Get metadata from DynamoDB
     * @async
     * @param {string} documentId - Document ID
     * @returns {Promise} - Promise object represents the result of the get operation
     * @memberof DynamoDbClient
     * @example
     *      const documentId = "123";
     *      dynamoDbClient.getMetadata(documentId);
     */
    async getMetadata(documentId) {
        const params = {
            TableName: this.tableName,
            Key: {
                documentId: documentId,
            },
        };
        return this.dynamoDBDocumentClient.send(new GetCommand(params));
    }

    /**
     * Delete metadata from DynamoDB
     * @async
     * @param {string} documentId - Document ID
     * @returns {Promise} - Promise object represents the result of the delete operation
     * @memberof DynamoDbClient
     * @example
     *      const documentId = "123";
     *      dynamoDbClient.deleteMetadata(documentId);
     */
    async deleteMetadata(documentId) {
        const params = {
            TableName: this.tableName,
            Key: {
                documentId: documentId,
            },
        };
        return this.dynamoDBDocumentClient.send(new DeleteCommand(params));
    }

    /**
     * Scan metadata from DynamoDB
     * @async
     * @returns {Promise} - Promise object represents the result of the scan operation
     * @memberof DynamoDbClient
     * @example
     *      dynamoDbClient.scanMetadata();
     */
    async scanMetadata() {
        const params = {
            TableName: this.tableName,
        };
        return this.dynamoDBDocumentClient.send(new ScanCommand(params));
    }

    /**
     * Update metadata in DynamoDB
     * @async
     * @param {string} documentId - Document ID
     * @param {Object} metadata - Metadata to update
     * @returns {Promise} - Promise object represents the result of the update operation
     * @memberof DynamoDbClient
     * @example
     *      const documentId = "123";
     *      const metadata = {
     *          title: "My Updated Document",
     *      };
     *      dynamoDbClient.updateMetadata(documentId, metadata);
     */
    async updateMetadata(documentId, metadata) {
        const params = {
            TableName: this.tableName,
            Key: {
                documentId: documentId,
            },
            UpdateExpression: "set metadata = :m",
            ExpressionAttributeValues: {
                ":m": metadata,
            },
        };
        return this.dynamoDBDocumentClient.send(new PutCommand(params));
    }

    /**
     * Delete all metadata from DynamoDB
     * @async
     * @returns {Promise} - Promise object represents the result of the delete operation
     * @memberof DynamoDbClient
     * @example
     *      dynamoDbClient.deleteAllMetadata();
     */
    async deleteAllMetadata() {
        const metadata = await this.scanMetadata();
        const deletePromises = metadata.Items.map((item) =>
            this.deleteMetadata(item.documentId)
        );
        return Promise.all(deletePromises);
    }
}

export default new DynamoDbClient();
