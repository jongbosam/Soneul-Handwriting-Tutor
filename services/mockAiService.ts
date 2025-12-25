import { FeedbackResult } from '../types';
import { MOCK_FEEDBACK_MESSAGES } from '../constants';

// Helper for fallback (Mock logic)
const getFallbackResult = (word: string): Promise<FeedbackResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * (100 - 60 + 1) + 60);
      let message = '';
      let earnedXp = 10;

      if (score >= 90) {
        message = MOCK_FEEDBACK_MESSAGES.high[Math.floor(Math.random() * MOCK_FEEDBACK_MESSAGES.high.length)];
        earnedXp = 20;
      } else if (score >= 75) {
        message = MOCK_FEEDBACK_MESSAGES.medium[Math.floor(Math.random() * MOCK_FEEDBACK_MESSAGES.medium.length)];
        earnedXp = 15;
      } else {
        message = MOCK_FEEDBACK_MESSAGES.low[Math.floor(Math.random() * MOCK_FEEDBACK_MESSAGES.low.length)];
        earnedXp = 10;
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
    return getFallbackResult(word);
  }

  try {
    // Dynamic import to prevent app crash on load if module is not compatible with environment
    // @ts-ignore
    const { GoogleGenAI, Type } = await import("@google/genai");
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Get base64 string from canvas (remove header)
    const base64Data = canvas.toDataURL("image/png").split(',')[1];

    const prompt = `
      You are a kind and encouraging Korean elementary school teacher.
      Analyze the attached image of a student's handwriting.
      The student was trying to write the word: "${word}".

      Compare the student's writing with standard Korean calligraphy.
      Analyze the following specifically:
      1. **Legibility**: Is the word readable?
      2. **Stroke Accuracy**: Are the shapes of the consonants (ja-eum) and vowels (mo-eum) correct?
      3. **Balance & Size**: Are the components balanced? (e.g., is the 'bachim' (bottom consonant) too small or too big? Is the vowel too short?)
      4. **Alignment**: Is the character centered?

      Based on this analysis, generate a JSON response.
      - **score**: 0 to 100 integer.
      - **message**: A specific, helpful, and kind 1-sentence feedback in Korean (Hangul). 
        - If there is a specific flaw, mention it gently. (e.g., "'ㄹ' 받침이 너무 작아요. 조금 더 크게 써보세요.", "'ㅏ'의 세로 획을 더 길게 내려주세요.")
        - If it is good, praise a specific detail. (e.g., "글자의 균형이 아주 좋아요!", "획을 힘있게 잘 그었어요.")
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
    let earnedXp = 10;
    if (score >= 90) earnedXp = 20;
    else if (score >= 75) earnedXp = 15;

    return {
      score,
      message,
      earnedXp
    };

  } catch (error) {
    console.error("Error analyzing handwriting:", error);
    return getFallbackResult(word);
  }
};