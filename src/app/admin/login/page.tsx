'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
      setPassword('');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #000 0%, #050515 50%, #000 100%)' }}
    >
      {/* Background laser beams */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.15), transparent)' }} />
        <div className="absolute right-1/3 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.1), transparent)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-2" />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 4 }}>
            Hệ thống Quản Trị Nội Dung
          </p>
        </div>

        {/* Login form */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", display: 'block', marginBottom: 8, letterSpacing: '0.05em' }}>
                MẬT KHẨU ADMIN
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Nhập mật khẩu..."
                  required
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${error ? 'rgba(255,59,48,0.5)' : 'rgba(255,255,255,0.12)'}`,
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.75rem 3rem 0.75rem 1rem',
                    width: '100%',
                    outline: 'none',
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: '0.9rem',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(0,255,136,0.5)';
                    e.target.style.boxShadow = '0 0 10px rgba(0,255,136,0.15)';
                  }}
                  onBlur={(e) => {
                    if (!error) {
                      e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p style={{ color: '#FF3B30', fontSize: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif", marginTop: 6 }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-exo transition-all duration-300"
              style={{
                background: loading ? 'rgba(0,255,136,0.1)' : 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.1))',
                border: '1px solid rgba(0,255,136,0.4)',
                color: '#00FF88',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 20px rgba(0,255,136,0.1)',
              }}
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            </button>
          </form>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 transition-colors duration-300 hover:text-white"
              style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif", textDecoration: 'none' }}
            >
              <ExternalLink size={13} />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
