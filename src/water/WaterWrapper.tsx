import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Home from './components/Home';
import Process from './components/Process';
import Impact from './components/Impact';
import Logistics from './components/Logistics';

export type WaterPage = 'home' | 'process' | 'impact' | 'logistics';

export const WaterNav: React.FC<{ navHidden: boolean, currentPage: WaterPage, onNavigate: (p: WaterPage) => void }> = ({ navHidden, currentPage, onNavigate }) => {
 const { theme, toggleTheme } = useTheme();
 const [isMobile, setIsMobile] = useState(false);
 
 useEffect(() => {
 const checkMobile = () => setIsMobile(window.innerWidth < 1024);
 checkMobile();
 window.addEventListener('resize', checkMobile);
 return () => window.removeEventListener('resize', checkMobile);
 }, []);

 return (
 <nav 
 className={`fixed bottom-0 origin-bottom left-0 w-full z-30 lg:top-0 lg:bottom-auto bg-card/90 backdrop-blur-md border-t border-transparent shadow-[0_-10px_30px_rgba(0,0,0,0.2)] h-13 lg:h-12 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
 (navHidden || !isMobile)
 ? 'translate-y-0 scale-100 opacity-100 blur-0' 
 : 'translate-y-[-50%] scale-50 opacity-0 blur-md pointer-events-none'
 }`}
 >
 <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 h-full">
 <div className="flex items-center justify-between h-full">
 <div className="hidden sm:flex items-center gap-4 cursor-pointer group shrink-0" onClick={() => onNavigate('home')}>
 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-500">
 <span className="material-icons text-blue-500 text-xl font-light">water_drop</span>
 </div>
 <span className="font-sans font-light text-lg tracking-[0.2em] text-foreground uppercase">
 Orient<span className="font-medium text-blue-500 ml-1">Water</span>
 </span>
 </div>
 
 <div className="flex items-center space-x-8 sm:space-x-12 overflow-x-auto [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-400/20 [&::-webkit-scrollbar-thumb]:rounded-full [mask-image:linear-gradient(to_right,black_90%,transparent_100%)] px-4 flex-grow justify-start md:justify-center text-base after:content-[''] after:w-4 after:shrink-0">
 {[
 { id: 'home', label: 'Home' },
 { id: 'process', label: 'Process' },
 { id: 'impact', label: 'Impact' },
 { id: 'logistics', label: 'Logistics' }
 ].map((item) => (
 <button 
 key={item.id}
 onClick={() => {
 onNavigate(item.id as WaterPage);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }} 
 className={`relative text-[11px] font-medium uppercase tracking-[0.3em] transition-colors duration-500 ${
 currentPage === item.id ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground dark:hover:text-background'
 }`}
 >
 {item.label}
 {currentPage === item.id && (
 <motion.div 
 layoutId="water-nav-indicator"
 className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"
 />
 )}
 </button>
 ))}
 </div>

 <div className="flex items-center gap-6">
 <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-background dark:hover:bg-card/5 transition-colors duration-500 text-muted-foreground hover:text-foreground dark:hover:text-background">
 <span className="material-icons text-sm font-light">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
 </button>
 <button className="hidden sm:flex items-center justify-center px-8 py-3 rounded-full bg-foreground text-background text-background text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-background transition-all duration-500">
 Order Now
 </button>
 </div>
 </div>
 </div>
 </nav>
 );
};

export const WaterApp: React.FC<{ currentPage: WaterPage, onNavigate: (p: WaterPage) => void }> = ({ currentPage, onNavigate }) => {
 const renderPage = () => {
 switch (currentPage) {
 case 'home': return <Home onNavigate={onNavigate} />;
 case 'process': return <Process />;
 case 'impact': return <Impact />;
 case 'logistics': return <Logistics />;
 default: return <Home onNavigate={onNavigate} />;
 }
 };

 return (
 <div className="min-h-screen bg-background font-sans selection:bg-blue-500/30">
 <AnimatePresence mode="wait">
 <motion.div
 key={currentPage}
 initial={{ opacity: 0, filter: 'blur(10px)' }}
 animate={{ opacity: 1, filter: 'blur(0px)' }}
 exit={{ opacity: 0, filter: 'blur(10px)' }}
 transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
 >
 {renderPage()}
 </motion.div>
 </AnimatePresence>
 </div>
 );
};

