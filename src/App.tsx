import React, { useState, useEffect } from 'react';
import { useFirebase } from './contexts/FirebaseContext';
import { Toaster } from 'react-hot-toast';
import { Post } from './types';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/layout/Header';
import { CreatePost } from './components/posts/CreatePost';
import { PostList } from './components/posts/PostList';
import { ChatWindow } from './components/chat/ChatWindow';

function App() {
  const { loggedInUser, readData, handleReceiveMessage, receivedMessages } = useFirebase();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (loggedInUser) {
      readData(setPosts);
      handleReceiveMessage();
    }
  }, [loggedInUser]);

  if (!loggedInUser) {
    return (
      <>
        <Toaster position="top-center" />
        <AuthForm />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <CreatePost />
          <PostList posts={posts} setPosts={setPosts} />
        </div>
        <ChatWindow messages={receivedMessages} />
      </main>
    </div>
  );
}

export default App;