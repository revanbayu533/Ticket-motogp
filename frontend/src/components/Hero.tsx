import React from 'react';
import { Calendar, MapPin, Gauge, Shield, Zap, Sparkles } from 'lucide-react';

interface HeroProps {
  onSelectZoneCta: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectZoneCta }) => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';

  return (
    <div className="relative overflow-hidden bg-carbon pt-12 pb-20 border-b border-[#20222e]">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-red-600/15 via-red-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and Info */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Grand Prix Partner 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-racing">
              PERTAMINA GRAND PRIX OF INDONESIA <span className="text-[#E10600]">2026</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              Rasakan sensasi gemuruh knalpot prototipe MotoGP kelas dunia langsung dari tepi pantai
              eksotis Mandalika. Dapatkan tiket resmi, akses VIP Village, serta tribun strategis di
              platform <strong className="text-white">{appName}</strong>.
            </p>

            {/* Key Event Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#171922] border border-[#272a3b]">
                <Calendar className="w-5 h-5 text-[#E10600] shrink-0" />
                <div>
                  <div className="text-xs text-gray-400 font-medium">Jadwal Balapan</div>
                  <div className="text-sm font-bold text-white">16 - 18 Oktober 2026</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#171922] border border-[#272a3b]">
                <MapPin className="w-5 h-5 text-[#00F0FF] shrink-0" />
                <div>
                  <div className="text-xs text-gray-400 font-medium">Lokasi Sirkuit</div>
                  <div className="text-sm font-bold text-white">Mandalika, Lombok</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#171922] border border-[#272a3b]">
                <Gauge className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs text-gray-400 font-medium">Karakter Trek</div>
                  <div className="text-sm font-bold text-white">4.31 km • 17 Turns</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onSelectZoneCta}
                className="bg-gradient-to-r from-[#E10600] to-[#b30500] hover:from-[#f00700] hover:to-[#c70500] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-red-900/40 text-base transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Pilih Zona & Beli Tiket</span>
              </button>

              <div className="flex items-center space-x-2 text-xs text-gray-400 px-4 py-3 rounded-xl bg-[#14161f] border border-[#232635]">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Garansi 100% E-Ticket Resmi & Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#2b2e40] bg-[#141620] shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80"
                alt="Pertamina Mandalika International Circuit"
                className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-[#0e1017]/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-md">
                    Tiket Early Bird Dibuka
                  </span>
                  <span className="text-xs text-gray-300 font-mono">Status: Penjualan Aktif</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Pertamina Mandalika International Circuit
                </h3>
                <p className="text-xs text-gray-300">
                  Nikmati pengalaman balap motor paling bergengsi dengan 5 kategori zona tribun dan
                  fasilitas VIP hospitality kelas dunia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
