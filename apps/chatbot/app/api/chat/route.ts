import { augmentedPromptChatUseCase } from "@repo/ai/features/augmentedPromptChat/augmentedPrompt.usecase"
import { StreamingTextResponse } from 'ai'
import { InvalidKeyError } from '@repo/ai/error/invalidKeyError.error'

export const maxDuration = 60;

export async function POST(req: Request) {
  console.log('Handling POST /api/chat');

  try {
    const json = await req.json();
    const { messages, previewToken } = json;
    
    const stream = await augmentedPromptChatUseCase(messages, previewToken);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);

    let message = 'Internal Server Error';
    let statusCode = 500;
    if (error instanceof InvalidKeyError) {
      message = error.message;
      statusCode = 401;
    }

    return new Response(message, { status: statusCode });
  }
}

