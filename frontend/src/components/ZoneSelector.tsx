import React, { useState } from 'react';
import { Zone, PassType } from '../types';
import { ArrowRight, ExternalLink, Calendar, Check, Info } from 'lucide-react';
import { CircuitMap } from './CircuitMap';
import {
  getZonePriceByPass,
  getZonesByPass,
  getPassBadge,
} from '../data/mandalikaZones';

interface ZoneSelectorProps {
  zones: Zone[];
  onSelectZone: (zone: Zone, passType?: PassType) => void;
  isLoading: boolean;
  initialPassType?: PassType;
}

type CategoryTab =
  | 'ALL'
  | 'PREMIUM_GRANDSTAND'
  | 'REGULAR_GRANDSTAND'
  | 'GENERAL_ADMISSION'
  | 'VIP_HOSPITALITY';

interface CategoryMeta {
  type: CategoryTab;
  tabLabel: string;
  tag: string;
  headerTitle: string;
  headerSubtitle: string;
}

const CATEGORY_METAS: CategoryMeta[] = [
  {
    type: 'PREMIUM_GRANDSTAND',
    tabLabel: 'Premium Grandstand',
    tag: 'Beratap',
    headerTitle: 'Premium Grandstand (Beratap)',
    headerSubtitle:
      'Tribun beratap menghadap garis start/finish, gedung pit, dan tikungan krusial.',
  },
  {
    type: 'REGULAR_GRANDSTAND',
    tabLabel: 'Regular Grandstand',
    tag: 'Terbuka',
    headerTitle: 'Regular Grandstand (Terbuka)',
    headerSubtitle:
      'Tribun terbuka menghadap rangkaian tikungan cepat dan zona pengereman teknikal.',
  },
  {
    type: 'GENERAL_ADMISSION',
    tabLabel: 'General Admission',
    tag: 'Festival',
    headerTitle: 'General Admission (Festival)',
    headerSubtitle:
      'Area perbukitan alami tanpa nomor kursi tetap dengan keleluasaan memantau lintasan.',
  },
  {
    type: 'VIP_HOSPITALITY',
    tabLabel: 'VIP Hospitality',
    tag: 'VIP Suite',
    headerTitle: 'VIP Hospitality Suites (Khusus 3-Day Pass)',
    headerSubtitle:
      'Suite ber-AC di Pit Building dengan akses Pit Walk, Paddock, dan santapan eksklusif (tidak dijual tiket harian).',
  },
];

type PassFilterValue = 'all' | PassType;

interface PassTabConfig {
  id: PassFilterValue;
  label: string;
  sub: string;
}

