
import React, { useEffect, useState } from 'react';
import { AdminStats, UserState } from '../types';
import { getAdminStats } from '../services/firebaseService';
import { Button } from './Button';
import { Users, TrendingUp, Award, BarChart3, ArrowLeft, RefreshCw, Star } from 'lucide-react';
import { LEVELS } from '../constants';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const data = await getAdminStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6">
        <RefreshCw size={48} className="text-primary animate-spin mb-4" />
        <p className="text-xl text-gray-500">학생들의 성장 기록을 불러오는 중...</p>
      </div>
    );
  }

  // Calculate max count to scale bars properly (highest bar fills the height)
  // Fix: Argument of type 'unknown' is not assignable to parameter of type 'number' by casting to number[]
  const maxCount = stats ? Math.max(...(Object.values(stats.levelDistribution) as number[]), 1) : 1;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center overflow-y-auto">
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl text-gray-800 flex items-center gap-2">
            <Award className="text-primary" size={32} />
            선생님용 관리 도구
          </h1>
          <p className="text-gray-500 text-lg">우리 반 학생들의 글씨 성장 리포트</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={fetchStats} icon={<RefreshCw size={18} />}>새로고침</Button>
          <Button variant="danger" size="sm" onClick={onLogout}>로그아웃</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-8">
        {/* Summary Stats */}
        <div className="bg-white p-6 rounded-[32px] shadow-lg border-b-4 border-blue-400 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
            <Users size={32} />
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">전체 학생</div>
            <div className="text-3xl text-gray-800">{stats?.totalStudents}명</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[32px] shadow-lg border-b-4 border-green-400 flex items-center gap-4">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
            <TrendingUp size={32} />
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">평균 일치율</div>
            <div className="text-3xl text-gray-800">{stats?.avgScore}%</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-lg border-b-4 border-yellow-400 flex items-center gap-4">
          <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500">
            <Star size={32} />
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">총 획득 XP</div>
            <div className="text-3xl text-gray-800">{stats?.totalXP.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mb-12">
        {/* Level Distribution Chart (Custom Bar Chart) */}
        <div className="bg-white p-8 rounded-[40px] shadow-xl">
          <h3 className="text-xl text-gray-700 mb-6 flex items-center gap-2">
            <BarChart3 className="text-purple-500" size={24} />
            레벨별 인원 분포
          </h3>
          <div className="flex items-end justify-between h-64 gap-1 sm:gap-2 pt-8 pb-2 border-b border-gray-100">
            {LEVELS.map((lvl) => {
              const count = stats?.levelDistribution[lvl.level] || 0;
              // Scale height relative to the max count found, so the chart looks full
              const heightPercentage = (count / maxCount) * 100;
              const displayHeight = count === 0 ? 5 : Math.max(heightPercentage, 10);

              return (
                <div key={lvl.level} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip Count - Always visible if has count, else on hover */}
                  <div 
                    className={`mb-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 transition-all transform ${count > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}
                  >
                    {count}명
                  </div>

                  {/* The Bar */}
                  <div 
                    className={`w-full max-w-[24px] sm:max-w-[32px] rounded-t-xl transition-all duration-1000 relative flex items-end justify-center overflow-hidden ${count > 0 ? 'bg-indigo-400 shadow-lg shadow-indigo-100' : 'bg-gray-100'}`}
                    style={{ height: `${displayHeight}%` }}
                  >
                     {/* Icon inside bar */}
                     <div className="mb-2 text-xs sm:text-sm transform transition-transform group-hover:scale-125">{lvl.icon}</div>
                     
                     {/* Shimmer effect for active bars */}
                     {count > 0 && (
                        <div className="absolute inset-0 bg-white/20 w-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                     )}
                  </div>
                  
                  {/* X-Axis Label */}
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-2 text-center font-medium">
                    Lv.{lvl.level}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers List */}
        <div className="bg-white p-8 rounded-[40px] shadow-xl">
          <h3 className="text-xl text-gray-700 mb-6 flex items-center gap-2">
            <Award className="text-orange-500" size={24} />
            글씨 왕 실시간 랭킹
          </h3>
          <div className="space-y-4">
            {stats?.topStudents.map((student, idx) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${idx === 0 ? 'bg-yellow-400 ring-2 ring-yellow-200' : idx === 1 ? 'bg-slate-300' : idx === 2 ? 'bg-orange-300' : 'bg-gray-200'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-gray-800 text-lg font-medium">{student.name}</div>
                    <div className="text-xs text-gray-400">Lv.{student.level} {student.levelName}</div>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-primary text-lg font-bold">{student.xp} XP</div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Total Success: {student.history.length}</div>
                </div>
              </div>
            ))}
            {(!stats?.topStudents || stats.topStudents.length === 0) && (
              <div className="h-48 flex items-center justify-center text-gray-300 border-2 border-dashed rounded-3xl">
                데이터가 수집되지 않았습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
