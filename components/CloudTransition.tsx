
import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';

interface CloudTransitionProps {
    type?: 'full' | 'light';
}

export const CloudTransition: React.FC<CloudTransitionProps> = ({ type = 'full' }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = type === 'light' ? 800 : 1500; // Faster for light mode
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [type]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background Cream Layer */}
      <div className="absolute inset-0 bg-ac-cream animate-cloud-fade-out"></div>

      {/* Clouds - Only show distinct clouds in full mode, or simplified in light mode */}
      <div className="absolute inset-0 flex items-center justify-center">
         {/* Top Left Cloud */}
         <div className={`absolute -top-20 -left-20 w-[60vw] h-[60vw] bg-white rounded-full animate-cloud-move-tl opacity-90 ${type === 'light' ? 'duration-700' : ''}`}></div>
         {/* Top Right Cloud */}
         <div className={`absolute -top-20 -right-20 w-[70vw] h-[70vw] bg-white rounded-full animate-cloud-move-tr opacity-90 ${type === 'light' ? 'duration-700' : ''}`}></div>
         {/* Bottom Left Cloud */}
         <div className={`absolute -bottom-40 -left-20 w-[65vw] h-[65vw] bg-white rounded-full animate-cloud-move-bl opacity-90 ${type === 'light' ? 'duration-700' : ''}`}></div>
         {/* Bottom Right Cloud */}
         <div className={`absolute -bottom-20 -right-20 w-[60vw] h-[60vw] bg-white rounded-full animate-cloud-move-br opacity-90 ${type === 'light' ? 'duration-700' : ''}`}></div>
      </div>

      {/* Center Icon - Only for FULL mode */}
      {type === 'full' && (
          <div className="relative z-10 text-ac-green animate-cloud-icon-pop">
              <Icons.Plane className="w-24 h-24 drop-shadow-lg text-ac-blue" />
              <p className="text-center font-black text-ac-blue mt-4 tracking-widest text-xl">前往海姆島...</p>
          </div>
      )}

      <style>{`
        @keyframes cloud-fade-out {
            0% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }
        @keyframes cloud-move-tl {
            0% { transform: translate(0, 0) scale(1); }
            40% { transform: translate(10%, 10%) scale(1.1); }
            100% { transform: translate(-100%, -100%) scale(0.5); }
        }
        @keyframes cloud-move-tr {
            0% { transform: translate(0, 0) scale(1); }
            40% { transform: translate(-10%, 10%) scale(1.1); }
            100% { transform: translate(100%, -100%) scale(0.5); }
        }
        @keyframes cloud-move-bl {
            0% { transform: translate(0, 0) scale(1); }
            40% { transform: translate(10%, -10%) scale(1.1); }
            100% { transform: translate(-100%, 100%) scale(0.5); }
        }
        @keyframes cloud-move-br {
            0% { transform: translate(0, 0) scale(1); }
            40% { transform: translate(-10%, -10%) scale(1.1); }
            100% { transform: translate(100%, 100%) scale(0.5); }
        }
        @keyframes cloud-icon-pop {
            0% { transform: scale(0.5); opacity: 0; }
            20% { transform: scale(1.1); opacity: 1; }
            40% { transform: scale(1); opacity: 1; }
            80% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
        }
        .animate-cloud-fade-out { animation: cloud-fade-out ${type === 'light' ? '0.8s' : '1.2s'} ease-in-out forwards; }
        .animate-cloud-move-tl { animation: cloud-move-tl ${type === 'light' ? '0.8s' : '1.5s'} ease-in-out forwards; }
        .animate-cloud-move-tr { animation: cloud-move-tr ${type === 'light' ? '0.8s' : '1.5s'} ease-in-out forwards; }
        .animate-cloud-move-bl { animation: cloud-move-bl ${type === 'light' ? '0.8s' : '1.5s'} ease-in-out forwards; }
        .animate-cloud-move-br { animation: cloud-move-br ${type === 'light' ? '0.8s' : '1.5s'} ease-in-out forwards; }
        .animate-cloud-icon-pop { animation: cloud-icon-pop 1.5s ease-in-out forwards; }
      `}</style>
    </div>
  );
};
