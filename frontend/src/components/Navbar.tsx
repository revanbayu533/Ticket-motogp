import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, ChevronDown, ExternalLink } from 'lucide-react';
import { AppNotification, User } from '../types';

interface NavbarProps {
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  notifications,
  onOpenNotifications,
  user,
  onOpenLogin,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';
  const hasPending = notifications.some((n) => n.type === 'pending' || Boolean(n.snapToken));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Minimalist Brand */}
          <a href="#" className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-[#E10600] rounded-xs" />
            <span className="text-lg font-black tracking-tight text-white font-racing uppercase">
              {appName}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium hidden sm:inline border-l border-white/10 pl-2.5">
              Mandalika GP
            </span>
          </a>

          {/* Clean Navigation */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium text-zinc-400">
            <a href="#ticket-passes" className="hover:text-white transition-colors">
              Kategori Tiket
            </a>
            <a href="#circuit-zones" className="hover:text-white transition-colors">
              Peta & Zona
            </a>
            <a href="#riders-showcase" className="hover:text-white transition-colors">
              Pembalap
            </a>
            <a href="#standings" className="hover:text-white transition-colors">
              Klasemen
            </a>
            <a
              href="https://themandalikagp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center space-x-1 text-zinc-500"
            >
              <span>themandalikagp.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
              title={hasPending ? 'Ada pesanan menunggu pembayaran' : 'Notifikasi'}
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span
                  className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                    hasPending ? 'bg-amber-400' : 'bg-[#E10600]'
                  }`}
                />
              )}
            </button>

            {/* User Profile or Login */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-zinc-200 hidden sm:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#121318] border border-white/10 shadow-xl p-1.5 z-50">
                    <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                Masuk
              </button>
            )}

            <a
              href="#circuit-zones"
              className="bg-[#E10600] hover:bg-[#c70500] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Beli Tiket
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
