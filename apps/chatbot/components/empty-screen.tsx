import { UseChatHelpers } from 'ai/react'

import { Button } from './ui/button'
import { ExternalLink } from '../components/external-link'
import { IconArrowRight } from './ui/icon'

const exampleMessages = [
  { 
    heading: 'Explain technical concepts',
    message: `What is a "cairo programming language"?`
  },
  {
    heading: 'Testing a program',
    message: `How to test my Cairo program?`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to The Cairo Programming Language Chatbot!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an open source AI chatbot app based on{' '}
          <ExternalLink href="https://github.com/vercel/ai-chatbot">Vercel Ai ChatBot</ExternalLink>
          . This chatbot makes it easier to browse Cairo Language documentation by interacting with the chatbot.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
