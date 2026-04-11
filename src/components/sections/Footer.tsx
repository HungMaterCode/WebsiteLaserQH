import { Zap, Phone, MapPin, Mail, User, Info, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/data';

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

// Custom Zalo Icon
const ZaloIcon = ({ size = 20 }) => (
  <span style={{ fontSize: `${size * 0.6}px`, fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>Za</span>
);

const services = [
  'Hệ Thống Laser',
  'Kinetic Lighting',
  'Moving Head Lights',
  'Special Effects',
  'Lập Trình Show',
  'Thiết Kế Concept'
];

export function Footer({ siteSettings }: { siteSettings: SiteSettings }) {

  return (
    <footer className="relative pt-20 pb-12 px-4 sm:px-6" style={{ background: '#000', borderTop: '1px solid rgba(0,255,136,0.15)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">
          
          {/* Column 1: Company Info & Socials */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-transform hover:scale-105" 
                     style={{ background: 'linear-gradient(135deg, #00FF88 0%, #00BD65 100%)' }}>
                  <Zap size={22} fill="white" color="white" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-orbitron text-white text-[1.1rem] font-black tracking-wider">
                    Laser<span style={{ color: '#00FF88' }}>QH</span>
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em', fontFamily: 'var(--font-orbitron)', textTransform: 'uppercase' }}>Production</span>
                </div>
              </Link>
              
              <h3 className="text-white font-bold font-vietnam text-[0.95rem] tracking-wide leading-relaxed">
                {siteSettings.companyName}
              </h3>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-vietnam text-[0.85rem]" style={{ color: 'var(--neon-green)' }}>Mã số thuế:</span>
                  <span className="text-gray-400 font-vietnam text-[0.85rem]">{siteSettings.taxCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-vietnam text-[0.85rem]" style={{ color: 'var(--neon-green)' }}>Đại diện:</span>
                  <span className="text-gray-400 font-vietnam text-[0.85rem]">{siteSettings.directorName} - Giám đốc</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-vietnam text-[0.85rem]" style={{ color: 'var(--neon-green)' }}>STK:</span>
                  <span className="text-gray-400 font-vietnam text-[0.85rem]">{siteSettings.bankAccount}</span>
                </div>
              </div>
            </div>

            {/* Social Icons Style from Image */}
            <div className="flex items-center gap-3">
              {[
                { icon: FacebookIcon, link: siteSettings.facebookLink },
                { icon: ZaloIcon, link: siteSettings.zaloLink },
                { icon: YoutubeIcon, link: '#' },
                { icon: InstagramIcon, link: '#' },
              ].map((social, idx) => (
                <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:scale-110"
                   style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services List */}
          <div>
            <h3 className="font-orbitron text-white mb-8 font-bold tracking-[0.2em] text-[0.85rem]">DỊCH VỤ</h3>
            <div className="flex flex-col gap-4">
              {services.map((service) => (
                <Link key={service} href="#services" className="text-gray-500 hover:text-white transition-colors duration-300 font-vietnam text-[0.95rem]">
                  {service}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="font-orbitron text-white mb-8 font-bold tracking-[0.2em] text-[0.85rem]">LIÊN HỆ</h3>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-gray-500 font-vietnam text-[0.8rem] mb-2">Tư Vấn & Báo Giá</p>
                  <div className="flex flex-col gap-1.5">
                    <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} className="text-white hover:text-[var(--neon-green)] font-bold text-[1.1rem] transition-colors">
                      {siteSettings.phone} — Mr. Hiệp
                    </a>
                    <a href={`tel:0989600049`} className="text-white hover:text-[var(--neon-green)] font-bold text-[1.1rem] transition-colors">
                      098 9600049 — Mr. Phương
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 font-vietnam text-[0.8rem] mb-1.5">Email</p>
                  <a href={`mailto:${siteSettings.companyEmail}`} className="text-white hover:text-[var(--neon-green)] transition-colors text-[0.9rem]">
                    {siteSettings.companyEmail}
                  </a>
                </div>

                <div>
                  <p className="text-gray-500 font-vietnam text-[0.8rem] mb-1.5">Văn Phòng</p>
                  <p className="text-gray-400 font-vietnam text-[0.9rem] leading-relaxed max-w-[320px]">
                    {siteSettings.address}
                  </p>
                </div>

                <div>
                  <p className="text-white font-vietnam text-[0.85rem]">
                    GĐ: <span className="font-bold">{siteSettings.directorPhone}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[0.75rem] font-vietnam">
            © 2025 LaserQH Production. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6">
            <Link href="/admin" className="text-gray-600 hover:text-[var(--neon-green)] text-[0.75rem] font-vietnam transition-colors">Quản trị</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-400 text-[0.75rem] font-vietnam transition-colors">Chính sách bảo mật</Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-400 text-[0.75rem] font-vietnam transition-colors">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
      
      {/* Background Decorative Glow */}
      <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-[var(--neon-green)] opacity-[0.03] blur-[100px] pointer-events-none rounded-full" />
    </footer>
  );
}
