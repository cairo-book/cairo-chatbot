import { RunnableSequence } from "@langchain/core/runnables";
import { BaseMessageChunk } from "@langchain/core/messages";

type HumanMessage = string;
type AssistantMessage = string;
export type ChatHistory = [HumanMessage, AssistantMessage][];

export type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: ChatHistory;
};

export type RagChatAgent = RunnableSequence<
  ConversationalRetrievalQAChainInput,
  BaseMessageChunk
>;
