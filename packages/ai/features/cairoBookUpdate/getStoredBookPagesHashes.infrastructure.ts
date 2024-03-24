import { GetStoredBookPagesHashes } from "./types";
import { collection } from "../core/mongodb";

export const getStoredBookPagesHashes: GetStoredBookPagesHashes = async () => {
  const documents = await collection
    .find(
      {},
      {
        projection: { _id: 1, contentHash: 1 },
      }
    )
    .toArray();

  // Transform documents into an array of BookChunkHashDto
  return documents.map((doc) => ({
    name: doc._id.toString(),
    contentHash: doc.contentHash,
  }));
};
