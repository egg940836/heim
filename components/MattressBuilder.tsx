
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { STORE_INFO } from '../constants';
import { dataService } from '../services/dataService';
import { MaterialType, MattressConfig, AIRecommendation, Material, CartItem, Size, Product } from '../types';
import { Icons } from './Icons';
import { AIImage } from './AIImage';
import { SEO } from './SEO';

interface MattressBuilderProps {
  onOpenAiModal: () => void;
  aiConfig: AIRecommendation | null;
  onConfigApplied: () => void;
  onAddToCart: (item: CartItem) => void;
  onUnlockAchievement?: (id: string) => void;
}

// --- HAMU REACTION COMPONENT ---
const HamuReaction = ({ materialId, trigger }: { materialId: string | null, trigger: number }) => {
    const [message, setMessage] = useState<string>('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!materialId) return;

        let msg = '';
        const id = materialId.toLowerCase();

        if (id.includes('latex')) msg = 'ㄉㄨㄞ ㄉㄨㄞ 的！像果凍一樣Q彈是也！';
        else if (id.includes('cooling')) msg = '呼～好涼爽～像在吃冰棒一樣！';
        else if (id.includes('horsehair')) msg = '頂級馬尾毛！這可是貴族島民的享受喔！';
        else if (id.includes('spring_23') || id.includes('hard')) msg = '這個支撐力很夠！硬漢島民的最愛！';
        else if (id.includes('soft') || id.includes('cloud')) msg = '軟綿綿的～像睡在雲朵上一樣～';
        else if (id.includes('honeycomb')) msg = '密密麻麻的支撐，很紮實喔！';
        else if (id.includes('silver') || id.includes('sanitized')) msg = '壞菌通通退散！乾淨溜溜！';
        else if (id.includes('foam')) msg = '像海綿蛋糕一樣蓬鬆～';
        else msg = '這個選擇真不錯是也！';

        setMessage(msg);
        setVisible(false); // Reset to force animation restart
        setTimeout(() => setVisible(true), 10); 
        
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, [materialId, trigger]); // Depend on trigger count

    if (!visible) return null;

    return (
        <div className="absolute bottom-4 left-4 z-50 animate-pop origin-bottom-left pointer-events-none">
            <div className="flex items-end">
                <div className="w-16 h-16 bg-ac-orange rounded-full border-4 border-white flex items-center justify-center text-3xl shadow-md z-10 relative">
                    🐹
                </div>
                <div className="bg-white px-4 py-2 rounded-t-2xl rounded-br-2xl border-2 border-ac-orange text-ac-darkBrown font-bold text-sm shadow-sm ml-[-10px] mb-6 whitespace-nowrap relative">
                    {message}
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-white border-b-2 border-l-2 border-ac-orange transform rotate-45 translate-y-1.5 -translate-x-1"></div>
                </div>
            </div>
        </div>
    );
};

