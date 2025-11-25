import React, { useState } from 'react';
import { Icons } from './Icons';

interface LoginModalProps {
  onLogin: (name: string, islandName: string) => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [name, setName] = useState('');
  const [islandName, setIslandName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && islandName.trim()) {
      onLogin(name, islandName);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#F2F9F5] rounded-[2rem] border-8 border-white shadow-2xl p-8 animate-pop">
         {/* Updated Logo Section */}
         <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#FFFDF0] border-4 border-ac-green rounded-full w-24 h-24 flex items-center justify-center text-ac-green shadow-lg">
            <Icons.Leaf className="w-14 h-14" />
         </div>
         
         <div className="mt-8 text-center">
            <h2 className="text-2xl font-black text-ac-darkBrown mb-2">歡迎來到海姆島！</h2>
            <p className="text-ac-brown mb-6 font-medium">看來你是新來的島民呢！<br/>請在入境登記表上填寫你的資料是也！</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="text-left">
                  <label className="block text-xs font-bold text-ac-green mb-1 ml-2">姓名</label>
                  <input 
                    type="text" 
                    required
                    placeholder="例如：哈姆"
                    className="w-full bg-white border-4 border-ac-cream rounded-xl p-3 font-bold text-base text-ac-darkBrown outline-none focus:border-ac-green transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
               </div>
               
               <div className="text-left">
                  <label className="block text-xs font-bold text-ac-green mb-1 ml-2">島嶼名稱</label>
                  <div className="flex items-center">
                    <input 
                        type="text" 
                        required
                        placeholder="例如：睡眠"
                        className="flex-1 bg-white border-4 border-ac-cream rounded-xl p-3 font-bold text-base text-ac-darkBrown outline-none focus:border-ac-green transition-colors"
                        value={islandName}
                        onChange={(e) => setIslandName(e.target.value)}
                    />
                    <span className="ml-2 font-black text-xl text-ac-darkBrown">島</span>
                  </div>
               </div>

               <button 
                 type="submit"
                 className="w-full bg-ac-green text-white font-black text-xl py-4 rounded-xl shadow-[0_4px_0_#44855f] active:shadow-none active:translate-y-[4px] hover:bg-[#66a04b] transition-all mt-6"
               >
                 登記完畢！
               </button>
            </form>
         </div>
      </div>
    </div>
  );
};