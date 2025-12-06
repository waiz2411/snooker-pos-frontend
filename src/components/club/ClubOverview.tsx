import { useClubContext } from '../../context/ClubContext';
import { 
  CircleDot,
  PlayCircle, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ClubOverview() {
  const { tables, games, customers } = useClubContext();

  const totalTables = tables.length;
  const activeTables = tables.filter(t => t.status === 'Occupied').length;
  const completedToday = games.filter(g => {
    const today = new Date().toDateString();
    const gameDate = new Date(g.startTime).toDateString();
    return g.status === 'Completed' && gameDate === today;
  }).length;
  
  const totalEarningsToday = games
    .filter(g => {
      const today = new Date().toDateString();
      const gameDate = new Date(g.startTime).toDateString();
      return g.status === 'Completed' && gameDate === today;
    })
    .reduce((sum, game) => sum + (game.totalAmount || 0), 0);

  // Mock data for charts
  const earningsData = [
    { day: 'Mon', earnings: 450 },
    { day: 'Tue', earnings: 680 },
    { day: 'Wed', earnings: 520 },
    { day: 'Thu', earnings: 750 },
    { day: 'Fri', earnings: 890 },
    { day: 'Sat', earnings: 1200 },
    { day: 'Sun', earnings: 980 },
  ];

  const peakHoursData = [
    { hour: '10AM', games: 2 },
    { hour: '12PM', games: 5 },
    { hour: '2PM', games: 8 },
    { hour: '4PM', games: 12 },
    { hour: '6PM', games: 15 },
    { hour: '8PM', games: 18 },
    { hour: '10PM', games: 10 },
  ];

  const stats = [
    {
      label: 'Total Tables',
      value: totalTables,
      icon: CircleDot,
      color: 'text-[#00ff41]',
      bgColor: 'bg-[#00ff41]/10',
      borderColor: 'border-[#00ff41]/20',
    },
    {
      label: 'Active Games',
      value: activeTables,
      icon: PlayCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
    },
    {
      label: 'Completed Today',
      value: completedToday,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
    },
    {
      label: 'Earnings Today',
      value: `$${totalEarningsToday}`,
      icon: DollarSign,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor your snooker club performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`backdrop-blur-xl bg-white/5 border ${stat.borderColor} rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-gray-400 mb-1">{stat.label}</p>
                <p className={`${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
          <h2 className="text-white mb-4">Weekly Earnings</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1117', 
                  border: '1px solid #00ff4133',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="#00ff41" 
                strokeWidth={2}
                dot={{ fill: '#00ff41', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours Chart */}
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
          <h2 className="text-white mb-4">Peak Hours Today</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="hour" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1117', 
                  border: '1px solid #00ff4133',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="games" fill="#00ff41" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Tables */}
      <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
        <h2 className="text-white mb-4">Table Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tables.map((table) => {
            const isOccupied = table.status === 'Occupied';
            const gameStartTime = table.gameStartTime ? new Date(table.gameStartTime) : null;
            const minutesElapsed = gameStartTime 
              ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 60000)
              : 0;
            const isOvertime = minutesElapsed > 30;

            return (
              <div
                key={table.id}
                className={`p-4 rounded-lg border transition-all ${
                  isOccupied
                    ? isOvertime
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-green-500/10 border-green-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">{table.name}</span>
                  <CircleDot 
                    className={`w-4 h-4 ${
                      isOccupied
                        ? isOvertime ? 'text-red-400' : 'text-blue-400'
                        : 'text-green-400'
                    }`} 
                  />
                </div>
                <p className={`${
                  isOccupied
                    ? isOvertime ? 'text-red-400' : 'text-blue-400'
                    : 'text-green-400'
                }`}>
                  {isOccupied ? (isOvertime ? 'Overtime' : 'Occupied') : 'Available'}
                </p>
                {isOccupied && (
                  <div className="flex items-center gap-1 mt-2 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{minutesElapsed} min</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Customers */}
      <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
        <h2 className="text-white mb-4">Recent Customers</h2>
        <div className="space-y-3">
          {customers.slice(0, 5).map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5"
            >
              <div>
                <p className="text-white">{customer.name}</p>
                <p className="text-gray-400">Billed: ${customer.billedAmount}</p>
              </div>
              <div className="text-right">
                <p className="text-[#00ff41]">Paid: ${customer.paidAmount}</p>
                {customer.remainingAmount > 0 && (
                  <p className="text-orange-400">Due: ${customer.remainingAmount}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