// Helper for CSS/SVG Thumbnails with Smart Fallback
const MaterialThumbnail: React.FC<{ material: Material }> = ({ material }) => {
  // Check if color is a Tailwind class or Hex
  const isHex = material.color.startsWith('#');
  const classNameStr = isHex ? '' : material.color;
  const styleObj = isHex ? { backgroundColor: material.color } : {};

  // Function to render patterns based on material ID or fallback by Type (Generic Pattern System)
  const renderPattern = () => {
    const id = material.id.toLowerCase();
    
    // --- SPECIAL PATTERNS based on ID keywords ---

    if (id.includes('latex')) {
        // Latex: Porous sponge / Bubbles
        return (
             <div className="absolute inset-0 opacity-40">
                 <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <circle cx="20" cy="20" r="12" fill="white" opacity="0.6"/>
                     <circle cx="60" cy="30" r="10" fill="white" opacity="0.5"/>
                     <circle cx="80" cy="70" r="14" fill="white" opacity="0.6"/>
                     <circle cx="30" cy="80" r="8" fill="white" opacity="0.5"/>
                     <circle cx="50" cy="50" r="6" fill="white" opacity="0.4"/>
                     <circle cx="10" cy="60" r="5" fill="white" opacity="0.5"/>
                     <circle cx="90" cy="20" r="8" fill="white" opacity="0.5"/>
                 </svg>
             </div>
        );
    }
    
    if (id.includes('spring') || id.includes('agro') || id.includes('uk')) {
         // Springs: Detailed Coils / Sine Waves / Hexagons
         const isHoneycomb = id.includes('honeycomb');
         const isZone = id.includes('zone');
         const isUk = id.includes('uk'); // Olive shape
         
         return (
             <div className="absolute inset-0 flex items-center justify-center opacity-50">
                 <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-stone-600">
                     {isHoneycomb ? (
                        <>
                           {/* Hexagonal packing suggestion - Top View */}
                           <circle cx="30" cy="30" r="18" strokeWidth="2"/>
                           <circle cx="70" cy="30" r="18" strokeWidth="2"/>
                           <circle cx="50" cy="65" r="18" strokeWidth="2"/>
                           <path d="M50 47 L50 47" strokeWidth="2"/>
                        </>
                     ) : isZone ? (
                        <>
                           {/* Zoned Spring Lines (Side View) */}
                           <path d="M10 20 Q 20 10 30 20 T 50 20 T 70 20 T 90 20" strokeOpacity="0.6" />
                           <path d="M10 50 Q 20 30 30 50 T 50 50 T 70 50 T 90 50" strokeWidth="3" />
                           <path d="M10 80 Q 20 70 30 80 T 50 80 T 70 80 T 90 80" strokeOpacity="0.6" />
                        </>
                     ) : isUk ? (
                        <>
                           {/* Olive shape coils */}
                           <path d="M50 10 Q 70 30 50 50 Q 30 70 50 90" strokeWidth="2.5" fill="none" />
                           <path d="M20 20 Q 40 40 20 60" strokeWidth="1.5" opacity="0.5" />
                           <path d="M80 20 Q 60 40 80 60" strokeWidth="1.5" opacity="0.5" />
                        </>
                     ) : (
                        <>
                           {/* Standard Continuous Coils (Sine Wave) */}
                           <path d="M10 20 C 10 10, 30 10, 30 20 C 30 30, 10 30, 10 40 C 10 50, 30 50, 30 60 C 30 70, 10 70, 10 80" 
                                 strokeLinecap="round" strokeWidth="2.5" transform="translate(15,0)" />
                           <path d="M60 20 C 60 10, 80 10, 80 20 C 80 30, 60 30, 60 40 C 60 50, 80 50, 80 60 C 80 70, 60 70, 60 80" 
                                 strokeLinecap="round" strokeWidth="2.5" transform="translate(5,0)" />
                        </>
                     )}
                 </svg>
             </div>
         );
    }

    if (id.includes('horsehair')) {
         // Horsehair: Messy Fibers
         return (
            <div className="absolute inset-0 opacity-40">
                 <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M10 10 Q 30 40 10 80" stroke="white" strokeWidth="2" fill="none"/>
                     <path d="M30 10 Q 10 50 30 90" stroke="white" strokeWidth="2" fill="none"/>
                     <path d="M50 5 Q 70 40 50 95" stroke="white" strokeWidth="2" fill="none"/>
                     <path d="M70 10 Q 90 50 70 90" stroke="white" strokeWidth="2" fill="none"/>
                     <path d="M90 15 Q 70 50 90 85" stroke="white" strokeWidth="2" fill="none"/>
                     {/* Cross hatching */}
                     <path d="M5 30 Q 50 20 95 40" stroke="white" strokeWidth="1" opacity="0.5" fill="none"/>
                     <path d="M5 70 Q 50 80 95 60" stroke="white" strokeWidth="1" opacity="0.5" fill="none"/>
                 </svg>
            </div>
         );
    }

    if (id.includes('wool') || id.includes('cashmere')) {
        // Wool: Curly texture
        return (
             <div className="absolute inset-0 opacity-30">
                 <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <path d="M10,10 Q15,5 20,10 T30,10 T40,10" stroke="white" fill="none" strokeWidth="2"/>
                    <path d="M50,30 Q55,25 60,30 T70,30 T80,30" stroke="white" fill="none" strokeWidth="2"/>
                    <path d="M20,50 Q25,45 30,50 T40,50 T50,50" stroke="white" fill="none" strokeWidth="2"/>
                    <path d="M60,70 Q65,65 70,70 T80,70 T90,70" stroke="white" fill="none" strokeWidth="2"/>
                 </svg>
             </div>
        )
    }
    
    if (id.includes('foam')) {
         // Foam: Noise / Speckles / Sponge
         return (
            <div className="absolute inset-0 opacity-20" 
                 style={{ 
                     backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px), radial-gradient(circle, #000 1px, transparent 1px)', 
                     backgroundSize: '10px 10px, 6px 6px',
                     backgroundPosition: '0 0, 5px 5px'
                 }}>
            </div>
         );
    }
    
    // Default / Covers
    if (material.type === MaterialType.COVER) {
        if (id.includes('cooling')) {
            return (
                <div className="absolute inset-0 opacity-30">
                    <svg width="100%" height="100%" viewBox="0 0 20 20">
                         <path d="M10,2 L10,18 M2,10 L18,10 M4,4 L16,16 M16,4 L4,16" stroke="white" strokeWidth="0.5"/>
                    </svg>
                </div>
            )
        }
        // Generic fabric weave
        return <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 4px)' }}></div>;
    }

    // Generic Fallback
    return <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FFF 0, #FFF 1px, transparent 0, transparent 10px)' }}></div>;
  };

  return (
    <div 
        className={`w-full h-full relative overflow-hidden flex items-center justify-center transition-colors duration-300 ${classNameStr}`}
        style={styleObj}
    >
        {renderPattern()}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/30 to-transparent pointer-events-none"></div>
    </div>
  );
};

