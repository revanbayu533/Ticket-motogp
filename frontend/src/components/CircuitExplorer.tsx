import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CircuitExplorerProps {
  onSelectZone: (zoneId: string) => void;
}

interface TrackZoneData {
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  photoUrl: string;
  photoCaption: string;
  turnInfo: string;
  features: string[];
  prices: {
    friday: string;
    saturday: string;
    sunday: string;
    weekend: string;
  };
}

const TRACK_ZONES: TrackZoneData[] = [
  {
    id: 'zone-prem-a',
    name: 'GRANDSTAND A - MAIN PIT STRAIGHT',
    shortName: 'Grandstand A',
    category: 'PREMIUM GRANDSTAND (BERATAP)',
    description:
      'Menikmati momen paling krusial balapan: start, akselerasi top speed 330 km/jam, pit stop drama, hingga selebrasi podium tepat di depan mata Anda.',
    photoUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Pemandangan Garis Start/Finish & Gedung Pit Box',
    turnInfo: 'Lintasan Lurus Utama • Depan Pit Lane',
    features: ['Atap Kanopi Pelindung', 'Giant Screen Siaran Langsung', 'Audio Komentator Jelas'],
    prices: {
      friday: 'Rp 500.000',
      saturday: 'Rp 1.250.000',
      sunday: 'Rp 1.850.000',
      weekend: 'Rp 2.450.000',
    },
  },
  {
    id: 'zone-prem-b',
    name: 'GRANDSTAND B - TURN 1 EXIT',
    shortName: 'Grandstand B',
    category: 'PREMIUM GRANDSTAND (BERATAP)',
    description:
      'Spot paling mendebarkan untuk melihat pengereman ekstrem (hard braking) dari kecepatan 320 km/jam ke 100 km/jam serta aksi overtaking tajam di Tikungan 1.',
    photoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Sudut Tikungan 1 & Area Titik Pengereman Keras',
    turnInfo: 'Tikungan 1 • Titik Overtaking Terbaik',
    features: ['Atap Kanopi Pelindung', 'Giant Screen Tikungan 1', 'Zona Paling Ramai Serunya'],
    prices: {
      friday: 'Rp 500.000',
      saturday: 'Rp 1.150.000',
      sunday: 'Rp 1.750.000',
      weekend: 'Rp 2.300.000',
    },
  },
  {
    id: 'zone-prem-j',
    name: 'GRANDSTAND J - VR46 RACING FAN ZONE',
    shortName: 'Grandstand J (VR46)',
    category: 'PREMIUM GRANDSTAND (BERATAP)',
    description:
      'Tribun resmi basis suporter Pertamina Enduro VR46 Racing Team. Menghadap langsung rangkaian tikungan cepat 15 & 16 dengan atmosfer chant yang membahana.',
    photoUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Tribun Laut & Tikungan Cepat 15-16',
    turnInfo: 'Tikungan 15 & 16 • View Laut Seger',
    features: ['Atap Kanopi Pelindung', 'VR46 Fan Kit Gratis', 'View Panorama Laut'],
    prices: {
      friday: 'Rp 450.000',
      saturday: 'Rp 1.000.000',
      sunday: 'Rp 1.600.000',
      weekend: 'Rp 2.000.000',
    },
  },
  {
    id: 'zone-ga-fest',
    name: 'BUKIT SEGER FESTIVAL (GENERAL ADMISSION)',
    shortName: 'Bukit Seger (GA)',
    category: 'GENERAL ADMISSION (OUTDOOR)',
    description:
      'Area berdiri alami di perbukitan hijau Mandalika. Nikmati kebebasan berkeliling bukit sambil menyaksikan motor melesat dengan latar belakang samudera Hindia.',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Panorama Samudera & Tikungan Sektor 3',
    turnInfo: 'Perbukitan Tikungan 10 - 13',
    features: ['Area Festival Terbuka', 'Giant Screen Monitor', 'Akses F&B & Musik'],
    prices: {
      friday: 'Rp 200.000',
      saturday: 'Rp 400.000',
      sunday: 'Rp 550.000',
      weekend: 'Rp 650.000',
    },
  },
  {
    id: 'zone-vip-deluxe',
    name: 'ROYAL BOX A & B - VIP VILLAGE DELUXE',
    shortName: 'VIP Royal Box',
    category: 'VIP HOSPITALITY SUITES',
    description:
      'Layanan hospitality ber-AC tertinggi di atas gedung pit. Dilengkapi akses eksklusif ke Pit Lane Walk, fine-dining 3-course, serta temu pembalap di paddock.',
    photoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Lounge AC Mewah Tepat di Atas Garasi Pit',
    turnInfo: 'Lantai 2 & 3 Pit Building',
    features: ['Pit Lane Walk Tiap Hari', 'All-Inclusive Dining & Bar', 'Paddock Pass Akses Penuh'],
    prices: {
      friday: 'Rp 5.000.000',
      saturday: 'Rp 8.000.000',
      sunday: 'Rp 12.000.000',
      weekend: 'Rp 15.500.000',
    },
  },
];

