import {
  GetFreshBookPages,
  GetStoredBookPagesHashes,
  RemoveBookPages,
  UpdateBookPages,
} from "./types";
import { BookPageFactory } from "./bookPage.entity";
import { findBookPagesToUpdateUseCase } from "../findBookPagesToUpdateUseCase/findBookPagesToUpdateUseCase.usecase";
import { findBookPagesToRemoveUseCase } from "../findBookPagesToRemoveUseCase/findBookPagesToRemove.usecase";

export async function cairoBookUpdateUseCase(context: {
  getFreshBookPages: GetFreshBookPages;
  getStoredBookPagesHashes: GetStoredBookPagesHashes;
  removeBookPages: RemoveBookPages;
  updateBookPages: UpdateBookPages;
}) {
  console.log("Running cairoBookUpdate");

  const pagesDto = await context.getFreshBookPages();
  const pages = pagesDto.map(BookPageFactory.fromDto);
  const storedPages = await context.getStoredBookPagesHashes();
  console.log("Pages = ", pages);
  console.log("Stored pages = ", storedPages);

  const pagesToRemove = findBookPagesToRemoveUseCase(pages, storedPages);
  console.log("pagesToRemove = ", pagesToRemove);
  await context.removeBookPages(pagesToRemove);

  const pagesToUpdate = findBookPagesToUpdateUseCase(pages, storedPages);
  console.log("pagesToUpdate = ", pagesToUpdate);
  await context.updateBookPages(pagesToUpdate);
}
