
import React from 'react';
import { UserState } from '../types';
import { Button } from './Button';
import { Play, Star, Trophy, Sparkles } from 'lucide-react';
import { LEVELS } from '../constants';

interface DashboardProps {
  user: UserState;
  onStartPractice: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartPractice, onLogout }) => {
  const xpPercentage = Math.min((user.xp / user.maxXp) * 100, 100);
  const currentLevelData = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const nextLevelData = LEVELS.find(l => l.level === user.level + 1);

  return (
    <div className="min-h-screen bg-paper p-6 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-600">안녕, {user.name}!</h2>
        <Button variant="ghost" size="sm" onClick={onLogout}>로그아웃</Button>
      </header>

      {/* Hero Card - The Evolution Stage */}
      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-xl border-4 border-white ring-4 ring-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-10 transform transition-all duration-300 relative overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/2 -translate-x-1/2"></div>

        {/* Level Badge / Avatar */}
        <div className="relative flex-shrink-0 z-10 group">
          <div className={`w-48 h-48 bg-gradient-to-br from-gray-50 to-white rounded-full flex items-center justify-center border-8 border-gray-100 shadow-inner relative overflow-hidden transition-all duration-500 ${currentLevelData.level >= 10 ? 'ring-4 ring-cyan-200 ring-offset-4' : ''}`}>
            
            {/* Inner Glow for high levels */}
            {currentLevelData.level >= 4 && (
                <div className="absolute inset-0 bg-yellow-100 opacity-20 animate-pulse rounded-full"></div>
            )}

            {/* The Icon */}
            <span 
                className={`text-8xl transition-all duration-500 select-none ${currentLevelData.visualClass || ''}`}
                style={{ filter: currentLevelData.filterStyle }}
            >
              {currentLevelData.icon}
            </span>
          </div>
          
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-orange-400 text-white px-6 py-2 rounded-2xl font-black shadow-lg border-2 border-white whitespace-nowrap z-20 flex items-center gap-2">
            <span>Lv.{user.level}</span>
            <span>{user.levelName}</span>
          </div>
        </div>

        {/* Stats & Progress */}
        <div className="flex-grow w-full z-10">
          <div className="flex justify-between items-end mb-3">
            <span className="text-2xl font-bold text-gray-700 flex items-center gap-2">
              <Trophy className="text-yellow-500 fill-yellow-500" size={28} /> 
              나의 성장
            </span>
            <span className="text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-lg">
                {user.xp} <span className="text-gray-400 text-sm">/ {user.maxXp} XP</span>
            </span>
          </div>
          
          {/* XP Progress Bar */}
          <div className="relative h-8 w-full bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-accent to-green-400 transition-all duration-1000 ease-out relative"
              style={{ width: `${xpPercentage}%` }}
            >
                {/* Shine animation on bar */}
                <div className="absolute inset-0 bg-white/30 w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-gray-500 font-medium">
             <span className="text-sm">현재: {currentLevelData.name}</span>
             {nextLevelData ? (
                 <span className="text-primary font-bold flex items-center gap-1">
                    다음: {nextLevelData.name} <Sparkles size={16} />
                 </span>
             ) : (
                 <span className="text-purple-500 font-bold">최고 레벨 도달! 👑</span>
             )}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 flex flex-col items-center text-center justify-center shadow-sm">
          <h3 className="text-2xl font-bold text-blue-800 mb-2">오늘의 미션</h3>
          <p className="mb-4 text-blue-600 font-medium">단어 3개를 연습하고 경험치를 모으세요!</p>
          <div className="flex gap-2 mb-2">
            <Star className="text-yellow-400 fill-yellow-400 drop-shadow-sm" size={32} />
            <Star className="text-yellow-400 fill-yellow-400 drop-shadow-sm" size={32} />
            <Star className="text-gray-200" size={32} />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Button 
            onClick={onStartPractice} 
            size="lg" 
            className="w-full h-full min-h-[140px] shadow-orange-200 text-2xl flex-col gap-2 rounded-3xl"
          >
            <Play fill="currentColor" size={48} />
            연습 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
};
