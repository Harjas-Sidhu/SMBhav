import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";

dotenv.config();

class DynamoDBClientClass {
    constructor() {
        this.client = new DynamoDBClient({
            region: process.env.AWS_REGION,
            credentials: fromEnv(),
        });
        this.dynamoDbDocClient = DynamoDBDocumentClient.from(this.client);
        this.carriersTable = "carriersTable";
        this.auctionTable = "auctionTable";
        this.ratesTable = "ratesTable";
        this.shipmentTable = "shipmentTable";
        this.usersTable = "usersTable";
    }
}

const dynamoDBClient = new DynamoDBClientClass();
export default dynamoDBClient;
