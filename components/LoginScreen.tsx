
import React, { useState } from 'react';
import { Button } from './Button';
import { Rocket, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (schoolId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [schoolId, setSchoolId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = schoolId.trim();
    if (!cleanId) {
      setError('이름이나 번호를 입력해주세요!');
      return;
    }
    if (cleanId.length < 2) {
      setError('조금 더 길게 입력해볼까요?');
      return;
    }
    onLogin(cleanId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4 bg-paper relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[48px] shadow-2xl border-4 border-white ring-8 ring-gray-50/50 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-50 rounded-full mb-6 animate-bounce-slow">
            <span className="text-6xl">✏️</span>
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">손을 (Soneul)</h1>
          <p className="text-gray-400 font-bold">우리 아이들의 즐거운 글씨 모험</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <label htmlFor="schoolId" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
              나의 비밀 코드 입력
            </label>
            <input
              id="schoolId"
              type="text"
              value={schoolId}
              onChange={(e) => {
                setSchoolId(e.target.value);
                setError('');
              }}
              placeholder="예: 홍길동1234"
              className="w-full px-8 py-5 text-2xl bg-gray-50 border-4 border-gray-100 rounded-3xl focus:border-primary/30 focus:bg-white focus:outline-none transition-all placeholder:text-gray-200 font-bold text-gray-700"
            />
            {error ? (
              <p className="text-red-400 mt-3 font-bold text-center animate-pulse">{error}</p>
            ) : (
              <p className="text-gray-300 mt-3 text-xs text-center flex items-center justify-center gap-1 font-bold">
                <ShieldCheck size={14} /> 로그인이 필요 없는 안전한 학습 모드입니다.
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full py-6 rounded-[32px] text-2xl shadow-orange-100"
            icon={<Rocket size={28} className="animate-pulse" />}
          >
            모험 시작하기!
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t-2 border-dashed border-gray-50 flex flex-col items-center">
            <p className="text-[10px] text-gray-300 font-black uppercase tracking-tighter mb-2">Teacher Access</p>
            <button 
                type="button"
                onClick={() => setSchoolId('admin.soneul')}
                className="text-xs text-gray-400 hover:text-primary transition-colors font-bold"
            >
                선생님 전용 페이지 접속하기
            </button>
        </div>
      </div>
      
      <p className="mt-8 text-gray-300 text-xs font-bold opacity-50">© 2025 Soneul EdTech Project</p>
    </div>
  );
};
