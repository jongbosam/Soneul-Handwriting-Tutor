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
  
  // Keep track of tool in ref for resize handler to access without dependency
  const activeToolRef = useRef(activeTool);

  // Update tool settings in context and ref whenever activeTool changes
  useEffect(() => {
    activeToolRef.current = activeTool;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (activeTool === ToolType.PEN) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 30;
    }
  }, [activeTool]);

  // Handle Resize and Initialization
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        if (width === 0 || height === 0) return;

        // Check if resize is actually needed to avoid clearing canvas unnecessarily
        if (canvasRef.current.width === width && canvasRef.current.height === height) return;

        // Save current content
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvasRef.current.width;
        tempCanvas.height = canvasRef.current.height;
        tempCtx?.drawImage(canvasRef.current, 0, 0);

        // Resize (this clears the canvas)
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        // Restore content
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Draw back the content stretched to fit new size
            ctx.drawImage(tempCanvas, 0, 0, width, height);
            
            // Re-apply current tool settings after context reset
            if (activeToolRef.current === ToolType.PEN) {
              ctx.globalCompositeOperation = 'source-over';
              ctx.strokeStyle = '#000000';
              ctx.lineWidth = 8;
            } else {
              ctx.globalCompositeOperation = 'destination-out';
              ctx.lineWidth = 30;
            }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial resize: Use setTimeout to ensure DOM is fully laid out and dimensions are correct
    const timer = setTimeout(handleResize, 50);

    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
    };
  }, []); // Run only once on mount

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isSubmitting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Capture pointer to track movement outside canvas bounds if needed
    canvas.setPointerCapture(e.pointerId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Ensure settings are correct before drawing (Redundant safety check)
    if (activeTool === ToolType.PEN) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 30;
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isSubmitting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = () => {
    if(canvasRef.current) {
        onSubmit(canvasRef.current);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-100">
      {/* Top Bar */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10">
        <Button variant="ghost" size="sm" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="mr-2" /> 뒤로가기
        </Button>
        <h2 className="text-xl font-bold text-gray-700">글씨 연습 시간</h2>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      {/* Canvas Area */}
      <div className="flex-grow relative p-4 flex flex-col items-center justify-center overflow-hidden">
        <div 
            ref={containerRef}
            className="relative w-full max-w-5xl aspect-[4/3] bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
            {/* Guide Layer (Background) */}
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                
                {/* Guide Container */}
                <div className="relative w-[70%] h-[60%] flex items-center justify-center">
                  
                  {/* Guide Word */}
                  <span className="text-[200px] font-bold text-gray-200 font-hand tracking-widest opacity-60 z-0">
                      {word}
                  </span>

                  {/* Horizontal Guide Lines */}
                  <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center opacity-40 z-10">
                      {/* Pink Top Line */}
                      <div className="w-full border-b-2 border-dashed border-pink-300 mb-[100px]"></div>
                      {/* Blue Bottom Line */}
                      <div className="w-full border-b-2 border-dashed border-blue-300 mt-[100px]"></div>
                  </div>
                </div>

            </div>

            {/* Drawing Layer - Using Pointer Events for Mouse/Touch/Pen support */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-20"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
            />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-center items-center gap-4 safe-pb">
        <div className="bg-gray-100 p-2 rounded-2xl flex gap-2">
            <Button 
                variant={activeTool === ToolType.PEN ? 'primary' : 'ghost'} 
                onClick={() => setActiveTool(ToolType.PEN)}
                disabled={isSubmitting}
                className={activeTool === ToolType.PEN ? 'scale-110' : ''}
                title="연필"
            >
                <Pen size={24} />
            </Button>
            <Button 
                variant={activeTool === ToolType.ERASER ? 'secondary' : 'ghost'} 
                onClick={() => setActiveTool(ToolType.ERASER)}
                disabled={isSubmitting}
                className={activeTool === ToolType.ERASER ? 'scale-110' : ''}
                title="지우개"
            >
                <Eraser size={24} />
            </Button>
        </div>

        <div className="h-10 w-px bg-gray-300 mx-2"></div>

        <Button variant="danger" onClick={clearCanvas} disabled={isSubmitting} title="모두 지우기">
            <Trash2 size={24} />
        </Button>

        <div className="flex-grow"></div>

        <Button 
            variant="primary" 
            size="lg" 
            className="bg-green-500 border-green-600 hover:bg-green-400 min-w-[200px]"
            onClick={handleSubmit}
            disabled={isSubmitting}
        >
            {isSubmitting ? '채점 중...' : <><CheckCircle className="mr-2"/> 다 썼어요!</>}
        </Button>
      </div>
    </div>
  );
};