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
  youtubeLink: string;
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
  youtubeLink: '',
};

export const defaultMediaSettings: MediaSettings = {
  heroImageUrl: 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=1920&q=80',
  heroVideoUrl: '/videos/hero.mp4',
  heroVideoEnabled: false,
};

export const portfolioProjects: PortfolioProject[] = [];
