import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { User } from 'lucide-react';

export function ClubLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { clubLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (clubLogin(email, password)) {
      // Success - AuthContext will handle redirect
    } else {
      setError('Invalid credentials or account deactivated');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/30"
         style={{
           backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(120, 255, 120, 0.05) 0%, transparent 50%)',
         }}>
      <Card className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/20 p-4 rounded-full neon-glow">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-primary neon-text">Club Owner Login</h1>
          <p className="text-muted-foreground text-sm">Access Your Snooker Club Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="club@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
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
          <p>Contact admin for account access</p>
        </div>
      </Card>
    </div>
  );
}
