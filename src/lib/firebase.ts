import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfxU7b62OI6XLGA7UVBu5MaINXT4rjwkE",
  authDomain: "kisan-mind-25639.firebaseapp.com",
  projectId: "kisan-mind-25639",
  storageBucket: "kisan-mind-25639.firebasestorage.app",
  messagingSenderId: "523991745145",
  appId: "1:523991745145:web:a2bc2803aa60a9d5770aa8",
  measurementId: "G-LMBVJ48JMV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export default app;