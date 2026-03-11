import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Layers, 
  History, 
  Bell, 
  GraduationCap, 
  Settings,
  LogOut,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  Lock,
  MoreHorizontal,
  Circle,
  ShoppingBag,
  ArrowRight,
  UserPlus,
  Trash2,
  Edit2,
  ShieldCheck,
  User as UserIcon,
  Mail,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Screen, MarketAsset, Transaction, Alert, User } from './types';
import { MARKET_ASSETS, TRANSACTIONS, INITIAL_USERS } from './constants';
import { userService } from './services/supabaseService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---

const CHART_DATA = [
  { time: '00:00', price: 62000 },
  { time: '04:00', price: 63500 },
  { time: '08:00', price: 62800 },
  { time: '12:00', price: 65000 },
  { time: '16:00', price: 64200 },
  { time: '20:00', price: 66800 },
  { time: '23:59', price: 64231 },
];

const ALLOCATION_DATA = [
  { name: 'BTC', value: 45, color: '#006633' },
  { name: 'ETH', value: 25, color: '#008844' },
  { name: 'SOL', value: 15, color: '#00AA55' },
  { name: 'Others', value: 15, color: '#10BB66' },
];

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left",
      active 
        ? "bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-900/20" 
        : "text-slate-400 hover:bg-emerald-600/10 hover:text-emerald-500"
    )}
  >
    <Icon size={18} />
    <span className="text-sm">{label}</span>
  </button>
);

