
import React, { useRef, useEffect, useState } from 'react';
import { ToolType } from '../types';
import { Button } from './Button';
import { Eraser, Pen, Trash2, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface PracticeCanvasProps {
  word: string;
  onBack: () => void;
  onSubmit: (canvas: HTMLCanvasElement) => void;
  isSubmitting: boolean;
}

export const PracticeCanvas: React.FC<PracticeCanvasProps> = ({ 
  word, 
  onBack, 
  onSubmit,
  isSubmitting 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.PEN);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  
  const activeToolRef = useRef(activeTool);

  useEffect(() => {
    activeToolRef.current = activeTool;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === ToolType.PEN) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#2C2C2C'; 
      ctx.lineWidth = 10; // Slightly thicker for better visibility
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 45; 
    }
  }, [activeTool]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width === 0 || height === 0) return;

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvasRef.current.width;
        tempCanvas.height = canvasRef.current.height;
        tempCtx?.drawImage(canvasRef.current, 0, 0);

        canvasRef.current.width = width;
        canvasRef.current.height = height;

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.drawImage(tempCanvas, 0, 0, width, height);
          if (activeToolRef.current === ToolType.PEN) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = '#2C2C2C';
            ctx.lineWidth = 10;
          } else {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 45;
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    const timer = setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) e.preventDefault(); 
      setIsDrawing(true);
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      if ('touches' in e) e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (isDrawing) {
        ctx.closePath();
        setIsDrawing(false);
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const isCanvasBlank = (canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    const pixelBuffer = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    return !pixelBuffer.some(color => color !== 0);
  };

  const handleSubmit = () => {
    if (canvasRef.current) {
      if (isCanvasBlank(canvasRef.current)) {
        alert("글씨를 먼저 써주세요!");
        return;
      }
      onSubmit(canvasRef.current);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col h-[100dvh]">
      <header className="flex-none bg-white px-4 py-2 flex items-center justify-between shadow-sm z-20 border-b border-gray-100">
        <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft size={20} />}>
          그만하기
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Standard Guide</span>
          <h2 className="text-2xl font-hand text-primary">{word}</h2>
        </div>
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className={`p-2 rounded-xl transition-colors ${showGuide ? 'text-blue-500 bg-blue-50' : 'text-gray-400 bg-gray-100'}`}
          title="가이드 끄기/켜기"
        >
          {showGuide ? <Eye size={24} /> : <EyeOff size={24} />}
        </button>
      </header>

      <div className="flex-1 relative w-full min-h-0 p-3 sm:p-6 flex items-center justify-center overflow-hidden">
        <div ref={containerRef} className="w-full h-full max-w-4xl relative bg-white rounded-[40px] shadow-2xl border-8 border-white ring-4 ring-orange-50 flex items-center justify-center overflow-hidden">
             
             {/* Dynamic Guide Lines (AI-Hub inspired "Standard grid") */}
             <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none border border-gray-100/50">
                <div className="border-r border-b border-gray-100/30"></div>
                <div className="border-b border-gray-100/30"></div>
                <div className="border-r border-gray-100/30"></div>
                <div></div>
             </div>

             {/* Standard Handwriting Skeleton (The Ghost Guide) */}
             <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-500 ${showGuide ? 'opacity-[0.12]' : 'opacity-0'}`}>
                <span className="text-[150px] sm:text-[250px] md:text-[350px] font-hand text-black font-bold leading-none select-none">
                  {word}
                </span>
             </div>

             <canvas 
                ref={canvasRef}
                className="block touch-none cursor-crosshair w-full h-full rounded-[32px] z-10"
             />
             
             {/* Corner Accents */}
             <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-orange-200 rounded-tl-2xl pointer-events-none"></div>
             <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-orange-200 rounded-br-2xl pointer-events-none"></div>
        </div>
      </div>

      <footer className="flex-none bg-white px-4 py-3 sm:py-5 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] z-20 flex items-center justify-between safe-area-pb">
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-[24px] border border-gray-100">
          <button 
            onClick={() => setActiveTool(ToolType.PEN)}
            className={`p-3 sm:p-4 rounded-2xl transition-all ${activeTool === ToolType.PEN ? 'bg-white shadow-lg text-primary scale-110' : 'text-gray-300 hover:text-gray-500'}`}
          >
            <Pen size={24} className="sm:w-8 sm:h-8" fill={activeTool === ToolType.PEN ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => setActiveTool(ToolType.ERASER)}
            className={`p-3 sm:p-4 rounded-2xl transition-all ${activeTool === ToolType.ERASER ? 'bg-white shadow-lg text-primary scale-110' : 'text-gray-300 hover:text-gray-500'}`}
          >
            <Eraser size={24} className="sm:w-8 sm:h-8" />
          </button>
          <div className="w-px h-8 bg-gray-200 mx-1"></div>
          <button 
            onClick={clearCanvas}
            className="p-3 sm:p-4 rounded-2xl text-red-300 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
          >
            <Trash2 size={24} className="sm:w-8 sm:h-8" />
          </button>
        </div>

        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-auto px-8 py-4 sm:px-12 sm:py-5 text-xl sm:text-2xl rounded-3xl shadow-orange-200"
          icon={isSubmitting ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle size={28} />}
        >
          {isSubmitting ? '분석 중...' : '제출하기'}
        </Button>
      </footer>
    </div>
  );
};
