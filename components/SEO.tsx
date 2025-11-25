
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { STORE_INFO } from '../constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any> | Record<string, any>[]; // Support Structured Data for AI SEO
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  jsonLd 
}) => {
  const siteTitle = STORE_INFO.name;
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | 打造你的專屬睡眠島`;
  const metaDescription = description || "歡迎光臨海姆島！Heim Inc. 提供 100% 客製化床墊服務。由哈姆店長親自為您打造專屬睡眠方程式。";
  const metaKeywords = keywords?.join(', ') || "客製化床墊, 獨立筒, 乳膠床墊, 海姆名床, Heim Mattress";
  const siteUrl = window.location.origin;
  const currentUrl = url || window.location.href;
  const metaImage = image || "https://images.unsplash.com/photo-1505693416381-9feb5eb72a9f?w=1200&q=80&auto=format&fit=crop";

  // Default Organization JSON-LD
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": STORE_INFO.name,
    "url": siteUrl,
    "logo": `${siteUrl}/favicon.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": STORE_INFO.phone,
      "contactType": "customer service",
      "areaServed": "TW",
      "availableLanguage": "Chinese"
    },
    "sameAs": [
        STORE_INFO.lineUrl,
        STORE_INFO.googleMapsUrl
    ]
  };

  const structuredData = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [defaultSchema];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="zh_TW" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* JSON-LD Structured Data for AI/SEO */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
