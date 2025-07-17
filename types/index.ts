export interface User {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface TontineGroup {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'biweekly';
  members: TontineMember[];
  currentRound: number;
  totalRounds: number;
  startDate: string;
  status: 'active' | 'completed' | 'paused';
  createdBy: string;
  createdAt: string;
}

export interface TontineMember {
  id: string;
  userId: string;
  name: string;
  phone: string;
  position: number;
  hasReceived: boolean;
  joinedAt: string;
}

export interface Payment {
  id: string;
  groupId: string;
  userId: string;
  amount: number;
  round: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'airtel' | 'mpesa' | 'orange' | 'cash';
  createdAt: string;
  paidAt?: string;
}

export interface TontineRound {
  id: string;
  groupId: string;
  roundNumber: number;
  beneficiaryId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  payments: Payment[];
  status: 'active' | 'completed' | 'pending';
}