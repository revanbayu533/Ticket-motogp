import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight,
  Search,
  LayoutGrid,
  Rows,
  Info,
  Users,
  X,
  RotateCcw,
  Shield,
  Hash,
  Sparkles,
  HelpCircle,
  Trophy,
} from 'lucide-react';
import {
  getSeasonRiders,
  getSeasonClassMetadata,
  Rider,
} from '../data/ridersData';
import { CategoryLogo } from './CategoryLogo';
import { RiderDetailModal } from './RiderDetailModal';
import { ClassBriefingCard } from './ClassBriefingCard';
import { TeamSpotlightCard } from './TeamSpotlightCard';
import { DraggableShelf } from './DraggableShelf';
import { ChampionshipStandings } from './ChampionshipStandings';
import { getTeamDetail, TeamDetail } from '../data/teamsData';

/**
 * Normalizes team names for canonical grouping (e.g. unites LCR and SpeedRS divisions)
 */
export function getCanonicalTeamName(rawTeam: string): string {
  const t = rawTeam.toLowerCase();
  if (t.includes('lcr')) return 'LCR Honda MotoGP';
  if (t.includes('speedrs') || t.includes('speed up')) return 'SpeedRS Team';
  if (t.includes('qjmotor')) return 'QJMOTOR - MSI';
  if (t.includes('klint')) return 'Klint Racing Team';
  if (t.includes('rw racing') || t.includes('idrofoglia')) return 'Momoven Idrofoglia RW Racing Team';
  if (t.includes('fantic')) return 'REDS Fantic Racing';
  if (t.includes('aspar') && (t.includes('moto3') || t.includes('gaviota'))) return 'CFMOTO Aspar Moto3';
  if (t.includes('aspar')) return 'CFMOTO Aspar Team';
  if (t.includes('honda hrc asia') || (t.includes('honda') && t.includes('asia') && !t.includes('idemitsu'))) return 'Honda HRC Asia';
  if (t.includes('idemitsu')) return 'Idemitsu Honda Team Asia';
  return rawTeam;
}

export interface TeamGroup {
  teamName: string;
  category: 'MotoGP' | 'Moto2' | 'Moto3';
  constructorName: string;
  teamDetail: TeamDetail;
  riders: Rider[];
}

const MOTOGP_TEAM_ORDER = [
  'Ducati Lenovo Team',
  'Aprilia Racing',
  'Pertamina Enduro VR46 Racing Team',
  'Red Bull KTM Factory Racing',
  'BK8 Gresini Racing MotoGP',
  'Monster Energy Yamaha MotoGP',
  'Prima Pramac Yamaha MotoGP',
  'Red Bull KTM Tech3',
  'SuperFile Trackhouse MotoGP Team',
  'Honda HRC Castrol',
  'LCR Honda MotoGP',
];

const MOTO2_TEAM_ORDER = [
  'CFMOTO Power Electronics Aspar Team',
  'Red Bull KTM Ajo',
  'Idemitsu Honda Team Asia',
  'ITALJET Gresini Moto2',
  'ELF Marc VDS Racing Team',
  'QJMOTOR - JP Financial - MSI',
  'Liqui Moly Dynavolt Intact GP',
  'REDS Fantic Racing',
  'BLU CRU Pramac Yamaha Moto2',
  'OnlyFans American Racing Team',
  'SpeedRS Team',
  'KLINT Racing Team',
  'Italtrans Racing Team',
  'Momoven Idrofoglia RW Racing Team',
];

const MOTO2_TEAM_ORDER_2027 = [
  'CFMOTO Aspar Team',
  'REDS Fantic Racing',
  'Liqui Moly Dynavolt Intact GP',
  'Italtrans Racing Team',
  'Klint Racing Team',
  'Idemitsu Honda Team Asia',
  'Momoven Idrofoglia RW Racing Team',
  'QJMOTOR - MSI',
  'ITALJET Gresini Moto2',
  'Red Bull KTM Ajo',
  'OnlyFans American Racing Team',
  'BLU CRU Pramac Yamaha Moto2',
  'SpeedRS Team',
  'Forward Racing Team',
];

const MOTO3_TEAM_ORDER = [
  'Honda Team Asia',
  'Leopard Racing',
  'CFMOTO Gaviota Aspar Team',
  'Red Bull KTM Ajo',
  'Red Bull KTM Tech3',
  'Liqui Moly Dynavolt Intact GP',
  'AEON Credit - MT Helmets - MSI',
  'SIC58 Squadra Corse',
  'LEVELUP - MTA',
  'Rivacold Snipers Team',
  'CIP Green Power',
  'GRYD Racing',
  'CODE Motorsports',
];

