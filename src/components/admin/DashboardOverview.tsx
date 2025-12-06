import { useClubContext } from '../../context/ClubContext';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

export default function DashboardOverview() {
  const { clubs } = useClubContext();

  const totalClubs = clubs.length;
  const activeClubs = clubs.filter(c => c.status === 'Active').length;
  const deactivatedClubs = clubs.filter(c => c.status === 'Deactivated').length;
  const paidClubs = clubs.filter(c => c.paymentStatus === 'Paid').length;
  const unpaidClubs = clubs.filter(c => c.paymentStatus === 'Unpaid').length;

  const stats = [
    {
      label: 'Total Clubs',
      value: totalClubs,
      icon: Building2,
      color: 'text-[#00ff41]',
      bgColor: 'bg-[#00ff41]/10',
      borderColor: 'border-[#00ff41]/20',
    },
    {
      label: 'Active Clubs',
      value: activeClubs,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
    },
    {
      label: 'Deactivated Clubs',
      value: deactivatedClubs,
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
    },
    {
      label: 'Paid Clubs',
      value: paidClubs,
      icon: CreditCard,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
    },
    {
      label: 'Unpaid Clubs',
      value: unpaidClubs,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
    },
  ];

  // Recent clubs
  const recentClubs = [...clubs].sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  ).slice(0, 5);

  // Expiring soon
  const expiringClubs = clubs.filter(club => {
    const daysUntilExpiry = Math.ceil(
      (new Date(club.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white">Dashboard Overview</h1>
          <p className="text-gray-400">Monitor and manage all snooker clubs</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clubs */}
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
          <h2 className="text-white mb-4">Recently Added Clubs</h2>
          <div className="space-y-3">
            {recentClubs.length === 0 ? (
              <p className="text-gray-500">No clubs yet</p>
            ) : (
              recentClubs.map((club) => (
                <div
                  key={club.id}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5 hover:border-[#00ff41]/30 transition-all"
                >
                  <div>
                    <p className="text-white">{club.clubName}</p>
                    <p className="text-gray-500">{club.ownerName}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        club.status === 'Active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {club.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="backdrop-blur-xl bg-white/5 border border-orange-400/20 rounded-xl p-6">
          <h2 className="text-white mb-4">
            <AlertTriangle className="w-5 h-5 inline mr-2 text-orange-400" />
            Expiring Soon (7 days)
          </h2>
          <div className="space-y-3">
            {expiringClubs.length === 0 ? (
              <p className="text-gray-500">No clubs expiring soon</p>
            ) : (
              expiringClubs.map((club) => {
                const daysLeft = Math.ceil(
                  (new Date(club.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={club.id}
                    className="flex items-center justify-between p-4 bg-orange-500/10 rounded-lg border border-orange-500/20"
                  >
                    <div>
                      <p className="text-white">{club.clubName}</p>
                      <p className="text-gray-400">{club.ownerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400">
                        {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                      </p>
                      <p className="text-gray-500">{club.expiryDate}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
        <h2 className="text-white mb-4">Payment Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-green-400">{paidClubs} Clubs Paid</p>
            <p className="text-gray-400">
              {totalClubs > 0 ? Math.round((paidClubs / totalClubs) * 100) : 0}% of total
            </p>
          </div>
          <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <p className="text-orange-400">{unpaidClubs} Clubs Unpaid</p>
            <p className="text-gray-400">
              {totalClubs > 0 ? Math.round((unpaidClubs / totalClubs) * 100) : 0}% of total
            </p>
          </div>
          <div className="p-4 bg-[#00ff41]/10 rounded-lg border border-[#00ff41]/20">
            <p className="text-[#00ff41]">{activeClubs} Active</p>
            <p className="text-gray-400">Currently operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}
