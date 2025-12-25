
import React, { useEffect } from 'react';
import { Button } from './Button';
import { LevelData } from '../constants';
import { Star } from 'lucide-react';

interface LevelUpModalProps {
  levelData: LevelData;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ levelData, onClose }) => {
  
  useEffect(() => {
    // Play sound effect placeholder
    console.log("🎵 Playing Level Up Sound!");
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-500">
      
      {/* Confetti Background Effect (CSS only approach for simplicity) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
            <div 
                key={i}
                className="absolute text-4xl animate-bounce"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10%`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationIterationCount: 'infinite'
                }}
            >
                {['🎉', '✨', '⭐', '🎈'][Math.floor(Math.random() * 4)]}
            </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl border-8 border-yellow-400 transform scale-100 animate-in zoom-in-90 duration-500 relative overflow-hidden">
        
        {/* Shine Effect */}
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 animate-pulse pointer-events-none"></div>

        <div className="text-center relative z-10">
          <h2 className="text-4xl font-black text-yellow-500 mb-2 drop-shadow-sm tracking-tighter">LEVEL UP!</h2>
          <p className="text-gray-500 font-bold mb-8">축하해요! 한 단계 성장했어요!</p>

          <div className="relative mb-8 h-48 flex items-center justify-center">
             {/* Halo Effect for high levels */}
             <div className="absolute inset-0 bg-yellow-200 blur-3xl opacity-50 rounded-full animate-pulse"></div>
             
             <div 
                className={`text-9xl transition-all duration-700 transform hover:scale-110 ${levelData.visualClass || ''}`}
                style={{ filter: levelData.filterStyle }}
             >
                {levelData.icon}
             </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-4 mb-8 border-2 border-yellow-200">
            <span className="block text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">New Rank</span>
            <span className="block text-3xl font-bold text-gray-800">{levelData.name}</span>
          </div>

          <Button 
            size="lg" 
            onClick={onClose} 
            className="w-full bg-yellow-400 border-yellow-600 hover:bg-yellow-300 text-white text-xl shadow-yellow-200"
            icon={<Star className="fill-white" />}
          >
            멋져요!
          </Button>
        </div>
      </div>
    </div>
  );
};
