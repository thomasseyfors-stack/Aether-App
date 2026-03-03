import React from 'react';

export default function AetherLogo({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="astralGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D061" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
        <radialGradient id="nebulaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6A0DAD" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#6A0DAD" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0B0C10" stopOpacity="0" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Deep Obsidian Background */}
      <circle cx="100" cy="100" r="95" fill="#0B0C10" />

      {/* Nebula Purple Glow Behind Prism */}
      <circle cx="100" cy="100" r="60" fill="url(#nebulaGlow)" filter="url(#glow)" />

      {/* Sleek Circular Gold Ouroboros Ring */}
      {/* Outer ring */}
      <circle cx="100" cy="100" r="80" stroke="url(#astralGold)" strokeWidth="2" opacity="0.8" />
      {/* Inner ring */}
      <circle cx="100" cy="100" r="72" stroke="url(#astralGold)" strokeWidth="1" opacity="0.4" />
      
      {/* Ouroboros Head/Tail detail (stylized overlap) */}
      <path d="M 100 20 A 80 80 0 0 1 105 20" stroke="#F5D061" strokeWidth="4" strokeLinecap="round" filter="url(#subtleGlow)" />
      <circle cx="100" cy="20" r="3" fill="#0B0C10" stroke="#F5D061" strokeWidth="1" />

      {/* 3D Geometric Prism (5 Facets - Pentagonal Bipyramid top view) */}
      <g transform="translate(100, 100)">
        {/* Outer Pentagon */}
        <polygon 
          points="0,-45 43,-14 26,36 -26,36 -43,-14" 
          fill="none" 
          stroke="url(#astralGold)" 
          strokeWidth="1.5" 
          filter="url(#subtleGlow)"
        />
        {/* Inner Pentagon */}
        <polygon 
          points="0,-20 19,-6 12,16 -12,16 -19,-6" 
          fill="rgba(106, 13, 173, 0.3)" 
          stroke="#F5D061" 
          strokeWidth="1" 
        />
        {/* Connecting Lines to create 3D facets */}
        <line x1="0" y1="-45" x2="0" y2="-20" stroke="url(#astralGold)" strokeWidth="1.5" />
        <line x1="43" y1="-14" x2="19" y2="-6" stroke="url(#astralGold)" strokeWidth="1.5" />
        <line x1="26" y1="36" x2="12" y2="16" stroke="url(#astralGold)" strokeWidth="1.5" />
        <line x1="-26" y1="36" x2="-12" y2="16" stroke="url(#astralGold)" strokeWidth="1.5" />
        <line x1="-43" y1="-14" x2="-19" y2="-6" stroke="url(#astralGold)" strokeWidth="1.5" />
        
        {/* Center Vertex Lines */}
        <line x1="0" y1="-20" x2="0" y2="0" stroke="#F5D061" strokeWidth="1" opacity="0.7" />
        <line x1="19" y1="-6" x2="0" y2="0" stroke="#F5D061" strokeWidth="1" opacity="0.7" />
        <line x1="12" y1="16" x2="0" y2="0" stroke="#F5D061" strokeWidth="1" opacity="0.7" />
        <line x1="-12" y1="16" x2="0" y2="0" stroke="#F5D061" strokeWidth="1" opacity="0.7" />
        <line x1="-19" y1="-6" x2="0" y2="0" stroke="#F5D061" strokeWidth="1" opacity="0.7" />

        {/* Core Glow */}
        <circle cx="0" cy="0" r="5" fill="#F5D061" filter="url(#glow)" />
      </g>
    </svg>
  );
}
