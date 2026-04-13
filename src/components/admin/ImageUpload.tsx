'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { LaserLoader } from '../ui/LaserLoader';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentValue?: string;
  label?: string;
  type?: 'icon' | 'og' | 'standard';
}

export function ImageUpload({ onUploadComplete, currentValue, label, type = 'standard' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn tệp hình ảnh (.jpg, .png, .webp, .svg)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 5MB.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/upload?type=${type}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onUploadComplete(data.url);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải ảnh lên');
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
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: uploading ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)',
              color: uploading ? 'rgba(255,255,255,0.5)' : '#fff',
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? (
              <>
                <LaserLoader size="xs" color="#00FF88" />
                <span className="text-[0.75rem] font-bold">Đang tải lên...</span>
              </>
            ) : (
              <>
                <Upload size={16} className="text-[#00FF88]" />
                <span className="text-[0.75rem] font-bold">Tải lên từ máy tính</span>
              </>
            )}
          </button>
        </div>

        {currentValue && (
          <button
             type="button"
             onClick={() => onUploadComplete('')}
             className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
             title="Xóa ảnh"
          >
             <X size={16} />
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/*"
      />

      {error && (
        <p className="text-red-400 text-[0.65rem] font-medium animate-in slide-in-from-top-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
