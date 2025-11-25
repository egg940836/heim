
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { AIImage } from './AIImage';
import { Icons } from './Icons';
import { Product, CartItem, ProductVariant } from '../types';
import { SEO } from './SEO';
import { STORE_INFO } from '../constants';

interface ProductShopProps {
    onAddToCart: (item: CartItem) => void;
    onUnlockAchievement?: (id: string) => void;
}

const ITEMS_PER_PAGE = 9;

const MoneyRock = () => {
  const [shaking, setShaking] = useState(false);
  const [rewards, setRewards] = useState<{id: number, type: string}[]>([]);

  const hitRock = () => {
    if (shaking) return;
    setShaking(true);
    setTimeout(() => setShaking(false), 150); // Reset shake

    const id = Date.now();
    const items = ['💰', '🔔', '🪙', '💎', '💰', '🔔']; 
    // Bell bag, Bell icon, Coin, Gem
    const type = items[Math.floor(Math.random() * items.length)];
    
    setRewards(prev => [...prev, {id, type}]);
    setTimeout(() => {
        setRewards(prev => prev.filter(r => r.id !== id));
    }, 1000);
  };

  return (
    // Fixed positioning: Bottom-24 on mobile to avoid nav bar, Left-4
    <div className="fixed bottom-24 left-4 z-40 select-none">
       {/* Rock Visual */}
       <div 
         onClick={hitRock}
         className={`relative w-12 h-9 bg-[#9E9E9E] rounded-[40%_60%_60%_40%/40%_40%_60%_60%] border-b-4 border-[#616161] shadow-md cursor-pointer transition-transform active:scale-95 group ${shaking ? 'animate-rock-shake' : ''}`}
       >
           {/* Texture */}
           <div className="absolute top-2 left-3 w-1.5 h-1 bg-[#757575] rounded-full opacity-50"></div>
           <div className="absolute bottom-2 right-3 w-2 h-1.5 bg-[#757575] rounded-full opacity-50"></div>
           
           {/* Hidden shovel hint on hover (Desktop) */}
           <div className="hidden md:block absolute -right-6 -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-xl transform rotate-45 pointer-events-none">
               ⛏️
           </div>
       </div>

       {/* Flying Rewards */}
       {rewards.map(r => (
           <div key={r.id} className="absolute top-0 left-1/2 -translate-x-1/2 animate-fly-reward text-2xl pointer-events-none drop-shadow-md">
               {r.type}
           </div>
       ))}

       <style>{`
           @keyframes rock-shake {
               0% { transform: translateX(0); }
               25% { transform: translateX(-2px) rotate(-2deg); }
               50% { transform: translateX(2px) rotate(2deg); }
               75% { transform: translateX(-2px) rotate(-2deg); }
               100% { transform: translateX(0); }
           }
           .animate-rock-shake { animation: rock-shake 0.15s ease-in-out; }
           
           @keyframes fly-reward {
               0% { transform: translate(-50%, -10px) scale(0.5); opacity: 0; }
               20% { opacity: 1; transform: translate(-50%, -30px) scale(1.2); }
               100% { transform: translate(-50%, -80px) scale(1); opacity: 0; }
           }
           .animate-fly-reward { animation: fly-reward 0.8s ease-out forwards; }
       `}</style>
    </div>
  );
};

