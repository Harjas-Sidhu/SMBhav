import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import elasticClient from "./elastic/elasticClient.mjs";
import DynamoDBClient from "./aws/dynanoDBClient.mjs";

// routes
import fileUploadRoutes from "./routes/fileUploadRoutes.mjs";
import searchRoutes from "./routes/searchRoutes.mjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", fileUploadRoutes);
app.use("/files", searchRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
