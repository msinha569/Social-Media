import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useFirebase } from '../../contexts/FirebaseContext';

export function ChatInput() {
  const { handleSendMessage } = useFirebase();
  const [message, setMessage] = useState('');

  const handleMessageSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await handleSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleMessageSend} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}