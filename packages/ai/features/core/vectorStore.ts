import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { collection } from "../core/mongodb";

export const vectorStore = new MongoDBAtlasVectorSearch(
  new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    batchSize: 512,
    modelName: "text-embedding-3-large",
    dimensions: 2048,
  }),
  {
    collection,
    indexName: "default",
    textKey: "text",
    embeddingKey: "embedding",
  }
);
