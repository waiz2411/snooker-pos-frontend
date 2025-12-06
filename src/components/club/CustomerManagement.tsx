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
import { Users, Plus, Trash2, Edit, DollarSign } from 'lucide-react';
import { createCustomer, getCustomers, UpdateCustomer, DeleteCustomer, getGames } from '../../utils/agentService';


export default function CustomerManagement() {
  const { updateCustomer, deleteCustomer } = useClubContext();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [customers, setCustomers] = useState([]);
  const [games, setGames] = useState([]);
  const [TotalPayed, setTotalPayed] = useState(0);
  const [TotalDue, setTotalDue] = useState(0);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const clubId = localStorage.getItem("club_id");
  const [formData, setFormData] = useState({
    name: '',
    phoneNum: null,
    billed_amount: 0,
    paid_amount: 0,
  });

  useEffect(() => {
    handleAutoFetch();
  }, [])

  const handleAutoFetch = async () => {
    getCustomers(clubId)
      .then((res) => {
        // console.log(res);
        setCustomers(res.customers);
        // Calculate totals
        const totalPaid = res.customers.reduce(
          (sum, customer) => sum + Number(customer.paid_amount || 0),
          0
        );

        const totalBilled = res.customers.reduce(
          (sum, customer) => sum + Number(customer.pending_amount || 0),
          0
        );

        setTotalPayed(totalPaid);
        setTotalDue(totalBilled);
      })
      .catch((err) => console.error("Error getting Customers"));
    getGames(clubId)
      .then((res) => {
        // console.log(res.games);
        setGames(res.games);
      })
      .catch((err) => console.error("Error Creating Club"));
  }

  const handleAddCustomer = () => {
    setLoading(true);
    if (formData.name && formData.phoneNum) {
      // console.log("Form Data:", formData);
      createCustomer(clubId, formData)
        .then((res) => {
          setMessage("Customer Created Successfully")
          setFormData({ name: '', phoneNum: null, billed_amount: 0, paid_amount: 0 });


          setTimeout(() => {
            setMessage("");
            setLoading(false);
            setShowAddDialog(false);
            window.location.reload();
          }, 2000);
        })
        .catch((err) => console.error("error creating customer"))
    } else {
      setLoading(false);
      setError("Please fill all information.")
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  const handleUpdateCustomer = () => {
    if (editingCustomer) {
      setLoading(true);
      UpdateCustomer(clubId, editingCustomer.id, formData)
        .then((res) => setMessage("Customer Updated Successfully."))
      setTimeout(() => {
        setMessage("");
        setLoading(false);
        window.location.reload();
      }, 2000);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      DeleteCustomer(clubId, customerId)
        .then((res) => {
          deleteCustomer(customerId);
          setMessage("Customer Deleted Successfully.");
          setTimeout(() => {
            setMessage("");
            window.location.reload();
          }, 2000);
        })
        .catch((err) => console.error("Error Deleting Customer"));
    }
  };

  const formatWhatsappNumber = (num) => {
    // Remove spaces, dashes, or plus sign
    let cleaned = num.replace(/\D/g, "");

    // If number starts with 03 → convert to 92
    if (cleaned.startsWith("03")) {
      cleaned = "92" + cleaned.substring(1);
    }

    // If number already starts with 923 → keep as is
    if (cleaned.startsWith("923")) {
      return cleaned;
    }

    return cleaned;
  };

  const openEditDialog = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      billed_amount: customer.billed_amount,
      paid_amount: customer.paid_amount,
      phoneNum: customer.phoneNum,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white">Customer Management</h1>
          {/* <p className="text-gray-400">Manage temporary players (auto-deleted after 24h inactivity)</p> */}
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#00ff41]" />
            <span className="text-gray-400">Total Customers</span>
          </div>
          <p className="text-[#00ff41]">{customers.length}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-green-400/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-gray-400">Total Paid</span>
          </div>
          <p className="text-green-400">
            Rs {TotalPayed}
          </p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-orange-400/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
            <span className="text-gray-400">Total Due</span>
          </div>
          <p className="text-orange-400">
            Rs {TotalDue}
          </p>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6 hover:border-[#00ff41]/40 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white mb-1">{customer.name}</h3>
                <p className="text-gray-500">
                  Phone:
                  <span
                    className="text-[#00ff41] px-2 hover:underline"
                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                    onClick={() => {
                      const number = formatWhatsappNumber(customer.phoneNum);
                      window.open(`https://wa.me/${number}`, "_blank");
                    }}>
                      
                    {customer.phoneNum}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditDialog(customer)}
                  className="text-[#00ff41] hover:bg-[#00ff41]/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <span className="text-gray-400">Billed</span>
                <span className="text-white">Rs {customer.billed_amount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="text-gray-400">Paid</span>
                <span className="text-green-400">Rs {customer.paid_amount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <span className="text-gray-400">Remaining</span>
                <span className="text-orange-400">Rs {Number(customer.billed_amount) - Number(customer.paid_amount)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <span className="text-gray-400">Wins today</span>
                <span className="text-blue-400">{customer.wins_today}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <span className="text-gray-400">Losses Today</span>
                <span className="text-red-400">{customer.losses_today}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No customers yet</p>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Customer
          </Button>
        </div>
      )}

      {/* Add Customer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#0d1117] border-[#00ff41]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#00ff41]">Add New Customer</DialogTitle>
            <DialogTitle className="text-[#00ff41]">{message}</DialogTitle>
            <DialogTitle className="text-[#ff0000]">{error}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Customer Name *</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="bg-black/40 border-[#00ff41]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Phone Number *</label>
              <Input
                required
                type="tel"
                value={formData.phoneNum}
                onChange={(e) => setFormData({ ...formData, phoneNum: e.target.value })}
                placeholder="eg: 03123456789"
                className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Billed Amount (Rs )</label>
              <Input
                type="number"
                value={formData.billed_amount}
                onChange={(e) => setFormData({ ...formData, billed_amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="bg-black/40 border-[#00ff41]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Paid Amount (Rs )</label>
              <Input
                type="number"
                value={formData.paid_amount}
                onChange={(e) => setFormData({ ...formData, paid_amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="bg-black/40 border-[#00ff41]/30 text-white"
              />
            </div>
            <div className="p-3 bg-[#00ff41]/10 rounded-lg border border-[#00ff41]/20">
              <p className="text-gray-400">Remaining Amount</p>
              <p className="text-[#00ff41]">
                Rs {formData.billed_amount - formData.paid_amount}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddDialog(false);
                setFormData({ name: '', billed_amount: 0, paid_amount: 0 });
              }}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
              className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
            >
              {loading ? "loading..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
        <DialogContent className="bg-[#0d1117] border-[#00ff41]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#00ff41]">Edit Customer</DialogTitle>
            <DialogTitle className="text-[#00ff41]">{message}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Customer Name *</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="bg-black/40 border-[#00ff41]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Phone Number *</label>
              <Input
                required
                type="tel"
                value={formData.phoneNum}
                onChange={(e) => setFormData({ ...formData, phoneNum: e.target.value })}
                placeholder="+1234567890"
                className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Billed Amount (Rs )</label>
              <Input
                type="number"
                value={formData.billed_amount}
                onChange={(e) => setFormData({ ...formData, billed_amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="bg-black/40 border-[#00ff41]/30 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Paid Amount (Rs )</label>
              <Input
                type="number"
                value={formData.paid_amount}
                onChange={(e) => setFormData({ ...formData, paid_amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="bg-black/40 border-[#00ff41]/30 text-white"
              />
            </div>
            <div className="p-3 bg-[#00ff41]/10 rounded-lg border border-[#00ff41]/20">
              <p className="text-gray-400">Remaining Amount</p>
              <p className="text-[#00ff41]">
                Rs {formData.billed_amount - formData.paid_amount}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setEditingCustomer(null);
                setFormData({ name: '', billed_amount: 0, paid_amount: 0 });
              }}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCustomer}
              className="bg-[#00ff41] hover:bg-[#00dd38] text-black"
            >
              {loading ? "Loading..." : "Update Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
