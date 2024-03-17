import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");

const dbName = "langchain";
const collectionName = "store";
const collection = client.db(dbName).collection(collectionName);

export const vectorStore = new MongoDBAtlasVectorSearch(
  new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    batchSize: 512,
    modelName: "text-embedding-3-large",
    dimensions: 2048,
  }),
  {
    collection,
    indexName: "default", // The name of the Atlas search index. Defaults to "default"
    textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
    embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
  },
);
