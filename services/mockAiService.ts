
import { FeedbackResult } from '../types';

/**
 * Optimizes the canvas for AI analysis.
 */
const optimizeCanvas = (sourceCanvas: HTMLCanvasElement): string => {
  const ctx = sourceCanvas.getContext('2d');
  if (!ctx) return sourceCanvas.toDataURL('image/jpeg', 0.5).split(',')[1];

  const { width, height } = sourceCanvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let hasInk = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        hasInk = true;
      }
    }
  }

  if (!hasInk) {
    const empty = document.createElement('canvas');
    empty.width = 100;
    empty.height = 100;
    const eCtx = empty.getContext('2d');
    if(eCtx) { eCtx.fillStyle='#FFF'; eCtx.fillRect(0,0,100,100); }
    return empty.toDataURL('image/jpeg', 0.4).split(',')[1];
  }

  const PADDING = 15;
  minX = Math.max(0, minX - PADDING);
  minY = Math.max(0, minY - PADDING);
  maxX = Math.min(width, maxX + PADDING);
  maxY = Math.min(height, maxY + PADDING);

  const cropWidth = maxX - minX;
  const cropHeight = maxY - minY;
  const MAX_DIM = 320; 
  const scale = Math.min(1, MAX_DIM / Math.max(cropWidth, cropHeight));
  
  const targetWidth = Math.floor(cropWidth * scale);
  const targetHeight = Math.floor(cropHeight * scale);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;
  const tempCtx = tempCanvas.getContext('2d');

  if (!tempCtx) return sourceCanvas.toDataURL('image/jpeg', 0.5).split(',')[1];
  tempCtx.fillStyle = '#FFFFFF';
  tempCtx.fillRect(0, 0, targetWidth, targetHeight);

  tempCtx.drawImage(sourceCanvas, minX, minY, cropWidth, cropHeight, 0, 0, targetWidth, targetHeight);

  const processedData = tempCtx.getImageData(0, 0, targetWidth, targetHeight);
  const px = processedData.data;
  for (let i = 0; i < px.length; i += 4) {
    const brightness = (px[i] + px[i + 1] + px[i + 2]) / 3;
    if (brightness < 210) {
        px[i] = 0; px[i+1] = 0; px[i+2] = 0;
    } else {
        px[i] = 255; px[i+1] = 255; px[i+2] = 255;
    }
  }
  tempCtx.putImageData(processedData, 0, 0);

  return tempCanvas.toDataURL('image/jpeg', 0.4).split(',')[1];
};

const getFallbackResult = (word: string): Promise<FeedbackResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = 85 + Math.floor(Math.random() * 10); // Generous fallback
      resolve({
        score,
        message: `정말 훌륭해요! '${word}'를 아주 정성스럽게 썼네요!`,
        earnedXp: score >= 90 ? 20 : 15
      });
    }, 1000);
  });
};

export const analyzeHandwriting = async (word: string, canvas: HTMLCanvasElement): Promise<FeedbackResult> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API_KEY found. Using fallback.");
    return getFallbackResult(word);
  }

  try {
    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = optimizeCanvas(canvas);

    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: `Target word: "${word}". Evaluate this student's handwriting with kindness.` }
        ]
      },
      config: {
        systemInstruction: `
          Role: Kind and Encouraging Korean Elementary School Teacher.
          
          Analysis Rules (For Kids):
          1. Generosity First: If the word is clearly recognizable as "${word}", start with at least 80 points.
          2. Effort over Perfection: Minor shaky lines or slight imbalances should NOT be penalized heavily.
          3. Legibility: As long as the initial, medial, and final consonants are in the right general place, give a high score.
          4. No Hard Critiques: Avoid words like "bad", "wrong", "collapsed", or "poor". Use "try a bit more", "almost perfect", or "charming".

          Feedback Algorithm (Be Generous!):
          - Score 95-100: "우와! 최고의 글씨예요! 명필 탄생이네요!"
          - Score 80-94: "정말 잘 썼어요! 조금만 더 천천히 쓰면 100점이 될 거예요!"
          - Score 60-79: "좋은 시도예요! 글자 모양을 조금만 더 크게 그려볼까요?"
          - Score < 60: (Only for scribbles) "선생님이 글씨를 더 잘 볼 수 있게 다시 한번 써볼까요?"

          Output Format (Strict JSON):
          { "score": number, "message": "string (1 very encouraging sentence in Korean)" }
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            message: { type: Type.STRING }
          },
          required: ["score", "message"]
        },
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const score = result.score ?? 70; // Higher default score

    return {
      score,
      message: result.message || "참 잘했어요! 대단해요!",
      earnedXp: score >= 90 ? 20 : score >= 75 ? 15 : score >= 50 ? 5 : 0
    };

  } catch (error) {
    console.error("Analysis Error:", error);
    return getFallbackResult(word);
  }
};
