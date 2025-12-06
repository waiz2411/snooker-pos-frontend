import React, { createContext, useContext, useState, useEffect } from 'react';
import { Club } from '../types';

interface AuthContextType {
  isAdminLoggedIn: boolean;
  currentClub: Club | null;
  adminLogin: (password: string) => boolean;
  clubLogin: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentClub, setCurrentClub] = useState<Club | null>(null);

  useEffect(() => {
    // Check localStorage for existing session
    const adminSession = localStorage.getItem('adminSession');
    const clubSession = localStorage.getItem('clubSession');
    
    if (adminSession === 'true') {
      setIsAdminLoggedIn(true);
    }
    
    if (clubSession) {
      const club = JSON.parse(clubSession);
      setCurrentClub(club);
    }
  }, []);

  const adminLogin = (password: string) => {
    if (password === 'Waiztahseen@2007') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('adminSession', 'true');
      return true;
    }
    return false;
  };

  const clubLogin = (email: string, password: string) => {
    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    const club = clubs.find((c: Club) => c.email === email && c.password === password);
    
    if (club && club.status === 'active') {
      setCurrentClub(club);
      localStorage.setItem('clubSession', JSON.stringify(club));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setCurrentClub(null);
    localStorage.removeItem('adminSession');
    localStorage.removeItem('clubSession');
  };

  return (
    <AuthContext.Provider value={{ isAdminLoggedIn, currentClub, adminLogin, clubLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
