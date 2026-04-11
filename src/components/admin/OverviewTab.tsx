'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  MessageSquare,
  FolderOpen,
  TrendingUp,
  Eye,
  Clock,
  Zap,
  Star,
  ChevronRight,
  RefreshCw,
  MailOpen,
  Mail,
  CalendarDays,
  MapPin,
  Users,
  Sparkles,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

interface OverviewData {
  stats: {
    totalProjects: number;
    categories: { mega: number; medium: number; vip: number };
    totalMessages: number;
    unreadMessages: number;
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
  };
  recentProjects: any[];
  recentMessages: any[];
  recentPosts: any[];
}

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subLabel,
  delay = 0,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  subLabel?: string;
  delay?: number;
}) {
  const animatedValue = useAnimatedCounter(value);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 transition-all duration-500 group"
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
        border: `1px solid ${color}18`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}08)`,
            border: `1px solid ${color}30`,
          }}
        >
          <Icon size={18} style={{ color }} />
        </div>

        <div
          className="font-orbitron"
          style={{ fontSize: '2rem', fontWeight: 900, color, lineHeight: 1 }}
        >
          {animatedValue}
        </div>

        <div
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.78rem',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            marginTop: 6,
            fontWeight: 500,
          }}
        >
          {label}
        </div>

        {subLabel && (
          <div
            style={{
              color: `${color}99`,
              fontSize: '0.68rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              marginTop: 2,
            }}
          >
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryBreakdown({ categories }: { categories: { mega: number; medium: number; vip: number } }) {
  const total = categories.mega + categories.medium + categories.vip;
  const items = [
    { label: 'Mega Concert', value: categories.mega, color: '#00E5FF', icon: '🎪' },
    { label: 'Tầm Trung', value: categories.medium, color: '#BF00FF', icon: '🎉' },
    { label: 'VIP / Private', value: categories.vip, color: '#FF006E', icon: '💎' },
  ];

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen size={16} style={{ color: '#00FF88' }} />
        <span
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.72rem',
            fontFamily: 'Orbitron, sans-serif',
            letterSpacing: '0.15em',
          }}
        >
          PHÂN BỐ DỰ ÁN
        </span>
      </div>

      {/* Donut-like progress bars */}
      <div className="space-y-3">
        {items.map((item) => {
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: '0.78rem',
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-orbitron"
                    style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color }}
                  >
                    {item.value}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: 'rgba(255,255,255,0.3)',
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                  >
                    ({percent}%)
                  </span>
                </div>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${percent}%`,
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                    boxShadow: `0 0 8px ${item.color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentMessagesList({ messages }: { messages: any[] }) {
  if (messages.length === 0) {
    return (
      <div
        className="text-center py-8"
        style={{
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.8rem',
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
      >
        Chưa có tin nhắn nào
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((msg) => {
        const isUnread = msg.status === 'unread';
        const date = new Date(msg.createdAt);
        const timeAgo = getTimeAgo(date);

        return (
          <div
            key={msg.id}
            className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.02]"
            style={{
              background: isUnread ? 'rgba(0,255,136,0.03)' : 'transparent',
              border: isUnread
                ? '1px solid rgba(0,255,136,0.1)'
                : '1px solid rgba(255,255,255,0.03)',
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: isUnread ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.04)',
                border: isUnread
                  ? '1px solid rgba(0,255,136,0.2)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {isUnread ? (
                <Mail size={14} style={{ color: '#00FF88' }} />
              ) : (
                <MailOpen size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-white truncate"
                  style={{
                    fontSize: '0.82rem',
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontWeight: isUnread ? 600 : 400,
                  }}
                >
                  {msg.name}
                </span>
                {isUnread && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#00FF88', boxShadow: '0 0 6px #00FF88' }}
                  />
                )}
              </div>
              <div
                className="truncate"
                style={{
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '0.72rem',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  marginTop: 1,
                }}
              >
                {msg.phone}
                {msg.notes && ` · ${msg.notes}`}
              </div>
            </div>
            <span
              style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: '0.65rem',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                flexShrink: 0,
              }}
            >
              {timeAgo}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RecentProjectsList({ projects }: { projects: any[] }) {
  const categoryColors: Record<string, string> = {
    mega: '#00E5FF',
    medium: '#BF00FF',
    vip: '#FF006E',
  };

  return (
    <div className="space-y-2">
      {projects.map((p, i) => {
        const c = categoryColors[p.category] || '#00FF88';
        return (
          <div
            key={p.id}
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/[0.03] group"
            style={{
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              {p.thumbnailImage ? (
                <img
                  src={p.thumbnailImage}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `${c}10`,
                    border: `1px solid ${c}20`,
                  }}
                >
                  <ImageIcon size={16} style={{ color: c, opacity: 0.5 }} />
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${c}15, transparent)`,
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="px-1.5 py-0.5 rounded-md"
                  style={{
                    background: `${c}12`,
                    border: `1px solid ${c}25`,
                    color: c,
                    fontSize: '0.55rem',
                    fontFamily: 'Orbitron, sans-serif',
                    letterSpacing: '0.05em',
                  }}
                >
                  {p.categoryLabel}
                </span>
                <span
                  style={{
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: '0.68rem',
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                >
                  {p.year}
                </span>
              </div>
              <div
                className="text-white truncate font-exo"
                style={{ fontSize: '0.82rem', fontWeight: 600 }}
              >
                {p.title}
              </div>
              <div
                className="flex items-center gap-1 mt-0.5"
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.68rem',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                <MapPin size={10} />
                {p.location}
              </div>
            </div>

            <ChevronRight
              size={14}
              className="flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity duration-200"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            />
          </div>
        );
      })}
    </div>
  );
}

