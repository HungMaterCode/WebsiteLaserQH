import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_CONFIG } from '@/lib/r2';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Tăng timeout lên 5 phút (cho nén video lớn)
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

// Nén video bằng ffmpeg (chuyển sang mp4 H.264, chất lượng cao)
async function compressVideo(inputPath: string, outputPath: string): Promise<void> {
  const ffmpeg = (await import('fluent-ffmpeg')).default;
  const ffmpegPath = (await import('ffmpeg-static')).default;

  if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',
        '-crf 28',
        '-preset superfast',
        '-c:a aac',
        '-b:a 128k',
        '-movflags +faststart',
        '-vf scale=w=\'min(1920,iw)\':h=\'min(1080,ih)\':force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2',
      ])
      .output(outputPath)
      .on('start', (cmd: string) => {
        console.log('[FFmpeg] Bắt đầu nén:', cmd);
      })
      .on('progress', (progress: any) => {
        if (progress.percent) {
          console.log(`[FFmpeg] Tiến trình: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log('[FFmpeg] Nén xong!');
        resolve();
      })
      .on('error', (err: Error) => {
        console.error('[FFmpeg] Lỗi nén:', err.message);
        reject(err);
      })
      .run();
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let tempInputPath = '';
  let tempOutputPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file video' }, { status: 400 });
    }

    // Giới hạn 500MB file gốc
    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: 'File quá lớn (tối đa 500MB)' }, { status: 400 });
    }

    const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
    console.log(`[Video Upload] File gốc: ${file.name} (${originalSizeMB}MB)`);

    // Tạo tên file sạch (.mp4)
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const cleanBaseName = baseName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const cleanFileName = `${Date.now()}-${cleanBaseName}.mp4`;

    // Lưu file gốc vào thư mục tạm
    const tempDir = os.tmpdir();
    const originalExt = path.extname(file.name) || '.mov';
    tempInputPath = path.join(tempDir, `upload-input-${Date.now()}${originalExt}`);
    tempOutputPath = path.join(tempDir, `upload-output-${Date.now()}.mp4`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(tempInputPath, buffer);

    let uploadBuffer: Buffer;
    let finalSizeMB: string;

    // Nén video nếu file > 10MB hoặc không phải mp4
    const needsCompression = file.size > 60 * 1024 * 1024 || !file.name.toLowerCase().endsWith('.mp4');

    if (needsCompression) {
      console.log('[Video Upload] Đang nén video...');
      await compressVideo(tempInputPath, tempOutputPath);

      uploadBuffer = fs.readFileSync(tempOutputPath);
      finalSizeMB = (uploadBuffer.length / 1024 / 1024).toFixed(2);
      console.log(`[Video Upload] Sau nén: ${finalSizeMB}MB (giảm ${Math.round((1 - uploadBuffer.length / file.size) * 100)}%)`);
    } else {
      console.log('[Video Upload] File đã nhỏ, bỏ qua nén.');
      uploadBuffer = buffer;
      finalSizeMB = originalSizeMB;
    }

    // Upload lên R2
    console.log(`[Video Upload] Đang tải lên R2: ${cleanFileName}`);
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: `videos/${cleanFileName}`,
      Body: uploadBuffer,
      ContentType: 'video/mp4',
    });

    await r2Client.send(command);

    const publicUrl = `${R2_CONFIG.publicDomain}/videos/${cleanFileName}`;
    console.log(`[Video Upload] Thành công: ${publicUrl}`);

    return NextResponse.json({
      url: publicUrl,
      originalSize: originalSizeMB,
      compressedSize: finalSizeMB,
    });
  } catch (error: any) {
    console.error('[Video Upload] Lỗi:', error.message);
    return NextResponse.json({
      error: 'Upload video thất bại',
      details: error.message,
    }, { status: 500 });
  } finally {
    // Dọn dẹp file tạm
    try {
      if (tempInputPath && fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
      if (tempOutputPath && fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
    } catch (e) {
      // Bỏ qua lỗi dọn dẹp
    }
  }
}
