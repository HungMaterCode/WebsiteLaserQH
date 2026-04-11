'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap, Phone } from 'lucide-react';

const Facebook = ({ size = 24, style = {} }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);
import { SiteSettings } from '@/lib/data';

const navLinks = [
  { href: '#flexibility', label: 'Quy Mô Sự Kiện' },
  { href: '#services', label: 'Dịch Vụ' },
  { href: '#showcase', label: 'Portfolio' },
  { href: '#why-us', label: 'Tại Sao Chọn Chúng Tôi' },
  { href: '#contact', label: 'Liên Hệ' },
];

export function Navigation({ siteSettings }: { siteSettings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryConsultant = siteSettings.consultants?.[0] || { name: 'Mr. Hiệp', phone: siteSettings.phone };
  const secondaryConsultant = siteSettings.consultants?.[1];

  const CONTACT_INFO = {
    phone1: { 
      number: primaryConsultant.phone, 
      name: `Tư Vấn: ${primaryConsultant.name}`, 
      href: `tel:${primaryConsultant.phone.replace(/\s+/g, '')}` 
    },
    phone2: secondaryConsultant ? { 
      number: secondaryConsultant.phone, 
      name: `Báo Giá: ${secondaryConsultant.name}`, 
      href: `tel:${secondaryConsultant.phone.replace(/\s+/g, '')}` 
    } : null,
    facebook: { label: 'Facebook', href: siteSettings.facebookLink },
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Fixed header: top info bar + main nav */}
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* ── Top Contact Bar ── */}
        <div
          style={{
            background: 'rgba(0,0,0,0.95)',
            borderBottom: '1px solid rgba(0,255,136,0.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between" style={{ height: 34 }}>
              {/* Phones */}
              <div className="flex items-center gap-1 sm:gap-5">
                <a
                  href={CONTACT_INFO.phone1.href}
                  className="flex items-center gap-1.5 group transition-all duration-200 whitespace-nowrap"
                  style={{ textDecoration: 'none' }}
                >
                  <Phone size={11} style={{ color: '#00FF88', flexShrink: 0 }} />
                  <span
                    className="group-hover:text-white transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}
                  >
                    {CONTACT_INFO.phone1.number}
                  </span>
                </a>
                {CONTACT_INFO.phone2 && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.7rem' }}>|</span>
                    <a
                      href={CONTACT_INFO.phone2.href}
                      className="flex items-center gap-1.5 group transition-all duration-200 whitespace-nowrap"
                      style={{ textDecoration: 'none' }}
                    >
                      <Phone size={11} style={{ color: '#00FF88', flexShrink: 0 }} />
                      <span
                        className="group-hover:text-white transition-colors duration-200"
                        style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }}
                      >
                        {CONTACT_INFO.phone2.number}
                      </span>
                    </a>
                  </>
                )}
              </div>

              {/* FB and Zalo links */}
              <div className="flex items-center gap-3 sm:gap-4">
                <a
                  href={siteSettings.zaloLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-all duration-200 group"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center overflow-hidden" style={{ background: '#0068FF' }}>
                    <span style={{ fontSize: '0.45rem', color: '#fff', fontWeight: 'bold' }}>Za</span>
                  </div>
                  <span
                    className="hidden sm:inline group-hover:text-white transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  >
                    Zalo
                  </span>
                </a>
                <a
                  href={CONTACT_INFO.facebook.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-all duration-200 group"
                  style={{ textDecoration: 'none' }}
                >
                  <Facebook size={12} style={{ color: '#4B9FFF' }} />
                  <span
                    className="hidden sm:inline group-hover:text-white transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  >
                    Facebook
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#00FF88', boxShadow: '0 0 6px #00FF88', animation: 'glowPulse 2s ease-in-out infinite', flexShrink: 0 }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Nav ── */}
        <nav
          className="transition-all duration-500"
          style={{
            background: scrolled
              ? 'rgba(0, 0, 0, 0.92)'
              : 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(0,255,136,0.1)' : 'none',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-[68px]">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,229,255,0.15))',
                    border: '1px solid rgba(0,255,136,0.45)',
                    boxShadow: '0 0 15px rgba(0,255,136,0.25)',
                  }}
                >
                  <Zap size={18} style={{ color: '#00FF88' }} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-orbitron text-white" style={{ fontSize: '0.92rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                    Laser<span style={{ color: '#00FF88', textShadow: '0 0 12px rgba(0,255,136,0.6)' }}>QH</span>
                  </span>
                  <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.25em', fontFamily: "'Be Vietnam Pro', sans-serif", textTransform: 'uppercase' }}>
                    Production
                  </span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-4 lg:gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="text-white/70 hover:text-white transition-colors duration-300 relative group whitespace-nowrap"
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.83rem', letterSpacing: '0.01em' }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ background: 'linear-gradient(90deg, transparent, #00FF88, transparent)' }}
                    />
                  </a>
                ))}
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex items-center gap-3">
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                  className="px-5 py-2 rounded-md text-sm transition-all duration-300 btn-glow-green font-exo"
                  style={{ fontWeight: 600, fontSize: '0.82rem' }}
                >
                  Báo Giá Ngay
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-white/80 hover:text-white p-2"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          pointerEvents: mobileOpen ? 'all' : 'none',
          opacity: mobileOpen ? 1 : 0,
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={() => setMobileOpen(false)} />
        <div
          className="absolute top-0 right-0 w-72 h-full flex flex-col pt-24 pb-12 px-6 gap-5 overflow-y-auto"
          style={{
            background: 'rgba(3,5,18,0.98)',
            backdropFilter: 'blur(30px)',
            borderLeft: '1px solid rgba(0,255,136,0.12)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease',
          }}
        >
          {/* Mobile contact info */}
          <div className="pb-4 space-y-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <a href={CONTACT_INFO.phone1.href} className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
              <Phone size={13} style={{ color: '#00FF88' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {CONTACT_INFO.phone1.number} · {CONTACT_INFO.phone1.name}
              </span>
            </a>
            {CONTACT_INFO.phone2 && (
              <a href={CONTACT_INFO.phone2.href} className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                <Phone size={13} style={{ color: '#00FF88' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  {CONTACT_INFO.phone2.number} · {CONTACT_INFO.phone2.name}
                </span>
              </a>
            )}
            <div className="flex items-center gap-4 pt-1">
              <a href={siteSettings.zaloLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#0068FF] overflow-hidden">
                  <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: 900 }}>Za</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Zalo</span>
              </a>
              <a href={siteSettings.facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                <Facebook size={14} style={{ color: '#4B9FFF' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Facebook</span>
              </a>
            </div>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-white/80 hover:text-white py-1.5 border-b transition-colors duration-300"
              style={{
                borderColor: 'rgba(255,255,255,0.07)',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '0.95rem',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
            className="mt-3 text-center py-3 rounded-md btn-glow-green font-exo"
            style={{ fontWeight: 700 }}
          >
            Báo Giá Ngay
          </a>
        </div>
      </div>
    </>
  );
}
