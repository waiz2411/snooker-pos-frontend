import { useState, useEffect } from 'react';
import { useClubContext } from '../../context/ClubContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Eye,
} from 'lucide-react';
import { GetAllClubs, EditClub, deleteClub } from '../../utils/agentService';

export default function ManageClubs() {
  const { updateClub } = useClubContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingClub, setEditingClub] = useState<any>(null);
  const [viewingClub, setViewingClub] = useState<any>(null);
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [ clubs, setClubs] = useState([]);
  const [ Tempclubs, setTempClubs] = useState([]);


  const filteredClubs = clubs.filter(club =>
    club.club_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setClubs(Tempclubs);
  }, [Tempclubs])


  useEffect(() => {
    handleAutoFetch();
  }, [])

  const handleAutoFetch = async () => {
    GetAllClubs()
      .then((res) => {
        // console.log(res);
        setTempClubs(res.clubs);
      })
      .catch((err) => console.error("Error Creating Club"));
  }

  const handleActivate = (clubId: string) => {
    updateClub(clubId, { status: 'Active' });
  };

  const handleDeactivate = (clubId: string) => {
    updateClub(clubId, { status: 'Deactivated' });
  };

  const handleDelete = (clubId: string) => {
    if (confirm('Are you sure you want to delete this club?')) {
      deleteClub(clubId);
    }
  };

  const handleUpdateExpiry = () => {
    if (editingClub && newExpiryDate) {
      EditClub(editingClub.id, { 
        expiry_date: newExpiryDate,
        payment_status: 1,
        last_paid: new Date().toISOString().split('T')[0],
      });
      setEditingClub(null);
      setNewExpiryDate('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white">Manage Clubs</h1>
          <p className="text-gray-400">View and manage all registered clubs</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search clubs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-black/40 border-[#00ff41]/20 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
        />
      </div>

      {/* Clubs Table */}
      <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/40 border-b border-[#00ff41]/20">
              <tr>
                <th className="px-6 py-4 text-left text-[#00ff41]">Club Name</th>
                <th className="px-6 py-4 text-left text-[#00ff41]">Owner</th>
                <th className="px-6 py-4 text-left text-[#00ff41]">Payment Status</th>
                <th className="px-6 py-4 text-left text-[#00ff41]">Account Status</th>
                <th className="px-6 py-4 text-left text-[#00ff41]">Expiry Date</th>
                <th className="px-6 py-4 text-left text-[#00ff41]">Last Paid</th>
                <th className="px-6 py-4 text-right text-[#00ff41]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClubs.map((club) => (
                <tr key={club.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white">{club.club_name}</td>
                  <td className="px-6 py-4 text-gray-400">{club.owner_name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        club.payment_status === 1
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {club.payment_status === 1 ? ("Paid") : ("Unpaid")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        club.account_status === 1
                          ? 'bg-[#00ff41]/20 text-[#00ff41]'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {club.account_status === 1 ? ("Active") : ("Inactive")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{club.expiry_date}</td>
                  <td className="px-6 py-4 text-gray-400">{club.last_paid}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewingClub(club)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingClub(club);
                          setNewExpiryDate(club.expiry_date);
                        }}
                        className="text-[#00ff41] hover:text-[#00dd38] hover:bg-[#00ff41]/10"
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                      {club.status === 'Active' ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeactivate(club.id)}
                          className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleActivate(club.id)}
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(club.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClubs.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No clubs found</p>
          </div>
        )}
      </div>

      {/* Edit Expiry Dialog */}
      <Dialog open={!!editingClub} onOpenChange={(open) => !open && setEditingClub(null)}>
        <DialogContent className="bg-[#0d1117] border-[#00ff41]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#00ff41]">Update Expiry Date</DialogTitle>
          </DialogHeader>
          {editingClub && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Club: {editingClub.club_name}</p>
                <p className="text-gray-400">Current Expiry: {editingClub.expiry_date}</p>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">New Expiry Date</label>
                <Input
                  type="date"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="bg-black/40 border-[#00ff41]/30 text-white"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditingClub(null)}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateExpiry}
              className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
            >
              Update & Mark Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewingClub} onOpenChange={(open) => !open && setViewingClub(null)}>
        <DialogContent className="bg-[#0d1117] border-[#00ff41]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#00ff41]">Club Details</DialogTitle>
          </DialogHeader>
          {viewingClub && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Club Name</p>
                  <p className="text-white">{viewingClub.club_name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Owner Name</p>
                  <p className="text-white">{viewingClub.owner_name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white">{viewingClub.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-white">{viewingClub.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className={viewingClub.status === 'Active' ? 'text-green-400' : 'text-red-400'}>
                    {viewingClub.status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Payment Status</p>
                  <p className={viewingClub.payment_status === 1 ? 'text-green-400' : 'text-orange-400'}>
                    {viewingClub.payment_status === 1 ? ("Paid") : ("Unpaid")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Expiry Date</p>
                  <p className="text-white">{viewingClub.expiry_date}</p>
                </div>
                <div>
                  <p className="text-gray-400">Last Paid Date</p>
                  <p className="text-white">{viewingClub.last_paid}</p>
                </div>
                <div>
                  <p className="text-gray-400">Created Date</p>
                  <p className="text-white">{viewingClub.created_at}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setViewingClub(null)}
              className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
