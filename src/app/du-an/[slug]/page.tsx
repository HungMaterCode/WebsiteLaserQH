import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navigation } from '@/components/sections/Navigation';
import { Footer } from '@/components/sections/Footer';
import { defaultSiteSettings, SiteSettings } from '@/lib/data';
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Briefcase,
  Zap,
  Wrench,
  ChevronLeft,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) return { title: 'Dự án không tồn tại' };

  const title = project.seoTitle || `${project.title} — Dự Án Laser Show & Kinetic tại ${project.location}`;
  const description = project.seoDesc || project.description;

  const imageUrl = project.seoImage || project.heroImage || project.thumbnailImage;
  const absoluteImageUrl = imageUrl?.startsWith('http') 
    ? imageUrl 
    : `https://website-laser-qh.vercel.app${imageUrl}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      type: 'article',
    },
    alternates: {
      canonical: `https://website-laser-qh.vercel.app/du-an/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const siteSettingData = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
  const siteSettings: SiteSettings = siteSettingData?.data ? (siteSettingData.data as unknown as SiteSettings) : defaultSiteSettings;

  const project = await prisma.project.findUnique({
    where: { slug, published: true },
  });

  if (!project) notFound();

  // Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event', // or CreativeWork/Organization
    'name': project.seoTitle || project.title,
    'description': project.seoDesc || project.description,
    'image': project.seoImage || project.heroImage,
    'location': {
      '@type': 'Place',
      'name': project.location,
      'address': project.location
    },
    'startDate': `${project.year}-01-01`,
    'organizer': {
      '@type': 'Organization',
      'name': 'Laser QH Production',
      'url': 'https://website-laser-qh.vercel.app'
    }
  };

  const equipment = project.equipment as any[];

  // Helper to render content that could be either pure HTML (from the new editor)
  // or old plain text (from the previous textarea)
  const renderDescription = (text: string) => {
    if (!text) return null;

    // Clean string: The Quill editor replaces ALL regular spaces with &nbsp; (non-breaking spaces),
    // making the entire paragraph one unbreakable string. The browser then breaks mid-word.
    // Fix: Replace &nbsp; HTML entities and raw \u00A0 with regular spaces.
    const sanitizedText = text
      .replace(/&nbsp;/gi, ' ')                              // HTML entity &nbsp; → regular space
      .replace(/&#0*160;/g, ' ')                              // HTML numeric entity &#160; → regular space
      .replace(/&#x0*[Aa]0;/g, ' ')                           // HTML hex entity &#xA0; → regular space
      .replace(/[\u00a0]/g, ' ')                               // Raw Unicode non-breaking space → regular space
      .replace(/[\u00ad\u200b\u200c\u200d\ufeff]/g, '');       // Remove soft hyphens, zero-width spaces

    // Check if it's HTML or plain text
    const isHtml = sanitizedText.trim().startsWith('<') || sanitizedText.includes('</p>') || sanitizedText.includes('<br') || sanitizedText.includes('<img');

    if (isHtml) {
      return (
        <div
          className="text-white/70 text-lg rich-text-content"
          style={{ fontFamily: 'var(--font-vietnam)' }}
          dangerouslySetInnerHTML={{ __html: sanitizedText }}
        />
      );
    }

    // Otherwise, treat as plain text and handle newlines
    return (
      <div className="text-white/70 leading-relaxed text-lg rich-text-content" style={{ fontFamily: 'var(--font-vietnam)' }}>
        {sanitizedText.split('\n\n').map((para, i) => (
          <p key={i} className="mb-6">{para}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#02050A' }}>
      <JsonLd siteSettings={siteSettings} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation siteSettings={siteSettings} />

      <style dangerouslySetInnerHTML={{
        __html: `
        .rich-text-content {
          word-break: normal !important;
          overflow-wrap: break-word !important;
          hyphens: none !important;
          -webkit-hyphens: none !important;
          text-justify: inter-word !important;
        }
        .rich-text-content p, .rich-text-content div, .rich-text-content span {
          word-break: normal !important;
          overflow-wrap: break-word !important;
          hyphens: none !important;
          -webkit-hyphens: none !important;
        }
        .rich-text-content .ql-align-justify {
          text-align: justify !important;
          text-justify: inter-word !important;
        }
        .rich-text-content .ql-align-center {
          text-align: center !important;
        }
        .rich-text-content .ql-align-right {
          text-align: right !important;
        }
        .rich-text-content p {
          margin-bottom: 2rem !important;
          line-height: 1.8 !important;
        }
        .rich-text-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 16px !important;
          margin: 3rem auto !important;
          display: block !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
        }
        .rich-text-content a {
          color: #00FF88 !important;
          text-decoration: underline !important;
        }
      `}} />

      <main className="flex-grow pt-24">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-white/5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[0.65rem] sm:text-[0.75rem] font-medium text-white/40 uppercase tracking-widest font-header">
            <Link href={`/#project-${project.slug}`} scroll={false} className="hover:text-white transition-colors">TRANG CHỦ</Link>
            <ChevronLeft size={10} className="rotate-180 text-white/30" />
            <span className="hidden xs:inline text-white/20">DỰ ÁN</span>
            <ChevronLeft size={10} className="rotate-180 text-white/30 hidden xs:inline" />
            <span style={{ color: project.color }} className="truncate max-w-[200px] sm:max-w-none">{project.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section
          className="relative h-[45vh] md:h-[60vh] min-h-[400px] md:min-h-[500px] overflow-hidden shadow-2xl"
          style={{
            backgroundImage: `url(${project.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'auto'
          }}
        >
          {/* Subtle Grain to enhance perceived detail */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

          {/* Optimized Overlay - Pure and Deep at the bottom only */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050A] via-[#02050A]/20 to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-16">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full text-[0.7rem] font-bold font-header tracking-[0.2em] backdrop-blur-md"
                    style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${project.color}60`, color: project.color }}>
                    {project.categoryLabel.toUpperCase()}
                  </span>
                  <div className="h-px w-12 bg-white/20" />
                  <span className="text-white/60 text-xs font-header tracking-widest uppercase">{project.eventType}</span>
                </div>

                <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-8 leading-[1.1] font-header">
                  {project.title}
                </h1>

                <div className="flex flex-wrap gap-6 text-white/70">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                      <MapPin size={18} style={{ color: project.color }} />
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-bold text-white/30 uppercase tracking-widest font-header mb-0.5">Địa điểm</div>
                      <div className="text-sm font-semibold">{project.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                      <Calendar size={18} style={{ color: project.color }} />
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-bold text-white/30 uppercase tracking-widest font-header mb-0.5">Thời gian</div>
                      <div className="text-sm font-semibold">Năm {project.year}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              {/* Main Content */}
              <div className="lg:col-span-8 min-w-0 w-full">
                <div className="mb-12">
                  <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3 font-header">
                    <span className="w-1.5 h-8 rounded-full" style={{ background: project.color }}></span>
                    Tổng Quan Dự Án
                  </h2>
                  <div className="w-full">
                    {renderDescription(project.fullDescription)}
                  </div>
                </div>

                {/* Equipment Showcase */}
                {equipment && equipment.length > 0 && (
                  <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] relative overflow-hidden mb-16">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Wrench size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
                        <Wrench size={22} style={{ color: project.color }} />
                      </div>
                      <div>
                        <h3 className="text-white text-xl font-bold font-header">Vũ Khí Ánh Sáng Sử Dụng</h3>
                        <p className="text-white/30 text-xs font-body">Phần cứng tối tân được triển khai tại hiện trường</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {equipment.map((eq, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-black/40 text-white/50 font-header text-xs">
                            {eq.quantity}
                          </div>
                          <div>
                            <div className="text-white/90 text-sm font-bold">{eq.name}</div>
                            <div className="text-white/30 text-[0.7rem]">{eq.specs}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 min-w-0 w-full">
                <div className="sticky top-32 space-y-8">
                  <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
                    <h3 className="text-white/40 text-[0.7rem] font-bold tracking-[0.2em] font-header mb-8 uppercase">Chi tiết dự án</h3>

                    <div className="space-y-6">
                      {[
                        { label: 'QUY MÔ', value: project.scale, icon: Users },
                        { label: 'KHÁCH HÀNG', value: project.client, icon: Briefcase },
                        { label: 'THỜI GIAN', value: project.duration, icon: Clock },
                        { label: 'NỔI BẬT', value: project.highlight, icon: Zap },
                      ].map((stat, i) => (
                        <div key={i} className="flex items-start gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${project.color}10`, border: `1px solid ${project.color}20` }}>
                            <stat.icon size={16} style={{ color: project.color }} />
                          </div>
                          <div>
                            <div className="text-[0.65rem] font-bold text-white/30 tracking-widest font-header mb-1">{stat.label}</div>
                            <div className="text-white/90 text-[0.9rem] font-bold">{stat.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Card */}
                  <div className="p-8 rounded-3xl border-2 overflow-hidden relative" style={{ borderColor: `${project.color}40`, background: `${project.color}05` }}>
                    <div className="absolute top-0 right-0 w-32 h-32 blur-[60px]" style={{ background: project.color }} />
                    <div className="relative z-10">
                      <h4 className="text-white text-xl font-bold mb-4 font-header">Bạn muốn tổ chức một show tương tự?</h4>
                      <p className="text-white/60 text-sm mb-6 leading-relaxed font-body">Để Laser QH tư vấn giải pháp ánh sáng & hiệu ứng tối ưu nhất cho sự kiện của bạn tại {project.location.split(',').pop()?.trim()}.</p>

                      <Link
                        href="/#contact"
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] font-header"
                        style={{ background: project.color, color: '#000' }}
                      >
                        <MessageSquare size={16} />
                        Nhận Tư Vấn & Báo Giá
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} />
    </div>
  );
}
