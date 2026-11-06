import React, { useState } from 'react';
import {
  Trophy,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { RiderStanding, getChampionshipStandings } from '../data/standingsData';
import { Rider } from '../data/ridersData';

interface ChampionshipStandingsProps {
  seasonRiders: Rider[];
  onSelectRider: (rider: Rider) => void;
  selectedCategory?: 'MotoGP' | 'Moto2' | 'Moto3';
}

export const ChampionshipStandings: React.FC<ChampionshipStandingsProps> = ({
  seasonRiders,
  onSelectRider,
}) => {
  // Klasemen eksklusif untuk kelas utama MotoGP™
  const activeCategory = 'MotoGP';
  const [searchQuery, setSearchQuery] = useState('');
  const [showSprint, setShowSprint] = useState(false);

  const standings = getChampionshipStandings(activeCategory);
  const leader = standings[0];
  const maxPoints = leader ? leader.points : 400;

  const filteredStandings = standings.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.shortName && s.shortName.toLowerCase().includes(q)) ||
      s.team.toLowerCase().includes(q) ||
      s.constructor.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q) ||
      s.number.toString() === q
    );
  });

  const handleOpenRiderModal = (standing: RiderStanding) => {
    // 1. Match by explicit riderId if present
    let matched: Rider | undefined;
    if (standing.riderId) {
      matched = seasonRiders.find((r) => r.id === standing.riderId);
    }

    // 2. Match strictly by same category AND exact number
    if (!matched) {
      matched = seasonRiders.find(
        (r) =>
          r.category.toLowerCase() === standing.category.toLowerCase() &&
          r.number === standing.number,
      );
    }

    // 3. Match strictly by same category AND exact full name
    if (!matched) {
      matched = seasonRiders.find(
        (r) =>
          r.category.toLowerCase() === standing.category.toLowerCase() &&
          r.name.trim().toLowerCase() === standing.name.trim().toLowerCase(),
      );
    }

    // 4. Fallback match by exact full name across categories
    if (!matched) {
      matched = seasonRiders.find(
        (r) => r.name.trim().toLowerCase() === standing.name.trim().toLowerCase(),
      );
    }

    // 5. Fallback match by number in same category
    if (!matched) {
      matched = seasonRiders.find(
        (r) =>
          r.number === standing.number &&
          r.category.toLowerCase() === standing.category.toLowerCase(),
      );
    }

    if (matched) {
      onSelectRider(matched);
    } else {
      const fallback: Rider = {
        id: `standing-${standing.category}-${standing.number}`,
        name: standing.name,
        firstName: standing.name.split(' ')[0] || '',
        lastName: standing.name.split(' ').slice(1).join(' ') || standing.name,
        fullNameUpper: standing.name.toUpperCase(),
        number: standing.number,
        category: standing.category,
        team: standing.team,
        teamColor: standing.teamColor || '#E10600',
        constructor: standing.constructor,
        country: standing.country,
        countryIso: standing.countryIso,
        flagUrl: standing.flagUrl,
        picture: standing.picture || '/riders/tba_silhouette.svg',
        worldChampion: standing.position === 1,
        championTitle:
          standing.position === 1
            ? `Pimpinan Klasemen ${standing.category}™ (${standing.points} Poin)`
            : undefined,
      };
      onSelectRider(fallback);
    }
  };

  const renderBadge = (val: string, key: number) => {
    const p = val.trim();
    if (p === '1') {
      return (
        <span
          key={key}
          className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] bg-[#E10600] text-white shadow-sm ring-1 ring-[#E10600]/40"
          title="Finis P1 (Juara)"
        >
          1
        </span>
      );
    }
    if (p === '2') {
      return (
        <span
          key={key}
          className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] bg-amber-600 text-white shadow-sm ring-1 ring-amber-500/40"
          title="Finis P2 (Podium)"
        >
          2
        </span>
      );
    }
    if (p === '3') {
      return (
        <span
          key={key}
          className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] bg-amber-800 text-white shadow-sm ring-1 ring-amber-700/40"
          title="Finis P3 (Podium)"
        >
          3
        </span>
      );
    }
    if (p === '-' || p === '•' || p === 'DNF' || p === '0' || !p) {
      return (
        <span
          key={key}
          className="w-5 h-5 rounded-md flex items-center justify-center font-medium text-[10px] bg-white/[0.04] text-zinc-600 border border-white/[0.06]"
          title="Tidak Finis / Tidak Ikut"
        >
          -
        </span>
      );
    }
    return (
      <span
        key={key}
        className="w-5 h-5 rounded-md flex items-center justify-center font-medium text-[10px] bg-white/[0.08] text-zinc-300 border border-white/[0.1]"
        title={`Finis P${p}`}
      >
        {p}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header: MotoGP Identity, Search & Sprint Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121319] border border-white/[0.08]">
        {/* MotoGP Class Indicator */}
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E10600] to-[#b00500] text-white shadow-lg shadow-red-950/40">
            <span className="font-racing font-black text-sm tracking-tight">MotoGP™</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/30 text-white/95">
              Kelas Utama
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Musim 2026 • 22 Pembalap Reguler</span>
          </span>
        </div>

        {/* Right Controls: Sprint Toggle & Search */}
        <div className="flex items-center space-x-3">
          {/* Sprint Points Switch */}
          <button
            type="button"
            onClick={() => setShowSprint(!showSprint)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center space-x-2 cursor-pointer ${
              showSprint
                ? 'bg-[#E10600]/10 border-[#E10600]/40 text-[#E10600]'
                : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showSprint ? 'bg-[#E10600]' : 'bg-zinc-600'}`} />
            <span>Statistik Sprint</span>
          </button>

          {/* Search Input */}
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pembalap / tim..."
              className="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/[0.08] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
            />
          </div>
        </div>
      </div>

      {/* FEATURED LEADER SPOTLIGHT (Minimalist Racing Banner) */}
      {!searchQuery && leader && (
        <div
          onClick={() => handleOpenRiderModal(leader)}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#170505] via-[#14151d] to-[#0f1016] border border-red-500/20 p-5 sm:p-6 transition-all hover:border-red-500/40 cursor-pointer group"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-red-600/10 via-transparent to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            {/* Rider Info & Portrait */}
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex items-end justify-center shrink-0">
                <img
                  src={leader.picture || '/riders/tba_silhouette.svg'}
                  alt={leader.name}
                  className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/riders/tba_silhouette.svg';
                  }}
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-amber-400 text-black font-black text-[10px] font-racing">
                  P1
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-[10px] font-bold text-red-400 uppercase tracking-wide flex items-center space-x-1">
                    <Trophy className="w-3 h-3 text-red-400" />
                    <span>Pimpinan Klasemen MotoGP™</span>
                  </span>
                  <img
                    src={leader.flagUrl}
                    alt={leader.country}
                    className="w-4 h-2.5 object-cover rounded-xs opacity-90"
                  />
                  <span className="text-[11px] text-zinc-400">{leader.country}</span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-xl sm:text-2xl font-black text-white font-racing tracking-tight group-hover:text-red-400 transition-colors">
                    {leader.name}
                  </span>
                  <span className="text-xs font-bold text-zinc-500 font-mono">
                    #{leader.number}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                  {leader.team} • <span className="text-zinc-500">{leader.constructor}</span>
                </p>
              </div>
            </div>

            {/* Leader Stats Breakdown */}
            <div className="flex items-center space-x-6 sm:space-x-8 sm:border-l sm:border-white/[0.08] sm:pl-8">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                  {showSprint ? 'Poin Sprint' : 'Total Poin'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-racing tracking-tight">
                  {showSprint ? leader.sprintPoints ?? 94 : leader.points}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                  Kemenangan
                </span>
                <span className="text-lg sm:text-xl font-bold text-zinc-200">
                  {leader.wins} <span className="text-xs text-zinc-500 font-normal">Wins</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                  Podium
                </span>
                <span className="text-lg sm:text-xl font-bold text-zinc-200">
                  {leader.podiums} <span className="text-xs text-zinc-500 font-normal">Podiums</span>
                </span>
              </div>

              <div className="hidden lg:flex items-center text-xs font-semibold text-red-400 group-hover:translate-x-1 transition-transform">
                <span>Profil & Tiket</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODERN MINIMALIST MOTOGP STANDINGS TABLE */}
      <div className="rounded-2xl bg-[#111216] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-zinc-400 uppercase font-bold text-[10px] tracking-wider bg-black/30">
                <th className="py-3.5 px-4 text-center w-12">Pos</th>
                <th className="py-3.5 px-4">Pembalap</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Tim</th>
                <th className="py-3.5 px-4 text-right">
                  {showSprint ? 'Poin Sprint' : 'Poin'}
                </th>
                <th className="py-3.5 px-3 text-center">Gap</th>
                <th className="py-3.5 px-3 text-center hidden sm:table-cell">Rekor (W/P)</th>
                <th className="py-3.5 px-4 text-center">Form (3 Seri)</th>
                <th className="py-3.5 px-3 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredStandings.map((item) => {
                const isP1 = item.position === 1;
                const isP2 = item.position === 2;
                const isP3 = item.position === 3;
                const displayPoints = showSprint
                  ? item.sprintPoints ?? Math.round(item.points * 0.25)
                  : item.points;

                // Points percentage for subtle progress bar
                const ptsPct = Math.min(100, Math.max(10, Math.round((item.points / maxPoints) * 100)));

                return (
                  <tr
                    key={`${item.category}-${item.number}-${item.position}`}
                    onClick={() => handleOpenRiderModal(item)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    {/* Position */}
                    <td className="py-3 px-4 text-center">
                      {isP1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-400 text-black font-black font-racing text-xs shadow-md shadow-amber-500/20">
                          1
                        </span>
                      ) : isP2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-zinc-300 text-black font-black font-racing text-xs">
                          2
                        </span>
                      ) : isP3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-700 text-white font-black font-racing text-xs">
                          3
                        </span>
                      ) : (
                        <span className="font-mono text-zinc-500 font-bold text-xs group-hover:text-zinc-300">
                          {item.position}
                        </span>
                      )}
                    </td>

                    {/* Rider Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className="relative w-8 h-8 rounded-full bg-black/40 border border-white/10 overflow-hidden shrink-0">
                          <img
                            src={item.picture || '/riders/tba_silhouette.svg'}
                            alt={item.name}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.currentTarget.src = '/riders/tba_silhouette.svg';
                            }}
                          />
                        </div>

                        {/* Number Badge */}
                        <span className="w-7 text-right font-racing font-black text-xs text-zinc-400 group-hover:text-white transition-colors">
                          #{item.number}
                        </span>

                        {/* Name & Flag */}
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-white text-xs truncate group-hover:text-red-400 transition-colors">
                              {item.name}
                            </span>
                            <img
                              src={item.flagUrl}
                              alt={item.country}
                              className="w-4 h-2.5 object-cover rounded-xs opacity-90 shrink-0"
                            />
                          </div>
                          <span className="text-[11px] text-zinc-500 block md:hidden truncate">
                            {item.team}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center space-x-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.teamBorderColor || item.teamColor || '#E10600' }}
                        />
                        <span className="text-zinc-300 font-medium text-xs truncate">
                          {item.team}
                        </span>
                      </div>
                    </td>

                    {/* Points & Mini Bar */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className="text-sm font-black text-white font-racing tracking-tight">
                          {displayPoints}
                        </span>
                        {!showSprint && (
                          <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden mt-0.5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-red-600 to-amber-500"
                              style={{ width: `${ptsPct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Gap */}
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-zinc-400">
                      {isP1 ? (
                        <span className="text-emerald-400 font-semibold">LEAD</span>
                      ) : (
                        item.gap || '-'
                      )}
                    </td>

                    {/* Wins & Podiums */}
                    <td className="py-3 px-3 text-center hidden sm:table-cell font-mono text-zinc-300 text-xs">
                      <span className="font-semibold text-white">{item.wins}W</span>
                      <span className="text-zinc-600 mx-1">•</span>
                      <span className="text-zinc-400">{item.podiums}P</span>
                    </td>

                    {/* Form (Last 3 Races) */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {(item.last3 || ['-', '-', '-']).map((pos, idx) =>
                          renderBadge(pos, idx),
                        )}
                      </div>
                    </td>

                    {/* Action Arrow */}
                    <td className="py-3 px-3 text-center">
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 bg-black/40 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 px-4 gap-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>
              Klasemen resmi FIM MotoGP™ World Championship 2026 pasca GP Sepang Malaysia (Total 22 Pembalap).
            </span>
          </div>
          <a
            href="https://www.motogp.com/en/world-standing/2026/motogp/championship-standings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-zinc-400 hover:text-white transition-colors"
          >
            <span>Verifikasi di motogp.com</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
