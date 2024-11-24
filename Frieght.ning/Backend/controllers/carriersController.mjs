import dynamoDBClient from "../aws/dynamoDBClient.mjs";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export const registerCarrier = async (req, res) => {
    const { carrierId, name, contactDetails, rating } = req.body;

    if (!carrierId || !name) {
        return res.status(400).json({
            success: false,
            message: "Carrier ID and name are required.",
        });
    }

    try {
        const command = new PutCommand({
            TableName: dynamoDBClient.carriersTable,
            Item: { carrierId, name, contactDetails, rating },
        });

        await dynamoDBClient.dynamoDbDocClient.send(command);

        res.status(201).json({
            success: true,
            message: "Carrier registered successfully.",
        });
    } catch (error) {
        console.error("Error registering carrier:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register carrier.",
        });
    }
};

export const getCarriers = async (req, res) => {
    try {
        const command = new ScanCommand({
            TableName: dynamoDBClient.carriersTable,
        });

        const data = await dynamoDBClient.dynamoDbDocClient.send(command);

        res.status(200).json({
            success: true,
            carriers: [...data.Items],
        });
    } catch (error) {
        console.error("Error fetching carriers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch carriers.",
        });
    }
};
