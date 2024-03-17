import { ChatHistory } from "./types";
import { ragChatAgent } from "./ragChain";

export async function augmentedPromptChatUseCase(
  prompt: string,
  chatHistory: ChatHistory,
) {
  console.log("Running augmented prompt chat use case...");
  return await ragChatAgent.invoke({
    question: prompt,
    chat_history: chatHistory,
  });
}
