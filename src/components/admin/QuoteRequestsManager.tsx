'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  Users,
  Wallet,
  FileText,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  X,
  Tag,
  MessageSquare,
  Filter,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { LaserLoader } from '../ui/LaserLoader';
import { DeleteConfirm } from './DeleteConfirm';

interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  eventType?: string | null;
  size?: string | null;
  budget?: string | null;
  date?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  unread: {
    bg: 'rgba(255, 200, 0, 0.08)',
    border: 'rgba(255, 200, 0, 0.25)',
    text: '#FFC800',
    label: 'Chưa đọc',
  },
  read: {
    bg: 'rgba(0, 255, 136, 0.08)',
    border: 'rgba(0, 255, 136, 0.25)',
    text: '#00FF88',
    label: 'Đã xem',
  },
  contacted: {
    bg: 'rgba(100, 180, 255, 0.08)',
    border: 'rgba(100, 180, 255, 0.25)',
    text: '#64B4FF',
    label: 'Đã liên hệ',
  },
  completed: {
    bg: 'rgba(160, 100, 255, 0.08)',
    border: 'rgba(160, 100, 255, 0.25)',
    text: '#A064FF',
    label: 'Hoàn thành',
  },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatEventDate(dateStr?: string | null) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/* ─────────────────────────────── Detail Modal ─────────────────────────────── */
