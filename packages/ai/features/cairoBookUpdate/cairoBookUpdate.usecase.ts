import { GetFreshBookPages, UpdateBookPages } from "./types";

export async function cairoBookUpdateUseCase(context: {
  getFreshBookPages: GetFreshBookPages;
  updateBookPages: UpdateBookPages;
}) {
  console.log("Running cairoBookUpdate");

  const pages = await context.getFreshBookPages();
  console.log("Pages = ", pages);
  context.updateBookPages(pages);
}
