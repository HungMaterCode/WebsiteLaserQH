'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Cpu, Wind, Layers, Radio, Zap, Star } from 'lucide-react';
import { ArsenalDetailModal } from '@/components/modals/ArsenalDetailModal';
import { smoothScrollTo } from '@/lib/scrollUtils';

const services = [
  { icon: Radio, title: 'Hệ Thống Laser Mapping 3D', subtitle: 'Professional Laser Systems', description: 'Laser RGB full-color, 3D beam projection, pattern laser và atmospheric effects. Từ 10W đến 60W với độ chính xác tuyệt đối.', features: ['Laser RGB 3D Full-Color', 'Pattern & Logo Projection', 'Laser-to-Fog Atmospheric', 'IP65/67 Outdoor Ready', 'ILDA & DMX Compatible'], image: '/image_website/Anh_dich_vu_1a.jpg', color: '#00FF88', colorDim: 'rgba(0,255,136,0.1)', tag: 'LASER', gallery: ['/image_website/Anh_dich_vu_1b.jpg', '/image_website/Anh_dich_vu_1c.jpg', '/image_website/Anh_dich_vu_1d.jpg'] },
  { icon: Layers, title: 'Hệ Thống Kinetic Lighting', subtitle: 'Kinetic Moving Light Systems', description: 'Hàng trăm đèn kinetic bay đồng bộ, tạo hình nghệ thuật trong không gian 3D. Hiệu ứng độc đáo chỉ có tại Việt Nam.', features: ['200+ Kinetic Moving Lights', 'Programmable Flight Sequences', 'Synchronized Choreography', 'Winch & Motor Control', 'Custom Shape Formation'], image: '/image_website/Anh_dich_vu_2a.jpg', color: '#00E5FF', colorDim: 'rgba(0,229,255,0.1)', tag: 'KINETIC', gallery: ['/image_website/Anh_dich_vu_2b.jpg', '/image_website/Anh_dich_vu_2c.jpg', '/image_website/Anh_dich_vu_2d.jpg'] },
  { icon: Zap, title: 'Moving Head Professional', subtitle: 'Concert & Stage Lighting', description: 'Hệ thống đèn Moving Head công suất lớn (Beam, Spot, Wash) tạo luồng sáng mạnh mẽ và hiệu ứng sân khấu chuyên nghiệp.', features: ['High-Power Beam & Spot', 'Pixel-Mapped Wash Lights', 'Synchronized Pan/Tilt', 'Concert-Grade Optics', 'RDM Technical Support'], image: '/image_website/Anh_dich_vu_3a.jpg', color: '#FF006E', colorDim: 'rgba(255,0,110,0.1)', tag: 'LIGHTING', gallery: ['/image_website/Anh_dich_vu_3b.jpg', '/image_website/Anh_dich_vu_3c.jpg', '/image_website/Anh_dich_vu_3d.jpg'] },
  { icon: Wind, title: 'Special Effects (SFX)', subtitle: 'Atmospheric & Pyro Effects', description: 'CO2 jets, haze machines, confetti cannons, cryo và low-lying fog. Nâng tầm cảm xúc cho mọi khoảnh khắc.', features: ['CO2 & Cryo Jet Effects', 'Haze & Fog Machines', 'Confetti & Pyro Cannons', 'Low-Lying Fog System', 'Safe for Indoor & Outdoor'], image: '/image_website/Anh_dich_vu_4a.jpg', color: '#007BFF', colorDim: 'rgba(0,123,255,0.1)', tag: 'EFFECTS', gallery: ['/image_website/Anh_dich_vu_4b.jpg', '/image_website/Anh_dich_vu_4c.jpg', '/image_website/Anh_dich_vu_4d.PNG'] },
  { icon: Cpu, title: 'Lập Trình & Điều Khiển Show', subtitle: 'Show Programmer & Control', description: 'Kỹ thuật viên chuyên nghiệp với grandMA3 console, lập trình đồng bộ toàn bộ show theo từng beat nhạc.', features: ['grandMA3 Console', 'Timecode Synchronization', 'MIDI & OSC Integration', 'Pre-programmed Cue Library', '24/7 Technical Support'], image: '/image_website/laptrinhlaser.jpg', color: '#BF00FF', colorDim: 'rgba(191,0,255,0.1)', tag: 'PROGRAMMER', gallery: ['/image_website/Anh_dich_vu_4c.jpg', '/image_website/Anh_dich_vu_4b.jpg', '/image_website/hinhdep.jpg'] },
  { icon: Star, title: 'Tư Vấn & Thiết Kế Concept', subtitle: 'Technical Consulting & Concept Design', description: 'Tư vấn giải pháp kỹ thuật toàn diện và thiết kế concept Visual / Lighting cho các buổi ra mắt sản phẩm, brand activation và không gian trải nghiệm.', features: ['Technical Solution Consulting', 'Creative Concept Development', 'Immersive Experience Design', '3D Visual Motion Mapping', 'Brand Activation Strategy'], image: '/image_website/6a.jpg', color: '#FFD700', colorDim: 'rgba(255,215,0,0.1)', tag: 'DESIGN', gallery: ['/image_website/6b.jpg', '/image_website/6c.jpg', '/image_website/6d.jpg'] },
];

