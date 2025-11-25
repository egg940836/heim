
import React, { useEffect } from 'react';

export const CursorEffects: React.FC = () => {
  useEffect(() => {
    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('div');
      const size = Math.random() * 10 + 10; // 10-20px
      
      // Styles
      particle.style.position = 'fixed';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.transform = 'translate(-50%, -50%)';
      
      // Random Icon (Star or Circle)
      const type = Math.random() > 0.5 ? 'star' : 'circle';
      if (type === 'star') {
          particle.innerHTML = `<svg viewBox="0 0 24 24" fill="#F9F398" style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
      } else {
          particle.innerHTML = `<svg viewBox="0 0 24 24" fill="#78B159" style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));"><circle cx="12" cy="12" r="10"/></svg>`;
      }

      document.body.appendChild(particle);

      // Animation
      const destinationX = (Math.random() - 0.5) * 100;
      const destinationY = (Math.random() - 0.5) * 100;
      const rotation = Math.random() * 360;

      const animation = particle.animate([
        { transform: `translate(-50%, -50%) scale(0.5) rotate(0deg)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(0) rotate(${rotation}deg)`, opacity: 0 }
      ], {
        duration: 600,
        easing: 'cubic-bezier(0, .9, .57, 1)',
      });

      animation.onfinish = () => {
        particle.remove();
      };
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn 3-5 particles
      const count = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < count; i++) {
        createParticle(e.clientX, e.clientY);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return null;
};
