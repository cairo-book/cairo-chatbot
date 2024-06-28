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
import { findBookChunk } from "./findBookChunk.infrastructure";
import { DocumentInterface } from "@langchain/core/documents";

const questionModel = new ChatOpenAI({
  modelName: process.env.QUESTION_MODEL_NAME,
});

const answerModel = new ChatOpenAI({
  modelName: process.env.ANSWER_MODEL_NAME,
  temperature: 0.1,
});

const condenseQuestionTemplate = `
- Given: A conversation history and a follow-up question
- Task: Rephrase the follow-up question as a standalone question
- Language: English

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
  condenseQuestionTemplate
);

const answerTemplate = `
- Primary focus: Answer the question using the provided context
- Context: Information about the Cairo programming language
- Key points:
  1. Use ONLY information from the given context
  2. When examples are requested, prioritize using the context
  3. Only use code snippets directly extracted from the context
  4. Answer in english in all cases
  5. All answers should relate to Cairo directly.
  6. The context may contain information beyond your original knowledge cutoff

Remember: Stick strictly to the provided context when answering about Cairo.
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
    context: vectorStore.asRetriever(3).pipe(async (documents) => {
      const expandedDocuments = await Promise.all(
        documents.map(async (doc) => {
          const docNameParts = doc.metadata._id.split("-");
          const chunkNumber = Number(docNameParts[docNameParts.length - 1]);

          const nextDocName = `${docNameParts.slice(0, -1).join("-")}-${
            chunkNumber + 1
          }`;

          const nextDoc = await findBookChunk(nextDocName);
          return nextDoc ? [doc, nextDoc] : [doc];
        })
      );

      return formatDocumentsAsString(
        expandedDocuments.flat() as unknown as DocumentInterface<
          Record<string, any>
        >[]
      );
    }),
    question: new RunnablePassthrough(),
  },
  ANSWER_PROMPT,
  answerModel,
]);

export const ragChatAgent = standaloneQuestionChain.pipe(answerChain);
