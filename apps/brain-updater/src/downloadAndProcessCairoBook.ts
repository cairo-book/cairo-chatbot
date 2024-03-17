import * as fs from "fs";
import * as path from "path";
import simpleGit from "simple-git";
import { BookPageDto } from "@repo/ai/features/cairoBookUpdate/types";

const git = simpleGit();

const REPO_URL = "https://github.com/cairo-book/cairo-book.git";
const MD_FILE_EXTENSION = ".md";

export async function downloadAndProcessCairoBook(): Promise<BookPageDto[]> {
  const cloneDir = path.join(__dirname, "cairo-book");

  try {
    await git.clone(REPO_URL, cloneDir);
    console.log("Repository cloned successfully.");
  } catch (error) {
    console.error("Error cloning repository:", error);
    throw new Error("Failed to clone repository");
  }

  const srcDir = path.join(cloneDir, "src");
  return processMarkdownFiles(srcDir);
}

function processMarkdownFiles(directory: string): Promise<BookPageDto[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return reject(err);
      }

      const pages: BookPageDto[] = [];
      files.forEach((file) => {
        const filePath = path.join(directory, file);
        if (path.extname(file).toLowerCase() === MD_FILE_EXTENSION) {
          const content = fs.readFileSync(filePath, "utf8");
          pages.push({
            name: path.basename(file, MD_FILE_EXTENSION),
            content,
          });
        }
      });

      resolve(pages);
    });
  });
}
