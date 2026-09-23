import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getActiveConsumerUser, setActiveConsumerUser, AppUser, MOCK_NIGERIAN_USERS } from '@/services/userService';

interface DashboardProps {
  onNavigate: (page: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(getActiveConsumerUser());

  useEffect(() => {
    const handleUserChanged = (e: any) => {
      setCurrentUser(e.detail || null);
    };
    window.addEventListener('orient_consumer_user_changed', handleUserChanged);
    return () => {
      window.removeEventListener('orient_consumer_user_changed', handleUserChanged);
    };
  }, []);

  const handleSwitchProfile = (user: AppUser | null) => {
    setActiveConsumerUser(user);
    if (!user) {
      onNavigate('Login');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mx-auto text-muted-foreground">
            <span className="material-icons text-2xl">person_outline</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Active Account Selected</h2>
            <p className="text-sm text-muted-foreground">Please select one of the 5 pre-created user profiles to access your personalized dashboard.</p>
          </div>
          <button
            onClick={() => onNavigate('Login')}
            className="w-full py-3.5 bg-foreground text-background font-semibold rounded-2xl hover:opacity-90 transition-opacity cursor-pointer text-sm"
          >
            Select Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-10 px-4 sm:px-8 max-w-5xl mx-auto space-y-12 transition-colors duration-300">
      {/* Header Profile Summary (Borderless & Minimalist) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/20 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-foreground text-background font-bold text-xl flex items-center justify-center shrink-0">
            {currentUser.avatar}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {currentUser.name}
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 font-semibold">
                Active Profile
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{currentUser.email} • {currentUser.phone}</p>
            <p className="text-xs text-muted-foreground/80 pt-0.5">{currentUser.deliveryAddress}</p>
          </div>
        </div>

        <button
          onClick={() => handleSwitchProfile(null)}
          className="px-5 py-2.5 rounded-2xl bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold transition-colors shrink-0 cursor-pointer"
        >
          Switch Account
        </button>
      </motion.div>

      {/* Main Essential Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order History (Empty for all new users) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-muted/10 rounded-3xl p-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Active Orders & History</h2>
            <span className="text-xs text-muted-foreground font-mono">0 Orders</span>
          </div>

          <div className="py-10 text-center space-y-3">
            <span className="material-icons text-3xl text-muted-foreground/40">shopping_bag</span>
            <p className="text-sm font-medium text-foreground">No transaction history</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              This is a newly created user account. Browse any division to place your first order.
            </p>
            <button
              onClick={() => onNavigate('Home')}
              className="mt-2 text-xs text-orange-500 font-semibold hover:underline inline-block cursor-pointer"
            >
              Start Shopping →
            </button>
          </div>
        </motion.div>

        {/* Account Details & Preferences */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-muted/10 rounded-3xl p-8 space-y-6"
        >
          <h2 className="text-lg font-bold text-foreground">Account Details</h2>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Full Name</span>
              <p className="font-semibold text-foreground">{currentUser.name}</p>
            </div>

            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Contact Phone</span>
              <p className="font-semibold text-foreground">{currentUser.phone}</p>
            </div>

            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Delivery Address</span>
              <p className="font-semibold text-foreground">{currentUser.deliveryAddress}</p>
            </div>

            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Region</span>
              <p className="font-semibold text-foreground">{currentUser.city}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Switch to Any of the 5 Profiles Directly */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-6 space-y-4"
      >
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Available User Accounts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {MOCK_NIGERIAN_USERS.map((usr) => {
            const isSelected = usr.id === currentUser.id;
            return (
              <button
                key={usr.id}
                onClick={() => handleSwitchProfile(usr)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-foreground text-background font-semibold' 
                    : 'bg-muted/20 hover:bg-muted/40 text-foreground'
                }`}
              >
                <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center mb-2 ${
                  isSelected ? 'bg-background text-foreground' : 'bg-foreground text-background'
                }`}>
                  {usr.avatar}
                </div>
                <p className="text-xs font-semibold truncate">{usr.name}</p>
                <p className="text-[10px] opacity-70 truncate">{usr.phone}</p>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
