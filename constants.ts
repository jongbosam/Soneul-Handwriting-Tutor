
export interface LevelData {
  level: number;
  name: string;
  maxXp: number;
  icon: string;
  visualClass?: string;
  filterStyle?: string;
}

export const LEVELS: LevelData[] = [
  { level: 1, name: '연필', maxXp: 60, icon: '✏️', visualClass: 'scale-100' },
  { level: 2, name: '황금 연필', maxXp: 150, icon: '✏️', visualClass: 'drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]', filterStyle: 'sepia(100%) saturate(300%) hue-rotate(5deg)' },
  { level: 3, name: '무지개 연필', maxXp: 300, icon: '🌈', visualClass: 'animate-pulse drop-shadow-md' },
  { level: 4, name: '샤프 펜슬', maxXp: 600, icon: '🖊️', visualClass: 'drop-shadow-lg -rotate-45' },
  { level: 5, name: '만년필', maxXp: 1000, icon: '✒️', visualClass: 'drop-shadow-xl text-gray-800' },
  { level: 6, name: '마법 깃펜', maxXp: 99999, icon: '🪶', visualClass: 'drop-shadow-[0_0_20px_purple] animate-bounce-slow' },
];

export interface PracticeWord {
  id: number;
  sentence: string;
  target: string;
  hint: string;
  grade: "low" | "middle" | "high";
}

