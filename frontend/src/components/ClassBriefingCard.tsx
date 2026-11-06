import React from 'react';
import { Gauge, Users, Zap, Shield, Sparkles, Flag, Flame } from 'lucide-react';
import { ClassInfo } from '../data/ridersData';

interface ClassBriefingCardProps {
  meta: ClassInfo;
  season?: '2026' | '2027';
}

export const ClassBriefingCard: React.FC<ClassBriefingCardProps> = ({ meta, season = '2026' }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#2b3044] bg-gradient-to-b from-[#181b26] via-[#12141d] to-[#0c0d12] shadow-xl p-4 sm:p-5 transition-all">
      {/* Dynamic ambient glow tailored to class color */}
      <div
        className="absolute -top-12 left-1/4 w-72 h-32 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: meta.color }}
      />

      {/* Top Identity & Championship Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: meta.color }}
          />
          <span className="text-[11px] font-black tracking-widest uppercase text-white/90 font-racing">
            {meta.tierLabel}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-gray-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>FIM World Championship {season}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-300">Sirkuit Mandalika</span>
        </div>
      </div>

      {/* Telemetry Metrics Grid (4 Stat Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Metric 1: Grid Size */}
        <div className="p-3 rounded-xl bg-[#171a25]/90 border border-white/5 hover:border-white/15 transition-colors">
          <div className="flex items-center space-x-1.5 text-gray-400 text-[11px] font-semibold mb-1">
            <Users className="w-3.5 h-3.5" style={{ color: meta.color }} />
            <span>Grid Reguler</span>
          </div>
          <div className="text-white font-black text-lg sm:text-xl font-racing tracking-tight">
            {meta.riderCount} Pembalap
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Lineup Resmi Musim Penuh</div>
        </div>

        {/* Metric 2: Engine Displacement */}
        <div className="p-3 rounded-xl bg-[#171a25]/90 border border-white/5 hover:border-white/15 transition-colors">
          <div className="flex items-center space-x-1.5 text-gray-400 text-[11px] font-semibold mb-1">
            <Gauge className="w-3.5 h-3.5" style={{ color: meta.color }} />
            <span>Kapasitas Mesin</span>
          </div>
          <div className="text-white font-black text-lg sm:text-xl font-racing tracking-tight truncate">
            {meta.engineSpec}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5 truncate">{meta.engineType}</div>
        </div>

        {/* Metric 3: Top Speed & Power */}
        <div className="p-3 rounded-xl bg-[#171a25]/90 border border-white/5 hover:border-white/15 transition-colors">
          <div className="flex items-center space-x-1.5 text-gray-400 text-[11px] font-semibold mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Kecepatan Puncak</span>
          </div>
          <div className="text-white font-black text-lg sm:text-xl font-racing tracking-tight text-amber-400">
            {meta.topSpeed}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5 truncate">{meta.power}</div>
        </div>

        {/* Metric 4: Chassis & Format */}
        <div className="p-3 rounded-xl bg-[#171a25]/90 border border-white/5 hover:border-white/15 transition-colors">
          <div className="flex items-center space-x-1.5 text-gray-400 text-[11px] font-semibold mb-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rangka & Sasis</span>
          </div>
          <div className="text-white font-black text-sm sm:text-base font-racing tracking-tight truncate">
            {meta.chassisType}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Pengembangan Riset Tim</div>
        </div>
      </div>

      {/* Official Storyline & Season Focus Banner */}
      <div
        className="relative rounded-2xl p-3.5 sm:p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden shadow-lg"
        style={{
          backgroundColor: `${meta.color}0f`,
          borderColor: `${meta.color}40`,
        }}
      >
        {/* Ambient background glow inside the banner */}
        <div
          className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: meta.color }}
        />

        <div className="relative z-10 flex items-start sm:items-center space-x-3.5">
          <div
            className="p-2 rounded-xl shrink-0 flex items-center justify-center shadow-lg border border-white/20"
            style={{ backgroundColor: meta.color }}
          >
            {meta.category === 'MotoGP' ? (
              <Flame className="w-4 h-4 text-white" />
            ) : meta.category === 'Moto3' ? (
              <Flag className="w-4 h-4 text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span
                className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-md border shadow-xs"
                style={{
                  backgroundColor: `${meta.color}20`,
                  borderColor: `${meta.color}55`,
                  color: meta.color,
                }}
              >
                {meta.highlightLabel}
              </span>
            </div>
            {meta.highlightText.includes(': ') ? (
              <p className="text-xs sm:text-[13px] text-gray-200 font-medium leading-relaxed">
                <strong className="font-black text-white font-racing tracking-wide mr-1.5 drop-shadow-xs">
                  {meta.highlightText.split(': ')[0]}:
                </strong>
                <span className="text-gray-300">
                  {meta.highlightText.split(': ').slice(1).join(': ')}
                </span>
              </p>
            ) : (
              <p className="text-xs sm:text-[13px] text-gray-200 font-medium leading-relaxed">
                {meta.highlightText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
