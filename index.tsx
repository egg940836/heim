
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

// Extend Window interface for aistudio
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const Root = () => {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for local development or environments without the aistudio bridge
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfbf9] font-sans text-[#7f4732]">
        <div className="text-center p-8 max-w-md bg-white rounded-2xl shadow-xl border border-[#eaddc5]">
          <div className="mb-6 flex justify-center">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
              <circle cx="50" cy="50" r="48" className="stroke-[#ba6d40]" strokeWidth="2" />
              <path d="M30 70 C 30 50, 70 50, 70 70" className="stroke-[#d0a06f]" strokeWidth="3" strokeLinecap="round" />
              <path d="M50 25 L 50 55" className="stroke-[#7f4732]" strokeWidth="4" strokeLinecap="round" />
              <path d="M35 40 L 65 40" className="stroke-[#7f4732]" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-[#7f4732]">Heim Mattress</h1>
          <p className="mb-8 text-[#9b5636] leading-relaxed">
            為了提供高質感 AI 圖像生成與即時睡眠諮詢服務，我們需要連結您的 Google Cloud API Key。
          </p>
          <button 
            onClick={handleSelectKey}
            className="bg-[#ba6d40] text-white px-8 py-3 rounded-full hover:bg-[#9b5636] transition-colors shadow-md hover:shadow-lg font-medium tracking-wider"
          >
            連結 API Key
          </button>
          <div className="mt-6 pt-6 border-t border-[#f5f2eb]">
            <p className="text-xs text-[#d0a06f]">
              請確保您選擇的專案已啟用 Billing 功能以使用 Pro 模型。
              <br/>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#ba6d40]">
                了解更多 Billing 資訊
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <HashRouter>
        <Root />
      </HashRouter>
    </HelmetProvider>
  </React.StrictMode>
);
