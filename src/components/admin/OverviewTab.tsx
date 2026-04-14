'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, FileText, Image as ImageIcon, AlertCircle, Inbox } from 'lucide-react';
import Link from 'next/link';
import { LaserLoader } from '../ui/LaserLoader';
import { PortfolioProject, portfolioProjects as mockProjects } from '@/lib/data';

interface OverviewTabProps {
  onNavigate: (tab: 'posts' | 'media' | 'settings' | 'quotes') => void;
}

export function OverviewTab({ onNavigate }: OverviewTabProps) {
  const [stats, setStats] = useState([
    { label: 'Tổng Bài Đăng', value: 0, color: '#00FF88', icon: '📝' },
    { label: 'Mega Concert', value: 0, color: '#00FF88', icon: '🎪' },
    { label: 'Tầm Trung', value: 0, color: '#00FF88', icon: '🎉' },
    { label: 'VIP / Private', value: 0, color: '#00FF88', icon: '💎' },
  ]);
  const [recentProjects, setRecentProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();

        let projects: PortfolioProject[] = [];

        if (!res.ok || !Array.isArray(data)) {
          console.error('API Error or projects is not an array:', data);
          setError(data.details || 'Không thể kết nối đến cơ sở dữ liệu. Đang hiển thị dữ liệu mẫu.');
          // Fallback to mock data
          projects = mockProjects;
        } else {
          projects = data;
          setError(null);
        }

        const categories = { mega: 0, medium: 0, vip: 0 };
        projects.forEach((p) => {
          if (categories[p.category as keyof typeof categories] !== undefined) categories[p.category as keyof typeof categories]++;
        });

        setStats([
          { label: 'Tổng Bài Đăng', value: projects.length, color: '#00FF88', icon: '📝' },
          { label: 'Mega Concert', value: categories.mega, color: '#00FF88', icon: '🎪' },
          { label: 'Tầm Trung', value: categories.medium, color: '#00FF88', icon: '🎉' },
          { label: 'VIP / Private', value: categories.vip, color: '#00FF88', icon: '💎' },
        ]);

        setRecentProjects(projects.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Lỗi hệ thống. Đang hiển thị dữ liệu mẫu.');
        setRecentProjects(mockProjects.slice(0, 4));
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <LaserLoader size="lg" color="#00FF88" />
      <span className="text-white/30 text-[0.7rem] uppercase tracking-widest font-bold">Đang tổng hợp dữ liệu...</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-body text-white mb-2" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Tổng Quan</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.83rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          Quản lý nội dung website Laser Việt Production
        </p>
      </div>

      {error && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl mb-4 animate-in fade-in slide-in-from-top-4 duration-500"
          style={{ background: 'rgba(255, 59, 48, 0.1)', border: '1px solid rgba(255, 59, 48, 0.2)' }}
        >
          <AlertCircle className="flex-shrink-0" style={{ color: '#FF3B30' }} size={20} />
          <div>
            <div className="text-white font-body" style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cảnh báo hệ thống</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 2 }}>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}20` }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
            <div
              className="font-body"
              style={{ fontSize: '2.4rem', fontWeight: 900, color: s.color, lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              {s.value}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'var(--font-body), sans-serif', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 12 }}>
          TRUY CẬP NHANH
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Xem Landing Page', action: () => window.open('/', '_blank'), icon: ExternalLink, desc: 'Xem trang chủ công khai', color: '#00FF88' },
            { label: 'Yêu Cầu Báo Giá', action: () => onNavigate('quotes'), icon: Inbox, desc: 'Xem form khách hàng gửi', color: '#FFC800' },
            { label: 'Quản lý Bài Đăng', action: () => onNavigate('posts'), icon: FileText, desc: 'Thêm, sửa, xóa portfolio', color: '#00FF88' },
            { label: 'Quản lý Media', action: () => onNavigate('media'), icon: ImageIcon, desc: 'Thay đổi hình ảnh trang', color: '#00FF88' },
          ].map((a) => (
            <button
              key={a.label}
              onClick={a.action}
              className="flex items-center text-left w-full gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)]"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${a.color}20`,
                cursor: 'pointer'
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}
              >
                <a.icon size={18} style={{ color: a.color }} />
              </div>
              <div>
                <div className="text-white font-body" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{a.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.73rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent posts preview */}
      <div>
        <h3 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'var(--font-body), sans-serif', fontWeight: 800, letterSpacing: '0.15em', marginBottom: 12 }}>
          BÀI ĐĂNG GẦN ĐÂY
        </h3>
        <div className="space-y-2">
          {recentProjects.map((p) => {
            const colorMap: Record<string, string> = { vip: '#00FF88', medium: '#00FF88', mega: '#00FF88' };
            const c = colorMap[p.category] || '#00FF88';
            return (
              <div
                key={p.id}
                className="flex items-center gap-4 p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <img
                  src={p.thumbnailImage || 'https://images.unsplash.com/photo-1760539619529-cfd85a2a9cfd?w=800&q=80'}
                  alt={p.title}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-body truncate" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{p.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{p.location} · {p.year}</div>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${c}12`, border: `1px solid ${c}25`, color: c, fontSize: '0.6rem', fontFamily: 'var(--font-body), sans-serif', fontWeight: 800, letterSpacing: '0.05em' }}
                >
                  {p.categoryLabel.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