const StatCard = ({ label, value, change, isPositive }: { label: string, value: string, change: string, isPositive: boolean }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
    <p className="text-sm text-slate-400 mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <span className={cn("text-xs font-medium", isPositive ? "text-emerald-500" : "text-rose-500")}>
        {change}
      </span>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        if (data && data.length > 0) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setActiveScreen('dashboard');
    } else {
      alert('User not found. Try ricardo@cryptolusitano.pt');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveScreen('login');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <DashboardScreen user={currentUser} />;
      case 'markets': return <MarketsScreen />;
      case 'staking': return <StakingScreen />;
      case 'transactions': return <TransactionsScreen />;
      case 'alerts': return <AlertsScreen />;
      case 'learn': return <LearnScreen onSelectCourse={() => setActiveScreen('lesson')} />;
      case 'lesson': return <LessonScreen onTakeQuiz={() => setActiveScreen('quiz')} />;
      case 'quiz': return <QuizScreen onFinish={() => setActiveScreen('learn')} />;
      case 'admin': return <AdminScreen users={users} setUsers={setUsers} />;
      default: return <DashboardScreen user={currentUser} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0f1a] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-[#0a0f1a] flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-emerald-600 size-8 rounded-lg flex items-center justify-center">
              <Wallet className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-500">Nilton</h1>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeScreen === 'dashboard'} onClick={() => setActiveScreen('dashboard')} />
            <SidebarItem icon={TrendingUp} label="Markets" active={activeScreen === 'markets'} onClick={() => setActiveScreen('markets')} />
            <SidebarItem icon={Wallet} label="Portfolio" active={activeScreen === 'portfolio'} onClick={() => setActiveScreen('portfolio')} />
            <SidebarItem icon={Layers} label="Staking" active={activeScreen === 'staking'} onClick={() => setActiveScreen('staking')} />
            <SidebarItem icon={History} label="Transactions" active={activeScreen === 'transactions'} onClick={() => setActiveScreen('transactions')} />
            <SidebarItem icon={Bell} label="Alerts" active={activeScreen === 'alerts'} onClick={() => setActiveScreen('alerts')} />
            <SidebarItem icon={GraduationCap} label="Learn" active={activeScreen === 'learn' || activeScreen === 'lesson' || activeScreen === 'quiz'} onClick={() => setActiveScreen('learn')} />
            {currentUser?.role === 'administrador' && (
              <SidebarItem icon={ShieldCheck} label="Admin Panel" active={activeScreen === 'admin'} onClick={() => setActiveScreen('admin')} />
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-emerald-500/5 group">
            <img 
              src={currentUser?.avatar} 
              alt="Avatar" 
              className="size-10 rounded-full border border-emerald-500/20"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 truncate uppercase tracking-wider">{currentUser?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-rose-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Screen Components ---

function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('ricardo@cryptolusitano.pt');
  const [password, setPassword] = useState('password123');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-emerald-600 size-16 rounded-2xl mb-6 shadow-xl shadow-emerald-900/20">
            <Wallet className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Nilton</h1>
          <p className="text-slate-400">Sign in to your professional crypto dashboard</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-emerald-500 hover:text-emerald-400">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              onClick={() => onLogin(email)}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform active:scale-[0.98]"
            >
              Sign In
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? <a href="#" className="text-emerald-500 font-bold hover:text-emerald-400">Create one</a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            By signing in, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminScreen({ users, setUsers }: { users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'view' as const, status: 'active' as const });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'view', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        const updatedUser = await userService.updateUser(editingUser.id, formData);
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      } else {
        const newUser = await userService.createUser({
          ...formData,
          avatar: `https://picsum.photos/seed/${formData.name}/100/100`
        });
        setUsers([newUser, ...users]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving user to Supabase:', error);
      alert('Error saving user. Please check your Supabase configuration.');
      
      // Fallback for demo purposes if Supabase fails
      if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      } else {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
          avatar: `https://picsum.photos/seed/${formData.name}/100/100`
        };
        setUsers([newUser, ...users]);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting user from Supabase:', error);
        alert('Error deleting user. Please check your Supabase configuration.');
        // Fallback
        setUsers(users.filter(u => u.id !== id));
      }
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
          <p className="text-slate-400">Manage platform users and permissions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </header>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-800">
                <th className="px-6 py-4">User</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="size-10 rounded-full border border-slate-800" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase",
                      user.role === 'administrador' ? "bg-purple-900/30 text-purple-400" : 
                      user.role === 'editor' ? "bg-blue-900/30 text-blue-400" : 
                      user.role === 'financeiro' ? "bg-emerald-900/30 text-emerald-400" : 
                      "bg-slate-800 text-slate-400"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "flex items-center gap-1.5 font-medium text-xs",
                      user.status === 'active' ? "text-emerald-500" : "text-slate-500"
                    )}>
                      <div className={cn("size-1.5 rounded-full", user.status === 'active' ? "bg-emerald-500" : "bg-slate-500")}></div>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs">Oct 24, 2023</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full h-12 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    >
                      <option value="view">View</option>
                      <option value="administrador">Administrador</option>
                      <option value="editor">Editor</option>
                      <option value="financeiro">Financeiro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full h-12 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-12 border border-slate-800 text-slate-400 font-bold rounded-xl hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardScreen({ user }: { user: User | null }) {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name.split(' ')[0]}</h2>
          <p className="text-slate-400">Here's what's happening in the markets today.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Trade Now
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Market Cap" value="$2.42T" change="+0.5%" isPositive={true} />
        <StatCard label="24h Volume" value="$85.4B" change="-2.1%" isPositive={false} />
        <StatCard label="BTC Dominance" value="52.1%" change="+0.2%" isPositive={true} />
        <StatCard label="Portfolio Performance" value="+12.5%" change="+$4.2k" isPositive={true} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">BTC/ETH Price History</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs rounded-lg bg-emerald-600/20 text-emerald-500 font-medium">1D</button>
              <button className="px-3 py-1 text-xs rounded-lg hover:bg-slate-800 text-slate-500">1W</button>
              <button className="px-3 py-1 text-xs rounded-lg hover:bg-slate-800 text-slate-500">1M</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Market Watchlist</h3>
          <div className="space-y-4">
            {MARKET_ASSETS.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: asset.color }}>
                    {asset.symbol[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{asset.symbol}</p>
                    <p className="text-[10px] text-slate-500">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">${asset.price.toLocaleString()}</p>
                  <p className={cn("text-[10px] font-medium", asset.change24h > 0 ? "text-emerald-500" : "text-rose-500")}>
                    {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-6">My Portfolio Allocation</h3>
          <div className="flex items-center gap-8">
            <div className="size-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ALLOCATION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ALLOCATION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {ALLOCATION_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Buy Bitcoin</p>
                  <p className="text-[10px] text-slate-500 uppercase">2 mins ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-500">+0.012 BTC</p>
                <p className="text-[10px] text-slate-500">$768.40</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Sell Solana</p>
                  <p className="text-[10px] text-slate-500 uppercase">1 hour ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-rose-500">-10.5 SOL</p>
                <p className="text-[10px] text-slate-500">$1,524.30</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MarketsScreen() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-900/20">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">Bitcoin</h2>
              <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">BTC</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-3xl font-bold text-white">$67,245.00</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-1">
                <ArrowUpRight size={12} />
                2.4%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 h-11 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-all">
            Buy
          </button>
          <button className="flex items-center gap-2 px-6 h-11 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-all">
            Sell
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
              {['1H', '1D', '1W', '1M', '1Y', 'All'].map((t) => (
                <button key={t} className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", t === '1D' ? "bg-slate-700 text-emerald-500 shadow-sm" : "text-slate-400 hover:text-white")}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Settings className="text-slate-500 cursor-pointer" size={20} />
              <MoreHorizontal className="text-slate-500 cursor-pointer" size={20} />
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorPriceLarge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPriceLarge)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Market Cap</p>
            <h3 className="text-xl font-bold text-white">$1.32 Trillion</h3>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Rank #1</span>
              <span className="text-xs text-emerald-500 font-medium">Dominance 52.4%</span>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">24h Volume</p>
            <h3 className="text-xl font-bold text-white">$32.1 Billion</h3>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 w-2/3 h-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Circulating Supply</p>
            <h3 className="text-xl font-bold text-white">19.6M BTC</h3>
            <p className="text-xs text-slate-500 mt-2">Max Supply: 21,000,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StakingScreen() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Staking & Rewards</h2>
          <p className="text-slate-400 mt-1">Earn passive income on your crypto assets securely.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20">
          <Plus size={20} />
          Stake Now
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-sm text-slate-400 font-medium">Total Staked Value</p>
          <p className="text-2xl font-bold mt-2 text-white">$45,230.00</p>
          <div className="mt-2 text-xs text-emerald-500 flex items-center gap-1 font-semibold">
            <ArrowUpRight size={14} /> +2.4% this month
          </div>
        </div>
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-sm text-slate-400 font-medium">Total Rewards Earned</p>
          <p className="text-2xl font-bold mt-2 text-white">$3,215.48</p>
          <div className="mt-2 text-xs text-emerald-500 flex items-center gap-1 font-semibold">
            <Wallet size={14} /> $142.10 pending
          </div>
        </div>
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-sm text-slate-400 font-medium">Average APY</p>
          <p className="text-2xl font-bold mt-2 text-white">6.8%</p>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <Circle size={10} fill="currentColor" /> Weighted average
          </div>
        </div>
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-sm text-slate-400 font-medium">Active Stakes</p>
          <p className="text-2xl font-bold mt-2 text-white">4 Assets</p>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 size={14} /> All audits passed
          </div>
        </div>
      </section>

      <h3 className="text-xl font-bold text-white">Active Stakes</h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[
          { name: 'Ethereum', symbol: 'ETH', amount: '12.50', apy: '4.5%', rewards: '0.45', lock: 'Flexible', progress: 75, color: 'text-blue-500' },
          { name: 'Solana', symbol: 'SOL', amount: '450', apy: '7.2%', rewards: '12.3', lock: '3 Days', progress: 45, color: 'text-purple-500' },
        ].map((stake) => (
          <div key={stake.symbol} className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <Layers className={stake.color} size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{stake.name} ({stake.symbol})</h4>
                  <p className="text-xs text-slate-500">{stake.amount} {stake.symbol} Staked</p>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-bold uppercase">{stake.apy} APY</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Earned Rewards</p>
                <p className="font-bold text-white">{stake.rewards} {stake.symbol}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Lock Period</p>
                <p className="font-bold text-white">{stake.lock}</p>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${stake.progress}%` }}></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Maturity Progress</p>
              <button className="text-xs font-bold border border-slate-800 px-4 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">Unstake</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionsScreen() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
            <Upload size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700">
            <Download size={16} /> Download Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Transactions</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-bold text-white">247</span>
            <span className="text-emerald-500 text-xs font-medium pb-1">+12% vs last mo.</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Volume</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-bold text-white">$156,430.22</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">This Month</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-bold text-white">32</span>
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse mb-2 ml-1"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-slate-900/30 border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            className="w-full h-10 pl-10 pr-4 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" 
            placeholder="Search transactions, assets or hashes..." 
            type="text"
          />
        </div>
        <button className="flex items-center justify-between gap-4 h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 hover:border-slate-600">
          Type: All <MoreHorizontal size={16} />
        </button>
        <button className="flex items-center justify-between gap-4 h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 hover:border-slate-600">
          Asset: All <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-800">
                <th className="px-6 py-4">Date/Time</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Asset</th>
                <th className="px-4 py-4 text-right">Amount</th>
                <th className="px-4 py-4 text-right">Total Value</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">{tx.date}</td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase",
                      tx.type === 'BUY' ? "bg-emerald-900/30 text-emerald-500" :
                      tx.type === 'SELL' ? "bg-rose-900/30 text-rose-500" :
                      tx.type === 'STAKE' ? "bg-emerald-900/30 text-emerald-500" :
                      "bg-slate-800 text-slate-400"
                    )}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                        {tx.asset[0]}
                      </div>
                      <span className="font-semibold text-white">{tx.asset}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-white">{tx.amount}</td>
                  <td className="px-4 py-4 text-right font-semibold text-white">${tx.totalValue.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "flex items-center gap-1.5 font-medium text-xs",
                      tx.status === 'Completed' ? "text-emerald-500" :
                      tx.status === 'Pending' ? "text-amber-500" : "text-rose-500"
                    )}>
                      <div className={cn("size-1.5 rounded-full", tx.status === 'Completed' ? "bg-emerald-500" : tx.status === 'Pending' ? "bg-amber-500 animate-pulse" : "bg-rose-500")}></div>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-slate-600 text-[11px] hover:text-emerald-500 cursor-pointer">{tx.hash}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-900/80 px-6 py-4 flex items-center justify-between border-t border-slate-800">
          <span className="text-xs text-slate-500">Showing 1-5 of 247</span>
          <div className="flex items-center gap-1">
            <button className="size-8 rounded flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="size-8 rounded bg-emerald-600 text-white text-xs font-bold">1</button>
            <button className="size-8 rounded text-slate-400 text-xs font-medium hover:bg-slate-800 hover:text-white transition-colors">2</button>
            <button className="size-8 rounded flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertsScreen() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Price Alerts</h2>
          <p className="text-slate-400 mt-1">Never miss a price movement across 500+ assets</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all">
          <Plus size={20} /> Add New Alert
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
          <span className="text-sm font-medium text-slate-500">Active Alerts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-white">8</span>
            <span className="text-xs text-emerald-500 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10">Stable</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
          <span className="text-sm font-medium text-slate-500">Triggered Today</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-white">3</span>
            <span className="text-xs text-blue-500 font-bold px-1.5 py-0.5 rounded bg-blue-500/10">Actionable</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
          <span className="text-sm font-medium text-slate-500">Total Created</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-white">24</span>
            <span className="text-xs text-slate-400 font-bold px-1.5 py-0.5 rounded bg-slate-400/10">Lifetime</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="text-emerald-500" size={20} /> New Alert Configuration
          </h3>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl shadow-xl shadow-black/20 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Select Asset</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-emerald-500 transition-colors">
                <option>Bitcoin (BTC)</option>
                <option>Ethereum (ETH)</option>
                <option>Solana (SOL)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Condition</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-emerald-500 transition-colors">
                  <option>Price Above</option>
                  <option>Price Below</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Target Price</label>
                <input className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-emerald-500 transition-colors" placeholder="70,000" type="number" />
              </div>
            </div>
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg mt-2 shadow-lg shadow-emerald-900/20 transition-all">
              Create Alert
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} /> Active Alerts
            </h3>
            <button className="text-xs font-medium text-slate-500 hover:text-emerald-500 transition-colors">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { asset: 'BTC', condition: 'above $70,000', current: '$67,142', away: '4.1% away', color: 'text-orange-500' },
              { asset: 'ETH', condition: 'below $3,200', current: '$3,450', away: '7.2% away', color: 'text-blue-500' },
            ].map((alert) => (
              <div key={alert.asset} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                    <TrendingUp className={alert.color} size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">{alert.asset} {alert.condition}</span>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                      <span>Current: {alert.current}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span className="text-emerald-500">{alert.away}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-5 bg-emerald-600 rounded-full relative cursor-pointer">
                    <div className="size-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                  <History className="text-slate-500 hover:text-rose-500 cursor-pointer" size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LearnScreen({ onSelectCourse }: { onSelectCourse: () => void }) {
  return (
    <div className="space-y-8">
      <header className="flex flex-col">
        <h2 className="text-2xl font-bold text-white">Crypto Academy</h2>
        <p className="text-slate-400">Master the markets with expert-led courses</p>
      </header>

      <section className="relative rounded-2xl overflow-hidden h-64 flex items-center shadow-xl group border border-slate-800">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://picsum.photos/seed/crypto/1200/600')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a] via-[#0a0f1a]/80 to-transparent"></div>
        <div className="relative z-10 px-12 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full mb-4 uppercase tracking-widest">Featured Course</span>
          <h3 className="text-3xl font-extrabold mb-2 text-white">Crypto Fundamentals 101</h3>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">Start your journey into the world of blockchain, smart contracts, and digital assets with our comprehensive beginner's guide.</p>
          <div className="flex items-center gap-6">
            <button onClick={onSelectCourse} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
              <PlayCircle size={18} />
              Start Learning
            </button>
            <div className="flex flex-col gap-1 w-32">
              <div className="flex justify-between items-center text-[10px] text-slate-300 font-bold">
                <span>15% Complete</span>
                <span>3/20 Lessons</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[15%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Mastering Candlesticks', level: 'Beginner', time: '45 min', instructor: 'Alex Rivers' },
          { title: 'Advanced Risk Management', level: 'Advanced', time: '1h 20min', instructor: 'Elena Vance' },
          { title: 'DeFi Ecosystem Deep Dive', level: 'Intermediate', time: '2h 15min', instructor: 'Marcus Chen' },
        ].map((course) => (
          <div key={course.title} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all group cursor-pointer" onClick={onSelectCourse}>
            <div className="aspect-video bg-slate-800 relative">
              <img src={`https://picsum.photos/seed/${course.title}/400/225`} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" referrerPolicy="no-referrer" />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded">{course.time}</span>
                <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded">{course.level}</span>
              </div>
            </div>
            <div className="p-5">
              <h5 className="font-bold text-white mb-2 group-hover:text-emerald-500 transition-colors">{course.title}</h5>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                <span className="text-[11px] font-medium text-slate-500">{course.instructor}</span>
                <ArrowRight size={16} className="text-emerald-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonScreen({ onTakeQuiz }: { onTakeQuiz: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative group">
          <img src="https://picsum.photos/seed/lesson/1200/675" alt="Lesson" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="size-20 bg-emerald-600/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <PlayCircle size={48} fill="currentColor" />
            </button>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="w-full h-1.5 bg-white/20 rounded-full mb-4">
              <div className="h-full w-[45%] bg-emerald-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-4">
                <PlayCircle size={16} />
                <span>12:40 / 28:15</span>
              </div>
              <div className="flex items-center gap-4">
                <Settings size={16} />
                <MoreHorizontal size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Lesson 3: Blockchain Basics</h2>
              <p className="text-slate-400 text-sm">Published on Oct 24, 2023 • 2,451 students completed</p>
            </div>
            <button onClick={onTakeQuiz} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all">
              Take Quiz
            </button>
          </div>
          <div className="border-t border-slate-800 pt-6">
            <h3 className="font-bold text-white mb-3">Resources</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-800 w-full sm:w-auto">
                <History className="text-rose-500" size={20} />
                <div>
                  <p className="text-sm font-medium text-white">Lesson_3_Notes.pdf</p>
                  <p className="text-[10px] text-slate-500">2.4 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex border-b border-slate-800">
            <button className="flex-1 py-4 text-sm font-bold border-b-2 border-emerald-500 text-white bg-emerald-500/5">Course Content</button>
            <button className="flex-1 py-4 text-sm font-bold text-slate-500">My Notes</button>
          </div>
          <div className="p-2 space-y-1">
            {[
              { id: 1, title: 'Welcome to the Course', time: '05:20', completed: true },
              { id: 2, title: 'History of Money', time: '18:45', completed: true },
              { id: 3, title: 'Blockchain Basics', time: '28:15', active: true },
              { id: 4, title: 'Mining & Consensys', time: '15:10' },
            ].map((lesson) => (
              <div key={lesson.id} className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                lesson.active ? "bg-emerald-600/10 border border-emerald-500/20" : "hover:bg-slate-800"
              )}>
                {lesson.completed ? <CheckCircle2 className="text-emerald-500" size={18} /> : 
                 lesson.active ? <PlayCircle className="text-emerald-500" size={18} /> : 
                 <Circle className="text-slate-600" size={18} />}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm truncate", lesson.active ? "font-bold text-white" : "text-slate-400")}>{lesson.id}. {lesson.title}</p>
                  <p className="text-[10px] text-slate-500">{lesson.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function QuizScreen({ onFinish }: { onFinish: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Consensus Mechanisms</h2>
          <p className="text-slate-400 text-sm">Lesson 4: How Blockchains Stay Secure</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-emerald-500">Question 4 of 10</span>
          <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 w-[40%] rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <span className="inline-block px-3 py-1 bg-emerald-600/10 text-emerald-500 text-[10px] font-bold rounded-full mb-6 uppercase tracking-widest">Multiple Choice</span>
        <h3 className="text-2xl font-bold text-white mb-8">What is the primary function of a blockchain consensus mechanism?</h3>
        
        <div className="space-y-4">
          {[
            'To encrypt private user data for secure off-chain storage',
            'To achieve agreement on a single data value among distributed processes',
            'To maximize the transaction throughput of a centralized server',
            'To generate new cryptocurrency tokens via an automated faucet',
          ].map((option, idx) => (
            <button 
              key={idx}
              onClick={() => setSelected(idx)}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all text-left",
                selected === idx 
                  ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                  : "border-slate-800 hover:border-slate-700 bg-transparent"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "size-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
                  selected === idx ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-700 text-slate-500"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={cn("font-medium", selected === idx ? "text-white" : "text-slate-300")}>{option}</span>
              </div>
              {selected === idx && <CheckCircle2 className="text-emerald-500" size={20} />}
            </button>
          ))}
        </div>

        {selected === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 text-emerald-500 font-bold mb-1">
              <CheckCircle2 size={18} /> Correct!
            </div>
            <p className="text-sm text-slate-400">
              Excellent work. Consensus mechanisms like Proof of Work or Proof of Stake ensure that all nodes in the network agree on the ledger's state without needing a trusted third party.
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button className="px-6 py-3 rounded-lg border border-slate-800 font-bold text-slate-500 hover:bg-slate-800 transition-colors">Previous</button>
        <button 
          onClick={onFinish}
          className="px-10 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}
