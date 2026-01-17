
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { UserState, AdminStats, UserRole } from '../types';

// Note: In a real app, replace these with your actual Firebase config.
// For now, we'll try to use the environment key if available as a placeholder.
const firebaseConfig = {
  apiKey: process.env.API_KEY || "dummy-key",
  authDomain: "soneul-app.firebaseapp.com",
  projectId: "soneul-app",
  storageBucket: "soneul-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase only if it's not already initialized
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveUserData = async (user: UserState) => {
  if (!user.id) return;
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    // Fallback to localStorage
    localStorage.setItem(`soneul_data_${user.id}`, JSON.stringify(user));
  }
};

export const loadUserData = async (id: string): Promise<UserState | null> => {
  try {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserState;
    }
  } catch (error) {
    console.error("Error loading from Firestore:", error);
  }
  
  // Fallback to localStorage
  const localData = localStorage.getItem(`soneul_data_${id}`);
  return localData ? JSON.parse(localData) : null;
};

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const allUsers: UserState[] = [];
    usersSnap.forEach((doc) => {
      const data = doc.data() as UserState;
      if (data.role !== UserRole.TEACHER) {
        allUsers.push(data);
      }
    });

    if (allUsers.length === 0) {
      return { totalStudents: 0, avgScore: 0, totalXP: 0, levelDistribution: {}, topStudents: [] };
    }

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
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { totalStudents: 0, avgScore: 0, totalXP: 0, levelDistribution: {}, topStudents: [] };
  }
};
