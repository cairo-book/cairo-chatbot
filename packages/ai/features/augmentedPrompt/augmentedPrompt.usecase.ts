import { ValidateKeyUtils } from "../../utils/validateKey.utils"
import { InvalidKeyError } from "../../error/invalidKeyError.error"
import { ChatOpenAI } from "@langchain/openai"; 
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { IterableReadableStream } from "@langchain/core/utils/stream";

export async function augmentedPromptUsecase(
  {messages, previewToken}: {messages: string[], previewToken: string}): 
  Promise<IterableReadableStream<Uint8Array>> {
  console.log("Hello from augmentedPromptUsecase");
  console.log('messages', messages)
  
  if (!ValidateKeyUtils.isKeyValid(previewToken)) {
    throw new InvalidKeyError('Invalid Access Key');
  }

  const model = new ChatOpenAI({
    streaming: true,
  });

  const parser = new HttpResponseOutputParser();


  const langChainChain = PromptTemplate.fromTemplate(
    `You are an expert in langchain.
    Always answer questions starting with "As Harrison Chase told me : \`git status\` 


    ah 
    \`\`\`
    git pull
    git push 
    \`\`\`
    ".
    Respond to the following question:

    Question: {question}
    Answer:`
  ).pipe(model);
   
  const fullChain = RunnableSequence.from([
    {
      question: (input: { question: string }) => input.question,
    },
    langChainChain,
    new StringOutputParser(),
  ]);

  return await fullChain.pipe(parser).stream({
    question: 'How do I use langchain? Explain in one sentence',
  });
}
