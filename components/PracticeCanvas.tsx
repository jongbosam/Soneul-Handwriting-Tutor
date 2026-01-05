
import React, { useRef, useEffect, useState } from 'react';
import { ToolType } from '../types';
import { Button } from './Button';
import { Eraser, Pen, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';

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
  
  // Keep track of tool state for the effect closure
  const activeToolRef = useRef(activeTool);

  // Update ref when state changes
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
      ctx.strokeStyle = '#2C2C2C'; // Ink color
      ctx.lineWidth = 8;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 40; // Eraser size
    }
  }, [activeTool]);

  // Handle Resize and High DPI
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        if (width === 0 || height === 0) return;

        // Save current content to avoid clearing on resize
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvasRef.current.width;
        tempCanvas.height = canvasRef.current.height;
        tempCtx?.drawImage(canvasRef.current, 0, 0);

        // Resize
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Restore content (stretched to fit new size)
          ctx.drawImage(tempCanvas, 0, 0, width, height);
          
          // Re-apply tool settings
          if (activeToolRef.current === ToolType.PEN) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = '#2C2C2C';
            ctx.lineWidth = 8;
          } else {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 40;
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial size setup
    handleResize();
    
    // Additional check for mobile address bar shifts
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Drawing Logic
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
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      // Only prevent default if it's touch to prevent scrolling while drawing
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
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const isCanvasBlank = (canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;

    const pixelBuffer = new Uint32Array(
      ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );

    // Check if there are any non-transparent pixels.
    // The canvas is transparent by default, and we draw with opacity 1.
    // So any pixel with alpha > 0 means something was drawn.
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
      {/* Compact Header for Landscape */}
      <header className="flex-none bg-white px-4 py-2 flex items-center justify-between shadow-sm z-20 border-b border-gray-100">
        <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft size={20} />}>
          그만하기
        </Button>
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
           <span className="text-sm text-gray-400 font-normal hidden sm:inline">따라 쓰기</span>
           <span className="text-primary text-2xl font-hand">{word}</span>
        </h2>
        <div className="w-[88px]"></div> {/* Spacer */}
      </header>

      {/* Flexible Canvas Area */}
      <div className="flex-1 relative w-full min-h-0 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        <div ref={containerRef} className="w-full h-full max-w-4xl relative bg-white rounded-3xl shadow-lg border-4 border-dashed border-orange-100 flex items-center justify-center overflow-hidden">
             
             {/* Guide Text Background */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20">
                <span className="text-[120px] sm:text-[200px] md:text-[250px] font-hand text-gray-400 font-bold leading-none">
                  {word}
                </span>
             </div>

             {/* The Canvas - Takes full size of the container */}
             <canvas 
                ref={canvasRef}
                className="block touch-none cursor-crosshair w-full h-full rounded-2xl"
             />
        </div>
      </div>

      {/* Toolbar */}
      <footer className="flex-none bg-white px-4 py-2 sm:py-3 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-20 flex items-center justify-between safe-area-pb">
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTool(ToolType.PEN)}
            className={`p-2 sm:p-3 rounded-xl transition-all ${activeTool === ToolType.PEN ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Pen size={20} className="sm:w-6 sm:h-6" fill={activeTool === ToolType.PEN ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => setActiveTool(ToolType.ERASER)}
            className={`p-2 sm:p-3 rounded-xl transition-all ${activeTool === ToolType.ERASER ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Eraser size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button 
            onClick={clearCanvas}
            className="p-2 sm:p-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-auto px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg rounded-xl"
          icon={isSubmitting ? <span className="animate-spin">⏳</span> : <CheckCircle size={20} />}
        >
          {isSubmitting ? '채점 중...' : '다 썼어요!'}
        </Button>
      </footer>
    </div>
  );
};
