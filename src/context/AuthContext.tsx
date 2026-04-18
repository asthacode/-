import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

type UserRole = 'guide' | 'traveler' | null;

interface AuthContextType {
  user: any;
  role: UserRole;
  login: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch custom profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ ...firebaseUser, ...userData });
          setRole(userData.role as UserRole);
        } else {
          // If no profile, we'll need to create one (handled in Login/Register)
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (selectedRole: UserRole) => {
    // This is called after Firebase phone verification succeeds
    if (auth.currentUser) {
      const firebaseUser = auth.currentUser;
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create initial profile
        const newProfile = {
          uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
          role: selectedRole,
          status: 'active',
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
        setUser({ ...firebaseUser, ...newProfile });
        setRole(selectedRole);
      } else {
        const userData = userDoc.data();
        setUser({ ...firebaseUser, ...userData });
        setRole(userData.role as UserRole);
      }
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