export const CircuitExplorer: React.FC<CircuitExplorerProps> = ({ onSelectZone }) => {
  const [activeZoneId, setActiveZoneId] = useState('zone-prem-a');
  const activeZone = TRACK_ZONES.find((z) => z.id === activeZoneId) || TRACK_ZONES[0];

  return (
    <section id="circuit-explorer" className="py-16 bg-[#0a0c12] border-b border-[#1c1f2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-black tracking-widest text-[#E10600] uppercase mb-1">
              <span className="w-2.5 h-1 bg-[#E10600] rounded-full" />
              <span>Tata Letak & Simulasi Tribun</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight font-racing">
              EKSPLORASI SUDUT PANDANG SIRKUIT MANDALIKA
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md md:text-right">
            Pilih tribun untuk melihat simulasi pemandangan nyata, karakter tikungan, serta rincian harga per sesi balap.
          </p>
        </div>

        {/* Zone Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TRACK_ZONES.map((zone) => {
            const isSelected = zone.id === activeZoneId;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZoneId(zone.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-[#E10600] border-[#E10600] text-white shadow-lg shadow-red-950/50'
                    : 'bg-[#141622] border-[#252a3d] text-gray-400 hover:text-white hover:border-white/30'
                }`}
              >
                <span>{zone.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Split: Circuit Visualizer (Left) & Grandstand Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Interactive Mandalika Circuit Track Graphic */}
          <div className="lg:col-span-7 rounded-2xl bg-[#11131c] border border-[#232738] p-5 sm:p-6 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs">
              <span className="font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Peta Interaktif • 4.31 KM • 17 Tikungan</span>
              </span>
              <span className="text-gray-400 font-mono text-[11px]">
                Arah Balap: Searah Jarum Jam
              </span>
            </div>

            {/* Stylized Track SVG */}
            <div className="relative my-4 flex items-center justify-center min-h-[300px] sm:min-h-[380px] bg-[#0c0d13] rounded-xl p-4 border border-white/5 overflow-hidden">
              <svg
                viewBox="0 0 900 520"
                className="w-full h-auto max-h-[360px] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              >
                {/* Circuit Track Surface Outlines */}
                <path
                  d="M 230 430 L 680 430 Q 750 430 750 380 Q 750 330 700 320 L 590 300 Q 550 290 560 250 L 580 190 Q 590 140 540 120 L 460 100 Q 400 80 370 120 L 330 180 Q 300 220 250 200 L 200 180 Q 150 160 140 210 L 130 330 Q 120 400 190 420 Z"
                  fill="none"
                  stroke="#272b3c"
                  strokeWidth="32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Inner Track Line */}
                <path
                  d="M 230 430 L 680 430 Q 750 430 750 380 Q 750 330 700 320 L 590 300 Q 550 290 560 250 L 580 190 Q 590 140 540 120 L 460 100 Q 400 80 370 120 L 330 180 Q 300 220 250 200 L 200 180 Q 150 160 140 210 L 130 330 Q 120 400 190 420 Z"
                  fill="none"
                  stroke="#3b425b"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Highlighted Selected Sector in Bright Red */}
                {activeZoneId === 'zone-prem-a' && (
                  <path
                    d="M 230 430 L 520 430"
                    fill="none"
                    stroke="#E10600"
                    strokeWidth="26"
                    strokeLinecap="round"
                  />
                )}
                {activeZoneId === 'zone-prem-b' && (
                  <path
                    d="M 520 430 L 680 430 Q 750 430 750 380"
                    fill="none"
                    stroke="#E10600"
                    strokeWidth="26"
                    strokeLinecap="round"
                  />
                )}
                {activeZoneId === 'zone-prem-j' && (
                  <path
                    d="M 130 330 Q 120 400 230 430"
                    fill="none"
                    stroke="#E10600"
                    strokeWidth="26"
                    strokeLinecap="round"
                  />
                )}
                {activeZoneId === 'zone-ga-fest' && (
                  <path
                    d="M 460 100 Q 400 80 370 120 L 330 180"
                    fill="none"
                    stroke="#E10600"
                    strokeWidth="26"
                    strokeLinecap="round"
                  />
                )}
                {activeZoneId === 'zone-vip-deluxe' && (
                  <path
                    d="M 320 430 L 480 430"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="28"
                    strokeLinecap="round"
                  />
                )}

                {/* Start / Finish Line Checkered Bar */}
                <rect x="360" y="415" width="8" height="30" fill="#ffffff" rx="2" />
                <text x="364" y="465" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                  START / FINISH
                </text>

                {/* Turn Numbers */}
                <circle cx="730" cy="380" r="14" fill="#1b1e2b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="730" y="385" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">T1</text>

                <circle cx="560" cy="190" r="14" fill="#1b1e2b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="560" y="195" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">T7</text>

                <circle cx="370" cy="115" r="14" fill="#1b1e2b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="370" y="120" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">T10</text>

                <circle cx="140" cy="350" r="14" fill="#1b1e2b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="140" y="355" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">T16</text>
              </svg>

              {/* Live Highlight Floating Pill on Map */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-500/40 text-[11px] text-white flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
                <span className="font-bold">{activeZone.shortName}</span>
                <span className="text-gray-400">({activeZone.turnInfo})</span>
              </div>
            </div>

            {/* Quick Map Legend */}
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#E10600]" />
                  <span>Tribun Dipilih</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#3b425b]" />
                  <span>Lintasan Sirkuit</span>
                </div>
              </div>
              <span className="text-gray-500">Klik tombol tribun di atas untuk berganti sudut pandang</span>
            </div>
          </div>

          {/* Right Column: Selected Grandstand Detail Card (Exact Match from Screenshot) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#12141c] border border-[#262a3d] p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              {/* Category Pill */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-[#ff4d4d] text-[10px] font-black uppercase tracking-widest">
                  {activeZone.category}
                </span>
                <span className="text-xs text-gray-400 font-bold">{activeZone.turnInfo}</span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-racing">
                  {activeZone.name}
                </h3>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  {activeZone.description}
                </p>
              </div>

              {/* Realistic Perspective Photo */}
              <div className="relative h-44 rounded-xl overflow-hidden border border-white/10 group">
                <img
                  src={activeZone.photoUrl}
                  alt={activeZone.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                  {activeZone.photoCaption}
                </span>
              </div>

              {/* Badges / Features */}
              <div className="flex flex-wrap gap-2 pt-1">
                {activeZone.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#181a26] border border-white/10 text-[11px] text-gray-200 font-semibold flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{feature}</span>
                  </span>
                ))}
              </div>

              {/* Pricing Breakdown Table */}
              <div className="rounded-xl bg-[#171924] border border-[#272b3d] p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-400 pb-1 border-b border-white/5 font-semibold text-[11px]">
                  <span>Sesi Balapan</span>
                  <span>Harga Resmi (IDR)</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Jumat (Free Practice)</span>
                  <span className="font-mono">{activeZone.prices.friday}</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Sabtu (Sprint & Kualifikasi)</span>
                  <span className="font-mono">{activeZone.prices.saturday}</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Minggu (Main Race & Podium)</span>
                  <span className="font-mono">{activeZone.prices.sunday}</span>
                </div>
                <div className="flex items-center justify-between text-white font-bold pt-1 border-t border-white/10">
                  <span className="text-[#E10600]">Paket Lengkap 3-Day Weekend</span>
                  <span className="text-base text-[#E10600] font-black font-racing">
                    {activeZone.prices.weekend}
                  </span>
                </div>
              </div>
            </div>

            {/* Red Action CTA Button */}
            <button
              type="button"
              onClick={() => onSelectZone(activeZone.id)}
              className="w-full mt-6 py-3.5 rounded-xl bg-[#E10600] hover:bg-[#c70500] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-950/60 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>PILIH KURSI DI {activeZone.shortName.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
