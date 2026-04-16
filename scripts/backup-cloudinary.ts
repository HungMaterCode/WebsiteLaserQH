import { v2 as cloudinary } from 'cloudinary';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function fileExistsInR2(key: string): Promise<boolean> {
  try {
    await r2Client.send(new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

async function uploadToR2(url: string, key: string, contentType: string) {
  console.log(`Uploading ${key}...`);
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  await r2Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: response.data,
    ContentType: contentType,
  }));
}

async function startSync() {
  console.log('Starting Cloudinary to R2 sync...');
  let nextCursor: string | undefined = undefined;

  do {
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.api.resources(
        { 
          max_results: 500, 
          next_cursor: nextCursor,
          type: 'upload',
          resource_type: 'image' // We'll handle images and videos separately if needed
        }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    for (const resource of result.resources) {
      const key = `media/${resource.public_id}.${resource.format}`;
      const exists = await fileExistsInR2(key);
      
      if (!exists) {
        await uploadToR2(resource.secure_url, key, `${resource.resource_type}/${resource.format}`);
      } else {
        console.log(`Skipping ${key} (already exists)`);
      }
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  // Handle Videos
  console.log('Syncing videos...');
  nextCursor = undefined;
  do {
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.api.resources(
        { 
          max_results: 500, 
          next_cursor: nextCursor,
          type: 'upload',
          resource_type: 'video'
        }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    for (const resource of result.resources) {
      const key = `media/${resource.public_id}.${resource.format}`;
      const exists = await fileExistsInR2(key);
      
      if (!exists) {
        await uploadToR2(resource.secure_url, key, `${resource.resource_type}/${resource.format}`);
      } else {
        console.log(`Skipping ${key} (already exists)`);
      }
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  console.log('Sync completed successfully!');
}

startSync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
