
import { FeedbackResult } from '../types';

// Heuristic to detect if the drawing is too simple (e.g. just a line)
// This helps the fallback mock service be more realistic without an API key.
const analyzeCanvasComplexity = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  const { width, height } = canvas;
  // Use a small sample or check main area
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  let coloredPixels = 0;
  // Loop through alpha channel
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 0) coloredPixels++;
  }
  
  // Percentage of canvas covered by ink
  return (coloredPixels / (width * height)) * 100;
};

// Helper for fallback (Mock logic)
// Updated to penalize simple lines/dots
const getFallbackResult = (word: string, canvas: HTMLCanvasElement): Promise<FeedbackResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const inkCoverage = analyzeCanvasComplexity(canvas);
      let score = 0;
      let message = '';
      let earnedXp = 0;
      const targetChar = word.charAt(0);

      // If ink coverage is very low (< 0.5%), it's likely a single line or dot.
      // Or if it's too high (> 50%), it might be a fill.
      // Adjust threshold based on typical stroke width.
      if (inkCoverage < 0.2) {
         score = Math.floor(Math.random() * 20); // 0-19
         message = "글씨가 너무 얇거나 안 보여요. 조금 더 크게 써볼까요?";
         earnedXp = 0;
      } else {
         // Random score generation for mock (0 - 100)
         // Biased slightly towards success for fun, but capable of failure
         const rand = Math.random();
         if (rand > 0.3) {
            score = Math.floor(Math.random() * (100 - 60) + 60); // 60-100 (Pass)
         } else {
            score = Math.floor(Math.random() * 59); // 0-59 (Fail)
         }

         if (score >= 90) {
            message = "와! 정말 정확하게 잘 썼어요! 완벽해요!";
            earnedXp = 20;
         } else if (score >= 70) {
            message = `'${targetChar}'의 모양을 잘 잡았네요! 획을 조금 더 반듯하게 그으면 완벽하겠어요.`;
            earnedXp = 15;
         } else if (score >= 40) {
            message = `'${targetChar}'가 조금 찌그러졌어요. 다시 한번 천천히 써볼까요?`;
            earnedXp = 5;
         } else {
            message = "어라? 글씨가 아닌 것 같아요. 낙서는 안돼요!";
            earnedXp = 0;
         }
      }

      resolve({ score, message, earnedXp });
    }, 1500);
  });
};

/**
 * Analyzes the handwriting using Google Gemini 3 Flash Preview.
 * Uses dynamic import to ensure stability if the module fails to load in browser.
 */
export const analyzeHandwriting = async (word: string, canvas: HTMLCanvasElement): Promise<FeedbackResult> => {
  let apiKey: string | undefined;
  
  // Safe access to environment variable
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Failed to access process.env");
  }

  if (!apiKey) {
    console.warn("No API_KEY found. Falling back to mock service.");
    return getFallbackResult(word, canvas);
  }

  try {
    // Dynamic import to prevent app crash on load if module is not compatible with environment
    // @ts-ignore
    const { GoogleGenAI, Type } = await import("@google/genai");
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Get base64 string from canvas (remove header)
    const base64Data = canvas.toDataURL("image/png").split(',')[1];

    const prompt = `
      Task: Handwriting Accuracy Judge.
      Target Word: "${word}"

      Analyze the provided image and calculate the "Match Rate" (0-100%) against the standard Korean font for "${word}".

      **STEP 1: REJECTION FILTER (Safety Check)**
      - Does the image contain ONLY a simple straight line, a single curve, or random dots?
      - Does the image contain scribbles that clearly do not form any text?
      - **IF YES**: You MUST return a score between **0 and 10**. 
      - Message: "선만 그으면 안돼요! 글씨를 예쁘게 써주세요." (No, please write the letters properly).

      **STEP 2: STRUCTURAL ANALYSIS (If Step 1 passed)**
      - Identify the characters. For "${word}", check for presence of all Jamo components.
      - If characters are missing or unrecognizable (e.g. writing 'ㅇ' instead of '하'): Score **10-30**.
      - Message: "어라? '${word}'가 아닌 것 같아요. 다시 써볼까요?"

      **STEP 3: PRECISION SCORING (If structure matches)**
      - **90-100**: Perfect proportions, straight lines where needed, clear angles.
      - **70-89**: Readable, correct stroke count, minor wobble or tilt.
      - **40-69**: Readable but very messy, wrong proportions (e.g. head too big), or shaky.

      **OUTPUT (JSON)**:
      {
        "score": integer (0-100),
        "message": "string (Korean feedback)"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            message: { type: Type.STRING }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    const resultJson = JSON.parse(resultText);
    const score = resultJson.score;
    const message = resultJson.message;

    // Calculate XP based on AI score
    let earnedXp = 0;
    if (score >= 90) earnedXp = 20;
    else if (score >= 70) earnedXp = 15;
    else if (score >= 40) earnedXp = 5;
    else earnedXp = 0; // No XP for failures

    return {
      score,
      message,
      earnedXp
    };

  } catch (error) {
    console.error("Error analyzing handwriting:", error);
    return getFallbackResult(word, canvas);
  }
};
