import React from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  as?: 'input' | 'textarea' | 'select';
  rows?: number;
}

export function AdminInput({ as = 'input', style, onFocus, onBlur, ...props }: AdminInputProps) {
  const handleFocus = (e: any) => {
    e.target.style.borderColor = 'rgba(0,255,136,0.5)';
    e.target.style.boxShadow = '0 0 8px rgba(0,255,136,0.15)';
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
    e.target.style.boxShadow = 'none';
    if (onBlur) onBlur(e);
  };

  const baseStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    borderRadius: '8px',
    padding: '0.65rem 0.875rem',
    width: '100%',
    outline: 'none',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: '0.83rem',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    ...style,
  };

  const Component = as as any;

  return (
    <Component
      style={baseStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}
