import React, { useState } from 'react';
import { Button } from './Button';
import { LogIn } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (schoolId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [schoolId, setSchoolId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId.trim()) {
      setError('학교 ID를 입력해주세요!');
      return;
    }
    // Simple mock validation
    if (schoolId.length < 3) {
      setError('ID가 너무 짧아요!');
      return;
    }
    onLogin(schoolId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-100 to-white">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-200">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">✏️</span>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">손을 (Soneul)</h1>
          <p className="text-gray-500">재미있는 글씨 모험을 떠나볼까요?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="schoolId" className="block text-lg font-bold text-gray-700 mb-2">
              학교 ID 또는 선생님 코드
            </label>
            <input
              id="schoolId"
              type="text"
              value={schoolId}
              onChange={(e) => {
                setSchoolId(e.target.value);
                setError('');
              }}
              placeholder="예: e.dc.s011"
              className="w-full px-6 py-4 text-xl bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            />
            {error && <p className="text-red-500 mt-2 font-bold">{error}</p>}
          </div>

          <Button type="submit" size="lg" icon={<LogIn size={28} />}>
            공부 시작하기
          </Button>
        </form>
      </div>
    </div>
  );
};