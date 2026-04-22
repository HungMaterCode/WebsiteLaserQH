import { Navigation } from '@/components/sections/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { FlexibilitySection } from '@/components/sections/FlexibilitySection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ShowcaseSection } from '@/components/sections/ShowcaseSection';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';
import { FloatingButtons } from '@/components/sections/FloatingButtons';
import { JsonLd } from '@/components/seo/JsonLd';

import { prisma } from '@/lib/prisma';
import { defaultSiteSettings, defaultMediaSettings, portfolioProjects as mockProjects, SiteSettings, MediaSettings, PortfolioProject } from '@/lib/data';

export const revalidate = 60; // Revalidate every 60 seconds

// Helper to prevent infinite hangs on database calls
const withTimeout = (promise: Promise<any>, timeoutMs: number) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), timeoutMs))
  ]);
};

export default async function Home() {
  let siteSettings: SiteSettings = defaultSiteSettings;
  let mediaSettings: MediaSettings = defaultMediaSettings;
  let projects: PortfolioProject[] = mockProjects;

  try {
    // We try to fetch all data with a timeout to avoid infinite loading screen
    const [siteSettingData, mediaSettingData, projectsData] = await withTimeout(
      Promise.all([
        prisma.siteSetting.findUnique({ where: { id: 'global' } }),
        prisma.mediaSetting.findUnique({ where: { id: 'global' } }),
        prisma.project.findMany({
          where: { published: true },
          orderBy: { sortOrder: 'asc' }
        })
      ]),
      8000 // 8 seconds timeout
    );

    if (siteSettingData?.data) {
      siteSettings = siteSettingData.data as unknown as SiteSettings;
    }

    if (mediaSettingData?.data) {
      mediaSettings = mediaSettingData.data as unknown as MediaSettings;
    }

    if (projectsData && projectsData.length > 0) {
      projects = projectsData as any;
    }
  } catch (error) {
    console.error('Data fetch failed or timed out, using mock data:', error);
  }

  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <JsonLd siteSettings={siteSettings} />
      <Navigation siteSettings={siteSettings} />
      <FloatingButtons siteSettings={siteSettings} />
      <HeroSection siteSettings={siteSettings} mediaSettings={mediaSettings} />
      <FlexibilitySection />
      <ServicesSection />
      <ShowcaseSection projects={projects as any} siteSettings={siteSettings} />
      <WhyChooseUs />
      <ContactSection siteSettings={siteSettings} />
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
