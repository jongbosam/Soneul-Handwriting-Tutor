
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
        // We use two translates: 
        // 1. Move the div to the mouse position.
        // 2. Shift the div so its bottom-right corner (-100%, -100%) is at that position.
        // 3. Add a small offset (6px, 6px) to align the visual "tip" (which is often recessed due to padding) 
        //    precisely with the mouse pointer.
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-100%, -100%) translate(6px, 6px)`;
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

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] text-4xl select-none transition-opacity duration-300 hidden md:block"
      style={{ 
        willChange: 'transform',
        filter: 'drop-shadow(2px 2px 1px rgba(0,0,0,0.15))'
      }}
    >
      <div className={levelData.visualClass} style={{ filter: levelData.filterStyle }}>
        {levelData.icon}
      </div>
    </div>
  );
};
