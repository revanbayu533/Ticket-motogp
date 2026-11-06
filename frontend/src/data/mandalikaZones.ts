import { Zone, PassType } from '../types';

export interface ZoneCategory {
  id: string;
  title: string;
  shortTitle: string;
  type: 'PREMIUM_GRANDSTAND' | 'REGULAR_GRANDSTAND' | 'GENERAL_ADMISSION' | 'VIP_HOSPITALITY';
  badge: string;
  badgeColor: string;
  roofType: string;
}

export interface PassOptionInfo {
  id: PassType;
  label: string;
  badge: string;
  subLabel: string;
}

export const OFFICIAL_PASS_OPTIONS: PassOptionInfo[] = [
  {
    id: '3day',
    label: 'Weekend Pass (3 Hari: Jum–Min)',
    badge: '3-Day Pass',
    subLabel: 'Semua sesi: FP, Sprint, & Race Day',
  },
  {
    id: 'sunday',
    label: 'Tiket Harian — Minggu (Race Day)',
    badge: 'Harian Minggu',
    subLabel: 'Khusus balapan puncak Grand Prix',
  },
  {
    id: 'saturday',
    label: 'Tiket Harian — Sabtu (Sprint & Quali)',
    badge: 'Harian Sabtu',
    subLabel: 'Kualifikasi Q1-Q2 & Tissot Sprint',
  },
  {
    id: 'friday',
    label: 'Tiket Harian — Jumat (Practice)',
    badge: 'Harian Jumat',
    subLabel: 'Free Practice 1 & Sesi Practice',
  },
  {
    id: 'vip',
    label: 'VIP Hospitality (3-Day Royal Box)',
    badge: 'VIP Suite 3-Day',
    subLabel: 'Lounge AC Pit Building & Pit Walk',
  },
];

export const ZONE_CATEGORIES: ZoneCategory[] = [
  {
    id: 'premium',
    title: '1. Premium Grandstand (Beratap)',
    shortTitle: 'Premium Grandstand',
    type: 'PREMIUM_GRANDSTAND',
    badge: 'Beratap (Covered)',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    roofType: 'Tribun Beratap Nyaman',
  },
  {
    id: 'regular',
    title: '2. Regular Grandstand (Terbuka)',
    shortTitle: 'Regular Grandstand',
    type: 'REGULAR_GRANDSTAND',
    badge: 'Terbuka (Open Air)',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    roofType: 'Tribun Terbuka Sensasi Nyata',
  },
  {
    id: 'ga',
    title: '3. General Admission (GA)',
    shortTitle: 'General Admission',
    type: 'GENERAL_ADMISSION',
    badge: 'Festival Non-Seating',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    roofType: 'Area Bebas / Berdiri',
  },
  {
    id: 'vip',
    title: '4. VIP Hospitality Suites',
    shortTitle: 'VIP Hospitality',
    type: 'VIP_HOSPITALITY',
    badge: 'VIP Paddock Deluxe',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    roofType: 'VIP Suite Ber-AC Mewah',
  },
];

