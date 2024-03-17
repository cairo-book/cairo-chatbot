import {
  GetFreshBookPages,
  GetStoredBookPagesHashes,
  UpdateBookPages,
} from "./types";
import { BookPageFactory } from "./bookPage.entity";
import { findBookPagesToUpdateUseCase } from "../findBookPagesToUpdateUseCase/findBookPagesToUpdateUseCase.usecase";

export async function cairoBookUpdateUseCase(context: {
  getFreshBookPages: GetFreshBookPages;
  getStoredBookPagesHashes: GetStoredBookPagesHashes;
  updateBookPages: UpdateBookPages;
}) {
  console.log("Running cairoBookUpdate");

  const pagesDto = await context.getFreshBookPages();
  const pages = pagesDto.map(BookPageFactory.fromDto);
  console.log("Pages = ", pages);
  const storedPages = await context.getStoredBookPagesHashes();
  const pagesToUpdate = findBookPagesToUpdateUseCase(pages, storedPages);
  context.updateBookPages(pagesToUpdate);
}
