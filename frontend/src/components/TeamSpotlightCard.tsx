import React from 'react';
import { Shield, MapPin, User, Cpu, Sparkles, X, Ticket, ChevronRight } from 'lucide-react';
import { getTeamDetail } from '../data/teamsData';

interface TeamSpotlightCardProps {
  teamName: string;
  category: 'MotoGP' | 'Moto2' | 'Moto3';
  constructorName?: string;
  season?: '2026' | '2027';
  onClearTeam?: () => void;
  onSelectZoneCta?: () => void;
}

export const TeamSpotlightCard: React.FC<TeamSpotlightCardProps> = ({
  teamName,
  category,
  constructorName,
  season = '2026',
  onClearTeam,
  onSelectZoneCta,
}) => {
  const team = getTeamDetail(teamName, category, constructorName, season);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#2e344a] bg-gradient-to-b from-[#191c28] via-[#12141d] to-[#0c0e14] shadow-2xl p-5 sm:p-6 mb-8 transition-all animate-fadeIn">
      {/* Background Ambient Glow */}
      <div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: team.color || '#E10600' }}
      />
      <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: team.color || '#E10600' }} />

      {/* Top Bar: Team Category, Type & Close Button */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="px-2.5 py-0.5 rounded-md text-[11px] font-black tracking-wider uppercase text-white shadow-xs"
            style={{ backgroundColor: team.color || '#E10600' }}
          >
            {category}™
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-white/10 text-gray-200 border border-white/10">
            {team.type}
          </span>
          <span className="text-xs text-gray-400 hidden sm:inline">• Profil & Keterangan Tim Resmi</span>
        </div>

        {onClearTeam && (
          <button
            onClick={onClearTeam}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            title="Tampilkan Semua Tim"
          >
            <span>Tutup Keterangan</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Team Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Team Identity & Core Description */}
        <div className="lg:col-span-7 space-y-3.5">
          <div>
            <div className="text-[11px] font-black tracking-widest text-[#E10600] uppercase">
              Official Team Profile
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-racing mt-0.5">
              {team.name}
            </h3>
          </div>

          {/* Detailed Team Description */}
          <p className="text-xs sm:text-[13px] text-gray-300 font-medium leading-relaxed bg-[#141724]/60 p-3.5 rounded-xl border border-white/5">
            {team.description}
          </p>

          {/* Mandalika Viewing Spot Recommendation */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/30 via-[#181a26] to-transparent border border-red-500/20 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-extrabold text-red-400 uppercase tracking-wide">
                Spot Tribun Favorit di Sirkuit Mandalika
              </div>
              <p className="text-xs text-gray-200 font-medium mt-0.5">{team.mandalikaSpot}</p>
            </div>
          </div>
        </div>

        {/* Right: Technical Specs & Operational Dossier */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {/* Motor / Bike Model */}
          <div className="p-3 rounded-xl bg-[#151724] border border-[#272c3d] flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/5 text-gray-300 shrink-0">
              <Shield className="w-4 h-4" style={{ color: team.color }} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-gray-400">Motor & Sasis</div>
              <div className="text-xs sm:text-sm font-black text-white truncate">{team.bike}</div>
            </div>
          </div>

          {/* Engine Spec */}
          <div className="p-3 rounded-xl bg-[#151724] border border-[#272c3d] flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/5 text-amber-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-gray-400">Konfigurasi Mesin</div>
              <div className="text-xs sm:text-sm font-black text-white truncate">{team.engine}</div>
            </div>
          </div>

          {/* Headquarters (Base) */}
          <div className="p-3 rounded-xl bg-[#151724] border border-[#272c3d] flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/5 text-cyan-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-gray-400">Markas Tim (HQ)</div>
              <div className="text-xs sm:text-sm font-bold text-gray-200 truncate">{team.base}</div>
            </div>
          </div>

          {/* Team Principal */}
          <div className="p-3 rounded-xl bg-[#151724] border border-[#272c3d] flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/5 text-emerald-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-gray-400">Manajer / Principal</div>
              <div className="text-xs sm:text-sm font-bold text-gray-200 truncate">{team.principal}</div>
            </div>
          </div>

          {/* Action CTA to Grandstand Booking */}
          {onSelectZoneCta && (
            <button
              onClick={onSelectZoneCta}
              className="mt-1 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E10600] to-[#b30000] hover:from-[#ff1a14] hover:to-[#cc0000] text-white text-xs font-bold shadow-lg shadow-red-950/40 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Pesan Tiket Menonton Tim Ini</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
