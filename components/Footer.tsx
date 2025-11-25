
import React, { useState } from 'react';
import { STORE_INFO } from '../constants';
import { PageType } from './Header';
import { Icons } from './Icons';
import { PolicyTab } from './PolicyPage';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onOpenPolicy: (tab: PolicyTab) => void;
  isMusicPlaying?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicy, isMusicPlaying = false }) => {
  const [adminClickCount, setAdminClickCount] = useState(0);

  const handleSecretClick = () => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    if (newCount >= 5) {
      onNavigate('admin');
      setAdminClickCount(0);
    }
  };

  return (
    <footer className="bg-ac-green text-white pt-16 pb-8 px-6 mt-12 relative overflow-hidden z-0">
      {/* Decorative Grass Edge */}
      <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMTAgTTEwIDAgTDIwIDEwIFoiIGZpbGw9IiNGRkZERjAiLz48L3N2Zz4=')] bg-repeat-x -mt-1 transform rotate-180"></div>

      {/* Dancing Gyroid (Left Side) */}
      <div className="absolute bottom-4 left-4 z-10 opacity-30 pointer-events-none md:opacity-50">
          <div className={`transform origin-bottom transition-all duration-300 ${isMusicPlaying ? 'animate-wiggle' : ''}`}>
              <Icons.Gyroid className="w-16 h-16 md:w-24 md:h-24 text-[#5D4037]" />
          </div>
          <style>{`
            @keyframes wiggle {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(5deg); }
            }
            .animate-wiggle {
                animation: wiggle 0.5s ease-in-out infinite;
            }
          `}</style>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-sm relative z-10">
        <div className="col-span-1 pl-16 md:pl-0">
           <h4 className="font-display font-black text-2xl mb-4 tracking-widest flex items-center">
             <Icons.Leaf className="w-6 h-6 mr-2" />
             {STORE_INFO.name}
           </h4>
           <p className="opacity-90 font-medium leading-relaxed">
             KINGS BED LTD.<br/>
             致力於提供島民最舒適的睡眠體驗。
           </p>
        </div>

        <div>
          <h5 className="font-bold mb-4 text-lg border-b-2 border-white/30 pb-1 inline-block">島嶼導覽</h5>
          {/* Mobile/Tablet: 2 Columns, Desktop: 1 Column */}
          <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-4 font-bold">
            <li><button onClick={() => onNavigate('story')} className="hover:text-ac-yellow transition-colors flex items-center"><Icons.ArrowRight className="w-4 h-4 mr-1"/> 島嶼歷史</button></li>
            <li><button onClick={() => onNavigate('builder')} className="hover:text-ac-yellow transition-colors flex items-center"><Icons.ArrowRight className="w-4 h-4 mr-1"/> DIY 工坊</button></li>
            <li><button onClick={() => onNavigate('shop')} className="hover:text-ac-yellow transition-colors flex items-center"><Icons.ArrowRight className="w-4 h-4 mr-1"/> 限定商店</button></li>
            <li><button onClick={() => onNavigate('blog')} className="hover:text-ac-yellow transition-colors flex items-center"><Icons.ArrowRight className="w-4 h-4 mr-1"/> 島民日誌</button></li>
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <h5 className="font-bold mb-4 text-lg border-b-2 border-white/30 pb-1 inline-block">聯絡服務處</h5>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border-2 border-white/20">
            <p className="flex items-center mb-2"><span className="bg-white text-ac-green px-2 rounded-full mr-2 font-bold text-xs w-12 text-center">TEL</span> {STORE_INFO.phone}</p>
            <p className="flex items-center mb-2"><span className="bg-white text-ac-green px-2 rounded-full mr-2 font-bold text-xs w-12 text-center">ADD</span> <span className="flex-1">{STORE_INFO.address}</span></p>
            
            {/* Optimized LINE Section: Inline Button */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="flex items-center">
                    <span className="bg-white text-ac-green px-2 rounded-full mr-2 font-bold text-xs w-12 text-center">LINE</span> 
                    {STORE_INFO.lineId}
                </p>
                <a href={STORE_INFO.lineUrl} target="_blank" className="flex items-center text-xs bg-white text-ac-green font-black px-3 py-1.5 rounded-full hover:bg-ac-lightGreen hover:text-white transition-colors shadow-sm">
                    <Icons.Chat className="w-3 h-3 mr-1" />
                    加入好友
                </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t-2 border-white/20 flex flex-col md:flex-row justify-between items-center text-xs font-bold opacity-70">
        <p className="mb-4 md:mb-0 select-none text-center md:text-left">
          &copy; {new Date().getFullYear()} KINGS BED LTD. 
          <span onClick={handleSecretClick} className="cursor-default active:text-white transition-colors"> 統一編號：00190933</span>
        </p>
        <div className="flex space-x-4">
            <button onClick={() => onOpenPolicy('privacy')} className="hover:text-white transition-colors">隱私權政策</button>
            <button onClick={() => onOpenPolicy('terms')} className="hover:text-white transition-colors">服務條款</button>
            <button onClick={() => onOpenPolicy('refund')} className="hover:text-white transition-colors">退換貨政策</button>
        </div>
      </div>
    </footer>
  );
};
