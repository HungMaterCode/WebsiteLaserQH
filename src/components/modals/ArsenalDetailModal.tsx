'use client';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Layers, Zap, Star, MessageSquare } from 'lucide-react';
import { smoothScrollTo } from '@/lib/scrollUtils';

interface ArsenalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

export function ArsenalDetailModal({ isOpen, onClose, service }: ArsenalDetailModalProps) {
  // Use a state to manage the list of 3 thumbnails and the main image
  const [mainImage, setMainImage] = (typeof window !== 'undefined') ?
    // eslint-disable-next-line react-hooks/rules-of-hooks
    require('react').useState(service?.image) : [service?.image, () => { }];

  const [thumbnails, setThumbnails] = (typeof window !== 'undefined') ?
    // eslint-disable-next-line react-hooks/rules-of-hooks
    require('react').useState(service?.gallery?.slice(0, 3) || []) : [[], () => { }];

  // Sync state when service changes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  require('react').useEffect(() => {
    if (service) {
      setMainImage(service.image);
      setThumbnails(service.gallery?.slice(0, 3) || [service.image, service.image, service.image]);
    }
  }, [service]);

  // Lock scroll when modal is open
  // eslint-disable-next-line react-hooks/rules-of-hooks
  require('react').useEffect(() => {
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

    // Swap animation/logic
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
          className="fixed inset-0 z-[200] flex flex-col items-center justify-start p-0 overflow-y-auto scrollbar-hide"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={onClose}
        >
          {/* Background Immersive Layer */}
          <div className="fixed inset-0 z-0 text-white pointer-events-none">
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1.5 }}
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${mainImage || service.image})`,
                filter: 'blur(80px) saturate(1.5) brightness(0.4)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-7xl relative z-10 flex flex-col md:flex-row items-start justify-start p-5 sm:p-8 md:p-16 lg:p-20 m-auto md:my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Detached Floating */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className="fixed top-4 right-4 sm:top-6 sm:right-6 md:absolute md:top-8 md:right-8 z-[210] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/10 border border-white/20 text-white hover:text-white hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-2xl group shadow-2xl"
              >
                <X size={20} className="sm:size-6 group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>

            {/* Layout Grid: Asymmetric & Dynamic */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center lg:items-center">

              {/* Left Column: Visual Display (Occupies 5 cols) */}
              <div className="lg:col-span-5 relative group">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="relative"
                >
                  {/* Outer Frame Accessory */}
                  <div className="absolute -inset-4 border border-white/5 rounded-[2.5rem] pointer-events-none" />
                  <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: service.color }} />
                  <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: service.color }} />

                  {/* Sharp Hero Image */}
                  <div className="relative aspect-[4/3] sm:aspect-[3/4] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] border border-white/10 mb-5 lg:mb-6">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={mainImage}
                        src={mainImage || service.image}
                        alt={service.title}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-cover saturate-[1.2] brightness-[1.05] group-hover:scale-105 transition-transform duration-1000"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Tier Label */}
                    <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                    <span className="font-header font-black text-[0.6rem] tracking-[0.4em] text-white/40 uppercase mb-2 block">CẤP ĐỘ DỊCH VỤ</span>
                    <div className="flex items-end justify-between">
                      <h4 className="text-white font-header font-black text-2xl tracking-widest uppercase">
                        Cấp độ <span style={{ color: service.color }}>{service.tag || 'PRO'}</span>
                      </h4>
                    </div>
                    </div>
                  </div>

                  {/* 3 Small Gallery Images Underneath */}
                  <div className="grid grid-cols-3 gap-3 md:gap-4 px-2">
                    {thumbnails.map((img: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        onClick={() => handleSwap(i)}
                        className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer transition-all hover:scale-105 active:scale-95 group/thumb shadow-lg hover:border-white/40 active:ring-2"
                        style={{ borderColor: service.color + '40' } as any}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover opacity-60 group-hover/thumb:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Information (Occupies 7 cols) */}
              <div className="lg:col-span-7 relative">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative flex flex-col gap-8 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white/[0.04] border backdrop-blur-2xl overflow-hidden group/glass shadow-[0_0_80px_rgba(0,0,0,0.5)]"
                  style={{ borderColor: service.color + '40' }}
                >
                  {/* Decorative Laser Accent - Left Side (Always Visible) */}
                  <div className="absolute top-0 left-0 bottom-0 w-[3px] opacity-100"
                    style={{ 
                      background: `linear-gradient(180deg, transparent, ${service.color}, transparent)`,
                      boxShadow: `2px 0 15px ${service.color}40`
                    }} />
                  
                  {/* Decorative corner glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
                    style={{ background: service.color }} />
                  
                  {/* Header Section */}
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 font-header">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: service.color }} />
                      <span className="text-white/50 text-[0.65rem] font-bold tracking-[0.2em] uppercase">{service.subtitle}</span>
                    </div>

                    <h2 className="text-white font-header font-black text-3xl sm:text-5xl lg:text-7xl mb-6 tracking-tighter leading-[0.95] sm:leading-[0.9] uppercase">
                      {service.title.split(' ').map((word: string, i: number) => (
                        <span key={i} className={i === 0 ? 'text-white' : ''} style={{ color: i > 1 ? service.color : undefined }}>
                          {word}{' '}
                        </span>
                      ))}
                    </h2>

                    <p 
                      className="text-white/50 text-[1.1rem] leading-relaxed font-body max-w-xl transition-colors hover:text-white/70"
                      style={{ textAlign: 'justify' }}
                    >
                      {service.description} Chúng tôi nâng tầm sự kiện của bạn bằng những giải pháp kỹ thuật tinh xảo và ánh sáng đậm chất nghệ thuật.
                    </p>
                  </div>

                  {/* Data Grid Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Floating Specs Card */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden group/card"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:opacity-30 transition-opacity">
                        <service.icon size={64} style={{ color: service.color }} />
                      </div>
                      <h4 className="text-white/30 text-[0.6rem] font-black font-header tracking-[0.3em] mb-4 uppercase">Thông số nổi bật</h4>
                      <ul className="space-y-3">
                        {service.features.map((feat: string, i: number) => (
                          <li key={i} className="flex items-center gap-3">
                            <Check size={14} style={{ color: service.color }} />
                            <span className="text-white/60 text-[0.85rem] font-medium font-body">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Indicators Panel */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-col gap-4"
                    >
                      {[
                        { icon: Layers, label: 'Khả năng mở rộng', desc: 'Độ phủ linh hoạt', value: 'Cao' },
                        { icon: Zap, label: 'Hiệu suất', desc: 'Phản hồi đồng bộ', value: '0.01ms' },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                              <item.icon size={18} className="text-white/40" />
                            </div>
                            <div>
                              <div className="text-white/80 text-[0.75rem] font-bold font-header tracking-widest uppercase">{item.label}</div>
                              <div className="text-white/30 text-[0.65rem] font-medium font-body">{item.desc}</div>
                            </div>
                          </div>
                          <div className="text-[0.75rem] font-bold font-header" style={{ color: service.color }}>{item.value}</div>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Action Dock */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 flex flex-col sm:flex-row items-center gap-6"
                  >
                      <button
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            smoothScrollTo('contact', 1200);
                          }, 100);
                        }}
                        className="w-full lg:w-auto px-10 sm:px-12 py-4 sm:py-5 rounded-full font-header font-black tracking-[0.2em] sm:tracking-[0.3em] text-[0.7rem] sm:text-[0.8rem] transition-all bg-white text-black hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 group"
                      >
                        LIÊN HỆ TƯ VẤN
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </button>

                    <button
                      onClick={onClose}
                      className="flex items-center gap-3 group text-white/30 hover:text-white transition-colors text-[0.7rem] font-bold font-header tracking-[0.3em] uppercase"
                    >
                      HOẶC QUAY LẠI
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Tech Details Decoration */}
            <div className="absolute bottom-8 left-12 right-12 hidden lg:flex items-center justify-between pointer-events-none opacity-20">
              <div className="text-[0.5rem] font-mono text-white/50 tracking-widest uppercase">
                Design Architecture v4.0.0 // Kinetic Core // Laser Precision
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-[1px] bg-white/20" />
                <div className="w-24 h-[1px] bg-white/40" />
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
