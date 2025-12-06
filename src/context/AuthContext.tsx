import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  adminAuth: boolean;
  clubAuth: boolean;
  currentClub: any;
  adminLogin: (password: string) => boolean;
  clubLogin: (email: string, password: string) => boolean;
  logout: () => void;
  setCurrentClubData: (club: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminAuth, setAdminAuth] = useState(false);
  const [clubAuth, setClubAuth] = useState(false);
  const [currentClub, setCurrentClub] = useState<any>(null);

  const adminLogin = (password: string) => {
    if (password === 'Waiztahseen@2007') {
      setAdminAuth(true);
      return true;
    }
    return false;
  };

  const clubLogin = (email: string, password: string) => {
    const token = localStorage.getItem("token");
    // Mock club login - in real app, validate against club data
    if (email && password) {
      setClubAuth(true);
      setCurrentClub({ email, name: 'Demo Club' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdminAuth(false);
    setClubAuth(false);
    setCurrentClub(null);
  };

  const setCurrentClubData = (club: any) => {
    setCurrentClub(club);
  };

  return (
    <AuthContext.Provider value={{ adminAuth, clubAuth, currentClub, adminLogin, clubLogin, logout, setCurrentClubData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
