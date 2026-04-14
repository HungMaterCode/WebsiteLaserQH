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
import { Logo } from '@/components/Logo';

const navLinks = [
  { href: '/#flexibility', label: 'Quy Mô Sự Kiện' },
  { href: '/#services', label: 'Dịch Vụ' },
  { href: '/#showcase', label: 'Portfolio' },
  { href: '/#why-us', label: 'Tại Sao Chọn Chúng Tôi' },
  { href: '/#contact', label: 'Liên Hệ' },
];

export function Navigation({ siteSettings }: { siteSettings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dynamically get all consultants
  const consultants = siteSettings.consultants && siteSettings.consultants.length > 0
    ? siteSettings.consultants
    : [{ name: 'Hotline', phone: siteSettings.phone }];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      sessionStorage.setItem('lastScrollY', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 1. Handle scroll restoration from manual F5 (if no hash)
    const savedY = sessionStorage.getItem('lastScrollY');
    const isReload = typeof window !== 'undefined' &&
      window.performance &&
      window.performance.getEntriesByType('navigation').length > 0 &&
      (window.performance.getEntriesByType('navigation')[0] as any).type === 'reload';

    if (savedY && isReload && !window.location.hash) {
      const targetY = parseInt(savedY, 10);
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }, 100);
    }

    // 2. Handle cross-page navigation with hash (e.g., from Project detail to #contact)
    if (window.location.hash) {
      // Increase timeout slightly to ensure DOM is fully ready and images/layout are settled
      const timer = setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          // Use 'start' with center fallback if needed, or stick to 'center' for reliability
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Clear hash after scrolling so a subsequent F5 starts at top or stays here
          window.history.pushState(null, document.title, window.location.pathname + window.location.search);
        }
      }, 800);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // Check if we are navigatings to a section on the CURRENT page
    const isHomePage = window.location.pathname === '/';
    const isHashLink = href.includes('#');
    
    if (isHomePage && isHashLink) {
      const id = href.split('#')[1];
      const el = document.getElementById(id);

      if (el) {
        e.preventDefault();
        setMobileOpen(false);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    
    // If NOT on homepage or element not found, let the Link handle the navigation
    setMobileOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
              {/* Phones List */}
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1">
                {consultants.map((consultant, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <a
                      href={`tel:${consultant.phone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1.5 group transition-all duration-200 whitespace-nowrap"
                      style={{ textDecoration: 'none' }}
                    >
                      <Phone size={11} style={{ color: '#00FF88', flexShrink: 0 }} />
                      <span
                        className="group-hover:text-white transition-colors duration-200"
                        style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.64rem, 2vw, 0.72rem)', fontFamily: "var(--font-body), sans-serif", fontWeight: 500 }}
                      >
                        {consultant.phone}
                      </span>
                    </a>
                    {index < consultants.length - 1 && (
                      <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)' }}>|</span>
                    )}
                  </div>
                ))}
              </div>

              {/* FB and Zalo links */}
              <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
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
                    style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontFamily: "var(--font-body), sans-serif" }}
                  >
                    Zalo
                  </span>
                </a>
                <a
                  href={siteSettings.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-all duration-200 group"
                  style={{ textDecoration: 'none' }}
                >
                  <Facebook size={12} style={{ color: '#4B9FFF' }} />
                  <span
                    className="hidden sm:inline group-hover:text-white transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontFamily: "var(--font-body), sans-serif" }}
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
            <div className="flex items-center justify-between h-16 md:h-[96px]">
              {/* Logo */}
              <Link href="/" className="flex items-center group" onClick={handleLogoClick}>
                <Logo size="sm" className="md:hidden" />
                <Logo size="md" className="hidden md:flex" />
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-4 lg:gap-10">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-white/70 hover:text-white transition-colors duration-300 relative group whitespace-nowrap"
                    style={{ fontFamily: "var(--font-body), sans-serif", fontSize: '0.83rem', letterSpacing: '0.01em' }}
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
                  href="/#contact"
                  onClick={(e) => handleNavClick(e, '/#contact')}
                  className="px-5 py-2 rounded-md transition-all duration-300 btn-glow-green font-header"
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
        className="fixed inset-0 z-[100] md:hidden transition-all duration-300"
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
            {consultants.map((consultant, index) => (
              <a
                key={index}
                href={`tel:${consultant.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2"
                style={{ textDecoration: 'none' }}
              >
                <Phone size={13} style={{ color: '#00FF88' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: "var(--font-body), sans-serif" }}>
                  {consultant.phone} · {consultant.name}
                </span>
              </a>
            ))}

            <div className="flex items-center gap-4 pt-1">
              <a href={siteSettings.zaloLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#0068FF] overflow-hidden">
                  <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: 900 }}>Za</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: "var(--font-body), sans-serif" }}>Zalo</span>
              </a>
              <a href={siteSettings.facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                <Facebook size={14} style={{ color: '#4B9FFF' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: "var(--font-body), sans-serif" }}>Facebook</span>
              </a>
            </div>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white/80 hover:text-white py-1.5 border-b transition-colors duration-300"
              style={{
                borderColor: 'rgba(255,255,255,0.07)',
                fontFamily: "var(--font-body), sans-serif",
                fontSize: '0.95rem',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contact"
            onClick={(e) => handleNavClick(e, '/#contact')}
            className="mt-3 text-center py-3 rounded-md btn-glow-green font-header"
            style={{ fontWeight: 700 }}
          >
            Báo Giá Ngay
          </a>
        </div>
      </div>
    </>
  );
}
