export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: 'vip' | 'medium' | 'mega';
  categoryLabel: string;
  eventType: string;
  location: string;
  scale: string;
  year: number;
  heroImage: string;
  thumbnailImage: string;
  description: string;
  fullDescription: string;
  equipment: { name: string; quantity: string; specs: string }[];
  gallery: string[];
  highlight: string;
  client: string;
  duration: string;
  color: string;
}

export interface Consultant {
  name: string;
  phone: string;
}

export interface SiteSettings {
  messengerLink: string;
  zaloLink: string;
  facebookLink: string;
  phone: string;
  address: string;
  companyName: string;
  directorName: string;
  directorPhone: string;
  taxCode: string;
  bankAccount: string;
  companyEmail: string;
  consultantName: string;
  consultants: Consultant[];
  directorRole: string;
}

export interface MediaSettings {
  heroImageUrl: string;
  heroVideoUrl: string;
  heroVideoEnabled: boolean;
}

export const defaultSiteSettings: SiteSettings = {
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
  consultantName: 'Mr. Hiệp',
  consultants: [
    { name: 'Mr. Hiệp', phone: '0907 579 481' },
    { name: 'Mr. Phương', phone: '098 9600049' }
  ],
  directorRole: 'Giám đốc',
};

export const defaultMediaSettings: MediaSettings = {
  heroImageUrl: 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=1920&q=80',
  heroVideoUrl: '/videos/hero.mp4',
  heroVideoEnabled: false,
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'son-tung-stadium-2024',
    slug: 'son-tung-stadium-2024',
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
  },
  {
    id: 'vingroup-gala-2024',
    slug: 'vingroup-gala-2024',
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
  },
  {
    id: 'sun-fest-2024',
    slug: 'sun-fest-2024',
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
  },
  {
    id: 'dam-cuoi-ceo-2024',
    slug: 'dam-cuoi-ceo-2024',
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
  },
  {
    id: 'samsung-launch-2024',
    slug: 'samsung-launch-2024',
    title: 'Samsung Galaxy Launch Vietnam',
    category: 'medium',
    categoryLabel: 'Brand Activation',
    eventType: 'Product Launch Event',
    location: 'The Factory, TP. Hồ Chí Minh',
    scale: '2,000 khách mời',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=1920&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=800&q=80',
    description: 'Màn ra mắt sản phẩm công nghệ cao với hiệu ứng laser đồng bộ 100%.',
    fullDescription: 'Samsung Việt Nam tin tưởng chọn chúng tôi để tạo nên màn ra mắt Galaxy series đáng nhớ nhất. Hệ thống laser được lập trình đồng bộ hoàn toàn với video mapping trên sân khấu, tạo ra khoảnh khắc reveal sản phẩm đầy ngoạn mục mà khán giả không thể quên.',
    equipment: [
      { name: 'Laser Mapping Projector', quantity: '10 units', specs: '20W, precision mapping' },
      { name: 'LED Kinetic Panel', quantity: '60 units', specs: 'Pixel-mapped, full RGB' },
      { name: 'Beam Moving Head', quantity: '40 units', specs: '200W, RGBW' },
      { name: 'Video LED Wall', quantity: '1 system', specs: '20x5m, P2.6 resolution' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=800&q=80',
      'https://images.unsplash.com/photo-1759912301996-3b99deda9996?w=800&q=80',
      'https://images.unsplash.com/photo-1574154883606-19fa4f836c54?w=800&q=80',
      'https://images.unsplash.com/photo-1772078822311-02f078eb34ed?w=800&q=80',
    ],
    highlight: 'Laser Mapping + LED Kinetic 60 Units',
    client: 'Samsung Vietnam',
    duration: '3 ngày setup, 1 ngày diễn',
    color: '#BF00FF',
  },
  {
    id: 'nye-hanoi-2024',
    slug: 'nye-hanoi-2024',
    title: 'NYE Countdown Hà Nội 2024',
    category: 'medium',
    categoryLabel: 'Club / Festival',
    eventType: 'New Year Countdown Party',
    location: 'Lotte Center Rooftop, Hà Nội',
    scale: '5,000 khách mời',
    year: 2023,
    heroImage: 'https://images.unsplash.com/photo-1574154883606-19fa4f836c54?w=1920&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1574154883606-19fa4f836c54?w=800&q=80',
    description: 'Đêm chào năm mới với màn laser đếm ngược hoành tráng trên rooftop.',
    fullDescription: 'Đêm NYE Countdown 2024 tại rooftop Lotte Center là một trong những sự kiện đếm ngược được mong chờ nhất Hà Nội. Chúng tôi thiết kế màn đếm ngược 10 giây với hiệu ứng laser synchronize với màn pháo hoa, tạo nên khoảnh khắc chuyển giao năm mới khó quên.',
    equipment: [
      { name: 'Outdoor Laser System', quantity: '12 units', specs: '25W RGB, weather-resistant' },
      { name: 'Kinetic Moving Bar', quantity: '60 units', specs: 'Programmable sequence' },
      { name: 'Strobe & Effects', quantity: '20 units', specs: 'High-output LED strobe' },
      { name: 'CO2 Cannon', quantity: '6 units', specs: 'Cryo effect, timed trigger' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1574154883606-19fa4f836c54?w=800&q=80',
      'https://images.unsplash.com/photo-1774258041652-4ff2bd023244?w=800&q=80',
      'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80',
      'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=800&q=80',
    ],
    highlight: 'Countdown Laser + CO2 Cannon Effect',
    client: 'Lotte Hotels Vietnam',
    duration: '2 ngày setup, 1 đêm diễn',
    color: '#BF00FF',
  },
];
