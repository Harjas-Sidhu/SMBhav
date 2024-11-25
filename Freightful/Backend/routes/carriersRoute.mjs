import express from "express";
import {
    registerCarrier,
    getCarriers,
} from "../controllers/carriersController.mjs";
import { authenticateUser, authorizeRole } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

router.post("/register", authenticateUser, authorizeRole("carrier"), registerCarrier);
router.get("/", getCarriers);

export default router;
