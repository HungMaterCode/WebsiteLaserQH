import type { Metadata } from "next";
import { Be_Vietnam_Pro, Exo_2, Orbitron } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/admin/AuthProvider";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-vietnam',
});

const exo2 = Exo_2({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-exo',
});

const orbitron = Orbitron({
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://laserqh.vn'),
  title: {
    default: 'Laser QH Production — Dịch Vụ Laser & Kinetic Hàng Đầu Việt Nam',
    template: '%s | Laser QH Production',
  },
  description: 'Laser QH Production — Chuyên cung cấp dịch vụ laser show, kinetic lighting, moving head cho concert, sự kiện, tiệc cưới tại Việt Nam. 500+ sự kiện thành công, 10+ năm kinh nghiệm.',
  keywords: ['laser show', 'laser event vietnam', 'kinetic lighting', 'laser qh', 'dịch vụ laser', 'laser sự kiện', 'concert lighting', 'laser show việt nam', 'thuê laser sự kiện'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Laser QH Production',
    title: 'Laser QH Production — Dịch Vụ Laser & Kinetic Hàng Đầu Việt Nam',
    description: 'Chất lượng Mega Concert cho mọi quy mô. 500+ sự kiện thành công tại Việt Nam.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://laserqh.vn' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${exo2.variable} ${orbitron.variable}`}>
      <body className="font-vietnam" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
