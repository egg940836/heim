
import React from 'react';
import { Icons } from './Icons';

export type PolicyTab = 'privacy' | 'terms' | 'refund';

interface PolicyPageProps {
  activeTab: PolicyTab;
  onTabChange: (tab: PolicyTab) => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen pt-28 md:pt-36 px-4 pb-24 bg-[#5D4037]">
      <div className="max-w-4xl mx-auto">
        
        {/* Clipboard Header */}
        <div className="bg-[#8D6E63] w-48 h-16 mx-auto rounded-t-2xl relative z-0 top-2 border-4 border-b-0 border-[#3E2723] flex items-center justify-center">
            <div className="w-32 h-8 bg-[#BCAAA4] rounded-full shadow-inner"></div>
        </div>

        {/* Paper Container */}
        <div className="bg-[#FFFDF0] min-h-[80vh] rounded-[2px] shadow-2xl relative z-10 p-8 md:p-16 text-ac-darkBrown leading-relaxed">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-12 border-b-4 border-dashed border-ac-brown/20 pb-6">
                {[
                    { id: 'privacy', label: '隱私權政策' },
                    { id: 'terms', label: '服務條款' },
                    { id: 'refund', label: '退換貨與保固' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as PolicyTab)}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${
                            activeTab === tab.id 
                            ? 'bg-ac-green text-white shadow-md' 
                            : 'bg-[#F2F9F5] text-ac-brown hover:bg-ac-cream border-2 border-transparent hover:border-ac-green'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-headings:text-ac-darkBrown">
                {activeTab === 'privacy' && (
                    <div className="animate-fade-in-up">
                        <h1>隱私權政策 (Privacy Policy)</h1>
                        <p className="text-sm opacity-70">最後更新日期：2025/01/01</p>
                        
                        <h3>1. 我們收集什麼？</h3>
                        <p>為了提供您最棒的海姆島體驗，我們會收集以下資訊：</p>
                        <ul>
                            <li><strong>護照資料：</strong> 您填寫的島民姓名、島嶼名稱與頭像（僅儲存於您本機的瀏覽器 LocalStorage 中，我們不會主動上傳至伺服器）。</li>
                            <li><strong>購物紀錄：</strong> 為了計算哩數成就與訂單意向。</li>
                            <li><strong>AI 對話：</strong> 您與哈姆店長 (AI) 的對話內容將透過 Google Gemini API 進行即時分析，以提供商品建議。我們不會將此對話用於識別您的真實身份。</li>
                        </ul>

                        <h3>2. Cookie 與本地儲存</h3>
                        <p>我們使用 LocalStorage 技術來記住您的購物車內容、成就進度與背景音樂設定。這是為了讓您下次登島時能無縫接軌，不會追蹤您的跨網站行為。</p>

                        <h3>3. 資料安全與第三方分享</h3>
                        <p>您的個資（姓名、電話、地址）僅在您主動透過 LINE 官方帳號聯繫我們進行結帳時，才會由您親自傳送給我們。網站本身不儲存敏感的付款資訊。</p>
                        <p>除 AI 功能需串接 Google API 外，我們不會將您的資料出售或分享給第三方。</p>
                    </div>
                )}

                {activeTab === 'terms' && (
                    <div className="animate-fade-in-up">
                        <h1>服務條款 (Terms of Service)</h1>
                        
                        <h3>1. 歡迎來到海姆島</h3>
                        <p>海姆名床（以下簡稱「我們」）是由 KINGS BED LTD. 營運的網站。當您開始使用本網站，即代表您同意遵守海姆島的島民公約。</p>

                        <h3>2. 智慧財產權</h3>
                        <p>本網站的所有圖片、文案、設計（包含哈姆店長的角色形象），均受著作權法保護。您可以分享給朋友，但請勿用於商業用途或聲稱是您自己的作品。</p>

                        <h3>3. 客製化商品聲明</h3>
                        <p>我們的床墊皆為「接單後製作」的客製化給付商品。<strong>根據《消費者保護法》第19條及《通訊交易解除權合理例外情事適用準則》，本網站之客製化商品不適用於 7 天鑑賞期（猶豫期）。</strong>請在下單前務必確認尺寸與規格。</p>

                        <h3>4. 服務變更與免責</h3>
                        <p>我們保留隨時修改網站內容、調整價格或暫停服務的權利。AI 提供的建議僅供參考，不代表醫療保證。</p>
                    </div>
                )}

                {activeTab === 'refund' && (
                    <div className="animate-fade-in-up">
                        <h1>退換貨與保固政策</h1>
                        
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-sm text-red-800 font-bold">
                            ⚠️ 重要提醒：本商店之床墊為依消費者要求所為之客製化給付，下單製作後即無法取消或退貨（瑕疵品除外）。
                        </div>

                        <h3>1. 15 年結構保固</h3>
                        <p>我們對產品品質充滿信心！針對床墊的<strong>「彈簧結構」</strong>提供 15 年保固。</p>
                        <ul>
                            <li><strong>保固範圍：</strong> 正常使用下，彈簧結構凹陷超過 3.8 公分 (1.5英吋) 或彈簧斷裂。</li>
                            <li><strong>非保固範圍：</strong> 表布污損、人為破壞（如在床上跳躍導致損壞）、舒適層正常的人體壓痕（3公分以內）、個人對軟硬度的主觀感受不合。</li>
                        </ul>
                        
                        <h3>2. 瑕疵處理流程</h3>
                        <p>若您收到的商品有外觀破損、規格不符等「非人為瑕疵」，請於<strong>收到商品 3 日內</strong>拍照並透過 LINE 官方帳號聯繫客服。經確認為出廠瑕疵後，我們將免費為您更換新品，往返運費由我們負擔。</p>

                        <h3>3. 舊床回收與搬運</h3>
                        <p>配送時提供舊床搬運下樓服務（需事先預約）。如需清運處理，請自行聯繫當地環保局或清潔隊。</p>
                    </div>
                )}
            </article>

            {/* Footer Seal */}
            <div className="mt-16 flex justify-end">
                <div className="relative transform rotate-[-15deg] opacity-80">
                    <div className="w-32 h-32 rounded-full border-4 border-red-800 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full border-2 border-red-800 flex flex-col items-center justify-center text-red-800 font-black">
                            <span className="text-xs">KINGS BED LTD.</span>
                            <span className="text-xl">海姆實業</span>
                            <span className="text-sm">APPROVED</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
