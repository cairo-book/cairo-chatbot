import { cairoBookUpdateUseCase } from "./cairoBookUpdate.usecase";
import { BookChunk } from "./bookPage.entity";
import { BookPageDto } from "./types";
import { splitBookPages } from "./splitPagesIntoChunks.infrastructure";
import { mockedPages } from "./__mocks__/content";
import { assert } from "console";

// Mock dependencies
const getFreshBookPages = jest.fn();
const getStoredBookPagesHashes = jest.fn();
const removeBookPages = jest.fn();
const updateBookPages = jest.fn();

describe("cairoBookUpdateUseCase", () => {
  it("should split the book pages into chunks", async () => {
    const freshPages: BookPageDto[] = mockedPages;
    getFreshBookPages.mockResolvedValue(freshPages);
    const split = await splitBookPages(freshPages);

    // Check that each page was split into chunks and that these chunks
    split.forEach((chunk) => {
      expect(chunk.pageContent.length).toBeLessThan(4096);
      expect(chunk.metadata.name).toBeDefined();
      expect(chunk.metadata.chunkNumber).toBeDefined();
    });
  });
});
