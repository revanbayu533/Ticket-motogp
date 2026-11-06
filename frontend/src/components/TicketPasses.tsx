import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Zone } from '../types';

interface TicketPassesProps {
  onSelectZone: (zoneId: string) => void;
  zones?: Zone[];
}

const TIERS = [
  {
    index: '01',
    tag: 'Festival (Non-Seating)',
    title: 'General Admission',
    price: 'Rp 650.000',
    zoneId: 'zone-ga-fest',
    description:
      'Akses area perbukitan Bukit Seger dan zona festival terbuka dengan layar raksasa di sekitar sirkuit.',
    details: 'Akses 3 Hari • Area Terbuka',
    dailyNote: 'Harian mulai Rp 150.000',
    featured: false,
  },
  {
    index: '02',
    tag: 'Tribun Terbuka',
    title: 'Regular Grandstand',
    price: 'Mulai Rp 750.000',
    zoneId: 'zone-reg-de',
    description:
      'Kursi tribun bernomor tanpa atap di Zona D, E, F, G, H, dan I yang menghadap rangkaian tikungan teknikal.',
    details: 'Akses 3 Hari • Kursi Bernomor',
    dailyNote: 'Harian mulai Rp 100.000',
    featured: false,
  },
  {
    index: '03',
    tag: 'Tribun Beratap',
    title: 'Premium Grandstand',
    price: 'Mulai Rp 1.500.000',
    zoneId: 'zone-prem-a',
    description:
      'Tribun beratap di titik utama sirkuit: Garis Start/Finish (Zona A), Tikungan 1 (Zona B), serta Tikungan 15–16 (J & K).',
    details: 'Akses 3 Hari • Kursi Beratap',
    dailyNote: 'Harian mulai Rp 200.000',
    featured: true,
  },
  {
    index: '04',
    tag: 'Royal Box Suite',
    title: 'VIP Hospitality',
    price: 'Mulai Rp 15.000.000',
    zoneId: 'zone-vip-deluxe',
    description:
      'Suite ber-AC di gedung Pit Building (Premiere & Deluxe Class) dengan akses Pit Walk, Paddock, dan sajian kuliner.',
    details: 'Akses 3 Hari • VIP Suite & Pit Walk',
    dailyNote: 'Khusus Paket 3-Day Pass',
    featured: false,
  },
];

export const TicketPasses: React.FC<TicketPassesProps> = ({ onSelectZone }) => {
  return (
    <section id="ticket-passes" className="py-16 bg-[#0a0a0c] border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">
              Ringkasan Kategori
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-racing">
              Kategori Tiket Resmi Mandalika
            </h2>
          </div>
          <a
            href="https://themandalikagp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-zinc-400 hover:text-white inline-flex items-center space-x-1.5 transition-colors"
          >
            <span>Lihat di portal resmi themandalikagp.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Minimalist 4-Column Tier Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.index}
              onClick={() => onSelectZone(tier.zoneId)}
              className={`rounded-xl p-5 flex flex-col justify-between transition-colors cursor-pointer border ${
                tier.featured
                  ? 'bg-[#13141a] border-white/25 hover:border-white/40'
                  : 'bg-[#111216] border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-4">
                  <span className="font-mono">{tier.index}</span>
                  <span>{tier.tag}</span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                  {tier.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {tier.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <div className="mb-4">
                  <span className="text-[11px] text-zinc-500 block">Mulai dari</span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="text-xl font-bold text-white tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-[11px] text-zinc-500">/ pass</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">{tier.dailyNote}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-zinc-500 text-[11px]">{tier.details}</span>
                  <span
                    className={`inline-flex items-center space-x-1 ${
                      tier.featured ? 'text-[#E10600]' : 'text-zinc-300'
                    }`}
                  >
                    <span>Pilih</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
