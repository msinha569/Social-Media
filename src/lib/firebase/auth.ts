import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from "firebase/auth";
import { auth } from './config';
import toast from 'react-hot-toast';

export const signUpUser = async (email: string, password: string, username: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: username,
    });
    return userCredential.user;
  } catch (error: any) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err: any) {
    toast.error(err.message);
    throw new Error(err.message);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
    toast.error('Failed to sign out');
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent');
  } catch (err: any) {
    throw new Error(err.message);
  }
};