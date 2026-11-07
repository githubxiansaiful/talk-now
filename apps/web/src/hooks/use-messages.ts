'use client';

import { useState } from 'react';
import { Message } from '@talknow/shared';

export function useMessages(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  return {
    messages,
    setMessages,
    addMessage,
  };
}
