import type { Metadata } from "next";
import { Be_Vietnam_Pro, Kanit, Inter, Orbitron } from "next/font/google";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-body',
});

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-header',
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

import "./globals.css";
import { AuthProvider } from "@/components/admin/AuthProvider";

import { prisma } from "@/lib/prisma";
import { defaultSiteSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  let settings = defaultSiteSettings;
  try {
    const data = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
    if (data?.data) settings = data.data as any;
  } catch (e) {}

  return {
    metadataBase: new URL('https://website-laser-qh.vercel.app'),
    title: {
      default: `${settings.companyName} — Dịch Vụ Laser & Kinetic Hàng Đầu`,
      template: `%s | ${settings.companyName}`,
    },
    description: `Chuyên cung cấp dịch vụ laser show, kinetic lighting, moving head cho concert, sự kiện. 500+ sự kiện thành công, 10+ năm kinh nghiệm tại Việt Nam.`,
    keywords: ['laser show', 'laser event vietnam', 'kinetic lighting', 'laser qh', 'dịch vụ laser', 'laser sự kiện', 'concert lighting', 'laser show việt nam', 'thuê laser sự kiện'],
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      siteName: settings.companyName,
      title: `${settings.companyName} — Dịch Vụ Laser & Kinetic Hàng Đầu`,
      description: 'Chất lượng Mega Concert cho mọi quy mô. 500+ sự kiện thành công tại Việt Nam.',
      images: [{ url: 'https://website-laser-qh.vercel.app/logo.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: { index: true, follow: true },
    alternates: { canonical: 'https://website-laser-qh.vercel.app' },
    icons: {
      icon: '/logo.jpg',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${kanit.variable} ${inter.variable} ${orbitron.variable}`}>
      <body className="font-body">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
