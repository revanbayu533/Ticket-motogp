import React, { useState, useMemo } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { PassType } from '../types';
import {
  MANDALIKA_OFFICIAL_ZONES,
  getZonePriceByPass,
  getZonesByPass,
} from '../data/mandalikaZones';

interface HeroProps {
  onSelectZoneCta: (zoneId?: string, passType?: PassType) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectZoneCta }) => {
  const [selectedPass, setSelectedPass] = useState<PassType | 'official-external'>('3day');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-prem-a');

  // Filter available zones immediately based on selected pass type
  const availableZones = useMemo(() => {
    if (selectedPass === 'official-external') {
      return MANDALIKA_OFFICIAL_ZONES;
    }
    return getZonesByPass(MANDALIKA_OFFICIAL_ZONES, selectedPass);
  }, [selectedPass]);

  // Handle pass category change: filter zones immediately and sync selected zone
  const handlePassChange = (val: string) => {
    if (val === 'official-external') {
      setSelectedPass('official-external');
      return;
    }
    const newPass = val as PassType;
    setSelectedPass(newPass);

    const validZones = getZonesByPass(MANDALIKA_OFFICIAL_ZONES, newPass);
    // If currently selected zone is not in valid list (e.g. VIP when switching to daily pass)
    const stillValid = validZones.some((z) => z.id === selectedZoneId);
    if (!stillValid && validZones.length > 0) {
      setSelectedZoneId(validZones[0].id);
    }
  };

  const handleSearchTickets = () => {
    if (selectedPass === 'official-external') {
      window.open('https://themandalikagp.com', '_blank', 'noopener,noreferrer');
      return;
    }
    onSelectZoneCta(selectedZoneId, selectedPass);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const passLabelText =
    selectedPass === '3day'
      ? '3 Hari'
      : selectedPass === 'sunday'
      ? 'Minggu'
      : selectedPass === 'saturday'
      ? 'Sabtu'
      : selectedPass === 'friday'
      ? 'Jumat'
      : 'VIP 3-Day';

  return (
    <section className="relative overflow-hidden bg-[#0a0a0c] border-b border-white/[0.07]">
      {/* Subtle Background Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/motogp-track-action.jpg"
          alt="MotoGP Mandalika"
          className="w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/85 to-[#0a0a0c]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#0a0a0c]/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-20">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
            25–27 September 2026 • Sirkuit Internasional Mandalika, Lombok
          </p>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.05] font-racing uppercase">
            Pertamina Grand Prix <br />
            <span className="text-[#E10600]">of Indonesia 2026</span>
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            Pilih paket 3-Day Pass atau Tiket Harian resmi untuk melihat tribun yang tersedia sesuai kebutuhan menonton Anda.
          </p>
        </div>

        {/* Interactive Ticket Finder Bar */}
        <div className="mt-10 max-w-4xl">
          <div className="rounded-xl bg-[#111216]/95 backdrop-blur-md border border-white/10 p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Dropdown 1: Kategori & Durasi Tiket */}
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">
                  1. Pilih Kategori / Durasi
                </label>
                <select
                  value={selectedPass}
                  onChange={(e) => handlePassChange(e.target.value)}
                  className="w-full bg-[#181920] border border-white/10 text-white text-xs font-medium rounded-lg px-3 py-2.5 focus:outline-hidden focus:border-white/30 cursor-pointer"
                >
                  <optgroup label="Paket Terusan 3 Hari (Weekend Pass)" className="bg-[#111216] text-zinc-400">
                    <option value="3day" className="text-white bg-[#181920]">
                      Weekend Pass (3 Hari: Jum–Min)
                    </option>
                  </optgroup>
                  <optgroup label="Tiket Harian Resmi (Daily Pass)" className="bg-[#111216] text-zinc-400">
                    <option value="sunday" className="text-white bg-[#181920]">
                      Tiket Harian — Minggu (Race Day)
                    </option>
                    <option value="saturday" className="text-white bg-[#181920]">
                      Tiket Harian — Sabtu (Sprint & Quali)
                    </option>
                    <option value="friday" className="text-white bg-[#181920]">
                      Tiket Harian — Jumat (Practice)
                    </option>
                  </optgroup>
                  <optgroup label="VIP Hospitality Eksklusif" className="bg-[#111216] text-zinc-400">
                    <option value="vip" className="text-white bg-[#181920]">
                      VIP Hospitality (3-Day Royal Box Suite)
                    </option>
                  </optgroup>
                  <optgroup label="Website Resmi Mandalika" className="bg-[#111216] text-zinc-400">
                    <option value="official-external" className="text-white bg-[#181920]">
                      🌐 Beli Langsung di themandalikagp.com
                    </option>
                  </optgroup>
                </select>
              </div>

              {/* Dropdown 2: Zona Tribun yang Otomatis Terfilter */}
              <div className="sm:col-span-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium text-zinc-400">
                    2. Tribun Tersedia
                  </label>
                  <span className="text-[10px] text-zinc-500">
                    {availableZones.length} tribun
                  </span>
                </div>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full bg-[#181920] border border-white/10 text-white text-xs font-medium rounded-lg px-3 py-2.5 focus:outline-hidden focus:border-white/30 cursor-pointer truncate"
                >
                  {/* Grouped by category within available zones */}
                  {['PREMIUM_GRANDSTAND', 'REGULAR_GRANDSTAND', 'GENERAL_ADMISSION', 'VIP_HOSPITALITY'].map((cat) => {
                    const groupZones = availableZones.filter((z) => z.category === cat);
                    if (groupZones.length === 0) return null;

                    const catLabel =
                      cat === 'PREMIUM_GRANDSTAND'
                        ? 'Premium Grandstand (Beratap)'
                        : cat === 'REGULAR_GRANDSTAND'
                        ? 'Regular Grandstand (Terbuka)'
                        : cat === 'GENERAL_ADMISSION'
                        ? 'General Admission (Festival)'
                        : 'VIP Hospitality (Royal Box)';

                    return (
                      <optgroup key={cat} label={catLabel} className="bg-[#111216] text-zinc-400">
                        {groupZones.map((z) => {
                          const currentPass = selectedPass === 'official-external' ? '3day' : selectedPass;
                          const price = getZonePriceByPass(z, currentPass);
                          return (
                            <option key={z.id} value={z.id} className="text-white bg-[#181920]">
                              {z.name} — {formatPrice(price)} ({passLabelText})
                            </option>
                          );
                        })}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              {/* Action Button */}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleSearchTickets}
                  className="w-full bg-[#E10600] hover:bg-[#c70500] text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {selectedPass === 'official-external' ? 'Buka Web' : 'Pilih'}
                  </span>
                  {selectedPass === 'official-external' ? (
                    <ExternalLink className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Availability Helper Notice */}
            <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
              <span className="truncate">
                {selectedPass === '3day' && (
                  <>Menampilkan seluruh <strong>11 tribun & VIP Suite</strong> untuk paket terusan 3 Hari.</>
                )}
                {selectedPass === 'sunday' && (
                  <>Menampilkan <strong>10 tribun</strong> untuk balapan Minggu (VIP hanya tersedia 3-Day Pass).</>
                )}
                {selectedPass === 'saturday' && (
                  <>Menampilkan <strong>10 tribun</strong> untuk Kualifikasi & Sprint Sabtu.</>
                )}
                {selectedPass === 'friday' && (
                  <>Menampilkan <strong>10 tribun</strong> untuk sesi Practice Jumat.</>
                )}
                {selectedPass === 'vip' && (
                  <>Menampilkan <strong>2 VIP Suite</strong> ber-AC lantai 1 & 2 Pit Building (Khusus 3-Day Pass).</>
                )}
                {selectedPass === 'official-external' && (
                  <>Membuka laman penjualan langsung portal resmi themandalikagp.com.</>
                )}
              </span>
            </div>
          </div>

          {/* Subtle Official Portal Links */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 px-1">
            <span>Kategori tiket resmi mengacu pada standar MGPA & Dorna Sports.</span>
            <div className="flex items-center space-x-4">
              <a
                href="https://themandalikagp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white inline-flex items-center space-x-1 transition-colors"
              >
                <span>themandalikagp.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://tickets.motogp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white inline-flex items-center space-x-1 transition-colors"
              >
                <span>tickets.motogp.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
