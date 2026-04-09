'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, Save, CheckCircle, AlertCircle } from 'lucide-react';

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

export function MediaManager() {
  const [form, setForm] = useState({
    heroImageUrl: '',
    heroVideoUrl: '',
    heroVideoEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.details || 'Không thể kết nối đến cơ sở dữ liệu. Đang hiển thị cài đặt mặc định.');
      } else if (data && Object.keys(data).length > 0) {
        setForm(data);
        setError(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching media settings:', error);
      setError('Lỗi kết nối toàn cục. Đang hiển thị cài đặt mặc định.');
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving media settings:', error);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-white/50 font-exo">Đang tải cài đặt media...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-orbitron text-white mb-1" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quản Lý Media</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          Thay đổi hình ảnh và video chủ đạo của website
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section settings */}
        <div 
          className="p-6 rounded-2xl space-y-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20">
              <ImageIcon size={20} className="text-[#00FF88]" />
            </div>
            <h3 className="font-orbitron text-white text-[0.85rem] font-bold">HERO SECTION</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label style={labelStyle}>ẢNH NỀN HERO (URL)</label>
              <input 
                style={inputStyle} 
                value={form.heroImageUrl} 
                onChange={e => setForm({...form, heroImageUrl: e.target.value})} 
                placeholder="https://images.unsplash.com/..."
              />
              {form.heroImageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden aspect-video border border-white/10">
                  <img src={form.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-[#00FF88]" />
                  <span className="text-white text-[0.8rem] font-semibold">Video Nền</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={form.heroVideoEnabled}
                    onChange={e => setForm({...form, heroVideoEnabled: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF88]"></div>
                </label>
              </div>

              <div className={form.heroVideoEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
                <label style={labelStyle}>VIDEO URL (YouTube / MP4)</label>
                <input 
                  style={inputStyle} 
                  value={form.heroVideoUrl} 
                  onChange={e => setForm({...form, heroVideoUrl: e.target.value})} 
                  placeholder="/videos/hero.mp4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global UI settings hint */}
        <div className="flex flex-col justify-center text-center p-8 rounded-2xl border border-white/5 bg-white/[0.01]">
          <div className="mb-4 text-3xl">💡</div>
          <h4 className="text-white font-orbitron text-sm font-bold mb-2">Mẹo Quản Lý</h4>
          <p className="text-white/40 text-[0.8rem] leading-relaxed">
            Sử dụng hình ảnh có độ phân giải cao (thường là 1920x1080) cho Hero Section để đảm bảo chất lượng hiển thị tốt nhất trên mọi màn hình. Nếu dùng video, hãy ưu tiên định dạng MP4 có dung lượng tối ưu.
          </p>
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
