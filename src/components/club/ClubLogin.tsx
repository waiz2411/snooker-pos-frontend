import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LogIn, AlertCircle } from 'lucide-react';
import { Login } from '../../utils/agentService';


export default function ClubLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { clubLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    if (clubLogin(email, password)) {
      const form = {
        email: email,
        password: password
      }
      Login(form)
        .then((response) => {
          localStorage.setItem("token", response.token);
          localStorage.setItem("club_id", response.club.id);
          navigate('/club/dashboard');
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError('Invalid credentials');
        })
    }
  };

  const [clickCount, setClickCount] = useState(0);
  const lastClickTimeRef = useRef(0);

  const handleSecretClick = () => {
    const now = Date.now();

    // Reset if time between clicks is more than 300ms
    if (now - lastClickTimeRef.current > 300) {
      setClickCount(1);
    } else {
      setClickCount((prev) => prev + 1);
    }

    lastClickTimeRef.current = now;

    // Navigate after 5 rapid clicks
    if (clickCount + 1 === 5) {
      navigate("/admin/login");
      setClickCount(0); // reset
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0d3d1a 50%, #0a0a0a 100%)'
      }}>
      {/* Snooker table texture overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #00ff41 0px, transparent 1px, transparent 40px), repeating-linear-gradient(0deg, #00ff41 0px, transparent 1px, transparent 40px)',
        }}>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#00ff41]/10 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#00ff41]/10 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse delay-1000"></div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/5 border border-[#00ff41]/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00ff41]/10 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-[#00ff41]" onClick={handleSecretClick}/>
            </div>
            <h1 className="text-[#00ff41] mb-2">Club Owner Login</h1>
            <p className="text-gray-400">Access your snooker club dashboard</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email / Club ID
              </label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="owner@club.com"
                className="bg-black/40 border-[#00ff41]/30 text-white placeholder:text-gray-500 focus:border-[#00ff41]"
              />
            </div>

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
                placeholder="Enter your password"
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
              {loading ? ("Loading...") : ("Login to Club Dashboard")}
            </Button>

            {/* <div className="text-center">
              <a
                onClick={() => navigate('/admin/login')}
                className="text-[#00ff41] hover:underline"
              >
                ← Back to Admin Login
              </a>
            </div> */}
          </div>
        </div>

        {/* Demo credentials */}
        {/* <div className="text-center mt-6 text-gray-500">
          <p>Demo: Use any email and password to login</p>
        </div> */}
      </div>
    </div>
  );
}
