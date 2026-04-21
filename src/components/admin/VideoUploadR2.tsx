'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, Video } from 'lucide-react';
import { LaserLoader } from '../ui/LaserLoader';

interface VideoUploadR2Props {
  onUploadComplete: (url: string) => void;
  currentValue?: string;
  label?: string;
}

export function VideoUploadR2({ onUploadComplete, currentValue, label }: VideoUploadR2Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      setError('Vui lòng chọn tệp video (.mp4, .mov, .webm)');
      return;
    }

    // Check file size (max 100MB for R2, though R2 can handle more, we should be reasonable)
    if (file.size > 100 * 1024 * 1024) {
      setError('Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 100MB.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // 1. Get presigned URL from our API
      const res = await fetch(`/api/upload/video?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
      const { signedUrl, publicUrl, error: apiError } = await res.json();

      if (!res.ok) throw new Error(apiError || 'Failed to get upload URL');

      // 2. Upload directly to R2
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            setProgress(pct);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(publicUrl);
          } else {
            reject(new Error('Upload to R2 failed'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));
      });

      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);

      const uploadedUrl = await uploadPromise as string;
      
      onUploadComplete(uploadedUrl);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải video lên');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-lg border-2 border-dashed transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: uploading ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)',
              color: uploading ? 'rgba(255,255,255,0.5)' : '#fff',
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? (
              <>
                <LaserLoader size="sm" color="#00FF88" />
                <div className="text-center">
                  <span className="text-[0.75rem] font-bold block">Đang tải lên ({progress}%)</span>
                  <div className="w-32 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-[#00FF88] transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#00FF88]/10 flex items-center justify-center mb-1">
                   <Video size={20} className="text-[#00FF88]" />
                </div>
                <span className="text-[0.75rem] font-bold">Tải lên Video Tổng Quan (.mp4)</span>
                <span className="text-[0.6rem] text-white/30 uppercase tracking-widest font-black">Cloudflare R2 Storage</span>
              </>
            )}
          </button>
        </div>

        {currentValue && (
          <button
             type="button"
             onClick={() => onUploadComplete('')}
             className="w-12 h-12 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all self-stretch"
             title="Xóa Video"
          >
             <X size={20} />
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="video/*"
      />

      {error && (
        <p className="text-red-400 text-[0.65rem] font-medium animate-in slide-in-from-top-1">
          ⚠️ {error}
        </p>
      )}

      {currentValue && !uploading && (
        <div className="mt-4 rounded-xl overflow-hidden bg-black/40 border border-white/10 aspect-video relative group">
          <video 
            src={currentValue} 
            className="w-full h-full object-contain"
            controls
            playsInline
          />
          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-[#00FF88] text-[0.6rem] font-bold backdrop-blur-md border border-[#00FF88]/20">
            PREVIEW
          </div>
        </div>
      )}
    </div>
  );
}
