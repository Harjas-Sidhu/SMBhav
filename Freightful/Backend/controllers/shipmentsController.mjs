import dynamoDBClient from "../aws/dynamoDBClient.mjs";
import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const addShipment = async (req, res) => {
    const { shipmentId, origin, destination, weight, dimensions, status } =
        req.body;

    if (!shipmentId || !origin || !destination || !weight) {
        return res.status(400).json({
            success: false,
            message: "Required fields are missing.",
        });
    }

    try {
        const command = new PutCommand({
            TableName: dynamoDBClient.shipmentTable,
            Item: {
                shipmentId,
                origin,
                destination,
                weight,
                dimensions,
                status,
            },
        });

        await dynamoDBClient.dynamoDbDocClient.send(command);

        res.status(201).json({
            success: true,
            message: "Shipment added successfully.",
        });
    } catch (error) {
        console.error("Error adding shipment:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add shipment.",
        });
    }
};

export const getShipments = async (req, res) => {
    try {
        const command = new ScanCommand({
            TableName: dynamoDBClient.shipmentTable,
        });

        const data = await dynamoDBClient.dynamoDbDocClient.send(command);

        res.status(200).json({
            success: true,
            shipments: [...data.Items],
        });
    } catch (error) {
        console.error("Error fetching shipments:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch shipments.",
        });
    }
};

export const updateShipmentStatus = async (req, res) => {
    const { shipmentId, status } = req.body;

    if (!shipmentId || !status) {
        return res.status(400).json({
            success: false,
            message: "Shipment ID and status are required.",
        });
    }

    try {
        const command = new UpdateCommand({
            TableName: dynamoDBClient.shipmentTable,
            Key: { shipmentId },
            UpdateExpression:
                "set #status = :status, #history = list_append(if_not_exists(#history, :emptyList), :newEntry)",
            ExpressionAttributeNames: {
                "#status": "status",
                "#history": "history",
            },
            ExpressionAttributeValues: {
                ":status": status,
                ":emptyList": [],
                ":newEntry": [{ status, timestamp: new Date().toISOString() }],
            },
        });

        await dynamoDBClient.dynamoDbDocClient.send(command);

        res.status(200).json({
            success: true,
            message: "Shipment status updated successfully.",
        });
    } catch (error) {
        console.error("Error updating shipment status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update shipment status.",
        });
    }
};

export const getShipmentHistory = async (req, res) => {
    const { shipmentId } = req.params;

    if (!shipmentId) {
        return res.status(400).json({
            success: false,
            message: "Shipment ID is required.",
        });
    }

    try {
        const command = new ScanCommand({
            TableName: dynamoDBClient.shipmentTable,
        });

        const data = await dynamoDBClient.dynamoDbDocClient.send(command);

        const shipment = data.Items.find(
            (item) => item.shipmentId === shipmentId
        );

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found.",
            });
        }

        res.status(200).json({
            success: true,
            history: shipment.history || [],
        });
    } catch (error) {
        console.error("Error fetching shipment history:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch shipment history.",
        });
    }
};
