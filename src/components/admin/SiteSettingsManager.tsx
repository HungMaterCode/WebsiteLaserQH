'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, Globe, Phone, MapPin, Mail, Hash, User, Plus, Trash2 } from 'lucide-react';
import { Consultant } from '@/lib/data';

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
    consultants: [] as Consultant[],
    directorRole: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
          consultants: data.consultants || [] 
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  const handleSave = async () => {
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
    setForm({
      ...form,
      consultants: [...form.consultants, { name: '', phone: '' }]
    });
  };

  const removeConsultant = (index: number) => {
    const newConsultants = [...form.consultants];
    newConsultants.splice(index, 1);
    setForm({ ...form, consultants: newConsultants });
  };

  const updateConsultant = (index: number, field: keyof Consultant, value: string) => {
    const newConsultants = [...form.consultants];
    newConsultants[index] = { ...newConsultants[index], [field]: value };
    setForm({ ...form, consultants: newConsultants });
  };

  if (loading) return <div>Đang tải cài đặt hệ thống...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-orbitron text-white mb-1" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Cấu Hình Hệ Thống</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Quản lý thông tin liên hệ và pháp lý của công ty
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact info */}
        <div 
          className="p-6 rounded-2xl space-y-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20">
              <Phone size={20} className="text-[#00FF88]" />
            </div>
            <h3 className="font-orbitron text-white text-[0.85rem] font-bold">THÔNG TIN LIÊN HỆ</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label style={labelStyle}>EMAIL CÔNG TY</label>
              <input style={inputStyle} value={form.companyEmail} onChange={e => setForm({...form, companyEmail: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>ĐỊA CHỈ TRỤ SỞ</label>
              <textarea style={{...inputStyle, minHeight: 80}} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Social links */}
        <div 
          className="p-6 rounded-2xl space-y-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20">
              <Globe size={20} className="text-[#00FF88]" />
            </div>
            <h3 className="font-orbitron text-white text-[0.85rem] font-bold">MẠNG XÃ HỘI</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label style={labelStyle}>MESSENGER LINK</label>
              <input style={inputStyle} value={form.messengerLink} onChange={e => setForm({...form, messengerLink: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>ZALO LINK</label>
              <input style={inputStyle} value={form.zaloLink} onChange={e => setForm({...form, zaloLink: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>FACEBOOK PAGE LINK</label>
              <input style={inputStyle} value={form.facebookLink} onChange={e => setForm({...form, facebookLink: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Consultation info */}
        <div 
          className="p-6 rounded-2xl space-y-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20">
                <User size={20} className="text-[#00FF88]" />
              </div>
              <h3 className="font-orbitron text-white text-[0.85rem] font-bold">TƯ VẤN VÀ BÁO GIÁ</h3>
            </div>
            <button 
              onClick={addConsultant}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] font-orbitron text-[0.65rem] font-bold hover:bg-[#00FF88]/20 transition-all"
            >
              <Plus size={14} /> THÊM
            </button>
          </div>

          <div className="space-y-6">
            {form.consultants.map((consultant, index) => (
              <div key={index} className="p-4 rounded-xl space-y-4 relative group" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button 
                  onClick={() => removeConsultant(index)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>TÊN NGƯỜI TƯ VẤN</label>
                    <input 
                      style={inputStyle} 
                      value={consultant.name} 
                      onChange={e => updateConsultant(index, 'name', e.target.value)} 
                      placeholder="VD: Mr. Hiệp"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>SỐ ĐIỆN THOẠI (*)</label>
                    <input 
                      style={inputStyle} 
                      value={consultant.phone} 
                      onChange={e => updateConsultant(index, 'phone', e.target.value)} 
                      placeholder="090..."
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {form.consultants.length === 0 && (
              <div className="py-8 text-center border border-dashed border-white/10 rounded-xl text-white/20 font-orbitron text-[0.7rem] uppercase tracking-wider">
                Chưa có người tư vấn nào
              </div>
            )}
          </div>
        </div>

        {/* Legal info */}
        <div 
          className="lg:col-span-2 p-6 rounded-2xl space-y-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20">
              <Hash size={20} className="text-[#00FF88]" />
            </div>
            <h3 className="font-orbitron text-white text-[0.85rem] font-bold">THÔNG TIN PHÁP LÝ & TÀI KHOẢN</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2 lg:col-span-1">
              <div>
                <label style={labelStyle}>TÊN CÔNG TY</label>
                <input style={inputStyle} value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>MÃ SỐ THUẾ</label>
                <input style={inputStyle} value={form.taxCode} onChange={e => setForm({...form, taxCode: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label style={labelStyle}>NGƯỜI ĐẠI DIỆN</label>
                <input style={inputStyle} value={form.directorName} onChange={e => setForm({...form, directorName: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>SĐT NGƯỜI ĐẠI DIỆN</label>
                <input style={inputStyle} value={form.directorPhone} onChange={e => setForm({...form, directorPhone: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>CHỨC VỤ</label>
                <input style={inputStyle} value={form.directorRole} onChange={e => setForm({...form, directorRole: e.target.value})} placeholder="VD: Giám đốc" />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2 lg:col-span-1">
              <div>
                <label style={labelStyle}>TÀI KHOẢN NGÂN HÀNG</label>
                <textarea style={{...inputStyle, minHeight: 120}} value={form.bankAccount} onChange={e => setForm({...form, bankAccount: e.target.value})} placeholder="Số tài khoản - Ngân hàng - Chủ tài khoản" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-exo transition-all duration-300"
          style={{
            background: saved ? 'rgba(0,255,136,0.15)' : 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.1))',
            border: saved ? '1px solid rgba(0,255,136,0.4)' : '1px solid rgba(0,255,136,0.4)',
            color: saved ? '#00FF88' : '#00FF88',
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 20px rgba(0,255,136,0.1)',
          }}
        >
          {saving ? 'Đang lưu...' : saved ? <><CheckCircle size={18} /> Đã lưu</> : <><Save size={18} /> Lưu Thay Đổi</>}
        </button>
      </div>
    </div>
  );
}
