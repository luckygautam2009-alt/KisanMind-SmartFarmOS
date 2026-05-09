import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc,
  collection, addDoc, getDocs, query, where, orderBy, deleteDoc
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FarmDetails {
  totalLand: string;
  primaryCrop: string;
  secondaryCrop: string;
  soilType: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership: string;
  photoURL?: string;
  farmDetails: FarmDetails;
}

export interface ScanRecord {
  id?: string;
  userId: string;
  title: string;
  result: string;
  imageBase64?: string;
  date: string;
  confidence?: string;
  disease?: string;
}

export interface TimetableRecord {
  id?: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

interface UserContextType {
  user: UserData | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  scanHistory: ScanRecord[];
  timetables: TimetableRecord[];
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUser: (data: Partial<UserData>) => Promise<void>;
  updateFarmDetails: (data: Partial<FarmDetails>) => Promise<void>;
  saveScan: (scan: Omit<ScanRecord, 'id' | 'userId'>) => Promise<void>;
  deleteScan: (scanId: string) => Promise<void>;
  saveTimetable: (plan: Omit<TimetableRecord, 'id' | 'userId'>) => Promise<void>;
}

// ─── Context Default ──────────────────────────────────────────────────────────
const UserContext = createContext<UserContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  scanHistory: [],
  timetables: [],
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOutUser: async () => {},
  updateUser: async () => {},
  updateFarmDetails: async () => {},
  saveScan: async () => {},
  deleteScan: async () => {},
  saveTimetable: async () => {},
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DEFAULT_FARM_DETAILS: FarmDetails = {
  totalLand: '',
  primaryCrop: '',
  secondaryCrop: '',
  soilType: '',
};

async function createOrFetchUserDoc(firebaseUser: FirebaseUser): Promise<UserData> {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as UserData;
  }

  const newUser: UserData = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'KisanMind+ Farmer',
    email: firebaseUser.email || '',
    phone: '',
    membership: 'Free Member',
    photoURL: firebaseUser.photoURL || '',
    farmDetails: DEFAULT_FARM_DETAILS,
  };
  await setDoc(ref, newUser);
  return newUser;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [timetables, setTimetables] = useState<TimetableRecord[]>([]);

  // ── Auth State Listener ───────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userData = await createOrFetchUserDoc(fbUser);
        setUser(userData);
        // Load user's data from Firestore
        await loadScanHistory(fbUser.uid);
        await loadTimetables(fbUser.uid);
      } else {
        setFirebaseUser(null);
        setUser(null);
        setScanHistory([]);
        setTimetables([]);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Data Loaders ─────────────────────────────────────────────────────────
  const loadScanHistory = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'scans'),
        where('userId', '==', uid),
        orderBy('date', 'desc')
      );
      const snap = await getDocs(q);
      const records: ScanRecord[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as ScanRecord));
      setScanHistory(records);
      // Also cache in localStorage for offline use
      try { localStorage.setItem('kisanmind_recent_scans', JSON.stringify(records.slice(0, 4))); } catch {}
    } catch (e) {
      // Fallback to localStorage if Firestore not available
      const saved = localStorage.getItem('kisanmind_recent_scans');
      if (saved) setScanHistory(JSON.parse(saved));
    }
  };

  const loadTimetables = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'timetables'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setTimetables(snap.docs.map(d => ({ id: d.id, ...d.data() } as TimetableRecord)));
    } catch (e) {
      console.log('Timetables not loaded from Firestore:', e);
    }
  };

  // ── Auth Actions ──────────────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const userData = await createOrFetchUserDoc(result.user);
    setUser(userData);
    await loadScanHistory(result.user.uid);
    await loadTimetables(result.user.uid);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userData = await createOrFetchUserDoc(result.user);
    setUser(userData);
    await loadScanHistory(result.user.uid);
    await loadTimetables(result.user.uid);
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    const userData = await createOrFetchUserDoc({ ...result.user, displayName: name });
    setUser(userData);
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    setScanHistory([]);
    setTimetables([]);
    localStorage.removeItem('kisanmind_recent_scans');
  };

  // ── Firestore Updates ─────────────────────────────────────────────────────
  const updateUser = async (data: Partial<UserData>) => {
    if (!firebaseUser) return;
    const ref = doc(db, 'users', firebaseUser.uid);
    await updateDoc(ref, data as Record<string, unknown>);
    setUser(prev => prev ? { ...prev, ...data } : null);
    const profile: { displayName?: string; photoURL?: string } = {};
    if (data.name !== undefined) profile.displayName = data.name;
    if (data.photoURL !== undefined) profile.photoURL = data.photoURL;
    if (Object.keys(profile).length > 0) {
      try {
        await updateProfile(firebaseUser, profile);
      } catch {
        // Firestore profile still updates; Auth may reject very long or non-HTTP photo URLs.
      }
    }
  };

  const updateFarmDetails = async (data: Partial<FarmDetails>) => {
    if (!firebaseUser || !user) return;
    const updatedFarm = { ...user.farmDetails, ...data };
    const ref = doc(db, 'users', firebaseUser.uid);
    await updateDoc(ref, { farmDetails: updatedFarm });
    setUser(prev => prev ? { ...prev, farmDetails: updatedFarm } : null);
  };

  const saveScan = async (scan: Omit<ScanRecord, 'id' | 'userId'>) => {
    const uid = firebaseUser?.uid;
    if (!uid) {
      const record: ScanRecord = { ...scan, userId: 'guest', id: Date.now().toString() };
      setScanHistory(prev => {
        const next = [record, ...prev].slice(0, 10);
        try { localStorage.setItem('kisanmind_recent_scans', JSON.stringify(next.slice(0, 4))); } catch {}
        return next;
      });
      return;
    }
    const record: ScanRecord = { ...scan, userId: uid };
    const docRef = await addDoc(collection(db, 'scans'), record);
    const newRecord = { ...record, id: docRef.id };
    setScanHistory(prev => {
      const next = [newRecord, ...prev].slice(0, 20);
      try { localStorage.setItem('kisanmind_recent_scans', JSON.stringify(next.slice(0, 4))); } catch {}
      return next;
    });
  };

  const deleteScan = async (scanId: string) => {
    if (firebaseUser) {
      await deleteDoc(doc(db, 'scans', scanId));
    }
    setScanHistory(prev => prev.filter(s => s.id !== scanId));
  };

  const saveTimetable = async (plan: Omit<TimetableRecord, 'id' | 'userId'>) => {
    const uid = firebaseUser?.uid;
    if (!uid) return;
    const record: TimetableRecord = { ...plan, userId: uid };
    const docRef = await addDoc(collection(db, 'timetables'), record);
    setTimetables(prev => [{ ...record, id: docRef.id }, ...prev]);
  };

  return (
    <UserContext.Provider value={{
      user, firebaseUser, loading,
      scanHistory, timetables,
      signInWithGoogle, signInWithEmail, signUpWithEmail, signOutUser,
      updateUser, updateFarmDetails,
      saveScan, deleteScan, saveTimetable,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
