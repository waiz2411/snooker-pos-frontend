import { LayoutDashboard, Table2, Users, PlayCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ClubSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function ClubSidebar({ currentView, setCurrentView }: ClubSidebarProps) {
  const { logout, currentClub } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tables', label: 'Table Management', icon: Table2 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'start-game', label: 'Start Game', icon: PlayCircle },
  ];

  return (
    <div className="w-64 glass-card h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-primary neon-text text-center">🎱 {currentClub?.clubName}</h1>
        <p className="text-xs text-center text-muted-foreground mt-2">{currentClub?.ownerName}</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === item.id
                ? 'bg-primary/20 text-primary neon-glow'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm">Logout</span>
      </button>
    </div>
  );
}
