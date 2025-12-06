import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Lock } from 'lucide-react';

export function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (adminLogin(password)) {
      // Success - AuthContext will handle redirect
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/30">
      <Card className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/20 p-4 rounded-full neon-glow">
              <Lock className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-primary neon-text">Admin Login</h1>
          <p className="text-muted-foreground text-sm">Super Admin Access Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Waiztahseen@2007"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass border-primary/30 focus:border-primary"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-background neon-glow">
            Login
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          <p>Snooker Club Management System v1.0</p>
        </div>
      </Card>
    </div>
  );
}
