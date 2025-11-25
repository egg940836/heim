
import React, { useEffect, useRef } from 'react';

export const ParallaxBackground: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!bgRef.current) return;

      // Extract tilt values
      // gamma: Left/Right tilt (-90 to 90)
      // beta: Front/Back tilt (-180 to 180)
      const x = e.gamma || 0;
      const y = e.beta || 0;

      // Limit the range to avoid extreme shifts
      const clampedX = Math.max(-30, Math.min(30, x));
      const clampedY = Math.max(-30, Math.min(30, y));

      // Calculate shift (Inverse movement for depth)
      const xShift = -clampedX * 1.5; // 1.5px per degree
      const yShift = -clampedY * 1.5;

      // Apply transform using requestAnimationFrame for performance
      requestAnimationFrame(() => {
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(${xShift}px, ${yShift}px, 0)`;
        }
      });
    };

    // Check if device supports orientation
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 
        Background Layer 
        - Increased size (110%) to prevent white edges during movement 
        - Centered 
      */}
      <div 
        ref={bgRef}
        className="absolute -top-[5%] -left-[5%] w-[110%] h-[110%] bg-leaf-pattern opacity-40 transition-transform duration-100 ease-out will-change-transform"
        style={{
            backgroundSize: '60px 60px', // Match the Tailwind config size
        }}
      ></div>
    </div>
  );
};
