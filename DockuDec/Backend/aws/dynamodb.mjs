import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    ScanCommand
} from "@aws-sdk/lib-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";

dotenv.config();

class DynamoDBClientClass {
    constructor() {
        this.client = new DynamoDBClient({
            region: process.env.AWS_REGION,
            credentials: fromEnv(),
        });
        this.dynamoDbDocClient = DynamoDBDocumentClient.from(this.client);
        this.tableName = "thetaTable";
    }

    /**
     * Inserts data into the DynamoDB table.
     * @param {String} hash - Hash of the file.
     * @param {String} fileName - Name of the file.
     * @returns {Promise} Promise that resolves when the data is inserted.
     * @example
     *      dynamoDBClient.insertData("hash", "fileName").then(() => {
     *         console.log("Data inserted successfully.");
     *      });
     */
    async insertData(hash, fileName) {
        const timestamp = new Date().toISOString();
        const params = {
            TableName: this.tableName,
            Item: {
                hash,
                fileName,
                timestamp,
            },
        };

        return this.dynamoDbDocClient.send(new PutCommand(params));
    }

    /**
     * Retrieves data from the DynamoDB table by hash.
     * @async
     * @param {String} hash - The hash to query.
     * @returns {Promise} Promise that resolves to the retrieved data.
     * @example
     *      dynamoDBClient.getData("hash").then(data => {
     *         console.log("Retrieved data:", data);
     *      });
     */
    async getData(hash) {
        const params = {
            TableName: this.tableName,
            Key: { hash },
        };

        const result = await this.dynamoDbDocClient.send(
            new GetCommand(params)
        );
        return result.Item;
    }

    /**
     * Retrieves all data from the DynamoDB table.
     * @async
     * @returns {Promise} Promise that resolves to the retrieved data.
     * @example
     *      dynamoDBClient.scanTable().then(data => {
     *         console.log("Retrieved data:", data);
     *      });
     */
    async scanTable() {
        const params = {
            TableName: this.tableName,
        };

        return this.dynamoDbDocClient.send(new ScanCommand(params));
    }
}

const dynamoDBClient = new DynamoDBClientClass();
export default dynamoDBClient;
