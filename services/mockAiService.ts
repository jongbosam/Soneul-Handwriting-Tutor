
import { FeedbackResult } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

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

  const PADDING = 20;
  minX = Math.max(0, minX - PADDING);
  minY = Math.max(0, minY - PADDING);
  maxX = Math.min(width, maxX + PADDING);
  maxY = Math.min(height, maxY + PADDING);

  const cropWidth = maxX - minX;
  const cropHeight = maxY - minY;
  const MAX_DIM = 512; 
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

  return tempCanvas.toDataURL('image/jpeg', 0.6).split(',')[1];
};

const getFallbackResult = (word: string): Promise<FeedbackResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        score: 85,
        message: `정말 훌륭한 문장이네요! '${word}'를 정성스럽게 썼어요!`,
        earnedXp: 15,
        metrics: {
          composition: 80,
          balance: 85,
          center: 90,
          space: 80
        }
      });
    }, 1000);
  });
};

export const analyzeHandwriting = async (word: string, canvas: HTMLCanvasElement): Promise<FeedbackResult> => {
  if (!process.env.API_KEY) {
    return getFallbackResult(word);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = optimizeCanvas(canvas);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: `사용자가 쓴 문장: "${word}". 전체적인 글씨의 균형과 해당 문장의 맞춤법/띄어쓰기가 잘 지켜졌는지 분석해주세요.` }
        ]
      },
      config: {
        systemInstruction: `
          당신은 한글 맞춤법 및 초등 교육 전문가입니다. 
          제공된 이미지는 초등학생이 쓴 손글씨 문장입니다. 다음 기준에 따라 분석해주세요.

          평가 기준 (0-100점):
          1. 문장 구성 (Composition): 문장의 글자들이 수평을 이루고 띄어쓰기가 적절한가.
          2. 비례 균형 (Balance): 각 글자의 자음과 모음 비율이 적절한가.
          3. 시각적 중심 (Center): 문장 전체가 캔버스의 중심에 안정적으로 위치하는가.
          4. 속공간 (Space): 글자 사이와 낱자 내부의 여백이 조화로운가.

          분석 가이드:
          - 아이들에게 매우 긍정적이고 다정하게 말해주세요.
          - 특히 제시된 문장("${word}")에서 헷갈리기 쉬운 맞춤법 포인트를 잘 썼는지 칭찬해주세요.
          - 70점 미만이라도 실망하지 않게 격려 위주의 메시지를 작성하세요.

          응답 형식 (Strict JSON):
          {
            "score": 전체 점수 (Integer),
            "message": "아이를 격려하는 다정하고 구체적인 한글 피드백",
            "metrics": {
              "composition": 점수,
              "balance": 점수,
              "center": 점수,
              "space": 점수
            }
          }
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            message: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                composition: { type: Type.INTEGER },
                balance: { type: Type.INTEGER },
                center: { type: Type.INTEGER },
                space: { type: Type.INTEGER }
              },
              required: ["composition", "balance", "center", "space"]
            }
          },
          required: ["score", "message", "metrics"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const score = result.score ?? 70;

    return {
      score,
      message: result.message || "정말 멋진 문장이에요!",
      earnedXp: score >= 90 ? 30 : score >= 70 ? 20 : score >= 40 ? 10 : 5,
      metrics: result.metrics || { composition: 0, balance: 0, center: 0, space: 0 }
    };

  } catch (error) {
    console.error("Analysis Error:", error);
    return getFallbackResult(word);
  }
};
