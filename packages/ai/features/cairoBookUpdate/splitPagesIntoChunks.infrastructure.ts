import { BookPageDto, SplitBookPages } from "./types";
import { Document } from "@langchain/core/documents";
import { BookChunk } from "./bookPage.entity";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const splitBookPages: SplitBookPages = async (pages) => {
  const textSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: 2048,
    chunkOverlap: 500,
  });

  const documents: Document[] = [];

  for (const page of pages) {
    const pageDocuments = await textSplitter.createDocuments(
      [page.content],
      [
        {
          name: page.name,
        },
      ]
    );
    documents.push(...pageDocuments);
  }
  return documents;
};