export const PRACTICE_WORDS: PracticeWord[] = [
  // 초급 (소리와 글자가 다른 말)
  { id: 101, sentence: "설거지는 내가 할게.", target: "할게", hint: "소리는 [할께]로 나지만 쓸 때는 '할게'라고 적어요.", grade: "low" },
  { id: 102, sentence: "오늘이 며칠이니?", target: "며칠", hint: "날짜를 물어볼 때는 항상 '며칠'이 맞아요. '몇일'은 없는 말이에요.", grade: "low" },
  { id: 103, sentence: "밥을 안 먹었어.", target: "안", hint: "'아니'를 줄여서 '안'이라고 해요. 뒤에 오는 말을 꾸며줘요.", grade: "low" },
  { id: 104, sentence: "숲에 나무가 많아.", target: "많아", hint: "'많다'는 'ㄶ' 받침을 사용해요. 소리는 [마나]로 나요.", grade: "low" },
  { id: 105, sentence: "깨끗이 씻자.", target: "깨끗이", hint: "'깨끗하게'라는 뜻일 때는 '깨끗이'가 맞아요.", grade: "low" },
  { id: 106, sentence: "곰곰이 생각해 봐.", target: "곰곰이", hint: "'곰곰히'가 아니라 '곰곰이'라고 써야 해요.", grade: "low" },
  { id: 107, sentence: "일일이 확인해.", target: "일일이", hint: "하나하나 다 확인한다는 뜻은 '일일이'예요.", grade: "low" },
  { id: 108, sentence: "어깨를 으쓱했어.", target: "으쓱", hint: "힘을 주어 올리는 모양은 '으쓱'이에요.", grade: "low" },
  { id: 109, sentence: "떡볶이가 맛있어.", target: "떡볶이", hint: "'볶다'에서 온 말이라 '볶이'라고 써야 해요.", grade: "low" },
  { id: 110, sentence: "문을 꼭 잠가.", target: "잠가", hint: "'잠그다'의 활용형은 '잠가'예요. '잠궈'는 틀린 말이에요.", grade: "low" },

  // 중급 (뜻을 구별해야 하는 말)
  { id: 201, sentence: "늦어서 어떡해?", target: "어떡해", hint: "문장 끝에는 '어떡해'를 써요. '어떻게'와 구분해요.", grade: "middle" },
  { id: 202, sentence: "길가에 웬 떡이니?", target: "웬", hint: "'어찌 된'이라는 뜻은 '웬'이에요. '왠'은 왠지만 써요.", grade: "middle" },
  { id: 203, sentence: "정답을 맞혀 보세요.", target: "맞혀", hint: "답을 알아맞히는 것은 '맞히다'가 맞아요.", grade: "middle" },
  { id: 204, sentence: "감기가 다 나았어.", target: "나았어", hint: "병이 고쳐진 건 '낫다'예요. 아기를 '낳다'와 달라요.", grade: "middle" },
  { id: 205, sentence: "무릎을 다쳤어.", target: "무릎", hint: "신체 부위는 '무릎'이에요. 받침 'ㅍ'을 기억하세요.", grade: "middle" },
  { id: 206, sentence: "희한한 일이네.", target: "희한한", hint: "'희안한'이 아니라 '희한한'이 맞는 표기예요.", grade: "middle" },
  { id: 207, sentence: "가방을 메고 가요.", target: "메고", hint: "어깨에 지는 것은 '메다', 끈을 묶는 건 '매다'예요.", grade: "middle" },
  { id: 208, sentence: "반듯이 누워.", target: "반듯이", hint: "자세가 바른 것은 '반듯이', 꼭 해야 하는 건 '반드시'예요.", grade: "middle" },
  { id: 209, sentence: "껍질을 깎다.", target: "깎다", hint: "칼로 베어내는 것은 '깎다'예요. 받침 'ㄲ'을 써요.", grade: "middle" },
  { id: 210, sentence: "목소리가 쉬다.", target: "쉬다", hint: "목이 잠기는 것은 '쉬다'예요.", grade: "middle" },

  // 고급 (헷갈리기 쉬운 문장)
  { id: 301, sentence: "선생님, 내일 봬요.", target: "봬요", hint: "'뵈어요'의 줄임말이라서 '봬요'가 맞아요.", grade: "high" },
  { id: 302, sentence: "하든지 말든지 해.", target: "든지", hint: "선택을 할 때는 '든지'를 써요. '던지'는 과거예요.", grade: "high" },
  { id: 303, sentence: "금세 녹았네.", target: "금세", hint: "'금방 사이'의 줄임말이라 '금세'가 맞아요.", grade: "high" },
  { id: 304, sentence: "부기를 빼다.", target: "부기", hint: "몸이 부은 상태는 '부기'라고 해요. '붓기'는 틀려요.", grade: "high" },
  { id: 305, sentence: "셋방을 구하다.", target: "셋방", hint: "방을 빌리는 곳은 '셋방'이라고 적어요.", grade: "high" },
  { id: 306, sentence: "생각보다 작네.", target: "보다", hint: "비교를 나타내는 '보다'는 앞말에 붙여 써요.", grade: "high" },
  { id: 307, sentence: "어느 게 더 나아?", target: "나아", hint: "더 좋다는 뜻은 '나아'예요. 받침이 없어요.", grade: "high" },
  { id: 308, sentence: "알맞게 익었어.", target: "알맞게", hint: "'알맞다'의 활용형은 '알맞게'예요. '알맞는'은 틀려요.", grade: "high" },
  { id: 309, sentence: "꼼꼼히 챙겨.", target: "꼼꼼히", hint: "빈틈이 없는 모양은 '꼼꼼히'가 맞아요.", grade: "high" },
  { id: 310, sentence: "틈틈이 운동해.", target: "틈틈이", hint: "겨를이 날 때마다는 '틈틈이'라고 써요.", grade: "high" },
];

export const MOCK_FEEDBACK_MESSAGES = {
  high: ["와! 문장 박사님이네요!", "띄어쓰기까지 완벽해요!", "글씨가 정말 또박또박해요!", "최고의 맞춤법 실력이에요!"],
  medium: ["잘했어요! 띄어쓰기를 조금 더 신경 써볼까요?", "아주 좋아요! 글자 크기를 일정하게 써봐요.", "멋져요! 조금만 더 연습하면 문장 왕이에요."],
  low: ["좋은 시도예요! 글자 자리를 다시 잡아볼까요?", "천천히 한 글자씩 써보세요.", "포기하지 마세요! 할 수 있어요!"]
};
