'use client';

import React from 'react';
import DivisionCatalogView from '@/components/dashboard/DivisionCatalogView';
import { useRoles } from '@/context/role-context';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function LoungeDashboard() {
  const { currentUser } = useRoles();
  const isAdminMode = currentUser?.role === 'boss' || currentUser?.role === 'hod' || currentUser?.role === 'staff';

  if (!isAdminMode) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/5">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">Orient Lounge</h1>
        
        {/* For dining, we show a Go To Menu button. For others, Coming Soon. */}
        
        <p className="text-muted-foreground max-w-md mx-auto mb-6 text-base">
          This division's user dashboard is currently under construction and will be rolling out soon.
        </p>
        <div className="px-6 py-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-widest text-sm shadow-inner">
          Coming Soon
        </div>
        
      </div>
    );
  }

  return <DivisionCatalogView divisionId="lounge" />;
}
