'use client';

import React from 'react';

interface LaserLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export function LaserLoader({ 
  size = 'md', 
  color = '#00FF88', 
  className = '' 
}: LaserLoaderProps) {
  const sizeMap = {
    'xs': 14,
    'sm': 20,
    'md': 32,
    'lg': 48,
    'xl': 64,
  };

  const s = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: s, height: s }}>
      {/* Laser Ring */}
      <svg
        viewBox="0 0 50 50"
        style={{
          width: '100%',
          height: '100%',
          animation: 'laserRotate 1s linear infinite',
        }}
      >
        <defs>
          <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="30%" stopColor={color} stopOpacity="0.3" />
            <stop offset="60%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          <filter id="laserGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={size === 'xs' || size === 'sm' ? "1.5" : "3"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="18"
          stroke="url(#laserGradient)"
          strokeWidth={size === 'xs' || size === 'sm' ? "4" : "3"}
          fill="none"
          strokeDasharray="80 70"
          strokeLinecap="round"
          filter="url(#laserGlow)"
        />
      </svg>

      <style jsx>{`
        @keyframes laserRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
