'use client'

import { Message } from 'ai/react'
import { cn } from '../lib/utils'
import { ChatList } from '../components/chat-list'
import { ChatScrollAnchor } from '../components/chat-scroll-anchor'
import { EmptyScreen } from '../components/empty-screen'
import { Dispatch, SetStateAction } from 'react'

export interface MessagesListSectionProps extends React.ComponentProps<'div'> {
    messages: Message[],
    isLoading: boolean,
    setInput: Dispatch<SetStateAction<string>>
  }

export function MessagesListSection(
    { messages, isLoading, setInput, className }: 
    MessagesListSectionProps
    ) {
    return (
        <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
    )
}