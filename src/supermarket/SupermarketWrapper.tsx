import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Wholesale from './pages/Wholesale';
import Deals from './pages/Deals';
import Dashboard from './pages/Dashboard';
import SmartPaste from './pages/SmartPaste';
import Cart from './pages/Cart';
import Produce from './pages/Produce';
import Aisles from './pages/Aisles';
import PreviouslyBought from './pages/PreviouslyBought';
import BOGOF from './pages/BOGOF';
import Under5 from './pages/Under5';
import Bundles from './pages/Bundles';
import Bakery from './pages/Bakery';
import Receipts from './pages/Receipts';
import Favorites from './pages/Favorites';
import Loyalty from './pages/Loyalty';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import AisleCategory from './pages/AisleCategory';

export type SupermarketPage = 'Home' | 'Wholesale' | 'Deals' | 'Dashboard' | 'Cart' | 'Produce' | 'Aisles' | 'PreviouslyBought' | 'BOGOF' | 'Under5' | 'Bundles' | 'Bakery' | 'Receipts' | 'Favorites' | 'Loyalty' | 'Settings' | 'Login' | 'Register' | string;

export const SupermarketNav: React.FC<{ navHidden: boolean, activePage: SupermarketPage, setActivePage: (p: SupermarketPage) => void, setIsSmartPasteOpen: (o: boolean) => void }> = ({ navHidden, activePage, setActivePage, setIsSmartPasteOpen }) => {
 const { theme, toggleTheme } = useTheme();
 const [isMobile, setIsMobile] = useState(false);
 
 useEffect(() => {
 const checkMobile = () => setIsMobile(window.innerWidth < 1024);
 checkMobile();
 window.addEventListener('resize', checkMobile);
 return () => window.removeEventListener('resize', checkMobile);
 }, []);

 const pages: { id: SupermarketPage; label: string; icon: string }[] = [
 { id: 'Home', label: 'Storefront', icon: 'storefront' },
 { id: 'Aisles', label: 'Aisles', icon: 'view_list' },
 { id: 'Produce', label: 'Produce', icon: 'eco' },
 { id: 'Deals', label: 'Deals', icon: 'local_offer' },
 { id: 'Wholesale', label: 'Wholesale', icon: 'inventory_2' },
 { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
 ];

 return (
 <nav 
 className={`fixed bottom-0 origin-bottom left-0 w-full z-30 lg:top-0 lg:bottom-auto bg-foreground text-background/90 backdrop-blur-md text-background border-t border-transparent shadow-[0_-10px_30px_rgba(0,0,0,0.3)] h-[60px] lg:h-12 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
 (navHidden || !isMobile)
 ? 'translate-y-0 scale-100 opacity-100 blur-0' 
 : 'translate-y-[-50%] scale-50 opacity-0 blur-md pointer-events-none'
 }`}
 >
 <div className="max-w-[1600px] mx-auto px-2 sm:px-4 h-full">
 <div className="flex items-center justify-between h-full">
 <div className="hidden sm:flex items-center gap-1 mr-2 sm:mr-6 shrink-0 cursor-pointer" onClick={() => setActivePage('Home')}>
 <motion.span 
 whileHover={{ rotate: 180 }}
 transition={{ duration: 0.6 }}
 className="material-icons text-orange-500 text-lg sm:text-xl"
 >
 api
 </motion.span>
 <span className="font-bold tracking-tight text-sm sm:text-base">Orient<span className="font-normal text-muted-foreground">Suite</span></span>
 </div>
 <div className="flex items-center gap-1 flex-1 overflow-x-auto [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-card/20 [&::-webkit-scrollbar-thumb]:rounded-full [mask-image:linear-gradient(to_right,black_90%,transparent_100%)] px-4 sm:px-2 justify-start lg:justify-center text-[clamp(0.85rem,1.1vw,1rem)] after:content-[''] after:w-4 after:shrink-0">
 {pages.map((page) => (
 <button
 key={page.id}
 onClick={() => setActivePage(page.id)}
 className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-[clamp(0.75rem,1vw,0.9rem)] font-bold transition-all whitespace-nowrap z-10 ${
 activePage === page.id
 ? 'text-foreground'
 : 'text-muted-foreground hover:text-background hover:bg-foreground text-background'
 }`}
 >
 {activePage === page.id && (
 <motion.div
 layoutId="nav-pill-sm"
 className="absolute inset-0 bg-card rounded-full shadow-sm -z-10"
 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
 />
 )}
 <span className="material-icons text-sm">{page.icon}</span>
 <span className="text-[10px] sm:text-xs">{page.label}</span>
 </button>
 ))}
 <div className="w-px h-6 bg-foreground text-background mx-1 sm:mx-2 shrink-0"></div>
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => setIsSmartPasteOpen(true)}
 className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[clamp(0.75rem,1vw,0.9rem)] font-bold transition-all whitespace-nowrap text-muted-foreground hover:text-background hover:bg-foreground text-background"
 >
 <span className="material-icons text-sm">content_paste</span>
 <span className="text-[10px] sm:text-xs">Smart Paste</span>
 </motion.button>
 </div>
 
 <div className="flex items-center ml-2 sm:ml-4 gap-2 sm:gap-4 shrink-0">
 <button onClick={toggleTheme} className="p-1.5 rounded-full bg-foreground text-background hover:bg-foreground text-background transition-colors text-background/80">
 <span className="material-icons text-sm">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
 </button>
 <button 
 onClick={() => setActivePage('Cart')} 
 className={`text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-colors ${activePage === 'Cart' ? 'text-[#ff6a00]' : 'text-background/80 hover:text-background'}`}
 >
 <span className="material-icons text-sm">shopping_cart</span> <span className="hidden xs:inline">Cart</span>
 </button>
 <div className="hidden sm:block w-px h-4 bg-foreground text-background"></div>
 <button onClick={() => setActivePage('Login')} className="text-[10px] sm:text-xs font-bold text-background/80 hover:text-background flex items-center gap-1">
 <span className="material-icons text-sm">login</span> <span className="hidden sm:inline">Sign In</span>
 </button>
 </div>
 </div>
 </div>
 </nav>
 );
};

export const SupermarketApp: React.FC<{ activePage: SupermarketPage, setActivePage: (p: SupermarketPage) => void, isSmartPasteOpen: boolean, setIsSmartPasteOpen: (o: boolean) => void }> = ({ activePage, setActivePage, isSmartPasteOpen, setIsSmartPasteOpen }) => {
 const renderContent = () => {
 if (activePage === 'Login') return <Login onNavigate={setActivePage} />;
 if (activePage === 'Register') return <Register onNavigate={setActivePage} />;

 return (
 <div className="min-h-screen flex flex-col font-sans relative bg-background transition-colors duration-300">
 <main className="flex-1 relative bg-background transition-colors duration-300">
 <AnimatePresence mode="wait">
 <motion.div
 key={activePage}
 initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
 exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
 transition={{ duration: 0.35, ease: "easeOut" }}
 className="min-h-full"
 >
 {activePage === 'Home' && <Home onNavigate={setActivePage} onOpenSmartPaste={() => setIsSmartPasteOpen(true)} />}
 {activePage === 'Wholesale' && <Wholesale />}
 {activePage === 'Deals' && <Deals onNavigate={setActivePage} />}
 {activePage === 'Dashboard' && <Dashboard onNavigate={setActivePage} />}
 {activePage === 'Cart' && <Cart onNavigate={setActivePage} />}
 {activePage === 'Produce' && <Produce onNavigate={setActivePage} />}
 {activePage === 'Aisles' && <Aisles onNavigate={setActivePage} />}
 {activePage === 'PreviouslyBought' && <PreviouslyBought onNavigate={setActivePage} />}
 {activePage === 'BOGOF' && <BOGOF onNavigate={setActivePage} />}
 {activePage === 'Under5' && <Under5 onNavigate={setActivePage} />}
 {activePage === 'Bundles' && <Bundles onNavigate={setActivePage} />}
 {activePage === 'Bakery' && <Bakery onNavigate={setActivePage} />}
 {activePage === 'Receipts' && <Receipts onNavigate={setActivePage} />}
 {activePage === 'Favorites' && <Favorites onNavigate={setActivePage} />}
 {activePage === 'Loyalty' && <Loyalty onNavigate={setActivePage} />}
 {activePage === 'Settings' && <Settings onNavigate={setActivePage} />}
 {!['Home', 'Wholesale', 'Deals', 'Dashboard', 'Cart', 'Produce', 'Aisles', 'PreviouslyBought', 'BOGOF', 'Under5', 'Bundles', 'Bakery', 'Receipts', 'Favorites', 'Loyalty', 'Settings', 'Login', 'Register'].includes(activePage) && (
 <AisleCategory category={activePage} onNavigate={setActivePage} />
 )}
 </motion.div>
 </AnimatePresence>
 </main>

 <AnimatePresence>
 {isSmartPasteOpen && <SmartPaste onClose={() => setIsSmartPasteOpen(false)} />}
 </AnimatePresence>
 </div>
 );
 }

 return (
 <AuthProvider>
 <CartProvider>
 {renderContent()}
 </CartProvider>
 </AuthProvider>
 );
};
