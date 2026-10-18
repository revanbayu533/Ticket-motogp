export interface Zone {
  id: string;
  eventId: string;
  name: string;
  capacity: number;
  price: number | string;
  description?: string;
  availableSeats?: number;
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
  type?: 'info' | 'success' | 'alert';
}
