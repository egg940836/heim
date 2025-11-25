
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { ACHIEVEMENTS } from '../constants';

interface PassportPageProps {
    userProfile: UserProfile;
    onUpdateProfile: (p: UserProfile) => void;
}

export const PassportPage: React.FC<PassportPageProps> = ({ userProfile, onUpdateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(userProfile);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setFormData(userProfile);
    }, [userProfile]);

    // Gyroscope Effect for Mobile
    useEffect(() => {
        const handleOrientation = (e: DeviceOrientationEvent) => {
            // Only use gyro if mouse isn't hovering (assumed by checking window width or just prioritize gyro on mobile)
            if (window.innerWidth < 1024 && cardRef.current) {
                const y = e.gamma || 0; // Left/Right
                const x = e.beta || 0;  // Front/Back
                
                // Map gyro values to tilt angles (Clamped)
                // In portrait: gamma is left/right tilt (-90 to 90) -> maps to RotateY
                // beta is front/back tilt (-180 to 180) -> maps to RotateX
                
                // Subtracting a base angle (e.g., 45deg for holding phone) can make it feel more natural,
                // but centering around 0 (flat) is standard for this effect.
                
                const clampedX = Math.max(-15, Math.min(15, (x - 45))); // Assuming holding phone at ~45deg
                const clampedY = Math.max(-15, Math.min(15, y));

                setTilt({ x: -clampedX, y: clampedY });
            }
        };

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        }
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const handleSave = () => {
        dataService.saveUserProfile(formData);
        onUpdateProfile(formData);
        setIsEditing(false);
    };

    const handleCheckIn = () => {
        if (isCheckingIn) return;
        setIsCheckingIn(true);
        
        setTimeout(() => {
             // Trigger check in
             const miles = dataService.checkIn();
             if (miles > 0) {
                 const newProfile = dataService.getUserProfile();
                 onUpdateProfile(newProfile);
             }
             setIsCheckingIn(false);
        }, 1000);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        // Disable mouse tilt on small screens to let gyro take over
        if (window.innerWidth < 1024) return;

        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Limit rotation to +/- 5 degrees
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        // Only reset on desktop
        if (window.innerWidth >= 1024) {
            setTilt({ x: 0, y: 0 });
        }
    };

    const isCheckedInToday = userProfile.lastCheckIn === new Date().toISOString().split('T')[0];

    const avatars = ['😊', '🐹', '🐱', '🐶', '🐰', '🐻', '🦊', '🐨', '🐯', '🦁'];

    return (
        <div className="min-h-screen px-4 pb-24 bg-[#6D8C75] flex items-center justify-center perspective-[1000px] pt-10">
            <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: 'transform 0.1s ease-out'
                }}
                className="w-full max-w-4xl bg-[#F2F0E4] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border-8 border-[#4A5D50] relative transform-style-preserve-3d"
            >
                {/* Shine Effect - Dynamic based on tilt */}
                <div 
                    className="absolute inset-0 pointer-events-none z-20 opacity-30 mix-blend-overlay"
                    style={{
                        background: `linear-gradient(${115 + tilt.y * 2}deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)`
                    }}
                ></div>

                {/* Left: ID Card */}
                <div className="lg:w-1/2 p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-[#D7D3C1] relative bg-[#F2F0E4]">
                    <div className="absolute top-4 right-4 opacity-20">
                        <Icons.Leaf className="w-32 h-32" />
                    </div>

                    <div className="flex flex-col h-full relative z-10">
                        <div className="flex justify-between items-start mb-8">
                             <div className="bg-[#4A5D50] text-[#F2F0E4] px-4 py-1 rounded-full font-black tracking-widest text-sm shadow-sm">
                                 HEIM PASSPORT
                             </div>
                             <button 
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className="bg-ac-orange text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform"
                             >
                                {isEditing ? <Icons.Check className="w-5 h-5" /> : <Icons.Edit className="w-5 h-5" />}
                             </button>
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-24 h-24 bg-[#E5E1D0] rounded-3xl flex items-center justify-center text-6xl border-4 border-white shadow-inner relative group cursor-pointer">
                                {isEditing ? (
                                    <div className="grid grid-cols-2 gap-1 absolute inset-0 bg-white/90 overflow-y-auto p-1 z-20">
                                        {avatars.map(av => (
                                            <button key={av} onClick={() => setFormData({...formData, avatar: av})} className="text-xl hover:bg-gray-100 rounded">
                                                {av}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    formData.avatar
                                )}
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <input className="w-full bg-white border p-1 rounded font-black text-xl text-ac-darkBrown" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                        <input className="w-full bg-white border p-1 rounded text-ac-brown font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-black text-ac-darkBrown mb-1">{formData.name}</h2>
                                        <p className="text-ac-brown font-bold">{formData.title}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#E5E1D0] rounded-xl p-4 mb-8 shadow-inner">
                            <label className="text-xs font-bold text-ac-brown block mb-1">ISLAND</label>
                             {isEditing ? (
                                <input className="w-full bg-white border p-1 rounded font-black text-lg text-ac-green" value={formData.islandName} onChange={e => setFormData({...formData, islandName: e.target.value})} />
                             ) : (
                                <div className="text-xl font-black text-ac-green">{formData.islandName}</div>
                             )}
                             <div className="mt-2 pt-2 border-t border-[#D7D3C1] flex justify-between items-center">
                                <span className="text-xs font-bold text-ac-brown">REGISTERED</span>
                                <span className="text-sm font-bold text-ac-darkBrown">2023.11.01</span>
                             </div>
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={handleCheckIn}
                                disabled={isCheckedInToday || isCheckingIn}
                                className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center transition-all relative z-20
                                    ${isCheckedInToday 
                                        ? 'bg-[#D7D3C1] text-ac-brown cursor-default shadow-none' 
                                        : 'bg-ac-blue text-white shadow-[0_6px_0_#4a8fac] hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none'
                                    }
                                `}
                            >
                                {isCheckedInToday ? '今日已簽到' : (isCheckingIn ? '連線中...' : '每日簽到領哩數')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Stamps */}
                <div className="lg:w-1/2 p-8 bg-white/50 relative">
                     <div className="flex justify-between items-center mb-6">
                         <h3 className="font-black text-ac-darkBrown text-xl flex items-center">
                             <Icons.Ticket className="w-6 h-6 mr-2 text-ac-blue" />
                             哈姆哩數
                         </h3>
                         <span className="text-2xl font-black text-ac-blue">{userProfile.miles.toLocaleString()}</span>
                     </div>

                     <div className="grid grid-cols-3 gap-4">
                         {ACHIEVEMENTS.map(stamp => {
                             const isUnlocked = userProfile.unlockedStamps.includes(stamp.id);
                             return (
                                 <div key={stamp.id} className={`aspect-square flex flex-col items-center justify-center text-center p-2 rounded-full border-4 border-dashed transition-all relative group cursor-help
                                     ${isUnlocked ? 'border-ac-orange bg-[#FFF8E1]' : 'border-gray-300 bg-gray-100 grayscale opacity-60'}
                                 `}>
                                     <div className="text-3xl mb-1">{stamp.icon}</div>
                                     {isUnlocked && (
                                         <div className="absolute bottom-0 right-0 w-6 h-6 bg-ac-green rounded-full flex items-center justify-center text-white shadow-sm">
                                             <Icons.Check className="w-4 h-4" />
                                         </div>
                                     )}
                                     
                                     {/* Tooltip */}
                                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-ac-darkBrown text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                         <p className="font-bold mb-1">{stamp.name}</p>
                                         <p className="leading-tight opacity-80">{stamp.description}</p>
                                     </div>
                                 </div>
                             )
                         })}
                         {/* Empty slots fillers */}
                         {[...Array(4)].map((_, i) => (
                             <div key={i} className="aspect-square rounded-full border-4 border-dashed border-[#E5E1D0] opacity-50"></div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
};
