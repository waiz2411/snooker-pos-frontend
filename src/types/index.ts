export interface Club {
  id: string;
  clubName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  status: 'active' | 'deactivated';
  paymentStatus: 'paid' | 'unpaid';
  expiryDate: string;
  lastPaidDate: string;
  createdAt: string;
}

export interface Table {
  id: string;
  clubId: string;
  name: string;
  number: number;
  type: string;
  status: 'free' | 'occupied';
  gameStartTime?: string;
  pricingType?: 'per-minute' | 'fixed';
  currentGameId?: string;
}

export interface Customer {
  id: string;
  clubId: string;
  name: string;
  billedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  createdAt: string;
  lastActivity: string;
}

export interface Game {
  id: string;
  clubId: string;
  tableId: string;
  player1Id: string;
  player2Id: string;
  pricingType: 'per-minute' | 'fixed';
  pricePerMinute?: number;
  fixedPrice?: number;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed';
  loserId?: string;
  totalAmount: number;
  duration?: number;
}

export interface Analytics {
  totalTables: number;
  activeGames: number;
  completedGamesToday: number;
  totalEarningsToday: number;
}
