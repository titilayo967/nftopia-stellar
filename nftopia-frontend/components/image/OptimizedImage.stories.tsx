import React from 'react';
import OptimizedImage from './OptimizedImage';

export default {
  title: 'Components/OptimizedImage',
  component: OptimizedImage,
};

export const Default = () => (
  <div style={{ width: 300 }}>
    <OptimizedImage src="/nftopia-03.svg" alt="Logo" width={120} height={40} priority />
  </div>
);

export const WithFallback = () => (
  <div style={{ width: 300 }}>
    <OptimizedImage src="/invalid-url.jpg" alt="Broken" width={120} height={80} fallbackSrc="/images/fallbacks/nft-fallback.svg" />
  </div>
);

export const Loading = () => (
  <div style={{ width: 300 }}>
    <OptimizedImage src="/nftopia-03.svg" alt="Loading" width={300} height={200} />
  </div>
);
