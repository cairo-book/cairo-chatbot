export type BookPage = {
  name: string;
  content: string;
};

export type GetFreshBookPages = () => Promise<BookPage[]>;
export type UpdateBookPages = (pages: BookPage[]) => void;
