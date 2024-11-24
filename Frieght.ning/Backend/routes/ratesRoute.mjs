import express from "express";
import { addRate, getRates, getRatesForShipment } from "../controllers/ratesController.mjs";
import { authenticateUser, authorizeRole } from "../middlewares/authMiddleware.mjs";
const router = express.Router();

router.post("/add", authenticateUser, authorizeRole("carrier"), addRate);
router.get("/", getRates);
router.get("/shipment/:shipmentId", getRatesForShipment);

export default router;
