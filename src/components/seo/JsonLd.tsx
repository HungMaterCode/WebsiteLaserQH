import { SiteSettings } from '@/lib/data';

export function JsonLd({ siteSettings: settings }: { siteSettings: SiteSettings }) {

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.companyName,
    alternateName: 'Laser QH Production',
    description: 'Chuyên cung cấp dịch vụ laser show, kinetic lighting, moving head cho concert, sự kiện, tiệc cưới tại Việt Nam.',
    url: 'https://website-laser-qh.vercel.app',
    telephone: settings.phone,
    email: settings.companyEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
    },
    sameAs: [settings.facebookLink],
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Dịch Vụ Laser Show & Kinetic Lighting',
    provider: {
      '@type': 'LocalBusiness',
      name: settings.companyName,
    },
    description: 'Cung cấp hệ thống laser show, kinetic lighting, moving head, special effects cho concert, festival, tiệc cưới, gala doanh nghiệp tại Việt Nam.',
    areaServed: {
      '@type': 'Country',
      name: 'Vietnam',
    },
    serviceType: ['Laser Show', 'Kinetic Lighting', 'Event Lighting', 'Concert Production'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
