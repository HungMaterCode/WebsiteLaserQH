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
  'link', 'image'
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File, quill: any, cursorIndex: number) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        // Tìm và xóa hình ảnh base64 nếu có (ảnh preview vừa dán)
        const contents = quill.getContents();
        let base64Index = -1;
        let currentIndex = 0;
        
        for (let i = 0; i < contents.ops.length; i++) {
          const op = contents.ops[i];
          if (op.insert && typeof op.insert === 'object' && op.insert.image && op.insert.image.startsWith('data:image')) {
            base64Index = currentIndex;
            break; // Lấy ảnh base64 đầu tiên tìm thấy
          }
           // Tính toán lại index thực tế dựa vào độ dài text hoặc embed
          currentIndex += typeof op.insert === 'string' ? op.insert.length : 1;
        }

        if (base64Index !== -1) {
          // Xóa base64 và chèn ảnh từ cloud vào đúng vị trí cũ
          quill.deleteText(base64Index, 1);
          quill.insertEmbed(base64Index, 'image', data.url);
          quill.setSelection(base64Index + 1);
        } else {
          // Xử lý mặc định (chèn ở con trỏ) nếu không chạy flow paste
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

  useEffect(() => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            // Không chặn e.preventDefault() để cho Quill tự dán Base64 làm ảnh preview
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

    // Lắng nghe sự kiện paste ở phase capture để ưu tiên chạy trước
    const target = quill.root;
    target.addEventListener('paste', handlePaste, true);
    return () => {
      target.removeEventListener('paste', handlePaste, true);
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  return (
    <div className="quill-editor-container relative">
      {isUploading && (
        <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl border border-white/5 transition-all">
          <div className="bg-[#111] border border-[#00FF88]/30 shadow-[0_0_20px_rgba(0,255,136,0.15)] px-5 py-3 rounded-full text-[#00FF88] font-body text-[0.8rem] tracking-wider font-bold uppercase flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-[#00FF88] border-t-transparent animate-spin"></div>
            Đang xử lý ảnh...
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
