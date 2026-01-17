
import React from 'react';
import { UserState } from '../types';
import { Button } from './Button';
import { Play, Star, Trophy, Sparkles, Calendar, TrendingUp } from 'lucide-react';
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="min-h-screen bg-paper p-4 md:p-6 flex flex-col items-center overflow-y-auto safe-area-pb">
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-600">안녕, {user.name}!</h2>
        <Button variant="ghost" size="sm" onClick={onLogout}>로그아웃</Button>
      </header>

      {/* Hero Card */}
      <div className="w-full max-w-4xl bg-white rounded-[32px] md:rounded-[40px] shadow-xl border-4 border-white ring-4 ring-gray-100 p-6 md:p-8 mb-6 md:mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 transform transition-all relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative flex-shrink-0 z-10">
          <div className={`w-36 h-36 md:w-48 md:h-48 bg-gradient-to-br from-gray-50 to-white rounded-full flex items-center justify-center border-8 border-gray-100 shadow-inner relative overflow-hidden transition-all duration-500`}>
            {currentLevelData.level >= 4 && (
                <div className="absolute inset-0 bg-yellow-100 opacity-20 animate-pulse rounded-full"></div>
            )}
            <span 
                className={`text-6xl md:text-8xl transition-all duration-500 select-none ${currentLevelData.visualClass || ''}`}
                style={{ filter: currentLevelData.filterStyle }}
            >
              {currentLevelData.icon}
            </span>
          </div>
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-orange-400 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-2xl font-black shadow-lg border-2 border-white whitespace-nowrap z-20 flex items-center gap-2 text-sm md:text-base">
            <span>Lv.{user.level}</span>
            <span>{user.levelName}</span>
          </div>
        </div>

        <div className="flex-grow w-full z-10 text-center md:text-left">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xl md:text-2xl font-bold text-gray-700 flex items-center gap-2 justify-center md:justify-start">
              <Trophy className="text-yellow-500 fill-yellow-500" size={24} /> 
              나의 성장
            </span>
            <span className="text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-lg text-sm md:text-base hidden sm:inline">
                {user.xp} <span className="text-gray-400 text-xs md:text-sm">/ {user.maxXp} XP</span>
            </span>
          </div>
          <div className="relative h-6 md:h-8 w-full bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-accent to-green-400 transition-all duration-1000 ease-out relative"
              style={{ width: `${xpPercentage}%` }}
            >
                <div className="absolute inset-0 bg-white/30 w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-gray-500 font-medium text-sm md:text-base">
             <span>{currentLevelData.name}</span>
             {nextLevelData ? (
                 <span className="text-primary font-bold flex items-center gap-1">
                    다음: {nextLevelData.name} <Sparkles size={16} />
                 </span>
             ) : (
                 <span className="text-purple-500 font-bold">최고 레벨! 👑</span>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-4xl pb-10">
        {/* Practice Button */}
        <div className="lg:col-span-1 flex items-stretch">
          <Button 
            onClick={onStartPractice} 
            size="lg" 
            className="w-full h-full min-h-[140px] shadow-orange-200 text-2xl flex-col gap-2 rounded-[32px]"
          >
            <Play fill="currentColor" size={48} />
            글씨 쓰기
          </Button>
        </div>

        {/* Recent History Card */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 shadow-xl border-4 border-white ring-4 ring-gray-50">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                <TrendingUp className="text-blue-500" size={24} />
                최근 나의 기록
             </h3>
             <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Last 5 words</span>
          </div>

          <div className="space-y-3">
            {user.history.length > 0 ? (
              user.history.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:bg-white hover:shadow-md">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${record.score >= 80 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        {record.score}
                      </div>
                      <div>
                        <div className="font-black text-gray-800 text-lg">{record.word}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                           <Calendar size={12} /> {formatDate(record.date)}
                        </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-accent font-black text-sm">+{record.xpEarned} XP</div>
                      <div className="flex gap-0.5">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} size={10} className={`${i < (record.score / 33) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-2xl">
                 <p className="font-bold">아직 기록이 없어요.</p>
                 <p className="text-sm">첫 번째 글씨를 써볼까요?</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
