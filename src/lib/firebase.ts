import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  getDocFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { GvcnClassInfo, GvcnStudent, GvcnWeeklyRecord, GvcnClassRule } from '../types';

export const SUPER_ADMIN_EMAIL = 'dvtrong.spdt09@gmail.com';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firestore with custom database ID from config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore client is offline.');
    }
    return false;
  }
}

// Check initial connection silently
testFirestoreConnection().catch(() => {});

// Authentication Helpers
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    // If popup was blocked or iframe restriction occurs, try redirect
    if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/popup-closed-by-user') {
      console.warn('Popup blocked, attempting redirect fallback:', err);
    }
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export interface WhitelistEntry {
  email: string;
  name?: string;
  addedBy?: string;
  addedAt?: string;
  role?: 'admin' | 'teacher';
}

export interface AuthAccessCheck {
  isAllowed: boolean;
  isSuperAdmin: boolean;
  role: 'admin' | 'teacher' | 'unauthorized';
  reason?: string;
}

// Clean email key for Firestore document IDs (e.g., dvtrong_spdt09_gmail_com)
export function sanitizeEmailForDocId(email: string): string {
  return email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
}

// Fetch all whitelist entries (for Admin UI)
export async function getWhitelistUsers(): Promise<WhitelistEntry[]> {
  try {
    const snapshot = await getDocs(collection(db, 'whitelist_users'));
    const list: WhitelistEntry[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as WhitelistEntry;
      if (data && data.email) {
        list.push(data);
      }
    });

    // Ensure super admin is always represented in list
    if (!list.some((u) => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase())) {
      list.unshift({
        email: SUPER_ADMIN_EMAIL,
        name: 'Quản trị viên trưởng',
        role: 'admin',
        addedAt: 'Hệ thống gốc',
      });
    }

    return list;
  } catch (err) {
    console.error('Failed to load whitelist from cloud:', err);
    return [
      {
        email: SUPER_ADMIN_EMAIL,
        name: 'Quản trị viên trưởng',
        role: 'admin',
        addedAt: 'Hệ thống gốc',
      },
    ];
  }
}

// Add an email to the whitelist
export async function addEmailToWhitelist(
  email: string,
  name?: string,
  adminUser?: User | null
): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  const docId = sanitizeEmailForDocId(cleanEmail);
  const docRef = doc(db, 'whitelist_users', docId);

  await setDoc(docRef, {
    email: cleanEmail,
    name: name || '',
    addedBy: adminUser?.email || 'admin',
    addedAt: new Date().toISOString(),
    role: 'teacher',
  });
}

// Remove an email from the whitelist
export async function removeEmailFromWhitelist(email: string): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Không thể xóa quyền của Quản trị viên trưởng!');
  }
  const docId = sanitizeEmailForDocId(cleanEmail);
  await deleteDoc(doc(db, 'whitelist_users', docId));
}

// Verify if an authenticated user is permitted
export async function checkUserAuthorization(user: User | null): Promise<AuthAccessCheck> {
  if (!user || !user.email) {
    return { isAllowed: false, isSuperAdmin: false, role: 'unauthorized', reason: 'Chưa đăng nhập' };
  }

  const userEmail = user.email.toLowerCase().trim();

  // 1. Check Super Admin email
  if (userEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { isAllowed: true, isSuperAdmin: true, role: 'admin' };
  }

  // 2. Query Firestore whitelist
  try {
    const docId = sanitizeEmailForDocId(userEmail);
    const docSnap = await getDoc(doc(db, 'whitelist_users', docId));
    if (docSnap.exists()) {
      const data = docSnap.data() as WhitelistEntry;
      return {
        isAllowed: true,
        isSuperAdmin: false,
        role: data.role === 'admin' ? 'admin' : 'teacher',
      };
    }
  } catch (err) {
    console.warn('Could not verify whitelist online, fallback checking:', err);
  }

  // 3. Fallback to localStorage whitelist if saved previously
  try {
    const localWhitelist = JSON.parse(localStorage.getItem('gvcn_whitelist_cache') || '[]');
    if (Array.isArray(localWhitelist) && localWhitelist.includes(userEmail)) {
      return { isAllowed: true, isSuperAdmin: false, role: 'teacher' };
    }
  } catch (e) {}

  return {
    isAllowed: false,
    isSuperAdmin: false,
    role: 'unauthorized',
    reason: `Tài khoản ${user.email} chưa được cấp quyền sử dụng hệ thống này.`,
  };
}

// Sync Payload for GVCN data
export interface GvcnCloudPayload {
  classInfo: GvcnClassInfo;
  students: GvcnStudent[];
  weeklyRecords?: GvcnWeeklyRecord[];
  rules?: GvcnClassRule[];
  lastUpdated: string;
  syncedByEmail: string;
}

// Subscribe to real-time updates for a teacher's GVCN data across devices with the same Gmail
export function subscribeToGvcnData(
  userId: string,
  onData: (payload: GvcnCloudPayload) => void,
  onError?: (err: any) => void
) {
  const docRef = doc(db, 'users', userId, 'gvcn_data', 'main');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as GvcnCloudPayload;
        if (data && data.students) {
          onData(data);
        }
      }
    },
    (error) => {
      console.error('Real-time sync error:', error);
      if (onError) onError(error);
    }
  );
}

// Save / Push GVCN data to Firestore
export async function syncGvcnDataToCloud(
  userId: string,
  userEmail: string,
  data: {
    classInfo: GvcnClassInfo;
    students: GvcnStudent[];
    weeklyRecords?: GvcnWeeklyRecord[];
    rules?: GvcnClassRule[];
  }
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'gvcn_data', 'main');
  const payload: GvcnCloudPayload = {
    classInfo: data.classInfo,
    students: data.students,
    weeklyRecords: data.weeklyRecords || [],
    rules: data.rules || [],
    lastUpdated: new Date().toISOString(),
    syncedByEmail: userEmail,
  };

  await setDoc(docRef, payload, { merge: true });
}
