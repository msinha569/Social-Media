import  { useState, useEffect } from 'react';
import { useFirebase } from './contexts/FirebaseContext';
import { Toaster } from 'react-hot-toast';
import { Post } from './types';
import { AuthForm } from './components/auth/AuthForm';
import { AnimatedBackground } from './components/background/AnimatedBackground';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VideoChat from './pages/VideoChat';
import { FirebaseProvider } from './firebase';

function App() {
  const { loggedInUser, readData } = useFirebase();
  const [posts, setPosts] = useState<Post[]>([]);

  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <HomePage posts={posts} setPosts={setPosts} />,
    },
    {
      path: '/videochat',
      element: <VideoChat/>
    }
  ])

  useEffect(() => {
    if (loggedInUser) {
      readData(setPosts);
    }
  }, [loggedInUser]);

  if (!loggedInUser) {
    return (
      <>
        <AnimatedBackground/>
        <Toaster position="top-center" />
        <AuthForm />
      </>
    );
  }

  return (
    <FirebaseProvider>
    <RouterProvider router={appRouter}/>
    </FirebaseProvider>
  );
}

export default App;