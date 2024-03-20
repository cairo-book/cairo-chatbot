import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import AdmZip from "adm-zip";
import { BookPageDto } from "@repo/ai/features/cairoBookUpdate/types";

const REPO_OWNER = "cairo-book";
const REPO_NAME = "cairo-book";
const MD_FILE_EXTENSION = ".md";

export async function downloadAndProcessCairoBook(): Promise<BookPageDto[]> {
  try {
    const latestReleaseUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;
    const response = await axios.get(latestReleaseUrl);
    const latestRelease = response.data;

    const zipAsset = latestRelease.assets.find(
      (asset: any) => asset.name === "markdown-output.zip"
    );

    if (!zipAsset) {
      throw new Error("ZIP asset not found in the latest release.");
    }

    const zipUrl = zipAsset.browser_download_url;
    const zipResponse = await axios.get(zipUrl, {
      responseType: "arraybuffer",
    });
    const zipData = zipResponse.data;

    const zipFile = new AdmZip(zipData);
    const extractDir = path.join(__dirname, "cairo-book");
    zipFile.extractAllTo(extractDir, true);

    console.log("ZIP file downloaded and extracted successfully.");

    const srcDir = path.join(extractDir, "book/markdown");
    return processMarkdownFiles(srcDir);
  } catch (error) {
    console.error("Error downloading and processing Cairo Book:", error);
    throw new Error("Failed to download and process Cairo Book");
  }
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
