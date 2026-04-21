'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'align',
  'link', 'image', 'video'
];

// Custom Blot for HTML5 Video
if (typeof window !== 'undefined') {
  const Quill = ReactQuill.Quill;
  const BlockEmbed = Quill.import('blots/block/embed') as any;
  
  class VideoBlot extends BlockEmbed {
    static create(value: string | { url: string; controls?: boolean }) {
      const node = super.create();
      const url = typeof value === 'string' ? value : value.url;
      node.setAttribute('src', url);
      node.setAttribute('controls', 'true');
      node.setAttribute('width', '100%');
      node.setAttribute('style', 'border-radius: 16px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.3);');
      node.setAttribute('playsinline', 'true');
      node.setAttribute('webkit-playsinline', 'true');
      node.setAttribute('preload', 'metadata');
      return node;
    }

    static value(node: any) {
      return node.getAttribute('src');
    }
  }
  VideoBlot.blotName = 'video';
  VideoBlot.tagName = 'video';
  Quill.register(VideoBlot, true);
}

// Lấy tất cả URL ảnh/video từ HTML của editor
function extractMediaUrls(html: string): Set<string> {
  const urls = new Set<string>();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const r2Domain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;

  // Ảnh Cloudinary trong <img src="...">
  if (cloudName) {
    const imgRegex = /src="(https:\/\/res\.cloudinary\.com\/[^"]+)"/g;
    let m;
    while ((m = imgRegex.exec(html)) !== null) urls.add(m[1]);
  }

  // Video R2 trong <video src="...">
  if (r2Domain) {
    const escaped = r2Domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const videoRegex = new RegExp(`src="(${escaped}/[^"]+)"`, 'g');
    let m;
    while ((m = videoRegex.exec(html)) !== null) urls.add(m[1]);
  }

  return urls;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'ảnh' | 'video' | null>(null);
  const previousUrlsRef = useRef<Set<string>>(new Set());


  const uploadVideo = async (file: File, quill: any, cursorIndex: number) => {
    setIsUploading(true);
    setUploadStatus('video');

    try {
      // 1. Lấy presigned URL từ API (GET)
      const res = await fetch(`/api/upload/video?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
      const { signedUrl, publicUrl, error: apiError } = await res.json();

      if (!res.ok) throw new Error(apiError || 'Không thể lấy URL upload');

      // 2. Upload trực tiếp từ trình duyệt lên R2 (PUT)
      // Sử dụng XMLHttpRequest để theo dõi tiến trình nếu cần, ở đây dùng fetch cho đơn giản
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) throw new Error('Upload trực tiếp lên R2 thất bại');

      // Chèn video vào vị trí con trỏ
      quill.insertEmbed(cursorIndex, 'video', publicUrl);
      quill.setSelection(cursorIndex + 1);
      
      // Thêm một dòng trống sau video để dễ dàng đặt con trỏ và xóa trên điện thoại
      quill.insertText(cursorIndex + 1, '\n');
      quill.setSelection(cursorIndex + 2);
      
      // Force update Quill container to ensure HTML is consistent
      setTimeout(() => quill.update(), 100);
    } catch (e: any) {
      console.error('Video upload error', e);
      alert('Lỗi khi tải video: ' + (e.message || 'Lỗi không xác định'));
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
    }
  };

  const uploadImage = async (file: File, quill: any, cursorIndex: number) => {
    setIsUploading(true);
    setUploadStatus('ảnh');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        const contents = quill.getContents();
        let base64Index = -1;
        let currentIndex = 0;
        
        for (let i = 0; i < contents.ops.length; i++) {
          const op = contents.ops[i];
          if (op.insert && typeof op.insert === 'object' && op.insert.image && op.insert.image.startsWith('data:image')) {
            base64Index = currentIndex;
            break;
          }
          currentIndex += typeof op.insert === 'string' ? op.insert.length : 1;
        }

        if (base64Index !== -1) {
          quill.deleteText(base64Index, 1);
          quill.insertEmbed(base64Index, 'image', data.url);
          quill.setSelection(base64Index + 1);
        } else {
          quill.insertEmbed(cursorIndex, 'image', data.url);
          quill.setSelection(cursorIndex + 1);
        }
      } else {
        alert('Tải ảnh thất bại: ' + (data.error || 'Lỗi không xác định'));
      }
    } catch (e) {
      console.error('Upload error', e);
      alert('Đã xảy ra lỗi kết nối khi tải ảnh.');
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file && quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true) || { index: quill.getLength() };
        uploadImage(file, quill, range.index);
      }
    };
  };

  const videoHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file && quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true) || { index: quill.getLength() };
        uploadVideo(file, quill, range.index);
      }
    };
  };

  // Xử lý paste ảnh từ clipboard
  useEffect(() => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              const range = quill.getSelection(true) || { index: quill.getLength() };
              uploadImage(file, quill, range.index);
            }
            return;
          }
        }
      }
    };

    const target = quill.root;
    target.addEventListener('paste', handlePaste, true);
    return () => {
      target.removeEventListener('paste', handlePaste, true);
    };
  }, []);

  // HÀNH ĐỘNG XÓA ĐÃ ĐƯỢC CHUYỂN VỀ SERVER KHI NHẤN "LƯU" ĐỂ TRÁNH XÓA NHẦM.
  // Frontend không còn tự động gọi DELETE /api/media nữa.

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler
      }
    },
    clipboard: {
      matchVisual: false
    },
    keyboard: {
      bindings: {
        // Ghi đè binding 'list autofill' của Quill 2.0
        'list autofill': {
          key: ' ',
          collapsed: true,
          prefix: /^\s*(?:\d+\.|\*|-)$/,
          handler: function(this: any, range: any) {
            this.quill.insertText(range.index, ' ');
            return false;
          }
        }
      }
    }
  }), []);

  return (
    <div className="quill-editor-container relative">
      {isUploading && (
        <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl border border-white/5 transition-all">
          <div className="bg-[#111] border border-[#00FF88]/30 shadow-[0_0_20px_rgba(0,255,136,0.15)] px-5 py-3 rounded-full text-[#00FF88] font-body text-[0.8rem] tracking-wider font-bold uppercase flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-[#00FF88] border-t-transparent animate-spin"></div>
            Đang xử lý {uploadStatus}...
          </div>
        </div>
      )}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: '350px',
          marginBottom: '20px',
          background: 'rgba(255,255,255,0.01)',
          color: '#fff',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      />
      <style jsx global>{`
        .quill-editor-container .ql-toolbar.ql-snow {
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-bottom: none !important;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background: rgba(255,255,255,0.03);
          padding: 12px !important;
        }
        .quill-editor-container .ql-container.ql-snow {
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          background: transparent;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 0.85rem;
          height: calc(350px - 50px) !important;
        }
        .quill-editor-container .ql-editor {
          padding: 15px 20px !important;
          line-height: 1.7;
        }
        .quill-editor-container .ql-editor::-webkit-scrollbar {
          width: 4px;
        }
        .quill-editor-container .ql-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        .quill-editor-container .ql-editor::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 136, 0.2);
          border-radius: 10px;
        }
        .quill-editor-container .ql-editor.ql-blank::before {
          color: rgba(255,255,255,0.15) !important;
          left: 20px !important;
          font-style: normal;
        }
        .quill-editor-container .ql-snow .ql-stroke {
          stroke: rgba(255,255,255,0.6) !important;
        }
        .quill-editor-container .ql-snow .ql-fill {
          fill: rgba(255,255,255,0.6) !important;
        }
        .quill-editor-container .ql-snow .ql-picker {
          color: rgba(255,255,255,0.6) !important;
        }
        .quill-editor-container .ql-snow .ql-picker-options {
          background-color: #111 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .quill-editor-container .ql-active .ql-stroke {
          stroke: #00FF88 !important;
        }
        .quill-editor-container .ql-active .ql-fill {
          fill: #00FF88 !important;
        }
        .quill-editor-container .ql-active {
          color: #00FF88 !important;
        }
      `}</style>
    </div>
  );
}
