
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { STORE_INFO } from '../constants';
import { AIImage } from './AIImage';
import { dataService } from '../services/dataService';
import { FaqItem, SiteSettings } from '../types';
import { SEO } from './SEO';

interface ServicePageProps {
    siteSettings?: SiteSettings;
}

export const ServicePage: React.FC<ServicePageProps> = ({ siteSettings }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  
  // Easter Egg State
  const [isDug, setIsDug] = useState(false);
  const [reward, setReward] = useState('');

  useEffect(() => {
    const loadFaqs = async () => {
        const data = await dataService.getFAQs();
        setFaqs(data);
    };
    loadFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleDig = () => {
      if (isDug) return;
      setIsDug(true);
      const rewards = ['🦖 化石', '🏺 陶俑', '💰 1000 鈴錢', '🦴 暴龍尾巴'];
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
      setReward(randomReward);

      // Reset after 3 seconds (Disappear)
      setTimeout(() => {
          setIsDug(false);
          setReward('');
      }, 3000);
  };

  // Group FAQs by category for display
  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  const Guarantees = [
      {
          title: 'TW職人手作製造',
          desc: '每張床墊皆由台灣職人親手製作，品質安心有保障。',
          icon: <Icons.Workbench className="w-6 h-6 md:w-8 md:h-8" />,
          color: 'text-ac-blue',
          bg: 'bg-blue-100',
          border: 'border-ac-blue'
      },
      {
          title: '15 年保固',
          desc: '針對彈簧結構提供 15 年保固，這是哈姆的承諾！',
          icon: <Icons.Shield className="w-6 h-6 md:w-8 md:h-8" />,
          color: 'text-ac-green',
          bg: 'bg-green-100',
          border: 'border-ac-green'
      },
      {
          title: '專人運輸配送',
          desc: '職人手工製作後專車運送，並協助舊床回收（需預約）。',
          icon: <Icons.Truck className="w-6 h-6 md:w-8 md:h-8" />,
          color: 'text-ac-orange',
          bg: 'bg-orange-100',
          border: 'border-ac-orange'
      }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
        }
    }))
  };

  return (
    <div className="min-h-screen pt-36 md:pt-40 lg:pt-40 pb-24 px-4 md:px-6 bg-[#F2F9F5]">
      <SEO 
          title="島民服務中心"
          description="有關於運送、保固或床墊保養的問題嗎？這裡整理了常見問題集，讓哈姆為您解答。"
          jsonLd={faqSchema}
      />
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
           <div className="relative inline-block">
               <div className="bg-[#4DB6AC] text-white border-4 border-[#009688] px-6 py-2 md:px-8 md:py-3 rounded-2xl md:rounded-full shadow-lg transform -rotate-1 relative z-10">
                  <h2 className="text-xl md:text-3xl font-display font-black tracking-wider flex items-center">
                    <Icons.NookPhone className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" />
                    島民服務中心
                  </h2>
               </div>
               
               {/* EASTER EGG: Buried Spot (Moved here) */}
               <div className="absolute -right-6 -bottom-6 md:-right-10 md:-bottom-2 z-0">
                  <button 
                    onClick={handleDig}
                    className={`transition-all duration-300 ${isDug ? 'cursor-default opacity-100 scale-110' : 'cursor-pointer opacity-40 hover:opacity-100 hover:scale-110'}`}
                    title={isDug ? "已經挖過了" : "這裡好像埋了什麼..."}
                  >
                      {isDug ? (
                          <div className="animate-pop flex flex-col items-center">
                              <div className="text-2xl md:text-3xl filter drop-shadow-md mb-1 animate-bounce whitespace-nowrap">{reward.split(' ')[0]}</div>
                              <span className="bg-white text-ac-darkBrown text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border border-ac-brown/20">發現了！</span>
                          </div>
                      ) : (
                          <svg width="32" height="32" viewBox="0 0 32 32">
                              <path d="M16 2 L19 13 L30 16 L19 19 L16 30 L13 19 L2 16 L13 13 Z" fill="#5D4037" />
                              <circle cx="16" cy="16" r="4" fill="#3E2723" />
                          </svg>
                      )}
                  </button>
               </div>
           </div>

           <p className="text-ac-brown mt-4 md:mt-6 font-medium text-sm md:text-lg">
             有什麼需要哈姆幫忙的嗎？<br/>
             這裡整理了所有移居島民最常問的問題是也！
           </p>
        </div>

        {/* 3 Major Guarantees - Mobile: Horizontal Scroll / Desktop: Grid */}
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-16 overflow-x-auto snap-x snap-mandatory px-1 pb-6 -mx-1 no-scrollbar">
            {Guarantees.map((item, idx) => (
                <div key={idx} className={`flex-shrink-0 w-[85vw] max-w-[300px] md:w-auto snap-center bg-white p-6 rounded-3xl shadow-md border-b-8 ${item.border} text-center flex flex-col items-center`}>
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${item.bg} rounded-full flex items-center justify-center mb-3 md:mb-4 ${item.color}`}>
                        {item.icon}
                    </div>
                    <h3 className="font-black text-ac-darkBrown text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-ac-brown leading-relaxed opacity-90">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* FAQ Section */}
        <div className="md:bg-[#FFF9C4] md:p-8 md:rounded-[2rem] md:border-8 md:border-[#F9E79F] relative mb-12">
            <h3 className="text-xl md:text-2xl font-black text-ac-darkBrown mb-4 md:mb-6 flex items-center px-2 md:px-0">
                <span className="bg-red-500 text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 text-xs md:text-sm shadow-sm">?</span>
                常見問題集
            </h3>

            <div className="space-y-3 md:space-y-4">
                {Object.keys(groupedFaqs).length === 0 ? (
                  <p className="text-center text-ac-brown font-bold py-8">目前沒有常見問題，請稍後再回來查看是也！</p>
                ) : (
                  Object.entries(groupedFaqs).map(([category, items], sIdx) => (
                      <div key={sIdx} className="space-y-2">
                          <h4 className="font-bold text-ac-orange ml-2 mt-2 mb-1 text-sm md:text-base flex items-center">
                              <span className="w-2 h-2 bg-ac-orange rounded-full mr-2"></span>
                              {category}
                          </h4>
                          {(items as FaqItem[]).map((item, qIdx) => {
                              const index = sIdx * 100 + qIdx;
                              const isOpen = openFaqIndex === index;
                              return (
                                  <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border-2 border-ac-cream">
                                      <button 
                                          onClick={() => toggleFaq(index)}
                                          className="w-full flex justify-between items-start md:items-center p-3 md:p-4 text-left font-bold text-ac-darkBrown hover:bg-gray-50 transition-colors text-sm md:text-base"
                                      >
                                          <span className="flex-1 pr-2">{item.question}</span>
                                          <Icons.ChevronDown className={`w-5 h-5 text-ac-brown transition-transform flex-shrink-0 mt-0.5 md:mt-0 ${isOpen ? 'rotate-180' : ''}`} />
                                      </button>
                                      <div 
                                          className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
                                      >
                                          <div className="p-3 md:p-4 pt-0 text-xs md:text-sm text-ac-brown bg-gray-50 leading-relaxed border-t border-dashed border-gray-200">
                                              {item.answer}
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  ))
                )}
            </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-md border-4 border-ac-cream flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
             <div className="w-full lg:w-1/2 space-y-3 md:space-y-4">
                 <h3 className="text-lg md:text-xl font-black text-ac-darkBrown mb-2 md:mb-4 flex items-center">
                     <Icons.NookPhone className="w-5 h-5 mr-2" /> 聯絡服務處
                 </h3>
                 
                 <div className="bg-ac-cream/30 p-4 rounded-xl border-2 border-ac-cream space-y-3">
                    <div className="flex items-start text-ac-brown text-sm">
                        <span className="w-16 font-bold text-ac-green flex-shrink-0">電話</span>
                        <a href={`tel:${STORE_INFO.phone}`} className="font-medium hover:text-ac-orange">{STORE_INFO.phone}</a>
                    </div>
                    <div className="flex items-start text-ac-brown text-sm">
                        <span className="w-16 font-bold text-ac-green flex-shrink-0">地址</span>
                        <span className="font-medium">{STORE_INFO.address}</span>
                    </div>
                    <div className="flex items-start text-ac-brown text-sm">
                        <span className="w-16 font-bold text-ac-green flex-shrink-0">LINE</span>
                        <a href={STORE_INFO.lineUrl} target="_blank" className="font-medium hover:text-ac-orange underline decoration-dashed">{STORE_INFO.lineId}</a>
                    </div>
                    <div className="flex items-start text-ac-brown text-sm">
                        <span className="w-16 font-bold text-ac-green flex-shrink-0">時間</span>
                        <div className="text-xs md:text-sm">
                            <p>{STORE_INFO.hours.weekday}</p>
                            <p>{STORE_INFO.hours.weekend}</p>
                        </div>
                    </div>
                 </div>

                 <a href={STORE_INFO.googleMapsUrl} target="_blank" className="w-full block text-center bg-ac-blue text-white px-6 py-3 rounded-xl font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-sm md:text-base">
                     <Icons.Map className="w-4 h-4 inline-block mr-1.5 relative -top-0.5" />
                     開啟地圖導航
                 </a>
             </div>
             
             <div className="w-full lg:w-1/2 aspect-video bg-ac-cream rounded-xl overflow-hidden border-4 border-white shadow-inner relative group">
                 <AIImage 
                    prompt="Animal Crossing style 3D render, isometric, exterior of a cute cozy shop building with Nook Inc flag, sunny day, mailbox"
                    alt="Store Exterior"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-ac-brown shadow-sm">
                     歡迎光臨
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};
