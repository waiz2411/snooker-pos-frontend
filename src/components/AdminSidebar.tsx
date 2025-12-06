import { LayoutDashboard, PlusCircle, Building2, CreditCard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function AdminSidebar({ currentView, setCurrentView }: AdminSidebarProps) {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'create-club', label: 'Create Snooker Club', icon: PlusCircle },
    { id: 'manage-clubs', label: 'Manage Clubs', icon: Building2 },
    { id: 'payments', label: 'Payments & Status', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 glass-card h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-primary neon-text text-center">🎱 SNOOKER ADMIN</h1>
        <p className="text-xs text-center text-muted-foreground mt-2">Super Admin Panel</p>
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
