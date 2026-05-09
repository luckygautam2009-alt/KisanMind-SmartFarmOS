import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDMSn7ib3shZk6knw2Ot82e7wtU7FpvP5s",
  authDomain: "kisanmindplus.firebaseapp.com",
  projectId: "kisanmindplus",
  storageBucket: "kisanmindplus.firebasestorage.app",
  messagingSenderId: "663550963237",
  appId: "1:663550963237:web:5d9f85f7d6fc685ff659cc",
  measurementId: "G-CL0ZL2LBBN"
};

// Avoid re-initializing on hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

