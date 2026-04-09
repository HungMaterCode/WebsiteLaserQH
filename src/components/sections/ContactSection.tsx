'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Phone, MapPin, Building2, Send } from 'lucide-react';
import { defaultSiteSettings } from '@/lib/data';

// Icons for social
const MessengerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.145 2 11.258C2 14.153 3.497 16.745 5.86 18.423V22L9.176 19.988C10.076 20.354 11.025 20.516 12 20.516C17.523 20.516 22 16.371 22 11.258C22 6.145 17.523 2 12 2ZM12.758 13.921L10.59 11.6L6.37 13.921L11.002 8.98L13.252 11.3L17.5 8.98L12.758 13.921Z" fill="currentColor"/>
  </svg>
);

export function ContactSection() {
  const siteSettings = defaultSiteSettings;
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-50px' });
  
  const [formData, setFormData] = useState({ 
    name: '', phone: '', eventType: '', size: '', budget: '', date: '', message: '' 
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', phone: '', eventType: '', size: '', budget: '', date: '', message: '' });
  };

  return (
    <section id="contact" className="relative pt-12 pb-24 px-4 sm:px-6" style={{ background: '#02050A' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div ref={titleRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : 30 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="font-orbitron mb-4 font-semibold tracking-widest text-[0.7rem] uppercase" style={{ color: 'var(--neon-green)' }}>
            — BẮT ĐẦU DỰ ÁN —
          </p>
          <h2 className="font-orbitron mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
            <span className="text-white block">Hãy Nói Chuyện</span>
            <span className="block" style={{ color: 'var(--neon-green)' }}>Về Sự Kiện Của Bạn</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', fontFamily: 'var(--font-vietnam)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.8 }}>
            Dù sự kiện của bạn là 50 hay 50,000 người — chúng tôi luôn có giải pháp phù hợp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT COLUMN: Info */}
          <div className="space-y-8 p-1 sm:p-2">
            
            {/* Social Chat */}
            <div className="p-8 rounded-[20px]" style={{ background: '#050912', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-white font-orbitron font-bold text-[1.15rem] mb-2 tracking-wide">
                Chat Ngay — Phản Hồi Trong 5 Phút
              </h3>
              <p className="mb-6 font-vietnam text-[0.9rem]" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Muốn trao đổi nhanh? Nhắn tin qua Facebook Messenger hoặc Zalo — đội ngũ chúng tôi luôn trực tuyến.
              </p>
              
              <div className="space-y-3">
                {/* Messenger Button */}
                <a href={siteSettings.messengerLink} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 rounded-xl transition-all duration-300" style={{ background: 'rgba(24, 119, 242, 0.05)', border: '1px solid rgba(24, 119, 242, 0.2)' }}
                   onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(24, 119, 242, 0.1)'; e.currentTarget.style.borderColor = 'rgba(24, 119, 242, 0.4)'; }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #00B2FF, #006AFF)' }}>
                      <MessengerIcon />
                    </div>
                    <div>
                      <h4 className="text-white font-bold font-vietnam text-[0.95rem]">Facebook Messenger</h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: 'var(--font-vietnam)' }}>Chat trực tiếp · Phản hồi nhanh nhất</p>
                    </div>
                  </div>
                  <span style={{ color: 'rgba(24, 119, 242, 0.5)' }} className="group-hover:translate-x-1 group-hover:text-[#1877F2] transition-all">→</span>
                </a>

                {/* Zalo Button */}
                <a href={siteSettings.zaloLink} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 rounded-xl transition-all duration-300" style={{ background: 'rgba(0, 104, 255, 0.05)', border: '1px solid rgba(0, 104, 255, 0.2)' }}
                   onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 104, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(0, 104, 255, 0.4)'; }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white shrink-0 shadow-lg font-bold text-[1.2rem] font-vietnam" style={{ background: 'linear-gradient(135deg, #0088FF, #0068FF)' }}>
                      Za
                    </div>
                    <div>
                      <h4 className="text-white font-bold font-vietnam text-[0.95rem]">Zalo</h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: 'var(--font-vietnam)' }}>Phổ biến tại Việt Nam · Tiện lợi cho mobile</p>
                    </div>
                  </div>
                  <span style={{ color: 'rgba(0, 104, 255, 0.5)' }} className="group-hover:translate-x-1 group-hover:text-[#0068FF] transition-all">→</span>
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 px-4 opacity-60">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[0.65rem] font-orbitron text-gray-500 uppercase tracking-[0.2em] font-medium">Hoặc Gọi Trực Tiếp</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            {/* Direct Contacts */}
            <div className="space-y-6 px-2">
              <div className="flex items-start gap-4">
                <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 mt-1" style={{ background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)', color: 'var(--neon-green)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-[0.7rem] font-orbitron uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>TƯ VẤN & BÁO GIÁ</h4>
                  <div className="flex flex-col gap-1 font-vietnam text-[1rem]">
                    <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} className="text-white hover:text-[#00FF88] transition-colors"><span className="font-bold">{siteSettings.phone}</span> <span className="text-gray-500 font-normal">— Mr. Hiệp</span></a>
                    <a href={`tel:0989600049`} className="text-white hover:text-[#00FF88] transition-colors"><span className="font-bold">098 9600049</span> <span className="text-gray-500 font-normal">— Mr. Phương</span></a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 mt-1" style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)', color: 'var(--neon-cyan)' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-[0.7rem] font-orbitron uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Trụ sở chính</h4>
                  <p className="text-white font-vietnam leading-relaxed text-[0.95rem]">
                    600/17 Quang Trung, KP7, Phường<br/>
                    Thông Tây Hội, TP Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>
            </div>

            {/* Company Info Box */}
            <div className="mt-4 p-6 rounded-[20px]" style={{ background: 'rgba(0, 255, 136, 0.02)', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={16} color="var(--neon-cyan)" />
                <h4 className="text-[0.75rem] font-orbitron font-bold uppercase tracking-widest" style={{ color: 'var(--neon-cyan)' }}>THÔNG TIN CÔNG TY</h4>
              </div>
              <h3 className="text-white font-bold font-vietnam text-[1.05rem] mb-4">CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ LASER QH</h3>
              
              <div className="grid grid-cols-[100px_1fr] gap-y-3 gap-x-2 font-vietnam text-[0.85rem]">
                <div className="text-gray-400">Địa chỉ:</div>
                <div className="text-white leading-relaxed">600/17 Quang Trung, KP7, Phường Thông Tây Hội, TP Hồ Chí Minh, Việt Nam</div>
                
                <div className="text-gray-400">Đại diện:</div>
                <div className="text-white">{siteSettings.directorName}</div>
                
                <div className="text-gray-400">Chức vụ:</div>
                <div className="text-white">Giám đốc</div>
                
                <div className="text-gray-400">Mã số thuế:</div>
                <div className="text-white">{siteSettings.taxCode}</div>
                
                <div className="text-gray-400">Email:</div>
                <div className="text-white">{siteSettings.companyEmail}</div>
                
                <div className="text-gray-400">ĐT:</div>
                <div className="text-white">{siteSettings.directorPhone}</div>
                
                <div className="text-gray-400">Số tài khoản:</div>
                <div className="text-white leading-relaxed">{siteSettings.bankAccount}</div>
              </div>
            </div>
            
          </div>
          
          {/* RIGHT COLUMN: Form */}
          <div>
            <div className="rounded-[20px] p-8 sm:p-10" style={{ background: '#050912', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-white font-orbitron font-bold text-[1.4rem] mb-3">Yêu Cầu Báo Giá Chi Tiết</h3>
              <p className="font-vietnam text-[0.95rem] mb-8" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Điền form để nhận báo giá chính xác và tư vấn chuyên sâu từ đội ngũ chúng tôi.
              </p>

              {submitted ? (
                <div className="text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.5)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h4 className="text-white font-orbitron font-bold text-xl mb-2">Đã Gửi Thành Công!</h4>
                  <p className="text-gray-400 font-vietnam">Cảm ơn bạn. Đội ngũ tư vấn sẽ liên hệ lại qua số điện thoại của bạn trong thời gian sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 form-dark">
                  
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-gray-400 font-vietnam text-[0.85rem] font-medium block">Họ & Tên <span className="text-red-500">*</span></label>
                      <input type="text" required placeholder="Nguyễn Văn A" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                             className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 font-vietnam text-[0.9rem] focus:outline-none focus:border-[#00FF88]/50 focus:ring-1 focus:ring-[#00FF88]/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-gray-400 font-vietnam text-[0.85rem] font-medium block">Số Điện Thoại <span className="text-red-500">*</span></label>
                      <input type="tel" required placeholder="0907 579 481" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                             className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 font-vietnam text-[0.9rem] focus:outline-none focus:border-[#00FF88]/50 focus:ring-1 focus:ring-[#00FF88]/50 transition-all" />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="space-y-2">
                    <label className="text-gray-400 font-vietnam text-[0.85rem] font-medium block">Loại Sự Kiện</label>
                    <select value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })} 
                            className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-3.5 text-white font-vietnam text-[0.9rem] focus:outline-none focus:border-[#00FF88]/50 focus:ring-1 focus:ring-[#00FF88]/50 transition-all appearance-none cursor-pointer">
                      <option value="" disabled hidden>Chọn loại sự kiện...</option>
                      <option value="mega">Mega Concert / Nhạc Hội</option>
                      <option value="corporate">Gala Doanh Nghiệp</option>
                      <option value="wedding">Private Wedding</option>
                      <option value="club">Club / EDM Festival</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-gray-400 font-vietnam text-[0.85rem] font-medium block">Quy Mô</label>
                      <select value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} 
                              className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-3.5 text-white font-vietnam text-[0.9rem] focus:outline-none focus:border-[#00FF88]/50 focus:ring-1 focus:ring-[#00FF88]/50 transition-all appearance-none cursor-pointer">
                        <option value="" disabled hidden>Chọn quy mô...</option>
                        <option value="small">&lt; 500 khách</option>
                        <option value="medium">500 - 2,000 khách</option>
                        <option value="large">2,000 - 10,000 khách</option>
                        <option value="mega">&gt; 10,000 khách</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-gray-400 font-vietnam text-[0.85rem] font-medium block">Ngân Sách</label>
                      <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} 
                              className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-3.5 text-white font-vietnam text-[0.9rem] focus:outline-none focus:border-[#00FF88]/50 focus:ring-1 focus:ring-[#00FF88]/50 transition-all appearance-none cursor-pointer">
                        <option value="" disabled hidden>Chọn ngân sách...</option>
                        <option value="basic">Cơ bản (Dưới 50M)</option>
                        <option value="standard">Tiêu chuẩn (50M - 200M)</option>
                        <option value="premium">Cao cấp (200M - 500M)</option>
                        <option value="vip">Mega/VIP (Trên 500M)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="space-y-2">
                    <label className="text-gray-400 font-vietnam text-[0.85rem] font-medium block">Ngày Dự Kiến</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                           className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-3.5 text-white font-vietnam text-[0.9rem] focus:outline-none focus:border-[#00FF88]/50 focus:ring-1 focus:ring-[#00FF88]/50 transition-all [color-scheme:dark]" />
                  </div>

                  {/* Row 5 */}
                  <div className="space-y-2">
                    <label className="text-gray-400 font-vietnam text-[0.85rem] font-medium block">Mô Tả Thêm</label>
                    <textarea rows={3} placeholder="Chia sẻ thêm về ý tưởng sự kiện của bạn..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                              className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 font-vietnam text-[0.9rem] focus:outline-none focus:border-[#00FF88]/50 focus:ring-1 focus:ring-[#00FF88]/50 transition-all resize-none" />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="w-full py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 font-vietnam group" 
                          style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.4)', color: 'var(--neon-green)', fontWeight: 700, fontSize: '0.95rem' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--neon-green)'; e.currentTarget.style.color = '#000'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 136, 0.05)'; e.currentTarget.style.color = 'var(--neon-green)'; }}>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                    Gửi Yêu Cầu Báo Giá
                  </button>
                </form>
              )}
            </div>
            
            {/* Ambient Background Element */}
            <div className="fixed right-0 bottom-0 pointer-events-none opacity-30 mix-blend-screen w-[40vw] h-[40vh] blur-[150px] rounded-full z-0" style={{ background: 'radial-gradient(circle, var(--neon-green) 0%, transparent 70%)' }}></div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
