import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, PageType } from '../Header';
import { Footer } from '../Footer';
import { UserProfile, SiteSettings } from '../../types';
import { BackgroundMusic } from '../BackgroundMusic';
import { FloatingBalloon } from '../FloatingBalloon';
import { CursorEffects } from '../CursorEffects';
import { ScrollToTop } from '../ScrollToTop';
import { CookieConsent } from '../CookieConsent';
import { CloudTransition } from '../CloudTransition';
import { ParallaxBackground } from '../ParallaxBackground';

interface MainLayoutProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  cartCount: number;
  onOpenCart: () => void;
  userProfile: UserProfile;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenPassport: () => void;
  onAskAi: () => void;
  siteSettings: SiteSettings;
  onOpenPolicy: (tab: any) => void;
  isLaunch?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  userProfile,
  isMusicPlaying,
  onToggleMusic,
  onOpenPassport,
  onAskAi,
  siteSettings,
  onOpenPolicy,
  isLaunch = false
}) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-ac-cream font-sans text-ac-darkBrown selection:bg-ac-yellow overflow-x-hidden">
      {/* Global Backgrounds & Effects */}
      <ParallaxBackground />
      <CloudTransition type={isLaunch ? 'full' : 'light'} />
      <BackgroundMusic isPlaying={isMusicPlaying} onToggle={onToggleMusic} />
      <FloatingBalloon siteSettings={siteSettings} />
      <CursorEffects />
      <ScrollToTop />
      <CookieConsent />

      {/* Header - Sticky behavior is handled in Header.tsx, but Layout ensures context */}
      <Header 
        currentPage={currentPage} 
        onNavigate={onNavigate} 
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        userProfile={userProfile}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={onToggleMusic}
        onOpenPassport={onOpenPassport}
        onAskAi={onAskAi}
        siteSettings={siteSettings}
      />

      {/* Main Content Area - Outlets render here. 
          Padding-top is NOT needed here because Header is sticky and we want content to flow naturally under or be offset by individual page containers if needed.
          However, to prevent content from being hidden under the sticky header initially, we add a safe margin.
      */}
      <main className="flex-grow w-full relative z-10 pt-0">
        <Outlet />
      </main>

      <Footer onNavigate={onNavigate} onOpenPolicy={onOpenPolicy} isMusicPlaying={isMusicPlaying} />
    </div>
  );
};
