'use client';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Award, Cpu, Users, ShieldCheck, TrendingUp, Clock3 } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Kinh Nghiệm Được Chứng Minh',
    valueHighlight: '500+',
    valueText: 'Sự Kiện',
    description: 'Hơn 10 năm trong ngành, đã thực hiện 500+ sự kiện từ tiệc cưới thân mật đến đại nhạc hội sân vận động 50,000 người.',
    color: 'var(--neon-green)'
  },
  {
    icon: Cpu,
    title: 'Kho Thiết Bị Đỉnh Cao',
    valueHighlight: '1,000+',
    valueText: 'Thiết Bị',
    description: 'Đầu tư hàng chục tỷ đồng vào thiết bị laser và kinetic nhập khẩu chính hãng từ các thương hiệu hàng đầu thế giới.',
    color: 'var(--neon-cyan)'
  },
  {
    icon: Users,
    title: 'Đội Ngũ Chuyên Nghiệp',
    valueHighlight: '50+',
    valueText: 'Chuyên Gia',
    description: 'Kỹ thuật viên được đào tạo chuyên sâu, có kinh nghiệm làm việc với các tên tuổi lớn nhất showbiz Việt Nam.',
    color: 'var(--neon-green)'
  },
  {
    icon: ShieldCheck,
    title: 'An Toàn Là Ưu Tiên Số 1',
    valueHighlight: '0',
    valueText: 'Sự Cố',
    description: 'Tất cả thiết bị đều được kiểm tra an toàn định kỳ, đạt chuẩn quốc tế. Đội dự phòng luôn sẵn sàng trong mọi tình huống.',
    color: 'var(--neon-cyan)'
  },
  {
    icon: TrendingUp,
    title: 'Phục Vụ Mọi Quy Mô',
    valueHighlight: '3',
    valueText: 'Cấp Độ',
    description: 'Không phân biệt sự kiện lớn hay nhỏ — chúng tôi mang cùng một tiêu chuẩn chất lượng và sự chuyên tâm đến mọi dự án.',
    color: '#9D00FF' // Purple
  },
  {
    icon: Clock3,
    title: 'Hỗ Trợ 24/7',
    valueHighlight: '24/7',
    valueText: 'Hỗ Trợ',
    description: 'Luôn có mặt trước, trong và sau sự kiện. Đội hỗ trợ kỹ thuật sẵn sàng 24/7 để đảm bảo mọi thứ hoàn hảo.',
    color: 'var(--neon-green)'
  }
];

const partners = ['Sơn Tùng M-TP', 'Vingroup', 'Samsung VN', 'Sun Group', 'Mỹ Tâm', 'Viettel', 'FPT', 'Lotte Vietnam'];

export function WhyChooseUs() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-50px' });

  return (
    <section id="why-us" className="relative py-24 px-4 sm:px-6" style={{ background: '#02050A' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <motion.div ref={titleRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : 30 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="font-orbitron mb-4 font-semibold tracking-widest text-[0.7rem] uppercase" style={{ color: 'var(--neon-green)' }}>
            — TẠI SAO CHỌN CHÚNG TÔI —
          </p>
          <h2 className="font-orbitron mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
            <span className="text-white block">Uy Tín Được Xây Dựng</span>
            <span className="block" style={{ color: 'var(--neon-green)' }}>Từ Mỗi Tia Laser</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', fontFamily: 'var(--font-vietnam)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.8 }}>
            Không phải ngẫu nhiên mà những cái tên lớn nhất showbiz và doanh nghiệp Việt Nam luôn chọn chúng tôi.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-7 rounded-[20px] flex flex-col gap-4 relative overflow-hidden group transition-all duration-300"
                style={{ background: '#050912', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
              >
                {/* Subtle Background Glow corresponding to color */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity duration-500" style={{ background: reason.color }} />
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: `${reason.color}10`, border: `1px solid ${reason.color}25` }}>
                    <Icon size={24} style={{ color: reason.color }} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-white font-bold mb-1" style={{ fontSize: '1.05rem', fontFamily: 'var(--font-vietnam)', lineHeight: 1.3 }}>{reason.title}</h3>
                    <div className="flex items-center gap-1.5 font-orbitron font-bold" style={{ color: reason.color, fontSize: '1.1rem', letterSpacing: '0.02em' }}>
                      {reason.valueHighlight}
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'var(--font-vietnam)', fontWeight: 500, letterSpacing: '0' }}>{reason.valueText}</span>
                    </div>
                  </div>
                </div>
                
                <p className="relative z-10" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontFamily: 'var(--font-vietnam)', lineHeight: 1.6 }}>
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trusted By Section */}
        <div className="relative mt-20">
          <div className="relative py-8">
            {/* Laser Line Above Title */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] opacity-20" 
                 style={{ 
                   background: 'linear-gradient(90deg, transparent 0%, var(--neon-green) 50%, transparent 100%)',
                   boxShadow: '0 0 10px rgba(0, 255, 136, 0.1)' 
                 }} />

            <p className="text-center font-orbitron font-bold tracking-[0.3em] uppercase" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>
              TIN TƯỞNG BỞI
            </p>
          </div>
          
          <div className="relative pt-12 pb-32">
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              {partners.map(partner => (
                <span key={partner} className="font-vietnam font-bold tracking-wide transition-all duration-300 opacity-25 hover:opacity-100 hover:text-[var(--neon-green)]" 
                      style={{ color: 'white', fontSize: '0.85rem' }}>
                  {partner}
                </span>
              ))}
            </div>

            {/* Laser Line Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] opacity-40" 
                 style={{ 
                   background: 'linear-gradient(90deg, transparent 0%, var(--neon-green) 50%, transparent 100%)',
                   boxShadow: '0 0 10px rgba(0, 255, 136, 0.2)' 
                 }} />
          </div>
        </div>

      </div>
    </section>
  );
}
