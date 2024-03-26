import {
  GetFreshBookPages,
  GetStoredBookPagesHashes,
  RemoveBookPages,
  UpdateBookPages,
} from "./types";
import { BookChunkFactory } from "./bookPage.entity";
import { findBookChunksToUpdateUseCase } from "../findBookChunksToUpdateUseCase/findBookChunksToUpdateUseCase.usecase";
import { findBookChunksToRemoveUseCase } from "../findBookChunksToRemoveUseCase/findBookChunksToRemove.usecase";
import { splitBookPages } from "./splitPagesIntoChunks.infrastructure";

export async function cairoBookUpdateUseCase(context: {
  getFreshBookPages: GetFreshBookPages;
  getStoredBookPagesHashes: GetStoredBookPagesHashes;
  removeBookPages: RemoveBookPages;
  updateBookPages: UpdateBookPages;
}) {
  console.log("Running cairoBookUpdate");

  const pagesDto = await context.getFreshBookPages();
  const pagesSplit = await splitBookPages(pagesDto);
  const chunks = pagesSplit.map(BookChunkFactory.fromDocument);

  const storedChunks = await context.getStoredBookPagesHashes();
  const chunksToRemove = findBookChunksToRemoveUseCase(chunks, storedChunks);
  const chunksToUpdate = findBookChunksToUpdateUseCase(chunks, storedChunks);

  await context.removeBookPages(chunksToRemove);
  await context.updateBookPages(chunksToUpdate);

  console.log("Removed book pages with names ", chunksToRemove);
  console.log(
    "Updated book pages with names ",
    chunksToUpdate.map((chunk) => chunk.name)
  );
}
