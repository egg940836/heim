
import React, { useState, useEffect } from 'react';
import { STORE_INFO } from '../constants';
import { Icons } from './Icons';
import { UserProfile, SiteSettings } from '../types';

export type PageType = 'home' | 'builder' | 'story' | 'service' | 'shop' | 'blog' | 'admin' | 'passport' | 'policy';

interface HeaderProps {
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
  cartCount: number;
  onOpenCart: () => void;
  userProfile: UserProfile;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenPassport: () => void;
  onAskAi: () => void;
  siteSettings: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  currentPage, 
  cartCount, 
  onOpenCart, 
  userProfile,
  isMusicPlaying,
  onToggleMusic,
  onOpenPassport,
  onAskAi,
  siteSettings
}) => {
  const [time, setTime] = useState(new Date());
  const [logoInteraction, setLogoInteraction] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogoClick = () => {
      setLogoInteraction(true);
      setTimeout(() => setLogoInteraction(false), 1000);
      
      if (currentPage !== 'home') {
          setTimeout(() => onNavigate('home'), 300);
      }
  };

  const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '首頁', icon: <Icons.Map className="w-6 h-6"/> },
    { id: 'shop', label: '商店', icon: <Icons.BellBag className="w-6 h-6"/> },
    { id: 'builder', label: '工坊', icon: <Icons.Workbench className="w-6 h-6"/> },
    { id: 'blog', label: '日誌', icon: <Icons.Dodo className="w-6 h-6"/> },
    { id: 'service', label: '服務', icon: <Icons.NookPhone className="w-6 h-6"/> },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', weekday: 'short' });
  };

  const hasAnnouncement = siteSettings.showAnnouncement && siteSettings.announcementText;

  return (
    <>
      {/* ================= ANNOUNCEMENT BAR (HeimOS 3.0) ================= */}
      {hasAnnouncement && (
          <div className="fixed top-0 left-0 right-0 z-[51] min-h-[32px] py-1 flex items-center justify-center text-white text-xs font-bold tracking-wider px-4 text-center break-words" 
               style={{ backgroundColor: siteSettings.announcementColor }}>
              <Icons.Megaphone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{siteSettings.announcementText}</span>
          </div>
      )}

      {/* ================= DESKTOP HEADER (Sticky) ================= */}
      {/* Added top-0 sticky to ensure it sticks to top. top-8 accounts for announcement bar roughly if present, but sticky logic works best with direct offset or just top-0 if bar pushes it down in flow.
          Since announcement is fixed, we need to push header down.
      */}
      <header className={`hidden lg:block sticky ${hasAnnouncement ? 'top-8' : 'top-0'} z-50 px-4 md:px-8 transition-all duration-300 pt-4 ${hasAnnouncement ? 'mt-8' : ''}`}>
        <div className="max-w-7xl mx-auto bg-ac-cream/90 backdrop-blur-md rounded-[2rem] shadow-[0_8px_0_rgba(0,0,0,0.1)] border-4 border-white flex items-center justify-between py-3 px-6 transition-all duration-300">
          
          {/* Left: Time & Passport */}
          <div className="flex items-center space-x-4">
             <div className="text-ac-blue font-bold tracking-wider border-r-2 border-ac-brown/10 pr-4">
                 <div className="text-xl leading-none">{formatTime(time)}</div>
                 <div className="text-xs opacity-70">{formatDate(time)}</div>
             </div>
             
             <button 
                onClick={onOpenPassport}
                className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm border-2 border-ac-cream hover:border-ac-blue transition-colors"
             >
                <div className="w-8 h-8 bg-ac-cream rounded-full flex items-center justify-center text-lg mr-2 border border-ac-brown/10">
                    {userProfile.avatar}
                </div>
                <div className="text-left pr-2">
                    <div className="text-[10px] font-bold text-ac-brown leading-none">Miles</div>
                    <div className="text-sm font-black text-ac-blue leading-none">{userProfile.miles}</div>
                </div>
             </button>
          </div>

          {/* Center: Logo (Interactive) */}
          <div 
            className="flex items-center cursor-pointer group absolute left-1/2 transform -translate-x-1/2 select-none" 
            onClick={handleLogoClick}
          >
            <div className={`w-10 h-10 mr-2 text-ac-green relative ${logoInteraction ? 'animate-[spin_0.5s_ease-in-out]' : 'animate-bounce-slow'}`}>
              <Icons.Leaf className="w-full h-full drop-shadow-sm" />
              {/* Sparkles effect on click */}
              {logoInteraction && (
                  <>
                    <div className="absolute -top-4 -right-4 text-ac-yellow animate-pop"><Icons.Sparkles className="w-6 h-6"/></div>
                    <div className="absolute -bottom-2 -left-4 text-ac-blue animate-pop delay-75"><Icons.Sparkles className="w-4 h-4"/></div>
                  </>
              )}
            </div>
            <h1 className={`text-2xl font-display font-black text-ac-brown tracking-widest whitespace-nowrap transition-transform ${logoInteraction ? 'scale-110 text-ac-green' : ''}`}>
              {STORE_INFO.name}
            </h1>
          </div>

          {/* Right: Nav & Cart */}
          <nav className="flex items-center space-x-2 lg:space-x-4">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)} 
                className={`p-3 rounded-full transition-all duration-300 group relative
                  ${currentPage === item.id 
                    ? 'bg-ac-green text-white shadow-inner transform scale-110' 
                    : 'bg-white text-ac-green hover:bg-ac-lightGreen hover:text-white'}
                `}
                title={item.label}
              >
                {item.icon}
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-ac-darkBrown text-white text-xs py-1 px-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.label}
                </span>
              </button>
            ))}
            
            {/* Cart Button */}
            <div className="w-px h-8 bg-gray-200 mx-2"></div>
            <button 
               onClick={onOpenCart}
               className="p-3 rounded-full bg-ac-orange text-white hover:bg-[#d68c55] transition-all relative shadow-[0_4px_0_#ba6d40] active:shadow-none active:translate-y-1"
               title="置物籃"
            >
                <Icons.ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                        {cartCount}
                    </span>
                )}
            </button>
          </nav>
        </div>
      </header>

      {/* ================= MOBILE TOP BAR (Visible on Mobile & Tablet) ================= */}
      <header className={`lg:hidden sticky top-0 z-50 bg-ac-cream/95 backdrop-blur-sm px-4 py-2 flex justify-between items-center h-16 transition-all duration-300 ${hasAnnouncement ? 'mt-8 border-transparent shadow-none' : 'border-b-4 border-white shadow-sm'}`}>
          {/* Left: Logo */}
          <div 
            className="flex items-center cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <div className={`w-8 h-8 mr-2 text-ac-green relative ${logoInteraction ? 'animate-[spin_0.5s_ease-in-out]' : ''}`}>
              <Icons.Leaf className="w-full h-full" />
              {logoInteraction && (
                  <div className="absolute -top-2 -right-2 text-ac-yellow animate-pop"><Icons.Sparkles className="w-4 h-4"/></div>
              )}
            </div>
            <h1 className="text-lg font-display font-black text-ac-brown tracking-wide">
              {STORE_INFO.name}
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
             {/* Ask Hamu (Mobile) */}
             <button 
                onClick={onAskAi}
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm bg-white text-ac-blue border-2 border-ac-blue active:bg-ac-blue active:text-white transition-colors"
             >
                 <Icons.Sparkles className="w-5 h-5" />
             </button>

             {/* Music Toggle - Green Circle */}
             <button 
                onClick={onToggleMusic}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white transition-all duration-500 ${isMusicPlaying ? 'bg-ac-green border-2 border-white' : 'bg-gray-300 border-2 border-white'}`}
             >
                {isMusicPlaying ? <Icons.MusicNote className="w-5 h-5 animate-[spin_3s_linear_infinite]" /> : <Icons.MusicOff className="w-4 h-4" />}
             </button>

             {/* Passport - Blue Circle */}
             <button 
                onClick={onOpenPassport}
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm bg-ac-blue text-white border-2 border-white"
             >
                 <Icons.Passport className="w-5 h-5" />
             </button>

             {/* Cart - Orange Circle */}
             <button 
               onClick={onOpenCart}
               className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm bg-ac-orange text-white relative border-2 border-white"
             >
                <Icons.ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                        {cartCount}
                    </span>
                )}
             </button>
          </div>
      </header>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav 
          className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#F2F9F5] border-t-4 border-white px-2 flex justify-around items-end shadow-[0_-4px_10px_rgba(0,0,0,0.05)] h-auto min-h-[5rem]"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))', paddingTop: '0.5rem' }}
      >
          {navItems.map(item => {
              const isActive = currentPage === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center justify-center w-14 transition-all duration-300
                    ${isActive ? 'transform -translate-y-2' : 'opacity-60'}
                  `}
                >
                   <div className={`p-2 rounded-2xl mb-1 transition-all ${isActive ? 'bg-ac-green text-white shadow-md' : 'bg-white text-ac-green'}`}>
                      {/* Scale icon down slightly for 5 items */}
                      <div className="transform scale-90">{item.icon}</div>
                   </div>
                   <span className={`text-[10px] font-bold whitespace-nowrap ${isActive ? 'text-ac-darkBrown' : 'text-ac-brown'}`}>
                      {item.label}
                   </span>
                </button>
              )
          })}
      </nav>
    </>
  );
};