const MOTO3_TEAM_ORDER_2027 = [
  'CFMOTO Aspar Moto3',
  'AEON Credit - MT Helmets - MSI',
  'Red Bull KTM Ajo',
  'Red Bull KTM Tech3',
  'Liqui Moly Dynavolt Intact GP',
  'Leopard Racing',
  'LEVELUP - MTA',
  'Rivacold Snipers Team',
  'CODE Motorsports',
  'Honda HRC Asia',
  'SIC58 Squadra Corse',
  'CIP Green Power',
  'GRYD Racing',
];

function groupRidersByTeam(
  riders: Rider[],
  category: 'MotoGP' | 'Moto2' | 'Moto3',
  season: '2026' | '2027',
): TeamGroup[] {
  const map = new Map<string, Rider[]>();

  riders.forEach((rider) => {
    const canonical = getCanonicalTeamName(rider.team);
    if (!map.has(canonical)) {
      map.set(canonical, []);
    }
    map.get(canonical)!.push(rider);
  });

  const orderList =
    category === 'MotoGP'
      ? MOTOGP_TEAM_ORDER
      : category === 'Moto2'
        ? (season === '2027' ? MOTO2_TEAM_ORDER_2027 : MOTO2_TEAM_ORDER)
        : (season === '2027' ? MOTO3_TEAM_ORDER_2027 : MOTO3_TEAM_ORDER);

  const result: TeamGroup[] = [];

  // Add teams in official designated championship order
  orderList.forEach((teamName) => {
    if (map.has(teamName)) {
      const teamRiders = map.get(teamName)!;
      teamRiders.sort((a, b) => {
        if (a.isTba && !b.isTba) return 1;
        if (!a.isTba && b.isTba) return -1;
        return a.number - b.number;
      });
      result.push({
        teamName,
        category,
        constructorName: teamRiders[0]?.constructor || '',
        teamDetail: getTeamDetail(teamName, category, teamRiders[0]?.constructor, season),
        riders: teamRiders,
      });
      map.delete(teamName);
    }
  });

  // Any remaining teams that weren't in orderList
  map.forEach((teamRiders, teamName) => {
    teamRiders.sort((a, b) => a.number - b.number);
    result.push({
      teamName,
      category,
      constructorName: teamRiders[0]?.constructor || '',
      teamDetail: getTeamDetail(teamName, category, teamRiders[0]?.constructor, season),
      riders: teamRiders,
    });
  });

  return result;
}

interface RidersShowcaseProps {
  onSelectZoneCta?: () => void;
}

