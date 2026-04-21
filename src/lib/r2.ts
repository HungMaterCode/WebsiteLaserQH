import { S3Client } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
  // Tắt tự động tính checksum để tránh lỗi CORS phức tạp trên trình duyệt
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

export { r2Client };

export const R2_CONFIG = {
  bucketName: process.env.R2_BUCKET_NAME,
  publicDomain: process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN,
};
