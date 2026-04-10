'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, AlertTriangle, Search, AlertCircle } from 'lucide-react';
import { PortfolioProject, portfolioProjects as mockProjects } from '@/lib/data';

const CATEGORY_OPTIONS = [
  { value: 'mega', label: 'Mega Concert / Festival', color: '#00FF88' },
  { value: 'medium', label: 'Tầm Trung (Brand/Club)', color: '#00FF88' },
  { value: 'vip', label: 'VIP / Private / Gala', color: '#00FF88' },
] as const;

const COLOR_PRESETS = ['#00FF88', '#00D472', '#00FFBB', '#FFFFFF', '#FFB800'];

const EMPTY_PROJECT: PortfolioProject = {
  id: '',
  slug: '',
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

export function PostsManager() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioProject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/projects');
        const data = await res.json();
        
        if (!res.ok || !Array.isArray(data)) {
          setProjects(mockProjects);
          setError(null);
        } else {
          setProjects(data);
          setError(null);
        }
      } catch {
        setProjects(mockProjects);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [refreshTrigger]);

  const handleSave = useCallback(async (p: PortfolioProject) => {
    try {
      if (isNewProject) {
        setProjects(prev => [{ ...p, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
      } else {
        setProjects(prev => prev.map(item => item.id === p.id ? p : item));
      }
      setEditingProject(null);
      setIsNewProject(false);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  }, [isNewProject]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }, [deleteTarget]);

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  if (loading) return <div className="p-8 text-white/50 font-exo">Đang tải dự án...</div>;

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
          onClick={() => { 
            setEditingProject({ ...EMPTY_PROJECT, id: Math.random().toString(36).substr(2, 9) }); 
            setIsNewProject(true); 
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl flex-shrink-0 transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #00FF88, #00cc66)',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          THÊM MỚI
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

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên, địa điểm, khách hàng..."
            style={inputStyle}
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={inputStyle}
          className="sm:w-48 appearance-none cursor-pointer"
        >
          <option value="all" style={{ background: '#111' }}>Tất cả danh mục</option>
          {CATEGORY_OPTIONS.map(c => (
            <option key={c.value} value={c.value} style={{ background: '#111' }}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((project) => {
          const color = CATEGORY_OPTIONS.find(c => c.value === project.category)?.color || '#00FF88';
          return (
            <div
              key={project.id}
              className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative">
                {project.thumbnailImage ? (
                  <Image src={project.thumbnailImage} alt={project.title} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">?</div>
                )}
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
  project: PortfolioProject;
  isNew: boolean;
  onSave: (p: PortfolioProject) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PortfolioProject>({ ...project });
  const [activeSection, setActiveSection] = useState<'basic' | 'content' | 'media' | 'equipment'>('basic');
  const focusHandlers = useFocusHandlers();

  const update = (field: keyof PortfolioProject, value: any) => 
    setForm((prev: PortfolioProject) => ({ ...prev, [field]: value }));

  const updateEquipment = (i: number, field: string, value: string) => {
    const updated = (form.equipment || []).map((eq, idx: number) => idx === i ? { ...eq, [field]: value } : eq);
    update('equipment', updated);
  };
  const addEquipment = () => update('equipment', [...(form.equipment || []), { name: '', quantity: '', specs: '' }]);
  const removeEquipment = (i: number) => update('equipment', form.equipment.filter((_, idx: number) => idx !== i));

  const updateGallery = (i: number, value: string) => {
    const updated = (form.gallery || []).map((url: string, idx: number) => idx === i ? value : url);
    update('gallery', updated);
  };
  const addGallery = () => update('gallery', [...(form.gallery || []), '']);
  const removeGallery = (i: number) => update('gallery', form.gallery.filter((_, idx: number) => idx !== i));

  const handleSave = () => {
    if (!form.title.trim()) return alert('Vui lòng nhập tiêu đề dự án');
    
    const cleaned = {
      ...form,
      gallery: (form.gallery || []).filter((url: string) => url.trim() !== ''),
      equipment: (form.equipment || []).filter((eq) => eq.name.trim() !== ''),
      slug: form.slug || form.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
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
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ background: '#0a0a14', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-8 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div>
            <h2 className="font-orbitron text-white text-lg font-bold tracking-tight">
              {isNew ? 'THÊM BÀI ĐĂNG MỚI' : 'CHỈNH SỬA BÀI ĐĂNG'}
            </h2>
            <p className="text-white/30 text-[0.7rem] font-vietnam uppercase tracking-wider mt-0.5">Quản lý Portfolio dự án</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/30 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="flex flex-shrink-0 px-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}
        >
          {sectionTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className="flex-1 py-4 transition-all duration-300 relative font-orbitron text-[0.7rem] tracking-widest font-bold"
              style={{
                background: 'none',
                border: 'none',
                color: activeSection === tab.id ? '#00FF88' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
            >
              {tab.label.toUpperCase()}
              {activeSection === tab.id && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: '2rem' }}>
          {activeSection === 'basic' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div>
                <label style={labelStyle}>TIÊU ĐỀ DỰ ÁN *</label>
                <input style={inputStyle} {...focusHandlers} value={form.title} onChange={e => update('title', e.target.value)} placeholder="VD: Samsung Galaxy Launch 2025" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>DANH MỤC *</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.category}
                    onChange={e => update('category', e.target.value as 'vip' | 'medium' | 'mega')}
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.value} value={c.value} style={{ background: '#111' }}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>SLUG DỰ ÁN (URL)</label>
                  <input style={inputStyle} value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="vd-project-slug" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>LOẠI SỰ KIỆN</label>
                  <input style={inputStyle} value={form.eventType} onChange={e => update('eventType', e.target.value)} placeholder="VD: Product Launch Event" />
                </div>
                <div>
                  <label style={labelStyle}>NĂM THỰC HIỆN</label>
                  <input type="number" style={inputStyle} value={form.year} onChange={e => update('year', parseInt(e.target.value))} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>ĐỊA ĐIỂM TỔ CHỨC</label>
                <input style={inputStyle} value={form.location} onChange={e => update('location', e.target.value)} placeholder="VD: Grand Ballroom, JW Marriott Hà Nội" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>QUY MÔ</label>
                  <input style={inputStyle} value={form.scale} onChange={e => update('scale', e.target.value)} placeholder="VD: 500 khách VIP" />
                </div>
                <div>
                  <label style={labelStyle}>KHÁCH HÀNG (CLIENT)</label>
                  <input style={inputStyle} value={form.client} onChange={e => update('client', e.target.value)} placeholder="VD: Samsung Vietnam" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>MÀU SẮC CHỦ ĐẠO (ACCENT)</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                    {COLOR_PRESETS.map(c => (
                      <button
                        key={c}
                        onClick={() => update('color', c)}
                        className="w-7 h-7 rounded-lg transition-transform hover:scale-110 active:scale-95"
                        style={{
                          background: c,
                          border: form.color === c ? `2px solid white` : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: form.color === c ? `0 0 10px ${c}80` : 'none',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={form.color}
                    onChange={e => update('color', e.target.value)}
                    style={{ width: 44, height: 44, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'content' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div>
                <label style={labelStyle}>MÔ TẢ NGẮN (SUMMARY)</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical' }}
                  rows={3}
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Mô tả tóm tắt để thu hút người dùng trong trang danh sách..."
                />
              </div>
              <div>
                <label style={labelStyle}>MÔ TẢ CHI TIẾT (FULL STORY)</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '200px' }}
                  rows={8}
                  value={form.fullDescription}
                  onChange={e => update('fullDescription', e.target.value)}
                  placeholder="Kể lại câu chuyện dự án, những thách thức và giải pháp kỹ thuật laser chúng tôi đã thực hiện..."
                />
              </div>
              <div>
                <label style={labelStyle}>ĐIỂM NỔI BẬT (HIGHLIGHT)</label>
                <input style={inputStyle} value={form.highlight} onChange={e => update('highlight', e.target.value)} placeholder="VD: 200 Kinetic Lights + Laser 360°" />
              </div>
            </div>
          )}

          {activeSection === 'media' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label style={labelStyle}>HERO IMAGE (URL)</label>
                  <input style={inputStyle} value={form.heroImage} onChange={e => update('heroImage', e.target.value)} placeholder="https://..." />
                  <div className="rounded-xl overflow-hidden aspect-[16/6] bg-white/5 border border-white/10 relative">
                    {form.heroImage && <Image src={form.heroImage} alt="Hero" fill className="object-cover" sizes="400px" />}
                  </div>
                </div>
                <div className="space-y-2">
                  <label style={labelStyle}>THUMBNAIL (URL)</label>
                  <input style={inputStyle} value={form.thumbnailImage} onChange={e => update('thumbnailImage', e.target.value)} placeholder="https://..." />
                  <div className="rounded-xl overflow-hidden aspect-[16/9] bg-white/5 border border-white/10 relative">
                    {form.thumbnailImage && <Image src={form.thumbnailImage} alt="Thumb" fill className="object-cover" sizes="400px" />}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <label style={labelStyle}>GALLERY IMAGES ({form.gallery?.length || 0})</label>
                  <button onClick={addGallery} className="text-[#00FF88] text-[0.7rem] font-bold font-orbitron hover:underline cursor-pointer">+ THÊM ẢNH</button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {(form.gallery || []).map((url: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <input style={{ ...inputStyle, flex: 1 }} value={url} onChange={e => updateGallery(i, e.target.value)} placeholder="URL ảnh gallery..." />
                      <button onClick={() => removeGallery(i)} className="p-2 text-white/20 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'equipment' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="flex items-center justify-between mb-2">
                <label style={labelStyle}>DANH SÁCH THIẾT BỊ SỬ DỤNG</label>
                <button onClick={addEquipment} className="text-[#00FF88] text-[0.7rem] font-bold font-orbitron hover:underline cursor-pointer">+ THÊM THIẾT BỊ</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(form.equipment || []).map((eq, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 relative group">
                    <button onClick={() => removeEquipment(i)} className="absolute top-4 right-4 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><X size={16} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/20 text-[0.6rem] uppercase tracking-wider block mb-1">Tên thiết bị</label>
                        <input style={inputStyle} value={eq.name} onChange={e => updateEquipment(i, 'name', e.target.value)} placeholder="VD: Laser RGB 30W" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-white/20 text-[0.6rem] uppercase tracking-wider block mb-1">Số lượng</label>
                          <input style={inputStyle} value={eq.quantity} onChange={e => updateEquipment(i, 'quantity', e.target.value)} placeholder="VD: 12 units" />
                        </div>
                        <div>
                          <label className="text-white/20 text-[0.6rem] uppercase tracking-wider block mb-1">Thông số</label>
                          <input style={inputStyle} value={eq.specs} onChange={e => updateEquipment(i, 'specs', e.target.value)} placeholder="Full-color, ILDA" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="px-8 py-5 border-t border-white/10 flex items-center justify-end gap-5 bg-white/[0.02]"
        >
          <button onClick={onClose} className="text-white/40 font-orbitron text-[0.75rem] font-bold tracking-widest hover:text-white transition-colors cursor-pointer">HỦY BỎ</button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-10 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #00FF88, #00cc66)',
              color: '#000',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 800,
              boxShadow: '0 0 20px rgba(0,255,136,0.2)',
              cursor: 'pointer',
            }}
          >
            LƯU DỰ ÁN
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-sm bg-[#0a0a14] border border-red-500/30 rounded-3xl p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h3 className="font-orbitron text-white text-lg font-bold mb-3">XÁC NHẬN XÓA</h3>
        <p className="text-white/40 text-[0.85rem] mb-8 font-vietnam leading-relaxed">Bạn có chắc muốn xóa vĩnh viễn dự án &quot;{title.toUpperCase()}&quot;? Hành động này không thể hoàn tác.</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={onCancel} className="py-3 bg-white/5 text-white/40 rounded-xl font-orbitron text-[0.7rem] font-bold tracking-widest hover:bg-white/10 cursor-pointer">HỦY</button>
          <button onClick={onConfirm} className="py-3 bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-orbitron text-[0.7rem] font-bold tracking-widest hover:bg-red-500/30 cursor-pointer">XÓA BỎ</button>
        </div>
      </div>
    </div>
  );
}
