
import React from 'react';
import { STORE_INFO } from '../constants';
import { Icons } from './Icons';
import { AIImage } from './AIImage';

export const StoreInfo: React.FC = () => {
  return (
    <div className="pt-20 md:pt-32 pb-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
         {/* Bulletin Board Style Container */}
         <div className="bg-[#F4D03F] p-2 md:p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_10px_0_#C79E2B] md:rotate-1">
            <div className="bg-[#FFF9C4] p-4 md:p-8 rounded-[1rem] md:rounded-[1.5rem] border-4 border-[#F9E79F] relative min-h-[600px] flex flex-col">
                {/* Pin */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-md border-2 border-red-700"></div>

                <h2 className="text-2xl md:text-3xl font-display font-black text-ac-darkBrown mb-6 md:mb-8 border-b-4 border-dashed border-ac-brown/30 pb-4 pt-2">
                    服務中心公告
                </h2>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8 flex-1 text-left">
                    <div className="space-y-4 md:space-y-6 text-ac-darkBrown">
                        <div className="bg-white p-4 rounded-xl shadow-sm md:transform md:-rotate-2">
                            <h3 className="font-bold text-lg mb-2 flex items-center text-ac-blue"><Icons.Map className="w-5 h-5 mr-2"/> 位置</h3>
                            <p className="text-sm md:text-base">{STORE_INFO.address}</p>
                            <a href={STORE_INFO.googleMapsUrl} target="_blank" className="text-xs text-ac-orange font-bold mt-2 block">查看地圖 &rarr;</a>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm md:transform md:rotate-1">
                            <h3 className="font-bold text-lg mb-2 flex items-center text-ac-green"><Icons.Chat className="w-5 h-5 mr-2"/> 開放時間</h3>
                            <p className="text-sm font-bold">{STORE_INFO.hours.weekday}</p>
                            <p className="text-sm font-bold">{STORE_INFO.hours.weekend}</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm md:transform md:-rotate-1">
                             <h3 className="font-bold text-lg mb-2 flex items-center text-ac-orange"><Icons.NookPhone className="w-5 h-5 mr-2"/> 聯絡方式</h3>
                             <p className="text-sm md:text-base">電話: {STORE_INFO.phone}</p>
                             <p className="text-sm md:text-base">LINE: {STORE_INFO.lineId}</p>
                        </div>
                    </div>

                    <div className="relative h-64 md:h-full md:min-h-[300px] rounded-2xl overflow-hidden border-4 border-white shadow-md md:rotate-2 order-first md:order-last">
                        <AIImage 
                            staticImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
                            alt="Store Exterior"
                            className="w-full h-full object-cover"
                            aspectRatio="3:4"
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-white/80 p-2 text-center font-bold text-xs text-ac-brown">
                            歡迎光臨是也！
                        </div>
                    </div>
                </div>
                
                {/* Post-it note (Hidden on small mobile for space) */}
                <div className="hidden md:flex absolute bottom-4 right-4 bg-pink-200 p-4 w-40 h-40 shadow-md transform rotate-3 font-handwriting text-ac-darkBrown items-center justify-center text-center font-bold">
                    別忘了帶伴手禮喔！
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
