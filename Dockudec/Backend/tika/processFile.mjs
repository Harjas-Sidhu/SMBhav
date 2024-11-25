import { execFile } from "child_process";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const execFileAsync = promisify(execFile);

export const processFileWithTika = async (filePath) => {
    try {
        const maxBuffer = 1000 * 1024 * 1024; // 1 GB
        const { stdout: content } = await execFileAsync(
            "java",
            ["-jar", process.env.TIKA_JAR_PATH, "--text", filePath],
            { maxBuffer: maxBuffer }
        );

        const { stdout: metadata } = await execFileAsync(
            "java",
            ["-jar", process.env.TIKA_JAR_PATH, "--json", filePath],
            { maxBuffer: maxBuffer }
        );

        let parsedMetadata;
        try {
            parsedMetadata = JSON.parse(metadata);
        } catch (parseError) {
            console.error("Error parsing metadata:", parseError);
            throw parseError;
        }

        return { content, metadata: parsedMetadata };
    } catch (err) {
        console.error("Error processing file with TIKA:", err);
        throw err;
    }
};
