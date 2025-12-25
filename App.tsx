
import React, { useState } from 'react';
import { AppScreen, UserState, FeedbackResult } from './types';
import { LEVELS, PRACTICE_WORDS, LevelData } from './constants';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { PracticeCanvas } from './components/PracticeCanvas';
import { ResultModal } from './components/ResultModal';
import { LevelUpModal } from './components/LevelUpModal';
import { CustomCursor } from './components/CustomCursor';
import { analyzeHandwriting } from './services/mockAiService';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  
  // State for user data
  const [user, setUser] = useState<UserState>({
    id: '',
    name: '학생',
    level: 1,
    levelName: LEVELS[0].name,
    xp: 0,
    maxXp: LEVELS[0].maxXp
  });

  // State for practice session
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  
  // State for Level Up Event
  const [levelUpData, setLevelUpData] = useState<LevelData | null>(null);

  const handleLogin = (schoolId: string) => {
    setUser(prev => ({ ...prev, id: schoolId, name: `친구 ${schoolId.split('.').pop()}` }));
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const handleStartPractice = () => {
    setCurrentWordIndex(Math.floor(Math.random() * PRACTICE_WORDS.length));
    setCurrentScreen(AppScreen.PRACTICE);
  };

  const handlePracticeSubmit = async (canvas: HTMLCanvasElement) => {
    setIsAnalyzing(true);
    const result = await analyzeHandwriting(PRACTICE_WORDS[currentWordIndex].text, canvas);
    setFeedback(result);
    setIsAnalyzing(false);
  };

  const handleCloseResult = () => {
    if (feedback) {
      setUser(prev => {
        let newXp = prev.xp + feedback.earnedXp;
        let newLevel = prev.level;
        let newLevelName = prev.levelName;
        let newMaxXp = prev.maxXp;
        let leveledUp = false;

        // Check for Level Up
        if (newXp >= prev.maxXp) {
          // Find next level
          const nextLevelIdx = LEVELS.findIndex(l => l.level === prev.level + 1);
          
          if (nextLevelIdx !== -1) {
            const nextLevelData = LEVELS[nextLevelIdx];
            newLevel = nextLevelData.level;
            newLevelName = nextLevelData.name;
            newXp = newXp - prev.maxXp; // Rollover XP
            newMaxXp = nextLevelData.maxXp;
            leveledUp = true;
            
            // Trigger Modal
            setLevelUpData(nextLevelData);
          } else {
             // Max level reached, just cap XP
             newXp = prev.maxXp;
          }
        }

        return {
          ...prev,
          level: newLevel,
          levelName: newLevelName,
          xp: newXp,
          maxXp: newMaxXp
        };
      });
    }
    
    setFeedback(null);
    // Don't change screen yet if level up happened, wait for LevelUpModal to close
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
      <CustomCursor level={user.level} />
      
      {currentScreen === AppScreen.LOGIN && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {currentScreen === AppScreen.DASHBOARD && (
        <Dashboard 
          user={user} 
          onStartPractice={handleStartPractice}
          onLogout={() => setCurrentScreen(AppScreen.LOGIN)}
        />
      )}

      {currentScreen === AppScreen.PRACTICE && (
        <PracticeCanvas 
          word={PRACTICE_WORDS[currentWordIndex].text}
          onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
          onSubmit={handlePracticeSubmit}
          isSubmitting={isAnalyzing}
        />
      )}

      {/* Show Result Modal first */}
      {feedback && (
        <ResultModal result={feedback} onClose={handleCloseResult} />
      )}

      {/* Show Level Up Modal on top if active */}
      {levelUpData && !feedback && (
        <LevelUpModal levelData={levelUpData} onClose={handleCloseLevelUp} />
      )}
    </div>
  );
};

export default App;
