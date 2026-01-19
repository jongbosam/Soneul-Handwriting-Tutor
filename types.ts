
export enum AppScreen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  PRACTICE = 'PRACTICE',
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum ToolType {
  PEN = 'PEN',
  ERASER = 'ERASER',
}

export interface UserState {
  id: string;
  name: string;
  role: UserRole;
  level: number;
  levelName: string;
  xp: number;
  maxXp: number;
  history: PracticeRecord[];
}

export interface PracticeRecord {
  id: string;
  word: string;
  score: number;
  date: string;
  xpEarned: number;
}

export interface FeedbackResult {
  score: number;
  message: string;
  earnedXp: number;
  metrics: {
    composition: number; // 자소 배치 (K-PANOSE 1)
    balance: number;      // 비례 균형 (K-PANOSE 2)
    center: number;       // 시각적 중심 (K-PANOSE 4)
    space: number;        // 속공간/여백 (K-PANOSE 7)
  };
}

export interface AdminStats {
  totalStudents: number;
  avgScore: number;
  totalXP: number;
  levelDistribution: Record<number, number>;
  topStudents: UserState[];
}
