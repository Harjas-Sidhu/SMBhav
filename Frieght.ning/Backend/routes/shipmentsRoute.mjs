import express from "express";
import {
    addShipment,
    getShipments,
    updateShipmentStatus,
    getShipmentHistory,
} from "../controllers/shipmentsController.mjs";
import { authenticateUser, authorizeRole } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

router.post("/add", authenticateUser, authorizeRole("company"), addShipment);
router.get("/", getShipments);
router.patch("/update-status", updateShipmentStatus);
router.get("/:shipmentId/history", getShipmentHistory);

export default router;

