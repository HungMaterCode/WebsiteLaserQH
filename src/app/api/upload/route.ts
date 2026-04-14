import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    let buffer = Buffer.from(bytes);

    let finalFilename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '-')}`;
    
    // Process image based on type using sharp
    if (type === 'icon') {
      finalFilename += ".png";
      buffer = await sharp(buffer)
        .resize(180, 180, { fit: 'cover' })
        .png()
        .toBuffer();
    } else if (type === 'og') {
      const isPng = file.type === 'image/png';
      if (isPng) {
        finalFilename += ".png";
        buffer = await sharp(buffer)
          .resize(1200, 630, { fit: 'cover' })
          .png({ quality: 90 })
          .toBuffer();
      } else {
        finalFilename += ".jpg";
        buffer = await sharp(buffer)
          .resize(1200, 630, { fit: 'cover' })
          .jpeg({ quality: 90 })
          .toBuffer();
      }
    } else {
      // General upload: just optimize a bit if it's a large image
      const metadata = await sharp(buffer).metadata();
      if (metadata.width && metadata.width > 2000) {
        buffer = await sharp(buffer)
          .resize(2000, null, { withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
      }
    }

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'laserqh_uploads',
          public_id: finalFilename.replace(/\.[^/.]+$/, ""),
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const result = uploadResult as any;
    
    return NextResponse.json({ 
      url: result.secure_url,
      name: result.public_id,
      size: result.bytes
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload Failed', 
      details: error.message || 'Unknown error' 
    }, { status: 500 });
  }
}

