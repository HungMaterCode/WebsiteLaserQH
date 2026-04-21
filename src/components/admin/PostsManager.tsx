'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, AlertCircle } from 'lucide-react';
import { LaserLoader } from '../ui/LaserLoader';
import { PostEditorModal } from './PostEditorModal';
import { DeleteConfirm } from './DeleteConfirm';
import { AdminInput } from './ui/AdminInput';
import { AdminButton } from './ui/AdminButton';

const CATEGORY_OPTIONS = [
  { value: 'mega', label: 'Mega Concert / Festival', color: '#00FF88' },
  { value: 'medium', label: 'Tầm Trung (Brand/Club)', color: '#00FF88' },
  { value: 'vip', label: 'VIP / Private / Gala', color: '#00FF88' },
];

const EMPTY_PROJECT = {
  id: '',
  title: '',
  category: 'mega',
  categoryLabel: 'Mega Concert',
  eventType: '',
  location: '',
  scale: '',
  year: new Date().getFullYear(),
  heroImage: '',
  thumbnailImage: '',
  description: '',
  fullDescription: '',
  equipment: [{ name: '', quantity: '', specs: '' }],
  highlight: '',
  client: '',
  duration: '',
  color: '#00FF88',
  seoTitle: '',
  seoDesc: '',
  seoIcon: '',
  seoImage: '',
  overviewVideoUrl: '',
};

export function PostsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.details || 'Lỗi kết nối máy chủ. Vui lòng kiểm tra lại.');
        setProjects([]);
      } else {
        setProjects(data);
        setError(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Lỗi kết nối hệ thống. Bạn có đang trực tuyến?');
      setLoading(false);
    }
  }

  const handleSave = async (p: any) => {
    setSaving(true);
    setError(null);
    try {
      const method = isNewProject ? 'POST' : 'PATCH';
      const url = isNewProject ? '/api/projects' : `/api/projects/${encodeURIComponent(p.id)}`;
      
      // Strip id if creating new to avoid empty string ID collision in Prisma
      const payload = isNewProject ? { ...p, id: undefined } : p;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchProjects();
        setEditingProject(null);
        setIsNewProject(false);
      } else {
        const data = await res.json();
        const detailMsg = data.details ? ` (${data.details})` : '';
        setError(`${data.error || 'Không thể lưu dự án.'}${detailMsg}`);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Lỗi kết nối máy chủ khi lưu dự án.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    setError(null);
    try {
      // Use AbortController to enforce a 15s timeout for the delete request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`/api/projects/${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        // Delete succeeded — close modal first, then refresh list separately
        setDeleteTarget(null);
        // Remove the project from local state immediately for instant UI feedback
        setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
        // Refresh list in background (don't block or throw on failure)
        fetchProjects().catch(() => {/* silent — local state already updated */});
      } else {
        const data = await res.json();
        const detailMsg = data.details ? ` (${data.details})` : '';
        setError(`${data.error || 'Không thể xóa dự án này.'}${detailMsg}`);
        setDeleteTarget(null);
      }
    } catch (error: any) {
      console.error('Error deleting project:', error);
      if (error?.name === 'AbortError') {
        setError('Yêu cầu xóa bị hết thời gian chờ. Hãy tải lại trang để kiểm tra.');
      } else {
        setError('Lỗi kết nối máy chủ. Hãy thử tải lại trang.');
      }
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <LaserLoader size="lg" color="#00FF88" />
      <span className="text-white/20 text-[0.7rem] uppercase tracking-[0.2em] font-black">Khởi động hệ thống...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="font-body text-white mb-2" style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Quản Lý Bài Đăng</h2>
          <p className="text-white/40 font-vietnam text-[0.8rem]">
            Trưng bày những dự án laser xuất sắc nhất của bạn ({projects.length} tổng số)
          </p>
        </div>
        <AdminButton icon={<Plus size={16} />} onClick={() => { setEditingProject({ ...EMPTY_PROJECT }); setIsNewProject(true); }}>
          THÊM MỚI
        </AdminButton>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-8 bg-red-500/10 border border-red-500/20 animate-in slide-in-from-top-4">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <div>
            <div className="text-white font-bold text-[0.85rem]">Sự cố kết nối</div>
            <div className="text-white/50 text-[0.75rem] font-vietnam mt-0.5">{error}</div>
            <button onClick={fetchProjects} className="mt-2 text-red-500 text-[0.7rem] font-bold hover:underline">THỬ LẠI NGAY</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
          <AdminInput
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm dự án, khách hàng, địa điểm..."
            style={{ paddingLeft: '2.8rem' }}
          />
        </div>
        <AdminInput as="select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ width: 'auto', minWidth: '200px' }}>
          <option value="all" className="bg-[#111]">Tất cả danh mục</option>
          {CATEGORY_OPTIONS.map(c => (
            <option key={c.value} value={c.value} className="bg-[#111]">{c.label}</option>
          ))}
        </AdminInput>
      </div>

      {/* Posts list */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((project) => {
          const cat = CATEGORY_OPTIONS.find(c => c.value === project.category);
          return (
            <div
              key={project.id}
              className="group flex items-center gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                <img 
                  src={project.thumbnailImage || 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80'} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[0.55rem] font-black tracking-widest uppercase border"
                    style={{ background: `${cat?.color}10`, borderColor: `${cat?.color}30`, color: cat?.color }}
                  >
                    {project.categoryLabel || 'PROJECT'}
                  </span>
                  <span className="text-white/20 text-[0.7rem] font-bold">{project.year}</span>
                </div>
                <h3 className="text-white font-bold text-[0.9rem] leading-snug">{project.title}</h3>
                <p className="text-white/40 font-vietnam text-[0.75rem] leading-relaxed">{project.location}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => { setEditingProject({ ...project }); setIsNewProject(false); }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#00FF88] hover:border-[#00FF88]/50 hover:bg-[#00FF88]/10 transition-all"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-white/15 font-bold uppercase tracking-[0.2em] text-xs">Không tìm thấy dự án nào</p>
          </div>
        )}
      </div>

      {editingProject && (
        <PostEditorModal
          project={editingProject}
          isNew={isNewProject}
          onSave={handleSave}
          onClose={() => setEditingProject(null)}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          title={deleteTarget.title}
          message={`Bạn có chắc chắn muốn xóa vĩnh viễn dự án "${deleteTarget.title}"? Mọi dữ liệu liên quan và hình ảnh của dự án này sẽ không thể khôi phục.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={saving}
        />
      )}
    </div>
  );
}
