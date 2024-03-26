import { ObjectId } from "mongodb";
import { collection } from "../core/mongodb";

export const findBookChunk = async (name: string) => {
  try {
    const match = await collection.findOne({
      _id: name as unknown as ObjectId,
    });
    if (match) {
      return {
        metadata: { _id: name, contentHash: match.contentHash },
        pageContent: match.text,
      };
    }
  } catch (error) {
    console.error("Error finding book chunk:", error);
    throw error;
  }
};
