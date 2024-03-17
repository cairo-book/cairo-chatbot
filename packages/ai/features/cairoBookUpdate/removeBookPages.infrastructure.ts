import { RemoveBookPages } from "./types";
import { collection } from "../core/mongodb";
import { ObjectId } from "mongodb";

export const removeBookPages: RemoveBookPages = async (pageNames) => {
  console.log("Removing book pages with names ", pageNames);
  await collection.deleteMany({
    _id: { $in: pageNames.map((name) => name as unknown as ObjectId) },
  });
};