function RecentPostsList({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <div
        className="text-center py-8"
        style={{
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.8rem',
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
      >
        Chưa có bài viết nào
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {posts.map((post) => {
        const isPublished = post.status === 'published';
        return (
          <div
            key={post.id}
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.02]"
            style={{
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <FileText size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div
                className="text-white truncate"
                style={{
                  fontSize: '0.8rem',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 500,
                }}
              >
                {post.title}
              </div>
              <div
                className="truncate"
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.68rem',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  marginTop: 1,
                }}
              >
                {post.excerpt}
              </div>
            </div>

            <span
              className="px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: isPublished ? 'rgba(0,255,136,0.1)' : 'rgba(255,184,0,0.1)',
                border: isPublished ? '1px solid rgba(0,255,136,0.2)' : '1px solid rgba(255,184,0,0.2)',
                color: isPublished ? '#00FF88' : '#FFB800',
                fontSize: '0.6rem',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontWeight: 500,
              }}
            >
              {isPublished ? 'Đã đăng' : 'Nháp'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  desc,
  color,
  onClick,
}: {
  icon: any;
  label: string;
  desc: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/[0.04] w-full group text-left"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${color}15`,
        cursor: 'pointer',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${color}18, ${color}08)`,
          border: `1px solid ${color}30`,
        }}
      >
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <div
          className="text-white font-exo"
          style={{ fontSize: '0.83rem', fontWeight: 700 }}
        >
          {label}
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.7rem',
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          {desc}
        </div>
      </div>
      <ChevronRight
        size={14}
        className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-40 transition-all duration-200 group-hover:translate-x-1"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      />
    </button>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={14} style={{ color: '#00FF88' }} />
      <h3
        style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: '0.7rem',
          fontFamily: 'Orbitron, sans-serif',
          letterSpacing: '0.18em',
        }}
      >
        {title}
      </h3>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút`;
  if (diffHrs < 24) return `${diffHrs} giờ`;
  if (diffDays < 7) return `${diffDays} ngày`;
  return date.toLocaleDateString('vi-VN');
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 h-32"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div
              className="w-10 h-10 rounded-xl mb-3"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            />
            <div
              className="w-12 h-6 rounded mb-2"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
            <div
              className="w-20 h-3 rounded"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 h-64"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
          />
        ))}
      </div>
    </div>
  );
}

