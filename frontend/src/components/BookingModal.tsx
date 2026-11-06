import React, { useState, useEffect } from 'react';
import { Zone, Order, Ticket, User, PassType } from '../types';
import {
  X,
  CheckCircle2,
  QrCode,
  Loader2,
  Clock,
  Calendar,
} from 'lucide-react';
import {
  MANDALIKA_OFFICIAL_ZONES,
  getZonePriceByPass,
  getPassLabel,
  getPassBadge,
} from '../data/mandalikaZones';

interface BookingModalProps {
  zone: Zone | null;
  initialPassType?: PassType;
  availableZones?: Zone[];
  onSelectZone?: (zone: Zone) => void;
  onClose: () => void;
  onBookingSuccess: (order: Order, notificationTitle: string, notificationMsg: string) => void;
  onBookingPending?: (bookingCode: string, snapToken: string, zoneName: string, amount: number) => void;
  currentUser?: User | null;
  onOpenLogin?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  zone,
  initialPassType = '3day',
  availableZones,
  onSelectZone,
  onClose,
  onBookingSuccess,
  onBookingPending,
  currentUser,
  onOpenLogin,
}) => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:3001/api'
      : 'https://ticket-motogp.vercel.app/api');

  const zoneList =
    availableZones && availableZones.length > 0
      ? availableZones
      : MANDALIKA_OFFICIAL_ZONES;

  const [activeZone, setActiveZone] = useState<Zone>(zone || zoneList[0]);
  const [selectedPass, setSelectedPass] = useState<PassType>(initialPassType || '3day');

  useEffect(() => {
    if (zone) {
      setActiveZone(zone);
    }
  }, [zone]);

  useEffect(() => {
    if (initialPassType) {
      setSelectedPass(initialPassType);
    }
  }, [initialPassType]);

  // If active zone is VIP, it cannot have daily pass
  useEffect(() => {
    if (
      (activeZone.category === 'VIP_HOSPITALITY' || activeZone.isDailyAvailable === false) &&
      selectedPass !== '3day' &&
      selectedPass !== 'vip'
    ) {
      setSelectedPass('3day');
    }
  }, [activeZone, selectedPass]);

  const handleChooseZoneId = (zoneId: string) => {
    const found = zoneList.find((z) => z.id === zoneId);
    if (found) {
      setActiveZone(found);
      if (
        (found.category === 'VIP_HOSPITALITY' || found.isDailyAvailable === false) &&
        selectedPass !== '3day' &&
        selectedPass !== 'vip'
      ) {
        setSelectedPass('3day');
      }
      if (onSelectZone) onSelectZone(found);
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState(currentUser?.name || 'Bastian Ramadhan');
  const [email, setEmail] = useState(currentUser?.email || 'bastian@mototix.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+6281234567890');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showCircuitMap, setShowCircuitMap] = useState(false);
  const [showZoneList, setShowZoneList] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activeZone) return null;

  const unitPrice = getZonePriceByPass(activeZone, selectedPass);
  const totalPrice = unitPrice * quantity;

  const isVipZone =
    activeZone.category === 'VIP_HOSPITALITY' || activeZone.isDailyAvailable === false;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const finishBookingSuccess = (bookingCode: string, paymentMethod: string) => {
    const randomSuffix = bookingCode.replace('MTX-2026-MDK-', '') || 'GP26';
    const tickets: Ticket[] = Array.from({ length: quantity }, (_, idx) => ({
      id: `tkt-${Date.now()}-${idx}`,
      ticketNumber: `TKT-${activeZone.name.includes('VIP') ? 'VIP' : 'GS'}-${randomSuffix}-${idx + 1}`,
      orderId: `ord-${Date.now()}`,
      zoneId: activeZone.id,
      holderName: name,
      holderEmail: email,
      status: 'ACTIVE',
    }));

    const order: Order = {
      id: `ord-${Date.now()}`,
      bookingCode,
      userId: currentUser?.id || 'guest-user',
      totalAmount: totalPrice,
      status: 'PAID',
      createdAt: new Date().toISOString(),
      tickets,
    };

    setCreatedOrder(order);
    setIsProcessing(false);
    setStep('success');

    const passName = getPassLabel(selectedPass);
    const notifTitle = `[${appName}] E-Ticket Diterbitkan: ${bookingCode}`;
    const notifMsg = `Halo ${name}, pembayaran ${formatPrice(totalPrice)} via ${paymentMethod} untuk ${quantity}x tiket ${activeZone.name} (${passName}) telah terverifikasi.`;
    onBookingSuccess(order, notifTitle, notifMsg);
  };

  const handlePayLater = async () => {
    setIsProcessing(true);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const fallbackBookingCode = `MTX-2026-MDK-${randomSuffix}`;
    const formattedZoneName = `${activeZone.name} (${getPassBadge(selectedPass)})`;

    try {
      const response = await fetch(`${apiBaseUrl}/payments/snap-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneId: activeZone.id,
          zoneName: formattedZoneName,
          quantity,
          unitPrice,
          name,
          email,
          phone,
          userId: currentUser?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const bookingCode = data.bookingCode || fallbackBookingCode;
        if (onBookingPending) {
          onBookingPending(bookingCode, data.snapToken, formattedZoneName, totalPrice);
        }
      } else if (onBookingPending) {
        onBookingPending(fallbackBookingCode, 'simulated-token', formattedZoneName, totalPrice);
      }
    } catch {
      if (onBookingPending) {
        onBookingPending(fallbackBookingCode, 'simulated-token', formattedZoneName, totalPrice);
      }
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const fallbackBookingCode = `MTX-2026-MDK-${randomSuffix}`;
    const formattedZoneName = `${activeZone.name} (${getPassBadge(selectedPass)})`;

    try {
      const response = await fetch(`${apiBaseUrl}/payments/snap-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneId: activeZone.id,
          zoneName: formattedZoneName,
          quantity,
          unitPrice,
          name,
          email,
          phone,
          userId: currentUser?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mendapatkan token pembayaran');
      }

      const data = await response.json();
      const bookingCode = data.bookingCode || fallbackBookingCode;
      const snapToken = data.snapToken;

      if (window.snap && snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: (result: any) => {
            const method = result?.payment_type
              ? result.payment_type.toUpperCase()
              : 'MIDTRANS SNAP';
            finishBookingSuccess(bookingCode, method);
          },
          onPending: () => {
            if (onBookingPending) {
              onBookingPending(bookingCode, snapToken, formattedZoneName, totalPrice);
            }
            onClose();
          },
          onError: () => {
            setPaymentError('Pembayaran gagal atau dibatalkan di gateway.');
            setIsProcessing(false);
          },
          onClose: () => {
            if (onBookingPending) {
              onBookingPending(bookingCode, snapToken, formattedZoneName, totalPrice);
            }
            setIsProcessing(false);
            onClose();
          },
        });
      } else {
        setTimeout(() => {
          finishBookingSuccess(bookingCode, 'SIMULATION / TEST');
        }, 1200);
      }
    } catch (err: any) {
      console.warn('Backend unavailable, running fallback simulation:', err);
      setTimeout(() => {
        finishBookingSuccess(fallbackBookingCode, 'OFFLINE / DEMO');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111216] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <h3 className="text-base font-bold text-white tracking-tight">
            Konfirmasi Tiket MotoGP Mandalika 2026
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleConfirmBooking} className="p-5 space-y-4 overflow-y-auto overscroll-contain flex-1">
            {/* Selected Zone Summary */}
            <div className="p-4 rounded-xl bg-[#16171d] border border-white/[0.08] space-y-3 overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] text-zinc-400 block font-medium">
                    Zona Sirkuit Dipilih
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                    {activeZone.name}
                  </h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-zinc-400 font-medium block">
                    {getPassBadge(selectedPass)}
                  </span>
                  <span className="text-sm font-bold text-white">{formatPrice(unitPrice)}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {activeZone.description}
              </p>

              <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowZoneList(!showZoneList);
                    if (!showZoneList) setShowCircuitMap(false);
                  }}
                  className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#111216] border border-white/10 hover:border-white/25 transition-colors cursor-pointer"
                >
                  {showZoneList ? 'Tutup Pilihan Zona' : 'Ganti Zona'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCircuitMap(!showCircuitMap);
                    if (!showCircuitMap) setShowZoneList(false);
                  }}
                  className="text-xs font-medium text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-[#111216] border border-white/10 hover:border-white/25 transition-colors cursor-pointer"
                >
                  {showCircuitMap ? 'Tutup Peta' : 'Lihat Peta'}
                </button>
              </div>

              {showZoneList && (
                <div className="pt-2 space-y-1 max-h-48 overflow-y-auto overscroll-contain pr-1">
                  {zoneList.map((z) => {
                    const isSelected = z.id === activeZone.id;
                    const zPrice = getZonePriceByPass(z, selectedPass);
                    const isZonVip = z.category === 'VIP_HOSPITALITY' || z.isDailyAvailable === false;
                    const isDailyActive = selectedPass === 'sunday' || selectedPass === 'saturday' || selectedPass === 'friday';

                    return (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => {
                          handleChooseZoneId(z.id);
                          setShowZoneList(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black font-semibold'
                            : 'bg-[#111216] text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div className="min-w-0 flex items-center space-x-1.5">
                          <span className="truncate">{z.name}</span>
                          {isZonVip && isDailyActive && (
                            <span className="text-[10px] text-amber-400/80 shrink-0 font-normal">
                              (Khusus 3-Day)
                            </span>
                          )}
                        </div>
                        <span className={`shrink-0 ${isSelected ? 'text-black' : 'text-zinc-400'}`}>
                          {formatPrice(zPrice)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {showCircuitMap && (
                <div className="pt-2">
                  <img
                    src="/mandalika-circuit-map.jpg"
                    alt="Peta Sirkuit Mandalika"
                    className="w-full max-h-48 object-contain rounded-lg bg-black border border-white/10"
                  />
                </div>
              )}
            </div>

            {/* Pass Duration Picker (3-Day Pass vs Daily Pass) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-400 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E10600]" />
                  <span>Kategori Durasi Tiket</span>
                </label>
                <span className="text-[11px] text-zinc-400 font-medium">
                  {getPassLabel(selectedPass)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPass('3day')}
                  className={`py-2 px-2 rounded-lg text-xs border text-center transition-colors cursor-pointer ${
                    selectedPass === '3day' || selectedPass === 'vip'
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-[#16171d] text-zinc-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="block font-semibold">3-Day Pass</span>
                  <span className="text-[10px] block opacity-70">Jum–Min</span>
                </button>

                <button
                  type="button"
                  disabled={isVipZone}
                  onClick={() => setSelectedPass('sunday')}
                  className={`py-2 px-2 rounded-lg text-xs border text-center transition-colors ${
                    isVipZone
                      ? 'bg-zinc-900/30 text-zinc-600 border-white/[0.04] cursor-not-allowed'
                      : selectedPass === 'sunday'
                      ? 'bg-white text-black border-white font-bold cursor-pointer'
                      : 'bg-[#16171d] text-zinc-300 border-white/10 hover:border-white/20 cursor-pointer'
                  }`}
                >
                  <span className="block font-semibold">Minggu</span>
                  <span className="text-[10px] block opacity-70">Race Day</span>
                </button>

                <button
                  type="button"
                  disabled={isVipZone}
                  onClick={() => setSelectedPass('saturday')}
                  className={`py-2 px-2 rounded-lg text-xs border text-center transition-colors ${
                    isVipZone
                      ? 'bg-zinc-900/30 text-zinc-600 border-white/[0.04] cursor-not-allowed'
                      : selectedPass === 'saturday'
                      ? 'bg-white text-black border-white font-bold cursor-pointer'
                      : 'bg-[#16171d] text-zinc-300 border-white/10 hover:border-white/20 cursor-pointer'
                  }`}
                >
                  <span className="block font-semibold">Sabtu</span>
                  <span className="text-[10px] block opacity-70">Sprint</span>
                </button>

                <button
                  type="button"
                  disabled={isVipZone}
                  onClick={() => setSelectedPass('friday')}
                  className={`py-2 px-2 rounded-lg text-xs border text-center transition-colors ${
                    isVipZone
                      ? 'bg-zinc-900/30 text-zinc-600 border-white/[0.04] cursor-not-allowed'
                      : selectedPass === 'friday'
                      ? 'bg-white text-black border-white font-bold cursor-pointer'
                      : 'bg-[#16171d] text-zinc-300 border-white/10 hover:border-white/20 cursor-pointer'
                  }`}
                >
                  <span className="block font-semibold">Jumat</span>
                  <span className="text-[10px] block opacity-70">Practice</span>
                </button>
              </div>

              {isVipZone && (
                <p className="text-[11px] text-amber-400/90 pt-0.5">
                  * VIP Hospitality (Royal Box Suites) resmi hanya tersedia dalam varian Weekend Pass 3 Hari.
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Jumlah Tiket
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      quantity === num
                        ? 'bg-white text-black border-white'
                        : 'bg-[#16171d] border-white/[0.08] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {num} Tiket
                  </button>
                ))}
              </div>
            </div>

            {/* Buyer Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Data Pemesan</span>
                {!currentUser && onOpenLogin && (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="text-xs text-[#E10600] hover:underline cursor-pointer"
                  >
                    Masuk akun
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Nama Lengkap (Sesuai KTP/Paspor)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#16171d] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#16171d] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#16171d] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {paymentError && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/30 rounded-lg p-2.5">
                {paymentError}
              </p>
            )}

            {/* Total & Actions */}
            <div className="pt-3 border-t border-white/[0.08] space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">Total Pembayaran ({quantity} tiket)</span>
                  <span className="text-[11px] text-zinc-500">{getPassBadge(selectedPass)} • {activeZone.name}</span>
                </div>
                <span className="text-lg font-bold text-white">{formatPrice(totalPrice)}</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-[#E10600] hover:bg-[#c70500] text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Bayar Sekarang</span>
                )}
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayLater}
                className="w-full py-2 px-4 text-zinc-400 hover:text-white text-xs font-medium transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Simpan & Bayar Nanti</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-5 text-center overflow-y-auto flex-1">
            <div className="w-12 h-12 bg-white/[0.06] rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Pemesanan Terkonfirmasi</h4>
              <p className="text-xs text-zinc-400 mt-1">
                E-Ticket resmi Anda telah diterbitkan.
              </p>
            </div>

            {createdOrder && (
              <div className="bg-[#16171d] rounded-xl p-4 border border-white/10 text-left space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                  <div>
                    <div className="text-[10px] uppercase text-zinc-500">Kode Booking</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {createdOrder.bookingCode}
                    </div>
                  </div>
                  <div className="p-1.5 bg-white rounded text-black">
                    <QrCode className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Pemegang Tiket</span>
                    <span className="text-zinc-200 font-medium">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Zona</span>
                    <span className="text-zinc-200 font-medium">{activeZone.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Kategori Durasi</span>
                    <span className="text-zinc-200 font-medium">{getPassLabel(selectedPass)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Jumlah</span>
                    <span className="text-zinc-200 font-medium">{quantity} Tiket ({getPassBadge(selectedPass)})</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white text-black hover:bg-zinc-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
