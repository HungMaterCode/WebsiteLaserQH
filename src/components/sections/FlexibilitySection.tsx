'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'motion/react';
import { CheckCircle, Heart, Zap, Star } from 'lucide-react';

const tiers = [
  {
    id: 'vip', icon: Heart, label: 'VIP / Private', title: 'Sự Kiện Thân Mật',
    subtitle: 'Tiệc Cưới, Gala Doanh Nghiệp, Sinh Nhật VIP',
    description: 'Đẳng cấp concert tại không gian riêng của bạn. Laser tinh tế, kinetic choreography được lập trình theo từng khoảnh khắc đặc biệt.',
    scale: '50 – 1,000 khách',
    features: ['Thiết kế ánh sáng tùy chỉnh hoàn toàn','Laser RGB pattern & atmospheric','Kinetic moving lights lập trình theo nhạc','Kỹ thuật viên chuyên nghiệp suốt sự kiện','Tư vấn concept miễn phí'],
    image: 'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=600&q=80',
    color: '#00FF88', colorDim: 'rgba(0,255,136,0.10)',
    gradient: 'linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,255,136,0.02))',
    borderColor: 'rgba(0,255,136,0.28)', glowColor: 'rgba(0,255,136,0.18)', badge: 'Mọi Ngân Sách',
  },
  {
    id: 'medium', icon: Zap, label: 'Medium / Club', title: 'Sự Kiện Tầm Trung',
    subtitle: 'Nightclub, Brand Activation, Music Show',
    description: 'Sức mạnh hệ thống concert thu nhỏ vào không gian trung bình. Tác động thị giác tối đa, ngân sách hợp lý.',
    scale: '1,000 – 10,000 khách',
    features: ['Hệ thống laser medium-scale chuyên nghiệp','Moving head beams & wash lights','Kinetic truss & LED bar system','Programming show cue theo setlist','Dự phòng thiết bị backup đầy đủ'],
    image: 'https://images.unsplash.com/photo-1574154883606-19fa4f836c54?w=600&q=80',
    color: '#BF00FF', colorDim: 'rgba(191,0,255,0.12)',
    gradient: 'linear-gradient(135deg, rgba(191,0,255,0.15), rgba(191,0,255,0.03))',
    borderColor: 'rgba(191,0,255,0.3)', glowColor: 'rgba(191,0,255,0.2)', badge: 'Phổ Biến Nhất', featured: true,
  },
  {
    id: 'mega', icon: Star, label: 'Mega Concert', title: 'Đại Nhạc Hội',
    subtitle: 'Festival, Stadium, Live Concert Quốc Tế',
    description: 'Chúng tôi xây dựng nên danh tiếng từ những đêm nhạc lịch sử. Công nghệ laser & kinetic đỉnh cao nhất Việt Nam.',
    scale: '10,000 – 50,000+ khách',
    features: ['Full-scale laser 3D & sky effect system','200+ kinetic moving lights đồng bộ','Outdoor weatherproof IP67 ready','Real-time DMX programming show','Đội kỹ thuật 20+ chuyên gia'],
    image: 'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=600&q=80',
    color: '#00E5FF', colorDim: 'rgba(0,229,255,0.12)',
    gradient: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,229,255,0.03))',
    borderColor: 'rgba(0,229,255,0.3)', glowColor: 'rgba(0,229,255,0.2)', badge: 'Đẳng Cấp Số 1',
  },
];

function TierCard({ tier, index }: { tier: typeof tiers[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = tier.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative rounded-2xl overflow-hidden cursor-default group"
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${tier.borderColor}`, transition: 'all 0.4s ease' }}
      whileHover={{ y: -8, boxShadow: `0 0 40px ${tier.glowColor}, 0 20px 60px rgba(0,0,0,0.5)` }}
    >
      {tier.featured && (
        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full" style={{ background: tier.gradient, border: `1px solid ${tier.borderColor}`, fontSize: '0.65rem', fontFamily: 'Orbitron, sans-serif', color: tier.color, letterSpacing: '0.1em' }}>
          ★ {tier.badge}
        </div>
      )}
      <div className="relative h-52 overflow-hidden">
        <Image src={tier.image} alt={tier.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }} />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full" style={{ background: tier.colorDim, border: `1px solid ${tier.borderColor}`, color: tier.color, fontSize: '0.65rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.12em' }}>
            {tier.label.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: tier.colorDim, border: `1px solid ${tier.borderColor}` }}>
            <Icon size={20} style={{ color: tier.color }} />
          </div>
          <div>
            <h3 className="font-orbitron text-white mb-1" style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>{tier.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'Inter', lineHeight: 1.4 }}>{tier.subtitle}</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4" style={{ background: tier.colorDim, border: `1px solid ${tier.borderColor}` }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: tier.color }} />
          <span style={{ color: tier.color, fontSize: '0.72rem', fontFamily: 'Inter', fontWeight: 600 }}>{tier.scale}</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontFamily: 'Inter', lineHeight: 1.7, marginBottom: '1.25rem' }}>{tier.description}</p>
        <ul className="space-y-2">
          {tier.features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle size={13} style={{ color: tier.color, flexShrink: 0, marginTop: 3 }} />
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', fontFamily: 'Inter', lineHeight: 1.5 }}>{feat}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)`, opacity: 0.4 }} />
      </div>
    </motion.div>
  );
}

export function FlexibilitySection() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-50px' });

  return (
    <section id="flexibility" className="relative py-24 px-4 sm:px-6" style={{ background: 'linear-gradient(180deg, #000 0%, #030510 50%, #000 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto">
        <motion.div ref={titleRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : 30 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="section-eyebrow mb-4">— Sự Linh Hoạt Của Chúng Tôi —</p>
          <h2 className="font-orbitron text-white mb-6" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.2 }}>
            Chúng Tôi Làm Được
            <span style={{ display: 'block', background: 'linear-gradient(135deg, #00FF88, #00E5FF, #BF00FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Tất Cả Quy Mô
            </span>
          </h2>
          <p className="mx-auto" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', fontFamily: "'Be Vietnam Pro', sans-serif", lineHeight: 1.8, maxWidth: '640px' }}>
            Chúng tôi không chỉ làm concert lớn. Cùng một thiết bị đỉnh cao, cùng đội chuyên gia đã chinh phục những sân khấu lịch sử —
            <strong style={{ color: '#00FF88' }}> nay sẵn sàng cho sự kiện của bạn, dù nhỏ hay lớn.</strong>
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (<TierCard key={tier.id} tier={tier} index={index} />))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: titleInView ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-14 text-center">
          <div className="inline-block px-8 py-4 rounded-2xl" style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.12)' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.9rem', lineHeight: 1.7 }}>
              <span style={{ color: '#00FF88', fontWeight: 600 }}>Cùng một thiết bị. Cùng chuyên môn.</span>{' '}Được scale theo đúng quy mô và ngân sách sự kiện của bạn.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
