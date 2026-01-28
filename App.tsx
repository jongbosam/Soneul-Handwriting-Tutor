
import React, { useState, useEffect } from 'react';
import { AppScreen, UserState, FeedbackResult, PracticeRecord, UserRole } from './types';
import { LEVELS, PRACTICE_WORDS, LevelData } from './constants';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PracticeCanvas } from './components/PracticeCanvas';
import { ResultModal } from './components/ResultModal';
import { LevelUpModal } from './components/LevelUpModal';
import { CustomCursor } from './components/CustomCursor';
import { analyzeHandwriting } from './services/mockAiService';
import { saveUserData, loadUserData } from './services/firebaseService';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  
  const [user, setUser] = useState<UserState>({
    id: '',
    name: '학생',
    role: UserRole.STUDENT,
    level: 1,
    levelName: LEVELS[0].name,
    xp: 0,
    maxXp: LEVELS[0].maxXp,
    history: []
  });

  useEffect(() => {
    const savedId = localStorage.getItem('soneul_last_id');
    if (savedId) {
      handleLogin(savedId);
    }
  }, []);

  const handleLogin = async (schoolId: string) => {
    const isAdmin = schoolId.toLowerCase().startsWith('admin');
    localStorage.setItem('soneul_last_id', schoolId);

    if (isAdmin) {
      setUser(prev => ({ ...prev, id: schoolId, role: UserRole.TEACHER, name: '선생님' }));
      setCurrentScreen(AppScreen.ADMIN_DASHBOARD);
      return;
    }

    const firebaseData = await loadUserData(schoolId);
    if (firebaseData) {
      setUser(firebaseData);
    } else {
      setUser({
        id: schoolId,
        name: `친구 ${schoolId.split('.').pop()}`,
        role: UserRole.STUDENT,
        level: 1,
        levelName: LEVELS[0].name,
        xp: 0,
        maxXp: LEVELS[0].maxXp,
        history: []
      });
    }
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('soneul_last_id');
    setCurrentScreen(AppScreen.LOGIN);
  };

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [levelUpData, setLevelUpData] = useState<LevelData | null>(null);

  const handleStartPractice = () => {
    // 30개 단어 중 무작위 선택
    const randomIndex = Math.floor(Math.random() * PRACTICE_WORDS.length);
    setCurrentWordIndex(randomIndex);
    setCurrentScreen(AppScreen.PRACTICE);
  };

  const handlePracticeSubmit = async (canvas: HTMLCanvasElement) => {
    setIsAnalyzing(true);
    // targetWord인 단어만 분석에 전달
    const result = await analyzeHandwriting(PRACTICE_WORDS[currentWordIndex].target, canvas);
    setFeedback(result);
    setIsAnalyzing(false);
  };

  const handleCloseResult = async () => {
    if (feedback) {
      const updatedUser = await new Promise<UserState>((resolve) => {
        setUser(prev => {
          let newXp = prev.xp + feedback.earnedXp;
          let newLevel = prev.level;
          let newLevelName = prev.levelName;
          let newMaxXp = prev.maxXp;
          
          const newRecord: PracticeRecord = {
            id: Date.now().toString(),
            word: PRACTICE_WORDS[currentWordIndex].target,
            score: feedback.score,
            date: new Date().toISOString(),
            xpEarned: feedback.earnedXp
          };

          const newHistory = [newRecord, ...prev.history].slice(0, 50);

          if (newXp >= prev.maxXp) {
            const nextLevelIdx = LEVELS.findIndex(l => l.level === prev.level + 1);
            if (nextLevelIdx !== -1) {
              const nextLevelData = LEVELS[nextLevelIdx];
              newLevel = nextLevelData.level;
              newLevelName = nextLevelData.name;
              newXp = newXp - prev.maxXp; 
              newMaxXp = nextLevelData.maxXp;
              setLevelUpData(nextLevelData);
            } else {
               newXp = prev.maxXp;
            }
          }

          const newState = {
            ...prev,
            level: newLevel,
            levelName: newLevelName,
            xp: newXp,
            maxXp: newMaxXp,
            history: newHistory
          };
          resolve(newState);
          return newState;
        });
      });
      saveUserData(updatedUser);
    }
    setFeedback(null);
    if (!levelUpData) {
        setCurrentScreen(AppScreen.DASHBOARD);
    }
  };

  const handleCloseLevelUp = () => {
    setLevelUpData(null);
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  return (
    <div className="font-sans text-gray-900 antialiased selection:bg-primary selection:text-white">
      {user.role === UserRole.STUDENT && <CustomCursor level={user.level} />}
      
      {currentScreen === AppScreen.LOGIN && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {currentScreen === AppScreen.DASHBOARD && (
        <Dashboard 
          user={user} 
          onStartPractice={handleStartPractice}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === AppScreen.ADMIN_DASHBOARD && (
        <AdminDashboard onLogout={handleLogout} />
      )}

      {currentScreen === AppScreen.PRACTICE && (
        <PracticeCanvas 
          sentence={PRACTICE_WORDS[currentWordIndex].sentence}
          target={PRACTICE_WORDS[currentWordIndex].target}
          hint={PRACTICE_WORDS[currentWordIndex].hint}
          onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
          onSubmit={handlePracticeSubmit}
          isSubmitting={isAnalyzing}
        />
      )}

      {feedback && (
        <ResultModal result={feedback} onClose={handleCloseResult} />
      )}

      {levelUpData && !feedback && (
        <LevelUpModal levelData={levelUpData} onClose={handleCloseLevelUp} />
      )}
    </div>
  );
};

export default App;
