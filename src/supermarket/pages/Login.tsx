import React from 'react';
import { motion } from 'framer-motion';
import { getAllUsers, setActiveConsumerUser, AppUser } from '@/services/userService';

interface Props {
  onNavigate: (page: any) => void;
}

const Login: React.FC<Props> = ({ onNavigate }) => {
  const handleSelectProfile = (user: AppUser) => {
    setActiveConsumerUser(user);
    onNavigate('Dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 font-sans transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-500">
            Account Management
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Select User Profile
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Choose one of the 5 active user accounts to access your personalized dashboard across all divisions.
          </p>
        </div>

        <div className="space-y-3">
          {getAllUsers().filter(u => u.role === 'customer').length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground bg-muted/20 rounded-2xl">
              No customer accounts found. Please sign up via the User Portal.
            </div>
          ) : (
            getAllUsers().filter(u => u.role === 'customer').map((user) => (
              <motion.div
              key={user.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelectProfile(user)}
              className="p-5 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-foreground text-background font-bold text-sm flex items-center justify-center shrink-0">
                  {user.avatar}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-orange-500 transition-colors">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{user.email}</span>
                    <span>•</span>
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 rounded-xl bg-orange-500/10 text-orange-500 text-xs font-semibold group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0">
                Activate
              </div>
            </motion.div>
          )))}
        </div>

        <div className="text-center pt-2">
          <button 
            onClick={() => onNavigate('Home')} 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ← Return to Storefront
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
