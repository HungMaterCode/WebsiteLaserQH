'use client';

import { useState } from 'react';
import { LayoutDashboard, FileText, Image as ImageIcon, Settings, BookOpen, LucideIcon } from 'lucide-react';
import { PostsManager } from '@/components/admin/PostsManager';
import { BlogPostManager } from '@/components/admin/BlogPostManager';
import { MediaManager } from '@/components/admin/MediaManager';
import { SiteSettingsManager } from '@/components/admin/SiteSettingsManager';
import { OverviewTab } from '@/components/admin/OverviewTab';

type AdminTab = 'overview' | 'projects' | 'blog' | 'media' | 'settings';

interface NavItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
  color: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Tổng Quan', icon: LayoutDashboard, color: '#00FF88' },
    { id: 'projects', label: 'Dự Án', icon: FileText, color: '#00FF88' },
    { id: 'blog', label: 'Bài Viết', icon: BookOpen, color: '#00FF88' },
    { id: 'media', label: 'Media & Hình Ảnh', icon: ImageIcon, color: '#00FF88' },
    { id: 'settings', label: 'Cài Đặt', icon: Settings, color: '#00FF88' },
  ];

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width: '220px',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.015)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '1.5rem 0.75rem',
        }}
      >
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                style={{
                  background: active ? `${item.color}12` : 'transparent',
                  border: active ? `1px solid ${item.color}25` : '1px solid transparent',
                  color: active ? item.color : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={16} />
                <span style={{ fontSize: '0.83rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: active ? 600 : 400 }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', fontFamily: "'Be Vietnam Pro', sans-serif", textAlign: 'center' }}>
            v1.0 · Laser Việt Admin
          </div>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{
          background: 'rgba(5,5,15,0.98)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-200"
              style={{
                color: active ? item.color : 'rgba(255,255,255,0.35)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Icon size={18} />
              <span style={{ fontSize: '0.6rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: active ? 600 : 400 }}>
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <main
        className="flex-1 overflow-auto bg-[#050508]"
        style={{ padding: '2rem 1.5rem', paddingBottom: '6rem' }}
      >
        <div className="max-w-5xl mx-auto text-white">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'projects' && <PostsManager />}
          {activeTab === 'blog' && <BlogPostManager />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'settings' && <SiteSettingsManager />}
        </div>
      </main>
    </div>
  );
}
