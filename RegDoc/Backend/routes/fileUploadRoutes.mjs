import { Router } from "express";
import { fileUpload } from "../controllers/fileUploadController.mjs";
import multer from "multer";
import path from "path";

const router = Router();
const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "./uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), fileUpload);

export default router;

