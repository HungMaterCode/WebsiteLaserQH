import { Zap } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showAdmin?: boolean;
}

export function Logo({ className = '', size = 'md', showAdmin = false }: LogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconSize = isSm ? 16 : isLg ? 28 : 18;
  const boxSize = isSm ? 'w-8 h-8' : isLg ? 'w-16 h-16' : 'w-9 h-9';
  const fontSize = isSm ? '0.85rem' : isLg ? '1.4rem' : '0.92rem';
  const subfontSize = isSm ? '0.5rem' : isLg ? '0.75rem' : '0.5rem';
  const gap = isSm ? 'gap-2' : 'gap-2.5';

  return (
    <div className={`flex items-center ${gap} group ${className}`}>
      <div
        className={`${boxSize} rounded-md flex items-center justify-center transition-all duration-300`}
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,229,255,0.15))',
          border: '1px solid rgba(0,255,136,0.45)',
          boxShadow: '0 0 15px rgba(0,255,136,0.25)',
          borderRadius: isLg ? '16px' : '8px'
        }}
      >
        <Zap size={iconSize} style={{ color: '#00FF88' }} />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-orbitron text-white" style={{ fontSize, fontWeight: 800, letterSpacing: '0.04em' }}>
          Laser<span style={{ color: '#00FF88', textShadow: '0 0 12px rgba(0,255,136,0.6)' }}>QH</span>
          {showAdmin && (
            <span style={{ color: 'rgba(0,255,136,0.7)', fontSize: isSm ? '0.7rem' : '0.9rem', marginLeft: 6 }}>ADMIN</span>
          )}
        </span>
        {!showAdmin && (
          <span style={{ fontSize: subfontSize, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.25em', fontFamily: "'Be Vietnam Pro', sans-serif", textTransform: 'uppercase', marginTop: isLg ? 4 : 0 }}>
            Production
          </span>
        )}
      </div>
    </div>
  );
}
