import { useState } from 'react';
import { useClubContext } from '../../context/ClubContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Building2, CheckCircle } from 'lucide-react';
import api from '../../Api';
import { Signup } from '../../utils/agentService';
import { error } from 'console';
import axios from 'axios';

axios.defaults.withCredentials = true; // important to send cookies


export default function CreateClub() {
  const { addClub } = useClubContext();
  const [formData, setFormData] = useState({
    club_name: '',
    owner_name: '',
    email: '',
    phone: '',
    password: '',
    // expiryDate: '',
  });
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    Signup(formData)
      .then((response) => {
        
        setSuccess(true);
        setMessage("Signup successful! You can now login.");
      })
      .catch((err) => console.error("Error Creating Club"));

    setTimeout(() => setSuccess(false), 3000);

    // Reset form
    setFormData({
      club_name: '',
      owner_name: '',
      email: '',
      phone: '',
      password: '',
      // expiryDate: '',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#00ff41]/10 rounded-lg">
          <Building2 className="w-6 h-6 text-[#00ff41]" />
        </div>
        <div>
          <h1 className="text-white">Create Snooker Club Account</h1>
          <p className="text-gray-400">Add a new club to the system</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">Club created successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Club Name *</label>
            <Input
              required
              value={formData.club_name}
              onChange={(e) => setFormData({ ...formData, club_name: e.target.value })}
              placeholder="Elite Snooker Arena"
              className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Owner Name *</label>
            <Input
              required
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              placeholder="John Smith"
              className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email *</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="owner@club.com"
              className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Phone Number *</label>
            <Input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1234567890"
              className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password *</label>
            <div className="flex gap-2">
              <Input
                required
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter or generate password"
                className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
              />
              <Button
                type="button"
                onClick={generatePassword}
                className="bg-[#00ff41]/20 hover:bg-[#00ff41]/30 text-[#00ff41] border border-[#00ff41]/30"
              >
                Generate
              </Button>
            </div>
          </div>

          {/*<div>
            <label className="block text-gray-300 mb-2">Expiry Date *</label>
            <Input
              required
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
            />
          </div>*/}
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-[#00ff41] hover:bg-[#00dd38] text-black transition-all duration-300 hover:shadow-lg hover:shadow-[#00ff41]/50"
          >
            Create Club Account
          </Button>
          <Button
            type="button"
            onClick={() => setFormData({
              club_name: '',
              owner_name: '',
              email: '',
              phone: '',
              password: '',
              expiryDate: '',
            })}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  );
}
