import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteCloudinaryImage, deleteR2Video } from '@/lib/mediaCleanup';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.mediaSetting.findUnique({
      where: { id: 'global' },
    });
    return NextResponse.json(settings?.data || {});
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const newData = await request.json();
    
    // 1. Lấy dữ liệu cũ để so sánh dọn dẹp
    const oldSettings = await prisma.mediaSetting.findUnique({
      where: { id: 'global' },
    });
    const oldData = (oldSettings?.data as any) || {};

    // 2. Kiểm tra nếu heroImageUrl thay đổi -> Xóa ảnh cũ trên Cloudinary
    if (oldData.heroImageUrl && newData.heroImageUrl !== oldData.heroImageUrl) {
      console.log(`[Media API] Ảnh Hero thay đổi, đang dọn ảnh cũ: ${oldData.heroImageUrl}`);
      deleteCloudinaryImage(oldData.heroImageUrl).catch(e => 
        console.warn('[Media API] Lỗi xóa ảnh cũ:', e.message)
      );
    }

    // 3. Cập nhật database
    const settings = await prisma.mediaSetting.upsert({
      where: { id: 'global' },
      update: { data: newData },
      create: { id: 'global', data: newData },
    });

    return NextResponse.json(settings.data);
  } catch (error: any) {
    console.error('[Media API] PATCH Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL không hợp lệ' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const r2Domain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;

    if (cloudName && url.includes('cloudinary.com')) {
      await deleteCloudinaryImage(url);
      console.log(`[Media API] Đã xóa Cloudinary: ${url}`);
    } else if (r2Domain && url.startsWith(r2Domain)) {
      await deleteR2Video(url);
      console.log(`[Media API] Đã xóa R2: ${url}`);
    } else {
      return NextResponse.json({ error: 'URL không thuộc Cloudinary hoặc R2' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Media API] Lỗi xóa media:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
