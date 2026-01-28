
import React, { useRef, useEffect, useState } from 'react';
import { ToolType } from '../types';
import { Button } from './Button';
import { Eraser, Pen, Trash2, CheckCircle, ArrowLeft, Eye, EyeOff, Grid3X3, Lightbulb, X } from 'lucide-react';

interface PracticeCanvasProps {
  sentence: string;
  target: string;
  hint: string;
  onBack: () => void;
  onSubmit: (canvas: HTMLCanvasElement) => void;
  isSubmitting: boolean;
}

export const PracticeCanvas: React.FC<PracticeCanvasProps> = ({ 
  sentence,
  target,
  hint,
  onBack, 
  onSubmit,
  isSubmitting 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.PEN);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showHint, setShowHint] = useState(false);
  
  const activeToolRef = useRef(activeTool);

  const getDynamicFontSize = (text: string) => {
    const len = text.length;
    if (len <= 4) return 'min(35vw, 45vh)';
    if (len <= 8) return 'min(20vw, 30vh)';
    return 'min(15vw, 25vh)';
  };

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
      ctx.strokeStyle = '#1A1A1A'; 
      ctx.lineWidth = 12; 
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 50; 
    }
  }, [activeTool]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx?.drawImage(canvas, 0, 0);

      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
        if (activeToolRef.current === ToolType.PEN) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = '#1A1A1A';
          ctx.lineWidth = 12;
        } else {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = 50;
        }
      }
    };
    window.addEventListener('resize', handleResize);
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
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
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
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
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

  const handleSubmit = () => {
    if (canvasRef.current) onSubmit(canvasRef.current);
  };

  return (
    <div className="fixed inset-0 bg-paper flex flex-col h-[100dvh]">
      <header className="flex-none bg-white/80 backdrop-blur px-4 py-3 flex items-center justify-between shadow-sm z-20 border-b border-gray-100">
        <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft size={20} />}>
          그만하기
        </Button>
        <div className="flex flex-col items-center flex-1 mx-4 overflow-hidden">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5 truncate w-full text-center">전체 문장 학습</span>
          <h2 className="text-xl md:text-2xl font-hand text-gray-700 truncate w-full text-center">
            {sentence.split(target).map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-primary font-bold underline decoration-2 underline-offset-4">{target}</span>}
              </React.Fragment>
            ))}
          </h2>
        </div>
        <div className="flex gap-1 items-center">
          <button 
            onClick={() => setShowHint(!showHint)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all font-bold text-sm ${showHint ? 'bg-primary text-white shadow-lg' : 'bg-orange-50 text-primary hover:bg-orange-100'}`}
          >
            <Lightbulb size={16} /> 설명
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl transition-all ${showGrid ? 'text-primary bg-orange-50' : 'text-gray-300'}`}
          >
            <Grid3X3 size={20} />
          </button>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className={`p-2 rounded-xl transition-all ${showGuide ? 'text-blue-500 bg-blue-50' : 'text-gray-300'}`}
          >
            {showGuide ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 relative w-full min-h-0 p-3 sm:p-6 flex items-center justify-center overflow-hidden">
        {showHint && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 w-full max-w-md px-4">
            <div className="bg-white p-5 rounded-3xl shadow-2xl border-4 border-primary relative">
              <button onClick={() => setShowHint(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 mb-1">선생님의 팁!</h4>
                  <p className="text-gray-600 leading-relaxed text-sm break-keep">{hint}</p>
                </div>
              </div>
              <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-r-4 border-b-4 border-primary rotate-45"></div>
            </div>
          </div>
        )}

        <div 
          ref={containerRef} 
          className="w-full h-full max-w-5xl relative bg-white rounded-[32px] md:rounded-[48px] shadow-2xl border-[6px] md:border-[12px] border-white ring-1 ring-gray-100 flex items-center justify-center overflow-hidden"
        >
             {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-[0.03]">
                        {[...Array(24)].map((_, i) => <div key={i} className="border border-gray-800" />)}
                    </div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-primary/5 -translate-y-1/2" />
                    <div className="absolute left-1/2 top-0 w-px h-full bg-primary/5 -translate-x-1/2" />
                </div>
             )}

             <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-700 px-4 ${showGuide ? 'opacity-[0.08]' : 'opacity-0'}`}>
                <span 
                  className="font-hand text-black font-black leading-tight tracking-normal text-center break-keep"
                  style={{ fontSize: getDynamicFontSize(target) }}
                >
                  {target}
                </span>
             </div>

             <canvas 
                ref={canvasRef}
                className="block touch-none w-full h-full rounded-[24px] md:rounded-[32px] z-10"
             />
        </div>
      </div>

      <footer className="flex-none bg-white/90 backdrop-blur px-6 py-4 shadow-[0_-15px_40px_-20px_rgba(0,0,0,0.1)] z-20 flex items-center justify-between safe-area-pb">
        <div className="flex items-center gap-2 md:gap-4 bg-gray-100/50 p-1.5 md:p-2.5 rounded-[32px]">
          <button 
            onClick={() => setActiveTool(ToolType.PEN)}
            className={`p-3 md:p-4 rounded-[24px] transition-all ${activeTool === ToolType.PEN ? 'bg-white shadow-xl text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Pen size={24} className="md:w-7 md:h-7" fill={activeTool === ToolType.PEN ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => setActiveTool(ToolType.ERASER)}
            className={`p-3 md:p-4 rounded-[24px] transition-all ${activeTool === ToolType.ERASER ? 'bg-white shadow-xl text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Eraser size={24} className="md:w-7 md:h-7" />
          </button>
          <div className="w-px h-8 md:h-10 bg-gray-200" />
          <button 
            onClick={clearCanvas}
            className="p-3 md:p-4 rounded-[24px] text-gray-300 hover:text-red-400 transition-all active:scale-90"
          >
            <Trash2 size={24} className="md:w-7 md:h-7" />
          </button>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Write: {target}</span>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-auto px-6 md:px-10 py-3 md:py-5 rounded-[28px] text-lg md:text-xl shadow-orange-200"
            icon={isSubmitting ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={24} />}
          >
            {isSubmitting ? '채점 중...' : '다 썼어요!'}
          </Button>
        </div>
      </footer>
    </div>
  );
};