function ServiceCard({ service, index, onClick }: { service: typeof services[0]; index: number; onClick: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = service.icon;

  return (
    <motion.div
      id={`service-${service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
      initial="initial"
      whileHover="hover"
      className="group cursor-pointer h-full"
      onClick={onClick}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 40 }}
        variants={{
          hover: {
            y: -8,
            borderColor: service.color,
            boxShadow: `0 0 40px ${service.colorDim}, 0 20px 60px rgba(0,0,0,0.5)`,
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
        className="relative card-laser rounded-2xl overflow-hidden h-full border"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={service.image || 'https://images.unsplash.com/photo-1772078822311-02f078eb34ed?w=800&q=80'}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-600"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)' }} />
          <div className="absolute top-3 left-3">
            <span style={{ background: service.colorDim, border: `1px solid ${service.color}40`, color: service.color, fontSize: '0.62rem', fontFamily: 'var(--font-body), sans-serif', fontWeight: 700, letterSpacing: '0.12em', padding: '3px 10px', borderRadius: '999px' }}>{service.tag}</span>
          </div>

          {/* Laser Line Hover Effect */}
          <motion.div
            variants={{
              initial: { opacity: 0, scaleX: 0 },
              hover: { opacity: 1, scaleX: 1 }
            }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-20"
            style={{ background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }}
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: service.colorDim, border: `1px solid ${service.color}30` }}>
              <Icon size={16} style={{ color: service.color }} />
            </div>
            <div>
              <h3 className="text-white font-header" style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>{service.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontFamily: "var(--font-body), sans-serif", letterSpacing: '0.05em' }}>{service.subtitle}</p>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', fontFamily: "var(--font-body), sans-serif", lineHeight: 1.7, marginBottom: '1rem' }}>{service.description}</p>
          <ul className="space-y-1.5">
            {service.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: service.color }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontFamily: "var(--font-body), sans-serif" }}>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-50px' });

  return (
    <section id="services" className="relative py-16 sm:py-24 responsive-section" style={{ background: '#000' }}>
      <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.3), rgba(0,229,255,0.2), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.2), rgba(0,255,136,0.15), transparent)' }} />
      <div className="max-w-7xl mx-auto">
        <motion.div
          id="services-title"
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="mb-4" style={{ color: 'var(--neon-green)', fontVariantCaps: 'all-small-caps', letterSpacing: '0.15em', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
            — Dịch Vụ Cốt Lõi —
          </p>
          <h2 className="text-white mb-5 font-body" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1 }}>
            Vũ Khí Ánh Sáng
            <span className="block" style={{ background: 'linear-gradient(135deg, #00FF88, #00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', padding: '0.1em 0' }}>Trong Kho Arsenal Của Chúng Tôi</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', fontFamily: "var(--font-body), sans-serif", maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
            Thiết bị nhập khẩu chính hãng, được bảo trì định kỳ và vận hành bởi đội ngũ kỹ thuật hàng đầu.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              onClick={() => {
                setSelectedService(service);
              }}
            />
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: titleInView ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-14 text-center">
          <a href="#contact" onClick={(e) => { e.preventDefault(); smoothScrollTo('contact'); }} className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-header transition-all duration-300 btn-glow-green" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.44 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            Tư Vấn Dịch Vụ Phù Hợp
          </a>
        </motion.div>
      </div>

      <ArsenalDetailModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />
    </section>
  );
}
