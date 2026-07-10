import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAdmin, isLoading } = useAuth();

  // If loading auth state, show blank or spinner
  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-nm-black text-white">Loading...</div>;
  }

  // If already logged in and admin, redirect to app
  if (user && isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const checkAdmin = data.user?.user_metadata?.role === 'admin' || data.user?.app_metadata?.role === 'admin';
    if (!checkAdmin) {
      toast.error('Access denied. You must be an admin to access NullMail.');
      await supabase.auth.signOut();
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-nm-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-nm-accent/10 via-nm-black to-nm-black p-4">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nm-accent/20 rounded-full blur-[128px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-nm-surface/40 backdrop-blur-3xl border border-nm-border p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nm-accent/50 to-transparent" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-nm-surface to-nm-elevated border border-nm-border mb-6 shadow-inner">
              <Mail className="w-8 h-8 text-nm-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">NullMail Admin</h1>
            <p className="text-nm-text-tertiary">Sign in to compose and send emails</p>
          </div>

          {user && !isAdmin ? (
             <div className="mb-6 p-4 rounded-xl bg-nm-danger/10 border border-nm-danger/20 text-nm-danger flex items-start gap-3">
               <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
               <div className="text-sm">
                 <p className="font-semibold mb-1">Access Denied</p>
                 <p>Your account does not have admin privileges. Please sign in with an admin account.</p>
               </div>
             </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@thenullprojects.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={16} />}
              required
            />

            <Button
              type="submit"
              className="w-full mt-4"
              size="lg"
              loading={loading}
              icon={!loading ? <ArrowRight size={18} /> : undefined}
            >
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
