
import React, { useEffect, useRef, useState } from 'react';
import { Icons } from './Icons';

// C Major Pentatonic Scale frequencies
const NOTES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.00,
  A4: 440.00,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.00,
};

const SCALE = Object.values(NOTES);

interface BackgroundMusicProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isPlaying, onToggle }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Interaction state
  const [isDodging, setIsDodging] = useState(false);

  // Initialize Audio Context
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = 0.05; // Very low volume for background
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  };

  const playTone = (freq: number, time: number, duration: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    
    const osc = audioContextRef.current.createOscillator();
    const noteGain = audioContextRef.current.createGain();
    
    // Use Sine wave for gentle, pure tone (like electric piano/flute)
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Envelope (Attack & Decay)
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(1, time + 0.05); // Quick attack
    noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration); // Slow decay

    // Simple Delay effect for echo/ambiance
    const delay = audioContextRef.current.createDelay();
    delay.delayTime.value = 0.3;
    const delayGain = audioContextRef.current.createGain();
    delayGain.gain.value = 0.3;

    osc.connect(noteGain);
    noteGain.connect(gainNodeRef.current);
    
    // Connect delay path
    noteGain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(gainNodeRef.current);

    osc.start(time);
    osc.stop(time + duration + 1); // Stop after decay
  };

  const scheduler = () => {
    if (!audioContextRef.current) return;

    // Lookahead
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + 0.1) {
      // Pick a random note from the scale
      const freq = SCALE[Math.floor(Math.random() * SCALE.length)];
      // Random duration
      const duration = Math.random() * 1.5 + 0.5;
      
      if (isPlaying) {
         playTone(freq, nextNoteTimeRef.current, duration);
      }

      // Schedule next note randomly (between 0.5s and 3s for space)
      nextNoteTimeRef.current += Math.random() * 2.5 + 0.5;
    }
    timerIDRef.current = window.setTimeout(scheduler, 25);
  };

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      
      // Handle Browser Autoplay Policy: Resume context on first user interaction
      const resumeContext = () => {
          if (audioContextRef.current?.state === 'suspended') {
              audioContextRef.current.resume();
          }
          window.removeEventListener('click', resumeContext);
          window.removeEventListener('keydown', resumeContext);
      };
      
      // Always attach listener to ensure we catch the interaction if needed
      window.addEventListener('click', resumeContext);
      window.addEventListener('keydown', resumeContext);

      if (audioContextRef.current?.state === 'running') {
         // If already running, ensure timing is correct
         if (nextNoteTimeRef.current < audioContextRef.current.currentTime) {
             nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1;
         }
      } else {
         // If suspended or just created, start clock a bit in future
         if (audioContextRef.current) {
            nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1;
         }
      }

      if (!timerIDRef.current) {
          scheduler();
      }
    } else {
      if (timerIDRef.current) {
        clearTimeout(timerIDRef.current);
        timerIDRef.current = null;
      }
    }
    return () => {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
    };
  }, [isPlaying]);

  // Listen for "Fly To Top" event to trigger interaction
  useEffect(() => {
      const handleFlyToTop = () => {
          // Delay slightly to match the plane passing by
          setTimeout(() => {
              setIsDodging(true);
              setTimeout(() => setIsDodging(false), 600);
          }, 100);
      };

      window.addEventListener('heim:fly-to-top', handleFlyToTop);
      return () => window.removeEventListener('heim:fly-to-top', handleFlyToTop);
  }, []);

  return (
    <div className="hidden lg:flex fixed bottom-24 right-4 z-40 pointer-events-none">
        {/* Positioned absolute relative to the container to allow individual transforms */}
        <div 
            className={`absolute bottom-16 right-0 pointer-events-auto transition-transform duration-500 ease-out
                ${isDodging ? '-translate-y-4 rotate-12 scale-110' : 'translate-y-0 rotate-0'}
            `}
        >
            <button 
                onClick={onToggle}
                className={`relative group w-12 h-12 rounded-full shadow-md border-2 border-white flex items-center justify-center transition-all duration-300 ${
                    isPlaying 
                    ? 'bg-ac-cream hover:scale-110' 
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }`}
                title={isPlaying ? "暫停音樂" : "播放音樂"}
            >
                {isPlaying ? (
                    <Icons.MusicNote className="w-6 h-6 animate-[spin_3s_linear_infinite]" />
                ) : (
                    <Icons.MusicOff className="w-5 h-5" />
                )}
            </button>
        </div>
    </div>
  );
};
