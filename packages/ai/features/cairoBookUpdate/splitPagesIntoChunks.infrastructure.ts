import { BookPageDto, SplitBookPages } from "./types";
import { Document } from "@langchain/core/documents";
import { BookChunk } from "./bookPage.entity";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const splitBookPages: SplitBookPages = async (pages) => {
  const textSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: 4096,
    chunkOverlap: 512,
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

    // Assign unique number to each page
    pageDocuments.forEach((doc, index) => {
      doc.metadata.chunkNumber = index;
    });
    documents.push(...pageDocuments);
  }
  return documents;
};
