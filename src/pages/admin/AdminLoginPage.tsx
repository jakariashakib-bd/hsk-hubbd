import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, LogIn } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      // After login, navigate to admin - AdminGuard will check if user is actually admin
      navigate('/admin');
    } catch (err: any) {
      toast({ title: '❌ Login Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center brutalist-border mx-auto mb-4">
            <Shield className="text-primary-foreground" size={32} />
          </div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">
            Sign in with your admin credentials
          </p>
        </div>

        <div className="brutalist-card rounded-xl p-6 bg-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-muted-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-muted-foreground">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full brutalist-shadow" disabled={loading}>
              <LogIn size={16} className="mr-2" />
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Not an admin?{' '}
            <button
              onClick={() => navigate('/auth')}
              className="text-primary font-medium hover:underline"
            >
              Go to User Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
