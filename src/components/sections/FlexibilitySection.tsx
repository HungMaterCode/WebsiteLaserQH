'use client';
import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { CheckCircle, Heart, Zap, Star, ArrowRight } from 'lucide-react';
import { DetailInfoModal } from '@/components/modals/DetailInfoModal';

const tiers = [
  {
    id: 'vip', icon: Heart, label: 'VIP / Private', title: 'Sự Kiện Trình Diễn Riêng Tư',
    subtitle: 'Showcase riêng, Ra mắt thương hiệu, Trình diễn VIP',
    description: 'Mang đẳng cấp concert vào không gian riêng của bạn. Hệ thống laser nghệ thuật, sân khấu chuyển động và biên đạo ánh sáng kinetic được lập trình theo từng khoảnh khắc trình diễn.',
    scale: '50 – 1,000 khách',
    features: ['Thiết kế ánh sáng tùy chỉnh hoàn toàn', 'Laser RGB pattern & atmospheric', 'Kinetic moving lights lập trình theo nhạc', 'Kỹ thuật viên chuyên nghiệp suốt sự kiện', 'Tư vấn concept miễn phí'],
    image: '/image_website/Anh_Quy_Mo_Vip.JPG',
    color: '#00FF88', colorDim: 'rgba(0,255,136,0.10)',
    gradient: 'linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,255,136,0.02))',
    borderColor: 'rgba(0,255,136,0.28)', glowColor: 'rgba(0,255,136,0.18)', badge: 'Mọi Ngân Sách',
  },
  {
    id: 'medium', icon: Zap, label: 'Medium / Club', title: 'Sự Kiện Tầm Trung',
    subtitle: 'Nightclub, Brand Activation, Music Show',
    description: 'Sức mạnh hệ thống concert thu nhỏ vào không gian trung bình. Tác động thị giác tối đa, ngân sách hợp lý.',
    scale: '1,000 – 10,000 khách',
    features: ['Hệ thống laser medium-scale chuyên nghiệp', 'Moving head beams & wash lights', 'Kinetic truss & LED bar system', 'Programming show cue theo setlist', 'Dự phòng thiết bị backup đầy đủ'],
    image: '/image_website/Anh_Quy_Mo_Medium.JPG',
    color: '#BF00FF', colorDim: 'rgba(191,0,255,0.12)',
    gradient: 'linear-gradient(135deg, rgba(191,0,255,0.15), rgba(191,0,255,0.03))',
    borderColor: 'rgba(191,0,255,0.3)', glowColor: 'rgba(191,0,255,0.2)', badge: 'Phổ Biến Nhất', featured: true,
  },
  {
    id: 'mega', icon: Star, label: 'Mega Concert', title: 'Đại Nhạc Hội',
    subtitle: 'Festival, Stadium, Live Concert Quốc Tế',
    description: 'Chúng tôi xây dựng nên danh tiếng từ những đêm nhạc lịch sử. Công nghệ laser & kinetic đỉnh cao nhất Việt Nam.',
    scale: '10,000 – 50,000+ khách',
    features: ['Full-scale laser 3D & sky effect system', '200+ kinetic moving lights đồng bộ', 'Outdoor weatherproof IP67 ready', 'Real-time DMX programming show', 'Đội kỹ thuật 20+ chuyên gia'],
    image: '/image_website/Anh_Quy_Mo_Mega.JPG',
    color: '#00E5FF', colorDim: 'rgba(0,229,255,0.12)',
    gradient: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,229,255,0.03))',
    borderColor: 'rgba(0,229,255,0.3)', glowColor: 'rgba(0,229,255,0.2)', badge: 'Đẳng Cấp Số 1',
  },
];

