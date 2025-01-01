import { 
  addDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  limit 
} from "firebase/firestore";
import { db } from './config';
import { Message } from '../../types';
import toast from 'react-hot-toast';

const CHATS_COLLECTION = 'chats';
const MESSAGE_LIMIT = 50;

export const sendMessage = async (message: string, userId: string) => {
  try {
    const messageRef = collection(db, CHATS_COLLECTION);
    await addDoc(messageRef, {
      message,
      timestamp: serverTimestamp(),
      user: userId
    });
  } catch (err) {
    console.error(err);
    toast.error('Failed to send message');
  }
};

export const subscribeToMessages = (callback: (messages: Message[]) => void) => {
  const messageRef = collection(db, CHATS_COLLECTION);
  const q = query(messageRef, orderBy("timestamp", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Message[];
    callback(messages);
  });
};

export const cleanupOldMessages = async () => {
  try {
    const messageRef = collection(db, CHATS_COLLECTION);
    const q = query(messageRef, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    
    const totalMessages = snapshot.docs.length;
    const messagesToDelete = totalMessages - MESSAGE_LIMIT;
    
    if (messagesToDelete > 0) {
      const deleteBatch = snapshot.docs.slice(0, messagesToDelete);
      await Promise.all(
        deleteBatch.map(message => deleteDoc(doc(db, CHATS_COLLECTION, message.id)))
      );
    }
  } catch (error) {
    console.error("Error cleaning up messages:", error);
  }
};