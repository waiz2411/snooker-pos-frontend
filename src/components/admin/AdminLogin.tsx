import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Lock, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (adminLogin(password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#00ff41]/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#00ff41]/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00ff41]/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-[#00ff41]" />
            </div>
            <h1 className="text-[#00ff41] mb-2">Admin Login</h1>
            <p className="text-gray-400">Enter your credentials to access the admin panel</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                // placeholder="Waiztahseen@2007"
                className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleLogin}
              className="w-full bg-[#00ff41] hover:bg-[#00dd38] text-black transition-all duration-300 hover:shadow-lg hover:shadow-[#00ff41]/50"
            >
              Login to Admin Panel
            </Button>

            <div className="text-center">
              <a 
                href="/club/login" 
                className="text-[#00ff41] hover:underline"
              >
                Login as Club Owner →
              </a>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        {/* <div className="text-center mt-6 text-gray-500">
          <p>Default Password: Waiztahseen@2007</p>
        </div> */}
      </div>
    </div>
  );
}
