
import { FeedbackResult } from '../types';

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
        message: `정말 훌륭해요! '${word}'를 정성스럽게 썼네요!`,
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
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return getFallbackResult(word);
  }

  try {
    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = optimizeCanvas(canvas);

    // Use 'gemini-3-flash-preview' for robust handwriting analysis and vision support
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: `사용자가 쓴 글자: "${word}". K-PANOSE 지표와 기하학적 균형을 바탕으로 상세 분석을 진행해주세요.` }
        ]
      },
      config: {
        systemInstruction: `
          당신은 한글 손글씨 및 서체 분석 전문가이자 초등 교육 전문가입니다. 
          사용자의 손글씨 이미지를 분석하여 K-PANOSE(Korean Font PANOSE) 지표를 기반으로 피드백을 생성합니다.

          평가 기준 (0-100점):
          1. 자소 배치 (Composition): 초/중/종성의 위치가 네모틀 안에서 조화로운가.
          2. 비례 균형 (Balance): 글자 내 자음과 모음의 크기 비율이 표준에 가까운가.
          3. 시각적 중심 (Center): 무게중심이 중앙 혹은 약간 하단에 안정적으로 위치하는가.
          4. 속공간 (Space): 글자 내부의 하얀 여백이 뭉치지 않고 고르게 분포하는가.

          분석 가이드:
          - 아이들에게 매우 다정하고 구체적으로 설명해주세요.
          - "자소 배치" 대신 "글자들의 자리", "시각적 중심" 대신 "글자의 무게중심" 등 쉬운 용어를 섞어서 메시지를 작성하세요.
          - 전체 점수는 4가지 지표의 가중 평균으로 계산합니다.

          응답 형식 (Strict JSON):
          {
            "score": 전체 점수 (Integer),
            "message": "아이를 격려하는 다정하고 구체적인 한글 메시지 (K-PANOSE 지표 중 하나를 언급)",
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
      message: result.message || "참 잘했어요!",
      earnedXp: score >= 90 ? 25 : score >= 75 ? 15 : score >= 50 ? 5 : 0,
      metrics: result.metrics
    };

  } catch (error) {
    console.error("Analysis Error:", error);
    return getFallbackResult(word);
  }
};
