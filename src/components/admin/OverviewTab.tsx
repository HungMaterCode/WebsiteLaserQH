'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { PortfolioProject, portfolioProjects as mockProjects } from '@/lib/data';

export function OverviewTab() {
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
          // Fallback to mock data silently to prevent UI disruption
          projects = mockProjects;
          setError(null); 
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
        // Fallback silently
        setRecentProjects(mockProjects.slice(0, 4));
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-orbitron text-white mb-2" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tổng Quan</h2>
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
            <div className="text-white font-exo" style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cảnh báo hệ thống</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 2 }}>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}20` }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
            <div
              className="font-orbitron"
              style={{ fontSize: '2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}
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
        <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.2em', marginBottom: 12 }}>
          TRUY CẬP NHANH
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Xem Landing Page', href: '/', icon: ExternalLink, desc: 'Xem trang chủ công khai', color: '#00FF88' },
            { label: 'Quản lý Bài Đăng', href: '#posts', icon: FileText, desc: 'Thêm, sửa, xóa portfolio', color: '#00FF88' },
            { label: 'Quản lý Media', href: '#media', icon: ImageIcon, desc: 'Thay đổi hình ảnh trang', color: '#00FF88' },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)]"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${a.color}20`,
                textDecoration: 'none',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}
              >
                <a.icon size={18} style={{ color: a.color }} />
              </div>
              <div>
                <div className="text-white font-exo" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{a.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.73rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent posts preview */}
      <div>
        <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.2em', marginBottom: 12 }}>
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
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image src={p.thumbnailImage} alt={p.title} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-exo truncate" style={{ fontSize: '0.83rem', fontWeight: 600 }}>{p.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{p.location} · {p.year}</div>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${c}12`, border: `1px solid ${c}25`, color: c, fontSize: '0.6rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em' }}
                >
                  {p.categoryLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
