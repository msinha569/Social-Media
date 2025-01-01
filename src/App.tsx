import React, { useState, useEffect, useRef } from 'react';
import { useFirebase } from './contexts/FirebaseContext';
import { Loader2, Send, ThumbsUp, ThumbsDown, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Post, Message } from './types';

function App() {
  const {
    handlePostEvent,
    readData,
    handleDislikeCount,
    handleLikeCount,
    signUpUser,
    loggedInUser,
    signingOut,
    handleSendMessage,
    receivedMessages,
    handleReceiveMessage,
    handleSigningIn
  } = useFirebase();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loggedInUser) {
      readData(setPosts);
      handleReceiveMessage();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [receivedMessages]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpUser(email, password, username);
      } else {
        await handleSigningIn(email, password);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    await handlePostEvent(newPost, setNewPost);
    readData(setPosts);
  };

  const handleMessageSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await handleSendMessage(message);
    setMessage('');
  };

  if (!loggedInUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isSignUp ? 'Create Account' : 'Login'}
          </h1>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? 'Sign Up' : 'Login'
              )}
            </button>
          </form>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-4 text-blue-500 hover:text-blue-600"
          >
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Welcome, {loggedInUser}</h1>
          <button
            onClick={signingOut}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Create Post</h2>
            <form onSubmit={handlePost} className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border rounded-lg resize-none"
                rows={4}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Post
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-4">{post.description}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLikeCount(post.likes, (count: number) => {
                      const newPosts = [...posts];
                      const index = newPosts.findIndex(p => p.id === post.id);
                      newPosts[index] = { ...post, likes: count };
                      setPosts(newPosts);
                    }, post, loggedInUser)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    {post.likes}
                  </button>
                  <button
                    onClick={() => handleDislikeCount(post.dislikes, (count: number) => {
                      const newPosts = [...posts];
                      const index = newPosts.findIndex(p => p.id === post.id);
                      newPosts[index] = { ...post, dislikes: count };
                      setPosts(newPosts);
                    }, post, loggedInUser)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    {post.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md h-[calc(100vh-12rem)] flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Chat</h2>
          </div>
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {receivedMessages.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.user === loggedInUser ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-sm text-gray-500">{msg.user}</span>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.user === loggedInUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
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
        </div>
      </main>
    </div>
  );
}

export default App;