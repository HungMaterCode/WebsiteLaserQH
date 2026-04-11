'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { SiteSettings, MediaSettings } from '@/lib/data';

function LaserBeam({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: '1px',
        background: 'linear-gradient(180deg, transparent, #00FF88, #00E5FF, transparent)',
        opacity: 0.35,
        animation: 'glowPulse 3s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      opacity: number;
      color: string;
      twinkle: number;
      twinkleSpeed: number;
    };

    const COLORS = ['#00FF88', '#00E5FF', '#BF00FF', '#00FF88', '#00E5FF'];
    const COUNT = 55;

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.06,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.55 + 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += p.twinkleSpeed;

        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.twinkle));

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        glow.addColorStop(0, p.color + Math.round(alpha * 55).toString(16).padStart(2, '0'));
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2, opacity: 0.65 }}
    />
  );
}

export function HeroSection({ siteSettings, mediaSettings }: { siteSettings: SiteSettings, mediaSettings: MediaSettings }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById('flexibility');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center hero-section-container"
      style={{ minHeight: '100vh', background: '#000' }}
    >
      {/* Video / Image Background */}
      <div className="absolute inset-0 z-0">
        {mediaSettings.heroVideoEnabled && mediaSettings.heroVideoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.35 }}
            autoPlay muted loop playsInline preload="metadata"
            poster={mediaSettings.heroImageUrl}
          >
            <source src={mediaSettings.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaSettings.heroImageUrl || 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=1920&q=80'}
            alt="Concert laser show"
            className="w-full h-full object-cover"
            style={{ opacity: 0.3 }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.65) 100%),
              radial-gradient(ellipse at 20% 60%, rgba(0,255,136,0.06) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 40%, rgba(0,229,255,0.06) 0%, transparent 55%)
            `,
          }}
        />
      </div>

      <ParticleField />

      <LaserBeam style={{ left: '8%', top: 0, height: '100%' }} />
      <LaserBeam style={{ left: '28%', top: 0, height: '55%', opacity: 0.18 }} />
      <LaserBeam style={{ right: '12%', top: 0, height: '75%', opacity: 0.25, background: 'linear-gradient(180deg, transparent, #BF00FF, #00E5FF, transparent)' }} />
      <LaserBeam style={{ right: '32%', top: '25%', height: '45%', opacity: 0.12 }} />

      <div className="absolute left-0 right-0 h-px" style={{ top: '38%', background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.25), transparent)', animation: 'glowPulse 4s ease-in-out infinite' }} />
      <div className="absolute left-0 right-0 h-px" style={{ top: '62%', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.12), transparent)', animation: 'glowPulse 5s ease-in-out infinite 1s' }} />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto hero-content-wrapper pt-24 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 hero-eyebrow"
        >
          <span
            className="inline-block section-eyebrow px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(0,255,136,0.07)',
              border: '1px solid rgba(0,255,136,0.22)',
              fontSize: '0.68rem',
              letterSpacing: '0.28em',
            }}
          >
            ⚡ Vietnam&apos;s Premier Laser &amp; Kinetic Production ⚡
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-orbitron text-white mb-4 hero-headline"
          style={{
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          Chất Lượng
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #00FF88 0%, #00E5FF 55%, #BF00FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Mega Concert.
          </span>
          <br />
          <span className="text-white">Cho Mọi Quy Mô.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-10 mx-auto hero-description"
          style={{
            color: 'rgba(255,255,255,0.68)',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
            lineHeight: 1.75,
            maxWidth: '680px',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontWeight: 300,
          }}
        >
          Từ tiệc VIP thân mật đến sân vận động 50,000 khán giả tại Việt Nam —
          chúng tôi kiến tạo những trải nghiệm thị giác không thể nào quên,
          với cùng một cấp độ thiết bị và chuyên môn đỉnh cao.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 hero-cta px-4 sm:px-0"
        >
          <a
            href={siteSettings.zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-exo transition-all duration-300 relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #0068FF, #0056D2)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: '0 0 20px rgba(0,104,255,0.3)',
              minWidth: '180px',
            }}
          >
            <div className="w-5 h-5 rounded-md flex items-center justify-center bg-white overflow-hidden">
              <span style={{ fontSize: '0.55rem', color: '#0068FF', fontWeight: 900 }}>Za</span>
            </div>
            <span className="relative z-10">Nhắn tin Zalo</span>
          </a>

          <a
            href={siteSettings.messengerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-exo transition-all duration-300 relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #00FF88, #00cc66)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: '0 0 20px rgba(0,255,136,0.3)',
              minWidth: '180px',
            }}
          >
            <svg className="relative z-10" width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M24 7C14.611 7 7 14.165 7 23C7 27.89 9.177 32.267 12.714 35.234V41L18.302 38.003C20.095 38.495 22.01 38.762 24 38.762C33.389 38.762 41 31.597 41 22.762C41 13.927 33.389 7 24 7Z" fill="#000" opacity="0.8"/>
              <path d="M10.5 27L18.5 18.5L22.5 23L27.5 18.5L35.5 27L27.5 22.5L22.5 27L18.5 22.5L10.5 27Z" fill="white"/>
            </svg>
            <span className="relative z-10">Chat Facebook</span>
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-exo transition-all duration-300 btn-glow-cyan"
            style={{ fontWeight: 600, fontSize: '0.88rem', minWidth: '180px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Báo Giá Ngay
          </a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 hero-stats"
        >
          {[
            { value: '500+', label: 'Sự Kiện Thành Công' },
            { value: '10+', label: 'Năm Kinh Nghiệm' },
            { value: '50K', label: 'Khán Giả Lớn Nhất' },
            { value: '3', label: 'Quy Mô Phục Vụ' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="stat-value font-orbitron" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: '0.05em', marginTop: 5 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-300 cursor-pointer hero-scroll-indicator"
        style={{ color: 'rgba(0,255,136,0.4)' }}
      >
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
}
