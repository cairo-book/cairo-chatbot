import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";

export async function testEmbeddings() {
  console.log("testEmbeddings");
  const client = new MongoClient(
    process.env.MONGODB_ATLAS_URI ||
      "mongodb+srv://admin:UC3uZi4nJWPRbdW2@cluster0.g6j6plb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  );
  console.log("Client created");
  const namespace = "langchain.test";
  const [dbName, collectionName] = namespace.split(".");
  const collection = client.db(dbName).collection("test");
  collection.insertOne({ test: "test" });

  const vectorstore = await MongoDBAtlasVectorSearch.fromTexts(
    ["Hello world", "Bye bye", "What's this?"],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
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

  console.log("vector store created");

  // const assignedIds = await vectorstore.addDocuments([
  //   { pageContent: "upsertable", metadata: {} },
  // ]);
  //
  // console.log("assigned ids");
  // const upsertedDocs = [{ pageContent: "overwritten", metadata: {} }];
  //
  // console.log("upserted docs");
  // await vectorstore.addDocuments(upsertedDocs, { ids: assignedIds });

  // console.log("vector store add documents");

  const resultOne = await vectorstore.similaritySearch("Hello world", 1);
  console.log(resultOne);

  // const ok = await vectorstore.similaritySearch("Hello world", 1);
  // console.log(ok.at(0));
  // vectorstore.asRetriever().getRelevantDocuments();

  await client.close();
}
