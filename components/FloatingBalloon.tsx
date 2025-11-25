
import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '../types';
import { Icons } from './Icons';

interface FloatingBalloonProps {
    siteSettings: SiteSettings;
}

export const FloatingBalloon: React.FC<FloatingBalloonProps> = ({ siteSettings }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isPopped, setIsPopped] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [topPosition, setTopPosition] = useState(20); // percentage
    const timerRef = useRef<number | null>(null);

    // Only run logic if enabled and has code
    const isEnabled = siteSettings.enableBalloon && siteSettings.balloonCode;

    useEffect(() => {
        if (!isEnabled) {
            setIsVisible(false);
            return;
        }

        const scheduleNextFlight = () => {
            // Random interval between 30s and 90s
            const delay = Math.random() * 60000 + 30000; 
            
            timerRef.current = window.setTimeout(() => {
                // Random vertical position (10% to 60% from top)
                setTopPosition(Math.random() * 50 + 10);
                setIsVisible(true);
                setIsPopped(false);
                
                // Flight duration matches CSS animation (15s)
                // Hide after flight if not popped
                setTimeout(() => {
                    setIsVisible(false);
                    scheduleNextFlight();
                }, 15000);

            }, delay);
        };

        scheduleNextFlight();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isEnabled]);

    const handleClick = () => {
        if (isPopped) return;
        setIsPopped(true);
        // Small delay for pop animation before showing reward
        setTimeout(() => {
            setShowReward(true);
            setIsVisible(false); // Hide balloon after popping
        }, 500);
    };

    const handleCloseReward = () => {
        setShowReward(false);
    };

    return (
        <>
            {/* Flying Balloon */}
            {isVisible && !isPopped && (
                <div 
                    onClick={handleClick}
                    className="fixed z-[80] cursor-pointer animate-fly-across hover:scale-110 transition-transform"
                    style={{ top: `${topPosition}%` }}
                >
                    <div className="relative">
                        <Icons.Balloon className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg animate-float" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <Icons.Gift className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md animate-swing" />
                        </div>
                    </div>
                </div>
            )}

            {/* Popped Effect (Briefly visible) */}
            {isVisible && isPopped && (
                <div 
                    className="fixed z-[80] pointer-events-none"
                    style={{ top: `${topPosition}%`, left: '50%' }} // Ideally should track X position, but centering pop is okay for simplicity or requires complex tracking
                >
                    <div className="animate-pop text-4xl">💥</div>
                </div>
            )}

            {/* Reward Modal */}
            {showReward && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseReward}></div>
                    <div className="relative bg-white rounded-[2rem] border-4 border-ac-red p-8 max-w-sm w-full shadow-2xl animate-pop text-center">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-4 border-4 border-white shadow-md">
                            <Icons.Gift className="w-10 h-10 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-black text-ac-darkBrown mt-6 mb-2">擊落禮物了！</h3>
                        <p className="text-ac-brown mb-4 font-bold text-sm">裡面好像藏著一張紙條...</p>
                        
                        <div className="bg-yellow-100 border-2 border-dashed border-yellow-400 p-4 rounded-xl mb-6 transform rotate-1">
                            <p className="text-xs text-yellow-700 font-bold mb-1">隱藏優惠碼</p>
                            <p className="text-2xl font-black text-ac-darkBrown tracking-widest select-all">{siteSettings.balloonCode}</p>
                            {siteSettings.balloonDesc && (
                                <p className="text-sm text-ac-brown mt-2 font-bold">{siteSettings.balloonDesc}</p>
                            )}
                        </div>

                        <button 
                            onClick={handleCloseReward}
                            className="bg-ac-green text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-[#66a04b] transition-colors"
                        >
                            太棒了！
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fly-across {
                    0% { left: -10%; transform: translateY(0); }
                    25% { transform: translateY(-20px); }
                    50% { transform: translateY(0); }
                    75% { transform: translateY(20px); }
                    100% { left: 110%; transform: translateY(0); }
                }
                @keyframes swing {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(5deg); }
                }
                .animate-fly-across {
                    animation: fly-across 20s linear forwards;
                }
                .animate-swing {
                    animation: swing 2s ease-in-out infinite;
                }
            `}</style>
        </>
    );
};
