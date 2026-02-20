// FILE PATH: src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SavedAddress {
  id: string;
  label: string; // e.g. "Home", "Office"
  address: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string; // 'NG' | 'CA'
  addresses: SavedAddress[];
  createdAt: unknown;
  updatedAt: unknown;
}

interface AuthContextValue {
  user:          User | null;
  profile:       UserProfile | null;
  loading:       boolean;
  // Auth actions
  register:      (email: string, password: string, firstName: string, lastName: string, phone: string, country: string) => Promise<void>;
  login:         (email: string, password: string) => Promise<void>;
  logout:        () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  // Profile actions
  updateUserProfile: (data: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'phone'>>) => Promise<void>;
  addAddress:        (addr: Omit<SavedAddress, 'id'>) => Promise<void>;
  updateAddress:     (id: string, addr: Partial<SavedAddress>) => Promise<void>;
  deleteAddress:     (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile from Firestore
  const loadProfile = async (uid: string) => {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) setProfile(snap.data() as UserProfile);
  };

  // Watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Register ────────────────────────────────────────────────────────────────
  const register = async (
    email: string, password: string,
    firstName: string, lastName: string,
    phone: string, country: string,
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: `${firstName} ${lastName}` });

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      firstName,
      lastName,
      phone,
      country,
      addresses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    setProfile(newProfile);
  };

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will pick up the user and load profile
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  // ── Reset Password ──────────────────────────────────────────────────────────
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // ── Update Profile ──────────────────────────────────────────────────────────
  const updateUserProfile = async (data: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'phone'>>) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    if (data.firstName || data.lastName) {
      await updateProfile(user, {
        displayName: `${data.firstName ?? profile?.firstName} ${data.lastName ?? profile?.lastName}`,
      });
    }
    setProfile(prev => prev ? { ...prev, ...data } : prev);
  };

  // ── Address Helpers ─────────────────────────────────────────────────────────
  const addAddress = async (addr: Omit<SavedAddress, 'id'>) => {
    if (!user || !profile) return;
    const newAddr: SavedAddress = { ...addr, id: crypto.randomUUID() };
    const addresses = addr.isDefault
      ? [...profile.addresses.map(a => ({ ...a, isDefault: false })), newAddr]
      : [...profile.addresses, newAddr];
    await updateDoc(doc(db, 'users', user.uid), { addresses, updatedAt: serverTimestamp() });
    setProfile(prev => prev ? { ...prev, addresses } : prev);
  };

  const updateAddress = async (id: string, data: Partial<SavedAddress>) => {
    if (!user || !profile) return;
    const addresses = profile.addresses.map(a => a.id === id ? { ...a, ...data } : a);
    await updateDoc(doc(db, 'users', user.uid), { addresses, updatedAt: serverTimestamp() });
    setProfile(prev => prev ? { ...prev, addresses } : prev);
  };

  const deleteAddress = async (id: string) => {
    if (!user || !profile) return;
    const addresses = profile.addresses.filter(a => a.id !== id);
    await updateDoc(doc(db, 'users', user.uid), { addresses, updatedAt: serverTimestamp() });
    setProfile(prev => prev ? { ...prev, addresses } : prev);
  };

  const setDefaultAddress = async (id: string) => {
    if (!user || !profile) return;
    const addresses = profile.addresses.map(a => ({ ...a, isDefault: a.id === id }));
    await updateDoc(doc(db, 'users', user.uid), { addresses, updatedAt: serverTimestamp() });
    setProfile(prev => prev ? { ...prev, addresses } : prev);
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      register, login, logout, resetPassword,
      updateUserProfile,
      addAddress, updateAddress, deleteAddress, setDefaultAddress,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
