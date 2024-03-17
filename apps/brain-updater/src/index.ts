import { cairoBookUpdateUseCase } from "@repo/ai/features/cairoBookUpdate/cairoBookUpdate.usecase";
import { updateBookPages } from "@repo/ai/features/cairoBookUpdate/cairoBookUpdate.infrastructure";
import { getStoredBookPagesHashes } from "@repo/ai/features/cairoBookUpdate/getStoredBookPagesHashes.infrastructure";
import { removeBookPages } from "@repo/ai/features/cairoBookUpdate/removeBookPages.infrastructure";
import { downloadAndProcessCairoBook } from "./downloadAndProcessCairoBook";

console.log("Brain updater started...");

cairoBookUpdateUseCase({
  getFreshBookPages: async () => {
    const pages = await downloadAndProcessCairoBook();
    console.log(
      `Downloaded and identified ${pages.length} pages to learn from.`,
    );
    return pages;
  },
  removeBookPages: removeBookPages,
  updateBookPages: updateBookPages,
  getStoredBookPagesHashes: getStoredBookPagesHashes,
}).then((_) => console.log("Brain learned much today!"));
