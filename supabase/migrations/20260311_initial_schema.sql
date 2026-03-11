-- Initial Schema for Nilton

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('administrador', 'editor', 'financeiro', 'view')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market Assets Table
CREATE TABLE IF NOT EXISTS market_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  symbol TEXT UNIQUE NOT NULL,
  price NUMERIC NOT NULL,
  change24h NUMERIC NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL', 'STAKE', 'TRANSFER', 'RECEIVE')),
  asset TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  total_value NUMERIC NOT NULL,
  fee TEXT,
  status TEXT NOT NULL CHECK (status IN ('Completed', 'Pending', 'Failed')),
  hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  asset TEXT NOT NULL,
  condition TEXT NOT NULL,
  target_price NUMERIC NOT NULL,
  current_price NUMERIC NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Data (Optional, but useful for initial setup)
-- Note: These IDs are placeholders, in a real migration you'd let Supabase generate them or use specific UUIDs.

INSERT INTO users (name, email, role, status, avatar)
VALUES 
  ('Ricardo Pereira', 'ricardo@cryptolusitano.pt', 'administrador', 'active', 'https://picsum.photos/seed/ricardo/100/100'),
  ('Maria Silva', 'maria@cryptolusitano.pt', 'editor', 'active', 'https://picsum.photos/seed/maria/100/100'),
  ('João Santos', 'joao@cryptolusitano.pt', 'financeiro', 'inactive', 'https://picsum.photos/seed/joao/100/100'),
  ('Ana Costa', 'ana@cryptolusitano.pt', 'view', 'active', 'https://picsum.photos/seed/ana/100/100')
ON CONFLICT (email) DO NOTHING;

INSERT INTO market_assets (name, symbol, price, change24h, color)
VALUES 
  ('Bitcoin', 'BTC', 64231.50, 2.4, '#F7931A'),
  ('Ethereum', 'ETH', 3452.12, -1.2, '#627EEA'),
  ('Solana', 'SOL', 145.67, 5.8, '#14F195'),
  ('Cardano', 'ADA', 0.45, -0.5, '#0033AD')
ON CONFLICT (symbol) DO NOTHING;
