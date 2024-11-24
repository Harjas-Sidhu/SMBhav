import dynamoDBClient from "../aws/dynamoDBClient.mjs";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export const addRate = async (req, res) => {
    const { rateId, carrierId, price, transitTime, shipmentId, conditions } =
        req.body;

    if (!rateId || !carrierId || !price || !transitTime) {
        return res.status(400).json({
            success: false,
            message: "Required fields are missing.",
        });
    }

    try {
        const command = new PutCommand({
            TableName: dynamoDBClient.ratesTable,
            Item: {
                rateId,
                carrierId,
                price,
                transitTime,
                shipmentId,
                conditions,
            },
        });

        await dynamoDBClient.dynamoDbDocClient.send(command);

        res.status(201).json({
            success: true,
            message: "Rate added successfully.",
        });
    } catch (error) {
        console.error("Error adding rate:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add rate.",
        });
    }
};

export const getRates = async (req, res) => {
    const { minPrice, maxPrice, maxTransitTime, carrierId } = req.query;

    try {
        const command = new ScanCommand({
            TableName: dynamoDBClient.ratesTable,
        });

        const data = await dynamoDBClient.dynamoDbDocClient.send(command);

        let rates = data.Items;

        if (minPrice)
            rates = rates.filter((rate) => rate.price >= parseFloat(minPrice));
        if (maxPrice)
            rates = rates.filter((rate) => rate.price <= parseFloat(maxPrice));
        if (maxTransitTime)
            rates = rates.filter(
                (rate) => rate.transitTime <= parseFloat(maxTransitTime)
            );
        if (carrierId)
            rates = rates.filter((rate) => rate.carrierId === carrierId);

        res.status(200).json({
            success: true,
            rates,
        });
    } catch (error) {
        console.error("Error fetching rates:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch rates.",
        });
    }
};

export const getRatesForShipment = async (req, res) => {
    const { shipmentId } = req.params;

    if (!shipmentId) {
        return res.status(400).json({
            success: false,
            message: "Shipment ID is required.",
        });
    }

    try {
        const command = new ScanCommand({
            TableName: dynamoDBClient.ratesTable,
        });

        const data = await dynamoDBClient.dynamoDbDocClient.send(command);

        const shipmentRates = data.Items.filter(
            (rate) => rate.shipmentId === shipmentId
        );

        res.status(200).json({
            success: true,
            rates: shipmentRates,
        });
    } catch (error) {
        console.error("Error fetching rates for shipment:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch rates for shipment.",
        });
    }
};
