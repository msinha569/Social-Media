import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../lib/firebase/config';
import { signUpUser, signIn, signOutUser, sendPasswordReset } from '../lib/firebase/auth';
import { createPost, getPosts, likePost, dislikePost } from '../lib/firebase/posts';
import { sendMessage, subscribeToMessages, cleanupOldMessages } from '../lib/firebase/chat';
import { Post, Message } from '../types';
import toast from 'react-hot-toast';

interface FirebaseContextType {
  handlePostEvent: (post: string, setPost: (post: string) => void) => Promise<void>;
  readData: (setPosts: (posts: Post[]) => void) => Promise<void>;
  handleDislikeCount: (dislikeCount: number, setDislikeCount: (count: number) => void, post: Post, user: string) => Promise<void>;
  handleLikeCount: (likeCount: number, setLikeCount: (count: number) => void, post: Post, user: string) => Promise<void>;
  signUpUser: (email: string, password: string, user: string) => Promise<any>;
  loggedInUser: string | null;
  signingOut: () => Promise<void>;
  handleSendMessage: (message: string) => Promise<void>;
  receivedMessages: Message[];
  handleReceiveMessage: () => void;
  handleSigningIn: (email: string, password: string) => Promise<any>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || user.email;
        setLoggedInUser(displayName);
        toast.success(`Welcome back, ${displayName}!`);
      } else {
        setLoggedInUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    cleanupOldMessages();
  }, []);

  const handlePostEvent = async (post: string, setPost: (post: string) => void) => {
    await createPost(post);
    setPost("");
  };

  const readData = async (setPosts: (posts: Post[]) => void) => {
    const posts = await getPosts();
    setPosts(posts);
  };

  const handleLikeCount = async (likeCount: number, setLikeCount: (count: number) => void, p: Post, user: string) => {
    const newCount = await likePost(p.id, user);
    setLikeCount(newCount);
  };

  const handleDislikeCount = async (dislikeCount: number, setDislikeCount: (count: number) => void, p: Post, user: string) => {
    const newCount = await dislikePost(p.id, user);
    setDislikeCount(newCount);
  };

  const handleSendMessage = async (message: string) => {
    if (loggedInUser) {
      await sendMessage(message, loggedInUser);
    }
  };

  const handleReceiveMessage = () => {
    return subscribeToMessages(setReceivedMessages);
  };

  const value = {
    handlePostEvent,
    readData,
    handleDislikeCount,
    handleLikeCount,
    signUpUser,
    loggedInUser,
    signingOut: signOutUser,
    handleSendMessage,
    receivedMessages,
    handleReceiveMessage,
    handleSigningIn: signIn,
    sendPasswordResetEmail: sendPasswordReset
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};