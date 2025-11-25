
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { AIImage } from './AIImage';
import { Icons } from './Icons';
import { BlogPost } from '../types';
import { PageType } from './Header';
import { SEO } from './SEO';

interface BlogPageProps {
  onNavigate?: (page: PageType) => void;
  onUnlockAchievement?: (id: string) => void;
}

const ITEMS_PER_PAGE = 9;

const TheRoostCoffee = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if(clicked) return;
    setClicked(true);
    setTimeout(() => setClicked(false), 3000);
  };

  return (
    // Mobile: Bottom-24 to clear Nav, Right-4. Desktop: Bottom-8 Right-8.
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 cursor-pointer group animate-fade-in-up" onClick={handleClick}>
       {/* Dialogue Bubble */}
       <div className={`absolute bottom-full right-1/2 translate-x-1/2 mb-2 bg-black/80 text-white px-3 py-1 rounded-xl rounded-br-none border border-white/20 font-bold text-xs whitespace-nowrap transition-all duration-500 ${clicked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
         Coo... ☕
       </div>
       
       {/* Heart Steam Animation */}
       {clicked && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
             <div className="text-2xl animate-steam text-red-500">❤️</div>
          </div>
       )}

       {/* Coffee Cup Visual */}
       <div className="relative transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
           {/* Saucer */}
           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-white rounded-[50%] border-2 border-gray-200 shadow-sm"></div>
           {/* Cup */}
           <div className="w-9 h-7 bg-white rounded-b-2xl border-2 border-gray-200 relative z-10 overflow-hidden">
               <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-1 bg-[#3E2723] rounded-[50%] opacity-80"></div>
               <div className="w-full h-full bg-gradient-to-b from-white to-gray-50"></div>
               {/* Logo (Roost style feather) */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#00695C] rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 border-t border-l border-white transform rotate-45"></div>
               </div>
           </div>
           {/* Handle */}
           <div className="absolute top-1 -right-1.5 w-3.5 h-3.5 border-2 border-gray-200 rounded-full z-0"></div>
       </div>

       <style>{`
         @keyframes steam {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-20px) scale(1.2); opacity: 0; }
         }
         .animate-steam { animation: steam 2s ease-out forwards; }
       `}</style>
    </div>
  );
};

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onUnlockAchievement }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedPost = blogPosts.find(p => p.id === selectedPostId);

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await dataService.getBlogPosts();
      setBlogPosts(posts);
    };
    loadPosts();
    if (onUnlockAchievement) onUnlockAchievement('knowledge_seeker');
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId) setSelectedPostId(postId);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedPostId) params.set('post', selectedPostId);
    else params.delete('post');
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [selectedPostId]);

  useEffect(() => {
    if (selectedPostId) {
      window.scrollTo(0, 0);
    }
  }, [selectedPostId]);

  const handleBack = () => {
    setSelectedPostId(null);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(blogPosts.length / ITEMS_PER_PAGE);
  const displayedPosts = blogPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo(0, 0);
  };

  const listSEO = (
      <SEO 
          title="島民日誌"
          description="海姆島的睡眠知識庫。哈姆店長分享如何挑選床墊、保養枕頭以及各種助眠小撇步。"
          jsonLd={{
             "@context": "https://schema.org",
             "@type": "Blog",
             "name": "海姆島民日誌",
             "description": "關於睡眠知識與床墊選購指南",
             "blogPost": displayedPosts.map(p => ({
                 "@type": "BlogPosting",
                 "headline": p.title,
                 "datePublished": p.date,
                 "author": { "@type": "Person", "name": p.author },
                 "description": p.excerpt
             }))
          }}
      />
  );

  // ========== DETAIL VIEW (Journal Style) ==========
  if (selectedPost) {
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": selectedPost.title,
        "image": selectedPost.imagePrompt, // Placeholder for valid URL
        "editor": selectedPost.author, 
        "keywords": selectedPost.tags.join(' '), 
        "url": window.location.href,
        "datePublished": selectedPost.date,
        "dateCreated": selectedPost.date,
        "dateModified": selectedPost.date,
        "description": selectedPost.excerpt,
        "articleBody": selectedPost.content,
        "author": {
            "@type": "Person",
            "name": selectedPost.author
        }
    };

    return (
      <div className="min-h-screen px-4 md:px-6 pb-24 relative pt-10">
        <SEO 
            title={selectedPost.title}
            description={selectedPost.excerpt}
            keywords={selectedPost.tags}
            type="article"
            jsonLd={articleSchema}
        />
        <div className="max-w-4xl mx-auto relative">
          
          <button 
            onClick={handleBack}
            className="mb-6 flex items-center font-bold text-ac-brown hover:text-ac-green transition-colors group"
          >
            <div className="bg-white p-2 rounded-full mr-2 border-2 border-ac-cream group-hover:border-ac-green">
              <Icons.ArrowLeft className="w-5 h-5" />
            </div>
            返回佈告欄
          </button>

          {/* Journal Container */}
          <div className="bg-[#FFFDF0] rounded-[2px] shadow-2xl relative overflow-hidden border-l-[12px] border-l-[#D7CCC8]">
             {/* Notebook Lines */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(#795548 1px, transparent 1px)', backgroundSize: '100% 2rem', marginTop: '4rem' }}>
             </div>

             <div className="p-8 md:p-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-4 border-dashed border-ac-brown/20 pb-6">
                    <div>
                       <div className="flex gap-3 mb-3">
                          <span className="bg-ac-yellow px-3 py-1 rounded-md text-ac-darkBrown font-black text-xs shadow-sm transform -rotate-2">
                             {selectedPost.category}
                          </span>
                          <span className="bg-ac-green text-white px-3 py-1 rounded-md font-bold text-xs shadow-sm transform rotate-1">
                             {selectedPost.date}
                          </span>
                       </div>
                       <h1 className="text-3xl md:text-5xl font-display font-black text-ac-darkBrown leading-tight">
                          {selectedPost.title}
                       </h1>
                       <p className="mt-2 text-ac-brown font-bold flex items-center">
                          <span className="w-8 h-8 bg-ac-orange rounded-full flex items-center justify-center text-white mr-2">✎</span>
                          {selectedPost.author}
                       </p>
                    </div>
                    
                    {/* Sticky Note CTA (Desktop) */}
                    <div className="hidden md:block w-48 bg-[#FFEB3B] p-4 shadow-md transform rotate-3 font-handwriting text-ac-darkBrown text-center relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full shadow-sm"></div>
                        <p className="font-bold text-sm mb-2">哈姆小筆記：</p>
                        <p className="text-xs leading-tight mb-3">{selectedPost.relatedLink?.label || '快去試試看！'}</p>
                        {onNavigate && selectedPost.relatedLink && (
                           <button 
                             onClick={() => onNavigate(selectedPost.relatedLink!.page as PageType)}
                             className="bg-ac-blue text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-400"
                           >
                             Go! &rarr;
                           </button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-ac-darkBrown prose-p:text-ac-darkBrown">
                   <div className="my-8 p-2 bg-white shadow-md transform -rotate-1 w-full md:w-3/4 mx-auto">
                      <AIImage 
                        prompt={selectedPost.imagePrompt} 
                        alt={selectedPost.title} 
                        className="w-full aspect-video object-cover"
                        aspectRatio="16:9"
                      />
                   </div>
                   <div dangerouslySetInnerHTML={{ __html: selectedPost.content }}></div>
                </div>

                <div className="mt-12 pt-8 border-t-4 border-dashed border-ac-brown/20">
                   <h4 className="text-sm font-bold text-ac-brown mb-3">TAGS:</h4>
                   <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold text-ac-green bg-ac-cream px-3 py-1 rounded-full border border-ac-green/30">
                          #{tag}
                        </span>
                      ))}
                   </div>
                </div>
             </div>
          </div>
          
          {onNavigate && selectedPost.relatedLink && (
            <div className="md:hidden fixed bottom-24 left-4 right-4 z-40">
               <button 
                  onClick={() => onNavigate(selectedPost.relatedLink!.page as PageType)}
                  className="w-full bg-ac-orange text-white font-black py-4 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center animate-bounce-slow"
               >
                  <Icons.Sparkles className="w-5 h-5 mr-2" />
                  {selectedPost.relatedLink.label}
               </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ========== LIST VIEW ==========
  return (
    <div className="min-h-screen px-4 md:px-6 pb-24 bg-[#F2F9F5] pt-10">
      {listSEO}
      {/* Roost Coffee Interaction */}
      <TheRoostCoffee />
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 relative">
           <div className="inline-block bg-[#8D6E63] border-4 border-[#6D4C41] px-6 py-3 md:px-8 md:py-4 rounded-[2rem] shadow-[0_8px_0_#4E342E] relative z-10">
              <h2 className="text-2xl md:text-4xl font-display font-black text-[#FFF8E1] tracking-wider flex items-center">
                <Icons.Dodo className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" />
                島民日誌
              </h2>
           </div>
           <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-[#A1887F] -z-0 transform -translate-y-1/2"></div>
           <p className="mt-6 md:mt-8 text-ac-brown font-bold text-base md:text-lg">
              這裡記錄了海姆島的睡眠秘密與生活智慧。<br className="hidden md:block"/>
              <span className="text-sm md:text-base opacity-80">偶爾也會有哈姆店長的碎碎念是也！</span>
           </p>
        </div>

        {/* Grid */}
        <div className="md:bg-[#E1C699] md:p-8 md:rounded-[2rem] md:shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] md:border-8 md:border-[#8D6E63] relative flex flex-col min-h-[600px]">
            {/* Cork Texture */}
            <div className="hidden md:block absolute inset-0 opacity-30 pointer-events-none rounded-[1.5rem]" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 relative z-10 mb-12 flex-1">
               {displayedPosts.map((post, idx) => (
                  <div 
                    key={post.id}
                    onClick={() => setSelectedPostId(post.id)}
                    className={`group bg-white p-4 md:p-3 md:pb-6 rounded-2xl md:rounded-none shadow-sm md:shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 h-fit border-2 border-ac-cream md:border-none`}
                    style={{ 
                        transform: window.innerWidth >= 768 ? `rotate(${idx % 2 === 0 ? '-1deg' : '1deg'})` : 'none' 
                    }}
                  >
                     <div className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#FFF59D] opacity-80 transform -rotate-2 shadow-sm"></div>

                     <div className="md:bg-black/5 md:p-1 mb-4 rounded-xl overflow-hidden md:rounded-none">
                        <div className="aspect-[4/3] md:aspect-[4/3] overflow-hidden relative md:grayscale-[0.1] group-hover:grayscale-0 transition-all rounded-xl md:rounded-none">
                            <AIImage 
                                prompt={post.imagePrompt} 
                                alt={post.title}
                                className="w-full h-full object-cover"
                                aspectRatio="4:3"
                            />
                            <div className="absolute bottom-0 left-0 bg-white/90 px-3 py-1 text-xs font-bold text-ac-brown rounded-tr-lg">
                                {post.date}
                            </div>
                        </div>
                     </div>

                     <div className="md:px-2 text-left md:text-center">
                        <div className="mb-2 flex md:justify-center">
                            <span className="inline-block bg-ac-green/10 text-ac-green text-[10px] font-black px-2 py-0.5 rounded-full">
                                {post.category}
                            </span>
                        </div>
                        <h3 className="font-display font-black text-lg md:text-lg text-ac-darkBrown leading-tight mb-2 group-hover:text-ac-blue line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-xs md:text-xs text-ac-brown line-clamp-2 leading-relaxed font-medium opacity-80">
                            {post.excerpt}
                        </p>
                     </div>
                  </div>
               ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="relative z-10 mt-auto mx-auto bg-white p-4 md:transform md:rotate-1 shadow-md max-w-md w-full rounded-xl md:rounded-none border-2 border-ac-cream md:border-none"
                     style={{ clipPath: window.innerWidth >= 768 ? 'polygon(0 0, 100% 0, 100% 95%, 98% 100%, 95% 95%, 92% 100%, 89% 95%, 86% 100%, 83% 95%, 80% 100%, 77% 95%, 74% 100%, 71% 95%, 68% 100%, 65% 95%, 62% 100%, 59% 95%, 56% 100%, 53% 95%, 50% 100%, 47% 95%, 44% 100%, 41% 95%, 38% 100%, 35% 95%, 32% 100%, 29% 95%, 26% 100%, 23% 95%, 20% 100%, 17% 95%, 14% 100%, 11% 95%, 8% 100%, 5% 95%, 2% 100%, 0 95%)' : 'none' }}>
                    <div className="flex justify-center items-center gap-4">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`font-bold ${currentPage === 1 ? 'text-gray-300' : 'text-ac-brown hover:text-ac-blue'}`}
                        >
                            &larr; PREV
                        </button>
                        
                        <div className="flex gap-2 text-sm font-black text-ac-darkBrown">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        currentPage === i + 1 
                                        ? 'bg-ac-yellow border-2 border-ac-orange' 
                                        : 'hover:bg-gray-100'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`font-bold ${currentPage === totalPages ? 'text-gray-300' : 'text-ac-brown hover:text-ac-blue'}`}
                        >
                            NEXT &rarr;
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
