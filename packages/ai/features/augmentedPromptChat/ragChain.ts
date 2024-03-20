import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import formatDocumentsAsString from "./formatDocumentAsString";
import { ConversationalRetrievalQAChainInput } from "./types";
import formatChatHistory from "./formatChatHistory";
import { vectorStore } from "../core/vectorStore";

const questionModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
});

const answerModel = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview",
});

const condenseQuestionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
  condenseQuestionTemplate
);

const answerTemplate = `Answer the question based only on the following context, especially when asked to give an example.
Only use code snippets extracted from the context. The context provided discusses the evolution of the Cairo programming language,
which has evolved since your cutoff date. Please only use information from the context to answer the question about Cairo. Never talk about the context in your answer. Answer in the language of the question.
{context}

Question: {question}
`;
const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);

const standaloneQuestionChain = RunnableSequence.from([
  {
    question: (input: ConversationalRetrievalQAChainInput) => input.question,
    chat_history: (input: ConversationalRetrievalQAChainInput) =>
      formatChatHistory(input.chat_history),
  },
  CONDENSE_QUESTION_PROMPT,
  questionModel,
  new StringOutputParser(),
]);

const answerChain = RunnableSequence.from([
  {
    context: vectorStore.asRetriever().pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  ANSWER_PROMPT,
  answerModel,
]);

export const ragChatAgent = standaloneQuestionChain.pipe(answerChain);
