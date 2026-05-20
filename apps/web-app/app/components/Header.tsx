'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getToken, api, removeToken } from '../lib/api';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    setCurrentHash(window.location.hash); // eslint-disable-line react-hooks/set-state-in-effect
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isActive = (path: string) => {
    if (path.includes('#')) {
      const [pathPart, hashPart] = path.split('#');
      return pathname === (pathPart || '/') && currentHash === `#${hashPart}`;
    }
    return pathname === path;
  };

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/#objects', label: 'Objets connectés' },
    { href: '/#app', label: 'Application' },
    { href: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.auth.me(token).then(setUser).catch(() => null);
  }, []);

  async function handleLogout() {
    const token = getToken();
    if (token) await api.auth.logout(token);
    removeToken();
    setUser(null);
    setMenuOpen(false);
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-50 bg-[#050508]/80 backdrop-blur-xl border-b border-white/6">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image src="/fizzup-logo.png" alt="FizzUp" width={120} height={36} className="h-9 w-auto" priority />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-violet-500/15 text-violet-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/6'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 text-sm font-medium text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all"
                >
                  <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-bold">
                    {user.email[0].toUpperCase()}
                  </span>
                  <span className="max-w-[160px] truncate">{user.email}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-white/8 py-1 shadow-xl"
                    style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(16px)' }}
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/6 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                    <div className="border-t border-white/6 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/8 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:block px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Connexion
              </Link>
            )}

            <button className="md:hidden p-2 hover:bg-white/8 rounded-lg text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
