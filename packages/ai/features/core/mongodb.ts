import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");

const dbName = "langchain";
const collectionName = "store";
export const collection = client.db(dbName).collection(collectionName);
