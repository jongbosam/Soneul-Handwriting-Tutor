
import React from 'react';
import { Button } from './Button';
import { FeedbackResult } from '../types';
import { LayoutGrid, Scale, Target, Square } from 'lucide-react';

interface ResultModalProps {
  result: FeedbackResult;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#77DD77'; 
    if (score >= 50) return '#FFB347'; 
    return '#FF6B6B'; 
  };

  const scoreColor = getScoreColor(result.score);

  const MetricItem = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 relative overflow-hidden group">
        <Icon size={20} className="z-10 group-hover:scale-110 transition-transform" />
        <div 
          className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out opacity-20" 
          style={{ height: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
      <span className="text-sm font-bold" style={{ color }}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-[48px] p-6 md:p-10 max-w-lg w-full shadow-2xl border-[12px] transform scale-100 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90dvh] relative" 
        style={{ borderColor: scoreColor }}
      >
        
        {/* Background Sparkles */}
        <div className="absolute top-4 right-4 text-4xl opacity-20">✨</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20">⭐</div>

        <div className="text-center mb-6">
          <h2 className="text-3xl text-gray-800 mb-1">글씨 분석 결과</h2>
          <div className="text-sm text-gray-400">K-PANOSE Handwriting Analysis</div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            {/* Main Score Ring */}
            <div className="relative flex-shrink-0">
                <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                    <circle
                        cx="50%" cy="50%" r="45%"
                        stroke={scoreColor}
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray="283%"
                        strokeDashoffset={`${283 - (283 * result.score) / 100}%`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl text-gray-700">{result.score}</span>
                    <span className="text-sm text-gray-400">점수</span>
                </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-4 md:grid-cols-2 gap-4 flex-grow w-full">
                <MetricItem icon={LayoutGrid} label="자리배치" value={result.metrics.composition} color="#60A5FA" />
                <MetricItem icon={Scale} label="비례균형" value={result.metrics.balance} color="#F87171" />
                <MetricItem icon={Target} label="무게중심" value={result.metrics.center} color="#34D399" />
                <MetricItem icon={Square} label="여백활용" value={result.metrics.space} color="#FBBF24" />
            </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-6 mb-8 border-2 border-dashed border-gray-200 relative">
            <div className="absolute -top-3 left-6 bg-white px-2 text-xs text-gray-400">AI 선생님의 피드백</div>
            <p className="text-xl text-center text-gray-700 leading-relaxed break-keep">
                "{result.message}"
            </p>
        </div>

        <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                    <Star fill="currentColor" size={20} />
                </div>
                <div>
                    <div className="text-xs text-gray-400 uppercase">Experience</div>
                    <div className="text-xl text-accent">+{result.earnedXp} XP</div>
                </div>
            </div>
            <Button onClick={onClose} size="lg" className="px-12 rounded-[28px] text-xl">계속하기</Button>
        </div>
      </div>
    </div>
  );
};

const Star = ({ fill, size }: { fill: string, size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
