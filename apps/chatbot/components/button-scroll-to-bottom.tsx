'use client'

import * as React from 'react'

import { cn } from '../lib/utils'
import { Button, type ButtonProps } from './ui/button'
import { IconArrowDown } from './ui/icon'
import { Message } from 'ai'

interface ButtonScrollToBottomProps extends ButtonProps {
  messages: Message[],
  scrollToBottom: () => void
}

export function ButtonScrollToBottom({ messages, scrollToBottom, className, ...props }: ButtonScrollToBottomProps) {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'absolute right-4 top-1 z-auto bg-background transition-opacity duration-300 sm:right-8 md:top-2',
          messages.length == 0 ? 'opacity-0' : 'opacity-100',
          className
        )}
        onClick={() =>
          {scrollToBottom();}
        }
        {...props}
      >
        <IconArrowDown />
        <span className="sr-only">Scroll to bottom</span>
      </Button>
    </>
  )
}
