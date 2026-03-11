export type Screen = 'dashboard' | 'markets' | 'portfolio' | 'staking' | 'transactions' | 'alerts' | 'learn' | 'lesson' | 'quiz' | 'login' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrador' | 'editor' | 'financeiro' | 'view';
  status: 'active' | 'inactive';
  avatar: string;
}

export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'STAKE' | 'TRANSFER' | 'RECEIVE';
  asset: string;
  amount: number;
  price: number;
  totalValue: number;
  fee: string;
  status: 'Completed' | 'Pending' | 'Failed';
  hash: string;
}

export interface Alert {
  id: string;
  asset: string;
  condition: string;
  targetPrice: number;
  currentPrice: number;
  active: boolean;
}
