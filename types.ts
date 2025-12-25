export enum AppScreen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PRACTICE = 'PRACTICE',
}

export enum ToolType {
  PEN = 'PEN',
  ERASER = 'ERASER',
}

export interface UserState {
  id: string;
  name: string;
  level: number;
  levelName: string;
  xp: number;
  maxXp: number;
}

export interface FeedbackResult {
  score: number;
  message: string;
  earnedXp: number;
}