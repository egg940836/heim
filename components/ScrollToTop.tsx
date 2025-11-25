
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = window.scrollY;
      if (scrolled > 300) {
        setVisible(true);
      } else {
        setVisible(false);
        setIsFlying(false);
      }
    };

    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const handleClick = () => {
    setIsFlying(true);
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('heim:fly-to-top'));
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  };

  return (
    <div 
        className={`fixed right-4 z-40 transition-all duration-[1000ms] ease-in-out
            ${isFlying ? 'bottom-[110vh] opacity-0' : 'bottom-24 lg:bottom-8'}
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
    >
        <button 
            onClick={handleClick}
            className={`group relative w-12 h-12 bg-white border-2 border-ac-blue rounded-full shadow-md flex items-center justify-center text-ac-blue transition-all duration-300 hover:bg-ac-blue hover:text-white hover:scale-110 hover:shadow-lg active:scale-95
                ${isFlying ? 'scale-75' : ''}
            `}
            title="飛回頂部"
        >
            {/* Paper Plane Icon */}
            <div className={`transform transition-transform duration-500 ${isFlying ? '-rotate-45' : 'group-hover:-rotate-12'}`}>
                <Icons.Plane className="w-5 h-5" />
            </div>

            {/* Wind Trail Effect (Only visible when flying) */}
            {isFlying && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-20 bg-gradient-to-t from-transparent via-white/50 to-white opacity-50"></div>
            )}
        </button>
    </div>
  );
};