function TierCard({ tier, index, onClick }: { tier: typeof tiers[0]; index: number; onClick: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = tier.icon;

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="group cursor-pointer relative h-full"
      onClick={onClick}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
        variants={{
          hover: {
            y: -8,
            borderColor: tier.color,
            boxShadow: `0 0 40px ${tier.glowColor}, 0 20px 60px rgba(0,0,0,0.5)`,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 25
            }
          }
        }}
        transition={{
          duration: 0.5,
          delay: (index % 3) * 0.1
        }}
        className="relative rounded-2xl overflow-hidden card-laser h-full border"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderColor: tier.borderColor
        }}
        whileTap={{ scale: 0.98 }}
      >
        {tier.featured && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full" style={{ background: tier.gradient, border: `1px solid ${tier.borderColor}`, fontSize: '0.65rem', fontFamily: 'var(--font-body), sans-serif', fontWeight: 700, color: tier.color, letterSpacing: '0.05em' }}>
            ★ {tier.badge}
          </div>
        )}
        <div className="relative h-52 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tier.image || 'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=600&q=80'}
            alt={tier.title}
            className="w-full h-full object-cover transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }} />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-white" style={{ background: tier.colorDim, border: `1px solid ${tier.borderColor}`, fontSize: '0.65rem', fontFamily: 'var(--font-body), sans-serif', fontWeight: 700, letterSpacing: '0.08em' }}>
              {tier.label.toUpperCase()}
            </span>
          </div>

          {/* Laser Line Hover Effect - Moved to the base of the image container */}
          <motion.div
            variants={{
              initial: { opacity: 0, scaleX: 0 },
              hover: { opacity: 1, scaleX: 1 }
            }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-0 right-0 h-[1.5px] pointer-events-none z-20"
            style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }}
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden" style={{ background: tier.gradient, border: `1px solid ${tier.borderColor}` }}>
              <Icon size={22} style={{ color: tier.color }} />
              <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at center, ${tier.color}, transparent)` }} />
            </div>
            <div>
              <span style={{ color: tier.color, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', fontFamily: 'var(--font-body)' }}>{tier.label.toUpperCase()}</span>
              <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'var(--font-vietnam)' }}>{tier.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'Inter', lineHeight: 1.4 }}>{tier.subtitle}</p>
            </div>

          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 mt-2" style={{ background: tier.colorDim, border: `1px solid ${tier.borderColor}` }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: tier.color }} />
            <span style={{ color: tier.color, fontSize: '0.72rem', fontFamily: 'Inter', fontWeight: 600 }}>{tier.scale}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontFamily: 'Inter', lineHeight: 1.7, marginBottom: '1.25rem', textAlign: 'justify' }}>{tier.description}</p>
          <ul className="space-y-2">
            {tier.features.slice(0, 3).map((feat, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle size={13} style={{ color: tier.color, flexShrink: 0, marginTop: 3 }} />
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontFamily: 'Inter', lineHeight: 1.5 }}>{feat}</span>
              </li>
            ))}
            {tier.features.length > 3 && (
              <li className="text-[0.7rem] font-bold text-white/20 font-body mt-2 tracking-widest">+ {tier.features.length - 3} ĐẶC ĐIỂM KHÁC</li>
            )}
          </ul>
          <div className="mt-8 flex items-center justify-between">
            <span style={{ color: tier.color, fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-body)' }}>BẤM ĐỂ XEM CHI TIẾT</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/5 group-hover:bg-white/10 group-active:scale-90" style={{ border: `1px solid ${tier.borderColor}` }}>
              <ArrowRight size={14} style={{ color: tier.color }} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FlexibilitySection() {
  const [selectedTier, setSelectedTier] = useState<typeof tiers[0] | null>(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-50px' });

  return (
    <section id="flexibility" className="relative py-16 sm:py-24 responsive-section" style={{ background: 'linear-gradient(180deg, #000 0%, #030510 50%, #000 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto">
        <motion.div ref={titleRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : 30 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="mb-4" style={{ color: 'var(--neon-green)', fontVariantCaps: 'all-small-caps', letterSpacing: '0.15em', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
            — Sự Linh Hoạt Của Chúng Tôi —
          </p>
          <h2 className="text-white mb-6 font-body" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Chúng Tôi Làm Được
            <span style={{ display: 'block', background: 'linear-gradient(135deg, #00FF88, #00E5FF, #BF00FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', padding: '0.2em 0' }}>
              Tất Cả Quy Mô
            </span>
          </h2>
          <p className="mx-auto font-body" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(1rem, 2vw, 1.1rem)', lineHeight: 1.8, maxWidth: '640px' }}>
            Chúng tôi không chỉ làm concert lớn. Cùng một thiết bị đỉnh cao, cùng đội chuyên gia đã chinh phục những sân khấu lịch sử —
            <strong style={{ color: '#00FF88' }}> nay sẵn sàng cho sự kiện của bạn, dù nhỏ hay lớn.</strong>
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <TierCard
              key={tier.id}
              tier={tier}
              index={index}
              onClick={() => setSelectedTier(tier)}
            />
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: titleInView ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-14 text-center">
          <div className="inline-block px-8 py-4 rounded-2xl" style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.12)' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.9rem', lineHeight: 1.7 }}>
              <span style={{ color: '#00FF88', fontWeight: 600 }}>Cùng một thiết bị. Cùng chuyên môn.</span>{' '}Được scale theo đúng quy mô và ngân sách sự kiện của bạn.
            </p>
          </div>
        </motion.div>
      </div>

      <DetailInfoModal
        isOpen={!!selectedTier}
        onClose={() => setSelectedTier(null)}
        type="tier"
        data={selectedTier}
      />
    </section>
  );
}
