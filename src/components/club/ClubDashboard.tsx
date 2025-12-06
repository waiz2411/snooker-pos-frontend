import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  Users,
  LogOut,
  CircleDot,
  PlayCircle,
  Gamepad2,
} from 'lucide-react';
import ClubOverview from './ClubOverview';
import TableManagement from './TableManagement';
import CustomerManagement from './CustomerManagement';
import StartGame from './StartGame';
import GameRunning from './GameRunning';
import OngoingGames from './OngoingGames';

export default function ClubDashboard() {
  const { clubAuth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/club/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("clubId");
    logout();
    navigate('/club/login');
  };

  const menuItems = [
    { path: '/club/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/club/tables', icon: CircleDot, label: 'Table Management' },
    { path: '/club/customers', icon: Users, label: 'Customers' },
    { path: '/club/start-game', icon: PlayCircle, label: 'Start Game' },
    { path: '/club/ongoing-games', icon: Gamepad2, label: 'Ongoing Games' },
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
            <h2 className="text-[#00ff41]">Snooker Club</h2>
            <p className="text-gray-500">Club Owner Dashboard</p>
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
        {isMobile && (
          <>
            {/* Hamburger Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-[#00ff41]/20 
                 border border-[#00ff41]/30 text-[#00ff41] 
                 hover:bg-[#00ff41]/30 transition"
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

            {/* Mobile Sidebar */}
            {sidebarOpen && (
            <div
              className={`fixed top-0 left-0 h-full w-full bg-gradient-to-b 
                  from-[#0d1117] to-[#0a0a0a] border-r border-[#00ff41]/10 
                  transform transition-transform duration-300
                  ${sidebarOpen ? "translate-x-0" : "hidden"}`}
              style={{ zIndex: 1 }}
            >
              <div className="p-6 border-b border-[#00ff41]/10"></div>

              <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false); // auto close
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                        ? "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
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
            </div>
            )}
          </>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/club/dashboard" />} />
            <Route path="/dashboard" element={<ClubOverview />} />
            <Route path="/tables" element={<TableManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/start-game" element={<StartGame />} />
            <Route path="/game/:gameId" element={<GameRunning />} />
            <Route path="/ongoing-games" element={<OngoingGames />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}