
import React, { useState, useEffect } from 'react';
import { AIRecommendation, Product } from '../types';
import { getRuleBasedRecommendation } from '../services/recommendationLogic'; 
import { dataService } from '../services/dataService';
import { Icons } from './Icons';
import { AIImage } from './AIImage';

interface AIConsultantModalProps {
  onClose: () => void;
  onApplyConfig: (rec: AIRecommendation) => void;
}

const QUESTIONS = [
  {
    id: 'position',
    text: "歡迎光臨海姆島！我是哈姆。請問...您平常都是怎麼睡覺的呢？這對製作床墊很重要喔！",
    options: [
      { label: "側睡 (像彎月)", value: "side_sleeper" },
      { label: "正躺 (曬太陽)", value: "back_sleeper" },
      { label: "趴睡 (懶洋洋)", value: "stomach_sleeper" },
      { label: "一直翻滾", value: "combo_sleeper" },
    ]
  },
  {
    id: 'firmness',
    text: "了解了解！那您喜歡哪種觸感呢？是像雲朵一樣軟，還是像木頭一樣硬呢？",
    options: [
      { label: "軟綿綿的", value: "soft" },
      { label: "QQ彈彈的", value: "medium" },
      { label: "硬邦邦的", value: "firm" },
    ]
  },
  {
    id: 'concern',
    text: "最後一個問題！有沒有什麼讓您睡不好的煩惱呢？多選也沒問題是也！",
    multiSelect: true,
    options: [
      { label: "太熱了", value: "hot_sleeper" },
      { label: "腰痠背痛", value: "back_pain" },
      { label: "容易被吵醒", value: "light_sleeper" },
      { label: "鼻子過敏", value: "allergy" },
    ]
  }
];

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({ onClose, onApplyConfig }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIRecommendation | null>(null);
  
  const [displayedText, setDisplayedText] = useState('');
  const fullText = result ? result.reasoning : QUESTIONS[step].text;

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const speed = 30;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(prev => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [step, result]);

  const handleOptionClick = (value: string) => {
    const currentQ = QUESTIONS[step];
    if (currentQ.multiSelect) {
      setAnswers(prev => {
        const current = prev[currentQ.id] || [];
        return current.includes(value) 
          ? { ...prev, [currentQ.id]: current.filter(v => v !== value) }
          : { ...prev, [currentQ.id]: [...current, value] };
      });
    } else {
      setAnswers(prev => ({ ...prev, [currentQ.id]: [value] }));
      if (step < QUESTIONS.length - 1) {
        setStep(s => s + 1);
      } else {
        startAnalysis({ ...answers, [currentQ.id]: [value] });
      }
    }
  };

  const handleMultiNext = () => {
      if (step < QUESTIONS.length - 1) {
          setStep(s => s + 1);
      } else {
          startAnalysis(answers);
      }
  };

  const startAnalysis = async (finalAnswers: Record<string, string[]>) => {
    setIsAnalyzing(true);
    
    // Simulate "Thinking" delay to keep the charm
    setTimeout(() => {
        try {
            const rec = getRuleBasedRecommendation(finalAnswers);
            setResult(rec);
        } catch(e) { 
            console.error(e); 
        } finally { 
            setIsAnalyzing(false); 
        }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center min-h-[100dvh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Container */}
      <div className="relative z-10 w-full max-w-5xl px-4 pb-4 md:pb-8 flex flex-col md:flex-row items-end md:items-center gap-4">
         
         {/* Desktop Character */}
         <div className="hidden md:block w-48 h-48 flex-shrink-0 relative mr-[-40px] z-20 mb-4 hover:scale-105 transition-transform">
            <div className="w-full h-full bg-ac-orange rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                <span className="text-8xl">🐹</span> 
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-ac-dialog text-white px-4 py-1 rounded-full font-bold border-2 border-white whitespace-nowrap">
                哈姆店長
            </div>
         </div>

         {/* Dialog Box - Refactored for Mobile Overflow Safety */}
         <div className="flex-1 bg-ac-dialog/95 border-4 border-white rounded-3xl md:rounded-[2rem] p-6 md:p-8 shadow-2xl relative w-full mb-20 md:mb-0 animate-fade-in-up md:pl-16 flex flex-col">
            
            {/* Mobile Name Tag / Avatar Badge - Positioned absolutely relative to the Dialog Box, but outside the scrollable area */}
            <div className="md:hidden absolute -top-6 left-4 z-30 bg-ac-orange text-white pl-2 pr-4 py-1 rounded-full font-bold border-2 border-white flex items-center gap-2 shadow-md">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">🐹</div>
                哈姆店長
            </div>

            {/* Scrollable Content Area */}
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Text Area */}
                <div className="min-h-[60px] md:min-h-[80px] mb-6 mt-2 md:mt-0">
                {isAnalyzing ? (
                    <p className="text-white text-lg md:text-xl font-display font-bold tracking-wider animate-pulse">
                        嗯... 讓我計算一下方程式... 吱吱...
                    </p>
                ) : (
                    <div className="space-y-4">
                        <p className="text-white text-lg md:text-xl font-display font-bold leading-relaxed tracking-wider drop-shadow-md">
                            {displayedText}
                            {!result && <span className="animate-pulse">_</span>}
                        </p>
                    </div>
                )}
                </div>

                {/* Interaction Area */}
                {!isAnalyzing && !result && (
                    <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-end gap-2 md:gap-3 pb-2">
                        {QUESTIONS[step].options.map(opt => {
                            const isSelected = answers[QUESTIONS[step].id]?.includes(opt.value);
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => handleOptionClick(opt.value)}
                                    className={`px-4 py-3 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-lg transition-all transform active:scale-95 whitespace-nowrap shadow-sm ${
                                        isSelected 
                                        ? 'bg-ac-yellow text-ac-darkBrown border-4 border-ac-orange' 
                                        : 'bg-white text-ac-dialog border-4 border-transparent hover:bg-ac-cream'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            )
                        })}
                        {QUESTIONS[step].multiSelect && (
                            <button onClick={handleMultiNext} className="col-span-2 md:col-span-auto px-6 py-3 rounded-full font-bold text-sm md:text-lg bg-ac-green text-white border-4 border-white hover:bg-[#66a04b] ml-auto shadow-md">
                                決定好了！
                            </button>
                        )}
                    </div>
                )}

                {result && (
                    <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 mt-4 pb-2">
                        <button 
                            onClick={onClose}
                            className="w-full md:w-auto px-6 py-3 rounded-full font-bold text-white bg-ac-blue/50 hover:bg-ac-blue border-4 border-transparent text-center transition-colors"
                        >
                            再想想
                        </button>
                        <button 
                            onClick={() => onApplyConfig(result)}
                            className="w-full md:w-auto px-8 py-3 rounded-full font-bold text-ac-darkBrown bg-ac-yellow border-4 border-white shadow-lg animate-bounce-slow text-center hover:scale-105 transition-transform"
                        >
                            好！就做這個！
                        </button>
                    </div>
                )}
            </div>

            {/* Legal Disclaimer Footer */}
            <div className="mt-4 pt-3 border-t border-white/20 text-center">
                <p className="text-[10px] text-white/60 font-medium">
                    ⚠️ 免責聲明：哈姆店長 (AI) 提供的建議僅供選購參考，並非專業醫療診斷。若有嚴重睡眠障礙或脊椎問題，請優先諮詢專業醫師。
                </p>
            </div>
            
            {/* Arrow indicator */}
            <div className="absolute bottom-4 right-4 w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-ac-yellow border-r-[10px] border-r-transparent animate-bounce pointer-events-none"></div>
         </div>
      </div>
    </div>
  );
};
