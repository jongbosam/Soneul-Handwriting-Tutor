
export interface LevelData {
  level: number;
  name: string;
  maxXp: number;
  icon: string;
  visualClass?: string; // Tailwind classes for specific visual effects
  filterStyle?: string; // Inline CSS filters for color manipulation
}

export const LEVELS: LevelData[] = [
  // Stage 1-3: Basic Evolution (Size based)
  { 
    level: 1, 
    name: '몽당 연필', 
    maxXp: 50, 
    icon: '✏️', 
    visualClass: 'scale-[0.6] origin-bottom-left rotate-12' 
  },
  { 
    level: 2, 
    name: '헌 연필', 
    maxXp: 80, 
    icon: '✏️', 
    visualClass: 'scale-[0.8] origin-bottom-left rotate-6' 
  },
  { 
    level: 3, 
    name: '새 연필', 
    maxXp: 120, 
    icon: '✏️', 
    visualClass: 'scale-100' 
  },

  // Stage 4-6: Special Editions
  { 
    level: 4, 
    name: '황금 연필', 
    maxXp: 180, 
    icon: '✏️', 
    visualClass: 'drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]',
    filterStyle: 'sepia(100%) saturate(300%) hue-rotate(5deg)'
  },
  { 
    level: 5, 
    name: '무지개 연필', 
    maxXp: 250, 
    icon: '🌈', 
    visualClass: 'animate-pulse drop-shadow-md' 
  },
  { 
    level: 6, 
    name: '샤프 펜슬', 
    maxXp: 350, 
    icon: '🖊️', 
    visualClass: 'drop-shadow-lg -rotate-45' 
  },

  // Stage 7-9: Ink & Magic
  { 
    level: 7, 
    name: '만년필', 
    maxXp: 450, 
    icon: '✒️', 
    visualClass: 'drop-shadow-xl text-gray-800' 
  },
  { 
    level: 8, 
    name: '마법 깃펜', 
    maxXp: 600, 
    icon: '🪶', 
    visualClass: 'drop-shadow-[0_0_10px_purple] animate-bounce-slow' 
  },
  { 
    level: 9, 
    name: '에메랄드 붓', 
    maxXp: 800, 
    icon: '🖌️', 
    visualClass: 'drop-shadow-[0_0_15px_#50C878]',
    filterStyle: 'hue-rotate(90deg) saturate(200%)'
  },

  // Stage 10-12: Legendary
  { 
    level: 10, 
    name: '다이아몬드 펜', 
    maxXp: 1000, 
    icon: '💎', 
    visualClass: 'animate-pulse drop-shadow-[0_0_20px_cyan]' 
  },
  { 
    level: 11, 
    name: '명인의 붓', 
    maxXp: 1500, 
    icon: '🖌️', 
    visualClass: 'scale-125 drop-shadow-2xl',
    filterStyle: 'sepia(80%)'
  },
  { 
    level: 12, 
    name: '글씨의 신', 
    maxXp: 99999, 
    icon: '👑', 
    visualClass: 'scale-150 drop-shadow-[0_0_30px_gold] animate-bounce' 
  },
];

export const PRACTICE_WORDS = [
  { id: 1, text: '하늘', hint: 'Sky' },
  { id: 2, text: '바다', hint: 'Sea' },
  { id: 3, text: '나무', hint: 'Tree' },
  { id: 4, text: '사랑', hint: 'Love' },
  { id: 5, text: '친구', hint: 'Friend' },
];

export const MOCK_FEEDBACK_MESSAGES = {
  high: ["와! 완벽해요!", "글씨 쓰기 천재네요!", "정말 또박또박 잘 썼어요!", "명필이 될 자질이 보여요!"],
  medium: ["잘했어요! 선을 조금 더 반듯하게 그어볼까요?", "아주 좋아요! 글씨를 조금만 더 크게 써봐요.", "멋져요! 조금만 더 연습하면 완벽하겠어요."],
  low: ["좋은 시도예요! 다시 한 번 써볼까요?", "천천히 차분하게 써보세요.", "힘을 내요! 할 수 있어요!"]
};
