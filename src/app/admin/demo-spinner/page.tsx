'use client';

import React, { useState } from 'react';
import { LaserLoader } from '@/components/ui/LaserLoader';
import { LayoutDashboard, Save, Upload, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DemoSpinnerPage() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const simulateLoading = (id: string, duration = 3000) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }, duration);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white p-8 font-body">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#00FF88] text-xs font-bold tracking-[0.2em] uppercase mb-2">
              <span className="w-8 h-px bg-[#00FF88]/30" />
              UI System
            </div>
            <h1 className="text-3xl font-black italic tracking-tight">LASER SPINNER DEMO</h1>
            <p className="text-white/40 text-sm mt-1">Hệ thống hiệu ứng loading tia Laser cao cấp</p>
          </div>
          <Link 
            href="/admin" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            <ArrowLeft size={16} /> Quay lại Admin
          </Link>
        </div>

        {/* Variances */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
            1. Các biến thể kích thước (Sizes)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-10 rounded-3xl bg-white/[0.02] border border-white/5">
            {[
              { id: 'xs', label: 'Extra Small' },
              { id: 'sm', label: 'Small' },
              { id: 'md', label: 'Medium' },
              { id: 'lg', label: 'Large' },
              { id: 'xl', label: 'Extra Large' },
            ].map((v) => (
              <div key={v.id} className="flex flex-col items-center gap-4">
                <div className="h-20 flex items-center justify-center">
                  <LaserLoader size={v.id as any} color="#00FF88" />
                </div>
                <span className="text-[0.65rem] font-bold text-white/30 uppercase tracking-widest">{v.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Button Integration */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
            2. Tích hợp vào Button
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
            {/* Save Button */}
            <button
              onClick={() => simulateLoading('save')}
              disabled={loadingStates['save']}
              className="relative h-14 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 group overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.1))',
                border: '1px solid rgba(0,255,136,0.3)',
                color: '#00FF88',
                cursor: loadingStates['save'] ? 'not-allowed' : 'pointer',
              }}
            >
              {loadingStates['save'] ? (
                <LaserLoader size="sm" />
              ) : (
                <>
                  <Save size={18} />
                  <span className="font-bold uppercase text-[0.8rem] tracking-wider">Lưu Thay Đổi</span>
                </>
              )}
            </button>

            {/* Upload Button */}
            <button
              onClick={() => simulateLoading('upload')}
              disabled={loadingStates['upload']}
              className="relative h-14 rounded-xl flex items-center justify-center gap-3 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                cursor: loadingStates['upload'] ? 'not-allowed' : 'pointer',
              }}
            >
              {loadingStates['upload'] ? (
                <LaserLoader size="sm" color="#fff" />
              ) : (
                <>
                  <Upload size={18} className="text-[#00E5FF]" />
                  <span className="font-bold uppercase text-[0.8rem] tracking-wider">Tải lên từ máy tính</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Section Global Loader */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BF00FF]" />
            3. Trình diễn trong khung nội dung
          </h2>
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-6 group">
            {/* Visual grid background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <LaserLoader size="lg" color="#BF00FF" />
            
            <div className="text-center z-10">
              <div className="text-[#BF00FF] font-black italic text-xl mb-1">LOADING LASERQH...</div>
              <p className="text-white/20 text-xs tracking-widest uppercase">Đang kết nối đến cơ sở dữ liệu Laser Việt</p>
            </div>

            {/* Neon corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#BF00FF]/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#BF00FF]/20 rounded-br-3xl" />
          </div>
        </section>

        {/* Footer info */}
        <div className="pt-10 text-center text-white/10 text-[0.6rem] uppercase tracking-[0.3em]">
          Designed by Antigravity AI · Website Laser QH Admin UI
        </div>
      </div>
    </div>
  );
}
