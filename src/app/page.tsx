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
import { defaultSiteSettings, defaultMediaSettings, portfolioProjects as mockProjects, SiteSettings, MediaSettings } from '@/lib/data';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const siteSettingData = await prisma.siteSetting.findUnique({ where: { id: 'global' } });
  const siteSettings: SiteSettings = siteSettingData?.data ? (siteSettingData.data as unknown as SiteSettings) : defaultSiteSettings;

  const mediaSettingData = await prisma.mediaSetting.findUnique({ where: { id: 'global' } });
  const mediaSettings: MediaSettings = mediaSettingData?.data ? (mediaSettingData.data as unknown as MediaSettings) : defaultMediaSettings;

  let projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' }
  });

  if (projects.length === 0) {
    projects = mockProjects as any;
  }

  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <JsonLd siteSettings={siteSettings} />
      <Navigation siteSettings={siteSettings} />
      <FloatingButtons siteSettings={siteSettings} />
      <HeroSection siteSettings={siteSettings} mediaSettings={mediaSettings} />
      <FlexibilitySection />
      <ServicesSection />
      <ShowcaseSection projects={projects as any} />
      <WhyChooseUs />
      <ContactSection siteSettings={siteSettings} />
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
