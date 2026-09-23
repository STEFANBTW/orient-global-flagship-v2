import React, { useState, useEffect } from 'react';
import DashboardScreen from './components/DashboardScreen';
import MenuScreen from './components/MenuScreen';
import AboutScreen from './components/AboutScreen';
import DeliveryScreen from './components/DeliveryScreen';
import ReservationsScreen from './components/ReservationsScreen';

export type DiningView = 'dashboard' | 'menu' | 'about' | 'delivery' | 'reservations';

export const DiningNav: React.FC<{ navHidden: boolean, currentView: DiningView, setView: (v: DiningView) => void }> = ({ navHidden, currentView, setView }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleDetailModal = (e: any) => {
      setModalOpen(Boolean(e.detail?.open));
    };
    window.addEventListener('orient:detail-modal', handleDetailModal);
    return () => window.removeEventListener('orient:detail-modal', handleDetailModal);
  }, []);

  return (
    <div
      className={`fixed bottom-0 origin-bottom left-0 w-full z-30 lg:top-0 lg:bottom-auto bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-transparent lg:border-t-0 lg:border-b shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] h-13 lg:h-12 px-2 sm:px-4 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        modalOpen 
          ? 'opacity-0 pointer-events-none invisible' 
          : ((navHidden || !isMobile)
              ? 'translate-y-0 scale-100 opacity-100 blur-0' 
              : 'translate-y-[-50%] scale-50 opacity-0 blur-md pointer-events-none')
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-2">
        <div className="flex-1 hidden sm:block"></div>
        <div className="flex items-center justify-start md:justify-center space-x-3 sm:space-x-6 overflow-x-auto [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full [mask-image:linear-gradient(to_right,black_90%,transparent_100%)] px-2 flex-grow text-[10px] sm:text-[11px] after:content-[''] after:w-4 after:shrink-0">
          {(['menu', 'reservations', 'delivery', 'about'] as DiningView[]).map((view) => (
            <button
              key={view}
              onClick={() => {
                setView(view);
                document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap px-3 py-1.5 rounded-full ${
                currentView === view 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800/60'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
        <div className="flex-1 flex justify-end shrink-0">
          <button 
            onClick={() => {
              setView('dashboard');
              document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Dashboard"
            className={`p-1.5 rounded-full transition-all duration-300 flex items-center justify-center ${
              currentView === 'dashboard'
                ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-600 hover:text-neutral-950 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <span className="material-icons text-base">person</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DiningApp: React.FC<{ currentView: DiningView; setView?: (v: DiningView) => void }> = ({ currentView, setView }) => {
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardScreen
            onNavigateToMenu={() => setView?.('menu')}
            onNavigateToReservations={() => setView?.('reservations')}
          />
        );
      case 'menu': return <MenuScreen />;
      case 'about': return <AboutScreen />;
      case 'delivery': return <DeliveryScreen />;
      case 'reservations': return <ReservationsScreen />;
      default: return <MenuScreen />;
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {renderView()}
    </div>
  );
};
