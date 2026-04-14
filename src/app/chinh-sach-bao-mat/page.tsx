import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Navigation } from '@/components/sections/Navigation';
import { Footer } from '@/components/sections/Footer';
import { defaultSiteSettings, SiteSettings } from '@/lib/data';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật | Laser QH Production',
  description: 'Cam kết bảo mật thông tin khách hàng và dữ liệu cá nhân tại Laser QH Production.',
};

export default async function PrivacyPage() {
  const siteSettingData = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
  const siteSettings: SiteSettings = siteSettingData?.data ? (siteSettingData.data as unknown as SiteSettings) : defaultSiteSettings;

  const sections = [
    {
      id: 'thu-thap',
      title: '1. Thu thập thông tin',
      content: `Chúng tôi thu thập thông tin khi bạn đăng ký nhận tư vấn, gửi yêu cầu báo giá hoặc liên hệ trực tiếp với chúng tôi. Các thông tin bao gồm:
      - Họ và tên
      - Số điện thoại
      - Địa chỉ Email
      - Thông tin về sự kiện/dự án của bạn`
    },
    {
      id: 'su-dung',
      title: '2. Sử dụng thông tin',
      content: `Bất kỳ thông tin nào chúng tôi thu thập từ bạn có thể được sử dụng để:
      - Cá nhân hóa trải nghiệm của bạn và đáp ứng nhu cầu cụ thể của bạn.
      - Cung cấp nội dung tư vấn giải pháp ánh sáng & kỹ thuật tối ưu.
      - Cải thiện dịch vụ khách hàng và hỗ trợ kỹ thuật.
      - Liên hệ qua email hoặc số điện thoại để trao đổi về dự án.`
    },
    {
      id: 'bao-ve',
      title: '3. Bảo vệ thông tin',
      content: `Chúng tôi triển khai một loạt các biện pháp an ninh để duy trì sự an toàn của thông tin cá nhân của bạn. Chúng tôi sử dụng mã hóa hiện đại (SSL) để bảo vệ thông tin nhạy cảm được truyền trực tuyến. Chỉ những nhân viên có quyền hạn cụ thể mới được truy cập vào thông tin cá nhân của khách hàng.`
    },
    {
      id: 'doi-tac',
      title: '4. Tiết lộ cho bên thứ ba',
      content: `Chúng tôi không bán, trao đổi, hoặc chuyển giao các thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào. Điều này không bao gồm các bên đối tác đáng tin cậy hỗ trợ chúng tôi trong việc vận hành trang web hoặc thực hiện các dự án sự kiện, miễn là các bên này đồng ý giữ bí mật thông tin này.`
    },
    {
      id: 'dong-y',
      title: '5. Sự đồng ý',
      content: `Bằng cách sử dụng trang web của chúng tôi hoặc để lại thông tin tư vấn, bạn đồng ý với chính sách bảo mật của chúng tôi.`
    }
  ];

  return (
    <main className="bg-[#02050A] min-h-screen font-body">
      <Navigation siteSettings={siteSettings} />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[#00FF88] opacity-[0.03] blur-[120px] pointer-events-none rounded-full" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] text-[0.7rem] font-bold tracking-widest uppercase mb-6">
            <Shield size={12} /> Legal Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-header">
            Chính Sách <span className="text-[#00FF88]">Bảo Mật</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Tại Laser QH Production, chúng tôi coi trọng sự riêng tư của khách hàng. Tài liệu này giải thích cách chúng tôi bảo vệ dữ liệu của bạn trong quá trình làm việc.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-32 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar TOC */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-4">
              <h3 className="text-white font-bold text-xs tracking-widest uppercase opacity-30 mb-6">Mục lục</h3>
              <nav className="flex flex-col gap-3">
                {sections.map(s => (
                  <a key={s.id} href={`#${s.id}`} className="text-gray-500 hover:text-[#00FF88] text-sm transition-colors duration-200 border-l border-white/5 pl-4 hover:border-[#00FF88]">
                    {s.title.split('. ')[1]}
                  </a>
                ))}
              </nav>
              <div className="pt-8">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[0.65rem] text-gray-500 leading-relaxed italic">
                    Cập nhật lần cuối:<br />
                    <span className="text-gray-300 font-bold">14 Tháng 4, 2026</span>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* Quick Summary Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF88] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center text-[#00FF88]">
                    <Eye size={20} />
                  </div>
                  <h2 className="text-white font-bold text-lg">Tóm tắt nhanh</h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Dữ liệu chỉ dùng để tư vấn dự án.',
                    'Không chia sẻ cho bên thứ ba.',
                    'Mã hóa SSL chuẩn quốc tế.',
                    'Xóa dữ liệu khi khách hàng yêu cầu.'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <ChevronRight size={14} className="mt-1 text-[#00FF88] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-16">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-4">
                    <span className="w-1 h-8 rounded-full bg-[#00FF88]" />
                    {section.title}
                  </h2>
                  <div className="text-gray-400 leading-relaxed text-[0.95rem] whitespace-pre-wrap md:pl-5 border-l border-white/5 ml-0.5">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Footer */}
            <div className="pt-12 border-t border-white/5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-[#00FF88]/[0.02] border border-[#00FF88]/10">
                <div>
                  <h3 className="text-white font-bold mb-2">Bạn có thắc mắc về quyền riêng tư?</h3>
                  <p className="text-gray-500 text-sm">Hãy liên hệ với bộ phận phụ trách dữ liệu của chúng tôi.</p>
                </div>
                <Link href="/#contact" className="px-6 py-3 rounded-xl bg-[#00FF88] text-black font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                  Gửi yêu cầu
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
