import { 
  addDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from './config';
import { Post } from '../../types';
import toast from 'react-hot-toast';

const POSTS_PATH = "gossip app/YpW7JwfgjN6UsnO9T5vE/post";

export const createPost = async (description: string) => {
  try {
    const postRef = collection(db, POSTS_PATH);
    await addDoc(postRef, {
      description,
      likes: 0,
      dislikes: 0,
      hide: false,
      likedBy: [],
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error adding document", err);
    toast.error('Failed to create post');
  }
};

export const getPosts = async (): Promise<Post[]> => {
  const postRef = collection(db, POSTS_PATH);
  const q = query(postRef, where("hide", "==", false), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Post, 'id'>)
  }));
};

export const likePost = async (postId: string, userId: string) => {
  const postRef = doc(db, POSTS_PATH, postId);
  const postSnap = await getDoc(postRef);
  const postData = postSnap.data() as Post;
  const likedBy = postData.likedBy || [];

  if (!likedBy.includes(userId)) {
    await updateDoc(postRef, {
      likes: postData.likes + 1,
      likedBy: [...likedBy, userId],
    });
    toast.success("You liked the post");
    return postData.likes + 1;
  } else {
    toast.error("You already liked this post");
    return postData.likes;
  }
};

export const dislikePost = async (postId: string, userId: string) => {
  const postRef = doc(db, POSTS_PATH, postId);
  const postSnap = await getDoc(postRef);
  const postData = postSnap.data() as Post;
  const dislikedBy = postData.dislikedBy || [];

  if (!dislikedBy.includes(userId)) {
    await updateDoc(postRef, {
      dislikes: postData.dislikes + 1,
      dislikedBy: [...dislikedBy, userId],
    });
    toast.success("You disliked the post");
    return postData.dislikes + 1;
  } else {
    toast.error("You already disliked this post");
    return postData.dislikes;
  }
};