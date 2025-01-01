import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1xA_bQuoDmnMWF5wsHs2lL9m8T5uo0bQ",
  authDomain: "niu-gossip.firebaseapp.com",
  projectId: "niu-gossip",
  storageBucket: "niu-gossip.appspot.com",
  messagingSenderId: "801433210710",
  appId: "1:801433210710:web:7863f166297605f420d0f7",
  measurementId: "G-TT5097B7GW"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);