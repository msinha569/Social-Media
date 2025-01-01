import { 
  initializeApp 
} from "firebase/app";
import {  
  getFirestore, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  orderBy, 
  onSnapshot, 
  limit, 
  getDoc 
} from "firebase/firestore";
import { 
  useContext, 
  createContext, 
  useState, 
  useEffect 
} from "react";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail as firebaseSendPasswordResetEmail 
} from "firebase/auth";
import toast from "react-hot-toast";
import { Post, Message } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyB1xA_bQuoDmnMWF5wsHs2lL9m8T5uo0bQ",
  authDomain: "niu-gossip.firebaseapp.com",
  projectId: "niu-gossip",
  storageBucket: "niu-gossip.appspot.com",
  messagingSenderId: "801433210710",
  appId: "1:801433210710:web:7863f166297605f420d0f7",
  measurementId: "G-TT5097B7GW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  const [renderKey, setRenderKey] = useState(0);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);

  const forceRender = () => setRenderKey((prevKey) => prevKey + 1);

  const auth = getAuth();

  const signUpUser = async (email: string, password: string, user: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: user,
      });
      setLoggedInUser(user);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleSigningIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      user.displayName === null ? setLoggedInUser(user.email) : setLoggedInUser(user.displayName);
      return user;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const checkForUser = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || user.email;
        setLoggedInUser(displayName);
        toast.success(`Welcome back, ${displayName}!`);
      } else {
        setLoggedInUser(null);
      }
    });
    return unsubscribe;
  };
  
  useEffect(() => {
    const unsubscribe = checkForUser();
    return () => unsubscribe();
  }, []);

  const signingOut = async () => {
    try {
      await signOut(auth);
      setLoggedInUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handlePostEvent = async (post: string, setPost: (post: string) => void) => {
    try {
      const postRef = collection(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post");
      await addDoc(postRef, {
        description: post,
        likes: 0,
        dislikes: 0,
        hide: false,
        likedBy: [],
        timestamp: serverTimestamp(),
      });
      setPost("");
      forceRender();
    } catch (err) {
      console.log("Error adding document", err);
    }
  };

  const readData = async (setPost: (posts: Post[]) => void) => {
    const postRef = collection(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post");
    const q = query(postRef, where("hide", "==", false), orderBy("timestamp", "desc"));
    const postArray: Post[] = [];
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((element) => {
      const postData = element.data() as Omit<Post, 'id'>;
      const postId = element.id;
      postArray.push({
        id: postId,
        ...postData,
      });
    });
    setPost(postArray);
  };

  const handleLikeCount = async (likeCount: number, setLikeCount: (count: number) => void, p: Post, user: string) => {
    const postRef = doc(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post", p.id);
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data() as Post;
    const likedBy = postData.likedBy || [];
    if (!likedBy.includes(user)) {
      await updateDoc(postRef, {
        likes: postData.likes + 1,
        likedBy: [...likedBy, user],
      });
      setLikeCount(likeCount + 1);
      toast.success("You liked the post");
    } else {
      toast.error("You already liked it");
    }
  };

  const handleDislikeCount = async (dislikeCount: number, setDislikeCount: (count: number) => void, p: Post, user: string) => {
    const postRef = doc(db, "gossip app/YpW7JwfgjN6UsnO9T5vE/post", p.id);
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data() as Post;
    const dislikedBy = postData.dislikedBy || [];
    
    if (!dislikedBy.includes(user)) {
      await updateDoc(postRef, {
        dislikes: postData.dislikes + 1,
        dislikedBy: [...dislikedBy, user],
      });
      setDislikeCount(dislikeCount + 1);
      toast.success("You disliked the post");
    } else {
      toast.error("You already disliked this post");
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      const messageRef = collection(db, 'chats');
      await addDoc(messageRef, {
        message: message,
        timestamp: serverTimestamp(),
        user: loggedInUser
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleReceiveMessage = () => {
    const messageRef = collection(db, 'chats');
    const q = query(messageRef, orderBy("timestamp", "asc"));
    
    onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Message[];
      setReceivedMessages(messages);
    });
  };

  const value = {
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
    handleSigningIn,
    sendPasswordResetEmail
  };

  useEffect(() => {
    const cleanUpMessages = async () => {
      const messageRef = collection(db, 'chats');
      const q = query(messageRef, orderBy("timestamp", "asc"));
      const snapshot = await getDocs(q);
      
      const totalMessages = snapshot.docs.length;
      const messagesToDelete = totalMessages - 50;
      
      if (messagesToDelete > 0) {
        const deleteBatch = snapshot.docs.slice(0, messagesToDelete);
        for (const message of deleteBatch) {
          await deleteDoc(doc(db, 'chats', message.id));
        }
      }
    };
    cleanUpMessages();
  }, []);

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