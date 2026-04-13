import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'icon' or 'og'
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let buffer: any = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    let filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Process image based on type
    if (type === 'icon') {
      // Force PNG and 180x180 for SEO Icon
      filename = filename.replace(/\.[^/.]+$/, "") + ".png";
      buffer = await sharp(buffer)
        .resize(180, 180, { fit: 'cover' })
        .png()
        .toBuffer();
    } else if (type === 'og') {
      // Resize to 1200x630 for OG Image
      const isPng = file.type === 'image/png';
      if (isPng) {
        filename = filename.replace(/\.[^/.]+$/, "") + ".png";
        buffer = await sharp(buffer)
          .resize(1200, 630, { fit: 'cover' })
          .png({ quality: 90 })
          .toBuffer();
      } else {
        filename = filename.replace(/\.[^/.]+$/, "") + ".jpg";
        buffer = await sharp(buffer)
          .resize(1200, 630, { fit: 'cover' })
          .jpeg({ quality: 90 })
          .toBuffer();
      }
    }

    const filePath = path.join(uploadsDir, filename);

    // Save file
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      url: fileUrl,
      name: filename,
      size: buffer.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

