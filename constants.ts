
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
  { id: 1, text: "가게", hint: "shop; store", grade: "low" },
  { id: 2, text: "가격", hint: "price", grade: "low" },
  { id: 3, text: "가구", hint: "furniture", grade: "low" },
  { id: 4, text: "가깝다", hint: "close; near", grade: "low" },
  { id: 5, text: "가능성", hint: "possibility", grade: "middle" },
  { id: 6, text: "가난", hint: "poverty", grade: "middle" },
  { id: 7, text: "가르침", hint: "teaching", grade: "middle" },
  { id: 8, text: "가리키다", hint: "point; indicate", grade: "low" },
  { id: 9, text: "가만히", hint: "still; motionlessly", grade: "low" },
  { id: 10, text: "가볍다", hint: "light", grade: "low" },
  { id: 11, text: "가수", hint: "singer", grade: "low" },
  { id: 12, text: "가슴", hint: "chest; breast", grade: "low" },
  { id: 13, text: "가입", hint: "initiation; joining", grade: "middle" },
  { id: 14, text: "가장", hint: "most; best", grade: "low" },
  { id: 15, text: "가정", hint: "home; family", grade: "low" },
  { id: 16, text: "가족", hint: "family", grade: "low" },
  { id: 17, text: "가죽", hint: "leather", grade: "middle" },
  { id: 18, text: "가지", hint: "branch", grade: "middle" },
  { id: 19, text: "가치", hint: "value; worth", grade: "high" },
  { id: 20, text: "각각", hint: "each; respectively", grade: "middle" },
  { id: 21, text: "각자", hint: "each one; everyone", grade: "middle" },
  { id: 22, text: "각종", hint: "various kinds", grade: "middle" },
  { id: 23, text: "간격", hint: "interval; space", grade: "high" },
  { id: 24, text: "간단하다", hint: "simple; brief", grade: "low" },
  { id: 25, text: "간식", hint: "snack", grade: "low" },
  { id: 26, text: "간절하다", hint: "ardent; earnest", grade: "high" },
  { id: 27, text: "간접", hint: "indirectness", grade: "high" },
  { id: 28, text: "간판", hint: "signboard", grade: "middle" },
  { id: 29, text: "간호사", hint: "nurse", grade: "low" },
  { id: 30, text: "갈등", hint: "conflict", grade: "high" }
];

export const MOCK_FEEDBACK_MESSAGES = {
  high: ["와! 완벽해요!", "글씨 쓰기 천재네요!", "정말 또박또박 잘 썼어요!", "명필이 될 자질이 보여요!"],
  medium: ["잘했어요! 선을 조금 더 반듯하게 그어볼까요?", "아주 좋아요! 글씨를 조금만 더 크게 써봐요.", "멋져요! 조금만 더 연습하면 완벽하겠어요."],
  low: ["좋은 시도예요! 다시 한 번 써볼까요?", "천천히 차분하게 써보세요.", "힘을 내요! 할 수 있어요!"]
};
