'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthenticated' && pathname !== '/admin/login') {
    return null;
  }

  // No layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Top navbar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6"
        style={{
          height: '60px',
          background: 'rgba(5,5,15,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Logo size="sm" showAdmin={true} />

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={12} />
            Xem trang web
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
            style={{
              background: 'rgba(255,0,110,0.08)',
              border: '1px solid rgba(255,0,110,0.2)',
              color: '#FF006E',
              fontSize: '0.75rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              cursor: 'pointer',
            }}
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      <div className="flex" style={{ minHeight: 'calc(100vh - 60px)' }}>
        {children}
      </div>
    </div>
  );
}
