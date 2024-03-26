import { BookChunk } from "../cairoBookUpdate/bookPage.entity";
import { BookChunkHashDto } from "../cairoBookUpdate/types";

export const findBookChunksToRemoveUseCase = (
  pages: BookChunk[],
  storedPages: BookChunkHashDto[]
) => {
  // Find stored pages missing in the fresh pages based on their names
  const freshPageNames = pages.map((page) => page.name);
  const missingPages = storedPages.filter(
    (storedPage) => !freshPageNames.includes(storedPage.name)
  );
  return missingPages.map((page) => page.name);
};
