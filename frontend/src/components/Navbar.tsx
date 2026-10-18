import React from 'react';
import { Flag, Bell, Ticket, ChevronRight } from 'lucide-react';
import { AppNotification } from '../types';

interface NavbarProps {
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  notifications,
  onOpenNotifications,
  backendOnline,
}) => {
  const appName = import.meta.env.VITE_APP_NAME || 'MotoTix';

  return (
    <header className="sticky top-0 z-50 bg-[#0c0d12]/90 backdrop-blur-md border-b border-[#20222e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E10600] to-[#8A0000] flex items-center justify-center shadow-lg shadow-red-950/40 border border-red-500/30">
              <Flag className="w-6 h-6 text-white transform -rotate-12" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-white font-racing">
                  {appName}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[#E10600] text-white px-2 py-0.5 rounded-full">
                  MotoGP™
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Official Ticketing Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#events"
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Grand Prix Events
            </a>
            <a
              href="#circuit-zones"
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Circuit Zones & Pricing
            </a>
            <a
              href="#booking-guide"
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Booking Guide
            </a>
            <a
              href="http://localhost:3001/api/docs"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-gray-400 hover:text-[#00F0FF] transition-colors flex items-center space-x-1"
            >
              <span>Swagger API</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-4">
            {/* Backend Status Indicator */}
            <div
              className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                backendOnline
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}
              />
              <span>{backendOnline ? 'API Connected' : 'Connecting API...'}</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#2a2d3d] text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E10600] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0c0d12]">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <a
              href="#circuit-zones"
              className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-[#E10600] to-[#b80500] hover:from-[#f00700] hover:to-[#c70500] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-red-900/30 transition-all transform hover:-translate-y-0.5"
            >
              <Ticket className="w-4 h-4" />
              <span>Pesan Tiket</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