export const MANDALIKA_OFFICIAL_ZONES: Zone[] = [
  // 1. Premium Grandstand (Beratap)
  {
    id: 'zone-prem-a',
    eventId: 'event-mandalika',
    name: 'Premium Grandstand - Zona A',
    category: 'PREMIUM_GRANDSTAND',
    categoryLabel: 'Premium Grandstand (Beratap)',
    capacity: 2500,
    price: 2500000,
    dailyPriceSunday: 1500000,
    dailyPriceSaturday: 1000000,
    dailyPriceFriday: 400000,
    isDailyAvailable: true,
    description:
      'Berada di lintasan lurus utama, menghadap garis start/finish dan gedung pit. Cocok untuk melihat pelepasan start dan aksi pengereman ke Tikungan 1.',
  },
  {
    id: 'zone-prem-b',
    eventId: 'event-mandalika',
    name: 'Premium Grandstand - Zona B',
    category: 'PREMIUM_GRANDSTAND',
    categoryLabel: 'Premium Grandstand (Beratap)',
    capacity: 2200,
    price: 2300000,
    dailyPriceSunday: 1350000,
    dailyPriceSaturday: 900000,
    dailyPriceFriday: 400000,
    isDailyAvailable: true,
    description:
      'Menghadap langsung ke Tikungan 1, titik favorit melihat pembalap melakukan pengereman keras selepas trek lurus.',
  },
  {
    id: 'zone-prem-c',
    eventId: 'event-mandalika',
    name: 'Premium Grandstand - Zona C',
    category: 'PREMIUM_GRANDSTAND',
    categoryLabel: 'Premium Grandstand (Beratap)',
    capacity: 2000,
    price: 2000000,
    dailyPriceSunday: 1150000,
    dailyPriceSaturday: 800000,
    dailyPriceFriday: 300000,
    isDailyAvailable: true,
    description: 'Terletak di area strategis chicane cepat Tikungan 2 & 3.',
  },
  {
    id: 'zone-prem-j',
    eventId: 'event-mandalika',
    name: 'Premium Grandstand - Zona J',
    category: 'PREMIUM_GRANDSTAND',
    categoryLabel: 'Premium Grandstand (Beratap)',
    capacity: 2500,
    price: 2000000,
    dailyPriceSunday: 1150000,
    dailyPriceSaturday: 800000,
    dailyPriceFriday: 300000,
    isDailyAvailable: true,
    description:
      'Menghadap ke Tikungan 15 hairpin krusial dan jalur menuju tikungan akhir sirkuit.',
  },
  {
    id: 'zone-prem-k',
    eventId: 'event-mandalika',
    name: 'Premium Grandstand - Zona K',
    category: 'PREMIUM_GRANDSTAND',
    categoryLabel: 'Premium Grandstand (Beratap)',
    capacity: 2500,
    price: 2000000,
    dailyPriceSunday: 1150000,
    dailyPriceSaturday: 800000,
    dailyPriceFriday: 300000,
    isDailyAvailable: true,
    description:
      'Menghadap ke tikungan terakhir (Tikungan 16) menuju lintasan lurus garis akhir perlombaan.',
  },

  // 2. Regular Grandstand (Terbuka)
  {
    id: 'zone-reg-de',
    eventId: 'event-mandalika',
    name: 'Regular Grandstand - Zona D & E',
    category: 'REGULAR_GRANDSTAND',
    categoryLabel: 'Regular Grandstand (Terbuka)',
    capacity: 3500,
    price: 1500000,
    dailyPriceSunday: 900000,
    dailyPriceSaturday: 500000,
    dailyPriceFriday: 200000,
    isDailyAvailable: true,
    description:
      'Terletak di sekitar area tikungan tengah (antara Tikungan 6 dan 7). Pemandangan motor melaju kencang di sektor bergelombang.',
  },
  {
    id: 'zone-reg-f',
    eventId: 'event-mandalika',
    name: 'Regular Grandstand - Zona F',
    category: 'REGULAR_GRANDSTAND',
    categoryLabel: 'Regular Grandstand (Terbuka)',
    capacity: 2500,
    price: 1250000,
    dailyPriceSunday: 750000,
    dailyPriceSaturday: 450000,
    dailyPriceFriday: 200000,
    isDailyAvailable: true,
    description:
      'Menghadap langsung ke Tikungan 9 dan 10 di sektor selatan sirkuit dengan sudut pandang aksi pengereman lateral.',
  },
  {
    id: 'zone-reg-g',
    eventId: 'event-mandalika',
    name: 'Regular Grandstand - Zona G',
    category: 'REGULAR_GRANDSTAND',
    categoryLabel: 'Regular Grandstand (Terbuka)',
    capacity: 3000,
    price: 1250000,
    dailyPriceSunday: 750000,
    dailyPriceSaturday: 450000,
    dailyPriceFriday: 200000,
    isDailyAvailable: true,
    description:
      'Berada di ujung lintasan lurus antara Tikungan 12 dan 13 sebelum sektor teknis.',
  },
  {
    id: 'zone-reg-hi',
    eventId: 'event-mandalika',
    name: 'Regular Grandstand - Zona H & I',
    category: 'REGULAR_GRANDSTAND',
    categoryLabel: 'Regular Grandstand (Terbuka)',
    capacity: 3000,
    price: 1250000,
    dailyPriceSunday: 750000,
    dailyPriceSaturday: 450000,
    dailyPriceFriday: 200000,
    isDailyAvailable: true,
    description:
      'Menghadap rangkaian tikungan teknikal sebelum sektor akhir sirkuit.',
  },

  // 3. General Admission (GA)
  {
    id: 'zone-ga-fest',
    eventId: 'event-mandalika',
    name: 'General Admission (GA)',
    category: 'GENERAL_ADMISSION',
    categoryLabel: 'General Admission (GA)',
    capacity: 10000,
    price: 650000,
    dailyPriceSunday: 400000,
    dailyPriceSaturday: 250000,
    dailyPriceFriday: 150000,
    isDailyAvailable: true,
    description:
      'Area perbukitan alam Bukit Seger tanpa nomor kursi tetap yang memberikan keleluasaan bergerak bagi penonton.',
  },

  // 4. VIP Hospitality (Hanya 3-Day Pass)
  {
    id: 'zone-vip-premiere',
    eventId: 'event-mandalika',
    name: 'VIP Hospitality Premiere Class (Royal Box Lt. 2)',
    category: 'VIP_HOSPITALITY',
    categoryLabel: 'VIP Hospitality Suites',
    capacity: 200,
    price: 20000000,
    isDailyAvailable: false,
    description:
      'Lounge VIP termewah di Lantai 2 Pit Building dengan pemandangan 360 derajat start/finish, akses Paddock harian, Pit Walk resmi, free-flow beverage, dan gourmet 5-star.',
  },
  {
    id: 'zone-vip-deluxe',
    eventId: 'event-mandalika',
    name: 'VIP Hospitality Village Deluxe Class (Royal Box A & B)',
    category: 'VIP_HOSPITALITY',
    categoryLabel: 'VIP Hospitality Suites',
    capacity: 350,
    price: 15000000,
    isDailyAvailable: false,
    description:
      'Suite ber-AC di Royal Box A & B dengan pemandangan langsung pit lane dan garis start/finish, akses Pit Walk eksklusif, gourmet buffet 3-course & open bar premium.',
  },
];

