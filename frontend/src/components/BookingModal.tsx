import React, { useState } from 'react';
import { Zone, Order, Ticket } from '../types';
import { X, CheckCircle2, QrCode, ShieldCheck, CreditCard } from 'lucide-react';

interface BookingModalProps {
  zone: Zone | null;
  onClose: () => void;
  onBookingSuccess: (order: Order, notificationTitle: string, notificationMsg: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ zone, onClose, onBookingSuccess }) => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('Bastian Ramadhan');
  const [email, setEmail] = useState('bastian@mototix.com');
  const [phone, setPhone] = useState('+6281234567890');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!zone) return null;

  const unitPrice = typeof zone.price === 'string' ? parseFloat(zone.price) : zone.price;
  const totalPrice = unitPrice * quantity;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingCode = `MTX-2026-MDK-${randomSuffix}`;

    const tickets: Ticket[] = Array.from({ length: quantity }, (_, idx) => ({
      id: `tkt-${Date.now()}-${idx}`,
      ticketNumber: `TKT-${zone.name.includes('VIP') ? 'VIP' : 'GS'}-${randomSuffix}-${idx + 1}`,
      orderId: `ord-${Date.now()}`,
      zoneId: zone.id,
      holderName: name,
      holderEmail: email,
      status: 'ACTIVE',
    }));

    const order: Order = {
      id: `ord-${Date.now()}`,
      bookingCode,
      userId: 'user-bastian',
      totalAmount: totalPrice,
      status: 'PAID',
      createdAt: new Date().toISOString(),
      tickets,
      payment: {
        paymentMethod: 'BCA Virtual Account / QRIS Instant',
        paymentStatus: 'SUCCESS',
        amount: totalPrice,
      },
    };

    setCreatedOrder(order);
    setStep('success');

    const notificationTitle = `[${appName}] Booking Berhasil: ${bookingCode}`;
    const notificationMsg = `Pemesanan ${quantity}x tiket ${zone.name} telah terbit. E-Ticket resmi siap digunakan.`;
    onBookingSuccess(order, notificationTitle, notificationMsg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#141620] border border-[#272b3c] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#222536] bg-[#10121a]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-pulse" />
            <h3 className="text-lg font-bold text-white font-racing">
              {step === 'form' ? `Pemesanan Tiket - ${appName}` : 'E-Ticket Resmi Diterbitkan'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f2231] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleConfirmBooking} className="p-6 space-y-5">
            {/* Selected Zone Card */}
            <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#222536] space-y-1">
              <div className="text-[11px] font-bold text-[#E10600] uppercase tracking-wider">
                Zona Terpilih
              </div>
              <div className="text-base font-bold text-white">{zone.name}</div>
              <div className="text-xs text-gray-400">Pertamina Mandalika International Circuit</div>
              <div className="text-sm font-black text-[#00F0FF] pt-1">
                {formatPrice(unitPrice)}{' '}
                <span className="text-xs font-normal text-gray-400">/ orang</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Jumlah Tiket
              </label>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                      quantity === num
                        ? 'bg-[#E10600] border-red-500 text-white shadow-md shadow-red-950/40'
                        : 'bg-[#181a25] border-[#292c3d] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {num} Tiket
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Nama Lengkap (Sesuai KTP / Paspor)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0e1017] border border-[#282b3d] rounded-xl text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email Konfirmasi E-Ticket
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0e1017] border border-[#282b3d] rounded-xl text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Nomor WhatsApp Aktif
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0e1017] border border-[#282b3d] rounded-xl text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            {/* Total Payment Bar */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#171924] to-[#12131b] border border-[#292d3f] flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Total Pembayaran ({quantity} pax)</div>
                <div className="text-xl font-black text-white">{formatPrice(totalPrice)}</div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Instan Konfirmasi</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#E10600] to-[#b30500] hover:from-[#f00700] hover:to-[#c70500] text-white font-bold rounded-xl shadow-lg shadow-red-900/40 text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Konfirmasi & Terbitkan Tiket</span>
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-950/60 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">Pembayaran Sukses & Terverifikasi!</h4>
              <p className="text-xs text-gray-400 mt-1">
                E-Ticket resmi telah berhasil diterbitkan oleh sistem {appName}.
              </p>
            </div>

            {/* E-Ticket Card Mock */}
            {createdOrder && (
              <div className="bg-[#0b0c11] rounded-2xl p-5 border border-red-500/30 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#E10600] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-bl-lg">
                  VALID ENTRY
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Kode Booking Unik
                    </div>
                    <div className="text-lg font-black text-[#00F0FF] font-mono tracking-wider">
                      {createdOrder.bookingCode}
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-lg text-black">
                    <QrCode className="w-10 h-10" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300 border-t border-[#1e212f] pt-3">
                  <div>
                    <span className="text-gray-500">Nama Pemegang:</span>{' '}
                    <strong className="text-white">{name}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Zona Sirkuit:</span>{' '}
                    <strong className="text-white">{zone.name}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Tiket:</span>{' '}
                    <strong className="text-white">{quantity} Pass (Terusan 3 Hari)</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Metode Bayar:</span>{' '}
                    <strong className="text-emerald-400">QRIS / Instant Verified</strong>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#1e2130] hover:bg-[#282c40] text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Tutup & Lihat Notifikasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
