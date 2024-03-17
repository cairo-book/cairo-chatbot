import { BookPage } from "../cairoBookUpdate/bookPage.entity";
import { BookPageHashDto } from "../cairoBookUpdate/types";

export function findBookPagesToUpdateUseCase(
  freshPages: BookPage[],
  storedPageHashes: BookPageHashDto[],
): BookPage[] {
  const storedHashesMap = new Map<string, string>();
  for (const hashDto of storedPageHashes) {
    storedHashesMap.set(hashDto.name, hashDto.contentHash);
  }

  return freshPages.filter((page) => {
    const storedHash = storedHashesMap.get(page.name);
    return storedHash !== page.contentHash;
  });
}
