'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar, Users, Clock, Briefcase, Zap, Wrench, ExternalLink, MessageSquare, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'project' | 'tier';
  data: any;
}

export function DetailInfoModal({ isOpen, onClose, type, data }: ModalProps) {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto scrollbar-hide"
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-5xl rounded-3xl relative m-auto"
            style={{ 
              background: '#050912', 
              border: `1px solid ${data.color || 'rgba(255,255,255,0.1)'}30`,
              boxShadow: `0 0 50px ${data.color || '#00FF88'}15`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
            >
              <X size={18} className="sm:size-[20px]" />
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-1/2 p-6 lg:p-8">
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#0A0F1A] mb-4 shadow-2xl">
                  <img
                    src={data.image || data.heroImage || data.thumbnailImage}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[0.6rem] font-bold font-header tracking-widest backdrop-blur-md"
                    style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${data.color}60`, color: data.color }}>
                    {(data.label || data.categoryLabel || 'INFO').toUpperCase()}
                  </div>
                </div>
                
                {/* Secondary Content for Tiers: Features */}
                {type === 'tier' && data.features && (
                  <div className="grid grid-cols-1 gap-2 mt-6">
                    <h4 className="text-white/40 text-[0.65rem] font-bold tracking-[0.2em] font-header mb-2 uppercase">Tại sao nên chọn gói này?</h4>
                    {data.features.map((feat: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <CheckCircle size={14} style={{ color: data.color, marginTop: 2 }} />
                        <span className="text-white/70 text-[0.8rem] font-medium leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Secondary Content for Projects: Gallery */}
                {type === 'project' && data.gallery && data.gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {data.gallery.slice(0, 3).map((img: string, i: number) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#0A0F1A] border border-white/5 transition-transform hover:scale-105">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="lg:w-1/2 p-6 lg:p-8 lg:pl-0">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: data.color, boxShadow: `0 0 10px ${data.color}` }}></span>
                    <span className="font-header text-[0.7rem] tracking-[0.2em] font-bold" style={{ color: data.color }}>
                      {(data.eventType || data.subtitle || 'DỊCH VỤ').toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-white text-3xl font-extrabold mb-4 leading-tight" style={{ fontFamily: 'var(--font-vietnam)' }}>
                    {data.title}
                  </h2>
                  <div className="flex items-center gap-4 text-white/40 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      {type === 'project' ? <MapPin size={14} className="text-white/20" /> : <Users size={14} className="text-white/20" />} 
                      {data.location || data.scale}
                    </div>
                    {data.year && <div className="flex items-center gap-1.5"><Calendar size={14} className="text-white/20" /> {data.year}</div>}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'QUY MÔ', value: data.scale, icon: Users },
                    { label: type === 'project' ? 'KHÁCH HÀNG' : 'ƯU ĐIỂM', value: data.client || data.badge, icon: Briefcase },
                    { label: type === 'project' ? 'SETUP' : 'BẢO TRÌ', value: data.duration || '24/7 Support', icon: Clock },
                    { label: 'NỔI BẬT', value: data.highlight || 'Thiết bị xịn nhất', icon: Zap },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-3 hover:bg-white/[0.04] transition-colors">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${data.color}10`, border: `1px solid ${data.color}20` }}>
                        <stat.icon size={14} style={{ color: data.color }} />
                      </div>
                      <div>
                        <div className="text-[0.6rem] font-bold text-white/30 tracking-widest font-header mb-1">{stat.label}</div>
                        <div className="text-white/80 text-[0.8rem] font-semibold leading-tight">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-8 p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                  <h4 className="text-white/40 text-[0.65rem] font-bold tracking-[0.2em] font-header mb-3 uppercase">
                    {type === 'project' ? 'Chi tiết triển khai' : 'Tư vấn giải pháp'}
                  </h4>
                  <p className="text-white/70 text-[0.92rem] leading-relaxed" style={{ fontFamily: 'var(--font-vietnam)' }}>
                    {data.fullDescription || data.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {type === 'project' && (
                    <Link 
                      href={`/du-an/${data.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-[0.85rem] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    >
                      <ExternalLink size={15} />
                      Xem Trang SEO
                    </Link>
                  )}
                  
                  <Link 
                    href="/#contact"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-[0.85rem] font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: data.color, color: '#000', boxShadow: `0 10px 30px ${data.color}30` }}
                  >
                    <MessageSquare size={15} />
                    Liên Hệ Ngay
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
