// @ts-nocheck
import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

const portfolioProjects = [
  {
    id: 'son-tung-stadium-2024',
    title: 'Sơn Tùng M-TP – Sky Tour Stadium',
    category: 'mega',
    categoryLabel: 'Mega Concert',
    eventType: 'Live Concert / Stadium',
    location: 'Sân Vận Động Mỹ Đình, Hà Nội',
    scale: '50,000 khán giả',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=1920&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80',
    description: 'Hệ thống laser & kinetic 360° cho đêm nhạc lịch sử tại Mỹ Đình.',
    fullDescription: 'Đêm diễn với hơn 50,000 khán giả, chúng tôi triển khai hệ thống laser 3D toàn cảnh kết hợp 200 đèn kinetic bay, tạo nên màn trình diễn ánh sáng chưa từng thấy tại Việt Nam. Mỗi hiệu ứng được lập trình tùy chỉnh theo từng bài hát, đồng bộ hoàn hảo với âm nhạc và phần biểu diễn trực tiếp.',
    equipment: [
      { name: 'Laser RGB Đa Năng', quantity: '24 units', specs: '30W, ILDA-compatible, full-color' },
      { name: 'Kinetic Moving Light', quantity: '200 units', specs: 'Winch-controlled, programmable flight' },
      { name: 'Laser Beam Projector', quantity: '16 units', specs: '60W, IP65, long-range' },
      { name: 'Haze Machine Pro', quantity: '8 units', specs: 'High-output, water-based' },
      { name: 'DMX Lighting Console', quantity: '2 units', specs: 'MA Lighting grandMA3' },
      { name: 'Truss & Rigging System', quantity: 'Full kit', specs: '200m tổng span' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80',
      'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=800&q=80',
      'https://images.unsplash.com/photo-1772078822311-02f078eb34ed?w=800&q=80',
      'https://images.unsplash.com/photo-1759912301996-3b99deda9996?w=800&q=80',
    ],
    highlight: '200 Kinetic Lights + Laser 360°',
    client: 'M-TP Entertainment',
    duration: '3 ngày setup, 1 đêm diễn',
    color: '#00E5FF',
    sortOrder: 1,
  },
  {
    id: 'vingroup-gala-2024',
    title: 'Vingroup Annual Gala – Diamond Night',
    category: 'vip',
    categoryLabel: 'VIP / Gala',
    eventType: 'Corporate Gala Dinner',
    location: 'JW Marriott, Hà Nội',
    scale: '500 khách VIP',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1753030768124-dba306907bba?w=1920&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1753030768124-dba306907bba?w=800&q=80',
    description: 'Không gian gala sang trọng với laser tinh tế và ánh sáng kinetic đẳng cấp.',
    fullDescription: 'Với quy mô 500 khách mời VIP, chúng tôi thiết kế hệ thống ánh sáng laser tối giản nhưng đẳng cấp, kết hợp 40 đèn kinetic tạo hình theo từng khoảnh khắc của buổi tối. Màn laser khai mạc tạo ra trải nghiệm WOW ngay từ giây đầu tiên.',
    equipment: [
      { name: 'Laser RGB Tinh Tế', quantity: '8 units', specs: '15W, pattern projection' },
      { name: 'Kinetic Pendant Light', quantity: '40 units', specs: 'Custom motion choreography' },
      { name: 'Architectural LED', quantity: '60 units', specs: 'Full-color wash' },
      { name: 'Atmospheric Haze', quantity: '4 units', specs: 'Low-lying fog effect' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1753030768124-dba306907bba?w=800&q=80',
      'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=800&q=80',
      'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=800&q=80',
      'https://images.unsplash.com/photo-1772078822311-02f078eb34ed?w=800&q=80',
    ],
    highlight: 'Laser Tinh Tế + 40 Kinetic Lights',
    client: 'Vingroup Corp',
    duration: '2 ngày setup, 1 đêm tiệc',
    color: '#FF006E',
    sortOrder: 2,
  },
  {
    id: 'sun-fest-2024',
    title: 'Sun Fest 2024 – Da Nang',
    category: 'mega',
    categoryLabel: 'Mega Festival',
    eventType: 'Music Festival',
    location: 'Bãi biển Mỹ Khê, Đà Nẵng',
    scale: '30,000+ khán giả',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=1920&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=800&q=80',
    description: 'Festival âm nhạc bờ biển với hệ thống laser ngoài trời quy mô lớn.',
    fullDescription: 'Sun Fest 2024 là lễ hội âm nhạc ngoài trời lớn nhất miền Trung, diễn ra ngay trên bãi biển Mỹ Khê. Chúng tôi triển khai hệ thống laser weatherproof chuyên biệt, có thể hoạt động trong môi trường biển với độ ẩm cao và gió mạnh, tạo nên màn laser 3D ấn tượng giữa nền trời đêm Đà Nẵng.',
    equipment: [
      { name: 'Outdoor Laser Weatherproof', quantity: '20 units', specs: '40W, IP67, wind-resistant' },
      { name: 'Kinetic Bar Light', quantity: '80 units', specs: 'Outdoor-rated, wireless DMX' },
      { name: 'LED Beam Moving Head', quantity: '120 units', specs: '350W Sharpy beam' },
      { name: 'Laser Aerial Effect', quantity: '12 units', specs: 'Sky tracer, 5km visible' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=800&q=80',
      'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80',
      'https://images.unsplash.com/photo-1574154883606-19fa4f836c54?w=800&q=80',
      'https://images.unsplash.com/photo-1759912301996-3b99deda9996?w=800&q=80',
    ],
    highlight: 'Laser Ngoài Trời IP67 + Sky Tracer',
    client: 'Sun Group Entertainment',
    duration: '5 ngày setup, 2 đêm diễn',
    color: '#00E5FF',
    sortOrder: 3,
  },
  {
    id: 'dam-cuoi-ceo-2024',
    title: 'Đám Cưới CEO – The Luxury Story',
    category: 'vip',
    categoryLabel: 'VIP / Wedding',
    eventType: 'Wedding Ceremony',
    location: 'Grand Ballroom, Park Hyatt Sài Gòn',
    scale: '300 khách mời',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=1920&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=800&q=80',
    description: 'Lễ cưới xa hoa với màn laser lãng mạn và ánh sáng kinetic đầy cảm xúc.',
    fullDescription: 'Một trong những lễ cưới sang trọng nhất Sài Gòn năm 2024. Chúng tôi thiết kế hành trình ánh sáng dọc theo toàn bộ buổi lễ - từ màn laser chào đón khách, hiệu ứng kinetic trong lễ trao nhẫn, đến màn pháo sáng laser hoành tráng kết thúc đêm tiệc.',
    equipment: [
      { name: 'Romantic Laser Projector', quantity: '6 units', specs: '10W pastel colors, soft beam' },
      { name: 'Kinetic Crystal Ball', quantity: '24 units', specs: 'Automated height control' },
      { name: 'Wedding Uplighter', quantity: '80 units', specs: 'Battery-powered, wireless' },
      { name: 'CO2 Jet Special Effect', quantity: '4 units', specs: 'Remote trigger, safe for indoor' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=800&q=80',
      'https://images.unsplash.com/photo-1753030768124-dba306907bba?w=800&q=80',
      'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=800&q=80',
      'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=800&q=80',
    ],
    highlight: 'Laser Lãng Mạn + Kinetic Crystal',
    client: 'Private Client',
    duration: '1 ngày setup, 1 đêm tiệc',
    color: '#FF006E',
    sortOrder: 4,
  },
];

async function main() {
  console.log('Start seeding...');

  // 1. Seed Projects
  for (const project of portfolioProjects) {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { slug: project.id },
    });
    
    if (!existingProject) {
      // Create it
      const categoryEnum = project.category === 'mega' ? 'mega' : (project.category === 'vip' ? 'vip' : 'medium');
      
      await prisma.project.create({
        data: {
          slug: project.id,
          title: project.title,
          category: categoryEnum,
          categoryLabel: project.categoryLabel,
          eventType: project.eventType,
          location: project.location,
          scale: project.scale,
          year: project.year,
          heroImage: project.heroImage,
          thumbnailImage: project.thumbnailImage,
          description: project.description,
          fullDescription: project.fullDescription,
          equipment: project.equipment as any,
          gallery: project.gallery,
          highlight: project.highlight,
          client: project.client,
          duration: project.duration,
          color: project.color,
          sortOrder: project.sortOrder,
        },
      });
      console.log(`Created project: ${project.title}`);
    } else {
      console.log(`Project already exists: ${project.title}`);
    }
  }

  // 2. Default settings
  const siteSettingsStr = JSON.stringify({
    messengerLink: 'https://m.me/nguyenquang.hiep.39',
    zaloLink: 'https://zalo.me/0907579481',
    facebookLink: 'https://www.facebook.com/nguyenquang.hiep.39',
    phone: '0907 579 481',
    address: '600/17 Quang Trung, KP7, Phường Thông Tây Hội, TP Hồ Chí Minh, Việt Nam',
    companyName: 'CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ LASER QH',
    directorName: 'Trang Lê Hoàng Triều',
    directorPhone: '0903913325',
    taxCode: '0319250452',
    bankAccount: '1062510995 ngân hàng Vietcombank',
    companyEmail: 'laserqh2011@gmail.com',
  });

  await prisma.siteSetting.upsert({
    where: { id: 'global' },
    update: { data: siteSettingsStr },
    create: { id: 'global', data: siteSettingsStr },
  });
  console.log('Upserted SiteSettings');

  const mediaSettingsStr = JSON.stringify({
    heroImageUrl: 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=1920&q=80',
    heroVideoUrl: '/videos/hero.mp4',
    heroVideoEnabled: false,
  });

  await prisma.mediaSetting.upsert({
    where: { id: 'global' },
    update: { data: mediaSettingsStr },
    create: { id: 'global', data: mediaSettingsStr },
  });
  console.log('Upserted MediaSettings');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
