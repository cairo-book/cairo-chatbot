import { UpdateBookPages } from "./types";
import { vectorStore } from "./vectorStore";
import { Document } from "@langchain/core/documents";
import { BookPage } from "./bookPage.entity";
import { client } from "../core/mongodb";

export const updateBookPages: UpdateBookPages = async (pages: BookPage[]) => {
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
