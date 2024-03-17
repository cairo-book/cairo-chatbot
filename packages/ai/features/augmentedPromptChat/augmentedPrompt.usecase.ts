import { ChatMessage } from "./types";
import { ragChatAgent } from "./ragChain";
import buildChatHistory from "./buildChatHistory";
import { ValidateKeyUtils } from "../../utils/validateKey.utils";
import { InvalidKeyError } from "../../error/invalidKeyError.error";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { IterableReadableStream } from "@langchain/core/utils/stream";

export async function augmentedPromptChatUseCase(
  messages: ChatMessage[], 
  previewToken: string
) : Promise<IterableReadableStream<Uint8Array>> {
  console.log("Running augmented prompt chat use case...");

  if (!ValidateKeyUtils.isKeyValid(previewToken)) {
    throw new InvalidKeyError('Invalid Access Key');
  }

  let prompt = ''
  if (messages && messages.length > 0) {
    prompt = messages![messages.length - 1]!.content;
    messages.pop();
  }

  const parser = new HttpResponseOutputParser();

  return await ragChatAgent.pipe(parser).stream({
    question: prompt,
    chat_history: buildChatHistory(messages),
  });
}
