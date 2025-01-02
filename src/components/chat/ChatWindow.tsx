import React, { useRef, useEffect } from 'react';
import { Message } from '../../types';
import { ChatInput } from './ChatInput';
import { useFirebase } from '../../contexts/FirebaseContext';
import { animations } from '../../utils/animations';

interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const { loggedInUser } = useFirebase();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="glass-card rounded-lg h-[calc(100vh-24rem)] flex flex-col">
      <div className="p-6 border-b border-white/20">
        <h2 className="text-xl font-bold text-gray-800">Chat</h2>
      </div>
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.map((msg: Message, index) => (
          <div
            key={msg.id}
            className={`flex flex-col ${animations.newMessage}
              ${msg.user === loggedInUser ? 'items-end' : 'items-start'}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="text-sm text-gray-600">{msg.user}</span>
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] transform transition-all duration-200
                ${msg.user === loggedInUser
                  ? 'bg-blue-500/80 backdrop-blur-sm text-white'
                  : 'glass-effect'}`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  );
}