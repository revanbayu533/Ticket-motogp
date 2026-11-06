export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  role?: 'CUSTOMER' | 'ADMIN' | 'ORGANIZER';
}

export type PassType = '3day' | 'sunday' | 'saturday' | 'friday' | 'vip';

export interface Zone {
  id: string;
  eventId: string;
  name: string;
  category?: 'PREMIUM_GRANDSTAND' | 'REGULAR_GRANDSTAND' | 'GENERAL_ADMISSION' | 'VIP_HOSPITALITY' | string;
  categoryLabel?: string;
  capacity: number;
  price: number | string;
  description?: string;
  availableSeats?: number;
  dailyPriceSunday?: number;
  dailyPriceSaturday?: number;
  dailyPriceFriday?: number;
  isDailyAvailable?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  venue?: string;
  eventDate: string;
  bannerUrl?: string;
  status: string;
  zones: Zone[];
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  orderId: string;
  zoneId: string;
  holderName: string;
  holderEmail: string;
  status: string;
}

export interface Order {
  id: string;
  bookingCode: string;
  userId: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
  tickets?: Ticket[];
  payment?: {
    paymentMethod: string;
    paymentStatus: string;
    amount: number;
  };
}

export interface AppNotification {
  id: string;
  appName: string;
  title: string;
  message: string;
  timestamp: string;
  type?: 'info' | 'success' | 'alert' | 'pending' | 'cancelled';
  snapToken?: string;
  bookingCode?: string;
  amount?: number;
  zoneName?: string;
  actionLabel?: string;
}