export const ProductShop: React.FC<ProductShopProps> = ({ onAddToCart, onUnlockAchievement }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [reviewLikes, setReviewLikes] = useState<Record<string, number>>({});

  const selectedProduct = products.find(p => p.id === selectedProductId);

  useEffect(() => {
    const loadProducts = async () => {
      const p = await dataService.getProducts();
      setProducts(p);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    // Sync URL param to state
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId) {
        setSelectedProductId(productId);
    }
  }, []);

  useEffect(() => {
    // Sync state to URL
    const params = new URLSearchParams(window.location.search);
    if (selectedProductId) {
        params.set('product', selectedProductId);
    } else {
        params.delete('product');
    }
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [selectedProductId]);

  useEffect(() => {
      if (selectedProduct?.variants && selectedProduct.variants.length > 0) {
          const defaultVariant = selectedProduct.variants.find(v => v.id === 'double') || selectedProduct.variants[0];
          setSelectedVariant(defaultVariant);
      } else {
          setSelectedVariant(null);
      }
  }, [selectedProduct]);

  const handleAddToCart = (product: Product) => {
      const priceToUse = selectedVariant ? selectedVariant.price : product.price;
      const item: CartItem = {
          id: Date.now().toString(),
          type: 'product',
          name: product.name,
          price: priceToUse,
          quantity: 1,
          productId: product.id,
          variant: selectedVariant ? { id: selectedVariant.id, name: selectedVariant.name } : undefined
      };
      onAddToCart(item);
      if (onUnlockAchievement) onUnlockAchievement('shopaholic');
  };

  const handleLikeReview = (author: string) => {
      setReviewLikes(prev => ({
          ...prev,
          [author]: (prev[author] || 0) + 1
      }));
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const displayedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo(0, 0);
  };

  // Generate SEO and Schema for List View
  const listSEO = (
      <SEO 
          title="限定商店"
          description="探索海姆島的限定聯名商品，包含軟綿綿雲朵床、堅固龜殼床與多種可愛配件。皆為哈姆店長嚴選好物。"
          jsonLd={{
             "@context": "https://schema.org",
             "@type": "CollectionPage",
             "name": "海姆限定商店",
             "description": "海姆島的限定聯名商品列表",
             "url": window.location.href,
             "mainEntity": {
                "@type": "ItemList",
                "itemListElement": displayedProducts.map((p, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `${window.location.origin}/#/shop?product=${p.id}`,
                    "name": p.name
                }))
             }
          }}
      />
  );

  // ========== DETAIL VIEW ==========
  if (selectedProduct) {
      const currentPrice = selectedVariant ? selectedVariant.price : selectedProduct.price;

      // Generate Product Schema
      const productSchema = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": selectedProduct.name,
          "image": selectedProduct.uploadedImage, // Note: In production this should be a public URL, not base64
          "description": selectedProduct.seo?.description || selectedProduct.description,
          "brand": {
              "@type": "Brand",
              "name": STORE_INFO.name
          },
          "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "TWD",
              "price": currentPrice,
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition"
          },
          ...(selectedProduct.reviews && selectedProduct.reviews.length > 0 ? {
              "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": (selectedProduct.reviews.reduce((acc, r) => acc + r.rating, 0) / selectedProduct.reviews.length).toFixed(1),
                  "reviewCount": selectedProduct.reviews.length
              },
              "review": selectedProduct.reviews.map(r => ({
                  "@type": "Review",
                  "author": { "@type": "Person", "name": r.author },
                  "datePublished": r.date,
                  "reviewBody": r.content,
                  "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": r.rating
                  }
              }))
          } : {})
      };

      return (
          <div className="min-h-screen px-4 md:px-6 pb-24 pt-10">
              <SEO 
                  title={selectedProduct.seo?.title || selectedProduct.name}
                  description={selectedProduct.seo?.description || selectedProduct.description}
                  keywords={selectedProduct.seo?.keywords}
                  image={selectedProduct.uploadedImage} // Warning: Base64 might be too large for some crawlers
                  type="product"
                  jsonLd={productSchema}
              />
              <div className="max-w-6xl mx-auto">
                  {/* Breadcrumbs */}
                  <div className="flex items-center text-sm font-bold text-ac-brown mb-6">
                      <button onClick={() => setSelectedProductId(null)} className="hover:text-ac-green">海姆限定商店</button>
                      <Icons.ArrowRight className="w-4 h-4 mx-2" />
                      <span className="opacity-50">{selectedProduct.category}</span>
                      <Icons.ArrowRight className="w-4 h-4 mx-2" />
                      <span className="text-ac-darkBrown">{selectedProduct.name}</span>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                      {/* Left: Gallery */}
                      <div className="space-y-4">
                          <div className="aspect-[4/3] bg-white rounded-[2rem] border-4 border-white shadow-lg overflow-hidden relative">
                              <AIImage 
                                  src={selectedProduct.uploadedImage} 
                                  prompt={selectedProduct.imagePrompt}
                                  alt={selectedProduct.name}
                                  className="w-full h-full object-cover"
                                  aspectRatio="4:3"
                              />
                              
                              {selectedProduct.tags?.includes('LIMITED') && (
                                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-white shadow-md animate-pulse">限定款</div>
                              )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              {selectedProduct.galleryPrompts?.map((prompt, idx) => (
                                  <div key={idx} className="aspect-[4/3] bg-white rounded-2xl border-4 border-white shadow-sm overflow-hidden">
                                      <AIImage prompt={prompt} alt="Detail" className="w-full h-full object-cover" aspectRatio="4:3" />
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Right: Info */}
                      <div className="flex flex-col">
                          <h1 className="text-3xl md:text-4xl font-display font-black text-ac-darkBrown mb-2">
                              {selectedProduct.name}
                          </h1>
                          
                          <div className="flex items-center gap-1 mb-4">
                              {[...Array(5)].map((_, i) => <Icons.Star key={i} className="w-5 h-5 text-ac-yellow" />)}
                              <span className="text-sm font-bold text-ac-brown ml-2">({selectedProduct.reviews?.length || 0} 則島民評價)</span>
                          </div>

                          <div className="bg-[#FDFBF7] rounded-2xl p-6 border-2 border-ac-cream mb-6">
                              <p className="text-ac-darkBrown leading-relaxed font-medium">
                                  {selectedProduct.fullDescription}
                              </p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-8">
                              {selectedProduct.features?.map((feat, idx) => (
                                  <div key={idx} className="flex flex-col items-center text-center p-3 bg-white rounded-xl border-2 border-ac-cream">
                                      <span className="text-2xl mb-1">{feat.icon}</span>
                                      <span className="text-xs font-bold text-ac-brown">{feat.label}</span>
                                  </div>
                              ))}
                          </div>

                          {/* Variant Selection */}
                          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                              <div className="mb-8">
                                  <h3 className="font-black text-ac-darkBrown mb-3">選擇規格</h3>
                                  <div className="flex flex-wrap gap-2">
                                      {selectedProduct.variants.map((variant) => (
                                          <button
                                              key={variant.id}
                                              onClick={() => setSelectedVariant(variant)}
                                              className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${
                                                  selectedVariant?.id === variant.id
                                                  ? 'bg-ac-orange text-white border-ac-orange shadow-md scale-105'
                                                  : 'bg-white text-ac-brown border-ac-cream hover:border-ac-orange/50'
                                              }`}
                                          >
                                              {variant.name}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          )}

                          <div className="mb-8">
                              <h3 className="font-black text-ac-darkBrown mb-3">詳細規格</h3>
                              <div className="space-y-2 text-sm">
                                  {selectedProduct.specs?.map((spec, idx) => (
                                      <div key={idx} className="flex justify-between border-b border-dashed border-ac-brown/20 pb-1">
                                          <span className="text-ac-brown font-bold">{spec.label}</span>
                                          <span className="text-ac-darkBrown font-bold">{spec.value}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Action Area */}
                          <div className="mt-auto sticky bottom-0 bg-white/90 backdrop-blur p-4 -mx-4 md:mx-0 border-t-2 border-ac-cream md:border-none md:bg-transparent md:p-0 md:static z-20">
                              <div className="flex items-center justify-between gap-4">
                                  <div className="flex flex-col">
                                      <span className="text-xs font-bold text-ac-brown">售價 (橡實幣)</span>
                                      <div className="flex items-center text-3xl font-black text-ac-orange">
                                          <Icons.Acorn className="w-6 h-6 mr-1" />
                                          {currentPrice.toLocaleString()}
                                      </div>
                                  </div>
                                  <button 
                                      onClick={() => handleAddToCart(selectedProduct)}
                                      className="flex-1 bg-ac-green text-white py-4 rounded-full font-black text-lg shadow-[0_6px_0_#44855f] active:shadow-none active:translate-y-[6px] transition-all hover:bg-[#66a04b] flex items-center justify-center"
                                  >
                                      <Icons.ShoppingBag className="w-5 h-5 mr-2" />
                                      加入置物籃
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="mt-16 pt-10 border-t-4 border-dashed border-ac-brown/10">
                      <div className="flex items-center justify-between mb-8">
                          <h2 className="text-2xl md:text-3xl font-black text-ac-darkBrown flex items-center">
                              <span className="bg-ac-yellow w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg border-2 border-ac-orange shadow-sm">💬</span>
                              島民評價
                          </h2>
                          <div className="bg-white px-4 py-2 rounded-full border-2 border-ac-cream text-xs font-bold text-ac-brown shadow-sm hidden md:block">
                              {selectedProduct.reviews?.length || 0} 則分享
                          </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                          {selectedProduct.reviews?.length > 0 ? selectedProduct.reviews.map((review, idx) => (
                              <div 
                                  key={idx} 
                                  className={`bg-white p-6 rounded-[2rem] border-4 border-ac-cream shadow-sm flex gap-4 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md hover:border-ac-blue/30 animate-fade-in-up`}
                                  style={{ animationDelay: `${idx * 100}ms`, transform: `rotate(${idx % 2 === 0 ? '1deg' : '-1deg'})` }}
                              >
                                  <div className="flex flex-col items-center gap-2">
                                      <div className="w-14 h-14 bg-ac-blue/10 rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-inner flex-shrink-0">
                                          {['🐶','🐱','🐰','🐻','🐨','🦊'][idx % 6]}
                                      </div>
                                      <div className="bg-ac-green/10 text-ac-green text-[10px] font-black px-2 py-1 rounded-full">
                                          已購入
                                      </div>
                                  </div>
                                  
                                  <div className="flex-1 relative">
                                      {/* Speech Bubble Tail */}
                                      <div className="absolute top-4 -left-6 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-ac-cream border-b-[10px] border-b-transparent"></div>
                                      
                                      <div className="flex items-center justify-between mb-2">
                                          <span className="font-black text-lg text-ac-darkBrown">{review.author}</span>
                                          <span className="text-xs text-gray-400 font-bold">{review.date}</span>
                                      </div>
                                      
                                      <div className="flex mb-3">
                                          {[...Array(5)].map((_,i) => (
                                              <Icons.Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-ac-yellow' : 'text-gray-200'}`}/>
                                          ))}
                                      </div>
                                      
                                      <p className="text-sm text-ac-brown font-medium mb-4 leading-relaxed bg-gray-50 p-3 rounded-xl">
                                          "{review.content}"
                                      </p>
                                      
                                      <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200">
                                          <div className="flex gap-2">
                                              {review.tags?.map(tag => (
                                                  <span key={tag} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">#{tag}</span>
                                              ))}
                                          </div>
                                          
                                          <button 
                                              onClick={() => handleLikeReview(review.author)}
                                              className="flex items-center gap-1 text-xs font-bold text-ac-orange hover:scale-110 transition-transform active:scale-90"
                                          >
                                              <span className={`text-lg transition-all ${reviewLikes[review.author] ? 'scale-125' : ''}`}>👍</span>
                                              <span>覺得讚 ({ (review.helpfulCount || 0) + (reviewLikes[review.author] || 0) })</span>
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          )) : (
                              <div className="col-span-full text-center py-12 bg-ac-cream/30 rounded-3xl border-4 border-dashed border-ac-brown/10">
                                  <div className="text-4xl mb-4 opacity-50">📝</div>
                                  <p className="text-ac-brown font-bold text-lg mb-2">目前還沒有評價...</p>
                                  <p className="text-sm text-ac-brown opacity-70">快來成為第一個評論的島民吧！</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // ========== LIST VIEW ==========
  return (
    <div className="min-h-screen px-4 md:px-6 pb-24 pt-10">
      {listSEO}
      {/* Money Rock Interaction */}
      <MoneyRock />

      <div className="max-w-6xl mx-auto">
        
        {/* Shop Header */}
        <div className="text-center mb-8 md:mb-16 relative">
           <div className="inline-block bg-[#8D6E63] text-[#FFE082] border-4 border-[#5D4037] px-6 py-3 md:px-8 md:py-3 rounded-lg shadow-lg md:transform md:rotate-1">
              <h2 className="text-xl md:text-4xl font-display font-black tracking-wider flex items-center">
                <Icons.BellBag className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" />
                海姆限定商店
              </h2>
           </div>
           <p className="text-ac-brown mt-4 md:mt-6 font-medium text-sm md:text-base md:text-lg">
             這裡有一些特別的好東西，是哈姆店長特別談回來的聯名款喔！<br/>
             <span className="text-xs text-ac-orange block md:inline">※ 數量有限，賣完就沒有了是也！</span>
           </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {displayedProducts.map((product) => (
                <div 
                    key={product.id} 
                    onClick={() => setSelectedProductId(product.id)}
                    className="group relative bg-white rounded-2xl md:rounded-[2rem] shadow-[0_4px_0_#e0e0e0] md:shadow-[0_10px_0_#e0e0e0] border-2 md:border-4 border-white hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-full"
                >
                    <div className="relative aspect-[4/3] bg-ac-cream border-b-2 md:border-b-4 border-white overflow-hidden">
                         <AIImage 
                            src={product.uploadedImage} 
                            prompt={product.imagePrompt} 
                            alt={product.name} 
                            className="w-full h-full object-cover transform md:group-hover:scale-110 transition-transform duration-700"
                            aspectRatio="4:3"
                         />
                         <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1 md:gap-2 items-start">
                             {product.tags?.includes('NEW') && <span className="bg-ac-green text-white text-[10px] md:text-xs font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-white shadow-sm animate-pulse">NEW!</span>}
                             {product.tags?.includes('HOT') && <span className="bg-red-500 text-white text-[10px] md:text-xs font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-white shadow-sm">HOT</span>}
                             {product.tags?.includes('SALE') && <span className="bg-ac-yellow text-ac-darkBrown text-[10px] md:text-xs font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-white shadow-sm">SALE</span>}
                         </div>
                    </div>

                    <div className="p-3 md:p-6 flex-1 flex flex-col">
                        <div className="mb-1 md:mb-2">
                            <span className="text-[10px] md:text-xs font-bold text-ac-brown bg-ac-cream px-1.5 py-0.5 md:px-2 md:py-1 rounded-md">{product.category}</span>
                        </div>
                        <h3 className="text-sm md:text-xl font-black text-ac-darkBrown mb-1 md:mb-2 group-hover:text-ac-blue transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        
                        <p className="hidden md:block text-sm text-ac-brown mb-6 flex-1 leading-relaxed line-clamp-2">
                            {product.description}
                        </p>

                        <div className="flex items-end justify-between mt-auto pt-2 md:pt-4 border-t border-dashed border-gray-200 md:border-t-2">
                            <div>
                                <p className="hidden md:block text-xs text-gray-400 font-bold mb-1">售價</p>
                                <div className="flex items-center bg-ac-yellow/30 px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-ac-orange font-black text-base md:text-xl">
                                    <Icons.Acorn className="w-3 h-3 md:w-5 md:h-5 mr-1" />
                                    {product.variants ? (
                                        <span className="text-sm md:text-lg">
                                            {Math.min(...product.variants.map(v => v.price)).toLocaleString()} 起
                                        </span>
                                    ) : (
                                        product.price.toLocaleString()
                                    )}
                                </div>
                            </div>
                            <div className="w-6 h-6 md:w-10 md:h-10 bg-ac-cream rounded-full flex items-center justify-center group-hover:bg-ac-green group-hover:text-white transition-colors">
                                <Icons.ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 md:mt-12 gap-3 md:gap-4">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full border-2 ${currentPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-ac-brown text-ac-brown hover:bg-ac-cream'}`}
                >
                    <Icons.ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                
                <div className="flex gap-1 md:gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full font-bold flex items-center justify-center transition-all text-sm md:text-base ${
                                currentPage === i + 1 
                                ? 'bg-ac-orange text-white shadow-md' 
                                : 'bg-white border-2 border-ac-cream text-ac-brown hover:border-ac-orange'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full border-2 ${currentPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-ac-brown text-ac-brown hover:bg-ac-cream'}`}
                >
                    <Icons.ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>
        )}

      </div>
    </div>
  );
};
