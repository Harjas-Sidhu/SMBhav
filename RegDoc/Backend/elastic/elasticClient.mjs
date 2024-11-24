import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

class ElasticClient {
    constructor() {
        this.client = new Client({
            node: "https://localhost:9200",
            auth: {
                username: "elastic",
                password: process.env.ELASTIC_PASSWORD,
            },
            tls: {
                ca: fs.readFileSync(process.env.ELASTIC_CA_PATH),
                rejectUnauthorized: false,
            },
        });
    }

    /**
     * Retry operation with retries and delay.
     * @param {Function} operation - The operation to retry.
     * @param {number} retries - Number of retries.
     * @param {number} delay - Delay in milliseconds between retries.
     * @returns {Promise<any>} - The result of the operation.
     */
    async retryOperation(operation, retries = 3, delay = 1000) {
        while (retries > 0) {
            try {
                return await operation();
            } catch (err) {
                console.error("Operation failed, retrying...", err.message);
                retries--;
                if (retries > 0)
                    await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw new Error("Operation failed after retries.");
    }

    /**
     * Test the connection to the ElasticSearch server.
     * @async
     * @returns {Promise<void>}
     * @throws {Error} If the connection fails.
     * @example
     * 			await elasticClient.testConnection();
     * 				// ElasticSearch is up: { cluster_name: 'docker-cluster', status: 'green', ... }
     */
    async testConnection() {
        try {
            const health = await this.client.cluster.health();
            console.log("ElasticSearch is up:", health);
        } catch (err) {
            console.error("ElasticSearch connection failed:", err);
        }
    }

    /**
     * Update the field limit for an index in ElasticSearch.
     * @async
     * @param {string} indexName - The name of the index to update.
     * @param {number} limit - The new field limit (2000 by default).
     * @returns {Promise<void>}
     * @throws {Error} If the field limit update fails.
     * @example
     *      await elasticClient.updateFieldLimit("my-index", 3000);
     *      // Field limit updated to 3000 for index my-index: { acknowledged: true }
     *      // or
     *      // Field limit update failed: { statusCode: 404, error: 'index_not_found_exception', ... }
     */
    async updateFieldLimit(indexName, limit = 2000) {
        try {
            const response = await this.client.indices.putSettings({
                index: indexName,
                body: {
                    "index.mapping.total_fields.limit": limit,
                },
            });
            console.log(
                `Field limit updated to ${limit} for index ${indexName}:`,
                response
            );
        } catch (err) {
            console.error(
                `Failed to update field limit for index ${indexName}:`,
                err
            );
        }
    }

    /**
     * Create an index in ElasticSearch.
     * @async
     * @param {string} indexName - The name of the index to create.
     * @returns {Promise<void>}
     * @throws {Error} If the index creation fails.
     * @example
     * 		await elasticClient.createIndex("my-index");
     * 		// Index created: { acknowledged: true, shards_acknowledged: true, ... }
     * 		// or
     * 		// Index creation failed: { statusCode: 400, error: 	'resource_already_exists_exception', ... }
     */
    async createIndex(indexName) {
        try {
            const response = await this.client.indices.create({
                index: indexName,
                body: {
                    mappings: {
                        properties: {
                            title: { type: "text" },
                            content: { type: "text" },
                            metadata: { type: "object" },
                            summary: { type: "text" },
                            keywords: { type: "text" },
                            uploadDate: { type: "date" },
                        },
                    },
                    settings: {
                        "index.mapping.total_fields.limit": 10000000,
                    },
                }
            });
            console.log("Index created:", response);
            return response;
        } catch (err) {
            console.error("Index creation failed:", err);
        }
    }

    /**
     * Delete an index from ElasticSearch.
     * @async
     * @param {string} indexName - The name of the index to delete.
     * @returns {Promise<void>}
     * @throws {Error} If the index deletion fails.
     * @example
     * 		await elasticClient.deleteIndex("my-index");
     * 		// Index deleted: { acknowledged: true }
     * 		// or
     * 		// Index deletion failed: { statusCode: 404, error: 'resource_not_found_exception', ... }
     */
    async deleteIndex(indexName) {
        try {
            const response = await this.client.indices.delete({
                index: indexName,
            });
            console.log("Index deleted:", response);
            return response;
        } catch (err) {
            console.error("Index deletion failed:", err);
        }
    }

    /**
     * Index a document in ElasticSearch.
     * @async
     * @param {string} indexName - The name of the index to which the document belongs.
     * @param {object} document - The document to index.
     * @returns {Promise<void>}
     * @throws {Error} If the document indexing fails.
     * @example
     * 		await elasticClient.indexDocument("my-index", { title: "Hello, World!" });
     * 		// Document indexed: { _index: 'my-index', _type: '_doc', _id: '...', _version: 1, ... }
     * 		// or
     * 		// Document indexing failed: { statusCode: 400, error: 'mapper_parsing_exception',
     * 		// 	message: 'failed to parse', ... }
     */
    async indexDocument(indexName, document) {
        try {
            const ifIndexExists = await this.client.indices.exists({
                index: indexName,
            });

            if (!ifIndexExists) {
                await this.createIndex(indexName);
            }

            const response = await this.client.index({
                index: indexName,
                body: document,
            });
            console.log("Document indexed:", response);
            return response;
        } catch (err) {
            console.error("Document indexing failed:", err);
            console.log(err.meta.body.error);
        }
    }

    /**
     * Bulk index documents in ElasticSearch.
     * @async
     * @param {string} indexName - The name of the index to which the documents belong.
     * @param {object[]} documents - The documents to index.
     * @returns {Promise<void>}
     * @throws {Error} If the bulk indexing fails.
     * @example
     * 		await elasticClient.bulkIndexDocuments("my-index", [
     * 			{ title: "Hello, World!" },
     * 			{ title: "Hello, Elastic!" }
     * 		]);
     * 		// Bulk indexing completed: { took: 50, errors: false, items: [ { index: { _index: 'my-index', ... } }, ... ] }
     * 		// or
     * 		// Bulk indexing failed: { statusCode: 400, error: 'mapper_parsing_exception',
     * 		// 	message: 'failed to parse', ... }
     */
    async bulkIndexDocuments(indexName, documents) {
        const body = documents.flatMap((doc) => [
            { index: { _index: indexName } },
            doc,
        ]);

        try {
            const response = await this.client.bulk({ body });
            console.log("Bulk indexing completed:", response);
            if (response.errors) {
                console.error(
                    "Some documents failed to index:",
                    response.items
                );
            }
            return response;
        } catch (err) {
            console.error("Bulk indexing failed:", err);
        }
    }

    /**
     * Build a match query for ElasticSearch.
     * @param {string} field - The field to match.
     * @param {string} value - The value to match.
     * @returns {object} - The match query.
     * @example
     * 			const query = elasticClient.buildMatchQuery("title", "Hello, Elastic!");
     * 				// Query: { match: { title: 'Hello, Elastic!' } }
     */
    buildMatchQuery(field, value) {
        return { match: { [field]: value } };
    }

    /**
     * search documents in ElasticSearch.
     * @async
     * @param {string} indexName - The name of the index to search.
     * @param {object} query - The search query.
     * @param {number} from - The starting index of the search results (0 by default).
     * @param {number} size - The number of search results to return (10 by default).
     * @returns {Promise<void>}
     * @throws {Error} If the search fails.
     * @example
     * 		const query = elasticClient.buildMatchQuery("title", "Hello, Elastic!");
     * 		await elasticClient.search("my-index", query);
     * 		// Search results: { took: 1, timed_out: false, _shards: { total: 1, successful: 1, ... }, ... }
     * 		// or
     * 		// Search failed: { statusCode: 404, error: 'index_not_found_exception', ... }
     */
    async search(indexName, query, from = 0, size = 10) {
        try {
            const response = await this.client.search({
                index: indexName,
                body: query,
                from,
                size,
            });
            console.log("Search results:", response);
            return response;
        } catch (err) {
            console.error("Search failed:", err);
        }
    }

    /**
     * Update a document in ElasticSearch.
     * @async
     * @param {string} indexName - The name of the index to which the document belongs.
     * @param {string} documentId - The ID of the document to update.
     * @param {object} document - The updated document.
     * @returns {Promise<void>}
     * @throws {Error} If the document update fails.
     * @example
     * 		await elasticClient.updateDocument("my-index", "...", { title: "Hello, Elastic!" });
     * 		// Document updated: { _index: 'my-index', _type: '_doc', _id: '...', _version: 2, ... }
     * 		// or
     * 		// Document update failed: { statusCode: 404, error: 'not_found', ... }
     */
    async deleteDocument(indexName, documentId) {
        try {
            const response = await this.client.delete({
                index: indexName,
                id: documentId,
            });
            console.log("Document deleted:", response);
            return response;
        } catch (err) {
            console.error("Document deletion failed:", err);
        }
    }
}

export default new ElasticClient();
