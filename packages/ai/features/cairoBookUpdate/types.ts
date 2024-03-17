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
export type RemoveBookPages = (pages: BookPage[]) => void;
export type UpdateBookPages = (pages: BookPage[]) => void;
