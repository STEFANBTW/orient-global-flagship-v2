'use client';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRoles } from '@/context/role-context';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, User, Phone, Mail, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllUsers, saveUser, setActiveConsumerUser, phonesMatch } from '@/services/userService';

export default function SignupPage({ onCancel }: { onCancel?: () => void }) {
  const { setCurrentUser } = useRoles();
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUserSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Name and Phone Number are mandatory.');
      return;
    }

    if (!whatsappConsent) {
      setErrorMsg('You must consent to receive WhatsApp messages to proceed.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const allUsers = getAllUsers();
    
    // Check if phone number already exists
    const existing = allUsers.find(u => phonesMatch(u.phone, phone));
    if (existing) {
      setErrorMsg('This phone number is already registered. Please login instead.');
      return;
    }

    setIsSigningUp(true);

    try {
      const newUserId = `usr_${Date.now()}`;
      const fullName = surname.trim() ? `${name.trim()} ${surname.trim()}` : name.trim();
      const initials = `${name.trim()[0] || ''}${surname.trim()[0] || ''}`.toUpperCase() || 'US';

      const newUser = {
        id: newUserId,
        name: fullName,
        surname: surname.trim() || undefined,
        phone: phone.trim(),
        email: email.trim() || undefined,
        whatsappConsent: true,
        role: 'customer' as const,
        avatar: initials,
        createdAt: new Date().toISOString()
      };

      await saveUser(newUser);      setActiveConsumerUser(newUser);
      sessionStorage.setItem('orient_dashboard_mode', 'customer');

      if (setCurrentUser) {
        setCurrentUser({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email || `${cleanPhone}@orientglobal.ng`,
          role: 'customer',
          division: 'global',
          avatar: newUser.avatar
        });
      }

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 300);
    } catch (err) {
      setErrorMsg('Failed to create account. Please try again.');
      setIsSigningUp(false);
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
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground max-w-sm mx-auto leading-tight">
            First time? You're going to have a great time with us
          </h1>
        </div>

        <Card className="border-none shadow-xl bg-card/90 backdrop-blur-md">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUserSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    className="w-full h-11 px-3 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    placeholder="First Name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Surname <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={surname}
                    onChange={(e) => setSurname(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    className="w-full h-11 px-3 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    placeholder="Surname"
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Email Address <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* WhatsApp Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={whatsappConsent}
                    onChange={(e) => setWhatsappConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-orange-500 rounded border-border/60 focus:ring-orange-500 cursor-pointer shrink-0"
                    required
                  />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                    I consent to receive order updates, receipts, and news via <strong className="text-foreground font-bold">WhatsApp</strong>. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={isSigningUp || !whatsappConsent}
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-2 border-none"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                  </>
                ) : (
                  <>
                    Create Account & Proceed <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs font-medium text-muted-foreground pt-2 border-t border-[#1a1a1a]">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 hover:underline font-bold">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
