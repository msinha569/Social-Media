import React, { useState, useEffect, useCallback } from 'react'
import { Socket } from 'socket.io-client'

interface MessagingProps {
  socket: Socket | null
  opponentId: string | null
}
interface MessageData {
    to: string;
    message: string;
  }

const Messaging: React.FC<MessagingProps> = ({ socket, opponentId }) => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return

    const handleMessage = (data: MessageData) => {
      // Only add messages that are intended for this user
      
      if (data.to === socket.id) {
        setMessages(prev => [...prev, data.message])
      }
    }

    socket.on('message', handleMessage)

    return () => {
      socket.off('message', handleMessage)
    }
  }, [socket])

  // Send a message to the opponent
  const sendMessages = useCallback(() => {
    if (!message.trim() || !opponentId) return
    const localmsg = message.trim()
    setMessage("")

    // Send the message via socket
    if (socket){
    socket.emit("message", { to: opponentId, message: localmsg }, () => {
      // Once the server confirms sending, show it in our local chat
      setMessages(prev => [...prev, `Me: ${localmsg}`])
    })}
  }, [message, opponentId, socket])
  return (
    <div
      className="mt-5 flex flex-col items-center space-y-5"
    >
      {/* Chat Messages */}
      <div
        className="w-full max-w-md h-64 border-2 border-gray-300 rounded-lg p-4 overflow-y-scroll  shadow-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className="mb-2 p-2 bg-blue-100 rounded text-gray-800 shadow-sm"
          >
            {msg}
          </div>
        ))}
      </div>
  
      {/* Message Input */}
      <div className="w-full max-w-md flex items-center space-x-3">
        <input
          value={message}
          className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessages();
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          type="text"
        />
        <button
          className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md transition transform hover:scale-105"
          onClick={sendMessages}
        >
          Send
        </button>
      </div>
  
      <button
        className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-md transition transform hover:scale-105"
        onClick={() => window.location.reload()}
      >
        Reconnect
      </button>
    </div>
  );
  
}

export default Messaging
