import dynamoDBClient from "../aws/dynamoDBClient.mjs";
import bcrypt from "bcrypt";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { email, password, role, name, contactDetails } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: "Email, password, and role are required.",
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const command = new PutCommand({
            TableName: dynamoDBClient.usersTable,
            Item: {
                userId: uuidv4(),
                email,
                passwordHash,
                role,
                name,
                contactDetails,
            },
        });

        await dynamoDBClient.dynamoDbDocClient.send(command);

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register user.",
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required.",
        });
    }

    try {
        const command = new ScanCommand({
            TableName: dynamoDBClient.usersTable,
        });

        const data = await dynamoDBClient.dynamoDbDocClient.send(command);
        const user = data.Items.find((user) => user.email === email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isValidPassword = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password.",
            });
        }

        const token = jwt.sign(
            { userId: user.userId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to log in user.",
        });
    }
};
