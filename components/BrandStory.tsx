
import React from 'react';
import { AIImage } from './AIImage';
import { SiteSettings } from '../types';

interface BrandStoryProps {
    siteSettings: SiteSettings;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ siteSettings }) => {
  return (
    <div className="min-h-screen pt-28 md:pt-32 lg:pt-40 px-4 md:px-6 pb-24">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-10 md:mb-16">
           <h2 className="text-3xl md:text-4xl font-display font-black text-ac-darkBrown">海姆島的故事</h2>
           <p className="text-ac-brown mt-4 font-medium text-base md:text-lg">關於哈姆店長與無人島移居計畫的起點...</p>
        </div>

        {/* Story Card 1 */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border-8 border-ac-cream shadow-xl mb-8 md:mb-12 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:transform md:rotate-1">
            <div className="w-full md:w-1/2 h-48 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden border-4 border-ac-blue flex-shrink-0">
                <AIImage 
                    src={siteSettings.storyImage1}
                    alt="Hamster looking at ocean"
                    className="w-full h-full object-cover"
                    aspectRatio="4:3"
                    prompt="Animal Crossing style 3D render, isometric, cute hamster standing on beach looking at ocean, sunset, peaceful"
                />
            </div>
            <div className="w-full md:w-1/2">
                <h3 className="text-xl md:text-2xl font-black text-ac-blue mb-2 md:mb-4">一切的開始</h3>
                <p className="text-ac-darkBrown leading-relaxed font-medium text-sm md:text-base">
                    有一天，哈姆店長搭著 Dodo 航空來到這座荒蕪的無人島。他發現島民們雖然每天快樂地釣魚、抓蟲，但到了晚上卻只能睡在硬梆梆的露營床上，隔天起來總是腰痠背痛，連大頭菜都搬不動了是也！
                </p>
            </div>
        </div>

        {/* Story Card 2 */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border-8 border-ac-cream shadow-xl mb-8 md:mb-12 flex flex-col md:flex-row-reverse gap-6 md:gap-8 items-center md:transform md:-rotate-1">
            <div className="w-full md:w-1/2 h-48 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden border-4 border-ac-green flex-shrink-0">
                <AIImage 
                    src={siteSettings.storyImage2}
                    alt="Crafting workbench"
                    className="w-full h-full object-cover"
                    aspectRatio="4:3"
                    prompt="Animal Crossing style 3D render, isometric, wooden workbench with tools and mattress materials, workshop interior"
                />
            </div>
            <div className="w-full md:w-1/2">
                <h3 className="text-xl md:text-2xl font-black text-ac-green mb-2 md:mb-4">DIY 方程式的誕生</h3>
                <p className="text-ac-darkBrown leading-relaxed font-medium text-sm md:text-base">
                    「既然這樣，那就自己做吧！」哈姆利用島上的天然素材——從橡膠樹採集的乳膠、從資源島挖到的鐵礦石。他發明了獨家的「睡眠方程式」，讓每個島民都能像拼拼圖一樣，DIY 出最適合自己的床墊！
                </p>
            </div>
        </div>

        {/* Story Card 3 */}
        <div className="text-center mt-10 md:mt-16">
            <p className="text-lg md:text-xl font-black text-ac-orange mb-6 md:mb-8">你也想加入移居計畫嗎？</p>
            <div className="inline-block bg-white p-2 rounded-full shadow-lg">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-ac-yellow rounded-full animate-bounce flex items-center justify-center text-2xl md:text-3xl">
                    ⛺
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
