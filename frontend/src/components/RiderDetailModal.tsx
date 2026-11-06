import React, { useEffect } from 'react';
import { X, Trophy, Flag, Shield, Calendar, MapPin, Ticket, ExternalLink, Sparkles, User, Cpu, HelpCircle } from 'lucide-react';
import { Rider } from '../data/ridersData';
import { getTeamDetail } from '../data/teamsData';

interface RiderDetailModalProps {
  rider: Rider | null;
  isOpen: boolean;
  onClose: () => void;
  season?: '2026' | '2027';
  onSelectBookingForRider?: (rider: Rider) => void;
}

export const RiderDetailModal: React.FC<RiderDetailModalProps> = ({
  rider,
  isOpen,
  onClose,
  season = '2026',
  onSelectBookingForRider,
}) => {
  // 1. Lock document body scroll when modal is open so the background cannot scroll
  useEffect(() => {
    if (isOpen && rider) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen, rider]);

  // 2. Close on Escape key press
  useEffect(() => {
    if (!isOpen || !rider) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, rider, onClose]);

  if (!isOpen || !rider) return null;

  const getTeamZoneSuggestion = (teamName: string, category: string) => {
    const t = teamName.toLowerCase();
    if (t.includes('vr46') || t.includes('pertamina')) {
      return {
        zoneName: 'Grandstand J - VR46 Fan Zone',
        reason: 'Tribun resmi Pertamina Enduro VR46 Racing Team di Tikungan 15 & 16',
      };
    }
    if (t.includes('ducati') || t.includes('lenovo')) {
      return {
        zoneName: 'Grandstand A - Main Straight',
        reason: 'Tepat menghadap garasi pit Ducati Lenovo Team & garis start/finish',
      };
    }
    if (t.includes('yamaha') || t.includes('pramac')) {
      return {
        zoneName: 'Grandstand B - Turn 1 Exit',
        reason: 'Sudut terbaik melihat akselerasi agresif Monster Yamaha & Pramac',
      };
    }
    if (t.includes('ktm') || t.includes('tech3')) {
      return {
        zoneName: 'Grandstand C - Turn 3 Chicane',
        reason: 'Titik overtaking manuver tajam Red Bull KTM di tikungan beruntun',
      };
    }
    if (t.includes('honda') || t.includes('lcr') || t.includes('castrol')) {
      return {
        zoneName: 'Grandstand K - Final Corner',
        reason: 'Melihat aksi last-lap slipstream & selebrasi kemenangan Honda',
      };
    }
    if (t.includes('gresini')) {
      return {
        zoneName: 'Grandstand I - Gresini Racing Zone',
        reason: 'Area tribun favorit suporter Gresini Racing dengan view laut Mandalika',
      };
    }
    return {
      zoneName: 'Grandstand A - Main Straight',
      reason: `Spot paling prestisius menyaksikan aksi ${category} langsung dari depan Pit Box`,
    };
  };

  const suggestion = getTeamZoneSuggestion(rider.team, rider.category);
  const teamInfo = getTeamDetail(rider.team, rider.category, rider.constructor, season);
  const isTba = Boolean(rider.isTba);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-hidden overscroll-none animate-fadeIn"
    >
      {/* Modal Container: Spacious broadcast width (max-w-5xl) so rider photo stands out prominently */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#181a24] via-[#12141c] to-[#0c0d12] border border-[#2b3044] rounded-3xl shadow-2xl overflow-hidden overscroll-contain animate-scaleIn"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#1e2230]/90 hover:bg-[#E10600] text-gray-300 hover:text-white transition-all border border-white/10 shadow-lg cursor-pointer"
          title="Tutup (Esc)"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Body (Hanya bagian profil ini yang bisa digulir) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8 space-y-6">
          {/* Top Category & Number Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E10600] text-white text-xs font-black tracking-widest uppercase">
                {rider.category}™
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1f2333] border border-white/10 text-gray-300 text-xs font-bold uppercase">
                {season === '2027'
                  ? (rider.category === 'MotoGP' ? 'Musim 2027 (Era 850cc)' : `Musim Balap 2027 (${rider.category}™)`)
                  : 'Musim Reguler 2026'}
              </span>
              {isTba && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase flex items-center space-x-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>Kursi TBA</span>
                </span>
              )}
            </div>

            {/* Official Race Number Box */}
            <div className="flex items-center space-x-2 mr-10 sm:mr-12">
              <span className="text-xs uppercase font-bold text-gray-400 hidden sm:inline">
                {isTba ? 'Status Slot:' : 'Nomor Balap:'}
              </span>
              <div
                className={`w-10 h-10 rounded-xl font-black flex items-center justify-center shadow-lg font-racing ${
                  isTba
                    ? 'bg-amber-400 text-black border border-amber-300 text-2xl shadow-amber-950/50'
                    : 'bg-white text-black text-xl'
                }`}
              >
                {isTba ? '?' : rider.number}
              </div>
            </div>
          </div>

          {/* Main Rider Visual and Identity: Heroic 2-Column Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* HEROIC RIDER PORTRAIT (Kiri): Foto Besar, Gagah, dan Dominan */}
            <div className="md:col-span-5 relative flex flex-col justify-end items-center bg-gradient-to-b from-[#161824] via-[#10121a] to-[#0a0b10] rounded-2xl p-4 sm:p-5 border border-white/10 overflow-hidden min-h-[360px] sm:min-h-[460px] md:min-h-[520px]">
              {/* Giant Number Watermark Behind Rider */}
              <div className="absolute top-2 left-4 text-8xl sm:text-9xl font-black text-white/[0.04] font-racing select-none pointer-events-none leading-none">
                {isTba ? '?' : rider.number}
              </div>

              {/* Team Color Radial Aura */}
              <div
                className="absolute -top-10 -right-10 w-56 h-56 rounded-full blur-3xl opacity-25 pointer-events-none"
                style={{ backgroundColor: rider.teamColor || '#E10600' }}
              />

              {/* Prominent Large Rider Photo */}
              <div className="relative z-10 w-full flex-1 flex items-end justify-center">
                <img
                  src={rider.picture}
                  alt={rider.name}
                  className={`w-auto h-full max-h-[320px] sm:max-h-[420px] md:max-h-[460px] ${
                    isTba ? 'object-contain scale-95 opacity-90' : 'object-contain'
                  } object-bottom drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-105`}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://photos.motogp.com/riders/a/7/a7b4d63f-45b3-402e-b66c-001ed8a62934/2026/profile/main-938861.png';
                  }}
                />
              </div>

              {/* Pedestal Bottom Identity Strip */}
              <div className="relative z-20 w-full mt-3 p-3 rounded-xl bg-[#141620]/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">Nomor Start</span>
                  <span className="font-black text-white text-base font-racing">#{rider.number}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">Konstruktor</span>
                  <span className="font-bold text-white text-xs">{rider.constructor || rider.team.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* RIDER INFORMATION & TECHNICAL DOSSIER (Kanan) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                {isTba ? (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">❓</span>
                    <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                      BELUM DIUMUMKAN (TBA)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mb-1">
                    {rider.flagUrl ? (
                      <img
                        src={rider.flagUrl}
                        alt={rider.country}
                        className="w-5 h-3.5 object-cover rounded-xs border border-white/30"
                      />
                    ) : (
                      <Flag className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-xs font-black tracking-widest text-gray-300 uppercase">
                      {rider.country}
                    </span>
                  </div>
                )}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight font-racing">
                  {isTba ? 'KURSI BELUM DIUMUMKAN' : rider.name}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: rider.teamColor || '#E10600' }}
                  />
                  <p className="text-xs sm:text-sm font-bold text-gray-200 tracking-wider uppercase font-racing">
                    {rider.team}
                  </p>
                </div>
              </div>

              {/* TBA Announcement Notice Banner */}
              {isTba ? (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/35 flex items-start space-x-3 shadow-md">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 border border-amber-400/30">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center space-x-1.5">
                      <span>Kursi Belum Resmi Diumumkan</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-[9px] font-bold text-amber-200">
                        TBA 2027
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      Line-up pembalap untuk tim <strong className="text-white font-bold">{rider.team}</strong> pada kategori <strong className="text-white font-bold">{rider.category}™</strong> musim 2027 belum dirilis secara resmi oleh FIM dan pihak tim. Pembalap resmi akan segera diperbarui begitu kontrak diumumkan!
                    </p>
                  </div>
                </div>
              ) : rider.worldChampion ? (
                /* World Champion Honor Banner */
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-600/10 to-transparent border border-amber-500/40 flex items-center space-x-3 shadow-md shadow-amber-950/20">
                  <div className="p-2 rounded-xl bg-amber-500/30 text-amber-300 shrink-0 border border-amber-400/30">
                    <Trophy className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center space-x-1.5">
                      <span>FIM World Champion</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-[9px] font-bold text-amber-200">
                        Gelar Resmi
                      </span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-black text-white font-racing tracking-wide mt-0.5 truncate">
                      {rider.championTitle || 'Juara Dunia Resmi Kejuaraan Grand Prix'}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Transfer Status & Lineup Note */}
              {rider.transferNote && (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3 shadow-xs">
                  <div className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5 border border-blue-400/20">
                    <Sparkles className="w-4 h-4 text-blue-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      Status & Catatan Lineup 2027
                    </div>
                    <div className="text-xs sm:text-[13px] font-semibold text-gray-200 mt-0.5 leading-snug">
                      {rider.transferNote}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#161824] border border-[#272b3c]">
                  <div className="text-gray-400 flex items-center space-x-1.5 mb-0.5">
                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                    <span>Konstruktor</span>
                  </div>
                  <div className="font-bold text-white text-sm">
                    {rider.constructor || rider.team.split(' ')[0]}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#161824] border border-[#272b3c]">
                  <div className="text-gray-400 flex items-center space-x-1.5 mb-0.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{isTba ? 'Status Kontrak' : 'Usia'}</span>
                  </div>
                  <div className="font-bold text-white text-sm">
                    {isTba ? 'Menunggu Rilis' : (rider.age ? `${rider.age} Tahun` : 'Rider Pro')}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#161824] border border-[#272b3c]">
                  <div className="text-gray-400 flex items-center space-x-1.5 mb-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{isTba ? 'Alokasi Kursi' : 'Kota Kelahiran'}</span>
                  </div>
                  <div className="font-bold text-white text-sm truncate">
                    {isTba ? 'Kursi Reguler 2027' : (rider.birthCity || rider.birthCountry || rider.country)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#161824] border border-[#272b3c]">
                  <div className="text-gray-400 flex items-center space-x-1.5 mb-0.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kategori Kejuaraan</span>
                  </div>
                  <div className="font-bold text-white text-sm">{rider.category}™</div>
                </div>
              </div>

              {/* Official Team Information & Dossier (Modular Clean Box Cards) */}
              <div className="p-3.5 rounded-2xl bg-[#141724] border border-[#272d40] space-y-3">
                {/* Team Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10 gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div
                      className="w-1.5 h-6 rounded-sm shrink-0"
                      style={{ backgroundColor: teamInfo.color || '#E10600' }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        Keterangan Tim Resmi
                      </div>
                      <div className="font-black text-white text-xs sm:text-sm uppercase tracking-tight font-racing">
                        {teamInfo.name}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/10 text-gray-200 shrink-0 border border-white/10">
                    {teamInfo.type}
                  </span>
                </div>

                {/* 4 Clean Modular Box Cards */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Box 1: Motor & Sasis */}
                  <div className="p-2.5 rounded-xl bg-[#171a26] border border-[#2b3147] flex flex-col justify-between">
                    <div className="flex items-center space-x-1.5 text-gray-400 text-[10px] uppercase font-bold mb-1">
                      <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Motor / Sasis</span>
                    </div>
                    <div className="font-black text-white text-xs leading-snug">
                      {teamInfo.bike}
                    </div>
                  </div>

                  {/* Box 2: Konfigurasi Mesin */}
                  <div className="p-2.5 rounded-xl bg-[#171a26] border border-[#2b3147] flex flex-col justify-between">
                    <div className="flex items-center space-x-1.5 text-gray-400 text-[10px] uppercase font-bold mb-1">
                      <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Mesin</span>
                    </div>
                    <div className="font-black text-amber-300 text-xs leading-snug">
                      {teamInfo.engine}
                    </div>
                  </div>

                  {/* Box 3: Markas Tim (HQ) */}
                  <div className="p-2.5 rounded-xl bg-[#171a26] border border-[#2b3147] flex flex-col justify-between">
                    <div className="flex items-center space-x-1.5 text-gray-400 text-[10px] uppercase font-bold mb-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Markas Tim (HQ)</span>
                    </div>
                    <div className="font-bold text-gray-200 text-xs leading-snug truncate" title={teamInfo.base}>
                      {teamInfo.base}
                    </div>
                  </div>

                  {/* Box 4: Principal / Manajer */}
                  <div className="p-2.5 rounded-xl bg-[#171a26] border border-[#2b3147] flex flex-col justify-between">
                    <div className="flex items-center space-x-1.5 text-gray-400 text-[10px] uppercase font-bold mb-1">
                      <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Principal / Manajer</span>
                    </div>
                    <div className="font-bold text-gray-200 text-xs leading-snug truncate" title={teamInfo.principal}>
                      {teamInfo.principal}
                    </div>
                  </div>
                </div>

                {/* Team Description Box */}
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    {teamInfo.description}
                  </p>
                </div>
              </div>

              {/* Mandalika Recommended Zone Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#1e1418] to-[#161824] border border-red-500/30">
                <div className="flex items-center space-x-2 text-xs font-bold text-red-400 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Rekomendasi Zona Nonton di Mandalika</span>
                </div>
                <div className="font-extrabold text-white text-sm">{suggestion.zoneName}</div>
                <div className="text-[11px] text-gray-300 mt-0.5">{suggestion.reason}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:px-8 sm:py-4 bg-[#0e1017]/95 border-t border-[#232738] backdrop-blur-md shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
          <a
            href={`https://www.motogp.com/en/riders/${rider.category.toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-xs font-semibold text-gray-400 hover:text-white flex items-center justify-center space-x-1.5 transition-colors py-1.5"
          >
            <span>Profil Resmi MotoGP.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="w-full sm:w-auto flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl border border-[#2e3447] text-gray-300 hover:text-white hover:bg-[#1a1d28] text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSelectBookingForRider) {
                  onSelectBookingForRider(rider);
                } else {
                  const el = document.getElementById('circuit-zones');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E10600] to-[#b30500] hover:from-[#ff1a14] hover:to-[#cc0600] text-white text-xs font-bold shadow-lg shadow-red-950/50 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Pesan Tiket Zona Mandalika</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
