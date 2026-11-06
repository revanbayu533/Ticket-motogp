import React, { useState } from 'react';
import { ArrowRight, QrCode, CreditCard, Landmark, Lock, CheckCircle2 } from 'lucide-react';

interface CheckoutSummaryBannerProps {
  onOpenCheckout: (zoneId: string) => void;
}

export const CheckoutSummaryBanner: React.FC<CheckoutSummaryBannerProps> = ({ onOpenCheckout }) => {
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'bca' | 'mandiri' | 'cc'>('qris');

  return (
    <section id="checkout-banner" className="py-16 bg-[#0a0b10] border-b border-[#1f2230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#12141c] border border-[#2b3044] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Order Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 text-[11px] font-black tracking-widest text-[#E10600] uppercase">
                <span className="w-2.5 h-1 bg-[#E10600] rounded-full" />
                <span>Ringkasan Pemesanan Resmi</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-racing">
                SIAP MENGUNCI TIKET MANDALIKA 2026 ANDA
              </h2>
              <p className="text-xs text-gray-400">
                Pilih metode pembayaran instan untuk mengamankan nomor kursi tribun resmi sebelum kuota habis.
              </p>

              {/* Price Breakdown List */}
              <div className="space-y-2.5 pt-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 text-gray-300">
                  <span className="font-semibold">GRANDSTAND A - 3-DAY WEEKEND PASS (1 Kursi)</span>
                  <span className="font-mono text-white">Rp 2.450.000</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Pajak Hiburan Daerah (PB1 10%)</span>
                  <span className="font-mono">Rp 245.000</span>
                </div>
                <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-white/5">
                  <span>Biaya Layanan & Penerbitan E-Ticket QRIS</span>
                  <span className="font-mono">Rp 25.000</span>
                </div>

                {/* Total */}
                <div className="flex items-baseline justify-between pt-2">
                  <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Total Pembayaran:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#E10600] font-racing">
                    Rp 2.720.000
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Method Picker & CTA Button */}
            <div className="lg:col-span-5 rounded-2xl bg-[#171924] border border-[#2d3246] p-5 sm:p-6 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Pilih Metode Pembayaran Cepat
                </span>
                <p className="text-xs text-gray-300">
                  Didukung verifikasi otomatis real-time Midtrans
                </p>
              </div>

              {/* 4 Method Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('qris')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    selectedMethod === 'qris'
                      ? 'bg-red-950/40 border-[#E10600] text-white shadow'
                      : 'bg-[#1b1e2b] border-[#292f44] text-gray-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#E10600]" />
                  <span>QRIS Instan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('bca')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    selectedMethod === 'bca'
                      ? 'bg-red-950/40 border-[#E10600] text-white shadow'
                      : 'bg-[#1b1e2b] border-[#292f44] text-gray-400 hover:text-white'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  <span>BCA VA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('mandiri')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    selectedMethod === 'mandiri'
                      ? 'bg-red-950/40 border-[#E10600] text-white shadow'
                      : 'bg-[#1b1e2b] border-[#292f44] text-gray-400 hover:text-white'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-cyan-400" />
                  <span>Mandiri VA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('cc')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    selectedMethod === 'cc'
                      ? 'bg-red-950/40 border-[#E10600] text-white shadow'
                      : 'bg-[#1b1e2b] border-[#292f44] text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Kartu Kredit</span>
                </button>
              </div>

              {/* Big Red CTA Button */}
              <button
                type="button"
                onClick={() => onOpenCheckout('zone-prem-a')}
                className="w-full py-4 rounded-xl bg-[#E10600] hover:bg-[#c70500] text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl shadow-red-950/60 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>LANJUT KE PEMBAYARAN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-400 text-center">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Enkripsi 256-Bit SSL</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>Midtrans Verified Partner</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
