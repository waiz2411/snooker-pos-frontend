import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
  Search,
  User,
  CreditCard,
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import CreateClub from './CreateClub';
import ManageClubs from './ManageClubs';

export default function AdminDashboard() {
  const { adminAuth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  if (!adminAuth) {
    return <Navigate to="/admin/login" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
    { path: '/admin/create-club', icon: Building2, label: 'Create Snooker Club' },
    { path: '/admin/manage-clubs', icon: CreditCard, label: 'Manage Clubs' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      {isMobile ? null : (
        <aside className="w-64 bg-gradient-to-b from-[#0d1117] to-[#0a0a0a] border-r border-[#00ff41]/10 flex flex-col">
          <div className="p-6 border-b border-[#00ff41]/10">
            <h2 className="text-[#00ff41]">Super Admin</h2>
            <p className="text-gray-500">Snooker Club Manager</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#00ff41]/10">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-gradient-to-r from-[#0d1117] to-[#0a0a0a] border-b border-[#00ff41]/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search clubs, owners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/40 border-[#00ff41]/20 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-[#00ff41]/20">
              <div className="w-8 h-8 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#00ff41]" />
              </div>
              <div>
                <p className="text-white">Admin</p>
                <p className="text-gray-500">Super User</p>
              </div>
            </div> */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-[#00ff41]/20 border border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/30 transition"
            >
              {/* Hamburger Icon */}
              {!sidebarOpen ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                /* X Icon */
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/create-club" element={<CreateClub />} />
            <Route path="/manage-clubs" element={<ManageClubs />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-white">Settings</h1>
      <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
        <p className="text-gray-400">Settings page coming soon...</p>
      </div>
    </div>
  );
}
