import React from 'react';
import { AppNotification } from '../types';
import { Bell, X, CheckCircle, AlertCircle, Info, Radio, Trash2 } from 'lucide-react';

interface LiveNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onClear: () => void;
  onTriggerTestNotification: () => void;
}

export const LiveNotifications: React.FC<LiveNotificationsProps> = ({
  isOpen,
  onClose,
  notifications,
  onClear,
  onTriggerTestNotification,
}) => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';

  if (!isOpen) return null;

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-[#E10600] shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />;
    }
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
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="p-3 bg-[#161824] border-b border-[#222537] flex items-center justify-between text-xs">
        <button
          onClick={onTriggerTestNotification}
          className="flex items-center space-x-1.5 text-xs text-[#00F0FF] hover:text-white transition-colors bg-[#1d2133] px-2.5 py-1.5 rounded-lg border border-[#2b3049] cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Simulasi Siaran Live</span>
        </button>

        {notifications.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-2">
            <Bell className="w-8 h-8 opacity-30" />
            <p className="text-xs">Belum ada notifikasi baru.</p>
            <p className="text-[11px] text-gray-600">
              Notifikasi pesanan dan info tiket dari {appName} akan muncul di sini secara otomatis.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#171924] border border-[#262a3d] space-y-1.5 transition-all hover:border-gray-600"
            >
              <div className="flex items-start space-x-2">
                {getIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white leading-tight">{item.title}</div>
                  <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{item.message}</p>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 text-right font-mono">
                {new Date(item.timestamp).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="p-3 bg-[#0d0e14] border-t border-[#1f2231] text-[11px] text-gray-500 text-center">
        Semua judul siaran memakai prefix resmi{' '}
        <strong className="text-gray-300">[{appName}]</strong>
      </div>
    </div>
  );
};
