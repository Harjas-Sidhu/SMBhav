import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Import routes
import carriersRoutes from "./routes/carriersRoute.mjs";
import ratesRoutes from "./routes/ratesRoute.mjs";
import auctionRoutes from "./routes/auctionRoute.mjs";
import shipmentsRoutes from "./routes/shipmentsRoute.mjs";
import userRoutes from "./routes/userRoute.mjs";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/carriers", carriersRoutes);
app.use("/rates", ratesRoutes);
app.use("/auction", auctionRoutes);
app.use("/shipments", shipmentsRoutes);
app.use("/auth", userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
