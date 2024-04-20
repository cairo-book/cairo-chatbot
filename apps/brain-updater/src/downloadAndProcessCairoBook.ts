import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import AdmZip from "adm-zip";
import { BookPageDto } from "@repo/ai/features/cairoBookUpdate/types";

const MD_FILE_EXTENSION = ".md";

export async function downloadAndProcessGithubRelease(
  repo_owner: string,
  repo_name: string
): Promise<BookPageDto[]> {
  try {
    const latestReleaseUrl = `https://api.github.com/repos/${repo_owner}/${repo_name}/releases/latest`;
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
    const extractDir = path.join(__dirname, repo_name);
    zipFile.extractAllTo(extractDir, true);

    console.log("ZIP file downloaded and extracted successfully.");

    const srcDir = path.join(extractDir, "book/markdown");
    return processMarkdownFiles(srcDir);
  } catch (error) {
    console.error(`Error downloading and processing ${repo_name}:`, error);
    throw new Error(`Failed to download and process ${repo_name}.`);
  }
}

function processMarkdownFiles(directory: string): Promise<BookPageDto[]> {
  return new Promise((resolve, reject) => {
    const pages: BookPageDto[] = [];

    const processDirectory = (currentDir: string) => {
      fs.readdir(currentDir, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err);
          return reject(err);
        }

        let pendingFiles = files.length;

        if (pendingFiles === 0) {
          return resolve(pages);
        }

        files.forEach((file) => {
          const filePath = path.join(currentDir, file);

          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.error("Error getting file stats:", err);
              return reject(err);
            }

            if (stats.isDirectory()) {
              processDirectory(filePath);
            } else if (path.extname(file).toLowerCase() === MD_FILE_EXTENSION) {
              const content = fs.readFileSync(filePath, "utf8");
              pages.push({
                name: path.basename(file, MD_FILE_EXTENSION),
                content,
              });
            }

            pendingFiles--;

            if (pendingFiles === 0) {
              resolve(pages);
            }
          });
        });
      });
    };

    processDirectory(directory);
  });
}
