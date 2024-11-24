import { pipeline } from "@xenova/transformers";

export const analyzeDocument = async (content) => {
    const summarizer = await pipeline("summarization");
    const summary = await summarizer(content, { max_length: 1000, min_length: 0 });

    const keywordExtractor = await pipeline("ner");
    const entities = await keywordExtractor(content);
    const keywords = entities.map((e) => e.word);

    const embedder = await pipeline("feature-extraction");
    const embedding = await embedder(content).then((res) => res[0]);

    return { summary, keywords, embedding };
};

