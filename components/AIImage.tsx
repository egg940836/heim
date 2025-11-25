
import React, { useState, useEffect } from 'react';

interface AIImageProps {
  src?: string; // Direct URL or Base64
  prompt?: string; // Kept for Alt text or future metadata
  alt: string;
  className?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "3:4" | "9:16";
  staticImage?: string; // Explicit static asset
}

export const AIImage: React.FC<AIImageProps> = ({ src, prompt, alt, className, aspectRatio = "16:9", staticImage }) => {
  const [imageSource, setImageSource] = useState<string | null>(null);

  useEffect(() => {
    if (staticImage) {
      setImageSource(staticImage);
    } else if (src && src.length > 0) {
      setImageSource(src);
    } else {
      setImageSource(null);
    }
  }, [src, staticImage]);

  // Calculate aspect ratio padding
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "16:9": return "aspect-video";
      case "4:3": return "aspect-[4/3]";
      case "1:1": return "aspect-square";
      case "3:4": return "aspect-[3/4]";
      case "9:16": return "aspect-[9/16]";
      default: return "aspect-video";
    }
  };

  if (imageSource) {
    return (
      <img 
        src={imageSource} 
        alt={alt} 
        className={`w-full h-full object-cover ${className}`} 
        loading="lazy"
      />
    );
  }

  // Custom Heim Island Placeholder
  return (
    <div className={`w-full h-full bg-[#FFFDF0] flex flex-col items-center justify-center border-2 border-dashed border-[#D7CCC8] p-4 ${className}`}>
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#78B159]/20 rounded-full flex items-center justify-center mb-2">
            <svg viewBox="0 0 24 24" fill="#78B159" className="w-8 h-8 md:w-10 md:h-10 opacity-60">
                <path d="M12,2C7,2,3,6,3,11c0,3,2,6,5,8c-1,2-2,3-2,3s2,0,4-2c2,2,6,2,8-2C21,14,21,6,12,2z M14.5,11.5 c-1.5,1.5-4,1.5-5.5,0c-0.5-0.5-0.5-1,0-1.5s1-0.5,1.5,0c1,1,2.5,1,3.5,0c0.5-0.5,1-0.5,1.5,0S15,11,14.5,11.5z" />
                <path d="M11.3,6.3c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4c0.8,0.8,0.8,2,0,2.8c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3 s0.5-0.1,0.7-0.3C12.9,10.3,12.9,7.9,11.3,6.3z" />
            </svg>
        </div>
        <span className="text-[#7C5C38] font-bold text-xs md:text-sm text-center opacity-60">
            {prompt ? "等待照片上傳..." : "施工中..."}
        </span>
    </div>
  );
};
