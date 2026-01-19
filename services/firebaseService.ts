
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs,
  enableIndexedDbPersistence,
  terminate
} from 'firebase/firestore';
import { UserState, AdminStats, UserRole } from '../types';

// Use a truly placeholder-looking project ID to avoid accidental attempts on locked projects
const firebaseConfig = {
  apiKey: process.env.API_KEY || "",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "placeholder-project-id", // Changed from 'soneul-app' to be clearly a placeholder
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "000000000",
  appId: "1:000000000:web:000000000"
};

let db: any = null;

const initializeFirebase = async () => {
  // If no valid-looking API key is present, don't even try Firestore to avoid 403/404 noise
  const hasValidConfig = firebaseConfig.apiKey && 
                         firebaseConfig.apiKey !== "dummy-key" && 
                         firebaseConfig.projectId !== "placeholder-project-id";

  if (!hasValidConfig) return;

  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const firestore = getFirestore(app);
    
    // Enable offline persistence
    if (typeof window !== 'undefined') {
      try {
        await enableIndexedDbPersistence(firestore);
      } catch (err: any) {
        if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
          // Just ignore persistence errors, not critical
        }
      }
    }
    db = firestore;
  } catch (e) {
    // Silent fail for initialization - app will rely on LocalStorage
    db = null;
  }
};

// Start initialization immediately but silently
initializeFirebase();

export const saveUserData = async (user: UserState) => {
  if (!user.id) return;
  
  // 1. Core storage: LocalStorage (Primary and Reliable)
  localStorage.setItem(`soneul_backup_${user.id}`, JSON.stringify(user));

  // 2. Optional sync: Firestore (Secondary)
  if (db) {
    try {
      await setDoc(doc(db, 'users', user.id), user, { merge: true });
    } catch (error: any) {
      // If we get a permission error, we null out db to stop future noise
      if (error.code === 'permission-denied' || error.code === 'not-found') {
        db = null;
      }
    }
  }
};

export const loadUserData = async (id: string): Promise<UserState | null> => {
  // 1. Try Firestore if we think we have a connection
  if (db) {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserState;
        localStorage.setItem(`soneul_backup_${id}`, JSON.stringify(data));
        return data;
      }
    } catch (error: any) {
      // Permission issues or project not found - stop trying this session
      if (error.code === 'permission-denied' || error.code === 'not-found') {
        db = null;
      }
    }
  }
  
  // 2. Reliable fallback to LocalStorage
  const localData = localStorage.getItem(`soneul_backup_${id}`);
  return localData ? JSON.parse(localData) : null;
};

export const getAdminStats = async (): Promise<AdminStats> => {
  const emptyStats: AdminStats = { 
    totalStudents: 0, 
    avgScore: 0, 
    totalXP: 0, 
    levelDistribution: {}, 
    topStudents: [] 
  };
  
  if (!db) return emptyStats;

  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const allUsers: UserState[] = [];
    usersSnap.forEach((doc) => {
      const data = doc.data() as UserState;
      if (data.role !== UserRole.TEACHER) {
        allUsers.push(data);
      }
    });

    if (allUsers.length === 0) return emptyStats;

    const levelDist: Record<number, number> = {};
    let totalScore = 0;
    let totalXpCount = 0;
    let totalRecords = 0;

    allUsers.forEach(u => {
      levelDist[u.level] = (levelDist[u.level] || 0) + 1;
      totalXpCount += u.xp;
      u.history.forEach(h => {
        totalScore += h.score;
        totalRecords++;
      });
    });

    return {
      totalStudents: allUsers.length,
      avgScore: totalRecords > 0 ? Math.round(totalScore / totalRecords) : 0,
      totalXP: totalXpCount,
      levelDistribution: levelDist,
      topStudents: [...allUsers].sort((a, b) => (b.level * 1000 + b.xp) - (a.level * 1000 + a.xp)).slice(0, 5)
    };
  } catch (error: any) {
    if (error.code === 'permission-denied' || error.code === 'not-found') {
      db = null;
    }
    return emptyStats;
  }
};
