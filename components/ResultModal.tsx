
import React from 'react';
import { Button } from './Button';
import { FeedbackResult } from '../types';

interface ResultModalProps {
  result: FeedbackResult;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#77DD77'; // Pastel Green (Good)
    if (score >= 50) return '#FFB347'; // Pastel Orange (Okay)
    return '#FF6B6B'; // Pastel Red (Bad)
  };

  const getEmoji = (score: number) => {
    if (score >= 90) return '🎉';
    if (score >= 70) return '👍';
    if (score >= 40) return '🤔';
    return '📝';
  };

  const scoreColor = getScoreColor(result.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl border-8 transform scale-100 animate-in zoom-in-95 duration-300" style={{ borderColor: scoreColor }}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block p-4 rounded-full mb-4 bg-gray-50">
            <span className="text-6xl animate-bounce-slow block">
              {getEmoji(result.score)}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">AI 선생님의 피드백</h2>
        </div>

        {/* Score */}
        <div className="flex justify-center items-center mb-6">
            <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="#f3f4f6"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke={scoreColor}
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * result.score) / 100}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-700">{result.score}%</span>
                    <span className="text-xs text-gray-400">일치율</span>
                </div>
            </div>
        </div>

        {/* Feedback Text */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
            <p className="text-lg text-center text-gray-700 font-medium break-keep">
                "{result.message}"
            </p>
        </div>

        {/* Reward */}
        <div className="text-center mb-8">
            {result.earnedXp > 0 ? (
                <span className="text-green-600 font-bold text-xl animate-bounce block">
                    +{result.earnedXp} XP 획득!
                </span>
            ) : (
                <span className="text-gray-400 font-bold text-lg">
                    아쉬워요, 경험치를 얻지 못했어요.
                </span>
            )}
        </div>

        <Button size="lg" onClick={onClose} className="w-full">
            확인
        </Button>
      </div>
    </div>
  );
};
