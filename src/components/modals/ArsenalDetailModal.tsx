'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Layers, Zap, ArrowDown, MessageSquare } from 'lucide-react';
import { smoothScrollTo } from '@/lib/scrollUtils';

interface ArsenalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

export function ArsenalDetailModal({ isOpen, onClose, service }: ArsenalDetailModalProps) {
  const [mainImage, setMainImage] = useState<string>('');
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  // Sync state when service changes
  useEffect(() => {
    if (service) {
      setMainImage(service.image);
      setThumbnails(service.gallery?.slice(0, 3) || [service.image, service.image, service.image]);
    }
  }, [service]);

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

  const handleSwap = (index: number) => {
    const currentMain = mainImage;
    const clickedThumb = thumbnails[index];

    setMainImage(clickedThumb);
    setThumbnails((prev: string[]) => {
      const newThumbs = [...prev];
      newThumbs[index] = currentMain;
      return newThumbs;
    });
  };

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-start p-0 overflow-y-auto scrollbar-hide will-change-[opacity]"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={onClose}
        >
          {/* Background Immersive Layer - Reduced blur for performance */}
          <div className="fixed inset-0 z-0 text-white pointer-events-none overflow-hidden">
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.25 }}
              transition={{ duration: 1 }}
              className="w-full h-full bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `url(${mainImage || service.image})`,
                filter: 'blur(40px) saturate(1.2) brightness(0.3)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
          </div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-7xl relative z-10 flex flex-col md:flex-row items-start justify-start p-5 sm:p-8 md:p-16 lg:p-20 m-auto md:my-auto will-change-[transform,opacity]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[210]">
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onClose}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/10 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/40 transition-all backdrop-blur-md group"
              >
                <X size={20} className="sm:size-6 group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>
            </div>

            {/* Layout Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* Left Column: Visual Display */}
              <div className="lg:col-span-5 relative group">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative aspect-[4/3] sm:aspect-[3/4] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 mb-5 lg:mb-6">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={mainImage}
                        src={mainImage || service.image}
                        alt={service.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                      <span className="font-header font-black text-[0.6rem] tracking-[0.4em] text-white/40 uppercase mb-2 block">QUY MÔ THIẾT BỊ</span>
                      <h4 className="text-white font-header font-black text-2xl tracking-widest uppercase">
                        Cấp độ <span style={{ color: service.color }}>{service.tag || 'PRO'}</span>
                      </h4>
                    </div>
                  </div>

                  {/* Gallery */}
                  <div className="grid grid-cols-3 gap-3 md:gap-4 px-2">
                    {thumbnails.map((img: string, i: number) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSwap(i)}
                        className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer transition-all shadow-lg overflow-hidden"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Information */}
              <div className="lg:col-span-7 relative">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative flex flex-col gap-6 sm:gap-8 p-6 sm:p-10 rounded-[2rem] bg-white/[0.04] border border-white/10 backdrop-blur-lg shadow-2xl overflow-hidden"
                >
                  {/* Laser Accent */}
                  <div className="absolute top-0 left-0 bottom-0 w-[4px]"
                    style={{ background: `linear-gradient(180deg, transparent, ${service.color}, transparent)` }} />

                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 sm:mb-6">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: service.color }} />
                      <span className="text-white/40 text-[0.6rem] font-bold tracking-[0.2em] uppercase">{service.subtitle}</span>
                    </div>

                    <h2 className="text-white font-header font-black text-3xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 tracking-tighter leading-[1] uppercase">
                      {service.title}
                    </h2>

                    <p className="text-white/60 text-[1rem] leading-relaxed font-body max-w-xl">
                      {service.description} Giải pháp ánh sáng chuyên nghiệp mang lại không gian trình diễn đẳng cấp và ấn tượng.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h4 className="text-white/30 text-[0.6rem] font-black font-header tracking-[0.3em] mb-4 uppercase">Thông số nổi bật</h4>
                      <ul className="space-y-3">
                        {service.features.map((feat: string, i: number) => (
                          <li key={i} className="flex items-center gap-3">
                            <Check size={14} style={{ color: service.color }} />
                            <span className="text-white/70 text-[0.8rem] font-medium font-body">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                      {[
                        { icon: Layers, label: 'Khả năng mở rộng', value: 'Linh Hoạt' },
                        { icon: Zap, label: 'Hiệu suất', value: 'Tối Ưu' },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <item.icon size={16} className="text-white/30" />
                            <span className="text-white/80 text-[0.7rem] font-bold font-header tracking-wider uppercase">{item.label}</span>
                          </div>
                          <span className="text-[0.7rem] font-bold" style={{ color: service.color }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => {
                        onClose();
                        setTimeout(() => smoothScrollTo('contact'), 100);
                      }}
                      className="w-full sm:w-auto px-10 py-4 rounded-full font-header font-black tracking-[0.2em] text-[0.75rem] transition-all bg-white text-black hover:bg-[#00FF88] hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3 group"
                    >
                      LIÊN HỆ TƯ VẤN
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={onClose} className="text-white/30 hover:text-white transition-colors text-[0.65rem] font-bold tracking-[0.2em] uppercase">QUAY LẠI</button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
