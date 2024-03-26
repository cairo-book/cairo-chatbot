import { UseChatHelpers } from 'ai/react'

import { Button } from './ui/button'
import { ExternalLink } from '../components/external-link'
import { IconArrowRight } from './ui/icon'

const exampleMessages = [
  { 
    heading: 'Discover Cairo',
    message: `What is the Cairo Programming Language?`
  },
  {
    heading: 'Write a simple program',
    message: `How do I write a simple program in Cairo?`
  },
  {
    heading: 'Create a Starknet contract',
    message: `Write a basic counter contract.`
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
          . This chatbot can answer questions about the Cairo Language and help you understand specific concepts.
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
