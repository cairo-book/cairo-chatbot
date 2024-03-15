import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "./formatDocumentsAsString";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

export const conversationalRetrievalQA = async () => {
  const model = new ChatOpenAI({
    streaming: true,
  });

  const condenseQuestionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
  const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
    condenseQuestionTemplate,
  );

  const answerTemplate = `Answer the question based only on the following context:
{context}

Question: {question}
`;
  const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);

  const formatChatHistory = (chatHistory: [string, string][]) => {
    const formattedDialogueTurns = chatHistory.map(
      (dialogueTurn) =>
        `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`,
    );
    return formattedDialogueTurns.join("\n");
  };

  // const vectorStore = await HNSWLib.fromTexts(
  //   [
  //     "mitochondria is the powerhouse of the cell",
  //     "mitochondria is made of lipids",
  //   ],
  //   [{ id: 1 }, { id: 2 }],
  //   new OpenAIEmbeddings(),
  // );

  const client = new MongoClient(
    process.env.MONGODB_ATLAS_URI ||
      "mongodb+srv://admin:UC3uZi4nJWPRbdW2@cluster0.g6j6plb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  );
  console.log("Client created");
  const namespace = "langchain.test";
  const [dbName, collectionName] = namespace.split(".");
  const collection = client.db(dbName).collection("test");
  const vectorStore = await MongoDBAtlasVectorSearch.fromTexts(
    [
      "Mitochondrion, also known as the mitomito is the powerhouse of the cell",
      "Mitochondrion is made of lipids and some chocapic kellogs",
    ],
    [{ id: 2 }, { id: 1 }],
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      batchSize: 512,
      modelName: "text-embedding-3-large",
      dimensions: 2048,
    }),
    {
      collection,
      indexName: "default", // The name of the Atlas search index. Defaults to "default"
      textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
      embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
    },
  );
  const retriever = vectorStore.asRetriever();

  type ConversationalRetrievalQAChainInput = {
    question: string;
    chat_history: [string, string][];
  };

  const standaloneQuestionChain = RunnableSequence.from([
    {
      question: (input: ConversationalRetrievalQAChainInput) => input.question,
      chat_history: (input: ConversationalRetrievalQAChainInput) =>
        formatChatHistory(input.chat_history),
    },
    CONDENSE_QUESTION_PROMPT,
    model,
    new StringOutputParser(),
  ]);

  const answerChain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    ANSWER_PROMPT,
    model,
  ]);

  const conversationalRetrievalQAChain =
    standaloneQuestionChain.pipe(answerChain);

  const result1 = await conversationalRetrievalQAChain.invoke({
    question: "What is the powerhouse of the cell?",
    chat_history: [],
  });
  console.log(result1);
  /*
    AIMessage { content: "The powerhouse of the cell is the mitochondria." }
  */

  // const stream = await conversationalRetrievalQAChain.stream({
  //   question: "What are they made out of?",
  //   chat_history: [
  //     [
  //       "What is the powerhouse of the cell?",
  //       "The powerhouse of the cell is the mitochondria.",
  //     ],
  //   ],
  // });
  // for await (const chunk of stream) {
  //   console.log(chunk);
  // }

  const result2 = await conversationalRetrievalQAChain.invoke({
    question: "What are they made out of?",
    chat_history: [
      [
        "What is the powerhouse of the cell?",
        "The powerhouse of the cell is the mitochondria.",
      ],
    ],
  });
  console.log(result2);

  await client.close();
  /*
    AIMessage { content: "Mitochondria are made out of lipids." }
  */
};
