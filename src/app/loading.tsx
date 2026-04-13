'use client';

import React from 'react';
import { LaserLoader } from '@/components/ui/LaserLoader';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#050510]">
      {/* Ambient background glow - Pulse animated via Tailwind */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full opacity-[0.05] blur-[120px] pointer-events-none bg-[#00FF88] animate-pulse"
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* The main Laser Spinner XL */}
        <div className="relative">
          <LaserLoader size="xl" color="#00FF88" />
          
          {/* Inner pulse effect */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-[0.1] scale-150 bg-[#00FF88]" />
        </div>

        {/* Loading text with shimmer */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center text-center">
            <span className="text-[#00FF88] font-bold italic text-[0.7rem] uppercase tracking-[0.4em] mb-1 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
              Loading LaserQH
            </span>
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent opacity-30 mt-2" />
          </div>
          
          <p className="text-white/20 text-[0.6rem] font-bold uppercase tracking-[0.2em] animate-pulse">
            Đang nạp năng lượng dữ liệu...
          </p>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-[#00FF88]/10 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-24 h-24 border-t border-r border-[#00FF88]/10 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-24 h-24 border-b border-l border-[#00FF88]/10 rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-[#00FF88]/10 rounded-br-3xl pointer-events-none" />
    </div>
  );
}
