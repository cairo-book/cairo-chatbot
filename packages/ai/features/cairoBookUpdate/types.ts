import { BookChunk } from "./bookPage.entity";
import { Document } from "@langchain/core/documents";

export type BookPageDto = {
  name: string;
  content: string;
};

export type BookChunkHashDto = {
  name: string;
  contentHash: string;
};

export type GetFreshBookPages = () => Promise<BookPageDto[]>;
export type GetStoredBookPagesHashes = () => Promise<BookChunkHashDto[]>;
export type RemoveBookPages = (pageNames: BookChunk["name"][]) => Promise<void>;
export type UpdateBookPages = (pages: BookChunk[]) => Promise<void>;
export type SplitBookPages = (pages: BookPageDto[]) => Promise<Document[]>;
