'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, AlertTriangle, Search, AlertCircle } from 'lucide-react';
import { portfolioProjects as mockProjects } from '@/lib/data';

const CATEGORY_OPTIONS = [
  { value: 'mega', label: 'Mega Concert / Festival', color: '#00FF88' },
  { value: 'medium', label: 'Tầm Trung (Brand/Club)', color: '#00FF88' },
  { value: 'vip', label: 'VIP / Private / Gala', color: '#00FF88' },
];

const COLOR_PRESETS = ['#00FF88', '#00D472', '#00FFBB', '#FFFFFF', '#FFB800'];

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
  gallery: [''],
  highlight: '',
  client: '',
  duration: '',
  color: '#00FF88',
};

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
  transition: 'border-color 0.3s, box-shadow 0.3s',
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
    onFocus: (e: any) => {
      e.target.style.borderColor = 'rgba(0,255,136,0.5)';
      e.target.style.boxShadow = '0 0 8px rgba(0,255,136,0.15)';
    },
    onBlur: (e: any) => {
      e.target.style.borderColor = 'rgba(255,255,255,0.12)';
      e.target.style.boxShadow = 'none';
    },
  };
}

export function PostsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const focusHandlers = useFocusHandlers();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      
      if (!res.ok || !Array.isArray(data)) {
        console.error('Expected array but got:', data);
        setError(data.details || 'Không thể kết nối đến cơ sở dữ liệu. Đang hiển thị dữ liệu mẫu.');
        setProjects(mockProjects);
      } else {
        setProjects(data);
        setError(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Lỗi kết nối. Đang lấy dữ liệu mẫu.');
      setProjects(mockProjects);
      setLoading(false);
    }
  }

  const handleSave = async (p: any) => {
    try {
      const method = isNewProject ? 'POST' : 'PATCH';
      const url = isNewProject ? '/api/projects' : `/api/projects/${p.id}`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });

      if (res.ok) {
        fetchProjects();
        setEditingProject(null);
        setIsNewProject(false);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchProjects();
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  if (loading) return <div>Đang tải dự án...</div>;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-orbitron text-white mb-1" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quản Lý Bài Đăng</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            {projects.length} bài đăng · Thêm, sửa, xóa portfolio dự án
          </p>
        </div>
        <button
          onClick={() => { setEditingProject({ ...EMPTY_PROJECT }); setIsNewProject(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0 transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.08))',
            border: '1px solid rgba(0,255,136,0.4)',
            color: '#00FF88',
            fontSize: '0.82rem',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={15} />
          Thêm Mới
        </button>
      </div>

      {error && (
        <div 
          className="flex items-start gap-3 p-4 rounded-xl mb-6 animate-in fade-in slide-in-from-top-4 duration-500"
          style={{ background: 'rgba(255, 59, 48, 0.1)', border: '1px solid rgba(255, 59, 48, 0.2)' }}
        >
          <AlertCircle className="flex-shrink-0" style={{ color: '#FF3B30' }} size={20} />
          <div>
            <div className="text-white font-exo" style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cảnh báo hệ thống</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 2 }}>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên, địa điểm, khách hàng..."
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '8px',
              padding: '0.6rem 1rem 0.6rem 2.5rem',
              outline: 'none',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '0.83rem',
            }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            borderRadius: '8px',
            padding: '0.6rem 1rem',
            outline: 'none',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '0.83rem',
            cursor: 'pointer',
          }}
        >
          <option value="all" style={{ background: '#111' }}>Tất cả danh mục</option>
          {CATEGORY_OPTIONS.map(c => (
            <option key={c.value} value={c.value} style={{ background: '#111' }}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {filtered.map((project) => {
          const color = CATEGORY_OPTIONS.find(c => c.value === project.category)?.color || '#00FF88';
          return (
            <div
              key={project.id}
              className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={project.thumbnailImage || 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80'} 
                  alt={project.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}25`, color, fontSize: '0.58rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em' }}
                  >
                    {project.categoryLabel}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{project.year}</span>
                </div>
                <h3 className="text-white font-exo truncate" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{project.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{project.location}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => { setEditingProject({ ...project }); setIsNewProject(false); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-[#00FF88]/20"
                  style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88' }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(255,0,110,0.08)', border: '1px solid rgba(255,0,110,0.2)', color: 'rgba(255,0,110,0.6)' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingProject && (
        <PostEditorModal
          project={editingProject}
          isNew={isNewProject}
          onSave={handleSave}
          onClose={() => setEditingProject(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function PostEditorModal({
  project,
  isNew,
  onSave,
  onClose,
}: {
  project: any;
  isNew: boolean;
  onSave: (p: any) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<any>({ ...project });
  const [activeSection, setActiveSection] = useState<'basic' | 'content' | 'media' | 'equipment'>('basic');
  const focusHandlers = useFocusHandlers();

  const update = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));

  const updateEquipment = (i: number, field: string, value: string) => {
    const updated = form.equipment.map((eq: any, idx: number) => idx === i ? { ...eq, [field]: value } : eq);
    update('equipment', updated);
  };
  const addEquipment = () => update('equipment', [...(form.equipment || []), { name: '', quantity: '', specs: '' }]);
  const removeEquipment = (i: number) => update('equipment', form.equipment.filter((_: any, idx: number) => idx !== i));

  const updateGallery = (i: number, value: string) => {
    const updated = form.gallery.map((url: string, idx: number) => idx === i ? value : url);
    update('gallery', updated);
  };
  const addGallery = () => update('gallery', [...(form.gallery || []), '']);
  const removeGallery = (i: number) => update('gallery', form.gallery.filter((_: any, idx: number) => idx !== i));

  const handleSave = () => {
    const cleaned = {
      ...form,
      gallery: (form.gallery || []).filter((url: string) => url.trim() !== ''),
      equipment: (form.equipment || []).filter((eq: any) => eq.name.trim() !== ''),
    };
    onSave(cleaned);
  };

  const sectionTabs = [
    { id: 'basic', label: 'Cơ Bản' },
    { id: 'content', label: 'Nội Dung' },
    { id: 'media', label: 'Hình Ảnh' },
    { id: 'equipment', label: 'Thiết Bị' },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ background: '#0a0a14', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div>
            <h2 className="font-orbitron text-white" style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              {isNew ? 'Thêm Bài Đăng Mới' : 'Chỉnh Sửa Bài Đăng'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Section tabs */}
        <div
          className="flex flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}
        >
          {sectionTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className="flex-1 py-3 transition-all duration-200"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeSection === tab.id ? '2px solid #00FF88' : '2px solid transparent',
                color: activeSection === tab.id ? '#00FF88' : 'rgba(255,255,255,0.35)',
                fontSize: '0.75rem',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontWeight: activeSection === tab.id ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '1.5rem' }}>
          {activeSection === 'basic' && (
            <div className="space-y-4">
              <div>
                <label style={labelStyle}>TIÊU ĐỀ DỰ ÁN *</label>
                <input style={inputStyle} {...focusHandlers} value={form.title} onChange={e => update('title', e.target.value)} placeholder="VD: Samsung Galaxy Launch 2025" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>DANH MỤC *</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.category}
                    onChange={e => update('category', e.target.value as any)}
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.value} value={c.value} style={{ background: '#111' }}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>NHÃN DANH MỤC</label>
                  <input style={inputStyle} value={form.categoryLabel} onChange={e => update('categoryLabel', e.target.value)} placeholder="VD: Mega Concert" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>LOẠI SỰ KIỆN</label>
                  <input style={inputStyle} value={form.eventType} onChange={e => update('eventType', e.target.value)} placeholder="VD: Product Launch Event" />
                </div>
                <div>
                  <label style={labelStyle}>NĂM</label>
                  <input type="number" style={inputStyle} value={form.year} onChange={e => update('year', parseInt(e.target.value))} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>ĐỊA ĐIỂM</label>
                <input style={inputStyle} value={form.location} onChange={e => update('location', e.target.value)} placeholder="VD: Grand Ballroom, JW Marriott Hà Nội" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>QUY MÔ</label>
                  <input style={inputStyle} value={form.scale} onChange={e => update('scale', e.target.value)} placeholder="VD: 500 khách VIP" />
                </div>
                <div>
                  <label style={labelStyle}>KHÁCH HÀNG</label>
                  <input style={inputStyle} value={form.client} onChange={e => update('client', e.target.value)} placeholder="VD: Samsung Vietnam" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>THỜI GIAN SETUP</label>
                  <input style={inputStyle} value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="VD: 2 ngày setup, 1 đêm diễn" />
                </div>
                <div>
                  <label style={labelStyle}>ĐIỂM NỔI BẬT</label>
                  <input style={inputStyle} value={form.highlight} onChange={e => update('highlight', e.target.value)} placeholder="VD: 200 Kinetic Lights + Laser 360°" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>MÀU SẮC ACCENT</label>
                <div className="flex items-center gap-3">
                  {COLOR_PRESETS.map(c => (
                    <button
                      key={c}
                      onClick={() => update('color', c)}
                      className="w-8 h-8 rounded-lg flex-shrink-0 transition-all duration-200"
                      style={{
                        background: c,
                        border: form.color === c ? `2px solid white` : '2px solid transparent',
                        boxShadow: form.color === c ? `0 0 12px ${c}80` : 'none',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={form.color}
                    onChange={e => update('color', e.target.value)}
                    style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'content' && (
            <div className="space-y-4">
              <div>
                <label style={labelStyle}>MÔ TẢ NGẮN (hiển thị trong card)</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical' }}
                  rows={2}
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Mô tả ngắn về dự án (1-2 câu)..."
                />
              </div>
              <div>
                <label style={labelStyle}>MÔ TẢ ĐẦY ĐỦ (hiển thị trong trang chi tiết)</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical' }}
                  rows={5}
                  value={form.fullDescription}
                  onChange={e => update('fullDescription', e.target.value)}
                  placeholder="Mô tả chi tiết về dự án, quy trình thực hiện, kết quả đạt được..."
                />
              </div>
            </div>
          )}

          {activeSection === 'media' && (
            <div className="space-y-4">
              <div>
                <label style={labelStyle}>HERO IMAGE URL (ảnh đầu trang chi tiết)</label>
                <input style={inputStyle} value={form.heroImage} onChange={e => update('heroImage', e.target.value)} placeholder="https://..." />
                {form.heroImage && (
                  <div className="mt-2 rounded-lg overflow-hidden bg-white/5" style={{ height: 100 }}>
                    {form.heroImage ? (
                      <img src={form.heroImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-[0.7rem]">Chưa có ảnh Hero</div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>THUMBNAIL IMAGE URL (ảnh hiển thị trong grid)</label>
                <input style={inputStyle} value={form.thumbnailImage} onChange={e => update('thumbnailImage', e.target.value)} placeholder="https://..." />
                {form.thumbnailImage && (
                  <div className="mt-2 rounded-lg overflow-hidden bg-white/5" style={{ height: 80, width: 140 }}>
                    {form.thumbnailImage ? (
                      <img src={form.thumbnailImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-[0.7rem]">Chưa có ảnh Thumbnail</div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label style={labelStyle}>GALLERY IMAGES</label>
                  <button
                    onClick={addGallery}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200"
                    style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif", cursor: 'pointer' }}
                  >
                    <Plus size={12} /> Thêm ảnh
                  </button>
                </div>
                <div className="space-y-2">
                  {(form.gallery || []).map((url: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        value={url}
                        onChange={e => updateGallery(i, e.target.value)}
                        placeholder={`URL ảnh ${i + 1}...`}
                      />
                      {url && (
                        <img src={url} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                      )}
                      {(form.gallery || []).length > 1 && (
                        <button onClick={() => removeGallery(i)} style={{ color: 'rgba(255,0,110,0.6)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'equipment' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label style={labelStyle}>DANH SÁCH THIẾT BỊ</label>
                <button
                  onClick={addEquipment}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif", cursor: 'pointer' }}
                >
                  <Plus size={12} /> Thêm thiết bị
                </button>
              </div>
              <div className="space-y-3">
                {(form.equipment || []).map((eq: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl space-y-2"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ color: '#00FF88', fontSize: '0.68rem', fontFamily: 'Orbitron, sans-serif' }}>THIẾT BỊ #{i + 1}</span>
                      {(form.equipment || []).length > 1 && (
                        <button onClick={() => removeEquipment(i)} style={{ color: 'rgba(255,0,110,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <input style={inputStyle} value={eq.name} onChange={e => updateEquipment(i, 'name', e.target.value)} placeholder="Tên thiết bị..." />
                    <div className="grid grid-cols-2 gap-2">
                      <input style={inputStyle} value={eq.quantity} onChange={e => updateEquipment(i, 'quantity', e.target.value)} placeholder="Số lượng (VD: 24 units)" />
                      <input style={inputStyle} value={eq.specs} onChange={e => updateEquipment(i, 'specs', e.target.value)} placeholder="Thông số kỹ thuật..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div
          className="flex items-center justify-between gap-3 px-6 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontFamily: "'Be Vietnam Pro', sans-serif", cursor: 'pointer' }}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.1))',
              border: '1px solid rgba(0,255,136,0.4)',
              color: '#00FF88',
              fontSize: '0.85rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0,255,136,0.1)',
            }}
          >
            {isNew ? <Plus size={15} /> : <Pencil size={15} />}
            {isNew ? 'Thêm Bài Đăng' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ title, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm bg-[#0a0a14] border border-red-500/30 rounded-2xl p-6 text-center">
        <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
        <h3 className="font-orbitron text-white text-lg font-bold mb-2">Xác Nhận Xóa</h3>
        <p className="text-white/50 text-sm mb-6">Bạn có chắc muốn xóa "{title}"? Hành động này không thể hoàn tác.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 bg-white/5 text-white/50 rounded-xl">Hủy</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold">Xóa</button>
        </div>
      </div>
    </div>
  );
}
