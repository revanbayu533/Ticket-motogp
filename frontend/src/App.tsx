import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ZoneSelector } from './components/ZoneSelector';
import { BookingModal } from './components/BookingModal';
import { LiveNotifications } from './components/LiveNotifications';
import { Footer } from './components/Footer';
import { Zone, Order, AppNotification } from './types';
import Pusher from 'pusher-js';
import { ShieldCheck, Database, CheckCircle, Bell } from 'lucide-react';

const INITIAL_ZONES: Zone[] = [
  {
    id: 'zone-1',
    eventId: 'event-mandalika',
    name: 'VIP Hospitality Village Deluxe Class',
    capacity: 350,
    price: 15000000,
    description:
      'Suite ber-AC mewah dengan pemandangan langsung pit lane, akses Pit Walk eksklusif, gourmet buffet 3-course & open bar premium.',
  },
  {
    id: 'zone-2',
    eventId: 'event-mandalika',
    name: 'Premiere Grandstand Zone A (Start / Finish Grid)',
    capacity: 2500,
    price: 2500000,
    description:
      'Tribun beratap persis di hadapan garis start/finish, grid posisi pembalap, dan seremoni podium juara.',
  },
  {
    id: 'zone-3',
    eventId: 'event-mandalika',
    name: 'Standard Grandstand Zone C (Turn 1 Overtaking)',
    capacity: 3000,
    price: 1500000,
    description:
      'Spot terbaik aksi pengereman tajam dan tikungan pertama yang menjadi arena adu manuver overtake terpanas.',
  },
  {
    id: 'zone-4',
    eventId: 'event-mandalika',
    name: 'Standard Grandstand Zone J (Turn 16 Final Corner)',
    capacity: 3000,
    price: 1250000,
    description:
      'Menyaksikan akselerasi penuh motor MotoGP keluar dari tikungan terakhir menuju trek lurus kencang.',
  },
  {
    id: 'zone-5',
    eventId: 'event-mandalika',
    name: 'General Admission Festival (Bukit Seger Panorama)',
    capacity: 8000,
    price: 650000,
    description:
      'Area berdiri dan bersantai di atas Bukit Seger dengan lanskap sirkuit spektakuler berlatar belakang Samudra Hindia.',
  },
];

export const App: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  const pusherKey = import.meta.env.VITE_PUSHER_KEY || '5360efba11d8760e796f';
  const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER || 'ap1';

  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [isLoading] = useState(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      appName,
      title: `[${appName}] Sistem Penjualan Tiket MotoGP Resmi Dibuka`,
      message:
        'Penjualan tiket resmi Pertamina Grand Prix of Indonesia 2026 telah dibuka untuk seluruh zona tribun & VIP.',
      timestamp: new Date().toISOString(),
      type: 'info',
    },
    {
      id: 'notif-2',
      appName,
      title: `[${appName}] Early Bird Diskon 15% VIP Village`,
      message:
        'Tersedia kuota terbatas paket VIP Hospitality Deluxe Class dengan akses paddock pass.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'success',
    },
  ]);

  // Check backend health & fetch events
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const healthRes = await fetch(`${apiBaseUrl}/health`);
        if (healthRes.ok) {
          setBackendOnline(true);
        }

        const eventsRes = await fetch(`${apiBaseUrl}/events`);
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (eventsData && eventsData.length > 0) {
            const firstEvent = eventsData[0];
            if (firstEvent.zones && firstEvent.zones.length > 0) {
              setZones(firstEvent.zones);
            }
          }
        }
      } catch {
        // Backend not yet running locally, fallback to INITIAL_ZONES
        setBackendOnline(false);
      }
    };

    fetchBackendData();
    const interval = setInterval(fetchBackendData, 10000);
    return () => clearInterval(interval);
  }, [apiBaseUrl]);

  // Setup Pusher real-time notifications
  useEffect(() => {
    if (!pusherKey) return;

    try {
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
      });

      const channel = pusher.subscribe('mototix-channel');
      channel.bind('ticket-alert', (data: any) => {
        if (data) {
          setNotifications((prev) => [
            {
              id: `notif-${Date.now()}`,
              appName: data.appName || appName,
              title: data.title || `[${appName}] Update Tiket Baru`,
              message: data.message || 'Pembaruan ketersediaan tiket sirkuit.',
              timestamp: data.timestamp || new Date().toISOString(),
              type: 'info',
            },
            ...prev,
          ]);
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    } catch (err) {
      console.warn('Pusher connection skipped:', err);
    }
  }, [pusherKey, pusherCluster, appName]);

  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = (_order: Order, title: string, message: string) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        appName,
        title,
        message,
        timestamp: new Date().toISOString(),
        type: 'success',
      },
      ...prev,
    ]);
  };

  const handleTriggerTestNotification = () => {
    const testTitles = [
      `[${appName}] Tiket VIP Deluxe Mandalika Tersisa 10 Kursi!`,
      `[${appName}] Konfirmasi Pembayaran Kode MTX-2026-MDK-5921 Berhasil`,
      `[${appName}] Jadwal Sesi Practice MotoGP Jumat Dimajukan 15 Menit`,
    ];
    const randomTitle = testTitles[Math.floor(Math.random() * testTitles.length)];

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        appName,
        title: randomTitle,
        message: 'Notifikasi real-time terverifikasi melalui WebSocket Pusher cluster ap1.',
        timestamp: new Date().toISOString(),
        type: 'alert',
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-white flex flex-col font-sans selection:bg-[#E10600] selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#800000] via-[#E10600] to-[#800000] text-center py-1.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span>
          RESMI: Penjualan Tiket Pertamina Grand Prix of Indonesia 2026 Mandalika Dibuka Hari Ini
        </span>
      </div>

      {/* Main Navbar */}
      <Navbar
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        backendOnline={backendOnline}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSelectZoneCta={() => {
            const el = document.getElementById('circuit-zones');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* System Architecture & Setup Status Bar */}
        <section className="bg-[#10121a] border-y border-[#202332] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#161824] border border-[#272b3c] flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white uppercase tracking-wider">
                    Identitas Aplikasi
                  </div>
                  <div className="text-gray-400">
                    Nama: <strong className="text-white">{appName}</strong> (Backend & Frontend Env)
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161824] border border-[#272b3c] flex items-center space-x-3">
                <Database className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="font-bold text-white uppercase tracking-wider">
                    Database PostgreSQL
                  </div>
                  <div className="text-gray-400">Neon Cloud • 6 Tabel Relasional</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161824] border border-[#272b3c] flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-white uppercase tracking-wider">
                    Skema & Booking Code
                  </div>
                  <div className="text-gray-400">
                    Index Unik: <code className="text-[#00F0FF]">MTX-YYYY-XXXX</code>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161824] border border-[#272b3c] flex items-center space-x-3">
                <Bell className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white uppercase tracking-wider">
                    Pusher WebSocket
                  </div>
                  <div className="text-gray-400">Cluster ap1 • Notifikasi Live</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Circuit Zones Section */}
        <ZoneSelector zones={zones} onSelectZone={handleSelectZone} isLoading={isLoading} />
      </main>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          zone={selectedZone}
          onClose={() => setIsModalOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Live Notification Drawer */}
      <LiveNotifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClear={() => setNotifications([])}
        onTriggerTestNotification={handleTriggerTestNotification}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
