'use client';
import { Zap, Phone, MapPin, Mail, User, Info, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { SiteSettings, formatPhoneNumber } from '@/lib/data';
import { Logo } from '@/components/Logo';
import { smoothScrollTo } from '@/lib/scrollUtils';

// Custom Social Icons
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.4 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.4-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const MessengerIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="currentColor">
    <path d="M14 2C7.373 2 2 6.941 2 13.04c0 3.473 1.733 6.574 4.453 8.527V26l4.246-2.333c1.066.296 2.197.453 3.301.453 6.627 0 12-4.941 12-11.04C26 6.941 20.627 2 14 2zm1.606 14.974l-3.076-3.28-5.996 3.28 6.59-6.994 3.076 3.28 5.996-3.28-6.59 6.994z"></path>
  </svg>
);

// Custom Zalo Icon
const ZaloIcon = ({ size = 20 }) => (
  <span style={{ fontSize: `${size * 0.6}px`, fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>Za</span>
);

const services = [
  'Hệ Thống Laser Mapping 3D',
  'Hệ Thống Kinetic Lighting',
  'Moving Head Professional',
  'Special Effects (SFX)',
  'Lập Trình & Điều Khiển Show',
  'Tư Vấn & Thiết Kế Concept'
];

export function Footer({ siteSettings }: { siteSettings: SiteSettings }) {
  const handleServiceClick = (e: React.MouseEvent, title: string) => {
    const isHomePage = window.location.pathname === '/';
    const id = `service-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
    const el = document.getElementById(id);

    if (isHomePage && el) {
      e.preventDefault();
      smoothScrollTo(id);
    } else if (isHomePage && !el) {
      const servicesEl = document.getElementById('services');
      if (servicesEl) {
        e.preventDefault();
        smoothScrollTo('services');
      }
    }
    // If not on homepage or element not found, standard link behavior takes over
  };

  return (
    <footer className="relative pt-16 pb-12 px-4 sm:px-6" style={{ background: '#000' }}>
      {/* Decorative Top Border - Visible on all screens */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,255,136,0.5)] to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[rgba(0,255,136,0.2)]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">

          {/* Column 1: Company Info & Socials */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <Link href="/" className="flex items-center group">
                <Logo size="lg" />
              </Link>

              <h3 className="text-white font-bold font-body text-[0.95rem] tracking-wide leading-relaxed">
                {siteSettings.companyName}
              </h3>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[0.85rem]" style={{ color: 'var(--neon-green)' }}>Mã số thuế:</span>
                  <span className="text-gray-400 font-body text-[0.85rem]">{siteSettings.taxCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body text-[0.85rem]" style={{ color: 'var(--neon-green)' }}>Đại diện:</span>
                  <span className="text-gray-400 font-body text-[0.85rem]">{siteSettings.directorName} - {siteSettings.directorRole}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body text-[0.85rem]" style={{ color: 'var(--neon-green)' }}>STK:</span>
                  <span className="text-gray-400 font-body text-[0.85rem]">{siteSettings.bankAccount}</span>
                </div>
              </div>
            </div>

            {/* Social Icons Style from Image */}
            <div className="flex items-center gap-3">
              {[
                { icon: FacebookIcon, link: siteSettings.facebookLink },
                { icon: ZaloIcon, link: siteSettings.zaloLink },
                { icon: MessengerIcon, link: siteSettings.messengerLink },
                { icon: YoutubeIcon, link: siteSettings.youtubeLink },
              ].map((social, idx) => (
                <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:text-white"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)'
                  }}
                  onMouseEnter={(e) => {
                    if (social.icon === ZaloIcon) {
                      e.currentTarget.style.background = '#0068FF';
                      e.currentTarget.style.borderColor = '#0068FF';
                    } else {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services List */}
          <div>
            <h3 className="font-header text-white mb-8 font-bold tracking-[0.2em] text-[0.85rem]">DỊCH VỤ</h3>
            <div className="flex flex-col gap-4">
              {services.map((service) => (
                <Link
                  key={service}
                  href={`/#service-${service.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
                  onClick={(e) => handleServiceClick(e, service)}
                  className="text-gray-500 hover:text-white transition-colors duration-300 font-body text-[0.95rem] cursor-pointer"
                >
                  {service}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="font-header text-white mb-8 font-bold tracking-[0.2em] text-[0.85rem]">LIÊN HỆ</h3>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-gray-500 font-body text-[0.8rem] mb-2">Tư Vấn & Báo Giá</p>
                  <div className="flex flex-col gap-1.5">
                    {(siteSettings.consultants && siteSettings.consultants.length > 0) ? (
                      siteSettings.consultants.map((c, i) => (
                        <a key={i} href={`tel:${c.phone.replace(/\s+/g, '')}`} className="text-white hover:text-[var(--neon-green)] font-bold text-[1.1rem] transition-colors">
                          {formatPhoneNumber(c.phone)} — {c.name}
                        </a>
                      ))
                    ) : (
                      <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} className="text-white hover:text-[var(--neon-green)] font-bold text-[1.1rem] transition-colors">
                        {formatPhoneNumber(siteSettings.phone)} — {siteSettings.consultantName}
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 font-body text-[0.8rem] mb-1.5">Email</p>
                  <a href={`mailto:${siteSettings.companyEmail}`} className="text-white hover:text-[var(--neon-green)] transition-colors text-[0.9rem]">
                    {siteSettings.companyEmail}
                  </a>
                </div>

                <div>
                  <p className="text-gray-500 font-body text-[0.8rem] mb-1.5">Văn Phòng</p>
                  <p className="text-gray-400 font-body text-[0.9rem] leading-relaxed max-w-[320px]">
                    {siteSettings.address}
                  </p>
                </div>

                <div>
                  <p className="text-white font-body text-[0.85rem]">
                    GĐ: <span className="font-bold">{formatPhoneNumber(siteSettings.directorPhone)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[0.75rem] font-body">
            © 2025 LaserQH Production. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6">
            <Link href="/admin" className="text-gray-600 hover:text-[var(--neon-green)] text-[0.75rem] font-body transition-colors">Quản trị</Link>
            <Link href="/chinh-sach-bao-mat" className="text-gray-600 hover:text-gray-400 text-[0.75rem] font-body transition-colors">Chính sách bảo mật</Link>
            <Link href="/dieu-khoan-dich-vu" className="text-gray-600 hover:text-gray-400 text-[0.75rem] font-body transition-colors">Điều khoản dịch vụ</Link>
            <a href="https://www.loops.vn/en" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white text-[0.75rem] font-body transition-colors">Thiết kế website bởi Loops</a>
          </div>
        </div>
      </div>

      {/* Background Decorative Glow */}
      <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-[var(--neon-green)] opacity-[0.03] blur-[100px] pointer-events-none rounded-full" />
    </footer>
  );
}
