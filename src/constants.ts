import { MarketAsset, Transaction, User } from './types';

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'Ricardo Pereira', email: 'ricardo@cryptolusitano.pt', role: 'administrador', status: 'active', avatar: 'https://picsum.photos/seed/ricardo/100/100' },
  { id: '2', name: 'Maria Silva', email: 'maria@cryptolusitano.pt', role: 'editor', status: 'active', avatar: 'https://picsum.photos/seed/maria/100/100' },
  { id: '3', name: 'João Santos', email: 'joao@cryptolusitano.pt', role: 'financeiro', status: 'inactive', avatar: 'https://picsum.photos/seed/joao/100/100' },
  { id: '4', name: 'Ana Costa', email: 'ana@cryptolusitano.pt', role: 'view', status: 'active', avatar: 'https://picsum.photos/seed/ana/100/100' },
];

export const MARKET_ASSETS: MarketAsset[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 64231, change24h: 1.2, color: '#f7931a' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3450, change24h: 0.8, color: '#627eea' },
  { id: '3', name: 'Solana', symbol: 'SOL', price: 145.6, change24h: -2.4, color: '#14f195' },
  { id: '4', name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: 0.1, color: '#0033ad' },
  { id: '5', name: 'Polkadot', symbol: 'DOT', price: 7.23, change24h: -1.5, color: '#e6007a' },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2023-11-24 14:22:10',
    type: 'BUY',
    asset: 'BTC',
    amount: 0.05,
    price: 37420,
    totalValue: 1871,
    fee: '0.00002 BTC',
    status: 'Completed',
    hash: '0x7f2...a9d'
  },
  {
    id: '2',
    date: '2023-11-24 12:05:44',
    type: 'SELL',
    asset: 'ETH',
    amount: 2.0,
    price: 2110.45,
    totalValue: 4220.9,
    fee: '$5.20',
    status: 'Completed',
    hash: '0x4a1...c0e'
  },
  {
    id: '3',
    date: '2023-11-23 18:40:12',
    type: 'STAKE',
    asset: 'DOT',
    amount: 100.0,
    price: 5.12,
    totalValue: 512,
    fee: '0.00',
    status: 'Completed',
    hash: '0x9e3...b21'
  },
  {
    id: '4',
    date: '2023-11-23 16:12:00',
    type: 'TRANSFER',
    asset: 'SOL',
    amount: 45.5,
    price: 58.9,
    totalValue: 2679.95,
    fee: '0.00001 SOL',
    status: 'Pending',
    hash: '0x3f1...e98'
  },
  {
    id: '5',
    date: '2023-11-23 10:45:33',
    type: 'BUY',
    asset: 'ADA',
    amount: 5000,
    price: 0.38,
    totalValue: 1900,
    fee: '$0.95',
    status: 'Completed',
    hash: '0x8a2...f03'
  }
];
