'use client';

import { useState, useEffect } from 'react';
import { Globe, Phone, MapPin, Hash, User, Plus, Trash2, Save } from 'lucide-react';
import { Consultant } from '@/lib/data';
import { LaserLoader } from '../ui/LaserLoader';
import { AdminInput } from './ui/AdminInput';
import { AdminLabel } from './ui/AdminLabel';
import { AdminButton } from './ui/AdminButton';

export function SiteSettingsManager() {
  const [form, setForm] = useState({
    messengerLink: '',
    zaloLink: '',
    facebookLink: '',
    phone: '',
    address: '',
    companyName: '',
    directorName: '',
    directorPhone: '',
    taxCode: '',
    bankAccount: '',
    companyEmail: '',
    consultantName: '',
    consultants: [] as (Consultant & { id: string })[],
    directorRole: '',
    youtubeLink: '',
    instagramLink: '',
    tiktokLink: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        setForm(prev => ({
          ...prev,
          ...data,
          consultants: (data.consultants || []).map((c: any, i: number) => ({
            ...c,
            id: c.id || `existing-${i}-${Date.now()}`
          }))
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^\d{10}$/;

    // Validate Director Phone
    if (form.directorPhone && !phoneRegex.test(form.directorPhone)) {
      newErrors['directorPhone'] = 'Số điện thoại phải đúng 10 chữ số';
    }

    // Validate Consultants
    form.consultants.forEach((c) => {
      if (c.phone && !phoneRegex.test(c.phone)) {
        newErrors[`phone-${c.id}`] = 'Số điện thoại phải đúng 10 chữ số';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setError('Vui lòng kiểm tra lại các trường thông tin bị lỗi');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setSaving(true);

    setSaved(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    setSaving(false);
  };

  const addConsultant = () => {
    setForm(prev => ({
      ...prev,
      consultants: [...prev.consultants, { id: Date.now().toString(), name: '', phone: '' }]
    }));
  };

  const removeConsultant = (index: number) => {
    setForm(prev => ({
      ...prev,
      consultants: prev.consultants.filter((_, i) => i !== index)
    }));
  };

  const updateConsultant = (id: string, field: keyof Consultant, value: string) => {
    setForm(prev => {
      const newConsultants = prev.consultants.map(c => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        return c;
      });
      return { ...prev, consultants: newConsultants };
    });

    // Clear error for this field when user starts typing
    if (field === 'phone') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`phone-${id}`];
        return newErrors;
      });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <LaserLoader size="lg" color="#00FF88" />
      <span className="text-white/20 text-[0.7rem] uppercase tracking-widest font-bold">Đang tải cấu hình...</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-body text-white mb-2" style={{ fontSize: '1.3rem', fontWeight: 900 }}>Cấu Hình Hệ Thống</h2>
          <p className="text-white/40 font-vietnam text-[0.8rem]">Quản lý thông tin liên hệ và pháp lý của doanh nghiệp</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88]">
              <Phone size={20} />
            </div>
            <h3 className="font-body text-white text-[0.85rem] font-black uppercase tracking-wider">THÔNG TIN LIÊN HỆ</h3>
          </div>

          <div className="space-y-5">
            <div>
              <AdminLabel>Email công ty</AdminLabel>
              <AdminInput value={form.companyEmail} onChange={e => setForm({ ...form, companyEmail: e.target.value })} placeholder="email@gmail.com" />
            </div>
            <div>
              <AdminLabel>Địa chỉ trụ sở</AdminLabel>
              <AdminInput as="textarea" rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88]">
              <Globe size={20} />
            </div>
            <h3 className="font-body text-white text-[0.85rem] font-black uppercase tracking-wider">MẠNG XÃ HỘI</h3>
          </div>

          <div className="space-y-4">
            <div>
              <AdminLabel>Messenger Link</AdminLabel>
              <AdminInput value={form.messengerLink} onChange={e => setForm({ ...form, messengerLink: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Zalo Link</AdminLabel>
              <AdminInput value={form.zaloLink} onChange={e => setForm({ ...form, zaloLink: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Facebook Link</AdminLabel>
              <AdminInput value={form.facebookLink} onChange={e => setForm({ ...form, facebookLink: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Youtube Link</AdminLabel>
              <AdminInput value={form.youtubeLink} onChange={e => setForm({ ...form, youtubeLink: e.target.value })} />
            </div>
            <div>
              <AdminLabel>Instagram Link</AdminLabel>
              <AdminInput value={form.instagramLink} onChange={e => setForm({ ...form, instagramLink: e.target.value })} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <AdminLabel>TikTok Link</AdminLabel>
              <AdminInput value={form.tiktokLink} onChange={e => setForm({ ...form, tiktokLink: e.target.value })} placeholder="https://tiktok.com/@..." />
            </div>
          </div>
        </div>

        {/* Consultation info */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88]">
                <User size={20} />
              </div>
              <h3 className="font-body text-white text-[0.85rem] font-black uppercase tracking-wider">TƯ VẤN & BÁO GIÁ</h3>
            </div>
            <AdminButton variant="secondary" icon={<Plus size={14} />} onClick={addConsultant} style={{ fontSize: '0.65rem' }}>THÊM</AdminButton>
          </div>

          <div className="space-y-4">
            {form.consultants.map((consultant, index) => (
              <div key={consultant.id} className="p-5 rounded-2xl bg-black/20 border border-white/5 space-y-4 relative group">
                <button
                  onClick={() => removeConsultant(index)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <AdminLabel>Tên người tư vấn</AdminLabel>
                    <AdminInput value={consultant.name} onChange={e => updateConsultant(consultant.id, 'name', e.target.value)} placeholder="VD: Mr. Hiệp" />
                  </div>
                  <div>
                    <AdminLabel>Số điện thoại (*)</AdminLabel>
                    <AdminInput 
                      value={consultant.phone} 
                      onChange={e => updateConsultant(consultant.id, 'phone', e.target.value)} 
                      placeholder="090..." 
                      autoComplete="new-password"
                      name={`field-phone-${consultant.id}-${index}`}
                      style={{ borderColor: errors[`phone-${consultant.id}`] ? '#ff4d4d' : undefined }}
                    />
                    {errors[`phone-${consultant.id}`] && (
                      <span className="text-[#ff4d4d] text-[0.65rem] mt-1.5 block font-bold uppercase tracking-wider animate-in fade-in duration-300">
                        {errors[`phone-${consultant.id}`]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {form.consultants.length === 0 && (
              <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl text-white/10 text-[0.7rem] font-black uppercase tracking-widest">
                Chưa có người tư vấn nào
              </div>
            )}
          </div>
        </div>

        {/* Legal info */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88]">
              <Hash size={20} />
            </div>
            <h3 className="font-body text-white text-[0.85rem] font-black uppercase tracking-wider">PHÁP LÝ & TÀI KHOẢN</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2 lg:col-span-1">
              <div>
                <AdminLabel>Tên công ty</AdminLabel>
                <AdminInput value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
              </div>
              <div>
                <AdminLabel>Mã số thuế</AdminLabel>
                <AdminInput value={form.taxCode} onChange={e => setForm({ ...form, taxCode: e.target.value })} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <AdminLabel>Người đại diện</AdminLabel>
                <AdminInput value={form.directorName} onChange={e => setForm({ ...form, directorName: e.target.value })} />
              </div>
              <div>
                <AdminLabel>SĐT người đại diện</AdminLabel>
                <AdminInput 
                  value={form.directorPhone} 
                  onChange={e => {
                    setForm(prev => ({ ...prev, directorPhone: e.target.value }));
                    if (errors['directorPhone']) {
                      setErrors(prev => {
                        const newE = { ...prev };
                        delete newE['directorPhone'];
                        return newE;
                      });
                    }
                  }} 
                  placeholder="090..." 
                  autoComplete="new-password"
                  name="field-director-phone-exclusive"
                  style={{ borderColor: errors['directorPhone'] ? '#ff4d4d' : undefined }}
                />
                {errors['directorPhone'] && (
                  <span className="text-[#ff4d4d] text-[0.65rem] mt-1.5 block font-bold uppercase tracking-wider animate-in fade-in duration-300">
                    {errors['directorPhone']}
                  </span>
                )}
              </div>
              <div>
                <AdminLabel>Chức vụ</AdminLabel>
                <AdminInput value={form.directorRole} onChange={e => setForm({ ...form, directorRole: e.target.value })} />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2 lg:col-span-1">
              <div>
                <AdminLabel>Tài khoản ngân hàng</AdminLabel>
                <AdminInput as="textarea" rows={5} value={form.bankAccount} onChange={e => setForm({ ...form, bankAccount: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        {error && <p className="text-[#ff4d4d] text-[0.7rem] font-bold uppercase tracking-widest mr-4 self-center">{error}</p>}
        <AdminButton loading={saving} saved={saved} icon={<Save size={18} />} onClick={handleSave} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
          LƯU THAY ĐỔI
        </AdminButton>
      </div>
    </div>
  );
}
