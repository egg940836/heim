
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from './Icons';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('heim_cookie_consent');
    if (!consent) {
      // Delay slightly longer to let other intros finish
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('heim_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md md:bottom-4 md:left-auto md:right-4 md:translate-x-0 md:w-auto z-[200] pointer-events-none animate-fade-in-up">
      <div className="bg-white/95 backdrop-blur-md border-2 border-ac-green rounded-2xl p-3 shadow-xl pointer-events-auto flex items-center gap-3 relative overflow-hidden">
        
        {/* Icon */}
        <div className="flex-shrink-0 bg-ac-cream p-2 rounded-full">
            <Icons.NookPhone className="w-5 h-5 text-ac-green" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-ac-brown font-bold leading-tight">
            本島使用 Cookie 紀錄您的護照與設定。
            <span className="block md:inline md:ml-1">
                繼續即同意
                <Link to="/policy" className="text-ac-green underline hover:text-ac-darkBrown ml-1 decoration-dashed underline-offset-2">
                    隱私政策
                </Link>。
            </span>
          </p>
        </div>

        {/* Button */}
        <button 
            onClick={handleAccept}
            className="flex-shrink-0 bg-ac-green text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-[#66a04b] active:scale-95 transition-all whitespace-nowrap"
        >
            OK!
        </button>
      </div>
    </div>
  );
};
