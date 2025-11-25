
import React, { useMemo, useState } from 'react';
import { CartItem } from '../types';
import { Icons } from './Icons';
import { STORE_INFO } from '../constants';
import { dataService } from '../services/dataService';

interface ShoppingCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
}

export const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem 
}) => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [lineLink, setLineLink] = useState('');

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  // Calculate estimated miles (e.g., 100 bells = 1 mile)
  const estimatedMiles = Math.floor(totalAmount / 100);

  const generateOrderMessage = () => {
    let message = `哈姆店長您好！我想購買置物籃中的商品：\n\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      if (item.type === 'custom' && item.configSummary) {
        message += `   規格：${item.configSummary}\n`;
      }
      if (item.variant) {
        message += `   規格：${item.variant.name}\n`;
      }
      message += `   價格：${item.price.toLocaleString()} 橡實幣\n\n`;
    });
    message += `-------------------\n`;
    message += `總金額：${totalAmount.toLocaleString()} 橡實幣\n\n`;
    message += `請問如何付款和安排運送呢？`;
    return message;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // HeimOS 3.0: Track order intent
    dataService.createOrder(cartItems, totalAmount);

    const message = generateOrderMessage();
    const encodedMessage = encodeURIComponent(message);
    const fullLink = `https://line.me/R/oaMessage/${STORE_INFO.lineId}/${encodedMessage}`;

    // Desktop Detection: Check if device supports touch or if screen is wide
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop) {
        setLineLink(fullLink);
        setShowQrCode(true);
    } else {
        window.open(fullLink, '_blank');
        onClose();
    }
  };

  const QrCodeOverlay = () => (
      <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-8 animate-fade-in-up">
          <h3 className="text-2xl font-black text-ac-darkBrown mb-2">手機掃描結帳</h3>
          <p className="text-ac-brown mb-6 text-center text-sm">
              請使用手機掃描下方 QR Code<br/>跳轉至 LINE 與哈姆店長確認訂單
          </p>
          
          <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-ac-green mb-6">
              {/* Using Google Chart API for simple QR generation. In a real app, use 'react-qr-code' */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(lineLink)}`} 
                alt="Checkout QR Code" 
                className="w-48 h-48"
              />
          </div>

          <button 
            onClick={() => setShowQrCode(false)}
            className="text-ac-brown underline text-sm hover:text-ac-green"
          >
              取消並返回
          </button>
      </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FDFBF7] shadow-2xl h-full flex flex-col animate-fade-in-up md:animate-none border-l-4 border-ac-cream overflow-hidden">
        
        {/* QR Code Overlay */}
        {showQrCode && <QrCodeOverlay />}

        {/* Header - Inventory Style */}
        <div className="bg-ac-green p-6 text-white flex justify-between items-center shadow-md relative z-10">
            <div className="flex items-center">
                <Icons.ShoppingBag className="w-8 h-8 mr-3" />
                <h2 className="text-2xl font-display font-black tracking-wider">置物籃</h2>
            </div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                <Icons.Close className="w-6 h-6" />
            </button>
        </div>

        {/* Inventory Grid Background */}
        <div className="flex-1 overflow-y-auto p-6 relative overscroll-contain">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#78B159 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
            </div>

            {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-ac-brown opacity-60">
                    <Icons.ShoppingBag className="w-20 h-20 mb-4" />
                    <p className="font-bold text-lg">置物籃是空的喔！</p>
                    <p className="text-sm">快去商店或是工坊逛逛吧～</p>
                </div>
            ) : (
                <div className="space-y-4 relative z-10">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl border-4 border-ac-cream shadow-sm flex items-center justify-between group hover:border-ac-blue transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.type === 'custom' ? 'bg-ac-yellow text-ac-darkBrown' : 'bg-ac-blue text-white'}`}>
                                        {item.type === 'custom' ? 'DIY' : '商品'}
                                    </span>
                                    <h3 className="font-black text-ac-darkBrown">{item.name}</h3>
                                </div>
                                {item.type === 'custom' && (
                                    <p className="text-xs text-ac-brown mb-1 line-clamp-2">{item.configSummary}</p>
                                )}
                                {item.variant && (
                                    <p className="text-xs text-ac-brown mb-1 font-bold">規格: {item.variant.name}</p>
                                )}
                                <div className="flex items-center text-ac-orange font-bold">
                                    <Icons.Acorn className="w-4 h-4 mr-1" />
                                    {item.price.toLocaleString()}
                                </div>
                            </div>
                            <button 
                                onClick={() => onRemoveItem(item.id)}
                                className="text-gray-300 hover:text-red-400 p-2 transition-colors"
                                title="移除"
                            >
                                <Icons.MinusCircle className="w-8 h-8" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-white border-t-4 border-ac-cream shadow-[0_-4px_20px_rgba(0,0,0,0.05)] relative z-10">
            <div className="flex justify-between items-end mb-2">
                <span className="text-ac-brown font-bold">總計</span>
                <span className="text-3xl font-black text-ac-orange flex items-center">
                    <Icons.Acorn className="w-8 h-8 mr-2" />
                    {totalAmount.toLocaleString()}
                </span>
            </div>
            
            {/* Gamification Incentive */}
            {cartItems.length > 0 && (
                <div className="mb-4 flex items-center justify-end text-xs font-bold text-ac-blue bg-blue-50 py-1 px-3 rounded-full w-fit ml-auto">
                    <Icons.Ticket className="w-3 h-3 mr-1" />
                    預計獲得 {estimatedMiles} 哩數
                </div>
            )}

            <button 
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className={`w-full py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center
                    ${cartItems.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-ac-green text-white hover:bg-[#66a04b] shadow-[0_6px_0_#44855f]'}
                `}
            >
                {showQrCode ? <Icons.QrCode className="w-6 h-6 mr-2" /> : <Icons.NookPhone className="w-6 h-6 mr-2" />}
                {showQrCode ? '掃描行動條碼' : '聯絡哈姆結帳'}
            </button>
        </div>

      </div>
    </div>
  );
};
