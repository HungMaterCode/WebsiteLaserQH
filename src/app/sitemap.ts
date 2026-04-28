import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = 'https://laserqh.vn';

  // 1. Lấy danh sách dự án từ database
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // 2. Tạo URL cho các dự án
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/du-an/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Các trang tĩnh
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/chinh-sach-bao-mat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/dieu-khoan-dich-vu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  return [...staticEntries, ...projectEntries];
}
