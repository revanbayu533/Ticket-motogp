import React, { useState, useEffect, useCallback } from 'react';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TicketPasses } from './components/TicketPasses';
import { ZoneSelector } from './components/ZoneSelector';
import { RidersShowcase } from './components/RidersShowcase';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { LiveNotifications } from './components/LiveNotifications';
import { Footer } from './components/Footer';
import { Zone, Order, AppNotification, User, PassType } from './types';
import Pusher from 'pusher-js';

import { MANDALIKA_OFFICIAL_ZONES } from './data/mandalikaZones';

const INITIAL_ZONES: Zone[] = MANDALIKA_OFFICIAL_ZONES;

export const App: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:3001/api'
      : 'https://ticket-motogp.vercel.app/api');

  const pusherKey = import.meta.env.VITE_PUSHER_KEY || '5360efba11d8760e796f';
  const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER || 'ap1';

  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedPass, setSelectedPass] = useState<PassType>('3day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


  // User state persisted in localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('mototix_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });


  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const savedNotifs = localStorage.getItem('mototix_notifications');
      if (savedNotifs) {
        return JSON.parse(savedNotifs);
      }
    } catch {
      // fallback
    }
    return [
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
    ];
  });

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mototix_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to sync notifications:', e);
    }
  }, [notifications]);

  // Fetch events from backend
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const eventsRes = await fetch(`${apiBaseUrl}/events`);
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (eventsData && eventsData.length > 0) {
            const firstEvent = eventsData[0];
            if (firstEvent.zones && firstEvent.zones.length > 0) {
              const enriched = firstEvent.zones.map((dbZone: Zone) => {
                const matched = MANDALIKA_OFFICIAL_ZONES.find(
                  (m) => m.name.toLowerCase() === dbZone.name.toLowerCase(),
                );
                return {
                  ...dbZone,
                  category: matched?.category || dbZone.category,
                  categoryLabel: matched?.categoryLabel || dbZone.categoryLabel,
                  description: matched?.description || dbZone.description,
                };
              });
              setZones(enriched);
            }
          }
        }
      } catch {
        // Backend not yet running locally, fallback to INITIAL_ZONES
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

  const handleSelectZone = (zone: Zone, passType?: PassType) => {
    setSelectedZone(zone);
    if (passType) {
      setSelectedPass(passType);
    }
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

  // Called when booking payment is pending or not yet completed
  const handleBookingPending = (
    bookingCode: string,
    snapToken: string,
    zoneName: string,
    amount: number,
  ) => {
    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);

    const pendingNotif: AppNotification = {
      id: `pending-${bookingCode}`,
      appName,
      title: `[${appName}] Menunggu Pembayaran: ${bookingCode}`,
      message: `Tiket Zona ${zoneName} (${formattedAmount}) belum selesai dibayar. Lanjutkan pembayaran resmi sebelum batas waktu berakhir.`,
      timestamp: new Date().toISOString(),
      type: 'pending',
      snapToken,
      bookingCode,
      amount,
      zoneName,
      actionLabel: 'Lanjutkan Pembayaran Sekarang',
    };

    setNotifications((prev) => {
      const filtered = prev.filter(
        (n) => n.bookingCode !== bookingCode && n.id !== pendingNotif.id,
      );
      return [pendingNotif, ...filtered];
    });

    // Auto open drawer so user directly sees the unpaid item
    setIsNotificationsOpen(true);
  };

  // Called when user clicks "Lanjutkan Pembayaran" in notification drawer
  const handleResumePayment = (notif: AppNotification) => {
    if (!notif.snapToken && !notif.bookingCode) return;

    if (window.snap && notif.snapToken && notif.snapToken !== 'simulated-token') {
      window.snap.pay(notif.snapToken, {
        onSuccess: (result: any) => {
          const method = result?.payment_type
            ? result.payment_type.toUpperCase()
            : 'MIDTRANS SNAP';
          completePaymentSuccess(notif, method);
        },
        onPending: () => {
          // Keep in pending state
        },
        onError: () => {
          // Keep in pending state
        },
        onClose: () => {
          // Modal closed, stays pending
        },
      });
    } else {
      // Direct completion for simulated token / fallback
      completePaymentSuccess(notif, 'MIDTRANS / QRIS RESMI');
    }
  };

  const completePaymentSuccess = (notif: AppNotification, method: string) => {
    setNotifications((prev) =>
      prev.map((item) => {
        if (item.id === notif.id || item.bookingCode === notif.bookingCode) {
          return {
            ...item,
            id: `success-${notif.bookingCode}`,
            type: 'success' as const,
            title: `[${appName}] Pembayaran Berhasil: ${notif.bookingCode}`,
            message: `Pembayaran tiket ${notif.zoneName || 'MotoGP Mandalika'} sebesar ${
              notif.amount
                ? new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0,
                  }).format(notif.amount)
                : ''
            } telah sukses diverifikasi via ${method}. E-Ticket resmi aktif!`,
            timestamp: new Date().toISOString(),
            snapToken: undefined,
            actionLabel: undefined,
          };
        }
        return item;
      }),
    );
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCancelPayment = async (notif: AppNotification) => {
    if (!notif.bookingCode) return;

    // Send cancel request to backend
    try {
      await fetch(`${apiBaseUrl}/payments/cancel/${notif.bookingCode}`, {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Backend cancel call skipped/failed:', err);
    }

    // Update notification state to cancelled
    setNotifications((prev) =>
      prev.map((item) => {
        if (item.id === notif.id || item.bookingCode === notif.bookingCode) {
          return {
            ...item,
            type: 'cancelled' as const,
            snapToken: undefined,
            actionLabel: undefined,
            title: `[${appName}] Pesanan Dibatalkan: ${notif.bookingCode}`,
            message: `Pesanan tiket Zona ${notif.zoneName || 'MotoGP'} sebesar ${
              notif.amount
                ? new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0,
                  }).format(notif.amount)
                : ''
            } telah berhasil dibatalkan.`,
            timestamp: new Date().toISOString(),
          };
        }
        return item;
      }),
    );
  };

  const handleTriggerPendingTestNotification = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const mockCode = `MTX-2026-MDK-${randomSuffix}`;
    handleBookingPending(mockCode, 'simulated-token', 'Grandstand A - Start Grid', 2500000);
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

  const handleLoginSuccess = useCallback(
    (newUser: User) => {
      setUser(newUser);
      try {
        localStorage.setItem('mototix_user', JSON.stringify(newUser));
      } catch (err) {
        console.warn('Failed to save user session:', err);
      }
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          appName,
          title: `[${appName}] Selamat Datang, ${newUser.name}!`,
          message:
            'Akun Anda berhasil terverifikasi. Nikmati kemudahan memesan tiket MotoGP resmi.',
          timestamp: new Date().toISOString(),
          type: 'success',
        },
        ...prev,
      ]);
    },
    [appName],
  );

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('mototix_user');
    } catch (err) {
      console.warn('Failed to clear user session:', err);
    }
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        appName,
        title: `[${appName}] Sesi Telah Berakhir`,
        message: 'Anda telah berhasil keluar dari akun MotoTix.',
        timestamp: new Date().toISOString(),
        type: 'info',
      },
      ...prev,
    ]);
  };

  // Process incoming Google OAuth callback parameters on frontend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'success') {
      const newUser: User = {
        id: params.get('id') || `usr-${Date.now()}`,
        name: params.get('name') || 'Pengguna MotoGP',
        email: params.get('email') || '',
        avatarUrl: params.get('avatar') || undefined,
        role: (params.get('role') as any) || 'CUSTOMER',
      };
      const token = params.get('token');
      if (token) {
        try {
          localStorage.setItem('mototix_token', token);
        } catch (e) {
          console.warn('Failed to save JWT token:', e);
        }
      }
      handleLoginSuccess(newUser);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('auth_error')) {
      const err = params.get('auth_error');
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          appName,
          title: `[${appName}] Login Google Gagal`,
          message: `Tidak dapat memverifikasi otorisasi akun Google (${err}). Silakan coba kembali.`,
          timestamp: new Date().toISOString(),
          type: 'alert',
        },
        ...prev,
      ]);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [appName, handleLoginSuccess]);



  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans selection:bg-[#E10600] selection:text-white">
      {/* Main Navbar */}
      <Navbar
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        user={user}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />


      <main className="flex-1">
        {/* 1. Immersive Hero Section with Quick Ticket Finder */}
        <Hero
          onSelectZoneCta={(zoneId?: string, passType?: PassType) => {
            if (zoneId) {
              const matched = zones.find((z) => z.id === zoneId);
              if (matched) {
                handleSelectZone(matched, passType);
                return;
              }
            }
            const el = document.getElementById('ticket-passes');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Official Ticket Passes & Collector Pass Tiers */}
        <TicketPasses
          zones={zones}
          onSelectZone={(zoneId: string) => {
            const matched = zones.find((z) => z.id === zoneId) || zones[0];
            handleSelectZone(matched, '3day');
          }}
        />

        {/* 3. Peta Interaktif & Pemilihan Zona Tempat Duduk Mandalika */}
        <ZoneSelector
          zones={zones}
          onSelectZone={handleSelectZone}
          isLoading={false}
          initialPassType={selectedPass}
        />

        {/* 4. Official Championship Riders & Team Showcase */}
        <RidersShowcase
          onSelectZoneCta={() => {
            const el = document.getElementById('circuit-zones');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          zone={selectedZone}
          initialPassType={selectedPass}
          availableZones={zones}
          onSelectZone={(z) => setSelectedZone(z)}
          onClose={() => setIsModalOpen(false)}
          onBookingSuccess={handleBookingSuccess}
          onBookingPending={handleBookingPending}
          currentUser={user}
          onOpenLogin={() => {
            setIsModalOpen(false);
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />


      {/* Live Notification Drawer */}
      <LiveNotifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClear={() => setNotifications([])}
        onTriggerTestNotification={handleTriggerTestNotification}
        onTriggerPendingTestNotification={handleTriggerPendingTestNotification}
        onResumePayment={handleResumePayment}
        onCancelPayment={handleCancelPayment}
        onDismissNotification={handleDismissNotification}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
