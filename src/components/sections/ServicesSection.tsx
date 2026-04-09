'use client';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Lightbulb, Triangle, Cpu, Wind, Layers, Radio } from 'lucide-react';

const services = [
  { icon: Radio, title: 'Hệ Thống Laser Chuyên Nghiệp', subtitle: 'Professional Laser Systems', description: 'Laser RGB full-color, 3D beam projection, pattern laser, atmospheric effects. Từ 10W đến 60W với độ chính xác tuyệt đối.', features: ['Laser RGB 3D Full-Color','Pattern & Logo Projection','Laser-to-Fog Atmospheric','IP65/67 Outdoor Ready','ILDA & DMX Compatible'], image: 'https://images.unsplash.com/photo-1772078822311-02f078eb34ed?w=800&q=80', color: '#00FF88', colorDim: 'rgba(0,255,136,0.1)', tag: 'LASER' },
  { icon: Layers, title: 'Hệ Thống Kinetic Lighting', subtitle: 'Kinetic Moving Light Systems', description: 'Hàng trăm đèn kinetic bay đồng bộ, tạo hình nghệ thuật trong không gian 3D. Hiệu ứng độc đáo chỉ có tại Việt Nam.', features: ['200+ Kinetic Moving Lights','Programmable Flight Sequences','Synchronized Choreography','Winch & Motor Control','Custom Shape Formation'], image: 'https://images.unsplash.com/photo-1759912301996-3b99deda9996?w=800&q=80', color: '#00E5FF', colorDim: 'rgba(0,229,255,0.1)', tag: 'KINETIC' },
  { icon: Triangle, title: 'Moving Head & Beam Lights', subtitle: 'Dynamic Stage Lighting', description: 'Hệ thống đèn moving head beam và wash từ các thương hiệu hàng đầu. Lập trình show chuyên nghiệp theo từng cue.', features: ['Sharpy & ACL Beam Lights','LED Wash & Spot','Strobe & Effects Units','Real-time DMX Show','Backup System Included'], image: 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80', color: '#00FF88', colorDim: 'rgba(0,255,136,0.1)', tag: 'MOVING HEAD' },
  { icon: Wind, title: 'Special Effects', subtitle: 'Atmospheric & Pyro Effects', description: 'CO2 jets, haze machines, confetti cannons, cryo effects và low-lying fog. Nâng tầm cảm xúc sự kiện.', features: ['CO2 & Cryo Jet Effects','Haze & Fog Machines','Confetti Cannons','Low-Lying Fog System','Safe for Indoor & Outdoor'], image: 'https://images.unsplash.com/photo-1574154883606-19fa4f836c54?w=800&q=80', color: '#00E5FF', colorDim: 'rgba(0,229,255,0.1)', tag: 'EFFECTS' },
  { icon: Cpu, title: 'Lập Trình & Điều Khiển Show', subtitle: 'Show Programming & Control', description: 'Kỹ thuật viên chuyên nghiệp với grandMA3 console, lập trình đồng bộ toàn bộ show theo từng beat nhạc.', features: ['grandMA3 Console','Timecode Synchronization','MIDI & OSC Integration','Pre-programmed Cue Library','24/7 Technical Support'], image: 'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=800&q=80', color: '#BF00FF', colorDim: 'rgba(191,0,255,0.1)', tag: 'PROGRAMMING' },
  { icon: Lightbulb, title: 'Tư Vấn & Thiết Kế Concept', subtitle: 'Lighting Design Consultation', description: 'Từ ý tưởng đến thực thi — chúng tôi thiết kế toàn bộ concept ánh sáng, từ 2D plot đến 3D visualization.', features: ['Free Initial Consultation','3D Lighting Visualization','Custom Show Design','Budget Optimization','Post-Event Analysis'], image: 'https://images.unsplash.com/photo-1753030768124-dba306907bba?w=800&q=80', color: '#00FF88', colorDim: 'rgba(0,255,136,0.1)', tag: 'DESIGN' },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = service.icon;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 40 }} transition={{ duration: 0.5, delay: (index % 3) * 0.1 }} className="group card-laser rounded-2xl overflow-hidden">
      <div className="relative h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)' }} />
        <div className="absolute top-3 left-3">
          <span style={{ background: service.colorDim, border: `1px solid ${service.color}40`, color: service.color, fontSize: '0.6rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.15em', padding: '3px 10px', borderRadius: '999px' }}>{service.tag}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }} />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: service.colorDim, border: `1px solid ${service.color}30` }}>
            <Icon size={16} style={{ color: service.color }} />
          </div>
          <div>
            <h3 className="text-white font-exo" style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2 }}>{service.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: '0.05em' }}>{service.subtitle}</p>
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif", lineHeight: 1.7, marginBottom: '1rem' }}>{service.description}</p>
        <ul className="space-y-1.5">
          {service.features.map((feat, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: service.color }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-50px' });

  return (
    <section id="services" className="relative py-24 px-4 sm:px-6" style={{ background: '#000' }}>
      <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.3), rgba(0,229,255,0.2), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.2), rgba(0,255,136,0.15), transparent)' }} />
      <div className="max-w-7xl mx-auto">
        <motion.div ref={titleRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : 30 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="section-eyebrow mb-4">— Dịch Vụ Cốt Lõi —</p>
          <h2 className="font-orbitron text-white mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2 }}>
            Vũ Khí Ánh Sáng
            <span className="block" style={{ background: 'linear-gradient(135deg, #00FF88, #00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Trong Kho Arsenal Của Chúng Tôi</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', fontFamily: "'Be Vietnam Pro', sans-serif", maxWidth: '540px', margin: '0 auto', lineHeight: 1.8 }}>
            Thiết bị nhập khẩu chính hãng, được bảo trì định kỳ và vận hành bởi đội ngũ kỹ thuật hàng đầu.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (<ServiceCard key={service.title} service={service} index={index} />))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: titleInView ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-14 text-center">
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-exo transition-all duration-300 btn-glow-green" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.44 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Tư Vấn Dịch Vụ Phù Hợp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
