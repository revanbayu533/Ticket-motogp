import React from 'react';
import { AppNotification } from '../types';
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Radio,
  Trash2,
  CreditCard,
  ChevronRight,
  Clock,
  Ticket,
  XCircle,
} from 'lucide-react';

interface LiveNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onClear: () => void;
  onTriggerTestNotification: () => void;
  onTriggerPendingTestNotification?: () => void;
  onResumePayment?: (notification: AppNotification) => void;
  onCancelPayment?: (notification: AppNotification) => void;
  onDismissNotification?: (id: string) => void;
}

export const LiveNotifications: React.FC<LiveNotificationsProps> = ({
  isOpen,
  onClose,
  notifications,
  onClear,
  onTriggerTestNotification,
  onTriggerPendingTestNotification,
  onResumePayment,
  onCancelPayment,
  onDismissNotification,
}) => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';

  if (!isOpen) return null;

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-[#E10600] shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />;
    }
  };

  const formatPrice = (amount?: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#11131c] border-l border-[#232637] shadow-2xl flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="p-5 border-b border-[#222537] flex items-center justify-between bg-[#0e1017]">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/30 text-[#E10600]">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-racing tracking-wide uppercase">
              {appName} Live Feed
            </h3>
            <p className="text-[11px] text-gray-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Pusher WebSocket Aktif (Cluster: ap1)</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1d202d] transition-colors"
          title="Tutup Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="p-2.5 bg-[#161824] border-b border-[#222537] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          <button
            onClick={onTriggerTestNotification}
            className="flex items-center space-x-1 text-[11px] text-[#00F0FF] hover:text-white transition-colors bg-[#1d2133] px-2 py-1 rounded-lg border border-[#2b3049] cursor-pointer shrink-0"
            title="Simulasi siaran update sirkuit"
          >
            <Radio className="w-3 h-3" />
            <span>Siaran Live</span>
          </button>

          {onTriggerPendingTestNotification && (
            <button
              onClick={onTriggerPendingTestNotification}
              className="flex items-center space-x-1 text-[11px] text-amber-300 hover:text-white transition-colors bg-amber-950/40 hover:bg-amber-900/60 px-2 py-1 rounded-lg border border-amber-500/30 cursor-pointer shrink-0"
              title="Simulasi pesanan yang belum dibayar"
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>+ Tes Belum Bayar</span>
            </button>
          )}
        </div>

        {notifications.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors shrink-0 text-[11px]"
            title="Bersihkan semua notifikasi"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus</span>
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-2">
            <Bell className="w-8 h-8 opacity-30" />
            <p className="text-xs">Belum ada notifikasi baru.</p>
            <p className="text-[11px] text-gray-600">
              Notifikasi pesanan dan tagihan tiket dari {appName} akan tersimpan di sini.
            </p>
          </div>
        ) : (
          notifications.map((item) => {
            const isPending =
              (item.type === 'pending' || Boolean(item.snapToken)) &&
              item.type !== 'cancelled';
            const isCancelled = item.type === 'cancelled';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isPending
                    ? 'bg-gradient-to-br from-[#1d1920] to-[#141522] border-amber-500/40 shadow-lg shadow-amber-950/20'
                    : isCancelled
                    ? 'bg-[#151620] border-red-500/30 opacity-90'
                    : 'bg-[#171924] border-[#262a3d] hover:border-gray-600'
                }`}
              >
                {/* Header item with Badge */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-start space-x-2">
                    {getIcon(item.type)}
                    <div>
                      {isPending && (
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold tracking-wider uppercase mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          <span>Belum Dibayar</span>
                        </div>
                      )}
                      {isCancelled && (
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold tracking-wider uppercase mb-1">
                          <span>Dibatalkan</span>
                        </div>
                      )}
                      <div className="text-xs font-bold text-white leading-tight">
                        {item.title}
                      </div>
                    </div>
                  </div>

                  {onDismissNotification && (
                    <button
                      onClick={() => onDismissNotification(item.id)}
                      className="text-gray-500 hover:text-red-400 p-0.5 rounded hover:bg-[#20222f] transition-colors"
                      title="Hapus notifikasi ini"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Message */}
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed pl-6">
                  {item.message}
                </p>

                {/* Detail summary for pending & cancelled items */}
                {(isPending || isCancelled) && (item.bookingCode || item.amount || item.zoneName) && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-[#0c0d13] border border-[#23273c] space-y-1 text-xs">
                    {item.bookingCode && (
                      <div className="flex items-center justify-between text-gray-400 text-[11px]">
                        <span>Kode Pesanan:</span>
                        <span className="font-mono font-bold text-white tracking-wide">
                          {item.bookingCode}
                        </span>
                      </div>
                    )}
                    {item.zoneName && (
                      <div className="flex items-center justify-between text-gray-400 text-[11px]">
                        <span>Zona:</span>
                        <span className="text-gray-200 font-semibold">{item.zoneName}</span>
                      </div>
                    )}
                    {item.amount && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#1d2031] text-[11px]">
                        <span className="text-gray-400 font-semibold">Total Tagihan:</span>
                        <span className={isCancelled ? 'text-gray-400 line-through' : 'text-amber-400 font-black'}>
                          {formatPrice(item.amount)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Resume Payment & Cancel Payment Buttons */}
                {isPending && (
                  <div className="space-y-2 mt-3">
                    <button
                      type="button"
                      onClick={() => onResumePayment && onResumePayment(item)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E10600] to-[#b30500] hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer group active:scale-[0.98]"
                    >
                      <CreditCard className="w-4 h-4 text-white" />
                      <span>{item.actionLabel || 'Lanjutkan Pembayaran Sekarang'}</span>
                      <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onCancelPayment && onCancelPayment(item)}
                      className="w-full py-2 px-3 rounded-xl bg-[#141520] hover:bg-red-950/40 text-gray-400 hover:text-red-300 border border-[#2b2f45] hover:border-red-500/40 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>Batalkan Pembayaran</span>
                    </button>
                  </div>
                )}

                {/* Cancelled status badge */}
                {isCancelled && (
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-red-400 bg-red-950/30 border border-red-500/20 px-2.5 py-1.5 rounded-lg">
                    <span className="flex items-center space-x-1.5">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>Pesanan Telah Dibatalkan</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold">BATAL</span>
                  </div>
                )}

                {/* E-Ticket status badge for success */}
                {item.type === 'success' && item.bookingCode && (
                  <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-1 rounded-lg">
                    <span className="flex items-center space-x-1">
                      <Ticket className="w-3.5 h-3.5" />
                      <span>E-Ticket Aktif ({item.bookingCode})</span>
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold">LUNAS</span>
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-[10px] text-gray-500 text-right font-mono mt-1.5">
                  {new Date(item.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="p-3 bg-[#0d0e14] border-t border-[#1f2231] text-[11px] text-gray-500 text-center">
        Semua siaran terverifikasi oleh{' '}
        <strong className="text-gray-300">[{appName} Official]</strong>
      </div>
    </div>
  );
};
