'use client';

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export function SEO({ 
  title, 
  description = 'Cage Riot - Modern music rights management dashboard for managing releases, artists, royalties, and payouts.',
  keywords = 'music rights, royalties, music management, artist management, payout tracking',
  ogImage = '/og-image.png'
}: SEOProps) {
  const fullTitle = title.includes('Cage Riot') ? title : `${title} | Cage Riot`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content="#ff0050" />
    </Helmet>
  );
}
