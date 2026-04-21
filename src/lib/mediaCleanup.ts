/**
 * Tiện ích xóa media trên Cloudinary (hình ảnh) và Cloudflare R2 (video)
 * Được gọi khi xóa dự án hoặc khi nội dung bài viết thay đổi
 */

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_CONFIG } from '@/lib/r2';
import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Lấy public_id từ URL Cloudinary
 * Ví dụ: https://res.cloudinary.com/dlzyhadx1/image/upload/v123/folder/abc.jpg
 * → "folder/abc"
 */
export function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Lấy key (đường dẫn trong bucket) từ URL R2
 * Ví dụ: https://pub-xxx.r2.dev/videos/123-myvideo.mp4
 * → "videos/123-myvideo.mp4"
 */
export function extractR2Key(url: string): string | null {
  if (!url || !R2_CONFIG.publicDomain) return null;
  try {
    if (!url.startsWith(R2_CONFIG.publicDomain)) return null;
    return url.replace(R2_CONFIG.publicDomain + '/', '');
  } catch {
    return null;
  }
}

/**
 * Tìm tất cả URL hình ảnh Cloudinary trong nội dung HTML (rich text)
 */
export function findCloudinaryUrls(htmlContent: string): string[] {
  if (!htmlContent) return [];
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return [];
  const regex = new RegExp(
    `https://res\\.cloudinary\\.com/${cloudName}/[^"'\\s]+`,
    'g'
  );
  return Array.from(new Set(htmlContent.match(regex) || []));
}

/**
 * Tìm tất cả URL video R2 trong nội dung HTML (rich text)
 */
export function findR2VideoUrls(htmlContent: string): string[] {
  if (!htmlContent || !R2_CONFIG.publicDomain) return [];
  const escaped = R2_CONFIG.publicDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escaped}/[^"'\\s]+`, 'g');
  return Array.from(new Set(htmlContent.match(regex) || []));
}

/**
 * Xóa một ảnh trên Cloudinary
 */
export async function deleteCloudinaryImage(url: string): Promise<void> {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`[Cleanup] Đã xóa Cloudinary: ${publicId}`);
  } catch (e: any) {
    console.warn(`[Cleanup] Không thể xóa Cloudinary (${publicId}):`, e.message);
  }
}

/**
 * Xóa một video trên Cloudflare R2
 */
export async function deleteR2Video(url: string): Promise<void> {
  const key = extractR2Key(url);
  if (!key) return;
  try {
    await r2Client.send(new DeleteObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
    }));
    console.log(`[Cleanup] Đã xóa R2: ${key}`);
  } catch (e: any) {
    console.warn(`[Cleanup] Không thể xóa R2 (${key}):`, e.message);
  }
}

/**
 * Xóa toàn bộ media liên quan đến một dự án:
 * - Ảnh thumbnail, heroImage, galleryImages (Cloudinary)
 * - Ảnh + video trong fullDescription (rich text)
 */
export async function cleanupProjectMedia(project: {
  thumbnailImage?: string | null;
  heroImage?: string | null;
  galleryImages?: string[];
  fullDescription?: string | null;
  overviewVideoUrl?: string | null;
}): Promise<void> {
  const deletePromises: Promise<void>[] = [];

  // 1. Ảnh thumbnail
  if (project.thumbnailImage) {
    deletePromises.push(deleteCloudinaryImage(project.thumbnailImage));
  }

  // 2. Ảnh hero
  if (project.heroImage) {
    deletePromises.push(deleteCloudinaryImage(project.heroImage));
  }

  // 3. Ảnh gallery
  for (const imgUrl of project.galleryImages || []) {
    if (imgUrl) deletePromises.push(deleteCloudinaryImage(imgUrl));
  }

  // 4. Ảnh trong rich text (fullDescription)
  if (project.fullDescription) {
    const cloudinaryUrls = findCloudinaryUrls(project.fullDescription);
    for (const url of cloudinaryUrls) {
      deletePromises.push(deleteCloudinaryImage(url));
    }

    // 5. Video trong rich text
    const r2Urls = findR2VideoUrls(project.fullDescription);
    for (const url of r2Urls) {
      deletePromises.push(deleteR2Video(url));
    }
  }

  // 6. Video tổng quan (nếu có)
  if (project.overviewVideoUrl) {
    deletePromises.push(deleteR2Video(project.overviewVideoUrl));
  }

  // Chạy song song tất cả, không để lỗi 1 cái làm dừng cái khác
  const results = await Promise.allSettled(deletePromises);
  const failed = results.filter(r => r.status === 'rejected').length;
  if (failed > 0) {
    console.warn(`[Cleanup] ${failed}/${results.length} media xóa thất bại (không ảnh hưởng dữ liệu chính).`);
  }
}