const PASS_FILTER_TABS: PassTabConfig[] = [
  {
    id: '3day',
    label: 'Weekend Pass (3 Hari)',
    sub: 'Jum–Min (11 Tribun)',
  },
  {
    id: 'sunday',
    label: 'Tiket Harian — Minggu',
    sub: 'Race Day (10 Tribun)',
  },
  {
    id: 'saturday',
    label: 'Tiket Harian — Sabtu',
    sub: 'Sprint & Quali (10 Tribun)',
  },
  {
    id: 'friday',
    label: 'Tiket Harian — Jumat',
    sub: 'Practice (10 Tribun)',
  },
  {
    id: 'all',
    label: 'Semua Kategori',
    sub: 'Lihat Semua Opsi',
  },
];

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  zones,
  onSelectZone,
  isLoading,
  initialPassType = '3day',
}) => {
  const [selectedPass, setSelectedPass] = useState<PassFilterValue>(initialPassType);
  const [activeTab, setActiveTab] = useState<CategoryTab>('ALL');

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getCleanZoneName = (name: string) => {
    return name
      .replace('Premium Grandstand - ', '')
      .replace('Regular Grandstand - ', '');
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center bg-[#0a0a0c]">
        <div className="inline-block w-6 h-6 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-zinc-500 text-xs">Memuat data zona sirkuit...</p>
      </div>
    );
  }

  // Filter zones by pass type first
  const passFilteredZones =
    selectedPass === 'all'
      ? zones
      : getZonesByPass(zones, selectedPass as PassType);

  // Determine effective pass for pricing (if 'all', default to '3day' price view)
  const effectivePass: PassType = selectedPass === 'all' ? '3day' : (selectedPass as PassType);

  const displayedCategories =
    activeTab === 'ALL'
      ? CATEGORY_METAS
      : CATEGORY_METAS.filter((c) => c.type === activeTab);

  const isDailySelected =
    selectedPass === 'sunday' || selectedPass === 'saturday' || selectedPass === 'friday';

  return (
    <section id="circuit-zones" className="py-16 bg-[#0a0a0c] border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Section Heading */}
        <div className="mb-8">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">
            Peta & Pemilihan Kursi
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-racing uppercase">
            Pilih Zona Sirkuit Mandalika
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Ganti kategori 3-Day Pass atau Tiket Harian untuk langsung melihat tribun mana saja yang tersedia sesuai durasi menonton Anda.
          </p>
        </div>

        {/* Interactive Circuit Layout Map */}
        <CircuitMap zones={zones} onSelectZone={(z) => onSelectZone(z, effectivePass)} />

        {/* 1. DURATION FILTER TABS (3-Day vs Per Hari) */}
        <div className="mt-10 mb-6 bg-[#111216] border border-white/10 rounded-xl p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/[0.06]">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#E10600]" />
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                Kategori Tiket & Durasi:
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">
              {selectedPass === '3day' && (
                <>✓ Menampilkan <strong>11 tribun & VIP Suite</strong> untuk paket terusan 3 Hari.</>
              )}
              {selectedPass === 'sunday' && (
                <>✓ Menampilkan <strong>10 tribun</strong> untuk Balapan Minggu (VIP hanya 3-Day Pass).</>
              )}
              {selectedPass === 'saturday' && (
                <>✓ Menampilkan <strong>10 tribun</strong> untuk Kualifikasi & Sprint Sabtu.</>
              )}
              {selectedPass === 'friday' && (
                <>✓ Menampilkan <strong>10 tribun</strong> untuk Sesi Latihan Jumat.</>
              )}
              {selectedPass === 'all' && (
                <>Menampilkan seluruh <strong>11 zona</strong> sirkuit dengan opsi 3-Day & Harian.</>
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {PASS_FILTER_TABS.map((tab) => {
              const isActive = selectedPass === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedPass(tab.id)}
                  className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-[#181920] text-zinc-300 border-white/[0.08] hover:border-white/25 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold leading-tight block">
                      {tab.label}
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </div>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      isActive ? 'text-zinc-600' : 'text-zinc-500'
                    }`}
                  >
                    {tab.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Daily Pass VIP Availability Notice */}
          {isDailySelected && (
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center space-x-2 text-[11px] text-zinc-400">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Catatan resmi: <strong>VIP Hospitality (Premiere & Deluxe Class)</strong> hanya tersedia dalam paket <strong>3-Day Pass</strong> dan tidak dijual harian.
              </span>
            </div>
          )}
        </div>

        {/* 2. CATEGORY FILTER TABS (Grandstand, GA, VIP) */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.07]">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-white text-black'
                : 'bg-[#111216] text-zinc-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            Semua Tribun ({passFilteredZones.length})
          </button>

          {CATEGORY_METAS.map((meta) => {
            const isTabActive = activeTab === meta.type;
            const count = passFilteredZones.filter((z) => {
              if (meta.type === 'PREMIUM_GRANDSTAND') {
                return z.category === 'PREMIUM_GRANDSTAND' || z.name.toLowerCase().includes('premium');
              }
              if (meta.type === 'REGULAR_GRANDSTAND') {
                return z.category === 'REGULAR_GRANDSTAND' || z.name.toLowerCase().includes('regular');
              }
              if (meta.type === 'GENERAL_ADMISSION') {
                return (
                  z.category === 'GENERAL_ADMISSION' ||
                  z.name.toLowerCase().includes('general admission')
                );
              }
              return z.category === 'VIP_HOSPITALITY' || z.name.toLowerCase().includes('vip');
            }).length;

            const isVipAndDaily = meta.type === 'VIP_HOSPITALITY' && isDailySelected;

            return (
              <button
                key={meta.type}
                type="button"
                onClick={() => setActiveTab(meta.type)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  isTabActive
                    ? 'bg-white text-black'
                    : isVipAndDaily
                    ? 'bg-[#111216]/50 text-zinc-600 border border-white/[0.04]'
                    : 'bg-[#111216] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span>{meta.tabLabel}</span>
                <span className={isTabActive ? 'text-zinc-600' : 'text-zinc-500'}>
                  ({count})
                </span>
                {isVipAndDaily && (
                  <span className="text-[10px] text-amber-500/70 font-normal">
                    (Khusus 3-Day)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. CATEGORIZED ZONE GRIDS */}
        <div className="space-y-12">
          {displayedCategories.map((meta) => {
            const catZones = passFilteredZones.filter((z) => {
              if (meta.type === 'PREMIUM_GRANDSTAND') {
                return z.category === 'PREMIUM_GRANDSTAND' || z.name.toLowerCase().includes('premium');
              }
              if (meta.type === 'REGULAR_GRANDSTAND') {
                return z.category === 'REGULAR_GRANDSTAND' || z.name.toLowerCase().includes('regular');
              }
              if (meta.type === 'GENERAL_ADMISSION') {
                return (
                  z.category === 'GENERAL_ADMISSION' ||
                  z.name.toLowerCase().includes('general admission')
                );
              }
              return z.category === 'VIP_HOSPITALITY' || z.name.toLowerCase().includes('vip');
            });

            // If user filtered to daily pass, VIP has 0 matching zones in passFilteredZones
            if (catZones.length === 0) {
              if (meta.type === 'VIP_HOSPITALITY' && isDailySelected && activeTab === 'VIP_HOSPITALITY') {
                return (
                  <div key={meta.type} className="rounded-xl bg-[#111216] border border-white/10 p-6 text-center space-y-3">
                    <p className="text-sm font-semibold text-white">
                      VIP Hospitality Tidak Dijual Sebagai Tiket Harian
                    </p>
                    <p className="text-xs text-zinc-400 max-w-lg mx-auto">
                      Sesuai regulasi resmi MGPA & Dorna Sports, akses Premiere Class dan Deluxe Class hanya dapat dibeli dalam paket Weekend Pass 3 Hari.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedPass('3day')}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                      <span>Lihat Paket 3-Day Pass VIP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              }
              return null;
            }

            return (
              <div key={meta.type} className="space-y-4">
                {/* Typographic Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {meta.headerTitle}
                    </h3>
                    <span className="text-xs text-zinc-500 font-normal">
                      ({catZones.length} tribun)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{meta.headerSubtitle}</p>
                </div>

                {/* Minimalist Zone Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catZones.map((zone) => {
                    const cleanName = getCleanZoneName(zone.name);
                    const currentPrice = getZonePriceByPass(zone, effectivePass);
                    const isVip = zone.category === 'VIP_HOSPITALITY';

                    return (
                      <div
                        key={zone.id}
                        onClick={() => onSelectZone(zone, effectivePass)}
                        className="rounded-xl bg-[#111216] border border-white/[0.08] hover:border-white/25 p-5 flex flex-col justify-between transition-colors cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-3">
                            <span className="font-medium text-zinc-400">{meta.tag}</span>
                            <div className="flex items-center space-x-2">
                              {zone.isDailyAvailable !== false && !isVip ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                  3-Day & Harian
                                </span>
                              ) : (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                                  Khusus 3-Day
                                </span>
                              )}
                              <span>{zone.capacity.toLocaleString('id-ID')} kursi</span>
                            </div>
                          </div>

                          <h4 className="text-base font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                            {cleanName}
                          </h4>

                          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                            {zone.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-zinc-400 font-medium block">
                              {getPassBadge(effectivePass)}
                            </span>
                            <span className="text-lg font-bold text-white">
                              {formatPrice(currentPrice)}
                            </span>
                            {/* Comparison helper */}
                            {selectedPass === '3day' && zone.dailyPriceSunday && (
                              <span className="text-[10px] text-zinc-500 block mt-0.5">
                                Harian Minggu: {formatPrice(zone.dailyPriceSunday)}
                              </span>
                            )}
                            {isDailySelected && zone.price && (
                              <span className="text-[10px] text-zinc-500 block mt-0.5">
                                Terusan 3 Hari: {formatPrice(zone.price)}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectZone(zone, effectivePass);
                            }}
                            className="px-3.5 py-2 rounded-lg bg-[#181920] group-hover:bg-[#E10600] text-zinc-200 group-hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <span>Pilih</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiet Official Reference Footer */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-500">
          <span>
            Spesifikasi zona tribun dan tiket harian mengacu pada tata letak resmi ITDC & MGPA Pertamina Mandalika International Circuit.
          </span>
          <a
            href="https://themandalikagp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white inline-flex items-center space-x-1 transition-colors shrink-0"
          >
            <span>themandalikagp.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
