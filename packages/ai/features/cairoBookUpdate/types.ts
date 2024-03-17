import { BookPage } from "./bookPage.entity";

export type BookPageDto = {
  name: string;
  content: string;
};

export type BookPageHashDto = {
  name: string;
  contentHash: string;
};

export type GetFreshBookPages = () => Promise<BookPageDto[]>;
export type GetStoredBookPagesHashes = () => Promise<BookPageHashDto[]>;
export type RemoveBookPages = (pageNames: BookPage["name"][]) => Promise<void>;
export type UpdateBookPages = (pages: BookPage[]) => Promise<void>;
