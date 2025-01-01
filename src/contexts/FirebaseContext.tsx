import { createContext, useContext } from 'react';
import { Post, Message } from '../types';

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

export const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};