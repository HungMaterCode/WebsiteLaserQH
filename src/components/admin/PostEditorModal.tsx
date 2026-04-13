'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-[10px]"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden bg-[#0A0A14] border border-white/10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/7">
          <h2 className="font-body text-white font-extrabold text-[1.05rem]">
            {isNew ? 'Thêm Bài Đăng Mới' : 'Chỉnh Sửa Bài Đăng'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex bg-white/1 border-b border-white/6 overflow-x-auto no-scrollbar">
          {sectionTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className="flex-1 min-w-[100px] py-3 text-[0.75rem] font-bold transition-all border-b-[1.5px]"
              style={{
                borderColor: activeSection === tab.id ? '#00FF88' : 'transparent',
                color: activeSection === tab.id ? '#00FF88' : 'rgba(255,255,255,0.35)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSection === 'home' && (
            <div className="space-y-5">
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
          )}

          {activeSection === 'detail' && (
            <div className="space-y-5">
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

              <div>
                <AdminLabel>Nội dung chi tiết (Rich Text)</AdminLabel>
                <RichTextEditor value={form.fullDescription} onChange={(val) => update('fullDescription', val)} />
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
                  <button onClick={() => removeEquipment(i)} className="absolute top-3 right-3 text-white/20 hover:text-red-500 transition-colors">
                    <X size={14} />
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
            <div className="space-y-5">
              <div>
                <AdminLabel>SEO Title</AdminLabel>
                <AdminInput value={form.seoTitle} onChange={e => update('seoTitle', e.target.value)} />
              </div>
              <div>
                <AdminLabel>SEO Description</AdminLabel>
                <AdminInput as="textarea" rows={4} value={form.seoDesc} onChange={e => update('seoDesc', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <AdminLabel>SEO Icon</AdminLabel>
                  <ImageUpload type="icon" onUploadComplete={(url) => update('seoIcon', url)} currentValue={form.seoIcon} />
                </div>
                <div>
                  <AdminLabel>OG Image</AdminLabel>
                  <ImageUpload type="og" onUploadComplete={(url) => update('seoImage', url)} currentValue={form.seoImage} />
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
