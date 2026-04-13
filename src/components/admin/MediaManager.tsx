'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, AlertCircle, Save } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { LaserLoader } from '../ui/LaserLoader';
import { AdminInput } from './ui/AdminInput';
import { AdminLabel } from './ui/AdminLabel';
import { AdminButton } from './ui/AdminButton';

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
        setError(data.details || 'Lỗi kết nối máy chủ. Hiện đang dùng cấu hình cũ.');
      } else if (data && Object.keys(data).length > 0) {
        setForm(data);
        setError(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching media settings:', error);
      setError('Lỗi kết nối hệ thống. Vui lòng kiểm tra internet.');
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <LaserLoader size="lg" color="#00FF88" />
      <span className="text-white/20 text-[0.7rem] uppercase tracking-widest font-bold">Đang tải Media...</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="font-body text-white mb-2" style={{ fontSize: '1.3rem', fontWeight: 900 }}>Quản Lý Media</h2>
        <p className="text-white/40 font-vietnam text-[0.8rem]">Cập nhật hình ảnh và video chủ đạo cho toàn bộ website</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-6 bg-red-500/10 border border-red-500/20">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <div>
            <div className="text-white font-bold text-[0.85rem]">Sự cố Media</div>
            <div className="text-white/50 text-[0.75rem] font-vietnam mt-0.5">{error}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section settings */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88]">
              <ImageIcon size={20} />
            </div>
            <h3 className="font-body text-white text-[0.85rem] font-black uppercase tracking-wider">HERO SECTION</h3>
          </div>

          <div className="space-y-5">
            <div>
              <AdminLabel>Ảnh nền Hero (URL)</AdminLabel>
              <div className="space-y-3">
                <AdminInput
                  value={form.heroImageUrl}
                  onChange={e => setForm({ ...form, heroImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
                <ImageUpload onUploadComplete={(url) => setForm({ ...form, heroImageUrl: url })} currentValue={form.heroImageUrl} />
              </div>
              {form.heroImageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden aspect-video border border-white/10 shadow-lg">
                  <img src={form.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-[#00FF88]" />
                  <span className="text-white text-[0.8rem] font-bold uppercase tracking-wider">Video Nền</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.heroVideoEnabled}
                    onChange={e => setForm({ ...form, heroVideoEnabled: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF88]"></div>
                </label>
              </div>

              <div className={form.heroVideoEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none transition-opacity'}>
                <AdminLabel>Đường dẫn Video (YouTube / MP4)</AdminLabel>
                <AdminInput
                  value={form.heroVideoUrl}
                  onChange={e => setForm({ ...form, heroVideoUrl: e.target.value })}
                  placeholder="/videos/hero.mp4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global UI settings hint */}
        <div className="flex flex-col justify-center items-center text-center p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
          <div className="w-14 h-14 rounded-full bg-[#00FF88]/5 flex items-center justify-center mb-4 border border-[#00FF88]/10">
             <span className="text-2xl">💡</span>
          </div>
          <h4 className="text-white font-body text-[0.85rem] font-black mb-3 uppercase tracking-wider">Mẹo Quản Lý Media</h4>
          <p className="text-white/40 text-[0.75rem] font-vietnam leading-relaxed max-w-[300px]">
            Ưu tiên hình ảnh có độ phân giải 1920x1080 và video định dạng MP4 đã được nén tối ưu (dưới 10MB) để khách hàng có trải nghiệm mượt mà nhất.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <AdminButton loading={saving} saved={saved} icon={<Save size={18} />} onClick={handleSave} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
          LƯU THAY ĐỔI
        </AdminButton>
      </div>
    </div>
  );
}
