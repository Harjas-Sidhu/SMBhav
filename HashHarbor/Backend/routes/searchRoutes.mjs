import { Router } from "express";
import { search } from "../controllers/searchController.mjs";

const router = Router();

router.get("/search", search);

export default router;