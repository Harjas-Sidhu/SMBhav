import elasticClient from "../elastic/elasticClient.mjs";
import dynanoDBClient from "../aws/dynanoDBClient.mjs";
import s3Client from "../aws/s3Client.mjs";
import { analyzeDocument } from "../nlp/nlpProcessor.mjs";
import computeCosineSimilarity from "compute-cosine-similarity";
import { pipeline } from "@xenova/transformers";

const padOrTruncateEmbedding = (embedding, targetLength) => {
    if (embedding.length > targetLength) {
        return embedding.slice(0, targetLength);
    } else if (embedding.length < targetLength) {
        return [
            ...embedding,
            ...new Array(targetLength - embedding.length).fill(0),
        ];
    }
    return embedding;
};

export const search = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).send("Query parameter is required.");
    }

    try {
        const { embedding: queryEmbedding } = await analyzeDocument(query);
        const queryEmbeddingArray = Array.from(queryEmbedding.data);

        const esQuery = {
            query: {
                match: {
                    content: {
                        query: query,
                        fuzziness: "AUTO",
                    },
                },
            },
        };

        const esResponse = await elasticClient.search("documents", esQuery);
        console.log("Search results:", esResponse);

        if (esResponse.hits.total.value === 0) {
            return res.status(404).send("No documents found.");
        }

        const metadataPromises = esResponse.hits.hits.map(async (hit) => {
            const documentId = hit._id;
            const metadata = await dynanoDBClient.getMetadata(documentId);
            return { documentId, metadata: metadata.Item };
        });
        const metadataResults = await Promise.all(metadataPromises);

        const embeddingPromises = esResponse.hits.hits.map(async (hit) => {
            const documentId = hit._id;
            const embeddingData = await s3Client.downloadFile(
                `${documentId}.json`
            );
            return {
                documentId,
                embedding: embeddingData,
            };
        });
        const embeddingResults = await Promise.all(embeddingPromises);

        const summarizer = await pipeline("summarization");

        const results = await Promise.all(
            esResponse.hits.hits.map(async (hit, index) => {
                const documentEmbedding = embeddingResults[index].embedding;
                const paddedDocumentEmbedding = Array.from(
                    padOrTruncateEmbedding(
                        documentEmbedding,
                        queryEmbeddingArray.length
                    )
                );

                const similarity = computeCosineSimilarity(
                    queryEmbeddingArray,
                    paddedDocumentEmbedding
                );

                const summary = await summarizer(hit._source.content, {
                    max_length: 100,
                    min_length: 50,
                });

                return {
                    documentId: hit._id,
                    metadata: metadataResults[index].metadata,
                    similarity,
                    summary: summary[0].summary_text,
                };
            })
        );

        results.sort((a, b) => b.similarity - a.similarity);

        res.status(200).send(results);
    } catch (err) {
        console.error("Search failed:", err);
        res.status(500).send("Failed to perform the search.");
    }
};
