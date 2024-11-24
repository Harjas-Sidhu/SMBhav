import dynamoDBClient from "../aws/dynamoDBClient.mjs";
import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const startAuction = async (req, res) => {
    const { auctionId, shipmentId, startTime, endTime, bids = [] } = req.body;

    if (!auctionId || !shipmentId || !startTime || !endTime) {
        return res.status(400).json({
            success: false,
            message: "Required fields are missing.",
        });
    }

    try {
        const command = new PutCommand({
            TableName: dynamoDBClient.auctionTable,
            Item: { auctionId, shipmentId, startTime, endTime, bids },
        });

        await dynamoDBClient.dynamoDbDocClient.send(command);

        res.status(201).json({
            success: true,
            message: "Auction started successfully.",
        });
    } catch (error) {
        console.error("Error starting auction:", error);
        res.status(500).json({
            success: false,
            message: "Failed to start auction.",
        });
    }
};

export const placeBid = async (req, res) => {
    const { auctionId, carrierId, bidAmount } = req.body;

    if (!auctionId || !carrierId || !bidAmount) {
        return res.status(400).json({
            success: false,
            message: "Required fields are missing.",
        });
    }

    try {
        const command = new UpdateCommand({
            TableName: dynamoDBClient.auctionTable,
            Key: { auctionId },
            UpdateExpression:
                "SET bids = list_append(if_not_exists(bids, :emptyList), :bid)",
            ExpressionAttributeValues: {
                ":emptyList": [],
                ":bid": [
                    {
                        carrierId,
                        bidAmount,
                        timestamp: new Date().toISOString(),
                    },
                ],
            },
        });

        await dynamoDBClient.dynamoDbDocClient.send(command);

        res.status(200).json({
            success: true,
            message: "Bid placed successfully.",
        });
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(500).json({
            success: false,
            message: "Failed to place bid.",
        });
    }
};

export const getAuctions = async (req, res) => {
    const { status } = req.query;

    try {
        const command = new ScanCommand({
            TableName: dynamoDBClient.auctionTable,
        });

        const data = await dynamoDBClient.dynamoDbDocClient.send(command);

        let auctions = data.Items;

        if (status)
            auctions = auctions.filter((auction) => auction.status === status);

        res.status(200).json({
            success: true,
            auctions,
        });
    } catch (error) {
        console.error("Error fetching auctions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch auctions.",
        });
    }
};
