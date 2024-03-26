import { UpdateBookPages } from "./types";
import { Document } from "@langchain/core/documents";
import { BookChunk } from "./bookPage.entity";
import { client } from "../core/mongodb";
import { vectorStore } from "../core/vectorStore";

export const updateBookPages: UpdateBookPages = async (pages: BookChunk[]) => {
  console.log("Updating book pages with ", pages);
  const documents: Document[] = pages.map((page) => {
    return {
      pageContent: page.content,
      metadata: {
        contentHash: page.contentHash,
      },
    };
  });
  const ids = pages.map((page) => page.name);
  await vectorStore.addDocuments(documents, {
    ids: ids,
  });
  await client.close();
};
