import { BookPage, UpdateBookPages } from "./types";
import { client, vectorStore } from "./vectorStore";
import { Document } from "@langchain/core/documents";
import { createHash } from "node:crypto";

export const updateBookPages: UpdateBookPages = async (pages: BookPage[]) => {
  console.log("Updating book pages with ", pages);
  const documents: Document[] = pages.map((page) => {
    return {
      pageContent: page.content,
      metadata: {
        contentHash: createHash("md5").update(page.content).digest("hex"),
      },
    };
  });
  const ids = pages.map((page) => page.name);
  await vectorStore.addDocuments(documents, {
    ids: ids,
  });
  await client.close();
};
