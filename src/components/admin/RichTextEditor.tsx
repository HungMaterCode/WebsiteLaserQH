'use client';

import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'align',
  'link', 'image'
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="quill-editor-container">
      <ReactQuill 
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
        /* Custom scrollbar for editor */
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