export const RidersShowcase: React.FC<RidersShowcaseProps> = ({ onSelectZoneCta }) => {
  const [sectionView, setSectionView] = useState<'lineup' | 'standings'>('lineup');
  const [selectedSeason, setSelectedSeason] = useState<'2026' | '2027'>('2026');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'MotoGP' | 'Moto2' | 'Moto3'>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'team' | 'number'>('team');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [activeRider, setActiveRider] = useState<Rider | null>(null);
  const [showAllGrid, setShowAllGrid] = useState(false);

  // Auto-switch to standings when URL hash points to standings or klasemen
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#standings' || hash === '#klasemen') {
        setSectionView('standings');
      } else if (hash === '#riders' || hash === '#riders-showcase') {
        setSectionView('lineup');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);


  // Active riders dataset for current season (2026 vs 2027)
  const seasonRiders = useMemo(() => getSeasonRiders(selectedSeason), [selectedSeason]);
  const seasonClassMetadata = useMemo(() => getSeasonClassMetadata(selectedSeason), [selectedSeason]);

  // Compute canonical unique teams available for current season & category selection
  const availableTeams = useMemo(() => {
    const pool =
      selectedCategory === 'ALL'
        ? seasonRiders
        : seasonRiders.filter((r: Rider) => r.category === selectedCategory);
    const canonicals = pool.map((r: Rider) => getCanonicalTeamName(r.team));
    const unique = Array.from(new Set(canonicals)).sort((a, b) => a.localeCompare(b));
    return unique;
  }, [seasonRiders, selectedCategory]);

  // Handle category change and reset team if not in the new category
  const handleCategoryChange = (cat: 'ALL' | 'MotoGP' | 'Moto2' | 'Moto3') => {
    setSelectedCategory(cat);
    if (selectedTeam !== 'ALL') {
      const pool =
        cat === 'ALL' ? seasonRiders : seasonRiders.filter((r: Rider) => r.category === cat);
      const exists = pool.some(
        (r: Rider) => r.team === selectedTeam || getCanonicalTeamName(r.team) === selectedTeam,
      );
      if (!exists) {
        setSelectedTeam('ALL');
      }
    }
  };

  // Filter riders based on category, team, and search
  const filteredRiders = useMemo(() => {
    let list = seasonRiders;

    // Filter by team (matches either raw team or canonical team name)
    if (selectedTeam !== 'ALL') {
      list = list.filter((r: Rider) => {
        const canonical = getCanonicalTeamName(r.team);
        return r.team === selectedTeam || canonical === selectedTeam;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r: Rider) =>
          r.name.toLowerCase().includes(q) ||
          r.team.toLowerCase().includes(q) ||
          getCanonicalTeamName(r.team).toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.number.toString() === q ||
          (r.isTba && (q === '?' || q.includes('tba') || q.includes('belum'))) ||
          r.constructor.toLowerCase().includes(q),
      );
    }

    return list;
  }, [seasonRiders, selectedTeam, searchQuery]);

  const ridersByCat = useMemo(() => {
    return {
      MotoGP: filteredRiders.filter((r: Rider) => r.category === 'MotoGP'),
      Moto2: filteredRiders.filter((r: Rider) => r.category === 'Moto2'),
      Moto3: filteredRiders.filter((r: Rider) => r.category === 'Moto3'),
    };
  }, [filteredRiders]);

  // Grouped riders by team for each category
  const teamGroupsByCat = useMemo(() => {
    return {
      MotoGP: groupRidersByTeam(ridersByCat.MotoGP, 'MotoGP', selectedSeason),
      Moto2: groupRidersByTeam(ridersByCat.Moto2, 'Moto2', selectedSeason),
      Moto3: groupRidersByTeam(ridersByCat.Moto3, 'Moto3', selectedSeason),
    };
  }, [ridersByCat, selectedSeason]);

  const activeCategories: ('MotoGP' | 'Moto2' | 'Moto3')[] =
    selectedCategory === 'ALL'
      ? ['MotoGP', 'Moto2', 'Moto3']
      : [selectedCategory as 'MotoGP' | 'Moto2' | 'Moto3'];


  // 4 Featured Highlights dynamically matching selectedCategory & selectedSeason (Opsi A)
  const featuredRiders = useMemo(() => {
    let pool: Rider[] = [];
    if (selectedCategory === 'ALL') {
      pool = filteredRiders;
    } else {
      pool = filteredRiders.filter((r) => r.category === selectedCategory);
    }
    if (pool.length === 0) {
      pool = seasonRiders;
    }

    let selected: Rider[] = [];

    if (selectedSeason === '2027') {
      if (selectedCategory === 'Moto2') {
        const m2 = pool.filter((r) => r.category === 'Moto2');
        selected = m2.slice(0, 4);
      } else if (selectedCategory === 'Moto3') {
        const m3 = pool.filter((r) => r.category === 'Moto3');
        selected = m3.slice(0, 4);
      } else {
        // MotoGP or ALL 2027
        const prio = [93, 63, 89, 31, 37, 20, 11];
        const picked = prio
          .map((num) => pool.find((r) => r.number === num))
          .filter(Boolean) as Rider[];
        const tba = pool.find((r) => r.isTba);
        if (tba && !picked.some((p) => p.isTba)) {
          picked.push(tba);
        }
        selected = [...picked, ...pool].slice(0, 4);
      }
    } else {
      // Season 2026
      if (selectedCategory === 'Moto2') {
        const prio = [18, 44, 96, 3, 54, 7];
        const picked = prio.map((n) => pool.find((r) => r.number === n)).filter(Boolean) as Rider[];
        selected = [...picked, ...pool].slice(0, 4);
      } else if (selectedCategory === 'Moto3') {
        const prio = [80, 95, 96, 99, 36, 6];
        const picked = prio.map((n) => pool.find((r) => r.number === n)).filter(Boolean) as Rider[];
        selected = [...picked, ...pool].slice(0, 4);
      } else {
        // MotoGP or ALL 2026
        const prio = [93, 63, 31, 37, 89, 20];
        const picked = prio.map((n) => pool.find((r) => r.number === n)).filter(Boolean) as Rider[];
        selected = [...picked, ...pool].slice(0, 4);
      }
    }

    if (selected.length < 4) {
      const remaining = pool.filter((r) => !selected.some((s) => s.id === r.id));
      selected = [...selected, ...remaining].slice(0, 4);
    }

    return selected.map((rider) => {
      let note = rider.transferNote;
      if (!note) {
        if (rider.isTba) {
          note = 'Slot kursi era 2027 yang masih menunggu pengumuman resmi FIM.';
        } else if (rider.category === 'MotoGP') {
          note = `${rider.team} • Prototipe 1.000cc bertenaga 300+ HP dengan akselerasi maksimal.`;
        } else if (rider.category === 'Moto2') {
          note = `${rider.team} • Mesin Triumph 765cc 3-silinder dengan sasis balap prototipe murni.`;
        } else {
          note = `${rider.team} • Mesin 250cc 1-silinder kategori penjenjangan dunia paling kompetitif.`;
        }
      }

      return {
        rider,
        watermark: rider.isTba ? '?' : rider.number.toString(),
        note,
      };
    });
  }, [filteredRiders, seasonRiders, selectedCategory, selectedSeason]);

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSelectedTeam('ALL');
    setSearchQuery('');
  };

  return (
    <section id="riders-showcase" className="py-16 bg-[#0a0a0c] border-b border-white/[0.07] relative">
      <div id="riders" className="absolute -top-10" />
      <div id="standings" className="absolute -top-10" />
      <div id="klasemen" className="absolute -top-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">
              {sectionView === 'standings' ? 'Klasemen Kejuaraan Dunia FIM' : 'Lineup Kejuaraan Dunia'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-racing">
              {sectionView === 'standings' ? 'Klasemen Pembalap MotoGP™' : `Pembalap & Tim Musim ${selectedSeason}`}
            </h2>
          </div>

          {/* Minimalist Filter & View Toolbar */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* View Mode Switcher: Lineup vs Klasemen */}
            <div className="inline-flex items-center p-1 bg-[#111216] border border-white/[0.08] rounded-lg">
              <button
                type="button"
                onClick={() => setSectionView('lineup')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  sectionView === 'lineup'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Lineup Tim</span>
              </button>
              <button
                type="button"
                onClick={() => setSectionView('standings')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  sectionView === 'standings'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Klasemen</span>
              </button>
            </div>

            {sectionView === 'lineup' && (
              <>
                {/* Season Segmented Toggle */}
                <div className="inline-flex items-center p-1 bg-[#111216] border border-white/[0.08] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSelectedSeason('2026')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      selectedSeason === '2026'
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    2026
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSeason('2027')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      selectedSeason === '2027'
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    2027 (850cc)
                  </button>
                </div>

                {/* Category Segmented Pills */}
                <div className="inline-flex items-center p-1 bg-[#111216] border border-white/[0.08] rounded-lg overflow-x-auto no-scrollbar">
                  {(['ALL', 'MotoGP', 'Moto2', 'Moto3'] as const).map((cat) => {
                    const isCatActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          isCatActive
                            ? 'bg-[#E10600] text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat === 'ALL' ? 'Semua' : cat}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {sectionView === 'standings' ? (
          <ChampionshipStandings
            seasonRiders={seasonRiders}
            onSelectRider={(r) => setActiveRider(r)}
            selectedCategory={selectedCategory === 'ALL' ? 'MotoGP' : selectedCategory}
          />
        ) : (
          <>
            {/* 4 Featured Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {featuredRiders.map((item, idx) => {
            const { rider, watermark, note } = item;
            const isTba = Boolean(rider.isTba);

            return (
              <div
                key={rider.id || idx}
                onClick={() => setActiveRider(rider)}
                className="relative overflow-hidden rounded-xl bg-[#111216] border border-white/[0.08] hover:border-white/25 p-4 flex flex-col justify-between group transition-colors cursor-pointer"
              >
                {/* 1. Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3 z-10 gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-xs font-mono font-bold text-white bg-white/[0.08] px-2 py-0.5 rounded shrink-0">
                      {isTba ? 'TBA' : `#${rider.number}`}
                    </span>
                    <span className="text-xs font-medium text-zinc-400 truncate">
                      {rider.team}
                    </span>
                  </div>

                  <span className="text-[11px] text-zinc-500 font-medium shrink-0">
                    {rider.category}
                  </span>
                </div>

                {/* 2. Portrait Area */}
                <div className="relative h-60 rounded-lg overflow-hidden flex items-start justify-center bg-[#0c0d11] my-1 z-10">
                  <div className="absolute right-2 bottom-1 text-7xl font-black text-white/[0.03] select-none font-racing pointer-events-none">
                    {watermark}
                  </div>

                  <img
                    src={rider.picture}
                    alt={rider.name}
                    className={`relative z-10 w-full h-full ${
                      isTba
                        ? 'object-contain p-4 scale-90 opacity-90'
                        : 'object-cover object-top'
                    } group-hover:scale-103 transition-transform duration-300 pointer-events-none`}
                    onError={(e) => {
                      if (rider.remotePicture && !e.currentTarget.src.includes('wsrv.nl')) {
                        e.currentTarget.src = `https://wsrv.nl/?url=${encodeURIComponent(
                          rider.remotePicture,
                        )}&w=420&output=webp&q=85`;
                      } else {
                        e.currentTarget.src =
                          'https://photos.motogp.com/riders/a/7/a7b4d63f-45b3-402e-b66c-001ed8a62934/2026/profile/main-938861.png';
                      }
                    }}
                  />
                </div>

                {/* 3. Rider Name & Note */}
                <div className="z-10 mt-3">
                  <div className="flex items-center space-x-2">
                    {!isTba && rider.flagUrl && (
                      <img
                        src={rider.flagUrl}
                        alt={rider.country}
                        className="w-4 h-3 object-cover rounded-xs border border-white/15 shrink-0"
                      />
                    )}
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight truncate">
                      {isTba ? 'Kursi Belum Diumumkan' : rider.fullNameUpper}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {note}
                  </p>
                </div>

                {/* 4. Action Link */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
                  <span>{isTba ? 'Status Slot' : 'Lihat Profil'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Expandable Toggle Bar for All Team Garages */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => setShowAllGrid(!showAllGrid)}
            className="px-5 py-2.5 rounded-lg bg-[#111216] hover:bg-[#181920] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            {showAllGrid
              ? 'Sembunyikan Daftar Garasi Tim'
              : 'Lihat Seluruh Garasi Tim & Pembalap'}
          </button>
        </div>

        {/* Collapsible Full Team Roster */}
        {showAllGrid && (
          <div className="pt-6 border-t border-white/10 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-racing">
                  Eksplorasi Seluruh Garasi Tim & Pembalap
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Kelompokkan pembalap per garasi pabrikan atau cari nomor balap tertentu.
                </p>
              </div>

              {/* Search, Grouping, Team Filter & Layout Controls */}
              <div className="flex flex-wrap items-center gap-3">
            {/* Team Filter Dropdown */}
            <div className="relative min-w-[190px] flex-1 sm:flex-initial">
              <div className="relative flex items-center">
                <Users className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className={`w-full pl-9 pr-8 py-2 bg-[#171a24] border rounded-xl text-xs font-semibold focus:outline-none transition-colors appearance-none cursor-pointer truncate ${
                    selectedTeam !== 'ALL'
                      ? 'border-red-500 text-white bg-red-950/20'
                      : 'border-[#2b3044] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <option value="ALL" className="bg-[#171a24] text-gray-300">
                    Semua Tim ({availableTeams.length} Tim)
                  </option>
                  {availableTeams.map((teamName) => (
                    <option key={teamName} value={teamName} className="bg-[#171a24] text-white">
                      {teamName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-gray-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-52">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pembalap, #, tim..."
                className="w-full pl-9 pr-7 py-2 bg-[#171a24] border border-[#2b3044] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Grouping Toggle: Sesuai Tim (Default) vs Urut Nomor */}
            <div className="flex items-center bg-[#171a24] border border-[#2b3044] rounded-xl p-1">
              <button
                onClick={() => setGroupBy('team')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  groupBy === 'team'
                    ? 'bg-[#E10600] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Kelompokkan Pembalap Sesuai Tim Masing-Masing"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[11px]">Sesuai Tim</span>
              </button>
              <button
                onClick={() => setGroupBy('number')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  groupBy === 'number'
                    ? 'bg-[#E10600] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Urutkan Sesuai Nomor Balap Pembalap"
              >
                <Hash className="w-3.5 h-3.5" />
                <span className="text-[11px]">Nomor Balap</span>
              </button>
            </div>

            {/* View Mode Toggle: Slider vs Grid */}
            <div className="flex items-center bg-[#171a24] border border-[#2b3044] rounded-xl p-1">
              <button
                onClick={() => setViewMode('carousel')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#E10600] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Tampilan Slider Horizontal"
              >
                <Rows className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Slider</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#E10600] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Tampilan Grid Seluruhnya"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2027 Era Highlights Banner (Hidden when inspecting a specific team) */}
        {selectedSeason === '2027' && selectedTeam === 'ALL' && (
          <div className="mb-8 p-4.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#1c1611] to-[#12141c] border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl animate-fadeIn">
            <div className="flex items-start md:items-center space-x-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                    Regulasi Revolusioner MotoGP™ 2027: Era Mesin 850cc
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                    Resmi FIM
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Kapasitas mesin dipangkas menjadi <strong>850cc</strong> (bore 75mm), <strong>larangan total holeshot/ride-height device</strong>, aero dipersempit, dan 100% bahan bakar non-fosil. Diwarnai mega transfer:{' '}
                  <span className="text-white font-bold">Pecco Bagnaia ke Aprilia</span>,{' '}
                  <span className="text-white font-bold">Marquez & Acosta di Ducati Lenovo</span>,{' '}
                  <span className="text-white font-bold">Jorge Martin ke Yamaha</span>,{' '}
                  <span className="text-white font-bold">Quartararo di Honda HRC</span>, dan{' '}
                  <span className="text-white font-bold">Nicolò Bulega di VR46</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs & Active Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => handleCategoryChange('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-[#161822] text-gray-400 hover:text-white hover:bg-[#1e2230] border border-[#272b3c]'
              }`}
            >
              Semua Kelas ({seasonRiders.length})
            </button>
            <button
              onClick={() => handleCategoryChange('MotoGP')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'MotoGP'
                  ? 'bg-[#E10600] text-white shadow-lg shadow-red-950/50'
                  : 'bg-[#161822] text-gray-400 hover:text-white hover:bg-[#1e2230] border border-[#272b3c]'
              }`}
            >
              MotoGP™ ({seasonRiders.filter((r) => r.category === 'MotoGP').length})
            </button>
            <button
              onClick={() => handleCategoryChange('Moto2')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'Moto2'
                  ? 'bg-[#0072ce] text-white shadow-lg shadow-blue-950/50'
                  : 'bg-[#161822] text-gray-400 hover:text-white hover:bg-[#1e2230] border border-[#272b3c]'
              }`}
            >
              Moto2™ ({seasonRiders.filter((r) => r.category === 'Moto2').length})
            </button>
            <button
              onClick={() => handleCategoryChange('Moto3')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'Moto3'
                  ? 'bg-[#00a86b] text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-[#161822] text-gray-400 hover:text-white hover:bg-[#1e2230] border border-[#272b3c]'
              }`}
            >
              Moto3™ ({seasonRiders.filter((r) => r.category === 'Moto3').length})
            </button>
          </div>

          {/* Active Filter Indicators */}
          {(selectedTeam !== 'ALL' || searchQuery) && (
            <div className="flex items-center space-x-2 shrink-0">
              {selectedTeam !== 'ALL' && (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-semibold">
                  <span className="text-[11px] text-gray-400">Tim:</span>
                  <span className="font-bold max-w-[150px] truncate">{selectedTeam}</span>
                  <button
                    onClick={() => setSelectedTeam('ALL')}
                    className="ml-1 text-red-300 hover:text-white cursor-pointer"
                    title="Hapus filter tim"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          )}
        </div>

        {/* Team Spotlight & Technical Information Dossier */}
        {selectedTeam !== 'ALL' && (
          <TeamSpotlightCard
            teamName={selectedTeam}
            category={
              selectedCategory === 'ALL'
                ? (ridersByCat.MotoGP.length
                    ? 'MotoGP'
                    : ridersByCat.Moto2.length
                      ? 'Moto2'
                      : 'Moto3')
                : selectedCategory
            }
            constructorName={filteredRiders[0]?.constructor}
            season={selectedSeason}
            onClearTeam={() => setSelectedTeam('ALL')}
            onSelectZoneCta={onSelectZoneCta}
          />
        )}

        {/* Category Rows or Grid */}
        <div className="space-y-12">
          {activeCategories.map((cat) => {
            const list = ridersByCat[cat];
            const groups = teamGroupsByCat[cat];
            const meta = seasonClassMetadata[cat];

            if (list.length === 0) {
              return null;
            }

            return (
              <div key={cat} className="space-y-4">
                {/* Official Category Header with Full-Width Line */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Official Category Logo */}
                    <div className="shrink-0">
                      <CategoryLogo category={cat} className="h-7 sm:h-8" />
                    </div>

                    {/* Official Sleek Horizontal Line Extending Across */}
                    <div className="flex-1 h-[1.5px] bg-gradient-to-r from-white/30 via-white/15 to-transparent relative">
                      <div className="absolute left-0 top-0 h-full w-24 bg-white/40" />
                    </div>
                  </div>

                  {/* Header Actions: Count */}
                  <div className="flex items-center space-x-3 ml-4 shrink-0">
                    <span className="text-xs font-bold uppercase text-white bg-[#1a1d2c] border border-white/10 px-3 py-1 rounded-full shadow-xs">
                      {list.length} Pembalap • {groups.length} Tim
                    </span>
                  </div>
                </div>

                {/* Broadcast-Grade Championship Class Briefing & Telemetry Bar (Hidden when inspecting a specific team) */}
                {selectedTeam === 'ALL' && <ClassBriefingCard meta={meta} season={selectedSeason} />}

                {/* Content: Grouped by Team vs Ordered by Number */}
                {groupBy === 'team' ? (
                  /* GROUPED BY TEAM MODE (DEFAULT) */
                  viewMode === 'carousel' ? (
                    /* Horizontal Slider of Team Garages */
                    <DraggableShelf step={490}>
                      {groups.map((group) => (
                        <div
                          key={group.teamName}
                          className="snap-start shrink-0 w-[310px] sm:w-[460px] md:w-[490px]"
                        >
                          <TeamGarageCard
                            group={group}
                            onOpenDetail={(r) => setActiveRider(r)}
                            onSelectTeam={(t) => setSelectedTeam(t)}
                          />
                        </div>
                      ))}
                    </DraggableShelf>
                  ) : (
                    /* Responsive Grid of Team Garages */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                      {groups.map((group) => (
                        <TeamGarageCard
                          key={group.teamName}
                          group={group}
                          onOpenDetail={(r) => setActiveRider(r)}
                          onSelectTeam={(t) => setSelectedTeam(t)}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  /* ORDERED BY NUMBER FLAT LIST MODE */
                  viewMode === 'carousel' ? (
                    <DraggableShelf step={260}>
                      {list.map((rider: Rider) => (
                        <div
                          key={rider.id}
                          className="snap-start shrink-0 w-[220px] sm:w-[245px]"
                        >
                          <RiderCard
                            rider={rider}
                            onOpenDetail={() => setActiveRider(rider)}
                            onSelectTeam={(team) => setSelectedTeam(team)}
                          />
                        </div>
                      ))}
                    </DraggableShelf>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {list.map((rider: Rider) => (
                        <RiderCard
                          key={rider.id}
                          rider={rider}
                          onOpenDetail={() => setActiveRider(rider)}
                          onSelectTeam={(team) => setSelectedTeam(team)}
                        />
                      ))}
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* Global Empty State */}
        {filteredRiders.length === 0 && (
          <div className="p-12 text-center bg-[#13151f] rounded-2xl border border-[#252838] my-8">
            <Search className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Pembalap Tidak Ditemukan
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Tidak ada rider yang cocok dengan filter tim atau kata kunci yang dipilih.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-[#E10600] text-white text-xs font-bold cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
          </div>
        )}
          </>
        )}
      </div>

      {/* Rider Detail Modal */}
      <RiderDetailModal
        rider={activeRider}
        isOpen={Boolean(activeRider)}
        season={selectedSeason}
        onClose={() => setActiveRider(null)}
        onSelectBookingForRider={() => {
          setActiveRider(null);
          if (onSelectZoneCta) {
            onSelectZoneCta();
          } else {
            const el = document.getElementById('circuit-zones');
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
    </section>
  );
};

/**
 * Team Garage Card
 * Displays team branding, technical identity, and the pair of teammate riders side-by-side
 */
interface TeamGarageCardProps {
  group: TeamGroup;
  onOpenDetail: (rider: Rider) => void;
  onSelectTeam: (team: string) => void;
}

const TeamGarageCard: React.FC<TeamGarageCardProps> = ({ group, onOpenDetail, onSelectTeam }) => {
  const { teamName, teamDetail, riders } = group;

  return (
    <div className="relative rounded-2xl border border-[#262a3b] bg-gradient-to-b from-[#161822]/90 via-[#11131a] to-[#0c0d12] p-3.5 sm:p-4 shadow-xl transition-all duration-300 hover:border-white/25 flex flex-col justify-between group">
      {/* Team Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-3 mb-3 border-b border-white/10 gap-2">
        <div className="flex items-center space-x-2.5 min-w-0">
          {/* Vertical team color accent pill */}
          <div
            className="w-2 h-7 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: teamDetail.color || '#E10600' }}
          />
          <div className="min-w-0">
            <h4 className="font-black text-white text-xs sm:text-sm uppercase tracking-wide truncate font-racing">
              {teamName}
            </h4>
            <div className="text-[10px] sm:text-[11px] text-gray-400 font-medium truncate flex items-center space-x-1.5">
              <span className="text-gray-300 font-semibold">{teamDetail.bike}</span>
              <span className="text-gray-600">•</span>
              <span className="text-[10px] text-gray-400">{teamDetail.type.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Action Button: Keterangan Tim */}
        <button
          onClick={() => onSelectTeam(teamName)}
          className="shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-[11px] font-bold transition-all border border-white/5 cursor-pointer"
          title={`Lihat keterangan lengkap tim ${teamName}`}
        >
          <Shield className="w-3 h-3 text-[#E10600]" />
          <span className="hidden sm:inline">Keterangan Tim</span>
          <span className="sm:hidden">Info</span>
        </button>
      </div>

      {/* Teammates Grid (Side-by-side pair) */}
      <div className={`relative z-10 grid gap-2.5 sm:gap-3 ${riders.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {riders.map((rider) => (
          <RiderCard
            key={rider.id}
            rider={rider}
            onOpenDetail={() => onOpenDetail(rider)}
            onSelectTeam={onSelectTeam}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Rider Card
 * Authentic TV Broadcast Graphic aesthetic
 */
interface RiderCardProps {
  rider: Rider;
  onOpenDetail: () => void;
  onSelectTeam?: (team: string) => void;
}

const RiderCard: React.FC<RiderCardProps> = ({ rider, onOpenDetail, onSelectTeam }) => {
  const [imageError, setImageError] = useState(false);
  const isTba = Boolean(rider.isTba);

  return (
    <div
      onClick={onOpenDetail}
      className={`group relative bg-gradient-to-b ${
        isTba
          ? 'from-[#1b1e2a] via-[#141620] to-[#0d0e14] border-dashed border-[#3d4560] hover:border-amber-400/60'
          : 'from-[#212532] via-[#171a23] to-[#101218] border-[#2b3144] hover:border-white/40'
      } border rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between h-[285px] sm:h-[325px]`}
    >
      {/* TBA Mystery Badge or Transfer Note Indicator */}
      {isTba ? (
        <div className="absolute top-2 left-2 z-20 max-w-[85%]">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 backdrop-blur-md border border-amber-500/50 text-[8.5px] font-black tracking-widest text-amber-300 uppercase flex items-center space-x-1 shadow-md truncate">
            <HelpCircle className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{rider.transferNote ? 'TBA' : 'TBA 2027'}</span>
          </span>
        </div>
      ) : rider.transferNote ? (
        <div className="absolute top-2 left-2 z-20 max-w-[85%]">
          <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[8.5px] font-bold text-gray-200 flex items-center space-x-1 shadow-md truncate">
            <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
            <span className="truncate">{rider.transferNote}</span>
          </span>
        </div>
      ) : null}

      {/* Rider Portrait Photo Area */}
      <div className="relative flex-1 flex items-start justify-center px-1.5 pt-2 pb-0 overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-3">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1.5">
              <span className={`font-black text-xl ${isTba ? 'text-amber-400' : 'text-gray-400'}`}>
                {isTba ? '?' : `#${rider.number}`}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">{rider.name}</span>
          </div>
        ) : (
          <img
            src={rider.picture}
            alt={rider.name}
            onError={(e) => {
              if (rider.remotePicture && !e.currentTarget.src.includes('wsrv.nl')) {
                e.currentTarget.src = `https://wsrv.nl/?url=${encodeURIComponent(
                  rider.remotePicture,
                )}&w=420&output=webp&q=85`;
              } else {
                setImageError(true);
              }
            }}
            className={`relative z-10 w-full h-[225px] sm:h-[265px] ${
              isTba
                ? 'object-contain scale-95 p-1.5 opacity-90 group-hover:opacity-100'
                : 'object-cover object-top'
            } drop-shadow-[0_12px_15px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-all duration-300 pointer-events-none`}
            loading="eager"
            decoding="async"
          />
        )}

        {/* Hover View Info Badge */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-bold text-white flex items-center space-x-1 shadow-md">
            <Info className={`w-3 h-3 ${isTba ? 'text-amber-400' : 'text-[#E10600]'}`} />
            <span>{isTba ? 'Status Slot' : 'Detail'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar Matching TV broadcast graphic */}
      <div className="relative z-20 p-2 sm:p-2.5 bg-[#12141c]/95 border-t border-[#232738] flex items-center space-x-2">
        {/* Race Number Box */}
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center shadow-md shrink-0 select-none ${
            isTba
              ? 'bg-amber-400 text-black font-black text-sm sm:text-base border border-amber-300 shadow-amber-950/40'
              : 'bg-white text-black font-black text-xs sm:text-sm'
          }`}
        >
          {isTba ? '?' : rider.number}
        </div>

        {/* Name and Team details */}
        <div className="min-w-0 flex-1">
          {/* Rider Full Name (Uppercase Bold) */}
          <div
            className={`font-black text-[11px] sm:text-[13px] leading-tight tracking-wide uppercase truncate ${
              isTba ? 'text-amber-300' : 'text-white'
            }`}
          >
            {isTba ? '? BELUM DIUMUMKAN' : rider.fullNameUpper}
          </div>

          {/* Country Flag + Country + Pipe + Team */}
          <div className="flex items-center space-x-1 text-[9px] sm:text-[10px] text-gray-300 font-semibold tracking-wider uppercase truncate mt-0.5">
            {isTba ? (
              <span className="w-3.5 h-2.5 flex items-center justify-center text-[10px] shrink-0">❓</span>
            ) : rider.flagUrl ? (
              <img
                src={rider.flagUrl}
                alt={rider.country}
                className="w-3 h-2 sm:w-3.5 sm:h-2.5 object-cover rounded-[1px] border border-white/20 shrink-0"
              />
            ) : (
              <span>🚩</span>
            )}
            <span className={`shrink-0 ${isTba ? 'text-amber-400 font-bold' : ''}`}>
              {isTba ? 'TBA' : rider.country.toUpperCase()}
            </span>
            <span className="text-gray-500 font-normal">|</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectTeam) onSelectTeam(rider.team);
              }}
              className="text-gray-400 hover:text-white hover:underline truncate transition-colors text-left cursor-pointer font-bold max-w-[85px] sm:max-w-[130px]"
              title={`Klik untuk melihat keterangan & profil tim ${rider.team}`}
            >
              {rider.team.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
