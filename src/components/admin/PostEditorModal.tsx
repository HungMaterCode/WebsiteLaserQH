'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X, MapPin, Calendar, Clock, Zap, MessageSquare, ChevronRight, Globe, Info, Users, Briefcase, Wrench } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { AdminInput } from './ui/AdminInput';
import { AdminLabel } from './ui/AdminLabel';
import { AdminButton } from './ui/AdminButton';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-white/5 rounded-lg border border-white/10 animate-pulse" />
});

const COLOR_PRESETS = ['#00FF88', '#00D472', '#00FFBB', '#FFFFFF', '#FFB800'];
const CATEGORY_OPTIONS = [
  { value: 'mega', label: 'Mega Concert / Festival' },
  { value: 'medium', label: 'Tầm Trung (Brand/Club)' },
  { value: 'vip', label: 'VIP / Private / Gala' },
];

export function PostEditorModal({
  project,
  isNew,
  onSave,
  onClose,
  saving,
}: {
  project: any;
  isNew: boolean;
  onSave: (p: any) => void;
  onClose: () => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState<any>({ ...project });
  const [activeSection, setActiveSection] = useState<'home' | 'detail' | 'assets' | 'seo'>('home');

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const update = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));

  const updateEquipment = (i: number, field: string, value: string) => {
    const updated = form.equipment.map((eq: any, idx: number) => idx === i ? { ...eq, [field]: value } : eq);
    update('equipment', updated);
  };
  const addEquipment = () => update('equipment', [...(form.equipment || []), { name: '', quantity: '', specs: '' }]);
  const removeEquipment = (i: number) => update('equipment', form.equipment.filter((_: any, idx: number) => idx !== i));

  const handleSave = () => {
    const cleaned = {
      ...form,
      equipment: (form.equipment || []).filter((eq: any) => eq.name.trim() !== ''),
    };
    onSave(cleaned);
  };

  const sectionTabs = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'detail', label: 'Trang Chi Tiết' },
    { id: 'assets', label: 'Thiết Bị' },
    { id: 'seo', label: 'Tối ưu SEO' },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-[200] flex justify-center items-center overflow-hidden py-4 sm:py-8 bg-black/85 backdrop-blur-[10px]"
    >
      <div
        className="w-full max-w-7xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden bg-[#0A0A14] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/7">
          <h2 className="font-body text-white font-extrabold text-[1.05rem]">
            {isNew ? 'Thêm Bài Đăng Mới' : 'Chỉnh Sửa Bài Đăng'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-red-500/20 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex bg-white/1 border-b border-white/6 overflow-x-auto no-scrollbar shrink-0">
          {sectionTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className="flex-1 min-w-[100px] py-4 text-[0.75rem] font-bold transition-all border-b-2"
              style={{
                borderColor: activeSection === tab.id ? '#00FF88' : 'transparent',
                color: activeSection === tab.id ? '#00FF88' : 'rgba(255,255,255,0.5)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSection === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Form Column */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <AdminLabel>Tiêu đề dự án *</AdminLabel>
                  <AdminInput value={form.title} onChange={e => update('title', e.target.value)} placeholder="VD: Sky Tour Sơn Tùng M-TP" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <AdminLabel>Danh mục *</AdminLabel>
                    <AdminInput as="select" value={form.category} onChange={e => update('category', e.target.value as any)}>
                      {CATEGORY_OPTIONS.map(c => (
                        <option key={c.value} value={c.value} className="bg-[#111]">{c.label}</option>
                      ))}
                    </AdminInput>
                  </div>
                  <div>
                    <AdminLabel>Nhãn hiển thị</AdminLabel>
                    <AdminInput value={form.categoryLabel} onChange={e => update('categoryLabel', e.target.value)} placeholder="VD: Mega Concert" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <AdminLabel>Năm thực hiện</AdminLabel>
                    <AdminInput type="number" value={form.year} onChange={e => update('year', e.target.value === '' ? '' : parseInt(e.target.value))} />
                  </div>
                  <div>
                    <AdminLabel>Màu sắc chủ đạo</AdminLabel>
                    <div className="flex items-center gap-2 h-[38px]">
                      {COLOR_PRESETS.map(c => (
                        <button
                          key={c}
                          onClick={() => update('color', c)}
                          className="w-6 h-6 rounded-full transition-all border-2"
                          style={{
                            backgroundColor: c,
                            borderColor: form.color === c ? '#fff' : 'rgba(255,255,255,0.1)',
                            boxShadow: form.color === c ? `0 0 10px ${c}80` : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <AdminLabel>Ảnh Thumbnail (Home)</AdminLabel>
                  <div className="space-y-3">
                    <AdminInput value={form.thumbnailImage} onChange={e => update('thumbnailImage', e.target.value)} placeholder="URL ảnh..." />
                    <ImageUpload onUploadComplete={(url) => update('thumbnailImage', url)} currentValue={form.thumbnailImage} />
                    {form.thumbnailImage && (
                      <div className="rounded-lg overflow-hidden bg-white/5 w-40 h-24">
                        <img src={form.thumbnailImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <AdminLabel>Mô tả ngắn (Card)</AdminLabel>
                  <AdminInput as="textarea" rows={3} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Mô tả tóm tắt..." />
                </div>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-5 lg:sticky lg:top-0 self-start space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-[#00FF88]/10 flex items-center justify-center">
                    <Zap size={12} className="text-[#00FF88]" />
                  </div>
                  <AdminLabel style={{ marginBottom: 0 }}>Xem trước (Card Home)</AdminLabel>
                </div>

                <div className="flex justify-center p-6 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#00FF88]/1 opacity-[0.03] pointer-events-none" />

                  <div
                    className="w-full max-w-[320px] rounded-[20px] overflow-hidden border transition-all duration-500 pointer-events-none shadow-2xl"
                    style={{
                      background: '#050912',
                      borderColor: form.color ? `${form.color}40` : 'rgba(255,255,255,0.08)',
                      boxShadow: form.color ? `0 10px 40px ${form.color}15` : 'none'
                    }}
                  >
                    <div className="relative aspect-[4/3] bg-[#0A0F1A] overflow-hidden">
                      {form.thumbnailImage ? (
                        <img src={form.thumbnailImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/10 gap-2">
                          <Zap size={24} />
                          <span className="text-[0.6rem] font-bold tracking-widest uppercase">No Thumbnail</span>
                        </div>
                      )}

                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[0.6rem] font-bold tracking-wider z-10 backdrop-blur-md"
                        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${form.color}60`, color: form.color }}>
                        {(form.categoryLabel || 'PROJECT').toUpperCase()}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(to top, #050912, transparent)' }} />
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-80"
                        style={{ background: `linear-gradient(90deg, transparent, ${form.color}, transparent)` }} />
                    </div>

                    <div className="p-6">
                      <h3 className="text-white font-bold mb-1.5 text-[1.1rem] line-clamp-2 font-header leading-[1.35]">
                        {form.title || 'Tiêu đề dự án của bạn'}
                      </h3>
                      <p className="text-white/40 text-[0.75rem] mb-4 font-vietnam">
                        {form.location || 'Địa điểm tổ chức'} · {form.year || '2026'}
                      </p>

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 self-start"
                        style={{ background: `${form.color}15`, border: `1px solid ${form.color}30` }}>
                        <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: form.color }}></span>
                        <span style={{ color: form.color, fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-vietnam)' }}>
                          {form.highlight || 'Đặc điểm nổi bật'}
                        </span>
                      </div>

                      <p className="text-white/60 text-[0.8rem] line-clamp-2 mb-6 leading-relaxed font-vietnam">
                        {form.description || 'Đoạn mô tả ngắn này sẽ giúp khách hàng hiểu nhanh về quy mô và ấn tượng của dự án...'}
                      </p>

                      <div className="w-full py-3 rounded-xl text-[0.8rem] font-bold flex items-center justify-center gap-2 transition-all transition-duration-300"
                        style={{ background: `${form.color}10`, border: `1px solid ${form.color}30`, color: form.color }}>
                        XEM CHI TIẾT <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'detail' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Form Column */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <AdminLabel>Ảnh Hero (Chi tiết)</AdminLabel>
                  <div className="space-y-3">
                    <AdminInput value={form.heroImage} onChange={e => update('heroImage', e.target.value)} placeholder="URL ảnh nền lớn..." />
                    <ImageUpload onUploadComplete={(url) => update('heroImage', url)} currentValue={form.heroImage} />
                    {form.heroImage && (
                      <div className="rounded-lg overflow-hidden bg-white/5 h-32">
                        <img src={form.heroImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <AdminLabel>Loại hình sự kiện</AdminLabel>
                    <AdminInput value={form.eventType} onChange={e => update('eventType', e.target.value)} placeholder="VD: Live Concert" />
                  </div>
                  <div>
                    <AdminLabel>Địa điểm</AdminLabel>
                    <AdminInput value={form.location} onChange={e => update('location', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <AdminLabel>Quy mô</AdminLabel>
                    <AdminInput value={form.scale} onChange={e => update('scale', e.target.value)} />
                  </div>
                  <div>
                    <AdminLabel>Khách hàng</AdminLabel>
                    <AdminInput value={form.client} onChange={e => update('client', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <AdminLabel>Thời gian diễn ra</AdminLabel>
                    <AdminInput value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="VD: 1 đêm biểu diễn" />
                  </div>
                  <div>
                    <AdminLabel>Điểm nổi bật</AdminLabel>
                    <AdminInput value={form.highlight} onChange={e => update('highlight', e.target.value)} placeholder="VD: Hệ thống Kinetic tối tân" />
                  </div>
                </div>

                <div>
                  <AdminLabel>Nội dung chi tiết (Rich Text)</AdminLabel>
                  <RichTextEditor value={form.fullDescription} onChange={(val) => update('fullDescription', val)} />
                </div>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-6 lg:sticky lg:top-0 self-start space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-[#00FF88]/10 flex items-center justify-center">
                    <Info size={12} className="text-[#00FF88]" />
                  </div>
                  <AdminLabel style={{ marginBottom: 0 }}>Xem trước (Giao diện chi tiết)</AdminLabel>
                </div>

                <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#02050A] shadow-2xl transform lg:scale-[0.85] origin-top">
                  <div className="relative h-60 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                      style={{ backgroundImage: `url(${form.heroImage || form.thumbnailImage || ''})` }}
                    >
                      {!form.heroImage && !form.thumbnailImage && (
                        <div className="w-full h-full bg-[#0A0A1F] flex items-center justify-center">
                          <span className="text-white/10 text-[0.6rem] font-bold tracking-widest uppercase">No Hero Image</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02050A] via-[#02050A]/20 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-6">
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-3 py-1 rounded-full text-[0.6rem] font-bold tracking-[0.2em] backdrop-blur-md"
                            style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${form.color}60`, color: form.color }}>
                            {(form.categoryLabel || 'PROJECT').toUpperCase()}
                          </span>
                          <div className="h-px w-10 bg-white/20" />
                          <span className="text-white/60 text-[0.6rem] font-header tracking-widest uppercase">{form.eventType || 'Event Type'}</span>
                        </div>
                        <h1 className="text-white text-xl md:text-2xl font-black mb-6 leading-[1.1] font-header max-w-xl">
                          {form.title || 'Tiêu Đề Dự án'}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-white/70">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
                              <MapPin size={14} style={{ color: form.color }} />
                            </div>
                            <div className="text-[0.75rem] font-semibold">{form.location || 'Địa điểm'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
                              <Calendar size={14} style={{ color: form.color }} />
                            </div>
                            <div className="text-[0.75rem] font-semibold">Năm {form.year || '2026'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Overview */}
                      <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-4">
                          <h2 className="text-white text-lg font-bold flex items-center gap-3 font-header">
                            <span className="w-1 h-6 rounded-full" style={{ background: form.color }}></span>
                            Tổng Quan Dự Án
                          </h2>
                          {(() => {
                            const raw = form.fullDescription || '';
                            if (!raw) return <p className="text-white/50 text-[0.7rem] italic">Nội dung sẽ hiển thị ở đây...</p>;
                            const sanitized = raw.replace(/&nbsp;/gi, ' ').replace(/[\u00a0]/g, ' ');
                            const isHtml = sanitized.trim().startsWith('<') || sanitized.includes('</p>');
                            if (isHtml) {
                              return (
                                <div
                                  className="text-white/70 text-[0.8rem] rich-text-content leading-[1.6]"
                                  style={{ fontFamily: 'var(--font-vietnam)' }}
                                  dangerouslySetInnerHTML={{ __html: sanitized }}
                                />
                              );
                            }
                            return <p className="text-white/70 text-[0.8rem] leading-[1.6]">{sanitized}</p>;
                          })()}
                        </div>
                      </div>

                      {/* Right: Sidebar Stats + CTA */}
                      <div className="lg:col-span-4 space-y-6">
                        {/* Project Details Stats */}
                        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                          <h3 className="text-white/40 text-[0.6rem] font-bold tracking-[0.2em] font-header mb-6 uppercase">Chi tiết dự án</h3>
                          <div className="space-y-4">
                            {[
                              { label: 'QUY MÔ', value: form.scale, icon: Users },
                              { label: 'KHÁCH HÀNG', value: form.client, icon: Briefcase },
                              { label: 'THỜI GIAN', value: form.duration, icon: Clock },
                              { label: 'NỔI BẬT', value: form.highlight, icon: Zap },
                            ].map((stat, i) => (
                              <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${form.color}10`, border: `1px solid ${form.color}20` }}>
                                  <stat.icon size={12} style={{ color: form.color }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-[0.55rem] font-bold text-white/30 tracking-widest font-header mb-0.5">{stat.label}</div>
                                  <div className="text-white/90 text-[0.7rem] font-bold truncate leading-tight">{stat.value || '...'}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Booking CTA Card */}
                        <div className="p-5 rounded-2xl border overflow-hidden relative" style={{ borderColor: `${form.color}40`, background: `${form.color}05` }}>
                          <div className="absolute top-0 right-0 w-20 h-20 blur-[40px]" style={{ background: form.color, opacity: 0.3 }} />
                          <div className="relative z-10">
                            <h4 className="text-white text-[0.9rem] font-bold mb-3 font-header leading-tight">Bạn muốn tổ chức một show tương tự?</h4>
                            <p className="text-white/60 text-[0.65rem] mb-4 leading-relaxed font-body">
                              Để Laser QH tư vấn giải pháp ánh sáng & hiệu ứng tối ưu nhất cho sự kiện của bạn tại {(form.location || 'Hà Nội').split(',').pop()?.trim()}.
                            </p>
                            <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.65rem] font-bold transition-all"
                              style={{ background: form.color, color: '#000' }}>
                              <MessageSquare size={12} />
                              Nhận Tư Vấn & Báo Giá
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'assets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <AdminLabel style={{ marginBottom: 0 }}>Danh sách thiết bị</AdminLabel>
                <AdminButton variant="secondary" onClick={addEquipment} style={{ fontSize: '0.65rem' }}>+ THÊM</AdminButton>
              </div>
              {form.equipment.map((eq: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3 relative">
                  <button 
                    onClick={() => removeEquipment(i)} 
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-red-500 transition-all shadow-sm"
                    title="Xóa thiết bị"
                  >
                    <X size={18} />
                  </button>
                  <AdminInput value={eq.name} onChange={e => updateEquipment(i, 'name', e.target.value)} placeholder="Tên thiết bị..." />
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput value={eq.quantity} onChange={e => updateEquipment(i, 'quantity', e.target.value)} placeholder="Số lượng" />
                    <AdminInput value={eq.specs} onChange={e => updateEquipment(i, 'specs', e.target.value)} placeholder="Thông số" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'seo' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-6 space-y-5">
              <div>
                <AdminLabel>SEO Title</AdminLabel>
                <AdminInput value={form.seoTitle} onChange={e => update('seoTitle', e.target.value)} />
              </div>
              <div>
                <AdminLabel>SEO Description</AdminLabel>
                <AdminInput as="textarea" rows={4} value={form.seoDesc} onChange={e => update('seoDesc', e.target.value)} style={{ textAlign: 'justify' }} />
              </div>

              {/* SEO Icon */}
              <div>
                <AdminLabel>SEO Icon (Favicon / Logo nhỏ trên Google)</AdminLabel>
                <div className="flex items-start gap-3">
                  {/* Preview */}
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {form.seoIcon
                      ? <img src={form.seoIcon} alt="SEO Icon" className="w-10 h-10 object-contain" />
                      : <Info size={20} className="text-white/20" />
                    }
                  </div>
                  <div className="flex-1 space-y-2">
                    {/* URL input + copy */}
                    <div className="flex items-center gap-2">
                      <AdminInput
                        value={form.seoIcon || ''}
                        onChange={e => update('seoIcon', e.target.value)}
                        placeholder="URL icon (tự nhập hoặc tải lên bên dưới)..."
                      />
                      {form.seoIcon && (
                        <button
                          type="button"
                          title="Copy URL"
                          onClick={() => navigator.clipboard.writeText(form.seoIcon)}
                          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-[#00FF88] hover:border-[#00FF88]/30 transition-all"
                        >
                          <Globe size={14} />
                        </button>
                      )}
                    </div>
                    <ImageUpload type="icon" onUploadComplete={(url) => update('seoIcon', url)} currentValue={form.seoIcon} />
                  </div>
                </div>
              </div>

              {/* OG Image */}
              <div>
                <AdminLabel>OG Image (Ảnh hiển thị khi chia sẻ lên mạng xã hội)</AdminLabel>
                <div className="space-y-2">
                  {/* URL input + copy */}
                  <div className="flex items-center gap-2">
                    <AdminInput
                      value={form.seoImage || ''}
                      onChange={e => update('seoImage', e.target.value)}
                      placeholder="URL ảnh OG (tự nhập hoặc tải lên bên dưới)..."
                    />
                    {form.seoImage && (
                      <button
                        type="button"
                        title="Copy URL"
                        onClick={() => navigator.clipboard.writeText(form.seoImage)}
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-[#00FF88] hover:border-[#00FF88]/30 transition-all"
                      >
                        <Globe size={14} />
                      </button>
                    )}
                  </div>
                  <ImageUpload type="og" onUploadComplete={(url) => update('seoImage', url)} currentValue={form.seoImage} />
                  {/* OG Image Preview */}
                  {form.seoImage && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-white/10 bg-white/5 aspect-[1200/630] w-full max-w-md">
                      <img src={form.seoImage} alt="OG Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:sticky lg:top-0 self-start space-y-6">
                {/* Google Search Preview */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#00FF88]/10 flex items-center justify-center">
                      <Globe size={12} className="text-[#00FF88]" />
                    </div>
                    <AdminLabel style={{ marginBottom: 0 }}>Xem trước — Kết quả Google Search</AdminLabel>
                  </div>

                  <div className="p-5 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl">
                    <div className="flex gap-4">
                      {/* Left: text content */}
                      <div className="flex-1 min-w-0">
                        {/* Site info row */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                            {form.seoIcon
                              ? <img src={form.seoIcon} alt="" className="w-5 h-5 object-contain" />
                              : <div className="w-3.5 h-3.5 rounded-sm" style={{ background: form.color || '#00FF88' }} />
                            }
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-medium text-[#202124] leading-none">Laser QH Production</div>
                            <div className="text-[12px] text-[#4d5156] leading-snug truncate">
                              https://website-laser-qh.vercel.app › du-an › {form.slug || 'slug'}
                            </div>
                          </div>
                        </div>
                        {/* Title - full, no clamp */}
                        <div className="text-[20px] text-[#1a0dab] font-medium leading-snug mb-1.5 hover:underline cursor-pointer">
                          {form.seoTitle || form.title || 'Tiêu đề trang sẽ hiển thị ở đây'}
                        </div>
                        {/* Description - full, no clamp */}
                        <div className="text-[14px] text-[#4d5156] leading-relaxed" style={{ textAlign: 'justify' }}>
                          {form.seoDesc || form.description || 'Đây là mô tả tóm tắt xuất hiện trên Google. Nên từ 130–160 ký tự để hiển thị đầy đủ...'}
                        </div>
                      </div>
                      {/* Right: thumbnail image (like Google rich results) */}
                      {(form.seoImage || form.heroImage || form.thumbnailImage) && (
                        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 self-center">
                          <img
                            src={form.seoImage || form.heroImage || form.thumbnailImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/7 bg-white/1 flex justify-end gap-3">
          <AdminButton variant="secondary" onClick={onClose}>Hủy</AdminButton>
          <AdminButton loading={saving} onClick={handleSave}>Lưu Bài Viết</AdminButton>
        </div>
      </div>
    </div>
  );
}
