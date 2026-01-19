
import React, { useRef, useEffect, useState } from 'react';
import { ToolType } from '../types';
import { Button } from './Button';
import { Eraser, Pen, Trash2, CheckCircle, ArrowLeft, Eye, EyeOff, Grid3X3 } from 'lucide-react';

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
  const [showGrid, setShowGrid] = useState(true);
  
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

      // Save content before resize
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx?.drawImage(canvas, 0, 0);

      // Match internal dimensions to screen dimensions
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Restore content scaled to new size
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
    // Use a small delay to ensure CSS transitions/layout are complete
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
      
      // Calculate scale factors in case CSS width/height differs from attribute width/height
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

      return { 
        x: (clientX - rect.left) * scaleX, 
        y: (clientY - rect.top) * scaleY 
      };
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

  const handleSubmit = () => {
    if (canvasRef.current) {
      onSubmit(canvasRef.current);
    }
  };

  return (
    <div className="fixed inset-0 bg-paper flex flex-col h-[100dvh]">
      <header className="flex-none bg-white/80 backdrop-blur px-4 py-2 flex items-center justify-between shadow-sm z-20 border-b border-gray-100">
        <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft size={20} />}>
          그만하기
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Geometric Practice</span>
          <h2 className="text-3xl font-hand text-primary drop-shadow-sm">{word}</h2>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2.5 rounded-xl transition-all ${showGrid ? 'text-primary bg-orange-50' : 'text-gray-300'}`}
          >
            <Grid3X3 size={22} />
          </button>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className={`p-2.5 rounded-xl transition-all ${showGuide ? 'text-blue-500 bg-blue-50' : 'text-gray-300'}`}
          >
            {showGuide ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        </div>
      </header>

      <div className="flex-1 relative w-full min-h-0 p-4 sm:p-8 flex items-center justify-center overflow-hidden">
        <div 
          ref={containerRef} 
          className="w-full h-full max-w-5xl relative bg-white rounded-[48px] shadow-2xl border-[16px] border-white ring-1 ring-gray-100 flex items-center justify-center overflow-hidden cursor-none"
          style={{ cursor: 'none' }} // Explicit inline style to ensure crosshair is removed
        >
             
             {/* K-PANOSE Professional Grid */}
             {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                    {/* 9-Box Grid */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-[0.05]">
                        {[...Array(9)].map((_, i) => <div key={i} className="border border-gray-800" />)}
                    </div>
                    {/* Diagonal Guides */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.03] stroke-gray-900" style={{ strokeWidth: 2 }}>
                        <line x1="0" y1="0" x2="100%" y2="100%" />
                        <line x1="100%" y1="0" x2="0" y2="100%" />
                    </svg>
                    {/* Center Cross */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-primary/10 -translate-y-1/2" />
                    <div className="absolute left-1/2 top-0 w-px h-full bg-primary/10 -translate-x-1/2" />
                </div>
             )}

             {/* Aesthetic Ghost Guide */}
             <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-700 ${showGuide ? 'opacity-[0.1]' : 'opacity-0'}`}>
                <span className="text-[180px] sm:text-[300px] md:text-[450px] font-hand text-black font-black leading-none tracking-tighter">
                  {word}
                </span>
             </div>

             <canvas 
                ref={canvasRef}
                className="block touch-none cursor-none w-full h-full rounded-[32px] z-10"
                style={{ cursor: 'none' }}
             />
             
             {/* Dynamic corners */}
             <div className="absolute top-8 left-8 w-16 h-16 border-t-8 border-l-8 border-gray-50 rounded-tl-3xl pointer-events-none"></div>
             <div className="absolute bottom-8 right-8 w-16 h-16 border-b-8 border-r-8 border-gray-50 rounded-br-3xl pointer-events-none"></div>
        </div>
      </div>

      <footer className="flex-none bg-white/90 backdrop-blur px-6 py-4 shadow-[0_-15px_40px_-20px_rgba(0,0,0,0.1)] z-20 flex items-center justify-between safe-area-pb">
        <div className="flex items-center gap-4 bg-gray-100/50 p-2.5 rounded-[32px]">
          <button 
            onClick={() => setActiveTool(ToolType.PEN)}
            className={`p-4 rounded-[24px] transition-all ${activeTool === ToolType.PEN ? 'bg-white shadow-xl text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Pen size={28} fill={activeTool === ToolType.PEN ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => setActiveTool(ToolType.ERASER)}
            className={`p-4 rounded-[24px] transition-all ${activeTool === ToolType.ERASER ? 'bg-white shadow-xl text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Eraser size={28} />
          </button>
          <div className="w-px h-10 bg-gray-200" />
          <button 
            onClick={clearCanvas}
            className="p-4 rounded-[24px] text-gray-300 hover:text-red-400 transition-all active:scale-90"
          >
            <Trash2 size={28} />
          </button>
        </div>

        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-auto px-16 py-5 rounded-[32px] text-2xl shadow-orange-200"
          icon={isSubmitting ? <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={32} />}
        >
          {isSubmitting ? '정밀 분석 중...' : '제출하기'}
        </Button>
      </footer>
    </div>
  );
};
