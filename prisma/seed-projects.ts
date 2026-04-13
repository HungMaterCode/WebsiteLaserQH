import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();
neonConfig.webSocketConstructor = ws;

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log('Cleaning up existing projects...');
  // Delete existing projects to make it "clean" as requested
  await prisma.project.deleteMany({});

  console.log('Seeding 3 high-quality projects...');

  const projects = [
    {
      title: 'Sơn Tùng M-TP – Sky Tour Stadium 2024',
      slug: 'son-tung-sky-tour-2024',
      category: 'mega',
      categoryLabel: 'Mega Concert',
      eventType: 'Live Concert / Stadium',
      location: 'Sân Vận Động Mỹ Đình, Hà Nội',
      scale: '50,000 khán giả',
      year: 2024,
      heroImage: 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=1920&q=80',
      thumbnailImage: 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80',
      description: 'Hệ thống laser & kinetic 360° cho đêm nhạc lịch sử tại Mỹ Đình.',
      fullDescription: `Để chuẩn bị cho Sky Tour Stadium 2024 của nghệ sĩ Sơn Tùng M-TP, Laser QH Production tự hào là đơn vị đảm nhận giải pháp ánh sáng Laser và hệ thống Kinetic Lighting toàn cảnh. Đêm diễn với hơn 50,000 khán giả tại Hà Nội đã chứng kiến những màn trình diễn ánh sáng chưa từng thấy tại Việt Nam.

Chúng tôi triển khai hệ thống 24 bộ Laser RGB đa năng công suất 30W với độ phủ 360 độ quanh sân vận động Mỹ Đình. Điểm nhấn của show diễn là 200 đèn Kinetic bay được lập trình đồng bộ tuyệt đối với giai điệu âm nhạc, tạo nên một không gian 3D huyền ảo. 

Màn trình diễn không chỉ là ánh sáng, mà là sự kết hợp giữa công nghệ điều khiển grandMA3 hiện đại và tư duy nghệ thuật của đội ngũ kỹ thuật viên hơn 10 năm kinh nghiệm. Đây là minh chứng cho năng lực triển khai các sự kiện quy mô lớn nhất Việt Nam của chúng tôi.`,
      equipment: [
        { name: 'Laser RGB Đa Năng', quantity: '24 units', specs: '30W, ILDA-compatible, full-color' },
        { name: 'Kinetic Moving Light', quantity: '200 units', specs: 'Winch-controlled, programmable flight' },
        { name: 'Laser Beam Projector', quantity: '16 units', specs: '60W, IP65, long-range' },
        { name: 'DMX Lighting Console', quantity: '2 units', specs: 'MA Lighting grandMA3' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80',
        'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=800&q=80',
        'https://images.unsplash.com/photo-1772078822311-02f078eb34ed?w=800&q=80'
      ],
      highlight: '200 Kinetic Lights + Laser 360°',
      client: 'M-TP Entertainment',
      duration: '3 ngày setup, 1 đêm diễn',
      color: '#00E5FF',
      sortOrder: 1,
      seoTitle: 'Laser Show Sơn Tùng M-TP Sky Tour 2024 tại Sân vận động Mỹ Đình Hà Nội',
      seoDesc: 'Dự án ánh sáng Laser & Kinetic đỉnh cao cho đêm nhạc Sơn Tùng M-TP tại Mỹ Đình. Laser QH Production triển khai 24 bộ Laser 30W và 200 đèn Kinetic.'
    },
    {
      title: 'Vingroup Annual Gala – Diamond Night',
      slug: 'vingroup-gala-diamond-night',
      category: 'vip',
      categoryLabel: 'VIP / Gala',
      eventType: 'Corporate Gala Dinner',
      location: 'JW Marriott Hotel, Hà Nội',
      scale: '500 khách VIP',
      year: 2024,
      heroImage: 'https://images.unsplash.com/photo-1753030768124-dba306907bba?w=1920&q=80',
      thumbnailImage: 'https://images.unsplash.com/photo-1753030768124-dba306907bba?w=800&q=80',
      description: 'Không gian gala sang trọng với laser tinh tế và ánh sáng kinetic đẳng cấp.',
      fullDescription: `Tại sự kiện Gala thường niên của tập đoàn Vingroup, Laser QH Production đã mang đến một trải nghiệm "Diamond Night" đúng nghĩa. Với không gian sang trọng của khách sạn JW Marriott Hà Nội, chúng tôi đã tinh chỉnh hệ thống ánh sáng để đạt được sự tối giản nhưng đẳng cấp vượt trội.

Chúng tôi thiết kế hệ thống 8 bộ Laser RGB hiệu ứng Pattern, tập trung vào việc tạo ra các dải sáng vàng đồng tinh tế, hòa quyện với không gian dạ tiệc. Điểm nhấn đặc biệt là 40 đèn Kinetic Pendant được điều khiển độc lập, tạo ra các hình dạng kim cương chuyển động mềm mại trên đầu các vị khách mời VIP.

Đội ngũ kỹ thuật của chúng tôi đã trực chiến 24/24 từ khâu thiết kế 3D Visualization đến lúc diễn ra sự kiện, đảm bảo mọi chi tiết nhỏ nhất đều hoàn hảo. Khách hàng Vingroup đã cực kỳ hài lòng với màn trình diễn Laser mapping khai mạc của sự kiện.`,
      equipment: [
        { name: 'Laser RGB Tinh Tế', quantity: '8 units', specs: '15W, pattern projection' },
        { name: 'Kinetic Pendant Light', quantity: '40 units', specs: 'Custom motion choreography' },
        { name: 'Architectural LED', quantity: '60 units', specs: 'Full-color wash' },
        { name: 'Atmospheric Haze', quantity: '4 units', specs: 'Low-lying fog effect' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1753030768124-dba306907bba?w=800&q=80',
        'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=800&q=80',
        'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=800&q=80'
      ],
      highlight: 'Laser Tinh Tế + 40 Kinetic Lights',
      client: 'Vingroup Corp',
      duration: '2 ngày setup, 1 đêm tiệc',
      color: '#00FF88',
      sortOrder: 2,
      seoTitle: 'Dịch vụ Laser Show & Kinetic cho Gala Tập đoàn Vingroup tại JW Marriott Hà Nội',
      seoDesc: 'Thiết kế ánh sáng sang trọng cho đêm tiệc VIP Vingroup. Laser QH Production cung cấp giải pháp Laser tinh tế và đèn Kinetic cho sự kiện cao cấp.'
    },
    {
      title: 'Sun Fest 2024 – Lễ Hội Âm Nhạc Đà Nẵng',
      slug: 'sun-fest-da-nang-2024',
      category: 'mega',
      categoryLabel: 'Mega Festival',
      eventType: 'Music Festival',
      location: 'Bãi biển Mỹ Khê, Đà Nẵng',
      scale: '30,000+ khán giả',
      year: 2024,
      heroImage: 'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=1920&q=80',
      thumbnailImage: 'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=800&q=80',
      description: 'Festival âm nhạc bờ biển với hệ thống laser ngoài trời quy mô lớn.',
      fullDescription: `Sun Fest 2024 là sự kiện bùng nổ diễn ra ngay trên bờ biển Mỹ Khê huyền thoại của Đà Nẵng. Laser QH Production đã mang đến một "đại tiệc ánh sáng" ngoài trời với các thiết bị chịu nhiệt và chịu nước tiêu chuẩn IP67.

Với không gian mở trên bãi biển, chúng tôi lắp đặt 20 bộ Laser chuyên dụng ngoài trời với công suất cực cao 40W. Hệ thống Sky Tracer (Laser bầu trời) có thể nhìn thấy từ khoảng cách 5km, tạo nên hiệu ứng dẫn đường ấn tượng cho hàng vạn khán giả đổ về lễ hội.

Thử thách lớn nhất là môi trường biển với nồng độ muối và độ ẩm cao, nhưng với sự chuẩn bị kỹ lưỡng về trang thiết bị bảo vệ và đội ngũ trực kỹ thuật 24/7, show diễn đã diễn ra suôn sẻ, tạo nên những khoảnh khắc bùng nổ khi dàn nghệ sĩ quốc tế xuất hiện. Đây là bước tiến lớn của chúng tôi trong việc phục vụ các đại nhạc hội biển quy mô lớn.`,
      equipment: [
        { name: 'Outdoor Laser Weatherproof', quantity: '20 units', specs: '40W, IP67, wind-resistant' },
        { name: 'Kinetic Bar Light', quantity: '80 units', specs: 'Outdoor-rated, wireless DMX' },
        { name: 'LED Beam Moving Head', quantity: '120 units', specs: '350W Sharpy beam' },
        { name: 'Laser Aerial Effect', quantity: '12 units', specs: 'Sky tracer, 5km visible' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=800&q=80',
        'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80',
        'https://images.unsplash.com/photo-1574154883606-19fa4f836c54?w=800&q=80'
      ],
      highlight: 'Laser Ngoài Trời IP67 + Sky Tracer',
      client: 'Sun Group Entertainment',
      duration: '5 ngày setup, 2 đêm diễn',
      color: '#BF00FF',
      sortOrder: 3,
      seoTitle: 'Thiết kế ánh sáng Laser ngoài trời cho Sun Fest Đà Nẵng 2024',
      seoDesc: 'Lễ hội âm nhạc biển Sun Fest Đà Nẵng với hệ thống Laser công suất lớn. Laser QH cung cấp giải pháp ánh sáng chống nước tiêu chuẩn quốc tế.'
    }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project as any,
      create: project as any,
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
