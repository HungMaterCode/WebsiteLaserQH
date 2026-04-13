import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showAdmin?: boolean;
}

export function Logo({ className = '', size = 'md', showAdmin = false }: LogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  // Sizing based on the 'size' prop
  // Balanced enlarged sizes as requested: sm(46), md(76), lg(120)
  const height = isSm ? 46 : isLg ? 120 : 76;
  const width = Math.round(height * 1.05);

  return (
    <div className={`flex items-center group ${className}`}>
      <div
        className="relative"
        style={{
          height: `${height}px`,
          width: `${width}px`,
          filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.22))'
        }}
      >
        <Image
          src="/logo-v4.png"
          alt="LaserQH Logo"
          fill
          unoptimized
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          priority
        />
      </div>
      {showAdmin && (
        <span
          style={{
            color: 'rgba(0,255,136,0.7)',
            fontSize: isSm ? '0.7rem' : '0.9rem',
            marginLeft: 8,
            fontWeight: 900,
            letterSpacing: '0.05em'
          }}
        >
          ADMIN
        </span>
      )}
    </div>
  );
}
