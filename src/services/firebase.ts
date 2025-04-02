import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaBUr3yXAUIUSlr2c3uu0mLlcmD9tSSms",
  authDomain: "pedido-lanche-db.firebaseapp.com",
  projectId: "pedido-lanche-db",
  storageBucket: "pedido-lanche-db.firebasestorage.app",
  messagingSenderId: "140544718420",
  appId: "1:140544718420:web:20e504926c3a789973dfc1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);