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

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <JsonLd />
      <Navigation />
      <FloatingButtons />
      <HeroSection />
      <FlexibilitySection />
      <ServicesSection />
      <ShowcaseSection />
      <WhyChooseUs />
      <ContactSection />
      <Footer />
    </div>
  );
}
