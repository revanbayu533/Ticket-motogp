import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';

  return (
    <footer className="bg-[#08080a] border-t border-white/[0.07] text-zinc-500 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-4 bg-[#E10600] rounded-xs" />
              <span className="text-base font-black text-white font-racing tracking-tight uppercase">
                {appName}
              </span>
            </div>
            <p className="text-zinc-400 max-w-md leading-relaxed">
              Platform pemesanan tiket resmi Pertamina Grand Prix of Indonesia di Pertamina Mandalika International Circuit, Lombok.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5">
            <div className="font-semibold text-white">Navigasi</div>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a href="#ticket-passes" className="hover:text-white transition-colors">
                  Kategori Tiket
                </a>
              </li>
              <li>
                <a href="#circuit-zones" className="hover:text-white transition-colors">
                  Peta & Zona Tribun
                </a>
              </li>
              <li>
                <a href="#riders-showcase" className="hover:text-white transition-colors">
                  Lineup Pembalap
                </a>
              </li>
              <li>
                <a href="#standings" className="hover:text-white transition-colors">
                  Klasemen Kejuaraan
                </a>
              </li>
            </ul>
          </div>

          {/* Official Links & Payment */}
          <div className="space-y-2.5">
            <div className="font-semibold text-white">Portal Resmi & Pembayaran</div>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a
                  href="https://themandalikagp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center space-x-1 transition-colors"
                >
                  <span>themandalikagp.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://tickets.motogp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center space-x-1 transition-colors"
                >
                  <span>tickets.motogp.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-1 text-zinc-500">
                Midtrans • QRIS • Virtual Account • Visa / Mastercard
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {appName}. Pertamina Mandalika International Circuit.</p>
          <p>E-Ticket Resmi Terverifikasi</p>
        </div>
      </div>
    </footer>
  );
};
