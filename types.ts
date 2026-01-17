
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
}

export interface AdminStats {
  totalStudents: number;
  avgScore: number;
  totalXP: number;
  levelDistribution: Record<number, number>;
  topStudents: UserState[];
}
