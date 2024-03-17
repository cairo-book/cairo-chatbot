import { createHash } from "node:crypto";
import { BookPageDto } from "./types";

export class BookPageFactory {
  static fromDto(pageDto: BookPageDto): BookPage {
    return new BookPage(pageDto.name, pageDto.content);
  }
}

export class BookPage {
  name: string;
  content: string;
  contentHash: string;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
    this.contentHash = createHash("md5").update(content).digest("hex");
  }
}
