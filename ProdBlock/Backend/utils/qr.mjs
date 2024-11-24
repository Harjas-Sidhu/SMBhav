import crypto from "crypto";
import qr from "qr-image";
import fs from "fs";

/**
 * Generates a unique hash for the given package data.
 * @param {string} data - Data related to the package (e.g., metadata, ID).
 * @returns {string} - SHA256 hash of the package data.
 */
function generateHash(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Generates a QR code for the given hash and saves it as an image.
 * @param {string} productId - ProductId to be converted into a QR code.
 * @param {string} outputPath - File path to save the QR code image.
 */
function generateQRCode(productId, outputPath) {
    const qrCode = qr.image(productId, { type: "png" });
    qrCode.pipe(fs.createWriteStream(outputPath));
}

export { generateHash, generateQRCode };
