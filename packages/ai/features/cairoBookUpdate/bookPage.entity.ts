import { createHash } from "node:crypto";
import { BookPageDto } from "./types";

import { Document } from "@langchain/core/documents";

export class BookChunkFactory {
  static fromDto(pageDto: BookPageDto): BookChunk {
    return new BookChunk(pageDto.name, pageDto.content);
  }

  static fromDocument(doc: Document): BookChunk {
    return new BookChunk(
      `${doc.metadata.name}-${doc.metadata.chunkNumber}`,
      doc.pageContent
    );
  }
}

export class BookChunk {
  name: string;
  content: string;
  contentHash: string;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
    this.contentHash = BookChunk.calculateHash(content);
  }

  static calculateHash(content: string): string {
    return createHash("md5").update(content).digest("hex");
  }
}