function DetailModal({ quote, onClose, onStatusChange, onDelete }: {
  quote: QuoteRequest;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const sc = STATUS_COLORS[quote.status] || STATUS_COLORS.unread;

  const handleDelete = () => {
    onDelete(quote.id);
  };

  const statuses = Object.entries(STATUS_COLORS);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a12 0%, #080810 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between p-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <h2 className="text-white font-body" style={{ fontSize: '1rem', fontWeight: 800 }}>
              {quote.name}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.73rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 2 }}>
              {formatDate(quote.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text, fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              {sc.label}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={<Phone size={13} />} label="Điện thoại" value={quote.phone} highlight />
            {quote.email && <InfoRow icon={<Mail size={13} />} label="Email" value={quote.email} />}
          </div>

          {/* Event details */}
          <div
            className="rounded-xl p-4 space-y-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, letterSpacing: '0.12em' }}>
              THÔNG TIN SỰ KIỆN
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quote.eventType && <InfoRow icon={<Tag size={13} />} label="Loại sự kiện" value={quote.eventType} />}
              {quote.size && <InfoRow icon={<Users size={13} />} label="Quy mô" value={quote.size} />}
              {quote.budget && <InfoRow icon={<Wallet size={13} />} label="Ngân sách" value={quote.budget} />}
              {quote.date && <InfoRow icon={<Calendar size={13} />} label="Ngày dự kiến" value={formatEventDate(quote.date) || quote.date} />}
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, letterSpacing: '0.12em', marginBottom: 8 }}>
                MÔ TẢ THÊM
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontFamily: "'Be Vietnam Pro', sans-serif", lineHeight: 1.6 }}>
                {quote.notes}
              </p>
            </div>
          )}

          {/* Status changer */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, letterSpacing: '0.12em', marginBottom: 8 }}>
              CẬP NHẬT TRẠNG THÁI
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => onStatusChange(quote.id, key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                  style={{
                    background: quote.status === key ? cfg.bg : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${quote.status === key ? cfg.border : 'rgba(255,255,255,0.08)'}`,
                    color: quote.status === key ? cfg.text : 'rgba(255,255,255,0.4)',
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    cursor: 'pointer',
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between p-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
            style={{
              background: 'rgba(255, 59, 48, 0.08)',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              color: '#FF3B30',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} />
            Xóa yêu cầu
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
            style={{
              background: 'rgba(0, 255, 136, 0.08)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              color: '#00FF88',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>{icon}</span>
        {label.toUpperCase()}
      </div>
      <div style={{ color: highlight ? '#00FF88' : 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: highlight ? 700 : 400 }}>
        {value}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Quote Card ─────────────────────────────── */
function QuoteCard({ quote, onView, onStatusChange, onDelete }: {
  quote: QuoteRequest;
  onView: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: () => void;
}) {
  const sc = STATUS_COLORS[quote.status] || STATUS_COLORS.unread;
  const isUnread = quote.status === 'unread';

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200 hover:bg-white/[0.04]"
      style={{
        background: isUnread ? 'rgba(255,200,0,0.03)' : 'rgba(255,255,255,0.02)',
        border: isUnread ? '1px solid rgba(255,200,0,0.15)' : '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Name + status badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-body truncate" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              {quote.name}
            </span>
            {isUnread && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: '#FFC800', boxShadow: '0 0 6px #FFC800' }}
              />
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-1.5 mt-1">
            <Phone size={11} style={{ color: '#00FF88' }} />
            <span style={{ color: '#00FF88', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
              {quote.phone}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {quote.eventType && (
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif", display: 'flex', alignItems: 'center', gap: 3 }}>
                <Tag size={10} /> {quote.eventType}
              </span>
            )}
            {quote.budget && (
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif", display: 'flex', alignItems: 'center', gap: 3 }}>
                <Wallet size={10} /> {quote.budget}
              </span>
            )}
            {quote.date && (
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif", display: 'flex', alignItems: 'center', gap: 3 }}>
                <Calendar size={10} /> {formatEventDate(quote.date)}
              </span>
            )}
          </div>

          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.67rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 6 }}>
            {formatDate(quote.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text, fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.6rem', whiteSpace: 'nowrap' }}
          >
            {sc.label}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onView}
              title="Xem chi tiết"
              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
              style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)', color: '#00FF88', cursor: 'pointer' }}
            >
              <Eye size={12} />
            </button>
            {quote.status === 'unread' && (
              <button
                onClick={() => onStatusChange(quote.id, 'read')}
                title="Đánh dấu đã đọc"
                className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                <CheckCircle size={12} />
              </button>
            )}
            <button
              onClick={onDelete}
              title="Xóa"
              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.12)', color: '#FF3B30', cursor: 'pointer' }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Main Manager ─────────────────────────────── */
export function QuoteRequestsManager() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QuoteRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Không thể tải dữ liệu');
      const data = await res.json();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Không thể kết nối đến cơ sở dữ liệu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleStatusChange = async (id: string, status: string) => {
    // Optimistic update
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    if (selectedQuote?.id === id) setSelectedQuote((s) => s ? { ...s, status } : s);

    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      fetchQuotes(); // rollback on error
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    
    setDeleting(true);
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    if (selectedQuote?.id === id) setSelectedQuote(null);
    
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    } catch {
      fetchQuotes();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = filterStatus === 'all' ? quotes : quotes.filter((q) => q.status === filterStatus);
  const unreadCount = quotes.filter((q) => q.status === 'unread').length;

  const filterOptions = [
    { key: 'all', label: 'Tất cả', count: quotes.length },
    ...Object.entries(STATUS_COLORS).map(([key, cfg]) => ({
      key,
      label: cfg.label,
      count: quotes.filter((q) => q.status === key).length,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-body text-white mb-1" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            Yêu Cầu Báo Giá
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.83rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Quản lý các yêu cầu từ form báo giá chi tiết
          </p>
        </div>
        <button
          onClick={fetchQuotes}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif", cursor: 'pointer' }}
          title="Làm mới"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Tổng yêu cầu', value: quotes.length, color: '#00FF88', icon: MessageSquare },
          { label: 'Chưa đọc', value: unreadCount, color: '#FFC800', icon: Clock },
          { label: 'Đã liên hệ', value: quotes.filter(q => q.status === 'contacted').length, color: '#64B4FF', icon: Phone },
          { label: 'Hoàn thành', value: quotes.filter(q => q.status === 'completed').length, color: '#A064FF', icon: CheckCircle },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${stat.color}18` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} style={{ color: stat.color }} />
              </div>
              <div className="font-body" style={{ fontSize: '1.8rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                {loading ? '—' : stat.value}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 3 }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)' }}
        >
          <AlertCircle size={16} style={{ color: '#FF3B30', flexShrink: 0 }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{error}</span>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2" style={{ scrollbarWidth: 'none' }}>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          <Filter size={11} />
          <span>Lọc trạng thái</span>
        </div>
        <div className="flex items-center gap-2 flex-nowrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilterStatus(opt.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 flex-shrink-0"
              style={{
                background: filterStatus === opt.key ? (opt.key === 'all' ? 'rgba(0,255,136,0.08)' : (STATUS_COLORS[opt.key]?.bg || 'rgba(0,255,136,0.08)')) : 'rgba(255,255,255,0.03)',
                border: `1px solid ${filterStatus === opt.key ? (opt.key === 'all' ? 'rgba(0,255,136,0.25)' : (STATUS_COLORS[opt.key]?.border || 'rgba(0,255,136,0.25)')) : 'rgba(255,255,255,0.06)'}`,
                color: filterStatus === opt.key ? (opt.key === 'all' ? '#00FF88' : (STATUS_COLORS[opt.key]?.text || '#00FF88')) : 'rgba(255,255,255,0.4)',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {opt.label}
              <span
                className="px-1 rounded"
                style={{ background: 'rgba(255,255,255,0.08)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <LaserLoader size="lg" color="#00FF88" />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, letterSpacing: '0.15em' }}>
            ĐANG TẢI YÊU CẦU...
          </span>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.08)' }}
        >
          <FileText size={32} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
            {filterStatus === 'all' ? 'Chưa có yêu cầu báo giá nào' : 'Không có yêu cầu nào với trạng thái này'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 4 }}>
            {filterStatus === 'all' ? 'Yêu cầu từ form sẽ xuất hiện ở đây' : 'Thử chọn bộ lọc khác'}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onView={() => {
                setSelectedQuote(quote);
                if (quote.status === 'unread') handleStatusChange(quote.id, 'read');
              }}
              onStatusChange={handleStatusChange}
              onDelete={() => setDeleteTarget(quote)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedQuote && (
        <DetailModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onStatusChange={handleStatusChange}
          onDelete={() => setDeleteTarget(selectedQuote)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirm
          title={deleteTarget.name}
          message={`Bạn có chắc chắn muốn xóa yêu cầu từ "${deleteTarget.name}"? Dữ liệu này sẽ bị xóa vĩnh viễn và không thể phục hồi.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