const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex items-center gap-2 text-[10px] md:text-xs">
        <span className="text-ac-brown font-bold w-8 md:w-10">{label}</span>
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(v => (
                <div 
                    key={v} 
                    className={`w-2.5 h-1.5 md:w-4 md:h-2 rounded-full transition-colors ${v <= value ? color : 'bg-gray-200'}`}
                ></div>
            ))}
        </div>
    </div>
);

export const MattressBuilder: React.FC<MattressBuilderProps> = ({ onOpenAiModal, aiConfig, onConfigApplied, onAddToCart, onUnlockAchievement }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false); // NEW: Mobile Preview State
  const [recommendedPillow, setRecommendedPillow] = useState<Product | undefined>(undefined);
  
  // Interaction States
  const [lastInteractedMaterial, setLastInteractedMaterial] = useState<string | null>(null);
  const [hamuTrigger, setHamuTrigger] = useState(0); // Counter to force Hamu reaction even on same item click
  
  useEffect(() => {
      const loadData = async () => {
          const [m, s] = await Promise.all([
              dataService.getMaterials(),
              dataService.getSizes()
          ]);
          setMaterials(m);
          setSizes(s);
      };
      loadData();
  }, []);

  // Initial config empty to force "0" price start
  const [config, setConfig] = useState<MattressConfig>({
    sizeId: 'double',
    coverId: '',
    comfortLayerIds: [], 
    supportLayerId: '',
  });

  useEffect(() => {
      if (sizes.length > 0 && materials.length > 0) {
          setConfig(prev => {
              // Only set default size if currently empty/invalid
              const newConfig = {...prev};
              if (!sizes.find(s => s.id === prev.sizeId)) {
                  newConfig.sizeId = sizes.find(s => s.id === 'double')?.id || sizes[0].id;
              }
              return newConfig;
          })
      }
  }, [sizes, materials]);

  // New Order: Size -> Support -> Comfort -> Cover
  const [activeTab, setActiveTab] = useState<'size' | 'support' | 'comfort' | 'cover'>('size');
  const [isCrafting, setIsCrafting] = useState(false);
  const lastAppliedAiReasoning = useRef<string | null>(null);

  // Fix Race Condition: Ensure materials exist before applying AI config
  useEffect(() => {
    if (aiConfig && materials.length > 0 && sizes.length > 0 && aiConfig.reasoning !== lastAppliedAiReasoning.current) {
      handleAiApply(aiConfig);
      lastAppliedAiReasoning.current = aiConfig.reasoning;
    }
  }, [aiConfig, materials, sizes]);

  // Calculate Price
  const { totalPrice, totalThickness } = useMemo(() => {
    const size = sizes.find(s => s.id === config.sizeId);
    const cover = materials.find(m => m.id === config.coverId);
    const support = materials.find(m => m.id === config.supportLayerId);
    
    let price = 0;
    let thickness = 0;

    if (size) price += size.basePrice;
    if (support) { price += support.price; thickness += support.thickness; }
    if (cover) { price += cover.price; thickness += cover.thickness; }
    config.comfortLayerIds.forEach(id => {
        const layer = materials.find(m => m.id === id);
        if (layer) { price += layer.price; thickness += layer.thickness; }
    });

    return { totalPrice: Math.max(0, Math.round(price)), totalThickness: thickness };
  }, [config, sizes, materials]);

  const handleMaterialSelect = (type: keyof MattressConfig, id: string) => {
    setLastInteractedMaterial(id); 
    setHamuTrigger(prev => prev + 1); 
    
    if (type === 'comfortLayerIds') {
        setConfig(prev => {
            const current = prev.comfortLayerIds;
            if (current.includes(id)) {
                return { ...prev, comfortLayerIds: current.filter(cId => cId !== id) };
            } else {
                if (current.length >= 3) return prev;
                return { ...prev, comfortLayerIds: [...current, id] };
            }
        });
    } else {
        setConfig(prev => ({ ...prev, [type]: id }));
    }
  };

  const handleAiApply = (result: AIRecommendation) => {
      setIsCrafting(true);
      setTimeout(() => {
          const newConfig = { ...config };
          if (result.config.sizeId && sizes.find(s => s.id === result.config.sizeId)) newConfig.sizeId = result.config.sizeId!;
          if (result.config.coverId && materials.find(m => m.id === result.config.coverId)) newConfig.coverId = result.config.coverId!;
          if (result.config.supportLayerId && materials.find(m => m.id === result.config.supportLayerId)) newConfig.supportLayerId = result.config.supportLayerId!;
          
          if (result.config.comfortLayerIds && Array.isArray(result.config.comfortLayerIds)) {
              const validIds = result.config.comfortLayerIds.filter(id => materials.find(m => m.id === id));
              if (validIds.length > 0) newConfig.comfortLayerIds = validIds;
          }
          
          setConfig(newConfig);
          setIsCrafting(false);
          onConfigApplied();
      }, 2000);
  };

  const triggerAddToCart = (addPillow: boolean = false) => {
      const sizeName = sizes.find(s => s.id === config.sizeId)?.name;
      const coverName = materials.find(m => m.id === config.coverId)?.name;
      const supportName = materials.find(m => m.id === config.supportLayerId)?.name;
      const comfortNames = config.comfortLayerIds.map(id => materials.find(m => m.id === id)?.name).filter(Boolean).join(' + ');
      const summary = `${sizeName} | ${coverName} | ${comfortNames || '無舒適層'} | ${supportName}`;
      
      const item: CartItem = {
          id: Date.now().toString(),
          type: 'custom',
          name: '海姆手作床墊 (DIY)',
          price: totalPrice,
          quantity: 1,
          config: config,
          configSummary: summary
      };
      onAddToCart(item);

      if (addPillow && recommendedPillow) {
          const pillowItem: CartItem = {
              id: (Date.now() + 1).toString(),
              type: 'product',
              name: recommendedPillow.name,
              price: recommendedPillow.price,
              quantity: 1,
              productId: recommendedPillow.id
          };
          onAddToCart(pillowItem);
      }

      if (onUnlockAchievement) onUnlockAchievement('diy_master');
      setShowUpsellModal(false);
  };

  const handleAddToCartClick = () => {
    if (!config.supportLayerId || !config.coverId) {
        alert('請先選擇「支撐層」與「表布」才能完成製作是也！');
        return;
    }

    let targetPillowId = aiConfig?.suggestedPillowId;
    if (!targetPillowId) {
        if (config.coverId.includes('cooling') || config.coverId.includes('tencel')) {
            targetPillowId = 'cooling_pillow';
        } else {
            targetPillowId = 'neck_pillow';
        }
    }

    if (targetPillowId) {
        const loadPillow = async () => {
            const products = await dataService.getProducts();
            const pillow = products.find(p => p.id === targetPillowId);
            if (pillow) {
                setRecommendedPillow(pillow);
                setShowUpsellModal(true);
            } else {
                // If not found, just add to cart without upsell
                triggerAddToCart(false);
            }
        };
        loadPillow();
        return;
    }
    triggerAddToCart(false);
  };

  const selectedCover = materials.find(m => m.id === config.coverId);
  const selectedSupport = materials.find(m => m.id === config.supportLayerId);
  const selectedComfortList = config.comfortLayerIds.map(id => materials.find(m => m.id === id)).filter(Boolean) as Material[];

  const covers = materials.filter(m => m.type === MaterialType.COVER);
  const comfortLayers = materials.filter(m => m.type === MaterialType.COMFORT_LAYER);
  const supportLayers = materials.filter(m => m.type === MaterialType.SUPPORT_LAYER);

  // Helper functions for visuals
  const getMaterialColorStyle = (mat?: Material) => mat && mat.color.startsWith('#') ? { backgroundColor: mat.color } : {};
  const getMaterialColorClass = (mat?: Material) => !mat ? 'bg-gray-200' : mat.color.startsWith('#') ? '' : mat.color;

  // HEIM OS VISUALIZER (Reused for Desktop and Mobile Modal)
  const HeimOSVisualizer = () => (
      <div className="relative flex flex-col items-center justify-center min-h-[300px] space-y-1 py-8">
            <div className={`relative w-56 h-12 ${getMaterialColorClass(selectedCover)} rounded-2xl shadow-[inset_0_-4px_4px_rgba(0,0,0,0.1)] border-2 border-white/40 z-30 overflow-hidden transition-all duration-500 transform ${selectedCover ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-20 bg-white'}`} style={getMaterialColorStyle(selectedCover)}>
            {selectedCover && <MaterialThumbnail material={selectedCover} />}
            </div>
            <div className="flex flex-col-reverse items-center w-full space-y-1 space-y-reverse">
            {[...selectedComfortList].map((l, i) => (
                <div key={i} className={`relative w-52 h-9 ${getMaterialColorClass(l)} rounded-xl shadow-[inset_0_-3px_3px_rgba(0,0,0,0.1)] border-2 border-white/40 z-20 overflow-hidden transition-all`} style={getMaterialColorStyle(l)}>
                    <MaterialThumbnail material={l} />
                </div>
            ))}
            </div>
            {selectedComfortList.length === 0 && (
                <div className="w-48 h-10 border-4 border-dashed border-ac-brown/20 rounded-xl flex items-center justify-center text-xs text-ac-brown/50 font-bold">+ 增加舒適層</div>
            )}
            <div className={`relative w-56 h-28 ${getMaterialColorClass(selectedSupport)} rounded-2xl shadow-[inset_0_-6px_6px_rgba(0,0,0,0.1)] border-2 border-white/40 z-10 overflow-hidden transition-all mt-1 ${selectedSupport ? '' : 'bg-white opacity-20'}`} style={getMaterialColorStyle(selectedSupport)}>
            {selectedSupport && <MaterialThumbnail material={selectedSupport} />}
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-md border-2 border-white/50 transform rotate-6 z-40">
                <p className="text-[10px] font-bold text-ac-darkBrown">總厚度</p>
                <p className="text-xl font-black text-ac-green">{totalThickness} cm</p>
            </div>
      </div>
  );

  if (isCrafting) {
      return (
          <div className="fixed inset-0 bg-ac-cream z-[100] flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-ac-brown rounded-2xl animate-spin mb-8 flex items-center justify-center shadow-[0_8px_0_#5D4037]">
                  <Icons.Workbench className="w-20 h-20 text-ac-yellow" />
              </div>
              <h2 className="text-3xl font-display font-bold text-ac-darkBrown animate-pulse">DIY 製作中...</h2>
              <p className="text-ac-brown mt-2">咚咚咚... 鏘！</p>
          </div>
      )
  }

  return (
    <div className="min-h-screen pb-32 pt-32 lg:pt-40 relative">
      <SEO 
        title="DIY 手作工坊"
        description="海姆島的床墊工坊，讓您自由組合表布、舒適層與獨立筒。軟硬自己拚、材料自己選，打造獨一無二的專屬床墊。"
      />
      {/* UPSELL MODAL */}
      {showUpsellModal && recommendedPillow && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpsellModal(false)}></div>
              <div className="relative bg-white rounded-[2rem] border-8 border-ac-orange p-6 max-w-md w-full shadow-2xl animate-pop">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                      <div className="w-20 h-20 bg-ac-orange rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-md">
                          🐹
                      </div>
                  </div>
                  
                  <div className="mt-10 text-center">
                      <h3 className="text-2xl font-black text-ac-darkBrown mb-2">哈姆的貼心建議！</h3>
                      <p className="text-ac-brown text-sm mb-4 font-bold">
                          這張床墊搭配這顆枕頭... <br/>
                          絕對能讓你睡得像寶寶一樣香甜是也！
                      </p>
                      
                      <div className="bg-ac-cream p-4 rounded-2xl border-2 border-ac-brown/10 mb-6 flex gap-4 items-center text-left">
                          <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border-2 border-white flex-shrink-0 shadow-sm">
                              <AIImage src={recommendedPillow.uploadedImage} prompt={recommendedPillow.imagePrompt} alt={recommendedPillow.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                              <h4 className="font-black text-ac-darkBrown">{recommendedPillow.name}</h4>
                              <p className="text-xs text-ac-brown opacity-70 line-clamp-2 mb-1">{recommendedPillow.description}</p>
                              <p className="text-ac-orange font-black">{recommendedPillow.price.toLocaleString()} 橡實幣</p>
                          </div>
                      </div>

                      <div className="grid gap-3">
                          <button 
                              onClick={() => triggerAddToCart(true)}
                              className="w-full bg-ac-green text-white py-3 rounded-xl font-black shadow-[0_4px_0_#44855f] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center"
                          >
                              <Icons.Check className="w-5 h-5 mr-2" />
                              好！一起帶走 (完美睡眠)
                          </button>
                          <button 
                              onClick={() => triggerAddToCart(false)}
                              className="w-full bg-white text-ac-brown border-2 border-ac-cream py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                          >
                              不用了，只要床墊
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* NEW: MOBILE LAYER PREVIEW MODAL */}
      {showMobilePreview && (
          <div className="fixed inset-0 z-[70] lg:hidden flex items-center justify-center p-4 animate-fade-in-up">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobilePreview(false)}></div>
              <div className="relative w-full max-w-sm bg-ac-cream rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden">
                  <div className="bg-ac-green h-12 flex items-center justify-between px-4 text-white font-bold">
                      <span>HeimOS 構造圖</span>
                      <button onClick={() => setShowMobilePreview(false)}><Icons.Close className="w-6 h-6"/></button>
                  </div>
                  <HeimOSVisualizer />
                  <div className="p-4 bg-white/50 border-t-2 border-dashed border-ac-brown/20 text-center">
                      <p className="text-sm text-ac-brown mb-2">點擊空白處關閉</p>
                  </div>
              </div>
          </div>
      )}

      {/* NEW: SIMPLIFIED MOBILE STICKY HEADER */}
      <div className="lg:hidden sticky top-16 z-30 px-2 py-2 pointer-events-none">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-2 shadow-md border-2 border-ac-cream pointer-events-auto flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 flex-1">
                   <div className="bg-ac-cream px-3 py-1 rounded-xl">
                       <p className="text-[10px] font-bold text-ac-brown">厚度</p>
                       <p className="text-sm font-black text-ac-darkBrown">{totalThickness}cm</p>
                   </div>
                   <div className="flex-1">
                      <p className="text-[10px] text-ac-brown font-bold">目前總價</p>
                      <p className="text-lg font-black text-ac-orange leading-none">
                          ${totalPrice.toLocaleString()}
                      </p>
                   </div>
              </div>
              <button 
                onClick={() => setShowMobilePreview(true)}
                className="bg-ac-blue text-white p-2 pr-3 rounded-xl flex items-center shadow-sm active:scale-95 transition-transform"
              >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                    <Icons.Image className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">查看<br/>構造</span>
              </button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-12 mt-2 md:mt-4">
          <div className="inline-block bg-ac-yellow border-2 border-ac-orange px-4 py-1 rounded-full text-ac-darkBrown font-bold mb-4 transform -rotate-2 shadow-sm text-sm md:text-base">
            DIY 方程式
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-black text-ac-darkBrown">製作你的專屬床墊</h2>
          <button onClick={onOpenAiModal} className="mt-4 md:mt-6 inline-flex items-center px-5 py-2 md:px-6 md:py-3 rounded-full text-white bg-ac-blue font-bold border-4 border-white shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all text-sm md:text-base">
            <Icons.Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-pulse mr-2" />
            詢問哈姆 (AI)
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start relative">
          {/* REACTIVE HAMU (Desktop Position) */}
          <div className="hidden lg:block absolute -top-12 left-4 w-20 h-20 pointer-events-none z-10">
              <HamuReaction materialId={lastInteractedMaterial} trigger={hamuTrigger} />
          </div>

          <div className="lg:col-span-7 space-y-4 md:space-y-6">
            <div className="flex space-x-2 overflow-x-auto pb-2 px-1 no-scrollbar md:pl-4 snap-x sticky top-32 lg:static z-20 bg-ac-cream/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none pt-2 lg:pt-0">
              {[
                { id: 'size', label: '1. 尺寸' },
                { id: 'support', label: '2. 支撐' },
                { id: 'comfort', label: '3. 舒適' },
                { id: 'cover', label: '4. 表布' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`snap-center flex-shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-t-2xl font-bold text-sm transition-all border-t-4 border-l-4 border-r-4 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-white border-white text-ac-darkBrown translate-y-1 z-10' 
                      : 'bg-ac-cream border-ac-blue/20 text-ac-blue/70 hover:bg-ac-blue/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl md:rounded-tl-none shadow-[0_10px_0_rgba(0,0,0,0.05)] border-4 border-white p-4 md:p-6 min-h-[400px] md:min-h-[500px]">
              {activeTab === 'size' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
                    {sizes.map((size) => (
                        <div 
                        key={size.id}
                        onClick={() => handleMaterialSelect('sizeId', size.id)}
                        className={`cursor-pointer p-4 rounded-2xl border-4 transition-all duration-200 relative ${
                            config.sizeId === size.id ? 'border-ac-green bg-ac-lightGreen/20' : 'border-ac-cream hover:border-ac-green/50'
                        }`}
                        >
                        {config.sizeId === size.id && <div className="absolute top-2 right-2 text-ac-green"><Icons.Check className="w-6 h-6"/></div>}
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-ac-darkBrown text-lg">{size.name}</h3>
                                <p className="text-sm text-ac-brown mt-1">{size.width}x{size.length}cm</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-400 font-bold mb-1">差價</span>
                                <div className={`flex items-center px-3 py-1 rounded-full ${size.basePrice === 0 ? 'bg-gray-100 text-gray-500' : 'bg-ac-yellow/50 text-ac-darkBrown'}`}>
                                    <span className="font-bold">
                                    {size.basePrice === 0 ? '標準價格' : size.basePrice > 0 ? `+${size.basePrice.toLocaleString()}` : size.basePrice.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                    <div className="bg-[#FFF9C4] p-4 rounded-xl border-2 border-[#F9E79F] text-center flex flex-col md:flex-row items-center justify-center gap-3 shadow-md transform rotate-1 animate-float hover:rotate-0 transition-transform">
                        <p className="text-ac-darkBrown font-bold text-sm">
                            <span className="mr-2 text-lg">💡</span>
                            特製尺寸可以訊息詢問哈姆~ 
                            <span className="text-xs block md:inline md:ml-2 opacity-70 font-normal">(請提供長寬公分數以利報價是也！)</span>
                        </p>
                        <a 
                            href={STORE_INFO.lineUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-ac-green text-white px-4 py-2 rounded-full text-xs font-black shadow-sm hover:bg-[#66a04b] hover:scale-105 transition-all flex items-center whitespace-nowrap border-2 border-white"
                        >
                            <Icons.Chat className="w-3 h-3 mr-1" />
                            聯絡哈姆
                        </a>
                    </div>
                </>
              )}

              {(activeTab === 'cover' || activeTab === 'comfort' || activeTab === 'support') && (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                  { (activeTab === 'cover' ? covers : activeTab === 'comfort' ? comfortLayers : supportLayers).map((item) => {
                    let isSelected = false;
                    if (activeTab === 'comfort') isSelected = config.comfortLayerIds.includes(item.id);
                    else isSelected = config[activeTab === 'cover' ? 'coverId' : 'supportLayerId'] === item.id;

                    return (
                      <div 
                        key={item.id}
                        onClick={() => handleMaterialSelect(
                          activeTab === 'cover' ? 'coverId' : activeTab === 'comfort' ? 'comfortLayerIds' : 'supportLayerId', 
                          item.id
                        )}
                        className={`group cursor-pointer p-2 md:p-3 rounded-2xl md:rounded-3xl border-4 transition-all flex flex-col lg:flex-row items-center lg:items-start gap-2 md:gap-4 active:scale-[0.98] md:active:scale-100 h-full relative ${
                          isSelected ? 'border-ac-green bg-ac-lightGreen/20 shadow-inner' : 'border-ac-cream hover:border-ac-green/50 bg-white'
                        }`}
                      >
                        {/* Selection Indicator */}
                        {isSelected && <div className="absolute top-2 right-2 text-ac-green lg:hidden"><Icons.Check className="w-5 h-5" /></div>}

                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex-shrink-0 overflow-hidden border-2 border-black/10 shadow-sm relative`}>
                            <MaterialThumbnail material={item} />
                            {/* Desktop Check Overlay */}
                            {isSelected && (
                                <div className="hidden lg:flex absolute inset-0 bg-black/20 items-center justify-center z-10">
                                    <Icons.Check className="w-8 h-8 text-white drop-shadow-md" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 w-full text-center lg:text-left">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                             <h3 className="font-bold text-ac-darkBrown text-xs md:text-lg leading-tight mb-1">{item.name}</h3>
                             <div className="flex items-center justify-center lg:justify-start bg-ac-yellow/30 px-2 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs font-bold text-ac-orange w-fit mx-auto lg:mx-0">
                                <Icons.Acorn className="w-3 h-3 mr-1" />
                                +{item.price.toLocaleString()}
                             </div>
                          </div>
                          {item.stats && (
                              <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 my-1 lg:my-2 justify-center lg:justify-start">
                                  <StatBar label="軟硬" value={item.stats.firmness} color="bg-ac-orange" />
                                  <StatBar label="透氣" value={item.stats.breathability} color="bg-ac-blue" />
                              </div>
                          )}
                          {/* Description: Hidden on mobile, Visible on Desktop */}
                          <p className="hidden lg:block text-xs md:text-sm text-ac-brown leading-tight mt-1 mb-2 line-clamp-2">{item.description}</p>
                          
                          {/* Mobile: Benefits only */}
                          <div className="flex flex-wrap gap-1 justify-center lg:justify-start mt-1">
                             {item.benefits.slice(0, 2).map((b, i) => (
                                 <span key={i} className="text-[9px] md:text-[10px] bg-white border border-ac-cream px-1.5 py-0.5 rounded-full text-ac-brown font-bold">{b}</span>
                             ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP SIDEBAR (UNCHANGED) */}
          <div className="hidden lg:block lg:col-span-5 mt-8 lg:mt-0 sticky top-32">
             <div className="bg-ac-cream rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden relative">
                <div className="bg-ac-green h-12 w-full flex items-center justify-between px-6 text-white font-bold">
                    <span>HeimOS</span>
                    <div className="w-16 h-4 bg-black/20 rounded-full"></div>
                    <span className="text-xs">100%</span>
                </div>
                <div className="p-8">
                    <HeimOSVisualizer />
                    <div className="bg-white rounded-2xl p-4 border-2 border-dashed border-ac-brown/20 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ac-cream px-2 text-xs font-bold text-ac-brown">材料清單</div>
                        <div className="space-y-2 text-sm text-ac-darkBrown mt-2">
                            <div className="flex justify-between"><span className="opacity-70">尺寸</span> <span className="font-bold">{sizes.find(s => s.id === config.sizeId)?.name}</span></div>
                            <div className="flex justify-between"><span className="opacity-70">表布</span> <span className="font-bold">{selectedCover?.name || '-'}</span></div>
                            <div className="flex justify-between"><span className="opacity-70">支撐</span> <span className="font-bold">{selectedSupport?.name || '-'}</span></div>
                        </div>
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-ac-brown/20 flex justify-between items-end">
                            <span className="font-bold text-ac-brown">總計</span>
                            <span className="text-2xl font-black text-ac-orange flex items-center">
                                <Icons.Acorn className="w-6 h-6 mr-1" />
                                {totalPrice.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <button onClick={handleAddToCartClick} className="w-full mt-6 bg-ac-green text-white py-4 rounded-2xl font-bold text-lg shadow-[0_6px_0_#44855f] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center hover:bg-[#8bc46a]">
                        <Icons.ShoppingBag className="w-6 h-6 mr-2" />
                        加入置物籃
                    </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="lg:hidden fixed left-0 right-0 p-3 pb-6 bg-white/90 backdrop-blur border-t-4 border-ac-cream shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40" style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}>
          <button onClick={handleAddToCartClick} className="w-full bg-ac-green text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_0_#44855f] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center text-lg">
              <Icons.ShoppingBag className="w-5 h-5 mr-2" />
              加入置物籃 ({totalPrice.toLocaleString()})
          </button>
      </div>
      
      {/* Mobile Hamu Reaction - Positioned above bottom bar */}
      <div className="lg:hidden fixed bottom-48 left-4 z-[99] pointer-events-none">
          <HamuReaction materialId={lastInteractedMaterial} trigger={hamuTrigger} />
      </div>
    </div>
  );
};
