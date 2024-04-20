import { cairoBookUpdateUseCase } from "@repo/ai/features/cairoBookUpdate/cairoBookUpdate.usecase";
import { updateBookPages } from "@repo/ai/features/cairoBookUpdate/cairoBookUpdate.infrastructure";
import { getStoredBookPagesHashes } from "@repo/ai/features/cairoBookUpdate/getStoredBookPagesHashes.infrastructure";
import { removeBookPages } from "@repo/ai/features/cairoBookUpdate/removeBookPages.infrastructure";
import { downloadAndProcessGithubRelease } from "./downloadAndProcessCairoBook";

console.log("Brain updater started...");

const REPO_OWNER = "cairo-book";
const CAIRO_BOOK_REPO_NAME = "cairo-book";
const SNFOUNDRY_BOOK_REPO_NAME = "starknet-foundry";

cairoBookUpdateUseCase({
  getFreshBookPages: async () => {
    const cairoBookPages = await downloadAndProcessGithubRelease(
      REPO_OWNER,
      CAIRO_BOOK_REPO_NAME
    );
    const snFoundryBookPages = await downloadAndProcessGithubRelease(
      REPO_OWNER,
      SNFOUNDRY_BOOK_REPO_NAME
    );
    const pages = [...cairoBookPages, ...snFoundryBookPages];
    console.log(pages.map((page) => page.name));
    console.log(
      `Downloaded and identified ${pages.length} pages to learn from.`
    );
    return pages;
  },
  removeBookPages: removeBookPages,
  updateBookPages: updateBookPages,
  getStoredBookPagesHashes: getStoredBookPagesHashes,
}).then((_) => console.log("Brain learned much today!"));
