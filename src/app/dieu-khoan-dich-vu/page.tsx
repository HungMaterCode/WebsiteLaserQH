import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Navigation } from '@/components/sections/Navigation';
import { Footer } from '@/components/sections/Footer';
import { defaultSiteSettings, SiteSettings } from '@/lib/data';
import { FileText, ClipboardList, AlertTriangle, ShieldCheck, HelpCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Điều Khoản Dịch Vụ | Laser QH Production',
  description: 'Các quy định và thỏa thuận sử dụng dịch vụ tại Laser QH Production.',
};

export default async function TermsPage() {
  const siteSettingData = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
  const siteSettings: SiteSettings = siteSettingData?.data ? (siteSettingData.data as unknown as SiteSettings) : defaultSiteSettings;

  const sections = [
    {
      id: 'dich-vu',
      title: '1. Cung cấp dịch vụ',
      content: `Laser QH Production chuyên cung cấp các giải pháp kỹ thuật trình diễn ánh sáng bao gồm:
      - Hệ thống Laser Mapping 3D.
      - Hệ thống Kinetic Lighting & Motion Control.
      - Thiết kế và lập trình Show kỹ thuật cao.
      Chúng tôi cam kết cung cấp thiết bị và nhân sự đạt tiêu chuẩn chất lượng đã thỏa thuận trong hợp đồng.`
    },
    {
      id: 'dat-hang',
      title: '2. Đặt hàng và Thanh toán',
      content: `Khách hàng thực hiện các bước sau:
      - Gửi yêu cầu tư vấn và nhận báo giá.
      - Xác nhận hợp đồng và thực hiện đặt cọc theo quy định (thông thường 30-50% giá trị hợp đồng).
      - Thanh toán phần còn lại sau khi hoàn tất bàn giao hoặc kết thúc sự kiện tùy theo thỏa thuận.`
    },
    {
      id: 'trach-nhiem',
      title: '3. Trách nhiệm của Khách hàng',
      content: `Khách hàng có trách nhiệm phối hợp cùng chúng tôi để đảm bảo sự kiện diễn ra tốt đẹp:
      - Cung cấp sơ đồ mặt bằng và nguồn điện đạt chuẩn.
      - Đảm bảo an ninh tại khu vực thi công và vận hành thiết bị.
      - Xin các giấy phép cần thiết liên quan đến việc tổ chức sự kiện và sử dụng thiết bị kỹ thuật cao.`
    },
    {
      id: 'huy-bo',
      title: '4. Hủy bỏ và Bồi thường',
      content: `Trong trường hợp thay đổi kế hoạch hoặc hủy bỏ sự kiện:
      - Thông báo trước ít nhất 07 ngày làm việc để được hỗ trợ bảo lưu hoặc hoàn trả một phần chi phí tùy trường hợp.
      - Nếu việc bàn giao thiết bị gặp sự cố do phía khách hàng (sai lệch nguồn điện, mặt bằng không đạt chuẩn), khách hàng chịu trách nhiệm bồi thường các chi phí phát sinh.`
    },
    {
      id: 'so-huu',
      title: '5. Bản quyền và Hình ảnh',
      content: `Chúng tôi có quyền sử dụng hình ảnh, video ghi lại quá trình làm việc và thành quả trình diễn cho mục đích quảng bá thương hiệu (Portfolio), trừ khi có thỏa thuận bảo mật đặc biệt từ phía khách hàng.`
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
            <ClipboardList size={12} /> Terms & Conditions
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-header">
            Điều Khoản <span className="text-[#00FF88]">Dịch Vụ</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Các quy định dưới đây nhằm đảm bảo tính chuyên nghiệp và sự minh bạch trong quá trình hợp tác giữa Laser QH và quý khách hàng.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-32 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar TOC */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-4">
              <h3 className="text-white font-bold text-xs tracking-widest uppercase opacity-30 mb-6">Điều khoản chính</h3>
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
                    Áp dụng từ ngày:<br />
                    <span className="text-gray-300 font-bold">01 Tháng 1, 2025</span>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Attention Box */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#00FF88]/[0.03] border border-[#00FF88]/20 flex gap-4 md:gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-[#00FF88]/10 flex items-center justify-center text-[#00FF88] shrink-0 border border-[#00FF88]/20">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg mb-2">Lưu ý quan trọng</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Việc ký kết hợp đồng hoặc sử dụng bất kỳ dịch vụ nào do Laser QH cung cấp đồng nghĩa với việc quý khách đã đọc, hiểu và đồng ý với các điều khoản nêu trong tài liệu này. 
                </p>
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

            {/* Support Info */}
            <div className="pt-12 border-t border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00FF88]/30 transition-colors">
                  <ShieldCheck className="text-[#00FF88] mb-4" size={28} />
                  <h3 className="text-white font-bold mb-2">Đảm bảo kỹ thuật</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Mọi quy trình thi công đều tuân thủ các quy định an toàn điện và an toàn hiệu ứng Laser nghiêm ngặt.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00FF88]/30 transition-colors">
                  <HelpCircle className="text-[#00FF88] mb-4" size={28} />
                  <h3 className="text-white font-bold mb-2">Hỗ trợ 24/7</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Kỹ thuật viên của chúng tôi luôn túc trực trong suốt quá trình sự kiện diễn ra để xử lý các vấn đề phát sinh.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
