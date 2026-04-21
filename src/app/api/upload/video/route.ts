import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_CONFIG } from '@/lib/r2';

// Tăng timeout lên 5 phút (cho các tác vụ xử lý nếu có)
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/**
 * GET: Tạo Presigned URL để upload trực tiếp từ trình duyệt lên R2
 * Giúp giải quyết lỗi 413 Payload Too Large trên Vercel
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const fileType = searchParams.get('fileType') || 'video/mp4';

    if (!fileName) {
      return NextResponse.json({ error: 'Thiếu tên file' }, { status: 400 });
    }

    // Tạo tên file sạch
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const cleanBaseName = baseName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const extension = fileName.split('.').pop() || 'mp4';
    const cleanFileName = `videos/${Date.now()}-${cleanBaseName}.${extension}`;

    // Tạo command PUT
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: cleanFileName,
      ContentType: fileType,
    });

    // Tạo Signed URL có hiệu lực trong 3600 giây (1 giờ)
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    const publicUrl = `${R2_CONFIG.publicDomain}/${cleanFileName}`;

    console.log(`[R2 Signed URL] Generated for: ${cleanFileName}`);

    return NextResponse.json({
      signedUrl,
      publicUrl,
      key: cleanFileName,
    });
  } catch (error: any) {
    console.error('[R2 Signed URL] Lỗi:', error.message);
    return NextResponse.json({
      error: 'Không thể tạo URL tải lên',
      details: error.message,
    }, { status: 500 });
  }
}

/**
 * POST: Phương thức cũ (vẫn giữ để dự phòng cho file cực nhỏ hoặc chạy local)
 * Chú ý: Sẽ bị lỗi 413 trên Vercel nếu file > 4.5MB (Hobby) hoặc 15MB (Pro)
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Trên Vercel, chúng ta nên ưu tiên dùng GET để lấy Signed URL
  // Đoạn mã dưới đây giữ lại logic cũ nhưng sẽ không được khuyến khích
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file video' }, { status: 400 });
    }

    // Giới hạn 15MB cho POST qua Vercel (khớp với giới hạn gói Pro)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File quá lớn để tải qua Server Vercel. Vui lòng sử dụng phương thức Direct Upload.' 
      }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const cleanBaseName = baseName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const cleanFileName = `videos/${Date.now()}-${cleanBaseName}.mp4`;

    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: cleanFileName,
      Body: buffer,
      ContentType: file.type || 'video/mp4',
    });

    await r2Client.send(command);

    const publicUrl = `${R2_CONFIG.publicDomain}/${cleanFileName}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('[Video Upload POST] Lỗi:', error.message);
    return NextResponse.json({
      error: 'Upload thất bại qua Server',
      details: error.message,
    }, { status: 500 });
  }
}

