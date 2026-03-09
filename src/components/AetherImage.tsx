import React, { useState } from 'react';
import { getAetherAssetUrl, AssetCategory } from '../utils/assets';

interface AetherImageProps {
  category: AssetCategory;
  filename: string;
  alt: string;
  className?: string;
}

export function AetherImage({ category, filename, alt, className = '' }: AetherImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const src = getAetherAssetUrl(category, filename);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-ash-grey/10 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-astral-gold/50 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 bg-obsidian border border-ash-grey/20 flex items-center justify-center">
          <div className="w-12 h-12 border border-dashed border-ash-grey/30 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-ash-grey/20 rotate-45"></div>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