export function OverviewTab({ onTabChange }: { onTabChange?: (tab: 'overview' | 'posts' | 'media' | 'settings') => void }) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/overview');
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.details || 'Không thể tải dữ liệu');
      }

      setData(result);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching overview:', err);
      setError(err.message || 'Lỗi hệ thống');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (loading) return <LoadingSkeleton />;

  const stats = data?.stats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,229,255,0.1))',
                border: '1px solid rgba(0,255,136,0.3)',
              }}
            >
              <Sparkles size={16} style={{ color: '#00FF88' }} />
            </div>
            <h2
              className="font-orbitron text-white"
              style={{ fontSize: '1.15rem', fontWeight: 700 }}
            >
              Tổng Quan
            </h2>
          </div>
          <p
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '0.82rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              paddingLeft: 44,
            }}
          >
            Dashboard quản lý nội dung website Laser QH Production
          </p>
        </div>

        <button
          onClick={() => fetchOverview(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/[0.04]"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.75rem',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            cursor: 'pointer',
          }}
        >
          <RefreshCw
            size={13}
            className={refreshing ? 'animate-spin' : ''}
          />
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{
            background: 'rgba(255, 59, 48, 0.08)',
            border: '1px solid rgba(255, 59, 48, 0.15)',
          }}
        >
          <AlertCircle className="flex-shrink-0" style={{ color: '#FF3B30' }} size={18} />
          <div>
            <div
              className="text-white font-exo"
              style={{ fontSize: '0.83rem', fontWeight: 700 }}
            >
              Cảnh báo hệ thống
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                marginTop: 2,
              }}
            >
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderOpen}
          label="Tổng Dự Án"
          value={stats?.totalProjects || 0}
          color="#00FF88"
          delay={0}
        />
        <StatCard
          icon={FileText}
          label="Bài Viết"
          value={stats?.totalPosts || 0}
          color="#00E5FF"
          subLabel={`${stats?.publishedPosts || 0} đã đăng · ${stats?.draftPosts || 0} nháp`}
          delay={100}
        />
        <StatCard
          icon={MessageSquare}
          label="Tin Nhắn"
          value={stats?.totalMessages || 0}
          color="#BF00FF"
          subLabel={stats?.unreadMessages ? `${stats.unreadMessages} chưa đọc` : undefined}
          delay={200}
        />
        <StatCard
          icon={Star}
          label="Mega Concert"
          value={stats?.categories?.mega || 0}
          color="#FF006E"
          delay={300}
        />
      </div>

      {/* Category Breakdown + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown
          categories={stats?.categories || { mega: 0, medium: 0, vip: 0 }}
        />

        {/* Quick Actions */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <SectionHeader icon={Zap} title="TRUY CẬP NHANH" />
          <div className="space-y-2">
            <Link
              href="/"
              target="_blank"
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <QuickAction
                icon={ExternalLink}
                label="Xem Landing Page"
                desc="Trang chủ công khai"
                color="#00FF88"
              />
            </Link>
            <QuickAction
              icon={FileText}
              label="Quản lý Bài Đăng"
              desc="Thêm, sửa, xóa portfolio"
              color="#00E5FF"
              onClick={() => onTabChange?.('posts')}
            />
            <QuickAction
              icon={ImageIcon}
              label="Quản lý Media"
              desc="Thay đổi hình ảnh & video"
              color="#BF00FF"
              onClick={() => onTabChange?.('media')}
            />
            <QuickAction
              icon={Settings}
              label="Cài Đặt Website"
              desc="Thông tin liên hệ, MXH..."
              color="#FFB800"
              onClick={() => onTabChange?.('settings')}
            />
          </div>
        </div>
      </div>

      {/* Recent Projects + Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <SectionHeader icon={TrendingUp} title="DỰ ÁN GẦN ĐÂY" />
          <RecentProjectsList projects={data?.recentProjects || []} />
        </div>

        {/* Recent Messages */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <SectionHeader icon={MessageSquare} title="TIN NHẮN LIÊN HỆ" />
            {(stats?.unreadMessages || 0) > 0 && (
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(0,255,136,0.12)',
                  border: '1px solid rgba(0,255,136,0.25)',
                  color: '#00FF88',
                  fontSize: '0.6rem',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 600,
                }}
              >
                {stats?.unreadMessages} mới
              </span>
            )}
          </div>
          <RecentMessagesList messages={data?.recentMessages || []} />
        </div>
      </div>

      {/* Recent Blog Posts */}
      {(data?.recentPosts?.length || 0) > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <SectionHeader icon={FileText} title="BÀI VIẾT GẦN ĐÂY" />
          <RecentPostsList posts={data?.recentPosts || []} />
        </div>
      )}

      {/* System Info Footer */}
      <div
        className="flex items-center justify-between py-4 px-1"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: error ? '#FF3B30' : '#00FF88',
              boxShadow: error ? '0 0 6px #FF3B30' : '0 0 6px #00FF88',
            }}
          />
          <span
            style={{
              color: 'rgba(255,255,255,0.25)',
              fontSize: '0.68rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          >
            {error ? 'Hệ thống gặp sự cố' : 'Hệ thống hoạt động bình thường'}
          </span>
        </div>
        <span
          style={{
            color: 'rgba(255,255,255,0.15)',
            fontSize: '0.62rem',
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
        </span>
      </div>
    </div>
  );
}
