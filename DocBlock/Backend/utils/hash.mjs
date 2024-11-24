import crypto from "crypto";
/**
 * Generates a hash for the given buffer.
 * @param {Buffer} buffer Buffer to generate hash for
 * @returns {string} Hash of the buffer
 */
export default function generateHash(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}
