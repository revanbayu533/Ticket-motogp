import React from 'react';
import { Flag, ShieldCheck, Terminal, Database, Code, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';

  return (
    <footer className="bg-[#08090d] border-t border-[#1d202e] text-gray-400 py-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E10600] to-[#8A0000] flex items-center justify-center text-white font-bold">
                <Flag className="w-5 h-5 transform -rotate-12" />
              </div>
              <span className="text-2xl font-black text-white font-racing tracking-tight">
                {appName}
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              Fondasi arsitektur sistem pemesanan tiket resmi ajang balap dunia MotoGP dan Pertamina
              Mandalika International Circuit. Dibangun dengan NestJS, React Vite, Tailwind CSS,
              PostgreSQL Neon, dan Prisma ORM.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Kode Booking Unik & E-Ticket QR Code Terverifikasi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi Proyek
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#events" className="hover:text-white transition-colors">
                  Pertamina Grand Prix 2026
                </a>
              </li>
              <li>
                <a href="#circuit-zones" className="hover:text-white transition-colors">
                  Zona & Harga Tiket
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3001/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00F0FF] transition-colors flex items-center space-x-1"
                >
                  <span>Backend Health Check</span>
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3001/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00F0FF] transition-colors flex items-center space-x-1"
                >
                  <span>Swagger API Docs</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack Spec */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Tech Stack Foundation
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-gray-300">
                <Terminal className="w-3.5 h-3.5 text-red-400" />
                <span>NestJS + ConfigModule + CORS</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                <span>React 18 + Vite + Tailwind CSS</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>PostgreSQL (Neon) + Prisma ORM</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ESLint, Prettier, CI PR Checks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#181a25] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            © {new Date().getFullYear()} {appName} Platform. Pertamina Mandalika Grand Prix Partner.
          </p>
          <p className="flex items-center space-x-1">
            <span>Dirancang untuk performa tinggi & keamanan transaksi balap</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
