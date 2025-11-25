import React, { useMemo, useState, useEffect, useRef } from 'react';
import { AIImage } from './AIImage';
import { Icons } from './Icons';
import { SiteSettings } from '../types';

interface HeroProps {
  onStartCustomizing: () => void;
  onAskAi: () => void;
  siteSettings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ onStartCustomizing, onAskAi, siteSettings }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "早安！聽說早起的鳥兒有蟲吃？";
    if (hour >= 11 && hour < 14) return "午安！今天的陽光真舒服是也！";
    if (hour >= 14 && hour < 18) return "午安！是時候睡個午覺了嗎？";
    if (hour >= 18 && hour < 23) return "晚安！今天的星星很漂亮是也！";
    return "還沒睡嗎？小心幽靈出現喔...";
  }, []);

  // Gyroscope Effect for Mobile Hero
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
        if (window.innerWidth < 1024 && cardRef.current) {
            const y = e.gamma || 0; // Left/Right
            const x = e.beta || 0;  // Front/Back
            
            // Subtle tilt for hero (clamped)
            const clampedX = Math.max(-10, Math.min(10, (x - 45))); 
            const clampedY = Math.max(-10, Math.min(10, y));

            setTilt({ x: -clampedX, y: clampedY });
        }
    };

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] lg:h-screen flex flex-col justify-center overflow-hidden pt-8 lg:pt-12 pb-10 px-4 bg-ac-cream/50">
      
      {/* Decorative Background Blobs (Desktop Only) */}
      <div className="hidden lg:block absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-ac-blue/10 rounded-full blur-3xl"></div>
      <div className="hidden lg:block absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-ac-green/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Text Content - Order 1 on mobile */}
        <div className="text-center lg:text-left space-y-5 md:space-y-8 order-1 flex flex-col items-center lg:items-start">
          
          {/* Top Badge - Time Aware Greeting */}
          <div className="inline-flex items-center bg-white border-2 border-ac-blue rounded-full px-3 py-1 text-xs md:text-sm font-bold text-ac-blue tracking-wider shadow-sm animate-fade-in-up">
             <Icons.Plane className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
             {greeting}
          </div>
          
          {/* Headings */}
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-black text-ac-darkBrown leading-tight drop-shadow-sm">
              100% 客製化<br />
              <span className="text-ac-green">海姆名床手作床墊</span>
            </h1>
            <p className="text-sm md:text-xl text-ac-brown font-bold leading-relaxed px-2 lg:px-0 opacity-90">
              軟硬自己拚 · 材料自己選 · 再也不怕買錯床
            </p>
          </div>
          
          {/* Trust Badges - Compact for Mobile */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 px-1 lg:px-0 max-w-md lg:max-w-none">
             {['🇹🇼 台灣職人手作', '🚚 專人運輸配送', '🛡️ 15 年保固'].map(tag => (
                 <span key={tag} className="bg-white/60 backdrop-blur px-2 py-1 rounded-lg text-[10px] md:text-sm font-bold text-ac-darkBrown border border-ac-cream/50">
                     {tag}
                 </span>
             ))}
          </div>

          {/* Buttons - Full width on mobile with proper spacing */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2 w-full max-w-xs sm:max-w-md mx-auto lg:mx-0 lg:max-w-none">
            <button 
              onClick={onStartCustomizing}
              className="w-full sm:w-auto bg-ac-orange text-white text-lg md:text-xl font-bold px-8 py-3 md:py-4 rounded-xl md:rounded-full shadow-[0_4px_0_#d68c55] md:shadow-[0_6px_0_#d68c55] hover:shadow-[0_6px_0_#d68c55] hover:-translate-y-1 active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center"
            >
              <Icons.Workbench className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              開始 DIY 製作
            </button>
            <button 
              onClick={onAskAi}
              className="w-full sm:w-auto bg-white text-ac-blue border-4 border-ac-blue text-lg md:text-xl font-bold px-8 py-2.5 md:py-4 rounded-xl md:rounded-full shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:bg-blue-50 transition-all flex items-center justify-center active:translate-y-[2px] active:shadow-none"
            >
              <Icons.Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              詢問哈姆 (AI)
            </button>
          </div>
        </div>

        {/* 3D Visual (Exploded View) - Order 2 */}
        <div className="relative group order-2 mt-2 lg:mt-0 px-8 lg:px-0 perspective-[1000px]">
            <div className="relative w-full aspect-square max-w-[280px] md:max-w-md mx-auto lg:max-w-none">
              {/* Image Card */}
              <div 
                  ref={cardRef}
                  style={{ 
                      transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(-1deg)`,
                      transition: 'transform 0.2s ease-out'
                  }}
                  className="bg-white p-2 md:p-4 pb-8 md:pb-12 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl md:shadow-2xl border-4 md:border-8 border-white md:hover:rotate-0 duration-500 transform-style-preserve-3d"
              >
                  <div className="rounded-[1rem] md:rounded-[2rem] overflow-hidden border-2 md:border-4 border-ac-cream w-full h-full relative bg-ac-cream/50">
                    <AIImage 
                        staticImage={siteSettings.heroImage}
                        prompt="Hero Image Placeholder"
                        alt="Custom Mattress Exploded View"
                        className="w-full h-full object-cover"
                        aspectRatio="1:1"
                    />
                  </div>
                  <div className="absolute bottom-2 md:bottom-3 left-0 w-full text-center font-handwriting text-ac-darkBrown font-bold text-sm md:text-xl opacity-80">
                      ✨ 每一層都能自己選！
                  </div>
              </div>
              
              {/* Floating Tag - Counter animated */}
              <div 
                  style={{ 
                      transform: `translate(${tilt.y * 2}px, ${tilt.x * 2}px) rotate(12deg)`
                  }}
                  className="absolute -top-2 -right-4 md:-top-4 md:-right-4 bg-ac-yellow text-ac-darkBrown px-3 py-1 md:px-4 md:py-2 rounded-full font-black border-2 md:border-4 border-white shadow-lg animate-bounce-slow text-xs md:text-base transition-transform duration-200"
              >
                  自由組裝！
              </div>
            </div>
        </div>

      </div>
    </section>
  );
};
