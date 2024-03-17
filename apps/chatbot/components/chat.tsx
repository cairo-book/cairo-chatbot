'use client'

import { useChat, type Message } from 'ai/react'
import { toast } from 'react-hot-toast'

import { AccessKeyDialogSection } from "../containers/access-key-dialog-section";
import { ChatPromptSection } from "../containers/chat-prompt-section";

import { Constants } from '@repo/ai/utils/constants';
import { useLocalStorage } from '../lib/hooks/use-local-storage';
import { MessagesListSection } from '../containers/messages-list-section';
import { useRef, useState } from 'react';
import { ValidateKeyUtils } from '@repo/ai/utils/validateKey.utils';

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}
export function Chat({ id, initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    Constants.LOCAL_STORAGE_KEY,
    window.localStorage.getItem(Constants.LOCAL_STORAGE_KEY) !== null ? 
    JSON.parse(window.localStorage.getItem(Constants.LOCAL_STORAGE_KEY) ?? '') : null
  )
  
  const [previewTokenDialog, setPreviewTokenDialog] = useState(Constants.IS_PREVIEW && !ValidateKeyUtils.isKeyValid(previewToken));

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error('Invalid Access Key')
          setPreviewToken(null)
          setPreviewTokenDialog(true)
        } else if (response.status !== 200) {
          toast.error(response.statusText)
        }
      },
    })

  const chatRef = useRef(null);
  const scrollToBottom = () => {
    if (chatRef.current) {
      (chatRef.current as HTMLElement).scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }

  return (
    <>
      <div ref={chatRef}>
        <MessagesListSection 
          messages={messages}
          isLoading={isLoading}
          setInput={setInput}
          className={className}
        />
        <ChatPromptSection
          id={id}
          isLoading={isLoading}
          stop={stop}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
          scrollToBottom={scrollToBottom}
        />
        <AccessKeyDialogSection 
          previewToken={previewToken}
          setPreviewToken={setPreviewToken}
          previewTokenDialog={previewTokenDialog}
          setPreviewTokenDialog={setPreviewTokenDialog}
        />
      </div>
    </>
  )
}
