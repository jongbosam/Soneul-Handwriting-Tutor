
import React, { useEffect, useRef, useState } from 'react';
import { LEVELS } from '../constants';

interface CustomCursorProps {
  level: number;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ level }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Precise alignment for Pencil Tip:
        // We use a fixed SVG for the pencil, which has its tip at the Bottom-Left (approx coordinate 2,22 in 24x24 box).
        // 'translate(-2px, -95%)' aligns this visual tip exactly to the mouse (clientX, clientY).
        // This ensures the "ink" appears to flow directly from the pencil tip.
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-2px, -95%)`;
      }
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Find the icon for the current level
  const levelData = LEVELS.find(l => l.level === level) || LEVELS[0];
  const isPencil = levelData.icon === '✏️';

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 hidden md:block"
      style={{ 
        willChange: 'transform',
        filter: 'drop-shadow(3px 5px 2px rgba(0,0,0,0.2))'
      }}
    >
      <div 
        className={`text-4xl leading-none flex items-center justify-center ${levelData.visualClass}`} 
        style={{ filter: levelData.filterStyle }}
      >
        {isPencil ? (
             // Custom SVG Pencil to replace unreliable Emoji (Windows vs Mac alignment issues)
             <svg 
               width="1em" 
               height="1em" 
               viewBox="0 0 24 24" 
               fill="#FFB347" 
               stroke="#92400E" 
               strokeWidth="1.5"
               strokeLinecap="round" 
               strokeLinejoin="round"
             >
               {/* Pencil Body */}
               <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
               <path d="m15 5 4 4" />
               {/* Graphite Tip (Darkened for realism) */}
               <path d="M2 22 L7.5 20.5 L6 19 L3.5 16.5 L2 22" fill="#2D2D2D" stroke="none" />
             </svg>
        ) : (
             <span>{levelData.icon}</span>
        )}
      </div>
    </div>
  );
};
