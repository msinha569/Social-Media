import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { animations } from '../../utils/animations';

export function ChatInput() {
  const { handleSendMessage } = useFirebase();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleMessageSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    await handleSendMessage(message);
    setMessage('');
    setIsSending(false);
  };

  return (
    <form onSubmit={handleMessageSend} className="p-4 border-t border-white/20">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg glass-effect focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending}
          className={`bg-blue-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-blue-600/80
            ${animations.buttonPress} ${animations.formSubmit}
            ${isSending ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <Send className={`w-5 h-5 ${isSending ? 'animate-pulse' : ''}`} />
        </button>
      </div>
    </form>
  );
}