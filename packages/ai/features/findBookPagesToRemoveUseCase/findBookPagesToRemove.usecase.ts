import { BookPage } from "../cairoBookUpdate/bookPage.entity";
import { BookPageHashDto } from "../cairoBookUpdate/types";

export const findBookPagesToRemoveUseCase = (
    pages: BookPage[],
    storedPages: BookPageHashDto[],
) => {
  // Find stored pages missing in the fresh pages based on their names
  const freshPageNames = pages.map((page) => page.name);
  const missingPages = storedPages.filter(
      (storedPage) => !freshPageNames.includes(storedPage.name),
  );
  return missingPages.map((page) => page.name);
};
