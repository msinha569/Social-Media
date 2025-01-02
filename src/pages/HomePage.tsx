import React, { useEffect, useState } from 'react'
import { AnimatedBackground } from '../components/background/AnimatedBackground'
import { Toaster } from 'react-hot-toast'
import { Header } from '../components/layout/Header'
import { CreatePost } from '../components/posts/CreatePost'
import { Post } from '../types';
import { PostList } from '../components/posts/PostList'
import { ChatWindow } from '../components/chat/ChatWindow'
import { useFirebase } from '../firebase'
import { Link } from 'react-router-dom'

function HomePage({posts, setPosts}: {posts: Post[], setPosts: React.Dispatch<React.SetStateAction<Post[]>>}) {
      const { receivedMessages, handleReceiveMessage } = useFirebase();
    useEffect(() => {
        handleReceiveMessage()
    },[])
  return (
    <div className="min-h-screen ">
    <AnimatedBackground/>
    <Toaster position="top-center" />
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <CreatePost setPosts={setPosts}/>
        <PostList posts={posts} setPosts={setPosts} />
      </div>
      <div>
        <Link to='/videochat'>
        <div className="glass-card rounded-lg h-[calc(100vh-50rem)] justify-center p-2 flex flex-col text-xl font-bold mb-4 text-gray-800 transform transition-transform duration-150 hover:scale-[1.01]">
            Lets Omegle
        </div>
        </Link>
        <ChatWindow messages={receivedMessages} />
      </div>
    </main>
  </div>
  )
}

export default HomePage