export function getPassLabel(passType: PassType): string {
  switch (passType) {
    case 'sunday':
      return 'Tiket Harian — Minggu (Race Day)';
    case 'saturday':
      return 'Tiket Harian — Sabtu (Sprint & Quali)';
    case 'friday':
      return 'Tiket Harian — Jumat (Practice)';
    case 'vip':
      return 'VIP Hospitality Suite (3-Day)';
    case '3day':
    default:
      return 'Weekend Pass (3 Hari: Jum–Min)';
  }
}

export function getPassBadge(passType: PassType): string {
  switch (passType) {
    case 'sunday':
      return 'Harian Minggu';
    case 'saturday':
      return 'Harian Sabtu';
    case 'friday':
      return 'Harian Jumat';
    case 'vip':
      return 'VIP 3-Day';
    case '3day':
    default:
      return '3-Day Pass';
  }
}

export function getZonePriceByPass(zone: Zone, passType: PassType): number {
  if (passType === 'sunday' && zone.dailyPriceSunday) return zone.dailyPriceSunday;
  if (passType === 'saturday' && zone.dailyPriceSaturday) return zone.dailyPriceSaturday;
  if (passType === 'friday' && zone.dailyPriceFriday) return zone.dailyPriceFriday;
  const num = typeof zone.price === 'string' ? parseFloat(zone.price) : zone.price;
  return num;
}

export function getZonesByPass(zones: Zone[], passType: PassType): Zone[] {
  if (passType === 'vip') {
    return zones.filter((z) => z.category === 'VIP_HOSPITALITY');
  }
  if (passType === 'sunday' || passType === 'saturday' || passType === 'friday') {
    return zones.filter(
      (z) => z.isDailyAvailable !== false && z.category !== 'VIP_HOSPITALITY',
    );
  }
  return zones;
}
