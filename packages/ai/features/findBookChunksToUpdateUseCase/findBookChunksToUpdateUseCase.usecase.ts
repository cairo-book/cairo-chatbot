import { BookChunk } from "../cairoBookUpdate/bookPage.entity";
import { BookChunkHashDto } from "../cairoBookUpdate/types";

export function findBookChunksToUpdateUseCase(
  freshPages: BookChunk[],
  storedPageHashes: BookChunkHashDto[]
): BookChunk[] {
  const storedHashesMap = new Map<string, string>();
  for (const hashDto of storedPageHashes) {
    storedHashesMap.set(hashDto.name, hashDto.contentHash);
  }

  return freshPages.filter((page) => {
    const storedHash = storedHashesMap.get(page.name);
    return storedHash !== page.contentHash;
  });
}
