import React, { useState } from 'react';
import { Zone } from '../types';
import {
  Maximize2,
  X,
  Flag,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface Hotspot {
  id: string;
  label: string;
  name: string;
  type: 'PREMIUM_GRANDSTAND' | 'REGULAR_GRANDSTAND' | 'VIP_HOSPITALITY';
  badge: string;
  xPct: number;
  yPct: number;
  priceFormatted: string;
  viewpoint: string;
  zoneIdMatch: string;
}

const CIRCUIT_HOTSPOTS: Hotspot[] = [
  {
    id: 'royal-box-a',
    label: 'VIP A',
    name: 'Royal Box A (VIP Premiere)',
    type: 'VIP_HOSPITALITY',
    badge: 'VIP Hospitality',
    xPct: 47,
    yPct: 24,
    priceFormatted: 'Rp 20.000.000',
    viewpoint: 'Lantai VIP ber-AC menghadap pit lane, garasi tim, dan podium utama.',
    zoneIdMatch: 'zone-vip-premiere',
  },
  {
    id: 'royal-box-b',
    label: 'VIP B',
    name: 'Royal Box B (VIP Deluxe)',
    type: 'VIP_HOSPITALITY',
    badge: 'VIP Hospitality',
    xPct: 57,
    yPct: 21,
    priceFormatted: 'Rp 15.000.000',
    viewpoint: 'Suite ber-AC menghadap garis start dan akselerasi menuju Tikungan 1.',
    zoneIdMatch: 'zone-vip-deluxe',
  },
  {
    id: 'gs-a',
    label: 'A',
    name: 'Grandstand A — Main Straight',
    type: 'PREMIUM_GRANDSTAND',
    badge: 'Premium (Beratap)',
    xPct: 49,
    yPct: 31,
    priceFormatted: 'Rp 2.500.000',
    viewpoint: 'Menghadap garis start/finish, gedung pit, dan seremoni podium.',
    zoneIdMatch: 'zone-prem-a',
  },
  {
    id: 'gs-b',
    label: 'B',
    name: 'Grandstand B — Tikungan 1',
    type: 'PREMIUM_GRANDSTAND',
    badge: 'Premium (Beratap)',
    xPct: 60,
    yPct: 28,
    priceFormatted: 'Rp 2.000.000',
    viewpoint: 'Titik pengereman keras selepas trek lurus utama di Tikungan 1.',
    zoneIdMatch: 'zone-prem-b',
  },
  {
    id: 'gs-c',
    label: 'C',
    name: 'Grandstand C — Tikungan 2 & 3',
    type: 'PREMIUM_GRANDSTAND',
    badge: 'Premium (Beratap)',
    xPct: 62,
    yPct: 32,
    priceFormatted: 'Rp 1.500.000',
    viewpoint: 'Chicane cepat sektor pembuka tempat aksi saling menyalip.',
    zoneIdMatch: 'zone-prem-c',
  },
  {
    id: 'gs-d',
    label: 'D',
    name: 'Grandstand D — Tikungan 5 & 6',
    type: 'REGULAR_GRANDSTAND',
    badge: 'Regular (Terbuka)',
    xPct: 61,
    yPct: 47,
    priceFormatted: 'Rp 1.000.000',
    viewpoint: 'Tikungan cepat mengalir di sektor timur sirkuit.',
    zoneIdMatch: 'zone-reg-de',
  },
  {
    id: 'gs-e',
    label: 'E',
    name: 'Grandstand E — Tikungan 7 & 8',
    type: 'REGULAR_GRANDSTAND',
    badge: 'Regular (Terbuka)',
    xPct: 62,
    yPct: 58,
    priceFormatted: 'Rp 1.000.000',
    viewpoint: 'Akselerasi motor di kurva panjang menuju sektor selatan.',
    zoneIdMatch: 'zone-reg-de',
  },
  {
    id: 'gs-f',
    label: 'F',
    name: 'Grandstand F — Tikungan 9 & 10',
    type: 'REGULAR_GRANDSTAND',
    badge: 'Regular (Terbuka)',
    xPct: 55,
    yPct: 62,
    priceFormatted: 'Rp 750.000',
    viewpoint: 'Sudut pandang tikungan teknis di sektor selatan sirkuit.',
    zoneIdMatch: 'zone-reg-f',
  },
  {
    id: 'gs-g',
    label: 'G',
    name: 'Grandstand G — Tikungan 11 & 12',
    type: 'REGULAR_GRANDSTAND',
    badge: 'Regular (Terbuka)',
    xPct: 51,
    yPct: 55,
    priceFormatted: 'Rp 750.000',
    viewpoint: 'Ujung lintasan lurus balik sebelum masuk sektor akhir.',
    zoneIdMatch: 'zone-reg-g',
  },
  {
    id: 'gs-h',
    label: 'H',
    name: 'Grandstand H — Tikungan 13',
    type: 'REGULAR_GRANDSTAND',
    badge: 'Regular (Terbuka)',
    xPct: 44,
    yPct: 40,
    priceFormatted: 'Rp 750.000',
    viewpoint: 'Rangkaian tikungan teknis berkecepatan tinggi di bagian dalam trek.',
    zoneIdMatch: 'zone-reg-hi',
  },
  {
    id: 'gs-i',
    label: 'I',
    name: 'Grandstand I — Tikungan 14',
    type: 'REGULAR_GRANDSTAND',
    badge: 'Regular (Terbuka)',
    xPct: 33,
    yPct: 43,
    priceFormatted: 'Rp 750.000',
    viewpoint: 'Zona pengereman ke kiri sebelum tikungan penutup.',
    zoneIdMatch: 'zone-reg-hi',
  },
  {
    id: 'gs-j',
    label: 'J',
    name: 'Grandstand J — Tikungan 15',
    type: 'PREMIUM_GRANDSTAND',
    badge: 'Premium (Beratap)',
    xPct: 28,
    yPct: 25,
    priceFormatted: 'Rp 1.500.000',
    viewpoint: 'Tikungan krusial penentu posisi sebelum tikungan terakhir.',
    zoneIdMatch: 'zone-prem-j',
  },
  {
    id: 'gs-k',
    label: 'K',
    name: 'Grandstand K — Tikungan 16',
    type: 'PREMIUM_GRANDSTAND',
    badge: 'Premium (Beratap)',
    xPct: 39,
    yPct: 22,
    priceFormatted: 'Rp 1.500.000',
    viewpoint: 'Tikungan terakhir menuju garis finish perlombaan.',
    zoneIdMatch: 'zone-prem-k',
  },
];

interface CircuitMapProps {
  zones: Zone[];
  onSelectZone: (zone: Zone) => void;
}

export const CircuitMap: React.FC<CircuitMapProps> = ({ zones, onSelectZone }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(CIRCUIT_HOTSPOTS[2]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);

  const visibleHotspots =
    activeCategoryFilter === 'ALL'
      ? CIRCUIT_HOTSPOTS
      : CIRCUIT_HOTSPOTS.filter((h) => h.type === activeCategoryFilter);

  const handleBookFromMap = (hotspot: Hotspot) => {
    const matchedZone = zones.find(
      (z) =>
        z.id === hotspot.zoneIdMatch ||
        z.name.toLowerCase().includes(hotspot.label.toLowerCase()) ||
        (hotspot.id.includes('royal-box') && z.name.toLowerCase().includes('vip')),
    );

    if (matchedZone) {
      onSelectZone(matchedZone);
    } else if (zones.length > 0) {
      onSelectZone(zones[0]);
    }
  };

  return (
    <div id="circuit-map" className="mb-14">
      <div className="bg-[#111216] border border-white/[0.08] rounded-xl p-4 sm:p-6">
        {/* Clean Map Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Peta Interaktif Tribun Sirkuit Mandalika
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Klik titik tribun pada peta untuk melihat sudut pandang lintasan dan harga tiket.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'PREMIUM_GRANDSTAND', label: 'Premium (A, B, C, J, K)' },
              { id: 'REGULAR_GRANDSTAND', label: 'Regular (D–I)' },
              { id: 'VIP_HOSPITALITY', label: 'VIP Royal Box' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeCategoryFilter === tab.id
                    ? 'bg-white text-black'
                    : 'bg-[#181920] text-zinc-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map + Selected Tribune Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Map Canvas */}
          <div className="lg:col-span-8 relative rounded-xl overflow-hidden bg-[#0a0a0c] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsFullscreenModalOpen(true)}
              className="absolute top-3 right-3 z-20 bg-black/75 hover:bg-black text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Perbesar Peta"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Perbesar</span>
            </button>

            <div className="relative w-full aspect-[1024/829] overflow-hidden select-none">
              <img
                src="/mandalika-circuit-map.jpg"
                alt="Pertamina Mandalika International Circuit Map"
                className="w-full h-full object-contain brightness-95"
              />

              {/* Start / Finish Marker */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                style={{ left: '54%', top: '26.5%' }}
              >
                <div className="bg-black/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20 flex items-center space-x-1">
                  <Flag className="w-2.5 h-2.5 text-white" />
                  <span>START</span>
                </div>
              </div>

              {/* Hotspot Pins */}
              {visibleHotspots.map((hotspot) => {
                const isSelected = selectedHotspot?.id === hotspot.id;
                const isVip = hotspot.type === 'VIP_HOSPITALITY';
                const isPremium = hotspot.type === 'PREMIUM_GRANDSTAND';

                const pinStyle = isSelected
                  ? 'bg-[#E10600] text-white border-white scale-115 z-30 shadow-lg'
                  : isVip
                  ? 'bg-zinc-900/95 text-amber-300 border-amber-400/50 hover:border-amber-300'
                  : isPremium
                  ? 'bg-zinc-900/95 text-white border-white/40 hover:border-white'
                  : 'bg-zinc-900/95 text-zinc-300 border-white/20 hover:border-white/50';

                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => setSelectedHotspot(hotspot)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${pinStyle}`}
                    style={{ left: `${hotspot.xPct}%`, top: `${hotspot.yPct}%` }}
                  >
                    {hotspot.label}
                  </button>
                );
              })}
            </div>

            {/* Bottom Quick Selector Strip */}
            <div className="p-2.5 bg-[#0e0f13] border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] text-zinc-500 mr-1 shrink-0">Tribun:</span>
              {CIRCUIT_HOTSPOTS.map((h) => {
                const isSelected = selectedHotspot?.id === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSelectedHotspot(h)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#E10600] text-white'
                        : 'bg-[#181920] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {h.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Clean Selected Zone Inspector */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#15161c] border border-white/[0.08] rounded-xl p-5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{selectedHotspot.badge}</span>
                <span className="font-mono text-zinc-500">Kode {selectedHotspot.label}</span>
              </div>

              <div>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  {selectedHotspot.name}
                </h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {selectedHotspot.viewpoint}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Durasi Akses</span>
                  <span className="text-zinc-200 font-medium">3 Hari (Jumat–Minggu)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Tipe Tempat Duduk</span>
                  <span className="text-zinc-200 font-medium">
                    {selectedHotspot.type === 'VIP_HOSPITALITY'
                      ? 'Suite Ber-AC'
                      : selectedHotspot.type === 'PREMIUM_GRANDSTAND'
                      ? 'Kursi Bernomor Beratap'
                      : 'Kursi Tribun Terbuka'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-4">
              <div>
                <span className="text-[11px] text-zinc-500 block">Harga Tiket Resmi</span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-2xl font-bold text-white">
                    {(() => {
                      const matched = zones.find(
                        (z) =>
                          z.id === selectedHotspot.zoneIdMatch ||
                          z.name.toLowerCase().includes(selectedHotspot.label.toLowerCase()) ||
                          (selectedHotspot.id.includes('royal-box') && z.name.toLowerCase().includes('vip')),
                      );
                      if (matched) {
                        const num = typeof matched.price === 'string' ? parseFloat(matched.price) : matched.price;
                        return new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0,
                        }).format(num);
                      }
                      return selectedHotspot.priceFormatted;
                    })()}
                  </span>
                  <span className="text-xs text-zinc-500">/ 3-day pass</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleBookFromMap(selectedHotspot)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#E10600] hover:bg-[#c70500] text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Pilih Tribun Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Map Modal */}
      {isFullscreenModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreenModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        >
          <div className="w-full max-w-5xl bg-[#111216] border border-white/10 rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
              <span className="text-xs font-semibold text-white">
                Peta Sirkuit Internasional Pertamina Mandalika
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setModalZoom((z) => Math.min(z + 0.25, 2.25))}
                  className="p-1.5 rounded-lg bg-[#181920] text-zinc-300 hover:text-white cursor-pointer"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setModalZoom((z) => Math.max(z - 0.25, 0.75))}
                  className="p-1.5 rounded-lg bg-[#181920] text-zinc-300 hover:text-white cursor-pointer"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setModalZoom(1)}
                  className="p-1.5 rounded-lg bg-[#181920] text-zinc-300 hover:text-white cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="p-1.5 rounded-lg bg-[#181920] text-zinc-300 hover:text-white cursor-pointer ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#0a0a0c]">
              <img
                src="/mandalika-circuit-map.jpg"
                alt="Peta Sirkuit Mandalika"
                style={{ transform: `scale(${modalZoom})` }}
                className="transition-transform duration-150 max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
