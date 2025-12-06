import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Club {
  id: string;
  clubName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  status: 'Active' | 'Deactivated';
  paymentStatus: 'Paid' | 'Unpaid';
  expiryDate: string;
  lastPaidDate: string;
  createdDate: string;
}

interface Table {
  id: string;
  number: string;
  name: string;
  type: string;
  status: 'Free' | 'Occupied';
  gameStartTime?: string;
  pricingType?: 'Per Minute' | 'Full Game';
  currentGameId?: string;
}

interface Customer {
  id: string;
  name: string;
  billedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  lastActivity: string;
}

interface Game {
  id: string;
  tableId: string;
  player1Id: string;
  player2Id: string;
  startTime: string;
  endTime?: string;
  pricingType: 'Per Minute' | 'Full Game';
  pricePerMinute?: number;
  fixedPrice?: number;
  totalAmount?: number;
  loserId?: string;
  status: 'Running' | 'Completed';
  paused?: boolean;
  pausedAt?: string;
}

interface ClubContextType {
  clubs: Club[];
  tables: Table[];
  customers: Customer[];
  games: Game[];
  addClub: (club: Omit<Club, 'id' | 'createdDate'>) => void;
  updateClub: (id: string, updates: Partial<Club>) => void;
  deleteClub: (id: string) => void;
  addTable: (table: Omit<Table, 'id' | 'status'>) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'lastActivity'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  startGame: (game: Omit<Game, 'id' | 'startTime' | 'status'>) => string;
  updateGame: (id: string, updates: Partial<Game>) => void;
  endGame: (gameId: string, loserId: string, totalAmount: number) => void;
  cleanupInactiveCustomers: () => void;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export function ClubProvider({ children }: { children: ReactNode }) {
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: '1',
      clubName: 'Elite Snooker Arena',
      ownerName: 'John Smith',
      email: 'john@elitesnooker.com',
      phone: '+1234567890',
      password: 'club123',
      status: 'Active',
      paymentStatus: 'Paid',
      expiryDate: '2025-12-31',
      lastPaidDate: '2024-11-01',
      createdDate: '2024-01-15',
    },
    {
      id: '2',
      clubName: 'Kings Snooker Club',
      ownerName: 'Sarah Johnson',
      email: 'sarah@kingsclub.com',
      phone: '+1234567891',
      password: 'kings456',
      status: 'Active',
      paymentStatus: 'Unpaid',
      expiryDate: '2024-11-10',
      lastPaidDate: '2024-10-10',
      createdDate: '2024-02-20',
    },
    {
      id: '3',
      clubName: 'Champions Billiards',
      ownerName: 'Mike Davis',
      email: 'mike@champions.com',
      phone: '+1234567892',
      password: 'champ789',
      status: 'Deactivated',
      paymentStatus: 'Unpaid',
      expiryDate: '2024-10-01',
      lastPaidDate: '2024-09-01',
      createdDate: '2024-03-10',
    },
  ]);

  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: '1', name: 'Table 1', type: 'Standard', status: 'Free' },
    { id: '2', number: '2', name: 'Table 2', type: 'Premium', status: 'Occupied', gameStartTime: new Date().toISOString() },
    { id: '3', number: '3', name: 'Table 3', type: 'Standard', status: 'Free' },
    { id: '4', number: '4', name: 'Table 4', type: 'VIP', status: 'Free' },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: 'Alex Turner', billedAmount: 150, paidAmount: 100, remainingAmount: 50, lastActivity: new Date().toISOString() },
    { id: '2', name: 'Emma Wilson', billedAmount: 200, paidAmount: 200, remainingAmount: 0, lastActivity: new Date().toISOString() },
    { id: '3', name: 'Tom Hardy', billedAmount: 120, paidAmount: 80, remainingAmount: 40, lastActivity: new Date().toISOString() },
  ]);

  const [games, setGames] = useState<Game[]>([]);

  // Cleanup inactive customers (24 hours)
  useEffect(() => {
    const interval = setInterval(() => {
      cleanupInactiveCustomers();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const cleanupInactiveCustomers = () => {
    const now = new Date().getTime();
    setCustomers(prev => 
      prev.filter(customer => {
        const lastActivity = new Date(customer.lastActivity).getTime();
        return now - lastActivity < 24 * 60 * 60 * 1000; // 24 hours
      })
    );
  };

  const addClub = (club: Omit<Club, 'id' | 'createdDate'>) => {
    const newClub = {
      ...club,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    setClubs(prev => [...prev, newClub]);
  };

  const updateClub = (id: string, updates: Partial<Club>) => {
    setClubs(prev => prev.map(club => club.id === id ? { ...club, ...updates } : club));
  };

  const deleteClub = (id: string) => {
    setClubs(prev => prev.filter(club => club.id !== id));
  };

  const addTable = (table: Omit<Table, 'id' | 'status'>) => {
    const newTable = {
      ...table,
      id: Date.now().toString(),
      status: 'Free' as const,
    };
    setTables(prev => [...prev, newTable]);
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setTables(prev => prev.map(table => table.id === id ? { ...table, ...updates } : table));
  };

  const deleteTable = (id: string) => {
    setTables(prev => prev.filter(table => table.id !== id));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'lastActivity'>) => {
    const newCustomer = {
      ...customer,
      id: Date.now().toString(),
      lastActivity: new Date().toISOString(),
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates, lastActivity: new Date().toISOString() } : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  const startGame = (game: Omit<Game, 'id' | 'startTime' | 'status'>) => {
    const newGame: Game = {
      ...game,
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      status: 'Running',
    };
    setGames(prev => [...prev, newGame]);
    
    // Update table status
    updateTable(game.tableId, { 
      status: 'Occupied', 
      gameStartTime: newGame.startTime,
      pricingType: game.pricingType,
      currentGameId: newGame.id,
    });
    
    return newGame.id;
  };

  const updateGame = (id: string, updates: Partial<Game>) => {
    setGames(prev => prev.map(game => 
      game.id === id ? { ...game, ...updates } : game
    ));
  };

  const endGame = (gameId: string, loserId: string, totalAmount: number) => {
    setGames(prev => prev.map(game => 
      game.id === gameId 
        ? { ...game, endTime: new Date().toISOString(), loserId, totalAmount, status: 'Completed' as const }
        : game
    ));
    
    // Find the game and update table
    const game = games.find(g => g.id === gameId);
    if (game) {
      updateTable(game.tableId, { 
        status: 'Free',
        gameStartTime: undefined,
        pricingType: undefined,
        currentGameId: undefined,
      });
      
      // Update loser's billing
      const loser = customers.find(c => c.id === loserId);
      if (loser) {
        updateCustomer(loserId, {
          billedAmount: loser.billedAmount + totalAmount,
          remainingAmount: loser.remainingAmount + totalAmount,
        });
      }
    }
  };

  return (
    <ClubContext.Provider value={{
      clubs,
      tables,
      customers,
      games,
      addClub,
      updateClub,
      deleteClub,
      addTable,
      updateTable,
      deleteTable,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      startGame,
      updateGame,
      endGame,
      cleanupInactiveCustomers,
    }}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClubContext() {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClubContext must be used within ClubProvider');
  }
  return context;
}