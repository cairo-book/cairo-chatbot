import * as React from 'react'

import { cn } from '../lib/utils'
import { buttonVariants } from './ui/button'
import { IconGitHub } from './ui/icon'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <h1 className='text-2xl text-white'> The Cairo Programming Language Chatbot </h1>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <a
          target="_blank"
          href="https://github.com/cairo-book/cairo-book"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub className="w-6 h-6" />
          <span className="hidden ml-2 md:flex">GitHub</span>
        </a>
      </div>
    </header>
  )
}
