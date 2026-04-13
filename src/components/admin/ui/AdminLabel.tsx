import React from 'react';

interface AdminLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function AdminLabel({ children, style, ...props }: AdminLabelProps) {
  return (
    <label
      style={{
        color: 'rgba(255,255,255,0.45)',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-body), sans-serif',
        fontWeight: 700,
        letterSpacing: '0.05em',
        display: 'block',
        marginBottom: 6,
        textTransform: 'uppercase',
        ...style,
      }}
      {...props}
    >
      {children}
    </label>
  );
}
