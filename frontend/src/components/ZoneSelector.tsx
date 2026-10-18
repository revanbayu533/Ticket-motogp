import React from 'react';
import { Zone } from '../types';
import { Check, Star, Users, Ticket, ArrowRight } from 'lucide-react';

interface ZoneSelectorProps {
  zones: Zone[];
  onSelectZone: (zone: Zone) => void;
  isLoading: boolean;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({ zones, onSelectZone, isLoading }) => {
  const formatPrice = (price: number | string) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getBadgeColor = (name: string) => {
    if (name.includes('VIP')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (name.includes('Premiere')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (name.includes('Standard')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  const getPerks = (name: string): string[] => {
    if (name.includes('VIP')) {
      return [
        'Akses eksklusif VIP Suite ber-AC di atas Pit Lane',
        'Official Pit Walk & Paddock Tour pass',
        'Gourmet lunch buffet & premium open bar',
        'Live commentary screen & official souvenir pack',
      ];
    }
    if (name.includes('Premiere')) {
      return [
        'Kursi bernomor di tribun beratap start/finish line',
        'Pemandangan langsung ke grid & podium seremoni',
        'Layar Giant Screen HD di hadapan tribun',
        'Akses ke zona F&B dan merchandise festival',
      ];
    }
    if (name.includes('Zone C')) {
      return [
        'Pemandangan dramatis titik pengereman Tikungan 1',
        'Spot utama aksi overtake pembuka lap',
        'Layar monitor sirkuit terdekat',
        'Akses mudah ke area musholla dan fasilitas umum',
      ];
    }
    if (name.includes('Zone J')) {
      return [
        'Pemandangan aksi keluar tikungan terakhir (T16)',
        'Sensasi akselerasi maksimum motor 1000cc',
        'Layar monitor sirkuit dan booth merchandise',
        'Akses stan kuliner lokal khas Lombok',
      ];
    }
    return [
      'Akses bebas ke bukit alami pemandangan pantai Mandalika',
      'Area berdiri dan duduk santai fleksibel',
      'Giant screen festival & sound system sirkuit',
      'Akses ke festival konser musik MotoGP pasca balapan',
    ];
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#E10600] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Memuat data zona & harga resmi...</p>
      </div>
    );
  }

  return (
    <section id="circuit-zones" className="py-20 bg-[#0c0d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Ticket className="w-3.5 h-3.5" />
            <span>Kategori Tiket & Zona Resmi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-racing">
            PILIH ZONA SIRKUIT MANDALIKA
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Tersedia berbagai pilihan tribun dengan sudut pandang unik lintasan balap, fasilitas
            berstandar internasional FIM, serta jaminan keaslian tiket.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {zones.map((zone) => {
            const isVip = zone.name.includes('VIP');
            const perks = getPerks(zone.name);

            return (
              <div
                key={zone.id}
                className={`relative rounded-2xl flex flex-col justify-between p-6 transition-all duration-300 border ${
                  isVip
                    ? 'bg-gradient-to-b from-[#1b1916] to-[#121319] border-amber-500/40 shadow-xl shadow-amber-950/20 hover:border-amber-400'
                    : 'bg-[#13151f] border-[#222533] hover:border-[#E10600]/50 hover:shadow-xl hover:shadow-red-950/20'
                }`}
              >
                {isVip && (
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
                    <Star className="w-3 h-3 fill-black" />
                    <span>Hospitality Premier</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getBadgeColor(zone.name)}`}
                    >
                      {zone.name.split(' ')[0]}
                    </span>
                    <div className="flex items-center text-xs text-gray-400 space-x-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Kapasitas: {zone.capacity.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">{zone.name}</h3>

                  <p className="text-xs text-gray-400 mb-6 line-clamp-2">
                    {zone.description || 'Pengalaman menonton seru di Sirkuit Mandalika.'}
                  </p>

                  <div className="bg-[#0c0d12]/60 rounded-xl p-4 mb-6 border border-[#1e202c]">
                    <div className="text-xs text-gray-400 mb-1">Harga Tiket Terusan 3 Hari</div>
                    <div className="text-2xl font-black text-white flex items-baseline space-x-1">
                      <span className="text-[#00F0FF]">{formatPrice(zone.price)}</span>
                      <span className="text-xs text-gray-400 font-normal">/ pax</span>
                    </div>
                  </div>

                  {/* Perks Checklist */}
                  <div className="space-y-2.5 mb-8">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Fasilitas Termasuk:
                    </div>
                    {perks.map((perk, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-gray-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectZone(zone)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isVip
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-lg shadow-amber-900/30'
                      : 'bg-gradient-to-r from-[#E10600] to-[#ad0500] hover:from-[#f00700] hover:to-[#bd0500] text-white shadow-lg shadow-red-900/30'
                  }`}
                >
                  <span>Pesan Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
