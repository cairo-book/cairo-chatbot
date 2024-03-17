import { augmentedPromptUsecase } from "@repo/ai/features/augmentedPrompt/augmentedPrompt.usecase"
import { StreamingTextResponse } from 'ai'
import { InvalidKeyError } from '@repo/ai/error/invalidKeyError.error'

export async function POST(req: Request) {
  console.log('Handling POST /api/chat');

  try {
    const json = await req.json();
    const { messages, previewToken } = json;
    
    const stream = await augmentedPromptUsecase({messages, previewToken});
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

