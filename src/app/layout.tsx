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
  const BASE_URL = 'https://website-laser-qh.vercel.app';
  let settings = defaultSiteSettings;

  try {
    // Thêm timeout để tránh việc treo trang web nếu database không phản hồi
    const data = await Promise.race([
      prisma.siteSetting.findUnique({ where: { id: 'global' } }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4000))
    ]) as any;
    
    if (data?.data) settings = data.data as any;
  } catch (e) {
    console.error('Metadata fetch failed, using defaults');
  }

  const siteTitle = `${settings.companyName} — Dịch Vụ Laser & Kinetic Hàng Đầu`;
  const siteDesc = 'Chuyên cung cấp dịch vụ laser show, kinetic lighting, moving head cho concert, sự kiện. 500+ sự kiện thành công tại Việt Nam.';

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${settings.companyName}`,
    },
    description: siteDesc,
    keywords: ['laser show', 'laser event vietnam', 'kinetic lighting', 'laser qh', 'dịch vụ laser', 'laser sự kiện', 'concert lighting', 'laser show việt nam', 'thuê laser sự kiện'],
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      siteName: settings.companyName,
      title: siteTitle,
      description: siteDesc,
      images: [
        {
          url: `${BASE_URL}/logo-v4.png`,
          width: 1360,
          height: 1306,
          alt: settings.companyName,
          type: 'image/png',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDesc,
      images: [`${BASE_URL}/logo-v4.png`],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: BASE_URL },
    icons: {
      icon: '/logo-v4.png',
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
