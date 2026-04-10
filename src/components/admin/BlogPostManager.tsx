'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, AlertTriangle, Search, FileText, Calendar, User, Save } from 'lucide-react';
import dynamic from 'next/dynamic';
import { BlogPost } from '@/types/blog';

// Dynamic import for ReactQuill to support SSR
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-[250px] w-full bg-white/5 animate-pulse rounded-lg" />
});
import 'react-quill-new/dist/quill.snow.css';

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  borderRadius: '8px',
  padding: '0.65rem 0.875rem',
  width: '100%',
  outline: 'none',
  fontFamily: "'Be Vietnam Pro', sans-serif",
  fontSize: '0.83rem',
};

const labelStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.45)',
  fontSize: '0.7rem',
  fontFamily: 'Orbitron, sans-serif',
  letterSpacing: '0.1em',
  display: 'block',
  marginBottom: 6,
};

function useFocusHandlers() {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)';
      e.currentTarget.style.boxShadow = '0 0 8px rgba(0,255,136,0.15)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
};

export function BlogPostManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const focusHandlers = useFocusHandlers();

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/posts');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setPosts(data);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const handleSave = useCallback(async (post: BlogPost) => {
    try {
      const url = isNewPost ? '/api/posts' : `/api/posts/${post.id}`;
      const method = isNewPost ? 'POST' : 'PATCH';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (res.ok) {
        triggerRefresh();
        setEditingPost(null);
        setIsNewPost(false);
      } else {
        const err = await res.json();
        alert(`Lỗi: ${err.error || 'Không thể lưu bài viết'}`);
      }
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Lỗi kết nối server');
    }
  }, [isNewPost]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerRefresh();
        setDeleteTarget(null);
      } else {
        alert('Lỗi khi xóa bài viết');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Lỗi kết nối server');
    }
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-white/50 font-exo animate-pulse">Đang tải danh sách bài viết...</div>;

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-orbitron text-white mb-1" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Quản Lý Bài Viết</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            {posts.length} bài viết · Chia sẻ kiến thức và tin tức laser
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPost({
              id: '',
              title: '',
              excerpt: '',
              content: '',
              coverImage: '',
              publishedAt: new Date().toISOString(),
              author: 'Admin',
              status: 'draft',
              tags: []
            });
            setIsNewPost(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-exo transition-all duration-300 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #00FF88, #00cc66)', color: '#000', fontWeight: 700, fontSize: '0.85rem' }}
        >
          <Plus size={18} strokeWidth={2.5} /> VIẾT BÀI MỚI
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            {...focusHandlers}
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl overflow-hidden border border-white/5" style={{ background: 'rgba(10,10,20,0.5)' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th className="px-6 py-4 text-left font-orbitron text-[0.7rem] text-white/40 tracking-wider">BÀI VIẾT</th>
                <th className="px-6 py-4 text-left font-orbitron text-[0.7rem] text-white/40 tracking-wider">TRẠNG THÁI</th>
                <th className="px-6 py-4 text-left font-orbitron text-[0.7rem] text-white/40 tracking-wider">NGÀY ĐĂNG</th>
                <th className="px-6 py-4 text-right font-orbitron text-[0.7rem] text-white/40 tracking-wider">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative border border-white/10">
                        {post.coverImage ? (
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="48px" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5"><FileText size={20} className="text-white/20" /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-exo font-semibold text-sm truncate max-w-[300px]">{post.title}</div>
                        <div className="text-white/30 text-[0.7rem] font-vietnam mt-0.5 flex items-center gap-2">
                          <User size={10} /> {post.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="px-2.5 py-1 rounded-full text-[0.6rem] font-bold font-orbitron tracking-wider"
                      style={{ 
                        background: post.status === 'published' ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)',
                        color: post.status === 'published' ? '#00FF88' : 'rgba(255,255,255,0.4)',
                        border: `1px solid ${post.status === 'published' ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.1)'}`
                      }}
                    >
                      {post.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white/50 text-[0.75rem] font-exo flex items-center gap-2">
                      <Calendar size={14} className="text-[#00FF88]/40" />
                      {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingPost(post)}
                        className="p-2 text-white/40 hover:text-[#00FF88] hover:bg-[#00FF88]/10 rounded-lg transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteTarget(post)}
                        className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingPost && (
        <BlogPostEditorModal
          post={editingPost}
          isNew={isNewPost}
          onSave={handleSave}
          onClose={() => { setEditingPost(null); setIsNewPost(false); }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal 
          title={deleteTarget.title}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function BlogPostEditorModal({
  post,
  isNew,
  onSave,
  onClose,
}: {
  post: BlogPost;
  isNew: boolean;
  onSave: (p: BlogPost) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<BlogPost>({ ...post });
  const focusHandlers = useFocusHandlers();

  const update = (field: keyof BlogPost, value: any) => 
    setForm((prev: BlogPost) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-5xl bg-[#0a0a14] rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ maxHeight: '95vh' }}
      >
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="font-orbitron text-white text-lg font-bold tracking-tight">
              {isNew ? 'VIẾT BÀI MỚI' : 'CHỈNH SỬA BÀI VIẾT'}
            </h3>
            <p className="text-white/30 text-[0.7rem] font-vietnam uppercase tracking-wider mt-0.5">Laser &amp; Light Show Insights</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(95vh - 150px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label style={labelStyle}>TIÊU ĐỀ BÀI VIẾT</label>
                <input 
                  style={{ ...inputStyle, fontSize: '1.1rem', fontWeight: 600 }} 
                  value={form.title} 
                  onChange={e => update('title', e.target.value)}
                  placeholder="Tiêu đề hấp dẫn..." 
                  {...focusHandlers}
                />
              </div>

              <div>
                <label style={labelStyle}>TÓM TẮT NGẮN (EXCERPT)</label>
                <textarea 
                  style={{ ...inputStyle, minHeight: 80 }} 
                  value={form.excerpt} 
                  onChange={e => update('excerpt', e.target.value)}
                  placeholder="Mô tả nội dung trong 1-2 câu..."
                  {...focusHandlers}
                />
              </div>

              <div>
                <label style={labelStyle}>NỘI DUNG CHI TIẾT (RICH TEXT)</label>
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 quill-container">
                  <ReactQuill 
                    theme="snow"
                    value={form.content}
                    onChange={(html) => update('content', html)}
                    modules={QUILL_MODULES}
                    className="text-white"
                  />
                </div>
                <style jsx global>{`
                  .quill-container .ql-toolbar {
                    background: rgba(255, 255, 255, 0.05);
                    border: none !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                  }
                  .quill-container .ql-container {
                    border: none !important;
                    min-height: 300px;
                    font-family: 'Be Vietnam Pro', sans-serif;
                    font-size: 1rem;
                  }
                  .quill-container .ql-editor {
                    color: white;
                  }
                  .quill-container .ql-stroke {
                    stroke: rgba(255, 255, 255, 0.6) !important;
                  }
                  .quill-container .ql-fill {
                    fill: rgba(255, 255, 255, 0.6) !important;
                  }
                  .quill-container .ql-picker {
                    color: rgba(255, 255, 255, 0.6) !important;
                  }
                  .quill-container .ql-picker-options {
                    background: #111 !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                  }
                `}</style>
              </div>
            </div>

            <div className="space-y-6">
              <div 
                className="p-5 rounded-2xl space-y-5"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div>
                  <label style={labelStyle}>ẢNH ĐẠI DIỆN (URL)</label>
                  <input 
                    style={inputStyle} 
                    value={form.coverImage} 
                    onChange={e => update('coverImage', e.target.value)} 
                    placeholder="https://..." 
                    {...focusHandlers}
                  />
                  {form.coverImage && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/10 relative aspect-[4/3]">
                      <Image src={form.coverImage} alt="Cover Preview" fill className="object-cover" sizes="300px" />
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>TRẠNG THÁI</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.status}
                    onChange={e => update('status', e.target.value as 'draft' | 'published')}
                    {...focusHandlers}
                  >
                    <option value="draft" style={{ background: '#111' }}>Draft (Nháp)</option>
                    <option value="published" style={{ background: '#111' }}>Published (Công khai)</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>NGÀY ĐĂNG</label>
                  <input 
                    type="date"
                    style={{ ...inputStyle, colorScheme: 'dark' }} 
                    value={form.publishedAt.split('T')[0]} 
                    onChange={e => update('publishedAt', new Date(e.target.value).toISOString())} 
                    {...focusHandlers}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 border-t border-white/10 flex items-center justify-end gap-4 bg-white/[0.02]">
          <button onClick={onClose} className="px-6 py-2.5 text-white/50 font-exo font-bold text-sm">HỦY BỎ</button>
          <button 
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-10 py-2.5 rounded-xl font-exo transition-all duration-300 hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #00FF88 0%, #00cc66 100%)', 
              color: '#000', 
              fontWeight: 800, 
              fontSize: '0.9rem',
              boxShadow: '0 0 20px rgba(0,255,136,0.2)'
            }}
          >
            <Save size={18} strokeWidth={2.5} /> LƯU BÀI VIẾT
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onCancel} />
      <div className="w-full max-w-sm bg-[#0a0a14] border border-red-500/30 rounded-2xl p-6 text-center z-10">
        <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
        <h3 className="font-orbitron text-white text-lg font-bold mb-2">Xác Nhận Xóa</h3>
        <p className="text-white/50 text-sm mb-6 font-vietnam">Bạn có chắc muốn xóa bài viết &quot;{title}&quot;? Hành động này không thể hoàn tác.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 bg-white/5 text-white/50 rounded-xl font-bold">Hủy</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold">Xóa</button>
        </div>
      </div>
    </div>
  );
}
