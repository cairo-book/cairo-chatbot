import { ChatMessage, ChatHistory } from "./types";

const buildChatHistory = (messages: ChatMessage[]) => {
    let userMessage = ''
    let assistantMessage = ''
    const chatHistory: ChatHistory = []
  
    messages.forEach((message) => {
      if (message.role === "user") {
        userMessage = message.content
      } else {
        assistantMessage = message.content
        chatHistory.push([userMessage, assistantMessage])
      }
    });;

    return chatHistory;
  };
  
  export default buildChatHistory;
  