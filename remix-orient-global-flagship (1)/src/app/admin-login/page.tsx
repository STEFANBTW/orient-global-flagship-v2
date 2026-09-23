'use client';

import { useNavigate, Link } from 'react-router-dom';
import { useRoles } from '@/context/role-context';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, ArrowRight, ArrowLeft, Loader2, User, Phone, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { validateAdminLogin, setActiveAdminUser, setActiveConsumerUser, getActiveAdminUser } from '@/services/userService';

const ROLE_OPTIONS = [
  { value: 'boss', label: 'Boss (Tier 01 Executive)' },
  { value: 'hod', label: 'HOD (Head of Department)' },
  { value: 'staff', label: 'Staff (Operational)' },
];

export default function AdminLoginPage({ onCancel }: { onCancel?: () => void }) {
  const { setCurrentUser } = useRoles();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'boss' | 'hod' | 'staff'>('boss');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Session guard: if already logged in as admin, skip login and go straight to dashboard
  useEffect(() => {
    const existing = getActiveAdminUser();
    if (existing) {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim() || !role) {
      setErrorMsg('Name, Phone Number, and Role are required.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const foundAdmin = await validateAdminLogin(phone, name, role);

      setActiveAdminUser(foundAdmin);
      sessionStorage.setItem('orient_dashboard_mode', 'admin');

      if (setCurrentUser) {
        setCurrentUser({
          id: foundAdmin.id,
          name: foundAdmin.name,
          email: foundAdmin.email || `${phone.trim().replace(/\s+/g, '')}@orientglobal.ng`,
          role: foundAdmin.role as any,
          division: (foundAdmin.division as any) || 'global',
          avatar: foundAdmin.avatar
        });
      }

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 300);
    } catch (err: any) {
      setIsLoggingIn(false);
      if (err?.message === 'CUSTOMER_ACCOUNT_REJECTED') {
        setErrorMsg('Access Denied: A customer account cannot be used as an admin credential.');
      } else {
        setErrorMsg('Access Denied: Admin credentials not found in system database. Please contact system administrator or register as admin.');
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10 my-auto"
      >
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground uppercase italic">Admin Portal</h1>
        </div>

        <Card className="border-none shadow-xl bg-card/90 backdrop-blur-md">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Admin Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-[#1a1a1a] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    placeholder="Boss / Admin Name"
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
                    placeholder="+234 800 000 0001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative" ref={dropdownRef}>
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Admin Role <span className="text-red-500">*</span>
                </label>
                
                {/* Custom Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className={`w-full h-11 px-4 rounded-xl bg-[#1a1a1a] text-foreground text-sm font-semibold flex items-center justify-between cursor-pointer transition-all border ${
                    isRoleDropdownOpen ? 'border-orange-500 ring-1 ring-orange-500/50' : 'border-transparent hover:bg-[#222222]'
                  }`}
                >
                  <span>{ROLE_OPTIONS.find(r => r.value === role)?.label || 'Select Role'}</span>
                  <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Custom Overlay Menu */}
                <AnimatePresence>
                  {isRoleDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl p-1.5 space-y-1 backdrop-blur-xl"
                    >
                      {ROLE_OPTIONS.map((opt) => {
                        const isSelected = role === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setRole(opt.value as any);
                              setIsRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-orange-500/15 text-orange-400 font-extrabold border border-orange-500/30'
                                : 'text-foreground hover:bg-white/10'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 border-none"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <span>Access CMS</span>
                )}
              </button>
            </form>

            <div className="text-center text-xs font-medium text-muted-foreground pt-3 border-t border-[#1a1a1a]">
              Need a new admin account?{' '}
              <Link to="/admin-signup" className="text-primary hover:underline font-bold">
                Admin Signup
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
