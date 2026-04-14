import React from 'react';
import { LaserLoader } from '../../ui/LaserLoader';
import { CheckCircle } from 'lucide-react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  loadingText?: string;
  saved?: boolean;
  icon?: React.ReactNode;
}

export function AdminButton({ 
  children, 
  variant = 'primary', 
  loading, 
  loadingText = 'Đang lưu...',
  saved, 
  icon, 
  style, 
  disabled,
  ...props 
}: AdminButtonProps) {
  
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: saved ? 'rgba(0,255,136,0.15)' : 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.1))',
          border: '1px solid rgba(0,255,136,0.4)',
          color: '#00FF88',
          boxShadow: '0 0 20px rgba(0,255,136,0.1)',
        };
      case 'secondary':
        return {
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.7)',
        };
      case 'danger':
        return {
          background: 'rgba(255,0,110,0.08)',
          border: '1px solid rgba(255,0,110,0.3)',
          color: '#FF006E',
        };
      case 'ghost':
        return {
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          padding: 0,
        };
      default:
        return {};
    }
  };

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0.65rem 1.25rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontWeight: 700,
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: loading ? 0.8 : 1,
    ...getVariantStyles(),
    ...style,
  };

  return (
    <button
      style={baseStyle as any}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LaserLoader size="xs" color="#00FF88" />
      ) : saved ? (
        <CheckCircle size={18} />
      ) : icon}
      <span>{loading ? 'Đang lưu...' : saved ? 'Đã lưu' : children}</span>
    </button>
  );
}
