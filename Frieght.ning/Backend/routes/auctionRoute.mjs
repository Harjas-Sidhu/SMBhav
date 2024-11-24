import express from "express";
import {
    startAuction,
    placeBid,
    getAuctions,
} from "../controllers/auctionController.mjs";

const router = express.Router();

router.post("/start", startAuction);
router.post("/bid", placeBid);
router.get("/", getAuctions);

export default router;

