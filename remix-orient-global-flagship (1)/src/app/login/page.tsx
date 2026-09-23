'use client';

import { useNavigate, Link } from 'react-router-dom';
import { useRoles } from '@/context/role-context';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, User, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { validateUserLogin, setActiveConsumerUser, getActiveConsumerUser } from '@/services/userService';

export default function LoginPage({ onCancel }: { onCancel?: () => void }) {
  const { setCurrentUser } = useRoles();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Session guard: if already logged in, skip login and go straight to dashboard
  useEffect(() => {
    const existing = getActiveConsumerUser();
    if (existing) {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Name and Phone Number are mandatory.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const foundUser = await validateUserLogin(phone, name);
      setActiveConsumerUser(foundUser);
      sessionStorage.setItem('orient_dashboard_mode', 'customer');
      
      if (setCurrentUser) {
        setCurrentUser({
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email || `${phone.trim().replace(/\s+/g, '')}@orientglobal.ng`,
          role: 'customer',
          division: 'global',
          avatar: foundUser.avatar
        });
      }

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 300);
    } catch (err: any) {
      setIsLoggingIn(false);
      if (err?.message === 'ADMIN_ACCOUNT_REJECTED') {
        setErrorMsg('Admin accounts cannot log in here. Please use the Admin Login page.');
      } else {
        setErrorMsg('Account not found. Access denied! You must sign up first before logging in.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-x-hidden font-sans">
      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10 my-auto"
      >
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-12 h-12 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/10 mb-3">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Glad to have you back</h1>
        </div>

        <Card className="border-none shadow-xl bg-card/90 backdrop-blur-md">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUserLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s-]/g, ''))}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium font-mono"
                    placeholder="+234 800 000 0000"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-2 border-none"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  <>
                    Login to Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs font-medium text-muted-foreground pt-2">
              <div>
                Don't have an account?{' '}
                <Link to="/signup" className="text-orange-500 hover:underline font-bold">
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
