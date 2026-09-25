
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronRight, ChevronLeft, ArrowRight, Play, Search, User, ShoppingBag, 
  MapPin, Clock, Phone, Mail, Instagram, Facebook, Linkedin, 
  ArrowUpRight, ExternalLink, Moon, Sun, Monitor, Laptop, Smartphone,
  Settings, LogOut, ChevronDown, CheckCircle2, Star, Shield, Zap,
  Sparkles, Bot, MessageSquare, Send, Paperclip, Mic, MicOff, Image as ImageIcon,
  Smile, MoreHorizontal, History, Volume2, VolumeX, ChefHat, Utensils
} from 'lucide-react';
// ...
import Lenis from 'lenis';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, animate } from 'framer-motion';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { BakeryApp, BakeryNav } from './src/BakeryComponents';
import { SupermarketApp, SupermarketNav, SupermarketPage } from './src/supermarket/SupermarketWrapper';
import { DiningApp, DiningNav, DiningView } from './src/dining/DiningWrapper';
import { GamesApp, GamesNav, Page as GamesPage } from './src/games/GamesWrapper';
import { WaterApp, WaterNav, WaterPage } from './src/water/WaterWrapper';
import { LoungeApp, LoungeNav, LoungePage } from './src/lounge/LoungeWrapper';
import About from './src/components/About';
import Footer from './src/components/Footer';
import { AmbientGlow } from './src/components/AmbientGlow';
import Reveal from './src/components/Reveal';
import { ScrollReveal, RevealItem } from './src/components/ScrollReveal';
import { SectionWrapper } from './src/components/SectionWrapper';
import StudioApp from './src/StudioApp';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { useHeroInView } from './src/hooks/useHeroInView';
import { ScrollContext } from './src/ScrollContext';
import lightHeroImg from './src/show_me_how_202604151443.png';
import darkHeroImg from './src/make_it_5_202604151513.jpg';
import { cmsApi } from './src/services/cmsApi';
import { useOrderTimerManager } from './src/hooks/useOrderTimerManager';
import { QuickOrderModal } from './src/components/QuickOrderModal';
import { ConsumerUserSwitcher } from './src/components/ConsumerUserSwitcher';
import { getActiveConsumerUser, getActiveAdminUser } from './src/services/userService';
import { orderService, playAlertSound } from './src/services/orderService';

// --- Utility: Magnetic Tilt Hook ---
function useMagneticTilt() {
 const x = useMotionValue(0.5);
 const y = useMotionValue(0.5);
 
 // Physics-based spring for realistic weight/lag
 const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.5 });
 const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.5 });

 const rotateX = useTransform(springY, [0, 1], [12, -12]);
 const rotateY = useTransform(springX, [0, 1], [-12, 12]);
 
 const spotlightX = useTransform(springX, [0, 1], ["0%", "100%"]);
 const spotlightY = useTransform(springY, [0, 1], ["0%", "100%"]);

 function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
 const rect = event.currentTarget.getBoundingClientRect();
 const px = (event.clientX - rect.left) / rect.width;
 const py = (event.clientY - rect.top) / rect.height;
 x.set(px);
 y.set(py);
 }

 function onMouseLeave() {
 x.set(0.5);
 y.set(0.5);
 }

 return { onMouseMove, onMouseLeave, rotateX, rotateY, spotlightX, spotlightY };
}

// --- Navigation Function Declaration for AI ---
const navigateToSectionTool: FunctionDeclaration = {
 name: 'navigateToSection',
 parameters: {
 type: Type.OBJECT,
 description: 'Scroll the visitor to a specific section of the website based on their request.',
 properties: {
 sectionId: {
 type: Type.STRING,
 description: 'The ID of the section to navigate to. Options: hero, services, bakery, market, lounge, standard, voices, location.',
 },
 },
 required: ['sectionId'],
 },
};

// --- Components ---


const ScrollItem: React.FC<{ children: React.ReactNode; className?: string; index?: number }> = ({ children, className = "", index = 0 }) => {
 return (
 <motion.div
 initial={{ opacity: 0, y: 50 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ margin: "-20% 0% -20% 0%", once: false }}
 transition={{ duration: 0.6, delay: index * 0.0735, ease: [0.22, 1, 0.36, 1] }}
 className={className}
 >
 {children}
 </motion.div>
 );
};

// Text Reveal Component for High-End Typography
export const TextReveal: React.FC<{ text: string; className?: string; delay?: number; stagger?: number }> = ({ text, className = "", delay = 0, stagger = 0.0245 }) => {
 const words = text.split(" ");
 return (
 <span className={`inline-flex flex-wrap gap-x-[0.2em] ${className}`}>
 {words.map((word, i) => (
 <span key={i} className="inline-block overflow-hidden pb-[0.1em]">
 <motion.span
 initial={{ y: "100%" }}
 whileInView={{ y: 0 }}
 viewport={{ once: true, margin: "-10%" }}
 transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
 className="inline-block"
 >
 {word}
 </motion.span>
 </span>
 ))}
 </span>
 );
};

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
 const { theme } = useTheme();
 return (
 <motion.div
 initial={{ y: 0 }}
 exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.83, 0, 0.17, 1] } }}
 className={`fixed inset-0 z-[100] ${theme === 'dark' ? 'bg-background' : 'bg-card'} flex items-center justify-center`}
 >
 <div className="flex items-center justify-center">
 <motion.div
 initial={{ y: 50, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
 onAnimationComplete={() => setTimeout(onComplete, 800)}
 className="flex flex-col items-center gap-8"
 >
 <motion.div
 animate={{ scale: [1, 1.05, 1], rotate: 360 }}
 transition={{ 
 scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
 rotate: { duration: 4, repeat: Infinity, ease: "linear" }
 }}
 className={`w-20 h-20 bg-primary flex items-center justify-center rounded-xl relative ${
 theme === 'dark'
 ? 'shadow-[0_0_30px_11px_rgba(242,158,13,0.2),0_0_60px_30px_rgba(242,158,13,0.1)]'
 : 'shadow-[0_0_60px_23px_rgba(242,158,13,0.4),0_0_120px_60px_rgba(242,158,13,0.2)]'
 }`}
 >
 <div className="absolute inset-0 rounded-xl backdrop-blur-sm bg-card/10" />
 <div className="w-10 h-10 border-[6px] border-transparent rounded-full relative z-10" />
 </motion.div>
 <div className="flex flex-col items-center justify-center text-center">
  <span className="font-heading font-black text-5xl tracking-tighter leading-none uppercase text-primary">Orient</span>
  </div>
 </motion.div>
 </div>
 </motion.div>
 );
};

const ParallaxImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = "" }) => {
 const ref = useRef(null);
 const { scrollContainerRef } = React.useContext(ScrollContext);
 const { scrollYProgress } = useScroll({
 target: ref,
 container: scrollContainerRef || undefined,
 offset: ["start end", "end start"]
 });
 
 const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

 return (
 <div ref={ref} className={`relative overflow-hidden ${className}`}>
 <motion.div style={{ y }} className="absolute inset-0 w-full h-[210%] -top-[55%]">
 <img
 src={src}
 alt={alt}
 className="w-full h-full object-cover"
 />
 </motion.div>
 </div>
 );
};

export function getNavBackgroundStyle(
  isHomepage: boolean,
  scrolled: boolean,
  isMobile: boolean,
  activeTab: string | null,
): string {
  if (isMobile) {
    if (scrolled) {
      const bg = isHomepage ? 'bg-white dark:bg-[#1a1a1a]' : 'bg-white dark:bg-black';
      return `${bg} border-b border-white/10 shadow-md`;
    }
    return 'bg-transparent border-transparent';
  }

  if (scrolled) {
    const bg = isHomepage ? 'bg-white dark:bg-[#1a1a1a]' : 'bg-white dark:bg-black';
    return `${bg} border-b border-transparent shadow-sm`;
  }

  // Hero in view — always transparent on homepage
  if (isHomepage) {
    return activeTab
      ? 'bg-transparent backdrop-blur-[20px] border-b border-white/10'
      : 'bg-transparent border-transparent';
  }

  // Subpages at top
  return 'bg-transparent backdrop-blur-[20px] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]';
}

export function getMegaMenuBackgroundStyle(
  isHomepage: boolean,
  scrolled: boolean,
  pageType?: 'hero' | 'market' | 'games' | 'other',
): string {
  if (pageType === 'games') {
    return 'backdrop-blur-[40px] bg-black/40';
  }

  if (scrolled) {
    // Scrolled state: homepage gets #1a1a1a in dark mode (matching page background), other pages stay black
    const scrolledBg = isHomepage ? 'bg-white dark:bg-[#1a1a1a]' : 'bg-white dark:bg-black';
    return `${scrolledBg} shadow-2xl`;
  }

  // Hero in view / scroll zero: 100% transparent + dense blur
  return 'bg-transparent backdrop-blur-[20px] shadow-2xl';
}

// Global session-level flag: the entrance animation for the main navbar must ONLY play once on initial page load
let hasNavEntranceEverPlayed = false;

const Navbar: React.FC<{ 
 setCurrentView: (v: any) => void, 
 scrolled: boolean, 
 navHidden: boolean,
 isSubpage?: boolean,
 isReady?: boolean,
 skipAnimation?: boolean,
 setCurrentSectionIndex?: (i: number) => void,
 currentSectionIndex?: number,
 pageType?: 'hero' | 'market' | 'games' | 'other',
 heroId?: string,
 setDiningView?: (v: DiningView) => void
}> = ({ setCurrentView, scrolled, navHidden, isSubpage = false, isReady = true, skipAnimation = false, setCurrentSectionIndex, currentSectionIndex = 0, pageType = 'other', heroId = 'hero', setDiningView }) => {
 const { theme, toggleTheme } = useTheme();
 const [activeTab, setActiveTab] = useState<string | null>(null);
 const [isMobile, setIsMobile] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [modalOpen, setModalOpen] = useState(false);
 const timeoutRef = useRef<NodeJS.Timeout | null>(null);

 const [hasEntrancePlayed, setHasEntrancePlayed] = useState(
   hasNavEntranceEverPlayed || skipAnimation
 );

 useEffect(() => {
   if (hasNavEntranceEverPlayed || skipAnimation) {
     setHasEntrancePlayed(true);
     hasNavEntranceEverPlayed = true;
     return;
   }

   if (isReady) {
     const timer = setTimeout(() => {
       hasNavEntranceEverPlayed = true;
       setHasEntrancePlayed(true);
     }, 2500);
     return () => clearTimeout(timer);
   }
 }, [isReady, skipAnimation]);

 // Screen resize handler: lock entrance animation so resizing the window never replays it
 useEffect(() => {
   const handleResizeLock = () => {
     hasNavEntranceEverPlayed = true;
     setHasEntrancePlayed(true);
   };
   window.addEventListener('resize', handleResizeLock);
   return () => window.removeEventListener('resize', handleResizeLock);
 }, []);

 const shouldSkipAnimation = hasEntrancePlayed || skipAnimation || hasNavEntranceEverPlayed;

 useEffect(() => {
   const handleDetailModal = (e: any) => {
     setModalOpen(Boolean(e.detail?.open));
   };
   window.addEventListener('orient:detail-modal', handleDetailModal);
   return () => window.removeEventListener('orient:detail-modal', handleDetailModal);
 }, []);
 
 // Use the hook to detect if hero is in view
 const isHeroInView = useHeroInView(heroId);

 const isHomepage = !isSubpage;
 const isOnHero = isHeroInView || (isHomepage && currentSectionIndex === 0);
 
 // isTransparent determines if the text should be white (for hero sections)
 const isTransparent = isHomepage ? isOnHero : (pageType === 'hero' ? !scrolled : !scrolled);

 const blendClass = '';
 const textClass = 'text-foreground';

 const handleMouseEnter = (tab: string) => {
 if (timeoutRef.current) clearTimeout(timeoutRef.current);
 setActiveTab(tab);
 };

 const handleMouseLeave = () => {
 timeoutRef.current = setTimeout(() => {
 setActiveTab(null);
 }, 300);
 };

 const handleNavigation = (view: string, sectionId: string) => {
 if (view === 'dining') {
 setCurrentView('dining');
 if (setDiningView) {
 if (sectionId === 'dining-reservations') {
 setDiningView('reservations');
 } else if (sectionId === 'dining-floor-plan') {
 setDiningView('reservations');
 setTimeout(() => {
 const element = document.getElementById('floor-plan');
 if (element) element.scrollIntoView({ behavior: 'smooth' });
 }, 300);
 } else if (sectionId === 'dining-delivery') {
 setDiningView('delivery');
 } else if (sectionId === 'dining-about') {
 setDiningView('about');
 } else if (sectionId === 'dining-dashboard') {
 setCurrentView('dashboard');
 } else if (sectionId === 'dining-drinks') {
 setDiningView('menu');
 setTimeout(() => {
 const element = document.getElementById('drinks');
 if (element) element.scrollIntoView({ behavior: 'smooth' });
 }, 300);
 } else if (sectionId === 'dining-grills') {
 setDiningView('menu');
 setTimeout(() => {
 const element = document.getElementById('cat-proteins-&-grills');
 if (element) element.scrollIntoView({ behavior: 'smooth' });
 }, 300);
 } else if (sectionId === 'dining-swallows') {
 setDiningView('menu');
 setTimeout(() => {
 const element = document.getElementById('cat-soups-&-natural-swallows');
 if (element) element.scrollIntoView({ behavior: 'smooth' });
 }, 300);
 } else if (sectionId === 'dining-menu') {
 setDiningView('menu');
 setTimeout(() => {
 const element = document.getElementById('menu-catalog');
 if (element) element.scrollIntoView({ behavior: 'smooth' });
 }, 300);
 } else {
 setDiningView('menu');
 }
 }
 window.dispatchEvent(new CustomEvent('orient:navigate-dining', { detail: { sectionId } }));
 return;
 }

 if (view === 'home' && setCurrentSectionIndex) {
 const sectionMap: Record<string, number> = {
 'hero': 0, 'services': 1, 'trust': 2, 'water-deep': 3, 'market-deep': 4,
 'bakery-deep': 5, 'dining-deep': 6, 'lounge-deep': 7, 'games-deep': 8,
 'voices': 9, 'location': 10, 'cta': 11, 'footer': 12
 };
 if (sectionMap[sectionId] !== undefined) {
 setCurrentSectionIndex(sectionMap[sectionId]);
 }
 }
 
 setCurrentView(view as any);
 setTimeout(() => {
 const element = document.getElementById(sectionId);
 if (element) {
 element.scrollIntoView({ behavior: 'smooth' });
 }
 }, 100);
 };

 useEffect(() => {
 const checkMobile = () => window.innerWidth < 1024;
 const handleResize = () => setIsMobile(checkMobile());
 handleResize();
 window.addEventListener('resize', handleResize);
 return () => window.removeEventListener('resize', handleResize);
 }, []);

 const navLinks = [
 { name: 'Bakery', view: 'bakery', icon: 'bakery_dining', 
 menu: {
 navigation: [
 { name: 'Menu', id: 'bakery-deep' },
 { name: 'Wholesale', id: 'bakery-deep' },
 { name: 'Custom Orders', id: 'bakery-deep' }
 ],
 highlights: [
 { title: 'Artisanal Heritage', detail: 'Traditional European techniques' },
 { title: '48-Hour Science', detail: 'Cold fermentation for complex flavor' },
 { title: 'Sourdough Starters', detail: 'Natural, house-grown cultures' }
 ]
 }
 },
 { name: 'Market', view: 'supermarket', icon: 'storefront',
 menu: {
 navigation: [
 { name: 'Aisles', id: 'market-deep' },
 { name: 'Fresh Produce', id: 'market-deep' },
 { name: 'Global Spices', id: 'market-deep' },
 { name: 'Organic Dairy', id: 'market-deep' }
 ],
 highlights: [
 { title: 'Smart Logistics', detail: 'Real-time inventory tracking' },
 { title: 'Global Sourcing', detail: 'Direct from sustainable farms' },
 { title: 'Daily Deals', detail: 'Exclusive member-only offers' }
 ]
 }
 },
 { name: 'Restaurant', view: 'dining', icon: 'restaurant',
 menu: {
 navigation: [
 { name: 'Menu', id: 'dining-menu' },
 { name: 'Reservations', id: 'dining-reservations' },
 { name: 'Delivery', id: 'dining-delivery' },
 { name: 'Behind the Scenes', id: 'dining-about' }
 ],
 highlights: [
 { title: 'Interactive Floor Plan', detail: 'Balcony, private suite & sunset terrace table booking', id: 'dining-floor-plan' },
 { title: 'Swallows', detail: 'Slow-simmered Egusi, Ofe Owerri & fluffy pounded yam', id: 'dining-swallows' },
 { title: 'Smoky Jollof & Grills', detail: 'Woodfire-infused rice, suya beef ribs & grilled catfish', id: 'dining-grills' }
 ]
 }
 },
 { name: 'Games', view: 'games', icon: 'sports_esports',
 menu: {
 navigation: [
 { name: 'FIFA Arena', id: 'games-deep' },
 { name: 'CODM Zone', id: 'games-deep' },
 { name: 'VR Pods', id: 'games-deep' }
 ],
 highlights: [
 { title: 'Pro Tournaments', detail: 'Weekly competitive events' },
 { title: 'Next-Gen Hardware', detail: 'Latest consoles and PCs' },
 { title: 'Global Leaderboards', detail: 'Track your ranking live' }
 ]
 }
 },
 { name: 'Water', view: 'water', icon: 'water_drop',
 menu: {
 navigation: [
 { name: '7-Step Process', id: 'water-deep' },
 { name: 'Lab Reports', id: 'water-deep' },
 { name: 'Home Delivery', id: 'water-deep' }
 ],
 highlights: [
 { title: 'Purity Standard', detail: 'Exceeding global benchmarks' },
 { title: 'Eco-Packaging', detail: 'Sustainable bottling solutions' },
 { title: 'Bulk Supply', detail: 'Corporate and event logistics' }
 ]
 }
 },
 { name: 'Lounge', view: 'lounge', icon: 'nightlife',
 menu: {
 navigation: [
 { name: 'The Lab', id: 'lounge-deep' },
 { name: 'Visualizer', id: 'lounge-deep' },
 { name: 'Concierge', id: 'lounge-deep' }
 ],
 highlights: [
 { title: 'VIP Membership', detail: 'Exclusive lounge access' },
 { title: 'Event Booking', detail: 'Private corporate gatherings' },
 { title: 'Curated Sound', detail: 'Bespoke audio experiences' }
 ]
 }
 },
 { name: 'About', view: 'about', icon: 'info',
 menu: {
 navigation: [
 { name: 'Our Story', id: 'hero' },
 { name: 'Mission', id: 'hero' },
 { name: 'Contact', id: 'footer' }
 ],
 highlights: [
 { title: 'Corporate HQ', detail: 'Amada Plaza, Rayfield' },
 { title: 'Careers', detail: 'Join the Orient Global team' },
 { title: 'Impact', detail: 'Community development initiatives' }
 ]
 }
 }
 ];

 return (
 <motion.div 
 initial={shouldSkipAnimation ? false : (isMobile ? { y: 80, scale: 0.95, opacity: 0 } : { y: -80, opacity: 0 })}
  animate={
    shouldSkipAnimation
      ? { 
          y: (modalOpen || (navHidden && !isHomepage)) ? (isMobile ? 128 : -128) : 0,
          scale: ((modalOpen || (navHidden && !isHomepage)) && isMobile) ? 0.95 : 1,
          opacity: (modalOpen || (navHidden && !isHomepage)) ? 0 : 1
        }
      : { 
          y: isReady ? ((modalOpen || (navHidden && !isHomepage)) ? (isMobile ? 128 : -128) : 0) : (isMobile ? 80 : -80),
          scale: ((modalOpen || (navHidden && !isHomepage)) && isMobile) ? 0.95 : 1,
          opacity: isReady ? ((modalOpen || (navHidden && !isHomepage)) ? 0 : 1) : 0
        }
  }
  transition={
    shouldSkipAnimation
      ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      : { duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
  }
 className={`fixed z-[1000] ${modalOpen ? 'pointer-events-none invisible opacity-0' : ''} ${isMobile ? 'bottom-3 left-0 right-0 mx-auto w-[90%]' : 'top-0 left-0 w-full'}`}
 >
 {/* Main Nav Container */}
 <nav className={`relative transition-all duration-300 flex items-center isolation-auto ${getNavBackgroundStyle(isHomepage, scrolled, isMobile, activeTab)} ${isMobile 
 ? `rounded-full h-12 px-4` 
 : `h-14 lg:h-16 px-6 sm:px-12 transition-all duration-300`
 }`}
 >
 <div className={`${isMobile ? 'w-full flex items-center justify-between' : 'mx-auto w-full flex items-center justify-between'}`}>
 {/* Logo Section */}
   <motion.div 
  initial={shouldSkipAnimation ? false : { clipPath: 'polygon(0% -50%, 100% -150%, 100% -150%, 0% -50%)' }}
  animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
  transition={shouldSkipAnimation ? { duration: 0 } : { duration: 1.5, delay: isReady ? 2.9 : 0, ease: [0.76, 0, 0.24, 1] }}
  className={`flex items-center gap-2 sm:gap-3 cursor-pointer ${isMobile ? 'pl-2 pr-3 border-r border-transparent' : ''}`} onClick={() => { setCurrentView('home'); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
  <span className="font-heading font-black text-xl sm:text-3xl tracking-tighter leading-none uppercase text-primary">Orient</span>
  </motion.div>

 {/* Links Section */}
 {!isMobile && (
 <div 
 className="flex-1 flex items-center relative h-full justify-center space-x-1 sm:space-x-2"
 onMouseLeave={() => handleMouseLeave()}
 >
 {navLinks.map((link, i) => (
 <motion.button 
 initial={shouldSkipAnimation ? false : { clipPath: 'polygon(0% -50%, 100% -150%, 100% -150%, 0% -50%)' }}
 animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
 transition={shouldSkipAnimation ? { duration: 0 } : { duration: 1.5, delay: isReady ? 2.9 + ((i + 1) * 0.1) : 0, ease: [0.76, 0, 0.24, 1] }}
 key={link.name}
 onMouseEnter={() => handleMouseEnter(link.name)}
 onClick={() => {
 setCurrentView(link.view as any);
 if (link.view === 'dining' && setDiningView) {
 setDiningView('menu');
 }
 document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
 }}
 className={`relative z-10 px-2 sm:px-3 h-full flex items-center justify-center transition-all duration-300 text-[clamp(0.75rem,1.1vw,0.9rem)] font-bold uppercase tracking-widest hover:text-primary dark:hover:text-primary ${textClass}`}
 >
 <div className="flex flex-col items-center group">
 <motion.span whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="relative py-1 block">
 {link.name}
 </motion.span>
 </div>
 </motion.button>
 ))}
 </div>
 )}

 {/* Actions Section */}
 <motion.div 
 initial={shouldSkipAnimation ? false : { clipPath: 'polygon(0% -50%, 100% -150%, 100% -150%, 0% -50%)' }}
 animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
 transition={shouldSkipAnimation ? { duration: 0 } : { duration: 1.5, delay: isReady ? 2.9 + ((navLinks.length + 1) * 0.1) : 0, ease: [0.76, 0, 0.24, 1] }}
 className={`flex items-center gap-1 sm:gap-3 ${isMobile ? 'pl-4 border-l border-transparent' : ''}`}
 >
   <button onClick={toggleTheme} className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 text-foreground hover:text-primary`}>
 <span className="material-icons text-sm sm:text-base">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
 </button>
    <button onClick={() => setCurrentView('login')} className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 text-foreground hover:text-primary`} title="User Dashboard">
   <span className="material-icons text-sm sm:text-base">person</span>
   </button>
   <button onClick={() => setCurrentView('admin')} className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 text-foreground hover:text-primary`} title="Admin Dashboard">
   <span className="material-icons text-sm sm:text-base">admin_panel_settings</span>
   </button>
 {isMobile && (
 <button 
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 className="p-1.5 sm:p-2 rounded-full bg-transparent text-foreground hover:text-primary transition-all duration-300 ml-1"
 >
 <span className="material-icons text-sm sm:text-base">{mobileMenuOpen ? 'close' : 'menu'}</span>
 </button>
 )}
 </motion.div>
 </div>
 </nav>

 {/* Mega Menu & Mobile Menu */}
 <AnimatePresence>
 {(!isMobile && activeTab) && (
 <motion.div 
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
 onMouseEnter={() => handleMouseEnter(activeTab)}
 onMouseLeave={() => handleMouseLeave()}
 className={`absolute w-full border border-transparent shadow-[0_32px_64px_rgba(0,0,0,0.4)] z-[-1] overflow-hidden top-full left-0 rounded-none border-t-0 p-12 ${getMegaMenuBackgroundStyle(isHomepage, scrolled, pageType)}`}
 >
 <div className="lg:max-w-[67vw] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
 {(() => {
 const activeLink = navLinks.find(l => l.name === activeTab);
 if (!activeLink) return null;
 
 return (
 <>
 {/* Pane 1: Strategic Routing */}
 <div className="space-y-8">
 <motion.h4 
 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
 className={`font-black text-xs uppercase tracking-[0.4em] border-b border-primary/20 pb-3 text-primary`}
 >
 {activeLink.name === 'Restaurant' ? 'Restaurant Experiences' : 'Strategic Navigation'}
 </motion.h4>
 <ul className="space-y-5">
 {activeLink.menu.navigation.map((item, i) => (
 <motion.li 
 key={i}
 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
 >
 <button 
 onClick={() => handleNavigation(activeLink.view, item.id)} 
 className={`text-xl sm:text-2xl font-black transition-all hover:translate-x-3 block group uppercase tracking-tight text-foreground hover:text-primary text-left`}
 >
 {item.name}
 </button>
 </motion.li>
 ))}
 </ul>
 </div>
 
 {/* Pane 2: Division Highlights */}
 <div className="space-y-8 lg:border-l lg:border-transparent lg:pl-16">
 <motion.h4 
 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
 className={`font-black text-xs uppercase tracking-[0.4em] border-b border-primary/20 pb-3 text-primary`}
 >
 {activeLink.name === 'Restaurant' ? 'Highlights' : 'Division Insights'}
 </motion.h4>
 <div className="space-y-8">
 {activeLink.menu.highlights.map((highlight: any, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
 onClick={highlight.id ? () => handleNavigation(activeLink.view, highlight.id) : undefined}
 className={`group ${highlight.id ? 'cursor-pointer hover:translate-x-1.5 transition-transform' : 'cursor-default'}`}
 >
 <h5 
 className={`text-sm font-black uppercase tracking-widest mb-1 transition-colors text-foreground group-hover:text-primary flex items-center gap-2`}
 >
 {highlight.title}
 {highlight.id && (
 <span className="material-icons text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">arrow_forward</span>
 )}
 </h5>
 <p 
 className={`text-xs font-medium leading-relaxed text-muted-foreground`}
 >
 {highlight.detail}
 </p>
 </motion.div>
 ))}
 </div>
 </div>
 </>
 );
 })()}
 </div>

 {/* Large Background Text */}
 <div className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden h-full flex items-end justify-end p-8 lg:p-12">
 <motion.h3 
 initial={{ x: 100, opacity: 0 }}
 animate={{ x: 0, opacity: 0.15 }}
 transition={{ duration: 0.6, ease: "easeOut" }}
 className="text-[12rem] lg:text-[20rem] font-black uppercase tracking-tighter italic leading-none text-muted-foreground "
 >
 {activeTab}
 </motion.h3>
 </div>
 </motion.div>
 )}

 {(isMobile && mobileMenuOpen) && (
 <motion.div 
 initial={{ opacity: 0, y: 20, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 20, scale: 0.95 }}
 transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
 className="fixed inset-0 w-full h-[100dvh] bg-card/85 backdrop-blur-[45px] z-[2000] p-6 flex flex-col overflow-y-auto"
 >
 <div className="flex items-center justify-between mb-8">
  <div className="flex items-center gap-3" onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
  <span className="font-heading font-black text-2xl tracking-tighter text-primary leading-none uppercase">Orient</span>
  </div>
 <button onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-full bg-transparent text-foreground hover:text-primary transition-colors duration-300">
 <span className="material-icons">close</span>
 </button>
 </div>

 {navLinks.map((link, linkIdx) => (
 <motion.div 
 key={link.name} 
 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: linkIdx * 0.05 }}
 className="flex flex-col"
 >
 <div className="flex items-center justify-between py-4 border-b border-transparent">
 <button 
 onClick={() => {
 setMobileMenuOpen(false);
 setCurrentView(link.view as any);
 if (link.view === 'dining' && setDiningView) {
 setDiningView('menu');
 }
 document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
 }}
 className="flex items-center gap-4 text-lg font-black uppercase tracking-widest text-foreground"
 >
 <span className="material-icons text-primary">{link.icon}</span>
 {link.name}
 </button>
 <button 
 onClick={() => setActiveTab(activeTab === link.name ? null : link.name)}
 className="p-2 text-muted-foreground"
 >
 <span className="material-icons text-sm">{activeTab === link.name ? 'expand_less' : 'expand_more'}</span>
 </button>
 </div>
 <AnimatePresence>
 {activeTab === link.name && (
 <motion.div 
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="py-4 space-y-6">
 <div className="space-y-4">
 <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.2em] border-b border-primary/10 pb-2">
 {link.name === 'Restaurant' ? 'Restaurant Experiences' : 'Navigation'}
 </h4>
 {link.menu.navigation.map((item, i) => (
 <button 
 key={i}
 onClick={() => {
 setMobileMenuOpen(false);
 setActiveTab(null);
 handleNavigation(link.view, item.id);
 }}
 className="block w-full text-left text-sm font-bold text-foreground/80 uppercase tracking-widest hover:text-primary transition-colors"
 >
 {item.name}
 </button>
 ))}
 </div>
 <div className="space-y-4">
 <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.2em] border-b border-primary/10 pb-2">
 {link.name === 'Restaurant' ? 'Highlights' : 'Insights'}
 </h4>
 {link.menu.highlights.map((highlight: any, i) => (
 <div 
 key={i} 
 onClick={highlight.id ? () => {
 setMobileMenuOpen(false);
 setActiveTab(null);
 handleNavigation(link.view, highlight.id);
 } : undefined}
 className={`space-y-1 ${highlight.id ? 'cursor-pointer active:opacity-70' : ''}`}
 >
 <h5 className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-1">
 {highlight.title}
 {highlight.id && <span className="material-icons text-[10px] text-primary">arrow_forward</span>}
 </h5>
 <p className="text-[9px] text-muted-foreground font-medium">{highlight.detail}</p>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 ))}
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 );
};

export const Hero: React.FC<{
  isReady: boolean;
  isActive?: boolean;
  skipAnimation?: boolean;
  cms?: any;
}> = ({ isReady, isActive = false, skipAnimation = false, cms }) => {
  const headline = cms?.headline || 'ELEVATE';
  const accentText = cms?.accentText || 'EVERYDAY.';
  const defaultDescription =
    'Experience a convergence of global excellence and Plateau soul across six premium lifestyle divisions.';
  const description =
    cms?.description && cms.description !== 'A convergence of bakery, gaming, and elite lifestyle services.'
      ? cms.description
      : defaultDescription;

  const { theme } = useTheme();
  const ref = useRef(null);
  const { scrollContainerRef } = React.useContext(ScrollContext);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef || undefined,
    offset: ['start start', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 1.15]);

  return (
    <div ref={ref} className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-background">

      {/* ── Parallax background ── */}
      <motion.div style={{ y: yBg, scale }} className="absolute inset-0 z-0 bg-background">
        <motion.img
          key="light-hero-img"
          initial={{ opacity: 0 }}
          animate={{ opacity: theme === 'light' ? 1 : 0 }}
          transition={{ opacity: { duration: 0.8 } }}
          src={lightHeroImg}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${theme === 'light' ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none'
            }`}
          alt="Orient Global Flagship"
          loading="eager"
        />
        <motion.img
          key="dark-hero-img"
          initial={{ opacity: 0 }}
          animate={{ opacity: theme === 'dark' ? 1 : 0 }}
          transition={{ opacity: { duration: 0.8 } }}
          src={darkHeroImg}
          onError={(e) => {
            const t = e.currentTarget as HTMLImageElement;
            t.src = lightHeroImg;
            t.classList.add('brightness-50', 'contrast-125');
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${theme === 'dark' ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none'
            }`}
          alt="Orient Global Flagship Night"
          loading="eager"
        />
        {theme === 'light' && <div className="absolute inset-0 bg-white/20 z-[2] pointer-events-none" />}
        {theme === 'dark' && <div className="absolute inset-0 bg-black/40 z-[2] pointer-events-none" />}
      </motion.div>

      {/* ── Content ── */}
      <div className="content-container relative z-20 max-w-5xl flex flex-col items-center justify-center h-full pt-[50px]">
        <div className="flex flex-col items-center justify-center gap-8 w-full">

          {/* Welcome text — "Global" always accented */}
          <motion.div
            initial={skipAnimation ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={isReady ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 2.4, delay: skipAnimation ? 0 : 3.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden inline-block py-1 px-2"
          >
            <span className="font-black tracking-[0.4em] uppercase text-sm block drop-shadow-[0_0_12px_rgba(0,0,0,0.5)] text-slate-900 dark:text-white">
              {cms?.welcomeText && cms.welcomeText !== 'Welcome to' ? (
                cms.welcomeText.includes('Global') ? (
                  <>{cms.welcomeText.replace(/Global/i, '').trimEnd()}{' '}<span className="text-orange-400 dark:text-primary">Global</span></>
                ) : (
                  <>{cms.welcomeText}{' '}<span className="text-orange-400 dark:text-primary">Global</span></>
                )
              ) : (
                <>Welcome to Orient <span className="text-orange-400 dark:text-primary">Global</span></>
              )}
            </span>
          </motion.div>

          {/* Headline stack */}
          <div className="flex flex-col items-center gap-2">
            {/* Primary word — solid colour */}
            <motion.div
              initial={skipAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
              transition={{ duration: 2.0, delay: skipAnimation ? 0 : 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-black text-5xl sm:text-6xl md:text-8xl lg:text-[8.5rem] tracking-tighter leading-[0.8] uppercase text-slate-900 dark:text-white"
            >
              {headline}
            </motion.div>

            {/* Accent word — gradient fill, fades at both edges */}
            <motion.div
              initial={skipAnimation ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 100 }}
              animate={isReady ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 100 }}
              transition={{ duration: 2.0, delay: skipAnimation ? 0 : 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              <span
                className="font-heading font-black text-5xl sm:text-6xl md:text-8xl lg:text-[8.5rem] tracking-tighter leading-[0.8] uppercase text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(242,158,13,0.45) 0%, rgba(242,158,13,1) 20%, rgba(242,158,13,1) 80%, rgba(242,158,13,0.45) 100%)',
                }}
              >
                {accentText}
              </span>
            </motion.div>
          </div>

          {/* Description */}
          <div className="relative w-full flex justify-center">
            {/* Radial light bloom behind text — light mode only */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.7)_0%,_rgba(255,255,255,0)_70%)] dark:hidden pointer-events-none -z-10 blur-xl scale-150" />
            <motion.div
              initial={skipAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 2.0, delay: skipAnimation ? 0 : 2.6, ease: [0.16, 1, 0.3, 1] }}
              // Light: frosted glass card  |  Dark: bare text, no container
              className="relative z-10 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg dark:bg-transparent dark:backdrop-blur-none dark:border-transparent dark:shadow-none"
            >
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-wide leading-relaxed text-center max-w-4xl mx-auto text-slate-950 dark:text-white/90 drop-shadow-xl dark:drop-shadow-lg">
                {description}
              </p>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-24 z-20"
      >
        <div className="w-[1px] h-32 bg-gradient-to-b from-primary via-primary/50 to-transparent mx-auto" />
      </motion.div>
    </div>
  );
};

const FinalCTA: React.FC<{ isActive?: boolean; setCurrentView?: (v: any) => void }> = ({ isActive = false, setCurrentView }) => {
 const quickLinks = [
 { name: 'Bakery', id: 'bakery-deep' },
 { name: 'Supermarket', id: 'market-deep' },
 { name: 'The Lounge', id: 'lounge-deep' },
 { name: 'Restaurant', id: 'dining-deep' },
 { name: 'Water', id: 'water-deep' },
 { name: 'Games', id: 'games-deep' }
 ];

 const handleLinkClick = (id: string) => {
 const element = document.getElementById(id);
 if (element) {
 element.scrollIntoView({ behavior: 'smooth' });
 }
 };

 return (
 <section className="relative flex flex-col justify-center bg-transparent border-t border-transparent items-center h-full w-full">
 <div className="w-[90dvw] lg:max-w-[67vw] mx-auto flex flex-col justify-center">
 <ScrollReveal isActive={isActive} className="content-container relative z-10 text-center w-full flex flex-col justify-center h-full">
 <RevealItem index={0} totalItems={5}>
 <div className="flex flex-col items-center mb-4 md:mb-8 lg:mb-4 group">
 <span className="text-primary font-black uppercase tracking-[0.6em] text-[12px] relative">
 The New Standard of Excellence
 </span>
 </div>
 </RevealItem>

 <RevealItem index={1} totalItems={5}>
 <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-2 md:mb-4 lg:mb-2 leading-[0.8] uppercase tracking-tighter">
 <span className="text-primary">ORIENT</span><br />
 Global
 </h2>
 </RevealItem>

 <RevealItem index={2} totalItems={5}>
 <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium mb-4 lg:mb-12">
 Ready to experience the future of Jos? Join us at the flagship destination where every detail is engineered for perfection.
 </p>
 </RevealItem>

 <RevealItem index={3} totalItems={5}>
 <div className="flex flex-wrap justify-center gap-4 mb-16">
 <button 
 onClick={() => handleLinkClick('location')}
 className="px-6 py-3 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-[0_10px_20px_rgba(242,158,13,0.3)] hover:scale-105 hover:shadow-[0_15px_30px_rgba(242,158,13,0.4)] transition-all duration-500"
 >
 Visit Us Today
 </button>
 </div>
 </RevealItem>

 <RevealItem index={4} totalItems={5}>
 <div className="pt-12 border-t border-transparent w-full max-w-3xl mx-auto">
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 {quickLinks.map((link) => (
 <button
 key={link.id}
 onClick={() => handleLinkClick(link.id)}
 className="group flex flex-col items-center gap-2 transition-all duration-300"
 >
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
 {link.name}
 </span>
 <div className="h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-500" />
 </button>
 ))}
 </div>
 </div>
 </RevealItem>
 </ScrollReveal>
 </div>
 </section>
 );
};

const BakeryShowcase: React.FC<{ setCurrentView: (v: any) => void }> = ({ setCurrentView }) => {
 return (
 <section id="bakery" className="flex flex-col justify-center px-4 md:px-12 lg:max-w-[67vw] mx-auto bg-card transition-colors duration-[1500ms] ease-in-out relative items-center h-screen">
 <div className="lg:max-w-[67vw] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-16 items-center">
 <div className="md:w-1/2">
 <Reveal>
 <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">The Bakery</span>
 <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 font-heading leading-[0.85] uppercase tracking-tighter">
 GOLDEN<br/><span className="text-primary">Crust</span>
 </h2>
 <p className=" text-muted-foreground text-base leading-relaxed mb-8 font-medium max-w-lg">Morning excellence starts here. From artisanal sourdoughs to delicate pastries, our bakery combines European techniques with local flavors like Coconut and Plantain.</p>
 <button onClick={() => { setCurrentView('bakery'); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex items-center gap-2 text-foreground border-b-2 border-primary pb-1 hover:text-primary transition-all uppercase text-xs font-black tracking-[0.3em] font-heading">
 <span>View Menu</span>
 <span className="material-icons text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
 </button>
 </Reveal>
 </div>
 <div className="md:w-1/2 grid grid-cols-1 gap-2 md:gap-8">
 <Reveal animation="slide-from-right">
 <ParallaxImage src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1926&auto=format&fit=crop" alt="Golden Crust Croissants" className="rounded-3xl h-[50vh] border border-transparent shadow-elite" />
 </Reveal>
 </div>
 </div>
 </section>
 );
};

const BakeryDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
 return (
 <div id="bakery-deep" className="flex flex-col justify-center px-0 lg:px-6 bg-transparent border-t border-transparent relative items-center h-full w-full">
 <div className="w-[90dvw] lg:max-w-[67vw] mx-auto flex flex-col justify-center -translate-y-[2vh] lg:translate-y-0">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-1 lg:gap-16 items-center justify-center">
 <div className="lg:hidden order-1 text-center w-full shrink-0 mb-1">
 <RevealItem index={0} totalItems={7}>
 <span className="text-primary font-black tracking-[0.5em] uppercase text-[10px] md:text-xs mb-1 block">Artisanal Process</span>
 </RevealItem>
 <RevealItem index={1} totalItems={7}>
 <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter leading-tight">THE SCIENCE OF <br/><span className="text-primary">Fermentation</span></h2>
 </RevealItem>
 </div>
 <RevealItem className="order-2 lg:order-1 w-full shrink-0 mb-1 lg:mb-0" index={2} totalItems={7}>
 <div className="relative aspect-video lg:aspect-square h-[25vh] lg:h-auto w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-transparent shadow-elite">
 <ParallaxImage src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop" alt="Baking Process" className="w-full h-full object-cover" />
 </div>
 </RevealItem>
 <div className="order-3 lg:order-2 flex flex-col w-full overflow-hidden ">
 <div className="hidden lg:block mb-6 lg:mb-2">
 <RevealItem index={0} totalItems={7}>
 <span className="text-primary font-black tracking-[0.5em] uppercase text-sm mb-4 block">Artisanal Process</span>
 </RevealItem>
 <RevealItem index={1} totalItems={7}>
 <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tighter mb-2 leading-tight">THE SCIENCE OF <br/><span className="text-primary">Fermentation</span></h2>
 </RevealItem>
 </div>
 <RevealItem index={3} totalItems={7}>
 <p className="text-xs md:text-sm lg:text-base text-foreground/80 mt-5 lg:mt-1 leading-[19px] mb-1 lg:mb-6 font-normal text-center lg:text-left line-clamp-3 lg:line-clamp-none">Our master bakers utilize a 48-hour cold fermentation process, allowing complex flavors to develop naturally. We source our grains from sustainable farms, ensuring every loaf meets the Orient Global standard of purity.</p>
 </RevealItem>
 <div className="grid grid-cols-2 gap-2 w-full">
 {['Natural Sourdough Starters', 'Stone-Ground Flour', 'No Artificial Additives'].map((item, i) => (
 <RevealItem key={item} index={4 + i} totalItems={7} className={`w-full ${i === 0 ? 'col-span-2' : ''}`}>
 <div className="flex items-center justify-start py-1.5 px-3 lg:py-3 lg:px-4 rounded-xl lg:rounded-2xl bg-card border border-transparent shadow-soft gap-3 w-full h-full">
 <span className="material-icons text-primary text-lg lg:text-xl shrink-0">science</span>
 <span className=" text-foreground font-bold uppercase tracking-widest text-[9px] lg:text-[10px] truncate">{item}</span>
 </div>
 </RevealItem>
 ))}
 </div>
 </div>
 </ScrollReveal>
 </div>
 </div>
 );
};

const MarketShowcase: React.FC<{ setCurrentView: (v: any) => void }> = ({ setCurrentView }) => {
 return (
 <section id="market" className="flex flex-col justify-center px-4 md:px-12 lg:max-w-[67vw] mx-auto bg-card transition-colors duration-[1500ms] ease-in-out relative items-center h-screen">
 <div className="lg:max-w-[67vw] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-16 items-center">
 <div className="md:w-1/2">
 <Reveal>
 <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">The Market</span>
 <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 font-heading leading-[0.85] uppercase tracking-tighter">
 GLOBAL<br/><span className="text-primary">Standards</span>
 </h2>
 <p className=" text-muted-foreground text-base leading-relaxed mb-8 font-medium max-w-lg">We've redefined the shopping experience. Wide aisles, perfect lighting, and a curated selection of international and local products. Quality you can trust, right here in Rayfield, Jos.</p>
 <button onClick={() => { setCurrentView('supermarket'); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex items-center gap-2 text-foreground border-b-2 border-primary pb-1 hover:text-primary transition-all uppercase text-xs font-black tracking-[0.3em] font-heading">
 <span>Shop Online</span>
 <span className="material-icons text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
 </button>
 </Reveal>
 </div>
 <div className="md:w-1/2 grid grid-cols-2 gap-1 md:gap-4">
 <Reveal animation="slide-from-left" className="col-span-2">
 <ParallaxImage src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" alt="Supermarket Wide" className="rounded-3xl h-[35vh] border border-transparent shadow-elite" />
 </Reveal>
 <Reveal animation="slide-from-left" delay="delay-150">
 <ParallaxImage src="https://images.unsplash.com/photo-1543083477-4f7f4b23832c?q=80&w=1970&auto=format&fit=crop" alt="Fresh Produce" className="rounded-3xl h-[20vh] border border-transparent shadow-soft" />
 </Reveal>
 <Reveal animation="slide-from-left" delay="delay-300">
 <ParallaxImage src="https://images.unsplash.com/photo-1506484334402-40ff22e05a6d?q=80&w=2070&auto=format&fit=crop" alt="Market Shelves" className="rounded-3xl h-[20vh] border border-transparent shadow-soft" />
 </Reveal>
 </div>
 </div>
 </section>
 );
};

const MarketDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
 return (
 <div id="market-deep" className="flex flex-col justify-center px-0 lg:px-6 bg-transparent border-t border-transparent relative items-center h-full w-full">
 <div className="w-[90dvw] lg:max-w-[67vw] mx-auto flex flex-col justify-center -translate-y-[2vh] lg:translate-y-0">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-1 lg:gap-16 items-center justify-center">
 <div className="lg:hidden order-1 text-center w-full shrink-0 mb-1">
 <RevealItem index={0} totalItems={5}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] md:text-xs mb-1 block">Supply Chain</span>
 </RevealItem>
 <RevealItem index={1} totalItems={5}>
 <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter leading-tight">INSTITUTIONAL <br/><span className="text-primary">Quality</span></h2>
 </RevealItem>
 </div>
 <RevealItem index={2} totalItems={5} className="order-2 lg:order-2 w-full shrink-0 mb-1 lg:mb-0">
 <div className="relative aspect-video lg:aspect-square h-[25vh] lg:h-auto w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-transparent shadow-elite">
 <ParallaxImage src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974&auto=format&fit=crop" alt="Market Logistics" className="w-full h-full object-cover" />
 </div>
 </RevealItem>
 <div className="order-3 lg:order-1 flex flex-col w-full overflow-hidden ">
 <div className="hidden lg:block mb-6 lg:mb-2">
 <RevealItem index={0} totalItems={5}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">Supply Chain</span>
 </RevealItem>
 <RevealItem index={1} totalItems={5}>
 <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tighter mb-2 leading-tight">INSTITUTIONAL <br/><span className="text-primary">Quality</span></h2>
 </RevealItem>
 </div>
 <RevealItem index={3} totalItems={5}>
 <p className="text-xs md:text-sm lg:text-base text-foreground/80 mt-5 lg:mt-1 leading-[19px] mb-1 lg:mb-6 font-normal text-center lg:text-left line-clamp-3 lg:line-clamp-none">Our global procurement network ensures that the finest products from around the world are available in Jos. From organic dairy to international spices, we maintain a strict cold chain and quality control protocol.</p>
 </RevealItem>
 <RevealItem index={4} totalItems={5} className="w-full">
 <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="w-full p-3 lg:p-4 rounded-xl lg:rounded-3xl bg-card border border-transparent shadow-soft text-left flex flex-col justify-center h-full">
                    <h4 className=" text-foreground font-black uppercase text-[9px] lg:text-xs tracking-widest mb-0.5 lg:mb-1 flex items-center gap-1.5 lg:gap-2">
                      <span className="material-icons text-primary text-base lg:text-lg shrink-0">verified</span>
                      Cold Chain
                    </h4>
                    <p className=" text-muted-foreground text-[9px] lg:text-xs font-medium pl-5 lg:pl-6 truncate">24/7 Temperature Monitoring</p>
                  </div>
                  <div className="w-full p-3 lg:p-4 rounded-xl lg:rounded-3xl bg-card border border-transparent shadow-soft text-left flex flex-col justify-center h-full">
                    <h4 className=" text-foreground font-black uppercase text-[9px] lg:text-xs tracking-widest mb-0.5 lg:mb-1 flex items-center gap-1.5 lg:gap-2">
                      <span className="material-icons text-primary text-base lg:text-lg shrink-0">verified</span>
                      Sourcing
                    </h4>
                    <p className=" text-muted-foreground text-[9px] lg:text-xs font-medium pl-5 lg:pl-6 truncate">Direct from Global Producers</p>
                  </div>
 </div>
 </RevealItem>
 </div>
 </ScrollReveal>
 </div>
 </div>
 );
};

const RestaurantShowcase: React.FC<{ setCurrentView: (v: any) => void }> = ({ setCurrentView }) => {
 return (
 <section id="restaurant" className="flex flex-col justify-center px-4 md:px-12 lg:max-w-[67vw] mx-auto bg-card transition-colors duration-[1500ms] ease-in-out relative items-center h-screen">
 <div className="lg:max-w-[67vw] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-16 items-center">
 <div className="md:w-1/2">
 <Reveal delay="delay-100">
 <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">The Restaurant</span>
 </Reveal>
 <Reveal delay="delay-200">
 <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 font-heading leading-[0.85] uppercase tracking-tighter">
 CULINARY<br/><span className="text-primary">Artistry</span>
 </h2>
 </Reveal>
 <Reveal delay="delay-300">
 <p className=" text-muted-foreground text-base leading-relaxed mb-8 font-medium max-w-lg">A symphony of flavors crafted by world-class chefs. From local delicacies like Pounded Yam & Egusi to international fusion, every dish is a masterpiece of taste and presentation.</p>
 </Reveal>
 <Reveal delay="delay-400">
 <button onClick={() => { setCurrentView('dining'); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex items-center gap-2 text-foreground border-b-2 border-primary pb-1 hover:text-primary transition-all uppercase text-xs font-black tracking-[0.3em] font-heading">
 <span>View Menu</span>
 <span className="material-icons text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
 </button>
 </Reveal>
 </div>
 <div className="md:w-1/2">
 <Reveal animation="slide-from-right">
 <ParallaxImage src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" alt="Fine Dining Experience" className="rounded-3xl h-[50vh] border border-transparent shadow-elite" />
 </Reveal>
 </div>
 </div>
 </section>
 );
};

const DiningDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
 return (
 <div id="dining-deep" className="flex flex-col justify-center px-0 lg:px-6 bg-transparent border-t border-transparent relative items-center h-full w-full">
 <div className="w-[90dvw] lg:max-w-[67vw] mx-auto flex flex-col justify-center -translate-y-[2vh] lg:translate-y-0">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-1 lg:gap-16 items-center justify-center">
 <div className="lg:hidden order-1 text-center w-full shrink-0 mb-1">
 <RevealItem index={0} totalItems={7}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] md:text-xs mb-1 block">Chef's Philosophy</span>
 </RevealItem>
 <RevealItem index={1} totalItems={7}>
 <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter leading-tight">FUSION OF <br/><span className="text-primary">Heritage</span></h2>
 </RevealItem>
 </div>
 <RevealItem className="order-2 lg:order-1 w-full shrink-0 mb-1 lg:mb-0" index={2} totalItems={7}>
 <div className="relative aspect-video lg:aspect-square h-[25vh] lg:h-auto w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-transparent shadow-elite">
 <ParallaxImage src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" alt="Chef at Work" className="w-full h-full object-cover" />
 </div>
 </RevealItem>
 <div className="order-3 lg:order-2 flex flex-col w-full overflow-hidden ">
 <div className="hidden lg:block mb-6 lg:mb-2">
 <RevealItem index={0} totalItems={7}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">Chef's Philosophy</span>
 </RevealItem>
 <RevealItem index={1} totalItems={7}>
 <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tighter mb-2 leading-tight">FUSION OF <br/><span className="text-primary">Heritage</span></h2>
 </RevealItem>
 </div>
 <RevealItem index={3} totalItems={7}>
 <p className="text-xs md:text-sm lg:text-base text-foreground/80 mt-5 lg:mt-1 leading-[19px] mb-1 lg:mb-6 font-normal text-center lg:text-left line-clamp-3 lg:line-clamp-none">Our culinary team explores the intersection of traditional Plateau ingredients and modern gastronomic techniques. We believe in "Root-to-Table" dining, where every ingredient tells a story of the land.</p>
 </RevealItem>
 <div className="grid grid-cols-2 gap-2 w-full">
 {['Locally Sourced Produce', 'Artisanal Plating', 'Curated Wine Pairings'].map((item, i) => (
 <RevealItem key={item} index={4 + i} totalItems={7} className={`w-full ${i === 0 ? 'col-span-2' : ''}`}>
 <div className="flex items-center justify-start py-1.5 px-3 lg:py-3 lg:px-4 rounded-xl lg:rounded-2xl bg-card border border-transparent shadow-soft gap-3 w-full h-full">
 <span className="material-icons text-primary text-lg lg:text-xl shrink-0">restaurant_menu</span>
 <span className=" text-foreground font-bold uppercase tracking-widest text-[9px] lg:text-[10px] truncate">{item}</span>
 </div>
 </RevealItem>
 ))}
 </div>
 </div>
 </ScrollReveal>
 </div>
 </div>
 );
};

const WaterShowcase: React.FC<{ setCurrentView: (v: any) => void }> = ({ setCurrentView }) => {
 return (
 <section id="water" className="flex flex-col justify-center px-4 md:px-12 lg:max-w-[67vw] mx-auto bg-card transition-colors duration-[1500ms] ease-in-out relative items-center h-screen">
 <div className="lg:max-w-[67vw] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-16 items-center">
 <div className="md:w-1/2">
 <Reveal>
 <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Orient Water</span>
 <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6 font-heading leading-[0.85] uppercase tracking-tighter">
 PURE<br/><span className="text-primary">Hydration</span>
 </h2>
 <p className=" text-muted-foreground text-base leading-relaxed mb-8 font-medium max-w-xl">The gold standard of purity. Our 7-step filtration process ensures every drop is as crisp and clean as nature intended. NAFDAC Certified quality for your peace of mind.</p>
 <button onClick={() => { setCurrentView('water'); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex items-center gap-4 text-foreground border-b-2 border-primary pb-2 hover:text-primary transition-all uppercase text-xs font-black tracking-[0.3em] font-heading">
 <span>Explore Purity</span>
 <span className="material-icons text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
 </button>
 </Reveal>
 </div>
 <div className="md:w-1/2">
 <Reveal animation="slide-from-left">
 <ParallaxImage src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1888&auto=format&fit=crop" alt="Orient Water Bottle" className="rounded-3xl h-[45vh] border border-transparent shadow-elite" />
 </Reveal>
 </div>
 </div>
 </section>
 );
};

const WaterDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
 return (
 <div id="water-deep" className="flex flex-col justify-center px-0 lg:px-6 bg-transparent border-t border-transparent relative items-center h-full w-full">
 <div className="w-[90dvw] lg:max-w-[67vw] mx-auto flex flex-col justify-center -translate-y-[2vh] lg:translate-y-0">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-1 lg:gap-16 items-center justify-center">
 <div className="lg:hidden order-1 text-center w-full shrink-0 mb-1">
 <RevealItem index={0} totalItems={5}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] md:text-xs mb-1 block">Technical Purity</span>
 </RevealItem>
 <RevealItem index={1} totalItems={5}>
 <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter leading-tight">7-STEP <br/><span className="text-primary">Filtration</span></h2>
 </RevealItem>
 </div>
 <RevealItem index={2} totalItems={5} className="order-2 lg:order-2 w-full shrink-0 mb-1 lg:mb-0">
 <div className="relative aspect-video lg:aspect-square h-[25vh] lg:h-auto w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-transparent shadow-elite">
 <ParallaxImage src="https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=2036&auto=format&fit=crop" alt="Water Laboratory" className="w-full h-full object-cover" />
 </div>
 </RevealItem>
 <div className="order-3 lg:order-1 flex flex-col w-full overflow-hidden ">
 <div className="hidden lg:block mb-6 lg:mb-2">
 <RevealItem index={0} totalItems={5}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">Technical Purity</span>
 </RevealItem>
 <RevealItem index={1} totalItems={5}>
 <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tighter mb-2 leading-tight">7-STEP <br/><span className="text-primary">Filtration</span></h2>
 </RevealItem>
 </div>
 <RevealItem index={3} totalItems={5}>
 <p className="text-xs md:text-sm lg:text-base text-foreground/80 mt-5 lg:mt-1 leading-[19px] mb-1 lg:mb-6 font-normal text-center lg:text-left line-clamp-3 lg:line-clamp-none">Beyond standard purification, Orient Water undergoes a rigorous 7-step process including Reverse Osmosis, UV Sterilization, and Ozone Treatment. We test every batch in our on-site laboratory to ensure absolute safety.</p>
 </RevealItem>
 <RevealItem index={4} totalItems={5} className="w-full">
 <div className="grid grid-cols-2 gap-2 w-full">
                    {['Reverse Osmosis', 'UV Sterilization', 'Ozone Treatment', 'Mineral Balancing'].map(step => (
                      <div key={step} className="w-full flex items-center gap-2.5 lg:gap-3.5 p-3 lg:p-4 rounded-xl lg:rounded-3xl bg-card border border-transparent shadow-soft justify-start h-full">
                        <span className="material-icons text-primary text-base lg:text-lg shrink-0">water_drop</span>
                        <span className=" text-foreground text-[9px] lg:text-[10px] font-black uppercase tracking-widest truncate">{step}</span>
                      </div>
                    ))}
 </div>
 </RevealItem>
 </div>
 </ScrollReveal>
 </div>
 </div>
 );
};

const CuratedExperiences: React.FC<{ setCurrentView: (v: any) => void }> = ({ setCurrentView }) => {
 return (
 <section id="lounge" className="relative h-screen flex flex-col justify-center bg-card transition-colors duration-[1500ms] ease-in-out items-center">
 <div className="lg:max-w-[67vw] mx-auto px-6">
 <div className="mb-16 text-center">
 <Reveal>
 <h2 className="text-primary text-sm font-black uppercase tracking-[0.3em] mb-4">Our Worlds</h2>
 <h3 className="text-5xl md:text-6xl font-serif text-foreground italic font-light tracking-tight leading-none">Curated <br/><span className="not-italic font-display font-black text-muted-foreground uppercase tracking-tighter">Experiences</span></h3>
 </Reveal>
 </div>
 <div className="flex flex-col md:flex-row items-center gap-5 md:gap-16">
 <div className="w-full md:w-1/2">
 <Reveal animation="slide-from-left">
 <ParallaxImage src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=2069&auto=format&fit=crop" alt="Lounge Experience" className="rounded-3xl aspect-[4/5] border border-transparent shadow-elite" />
 </Reveal>
 </div>
 <div className="w-full md:w-1/2">
 <Reveal animation="slide-from-right">
 <div className="w-12 h-1 bg-primary mb-8 rounded-full"></div>
 <h4 className="text-4xl font-black text-foreground mb-6 uppercase tracking-tighter leading-none">The <br/><span className="text-primary">Nightscape</span> Lounge</h4>
 <p className=" text-muted-foreground text-base leading-relaxed mb-8 lg:mb-12 font-medium">Where mixology meets mystery. Our lounge offers a secluded environment perfect for high-stakes meetings or unwinding after a long week. Featuring Zobo-infused cocktails and a curated cigar selection.</p>
 <div className="flex flex-col gap-3 lg:gap-4 mb-8 w-full">
 {['Premium Bottle Service', 'Private Booths', 'Live Jazz Weekends'].map(li => (
 <div key={li} className="flex items-center justify-start py-2 px-4 lg:py-4 lg:px-6 rounded-xl lg:rounded-2xl bg-card border border-transparent shadow-soft gap-3 w-full">
 <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_20px_rgba(242,158,13,0.5)] shrink-0"></span>
 <span className=" text-foreground font-bold uppercase tracking-widest text-[10px] lg:text-xs whitespace-nowrap">{li}</span>
 </div>
 ))}
 </div>
 <button onClick={() => { setCurrentView('lounge'); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex items-center gap-4 text-foreground border-b-2 border-primary pb-2 hover:text-primary transition-all uppercase text-xs font-black tracking-[0.3em] font-heading">
 <span>Explore Menu</span>
 <span className="material-icons text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
 </button>
 </Reveal>
 </div>
 </div>
 </div>
 </section>
 );
};

const LoungeDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
 return (
 <div id="lounge-deep" className="flex flex-col justify-center px-0 lg:px-6 bg-transparent border-t border-transparent relative items-center h-full w-full">
 <div className="w-[90dvw] lg:max-w-[67vw] mx-auto flex flex-col justify-center -translate-y-[2vh] lg:translate-y-0">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-1 lg:gap-16 items-center justify-center">
 <div className="lg:hidden order-1 text-center w-full shrink-0 mb-1">
 <RevealItem index={0} totalItems={7}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] md:text-xs mb-1 block">Atmosphere</span>
 </RevealItem>
 <RevealItem index={1} totalItems={7}>
 <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter leading-tight">SONIC <br/><span className="text-primary">Architecture</span></h2>
 </RevealItem>
 </div>
 <RevealItem index={6} totalItems={7} className="order-2 lg:order-2 w-full shrink-0 mb-1 lg:mb-0">
 <div className="relative aspect-video lg:aspect-square h-[25vh] lg:h-auto w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-transparent shadow-elite">
 <ParallaxImage src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop" alt="Lounge Atmosphere" className="w-full h-full object-cover" />
 </div>
 </RevealItem>
 <div className="order-3 lg:order-1 flex flex-col w-full overflow-hidden ">
 <div className="hidden lg:block mb-6 lg:mb-2">
 <RevealItem index={0} totalItems={7}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">Atmosphere</span>
 </RevealItem>
 <RevealItem index={1} totalItems={7}>
 <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tighter mb-2 leading-tight">SONIC <br/><span className="text-primary">Architecture</span></h2>
 </RevealItem>
 </div>
 <RevealItem index={2} totalItems={7}>
 <p className="text-xs md:text-sm lg:text-base text-foreground/80 mt-5 lg:mt-1 leading-[19px] mb-1 lg:mb-2 font-normal text-center lg:text-left line-clamp-3 lg:line-clamp-none">The lounge is acoustically treated to provide perfect sound isolation. Our resident DJs curate soundscapes that evolve through the night, paired with our signature mixology program.</p>
 </RevealItem>
 <div className="grid grid-cols-2 gap-2 w-full">
 {['Void Acoustics Sound System', 'Custom Lighting Rig', 'VIP Concierge'].map((item, i) => (
 <RevealItem key={item} index={3 + i} totalItems={7} className={`w-full ${i === 0 ? 'col-span-2' : ''}`}>
 <div className="flex items-center justify-start p-3 lg:p-1 rounded-xl lg:rounded-2xl bg-card border border-transparent shadow-soft gap-3 w-full h-full">
 <span className="material-icons text-primary text-lg lg:text-xl shrink-0">graphic_eq</span>
 <span className=" text-foreground font-bold uppercase tracking-widest text-[9px] lg:text-[10px] truncate">{item}</span>
 </div>
 </RevealItem>
 ))}
 </div>
 </div>
 </ScrollReveal>
 </div>
 </div>
 );
};

const GamesShowcase: React.FC<{ setCurrentView: (v: any) => void }> = ({ setCurrentView }) => {
 return (
 <section id="games" className="flex flex-col justify-center px-4 md:px-12 lg:max-w-[67vw] mx-auto bg-card transition-colors duration-[1500ms] ease-in-out relative items-center h-screen">
 <div className="lg:max-w-[67vw] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-16 items-center">
 <div className="md:w-1/2">
 <Reveal>
 <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">The Arena</span>
 <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6 font-heading leading-[0.85] uppercase tracking-tighter">
 HIGH<br/><span className="text-primary">Performance</span>
 </h2>
 <p className=" text-muted-foreground text-base leading-relaxed mb-8 font-medium max-w-xl">Step into the future of competitive gaming. From high-refresh rate PC arenas to immersive VR pods, we provide the infrastructure for champions.</p>
 <button onClick={() => { setCurrentView('games'); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex items-center gap-4 text-foreground border-b-2 border-primary pb-2 hover:text-primary transition-all uppercase text-xs font-black tracking-[0.3em] font-heading">
 <span>Enter Arena</span>
 <span className="material-icons text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
 </button>
 </Reveal>
 </div>
 <div className="md:w-1/2">
 <Reveal animation="slide-from-right">
 <ParallaxImage src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" alt="Gaming Arena" className="rounded-3xl h-[45vh] border border-transparent shadow-elite" />
 </Reveal>
 </div>
 </div>
 </section>
 );
};

const VerticalFerrisCarousel: React.FC = () => {
 const [activeIndex, setActiveIndex] = useState(0);
 const images = [
 "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
 "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
 "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop",
 "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
 "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
 ];

 useEffect(() => {
 const interval = setInterval(() => {
 setActiveIndex((current) => (current + 1) % images.length);
 }, 3000);
 return () => clearInterval(interval);
 }, [images.length]);

 return (
 <div className="relative w-full h-full flex items-center justify-center overflow-hidden [perspective:1500px] bg-transparent">
 {images.map((src, index) => {
 let offset = index - activeIndex;
 if (offset < -2) offset += images.length;
 if (offset > 2) offset -= images.length;

 // Calculate rotation based on offset (e.g., -65deg, 0deg, 65deg)
 const rotateX = offset * -40; 
 
 // Push items out along the Z axis so they form a circle, then rotate them, then push the whole circle back
 const radius = 400; // The radius of our "Ferris wheel"

 const up = 15;
 
 // We want the active item (offset 0) to be at Z=0 relative to the container.
 // If we just rotate and translateZ(radius), the active item will be at Z=radius.
 // So we translate the whole container back by -radius.
 
 const scale = 1 - Math.abs(offset) * 0.2;
 const opacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.6 : 0.2;
 const zIndex = 10 - Math.abs(offset);

 return (
 <div
 key={index}
 className="absolute w-[85%] h-[60%] rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
 style={{
 transform: `translateZ(-${radius}px) rotateX(${rotateX}deg) translateZ(${radius}px) scale(${scale}) translateY(${up}px)`,
 opacity,
 zIndex,
 }}
 >
 <img src={src} alt="Gaming Infrastructure" className="w-full h-full object-cover" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
 </div>
 );
 })}
 </div>
 );
};

const GamesDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
 return (
 <div id="games-deep" className="flex flex-col justify-center px-0 lg:px-6 bg-transparent border-t border-transparent relative items-center h-full w-full">
 <div className="w-[90dvw] lg:max-w-[67vw] mx-auto flex flex-col justify-center -translate-y-[2vh] lg:translate-y-0">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col lg:grid lg:grid-cols-2 gap-1 lg:gap-16 items-center justify-center">
 <div className="lg:hidden order-1 text-center w-full shrink-0 mb-1">
 <RevealItem index={0} totalItems={7}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] md:text-xs mb-1 block">Games Ecosystem</span>
 </RevealItem>
 <RevealItem index={1} totalItems={7}>
 <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter leading-tight">ZERO LAG <br/><span className="text-primary">Infrastructure</span></h2>
 </RevealItem>
 </div>
 <div className="order-2 lg:order-1 flex flex-col w-full overflow-hidden ">
 <div className="hidden lg:block mb-6 lg:mb-2">
 <RevealItem index={0} totalItems={7}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">Games Ecosystem</span>
 </RevealItem>
 <RevealItem index={1} totalItems={7}>
 <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tighter mb-1 leading-tight">ZERO LAG <br/><span className="text-primary">Infrastructure</span></h2>
 </RevealItem>
 </div>
 <RevealItem index={2} totalItems={7}>
 <p className="text-xs md:text-sm lg:text-base text-foreground/80 mt-5 lg:mt-1 leading-[19px] mb-1 lg:mb-6 font-normal text-center lg:text-left line-clamp-3 lg:line-clamp-none">We've built a dedicated fiber-optic network to ensure sub-10ms latency for competitive play. Our hardware is refreshed quarterly, featuring the latest RTX GPUs and high-fidelity VR peripherals.</p>
 </RevealItem>
 <div className="grid grid-cols-2 gap-2 w-full">
 {['Fiber-Optic Backbone', 'RTX 40-Series GPUs', '240Hz Displays'].map((spec, i) => (
 <RevealItem key={spec} index={3 + i} totalItems={7} className={`w-full ${i === 0 ? 'col-span-2' : ''}`}>
 <div className="flex items-center justify-start py-1.5 px-3 lg:py-3 lg:px-4 rounded-xl lg:rounded-2xl bg-card border border-transparent shadow-soft gap-3 w-full h-full">
 <span className="material-icons text-primary text-lg lg:text-xl shrink-0">bolt</span>
 <span className=" text-foreground font-bold uppercase tracking-widest text-[9px] lg:text-[10px] truncate">{spec}</span>
 </div>
 </RevealItem>
 ))}
 </div>
 </div>
 <RevealItem index={6} totalItems={7} className="order-3 lg:order-2 w-full h-[240px] lg:h-[240px] shrink-0 flex justify-center lg:justify-start">
 <div className="relative h-[240px] w-[338.5px] rounded-2xl lg:rounded-3xl overflow-hidden border border-transparent shadow-elite">
 <VerticalFerrisCarousel />
 </div>
 </RevealItem>
 </ScrollReveal>
 </div>
 </div>
 );
};

const PeekingSlider: React.FC<{
 items: any[];
 renderItem: (item: any, index: number, isActive: boolean) => React.ReactNode;
 interval?: number;
 className?: string;
 cardWidth?: string;
}> = ({ items, renderItem, className = "", cardWidth = "w-[85%]" }) => {
 const stepDuration = 5; // Seconds per card cycle
 const totalDuration = items.length * stepDuration;
 
 return (
 <div className={`relative w-full overflow-hidden md:hidden h-full group ${className}`}>
 <style>{`
 @keyframes peeking-slide {
 0% { transform: translateX(150%); opacity: 0; }
 ${(0.15 * stepDuration / totalDuration) * 100}% { transform: translateX(-50%); opacity: 1; }
 ${(0.95 * stepDuration / totalDuration) * 100}% { transform: translateX(-60%); opacity: 1; }
 ${(stepDuration / totalDuration) * 100}% { transform: translateX(-250%); opacity: 0; }
 100% { transform: translateX(-250%); opacity: 0; }
 }
 .peeking-card {
 animation: peeking-slide ${totalDuration}s infinite both;
 }
 .group:active .peeking-card,
 .group:hover .peeking-card {
 animation-play-state: paused;
 }
 `}</style>
 {items.map((item, i) => (
 <div
 key={i}
 className={`absolute top-0 left-1/2 h-full peeking-card ${cardWidth}`}
 style={{ 
 animationDelay: `${i * stepDuration}s`
 }}
 >
 {renderItem(item, i, true)}
 </div>
 ))}
 </div>
 );
};

const VoicesOfJos: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
 const reviews = [
 { name: 'Sarah N.', role: 'Rayfield Resident', text: "I've never seen a supermarket this clean in Jos. It feels like I'm abroad...", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" },
 { name: 'David O.', role: 'Gamer', text: "The internet speed at the gaming lounge is insane. No lag at all.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
 { name: 'Fatima A.', role: 'Foodie', text: "The jollof rice at the restaurant... honestly, it's the best I've had in years.", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop" }
 ];

 return (
 <section className="flex flex-col justify-center bg-transparent border-y border-transparent transition-colors duration-[1500ms] ease-in-out relative overflow-hidden items-center h-full w-full">
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(242,158,13,0.03),transparent_70%)] pointer-events-none" />
 <div className="w-[90dvw] lg:max-w-[75vw] xl:max-w-[67vw] mx-auto flex flex-col justify-center">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col justify-center">
 <RevealItem index={0} totalItems={4} className="shrink-0">
 <div className="text-center mb-2 md:mb-4 lg:mb-2">
 <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-1 md:mb-2 uppercase tracking-tighter leading-none">VOICES OF <br className="md:hidden"/><span className="text-primary">Jos</span></h2>
 <p className=" text-muted-foreground font-bold text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em]">Real stories from our community.</p>
 </div>
 </RevealItem>
 
 <div className="h-[160px] md:h-auto w-full relative">
 <PeekingSlider 
 items={reviews}
 className="h-full"
 cardWidth="w-[85%]"
 renderItem={(rev, idx, active) => (
 <div className={` bg-card p-4 rounded-[1.2rem] border border-transparent transition-all shadow-soft relative h-full w-full flex flex-col justify-between ${active ? 'border-primary/30 shadow-elite' : 'opacity-40'}`}>
 <div className="flex items-center gap-3 mb-2">
 <img src={rev.img} className="w-8 h-8 rounded-full border border-primary/20 object-cover" alt={rev.name} />
 <div className="overflow-hidden">
 <h4 className=" text-foreground font-black text-[10px] uppercase tracking-tight truncate">{rev.name}</h4>
 <p className="text-[8px] text-muted-foreground uppercase font-black tracking-[0.1em] truncate">{rev.role}</p>
 </div>
 </div>
 
 <div className="flex-1 flex flex-col justify-center">
 <p className=" text-muted-foreground text-[10px] italic font-medium leading-tight line-clamp-3 mb-2">"{rev.text}"</p>
 
 <div className="/50 bg-background rounded-lg p-2 flex items-center gap-2 shrink-0">
 <button className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white shadow-lg">
 <span className="material-icons text-[12px]">play_arrow</span>
 </button>
 <div className="flex gap-1 h-4 items-center flex-1 overflow-hidden">
 {[...Array(12)].map((_, i) => (
 <div key={i} className="w-0.5 bg-primary/40 rounded-full" style={{ height: `${20 + Math.random() * 80}%` }}></div>
 ))}
 </div>
 <span className="text-[8px] text-muted-foreground font-mono font-bold">0:24</span>
 </div>
 </div>
 
 <span className="material-icons absolute top-2 right-2 text-primary/10 text-xl">format_quote</span>
 </div>
 )}
 />
 
 {/* Desktop Grid */}
 <div className="hidden md:grid md:grid-cols-3 gap-6 w-full">
 {reviews.map((rev, idx) => (
 <div key={idx} className=" bg-card p-6 rounded-[2rem] border border-transparent transition-all shadow-soft relative h-[200px] w-full flex flex-col justify-between hover:border-primary/30 hover:shadow-elite group">
 <div className="flex items-center gap-3 mb-2">
 <img src={rev.img} className="w-10 h-10 rounded-full border border-primary/20 object-cover" alt={rev.name} />
 <div className="overflow-hidden">
 <h4 className=" text-foreground font-black text-xs uppercase tracking-tight truncate">{rev.name}</h4>
 <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.1em] truncate">{rev.role}</p>
 </div>
 </div>
 
 <div className="flex-1 flex flex-col justify-center">
 <p className=" text-muted-foreground text-xs italic font-medium leading-relaxed mb-4">"{rev.text}"</p>
 
 <div className="/50 bg-background rounded-xl p-2 flex items-center gap-3 shrink-0">
 <button className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
 <span className="material-icons text-xs">play_arrow</span>
 </button>
 <div className="flex gap-1 h-4 items-center flex-1 overflow-hidden">
 {[...Array(15)].map((_, i) => (
 <div key={i} className="w-0.5 bg-primary/40 rounded-full" style={{ height: `${30 + Math.random() * 70}%` }}></div>
 ))}
 </div>
 <span className="text-[9px] text-muted-foreground font-mono font-bold">0:24</span>
 </div>
 </div>
 
 <span className="material-icons absolute top-4 right-4 text-primary/10 text-3xl">format_quote</span>
 </div>
 ))}
 </div>
 </div>
 </ScrollReveal>
 </div>
 </section>
 );
};

const MagneticCard: React.FC<{ 
 id: string; 
 title: string; 
 subtitle?: string; 
 icon: string; 
 img: string; 
 onClick?: () => void;
 className?: string;
 style?: any;
 titleSize?: string;
}> = ({ id, title, subtitle, icon, img, onClick, className = "", style = {}, titleSize = "text-2xl" }) => {
 const { onMouseMove, onMouseLeave, rotateX, rotateY, spotlightX, spotlightY } = useMagneticTilt();
 const [isHovered, setIsHovered] = useState(false);

 const ref = useRef(null);
 const { scrollContainerRef } = React.useContext(ScrollContext);
 const { scrollYProgress } = useScroll({
 target: ref,
 container: scrollContainerRef || undefined,
 offset: ["start end", "end start"]
 });
 const parallaxY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

 return (
 <motion.div
 ref={ref}
 id={id}
 onHoverStart={() => setIsHovered(true)}
 onHoverEnd={() => setIsHovered(false)}
 whileHover={{ y: -15 }}
 onMouseMove={onMouseMove}
 onMouseLeave={onMouseLeave}
 className={`relative rounded-2xl sm:rounded-[2rem] overflow-hidden cursor-pointer border border-transparent bg-card shadow-soft hover:shadow-elite transition-all duration-500 group ${className}`}
 style={{ ...style, perspective: 1000, rotateX: isHovered ? rotateX : 0, rotateY: isHovered ? rotateY : 0 }}
 transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }}
 onClick={onClick}
 >
 <motion.div style={{ y: parallaxY }} className="absolute inset-0 w-full h-[125%] -top-[12.5%]">
 <motion.img 
 src={img} 
 className="w-full h-full object-cover opacity-60 dark:opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out" 
 alt={title} 
 />
 </motion.div>
 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-noir-black opacity-90" />
 <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: useTransform([spotlightX, spotlightY], ([x, y]) => `radial-gradient(600px circle at ${x} ${y}, rgba(242,158,13,0.08), transparent 40%)`) }} />
 <div className="absolute inset-0 p-4 sm:p-6 lg:p-10 flex flex-col justify-end items-start z-10">
 <span className="material-icons text-primary text-2xl lg:text-4xl mb-1 sm:mb-2 lg:mb-4 group-hover:scale-125 transition-transform duration-500">{icon}</span>
 <h3 className={`${titleSize} font-black text-foreground font-heading uppercase tracking-tight leading-none group-hover:translate-x-2 transition-transform duration-500`}>{title}</h3>
 {subtitle && (
 <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-muted-foreground mt-1 lg:mt-2 font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 line-clamp-1">{subtitle}</p>
 )}
 </div>
 <div className="absolute inset-0 border-[1px] border-transparent pointer-events-none rounded-2xl sm:rounded-[2rem]" />
 </motion.div>
 );
};

const ServicesGrid: React.FC<{ setCurrentView: (v: any) => void; isActive?: boolean }> = ({ setCurrentView, isActive = false }) => {
 const handleNavigate = (view: string) => {
 setCurrentView(view);
 document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
 };

 return (
 <section className="relative z-30 bg-transparent h-full w-full flex flex-col justify-center px-0 lg:px-8 items-center mt-0 sm:mt-0">
 <div className="w-[90dvw] min-h-[75dvh] max-h-[80dvh] h-auto lg:w-full lg:min-h-0 lg:max-h-none lg:h-auto lg:max-w-[67vw] mx-auto flex flex-col items-center justify-center">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col items-center justify-center">
 <RevealItem className="text-center w-full shrink-0" index={0}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] md:text-sm mb-1 sm:mb-4 block mt-4 lg:mt-0">
 Bespoke Services
 </span>
 <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tighter max-w-3xl mx-auto mb-1 sm:mb-4 lg:mb-2">
 FOR THOSE WHO DEMAND <span className="/40 text-slate-300 italic">EXCELLENCE.</span>
 </h2>
 </RevealItem>

 <div className="grid grid-cols-2 grid-rows-4 lg:grid-cols-4 lg:grid-rows-3 gap-2 sm:gap-4 mx-auto w-full lg:w-[55vw] flex-1 min-h-[60vh] lg:flex-none lg:h-[60vh] pb-4 lg:pb-0">
 <RevealItem className='h-full w-full col-span-2 row-span-1 lg:col-span-2 lg:row-span-2' index={1} totalItems={6}>
 <MagneticCard 
 id="card-bakery" 
 title="Bakery" 
 subtitle="Artisanal Breads" 
 icon="bakery_dining" 
 img="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop" 
 onClick={() => handleNavigate('bakery')}
 className="h-full"
 titleSize="text-base lg:text-3xl"
 />
 </RevealItem>
 <RevealItem className='h-full w-full col-span-1 row-span-1 lg:col-span-2 lg:row-span-1' index={2} totalItems={6}>
 <MagneticCard 
 id="card-restaurant" 
 title="Restaurant" 
 subtitle="Chef-Curated" 
 icon="restaurant" 
 img="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" 
 onClick={() => handleNavigate('dining')}
 className="h-full"
 titleSize="text-base lg:text-2xl"
 />
 </RevealItem>
 <RevealItem className='h-full w-full col-span-1 row-span-2 lg:col-span-1 lg:row-span-2' index={3} totalItems={6}>
 <MagneticCard 
 id="card-lounge" 
 title="Lounge" 
 subtitle="Premium Spirits" 
 icon="liquor" 
 img="https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=2070&auto=format&fit=crop" 
 onClick={() => handleNavigate('lounge')}
 className="h-full"
 titleSize="text-base lg:text-2xl"
 />
 </RevealItem>
 <RevealItem className='h-full w-full col-span-1 row-span-1 lg:col-span-1 lg:row-span-1' index={4} totalItems={6}>
 <MagneticCard 
 id="card-market" 
 title="Market" 
 subtitle="Global Sourcing" 
 icon="shopping_cart" 
 img="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop" 
 onClick={() => handleNavigate('supermarket')}
 className="h-full"
 titleSize="text-base lg:text-2xl"
 />
 </RevealItem>
 <RevealItem className='h-full w-full col-span-1 row-span-1 lg:col-span-2 lg:row-span-1' index={5} totalItems={6}>
 <MagneticCard 
 id="card-games" 
 title="Games" 
 subtitle="VR Frontier" 
 icon="sports_esports" 
 img="https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=2012&auto=format&fit=crop" 
 onClick={() => handleNavigate('games')}
 className="h-full"
 titleSize="text-base lg:text-2xl"
 />
 </RevealItem>
 <RevealItem className='h-full w-full col-span-1 row-span-1 lg:col-span-1 lg:row-span-1' index={6} totalItems={6}>
 <MagneticCard 
 id="card-water" 
 title="Water" 
 subtitle="Pure Excellence" 
 icon="water_drop" 
 img="https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=2070&auto=format&fit=crop" 
 onClick={() => handleNavigate('water')}
 className="h-full"
 titleSize="text-base lg:text-2xl"
 />
 </RevealItem>
 </div>
 </ScrollReveal>
 </div>
 </section>
 );
};

const TrustSection: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
 const certifications = [
 { name: "NAFDAC Certified", icon: "verified", desc: "Meeting the highest national safety standards for food and water production." },
 { name: "ISO 9001:2015", icon: "workspace_premium", desc: "International quality management systems ensuring consistent excellence." },
 { name: "Global Standards", icon: "public", desc: "Imported hardware and premium ingredients sourced from world-class partners." }
 ];

 return (
 <section className="flex flex-col justify-center px-0 lg:px-6 relative overflow-hidden bg-transparent border-t border-transparent items-center h-full w-full">
 <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(242,158,13,0.02),transparent_50%)] pointer-events-none" />
 <div className="w-[90dvw] lg:max-w-[67vw] mx-auto flex flex-col justify-center">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col justify-center">
 <div className="text-center mb-2 lg:mb-6 shrink-0">
 <RevealItem index={0} totalItems={6}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] md:text-sm mb-1 lg:mb-2 block">
 The Standard of Trust
 </span>
 </RevealItem>
 <RevealItem index={1} totalItems={6}>
 <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tighter leading-tight mb-1 lg:mb-3">
 UNCOMPROMISING <br/><span className="text-primary">Quality</span>
 </h2>
 </RevealItem>
 </div>
 
 <div className="h-[180px] md:h-auto w-full relative">
 <PeekingSlider 
 items={certifications}
 className="h-full"
 cardWidth="w-[80%]"
 renderItem={(cert, i, active) => (
 <div className={`p-4 rounded-[1.5rem] bg-gradient-to-br from-white via-white to-orange-50/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10 backdrop-blur-xl border border-transparent shadow-soft transition-all duration-700 relative overflow-hidden h-full w-full flex flex-col items-center text-center justify-center ${active ? 'border-primary/40 shadow-elite ring-1 ring-primary/10' : 'opacity-40'}`}>
 <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 blur-[40px] rounded-full" />
 <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-primary/5 blur-[40px] rounded-full" />
 <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mb-2 shrink-0 relative z-10">
 <span className="material-icons text-primary text-lg">{cert.icon}</span>
 </div>
 <h3 className="text-xs font-black text-foreground uppercase mb-1 tracking-tight leading-none relative z-10">{cert.name}</h3>
 <p className=" text-foreground/80 leading-tight font-medium text-[10px] line-clamp-2 relative z-10">{cert.desc}</p>
 </div>
 )}
 />
 
 {/* Desktop Grid */}
 <div className="hidden md:grid md:grid-cols-3 gap-8 w-full">
 {certifications.map((cert, i) => (
 <div key={i} className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white via-white to-orange-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/5 backdrop-blur-xl border border-transparent shadow-soft hover:shadow-elite hover:border-primary/40 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center justify-center group">
 <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
 <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
 
 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 relative z-10">
 <span className="material-icons text-primary text-3xl">{cert.icon}</span>
 </div>
 <h3 className="text-2xl font-black text-foreground uppercase mb-1 md:mb-3 tracking-tight relative z-10">{cert.name}</h3>
 <p className=" text-foreground/80 leading-relaxed font-medium text-base relative z-10">{cert.desc}</p>
 
 {/* Subtle shine effect */}
 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out" />
 </div>
 </div>
 ))}
 </div>
 </div>
 </ScrollReveal>
 </div>
 </section>
 );
};

const LocationSection: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
 return (
 <section className="flex flex-col justify-center px-0 lg:px-6 bg-transparent border-t border-transparent relative overflow-hidden items-center h-full w-full">
 <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(242,158,13,0.02),transparent_50%)] pointer-events-none" />
 <div className="w-[90dvw] lg:max-w-[67vw] mx-auto flex flex-col justify-center">
 <ScrollReveal isActive={isActive} className="w-full h-full flex flex-col items-center justify-center gap-4 lg:gap-3">
 <div className="text-center w-full shrink-0">
 <RevealItem index={0} totalItems={6}>
 <span className="text-primary font-black tracking-[0.3em] uppercase text-[8px] md:text-[11px] mb-1 block">
 Our Presence
 </span>
 </RevealItem>
 <RevealItem index={1} totalItems={6}>
 <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-foreground uppercase tracking-tighter leading-tight">
 RAYFIELD, <span className="text-primary">Jos</span>
 </h2>
 </RevealItem>
 </div>
 <RevealItem index={5} totalItems={6} className="w-full max-w-2xl shrink-0">
 <div className="relative aspect-video h-[20vh] lg:h-[32vh] rounded-2xl lg:rounded-3xl overflow-hidden border border-transparent shadow-elite mx-auto">
 <ParallaxImage src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop" alt="Jos Landscape" className="w-full h-full object-cover" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 lg:p-6">
 <div className="flex items-center gap-2 lg:gap-3 text-background">
 <span className="material-icons text-primary text-[11px] lg:text-sm">explore</span>
 <span className="font-black uppercase tracking-widest text-[7px] lg:text-[10px]">Discover Plateau State</span>
 </div>
 </div>
 </div>
 </RevealItem>
 <div className="flex flex-col w-full max-w-xl items-center text-center">
 <RevealItem index={2} totalItems={6}>
 <p className="text-[10px] md:text-xs lg:text-sm text-foreground/80 leading-snug lg:leading-relaxed mb-2 lg:mb-2 font-medium line-clamp-3 lg:line-clamp-none">
 Visit our flagship destination at Amada Plaza. A convergence of all lifestyle divisions in the heart of Plateau State.
 </p>
 </RevealItem>
 <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 w-full">
 <RevealItem index={3} totalItems={6} className="w-full">
 <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-card border border-transparent shadow-soft group hover:border-primary/30 transition-all duration-500">
 <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0">
 <span className="material-icons text-primary text-base lg:text-2xl">location_on</span>
 </div>
 <div className="text-left">
 <h4 className=" text-foreground font-black uppercase tracking-tight text-[8px] lg:text-sm mb-0.5 lg:mb-1">Amada Plaza</h4>
 <p className=" text-muted-foreground text-[7px] lg:text-xs font-medium">Rayfield, Jos, Plateau State</p>
 </div>
 </div>
 </RevealItem>
 <RevealItem index={4} totalItems={6} className="w-full">
 <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-card border border-transparent shadow-soft group hover:border-primary/30 transition-all duration-500">
 <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0">
 <span className="material-icons text-primary text-base lg:text-2xl">schedule</span>
 </div>
 <div className="text-left">
 <h4 className=" text-foreground font-black uppercase tracking-tight text-[8px] lg:text-sm mb-0.5 lg:mb-1">Open Daily</h4>
 <p className=" text-muted-foreground text-[7px] lg:text-xs font-medium">8:00 AM - 11:00 PM</p>
 </div>
 </div>
 </RevealItem>
 </div>
 </div>
 </ScrollReveal>
 </div>
 </section>
 );
};
const VoicesSection: React.FC = () => {
 return null; // This will be removed as we are using VoicesOfJos
};


const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id?: string;
    role: 'user' | 'bot';
    text: string | React.ReactNode;
    images?: string[];
    orderDraft?: {
      items: Array<{ id?: string; name: string; quantity: number; price: number }>;
      totalAmount: number;
      notes?: string;
      confirmed?: boolean;
      orderId?: string;
    };
  }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [pendingOrder, setPendingOrder] = useState<{
    items: Array<{ id?: string; name: string; quantity: number; price: number }>;
    totalAmount: number;
    notes?: string;
  } | null>(null);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Refined Text-to-Speech (Speaks AURA's replies)
  const speakText = (text: string) => {
    if (!isVoiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text
        .replace(/[*_#`~]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/₦/g, 'Naira ');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const refinedVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Female') || v.name.includes('UK')) && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en'));
      if (refinedVoice) utterance.voice = refinedVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Autonomous Navigation Helper
  const executeNav = (sectionId: string) => {
    const s = (sectionId || '').toLowerCase();
    if (s.includes('dining') || s.includes('restaurant') || s.includes('menu')) {
      window.dispatchEvent(new CustomEvent('orient:navigate-dining', { detail: { sectionId: 'menu' } }));
      const el = document.getElementById('dining') || document.getElementById('restaurant') || document.getElementById('menu');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      const navMsg = 'Certainly. Navigating you to the Orient Dining Menu.';
      setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'bot', text: navMsg }]);
      speakText(navMsg);
    } else if (s.includes('order')) {
      window.dispatchEvent(new CustomEvent('orient:open-order'));
      const navMsg = 'Opening your active kitchen orders tracker.';
      setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'bot', text: navMsg }]);
      speakText(navMsg);
    } else if (s.includes('bakery')) {
      const el = document.getElementById('bakery');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      const navMsg = 'Navigating you to Orient Artisanal Bakery.';
      setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'bot', text: navMsg }]);
      speakText(navMsg);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const navMsg = `Navigating you to the ${sectionId} section.`;
        setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'bot', text: navMsg }]);
        speakText(navMsg);
      } else {
        const navMsg = `Navigating you to ${sectionId}.`;
        setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'bot', text: navMsg }]);
        speakText(navMsg);
      }
    }
  };

  // Order Placement Execution Helper
  const executeOrderPlacement = async (orderData: {
    items: Array<{ id?: string; name: string; quantity: number; price: number }>;
    totalAmount: number;
    customerName?: string;
    tableNumber?: string;
    deliveryAddress?: string;
    notes?: string;
  }, messageIndex?: number) => {
    try {
      setIsTyping(true);
      const activeUser = getActiveConsumerUser();
      const placed = await orderService.placeOrder({
        customerName: orderData.customerName || activeUser?.name || 'Orient Flagship Guest',
        customerPhone: activeUser?.phone || '+234 800 000 0000',
        tableNumber: orderData.tableNumber || 'VIP Table 4',
        shippingAddress: orderData.deliveryAddress || 'Amada Plaza, Rayfield, Jos',
        notes: orderData.notes || 'Placed via AURA AI Concierge',
        division: 'dining',
        items: orderData.items.map(it => ({
          id: it.id || `PRD-D-${Math.floor(Math.random() * 20 + 1).toString().padStart(3, '0')}`,
          name: it.name,
          quantity: it.quantity,
          price: it.price || 10,
          division: 'dining'
        })),
        totalAmount: orderData.totalAmount || (orderData.items.reduce((acc, i) => acc + (i.price || 10) * i.quantity, 0))
      });

      playAlertSound('placed');
      setPendingOrder(null);

      if (typeof messageIndex === 'number') {
        setMessages(prev => prev.map((m, idx) => idx === messageIndex && m.orderDraft ? {
          ...m,
          orderDraft: { ...m.orderDraft, confirmed: true, orderId: placed.id }
        } : m));
      }

      const confirmMsg = `Your order #${placed.id} has been confirmed and dispatched to our kitchen! Estimated preparation time is 11 minutes. Our chefs have begun preparing your dishes.`;
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'bot',
        text: confirmMsg,
        orderDraft: {
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          confirmed: true,
          orderId: placed.id
        }
      }]);

      speakText(confirmMsg);
    } catch (err: any) {
      console.error('Failed to place order:', err);
      const errMsg = 'I apologize, but there was an issue sending your order to the kitchen. Please try again momentarily.';
      setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'bot', text: errMsg }]);
      speakText(errMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : input;
    if (!textToSend.trim() && attachedImages.length === 0) return;
    
    const userMsg = textToSend;
    const currentImages = [...attachedImages];
    
    setMessages(prev => [...prev, { 
      id: `user-${Date.now()}`,
      role: 'user', 
      text: userMsg,
      images: currentImages
    }]);
    
    setInput('');
    setAttachedImages([]);
    setIsTyping(true);

    let handled = false;

    // 1. Primary: Send request to /api/chat (Vercel Serverless / Express dev route)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          images: currentImages,
          history: messages.slice(-8).map(m => ({
            role: m.role === 'bot' ? 'model' : 'user',
            text: typeof m.text === 'string' ? m.text : ''
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.functionCalls && data.functionCalls.length > 0) {
          for (const fc of data.functionCalls) {
            if (fc.name === 'navigateToSection') {
              const sectionId = (fc.args as any)?.sectionId;
              if (sectionId) executeNav(sectionId);
            } else if (fc.name === 'prepareOrder') {
              const draft = {
                items: (fc.args as any)?.items || [],
                totalAmount: (fc.args as any)?.totalAmount || 0,
                notes: (fc.args as any)?.notes || '',
                confirmed: false
              };
              setPendingOrder(draft);
              const botText = data.text || `I have prepared your order for ${draft.items.map((i: any) => `${i.quantity}× ${i.name}`).join(', ')} (Total: ₦${draft.totalAmount}). Shall I confirm and place this order for you?`;
              setMessages(prev => [...prev, {
                id: `bot-${Date.now()}`,
                role: 'bot',
                text: botText,
                orderDraft: draft
              }]);
              speakText(botText);
            } else if (fc.name === 'placeOrder') {
              const orderData = {
                items: (fc.args as any)?.items || pendingOrder?.items || [],
                totalAmount: (fc.args as any)?.totalAmount || pendingOrder?.totalAmount || 0,
                customerName: (fc.args as any)?.customerName,
                tableNumber: (fc.args as any)?.tableNumber,
                deliveryAddress: (fc.args as any)?.deliveryAddress,
                notes: (fc.args as any)?.notes || pendingOrder?.notes
              };
              executeOrderPlacement(orderData);
            }
          }
        } else if (data.text) {
          setMessages(prev => [...prev, { id: `bot-${Date.now()}`, role: 'bot', text: data.text }]);
          speakText(data.text);
        } else {
          const fallbackGreeting = 'I am here to serve. How may I assist you with our dining menu or orders today?';
          setMessages(prev => [...prev, { id: `bot-${Date.now()}`, role: 'bot', text: fallbackGreeting }]);
          speakText(fallbackGreeting);
        }
        handled = true;
      }
    } catch (apiErr) {
      console.warn('API /api/chat error, attempting client-side fallback:', apiErr);
    }

    // 2. Fallback: Client-side Google GenAI using import.meta.env.VITE_GEMINI_API_KEY
    if (!handled) {
      const clientApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY;
      if (clientApiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey: clientApiKey });
          
          const parts: any[] = [];
          if (userMsg) parts.push({ text: userMsg });
          
          for (const imgBase64 of currentImages) {
            parts.push({
              inlineData: {
                mimeType: 'image/jpeg',
                data: imgBase64.includes(',') ? imgBase64.split(',')[1] : imgBase64
              }
            });
          }

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
              systemInstruction: `You are AURA, Orient Luxury AI Concierge for Orient Global Flagship in Jos.
Full Menu:
Proteins: Peppered & Grilled Beef (₦10), Spiced Chicken (₦10), Peppered Pork Chops (₦10), Goat Meat & Catfish Platter (₦10).
Rice: Smoky Jollof (₦10), Fried Rice (₦10), White Rice Ayamase (₦10), Coconut Rice (₦10).
Soups: Egusi (₦10), Efo Riro (₦10), Seafood Okra (₦10), Ogbono & Afang (₦10), Pounded Yam (₦10), Amala (₦10).
Pasta/Yam: Asaro (₦10), Jollof Spaghetti (₦10), Fried Yam & Plantain (₦10).
Sides: Moi Moi (₦10), Dodo (₦10), Pepper Soup (₦10).
When asked about items not on menu, offer closest alternatives.
When asked to order, use prepareOrder tool and ask confirmation before calling placeOrder.
Use navigateToSection when user wants to see sections.`,
              tools: [{
                functionDeclarations: [navigateToSectionTool, prepareOrderTool, placeOrderTool]
              }],
            }
          });

          if (response.functionCalls && response.functionCalls.length > 0) {
            for (const fc of response.functionCalls) {
              if (fc.name === 'navigateToSection') {
                const sectionId = (fc.args as any)?.sectionId;
                if (sectionId) executeNav(sectionId);
              } else if (fc.name === 'prepareOrder') {
                const draft = {
                  items: (fc.args as any)?.items || [],
                  totalAmount: (fc.args as any)?.totalAmount || 0,
                  notes: (fc.args as any)?.notes || '',
                  confirmed: false
                };
                setPendingOrder(draft);
                const botText = response.text || `I have prepared your order for ${draft.items.map((i: any) => `${i.quantity}× ${i.name}`).join(', ')} (Total: ₦${draft.totalAmount}). Shall I confirm and place this order for you?`;
                setMessages(prev => [...prev, {
                  id: `bot-${Date.now()}`,
                  role: 'bot',
                  text: botText,
                  orderDraft: draft
                }]);
                speakText(botText);
              } else if (fc.name === 'placeOrder') {
                const orderData = {
                  items: (fc.args as any)?.items || pendingOrder?.items || [],
                  totalAmount: (fc.args as any)?.totalAmount || pendingOrder?.totalAmount || 0,
                  customerName: (fc.args as any)?.customerName,
                  tableNumber: (fc.args as any)?.tableNumber,
                  deliveryAddress: (fc.args as any)?.deliveryAddress,
                  notes: (fc.args as any)?.notes || pendingOrder?.notes
                };
                executeOrderPlacement(orderData);
              }
            }
          } else if (response.text) {
            setMessages(prev => [...prev, { id: `bot-${Date.now()}`, role: 'bot', text: response.text }]);
            speakText(response.text);
          }
          handled = true;
        } catch (clientErr) {
          console.error('Client-side fallback error:', clientErr);
        }
      }
    }

    if (!handled) {
      const errMsg = 'I apologize, but I am currently updating my navigational systems. Please try again momentarily.';
      setMessages(prev => [...prev, { id: `bot-${Date.now()}`, role: 'bot', text: errMsg }]);
      speakText(errMsg);
    }
    setIsTyping(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Speech-to-Text with auto-dispatch
  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  const chatbotVars = {
    '--cb-fg': 'var(--color-foreground)',
    '--cb-muted': 'var(--color-muted-foreground)',
    '--cb-primary': 'var(--color-primary)',
    '--cb-border': 'var(--color-border)',
  } as React.CSSProperties;

  return (
    <div className='fixed bottom-[4.5rem] right-4 sm:bottom-4 sm:right-12 z-[2000]' style={chatbotVars}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click outside to close backdrop */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[-1]"
               onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className='absolute bottom-0 right-0 w-[90vw] sm:w-[380px] max-h-[85vh] h-[85vh] rounded-[1.75rem] shadow-[0_30px_90px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden bg-card/95 backdrop-blur-[50px] border border-border'
            >
              {/* Header */}
              <div className='px-5 py-3.5 flex items-center justify-between bg-surface/80 border-b border-border'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-inner'>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className='text-foreground font-black uppercase tracking-tight text-xs sm:text-sm leading-none flex items-center gap-1.5'>
                      AURA Concierge
                      <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                    </h4>
                    <p className='text-muted-foreground text-[10px] font-medium tracking-wide mt-0.5'>Orient Global Flagship</p>
                  </div>
                </div>
                
                <div className='flex items-center gap-1'>
                  {/* Voice Output Toggle (Mute/Unmute) */}
                  <button 
                    onClick={() => {
                      setIsVoiceOutputEnabled(prev => !prev);
                      if (isVoiceOutputEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                    }} 
                    className={`p-1.5 rounded-lg transition-colors hover:bg-muted ${isVoiceOutputEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                    title={isVoiceOutputEnabled ? 'Voice response enabled (Click to mute)' : 'Voice response muted (Click to enable)'}
                  >
                    {isVoiceOutputEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  <button onClick={() => setIsOpen(false)} className='text-muted-foreground hover:text-foreground transition-colors p-1.5 hover:bg-muted rounded-lg'>
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div ref={scrollRef} className='flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-hide'>
                {messages.length === 0 && (
                  <div className='bg-primary/10 border border-primary/20 p-4 rounded-2xl rounded-tl-none self-start max-w-[95%] shadow-sm'>
                    <p className='text-foreground text-xs leading-relaxed font-medium'>
                      "Welcome to Orient Global Flagship. I am AURA, your luxury concierge. Ask me anything about our restaurant menu, speak directly to place an order, or explore our divisions."
                    </p>
                    <div className='mt-3 flex flex-wrap gap-1.5'>
                      <button 
                        onClick={() => handleSend("What is on the restaurant menu today?")}
                        className='text-[10px] font-bold uppercase tracking-wider bg-background/80 hover:bg-primary hover:text-white transition-all px-2.5 py-1 rounded-full border border-border shadow-xs'
                      >
                        🍽️ View Menu
                      </button>
                      <button 
                        onClick={() => handleSend("Do you have steak or pizza?")}
                        className='text-[10px] font-bold uppercase tracking-wider bg-background/80 hover:bg-primary hover:text-white transition-all px-2.5 py-1 rounded-full border border-border shadow-xs'
                      >
                        🔍 Alternatives
                      </button>
                      <button 
                        onClick={() => handleSend("Order 2 plates of Smoky Jollof Rice")}
                        className='text-[10px] font-bold uppercase tracking-wider bg-background/80 hover:bg-primary hover:text-white transition-all px-2.5 py-1 rounded-full border border-border shadow-xs'
                      >
                        ⚡ Order Food
                      </button>
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={m.id || i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className='max-w-[92%] space-y-2'>
                      <div className={`p-3.5 rounded-2xl text-[12.5px] leading-relaxed font-medium shadow-xs border ${m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none border-primary' 
                        : 'bg-muted/70 border-border text-foreground rounded-bl-none'}`}>
                        <div className='whitespace-pre-wrap'>{m.text}</div>
                        
                        {m.images && m.images.length > 0 && (
                          <div className='grid grid-cols-2 gap-1.5 mt-2'>
                            {m.images.map((img, idx) => (
                              <img key={idx} src={img} className='rounded-lg w-full h-20 object-cover shadow-sm' alt='Attached' referrerPolicy='no-referrer' />
                            ))}
                          </div>
                        )}

                        {/* Interactive Order Confirmation Card */}
                        {m.orderDraft && !m.orderDraft.confirmed && (
                          <div className='mt-3 p-3 rounded-xl bg-card border border-primary/30 shadow-md text-foreground'>
                            <div className='flex items-center justify-between pb-2 border-b border-border mb-2.5'>
                              <div className='flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary'>
                                <ChefHat size={14} />
                                <span>Order Summary</span>
                              </div>
                              <span className='text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full'>
                                Confirm Stage
                              </span>
                            </div>

                            <div className='space-y-1.5 text-xs mb-3'>
                              {m.orderDraft.items.map((item, itemIdx) => (
                                <div key={itemIdx} className='flex items-center justify-between text-muted-foreground'>
                                  <span>{item.quantity}× <span className='text-foreground font-semibold'>{item.name}</span></span>
                                  <span className='font-mono font-bold text-foreground'>₦{(item.price || 10) * item.quantity}</span>
                                </div>
                              ))}
                              <div className='pt-2 border-t border-border flex items-center justify-between font-bold text-foreground text-sm'>
                                <span>Total Amount:</span>
                                <span className='font-mono text-primary'>₦{m.orderDraft.totalAmount}</span>
                              </div>
                            </div>

                            <div className='flex items-center gap-2 pt-1'>
                              <button
                                onClick={() => executeOrderPlacement(m.orderDraft!, i)}
                                className='flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5'
                              >
                                <CheckCircle2 size={14} />
                                <span>Confirm & Place Order</span>
                              </button>
                              <button
                                onClick={() => {
                                  setPendingOrder(null);
                                  setMessages(prev => prev.map((msg, idx) => idx === i ? { ...msg, orderDraft: undefined } : msg));
                                }}
                                className='py-2 px-3 rounded-xl border border-border hover:bg-muted text-xs text-muted-foreground font-bold transition-all'
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Order Confirmed Badge */}
                        {m.orderDraft && m.orderDraft.confirmed && (
                          <div className='mt-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2'>
                            <div className='flex items-center gap-2 text-emerald-500'>
                              <CheckCircle2 size={16} />
                              <span className='text-xs font-bold'>Order #{m.orderDraft.orderId || 'CONFIRMED'} Dispatched</span>
                            </div>
                            <button
                              onClick={() => window.dispatchEvent(new CustomEvent('orient:open-order'))}
                              className='text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-1 rounded-lg hover:bg-emerald-600 transition-all'
                            >
                              Track
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className='flex justify-start'>
                    <div className='bg-muted/70 border border-border p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-xs'>
                      <span className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce' />
                      <span className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]' />
                      <span className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]' />
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Listening Banner */}
              {isRecording && (
                <div className='px-4 py-2 bg-red-500/15 border-t border-red-500/20 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='w-2 h-2 rounded-full bg-red-500 animate-ping' />
                    <span className='text-xs font-bold text-red-500 tracking-wide'>Listening to your voice... Speak now</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (recognitionRef.current) recognitionRef.current.stop();
                      setIsRecording(false);
                    }}
                    className='text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground'
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Attached Images Preview */}
              {attachedImages.length > 0 && (
                <div className='px-4 py-2 flex gap-1.5 overflow-x-auto bg-muted/30 border-t border-border scrollbar-hide'>
                  {attachedImages.map((img, idx) => (
                    <div key={idx} className='relative flex-shrink-0 group'>
                      <img src={img} className='w-10 h-10 rounded-lg object-cover border border-border' alt='Preview' referrerPolicy='no-referrer' />
                      <button 
                        onClick={() => setAttachedImages(prev => prev.filter((_, i) => i !== idx))}
                        className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm scale-75'
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className='p-3.5 pt-1.5 bg-surface/50 border-t border-border'>
                <div className='flex items-center gap-1.5 bg-muted/60 rounded-xl border border-border px-3 py-2 focus-within:border-primary/50 transition-all relative'>
                  <input 
                    type='file' 
                    ref={fileInputRef} 
                    className='hidden' 
                    accept='image/*' 
                    multiple 
                    onChange={handleImageUpload} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className='p-1.5 text-muted-foreground hover:text-primary transition-colors hover:bg-background/50 rounded-lg'
                    title='Attach image'
                  >
                    <Paperclip size={16} />
                  </button>
                  <button 
                    onClick={startVoiceInput}
                    className={`p-1.5 transition-all rounded-lg ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-muted-foreground hover:text-primary hover:bg-background/50'}`}
                    title='Talk to AURA (Voice input)'
                  >
                    <Mic size={16} />
                  </button>
                  <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                    placeholder={isRecording ? 'Listening...' : 'Type or speak to order...'} 
                    className='bg-transparent border-none focus:ring-0 text-foreground text-xs flex-1 placeholder:text-muted-foreground font-medium py-1 focus:outline-none' 
                  />
                  <button 
                    onClick={() => handleSend()} 
                    disabled={!input.trim() && attachedImages.length === 0}
                    className='w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 disabled:hover:bg-primary shadow-xs'
                  >
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setIsOpen(true)} 
            className='w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 overflow-hidden relative shadow-[0_15px_45px_rgba(242,158,13,0.35)] text-stone-900 bg-primary group'
          >
            <motion.div key='bot' initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className='flex flex-col items-center text-primary-foreground'>
              <Sparkles size={24} className='group-hover:rotate-12 transition-transform duration-300' />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export function useHomeSnapScroll({
  currentView,
  setCurrentSectionIndex,
  setScrollDirection,
  setScrolled,
}: {
  currentView: string;
  setCurrentSectionIndex: (fn: ((prev: number) => number) | number) => void;
  setScrollDirection: (d: 'up' | 'down') => void;
  setScrolled: (v: boolean) => void;
}) {
  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    if (!container || currentView !== 'home') return;

    const sectionCount = 13;
    let isSnapping = false;
    let activeAnimation: { stop: () => void } | null = null;
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollTop = container.scrollTop;
    let wheelAccumulator = 0;
    let lastWheelTime = Date.now();
    let touchStartY = 0;
    let touchAccumulator = 0;
    let lastTouchTime = Date.now();
    let targetSection = Math.round(container.scrollTop / window.innerHeight);
    let consecutiveRapidEvents = 0;

    // Momentum state
    let momentumVelocity = 0;
    let momentumRaf: number | null = null;
    const FRICTION = 0.86;
    const MIN_VELOCITY = 1.0;
    const MAX_VELOCITY = 55;

    const stopMomentum = () => {
      if (momentumRaf !== null) {
        cancelAnimationFrame(momentumRaf);
        momentumRaf = null;
      }
      momentumVelocity = 0;
    };

    const stopActiveAnimation = () => {
      if (activeAnimation) {
        activeAnimation.stop();
        activeAnimation = null;
      }
      isSnapping = false;
    };

    const snapToIndex = (index: number, duration = 1.8) => {
      stopMomentum();
      stopActiveAnimation();
      targetSection = Math.max(0, Math.min(sectionCount - 1, index));
      isSnapping = true;
      setCurrentSectionIndex(targetSection);

      activeAnimation = animate(container.scrollTop, targetSection * window.innerHeight, {
        duration,
        ease: [0.25, 1, 0.35, 1],
        onUpdate: (v) => {
          container.scrollTop = v;
        },
        onComplete: () => {
          activeAnimation = null;
          setTimeout(() => {
            isSnapping = false;
          }, 120);
        },
      });
    };

    const runMomentum = () => {
      if (Math.abs(momentumVelocity) < MIN_VELOCITY) {
        momentumRaf = null;
        const currentRaw = container.scrollTop / window.innerHeight;
        const isInsideFooter = currentRaw >= 11.85;

        if (!isInsideFooter && Math.abs(currentRaw - Math.round(currentRaw)) > 0.03) {
          const dir = momentumVelocity >= 0 ? 'down' : 'up';
          const snapTarget = dir === 'down' ? Math.ceil(currentRaw) : Math.floor(currentRaw);
          setScrollDirection(dir);
          snapToIndex(Math.max(0, Math.min(sectionCount - 1, snapTarget)), 1.2);
        } else {
          momentumVelocity = 0;
        }
        return;
      }

      const currentRaw = container.scrollTop / window.innerHeight;
      if (currentRaw >= 11.95 && momentumVelocity > 0) {
        momentumRaf = null;
        momentumVelocity = 0;
        return;
      }

      container.scrollTop += momentumVelocity;
      momentumVelocity *= FRICTION;
      momentumRaf = requestAnimationFrame(runMomentum);
    };

    const addMomentum = (delta: number) => {
      stopActiveAnimation();
      momentumVelocity += delta;
      momentumVelocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, momentumVelocity));
      if (momentumRaf === null) {
        momentumRaf = requestAnimationFrame(runMomentum);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (currentView !== 'home') return;

      const windowHeight = window.innerHeight;
      const rawIndex = container.scrollTop / windowHeight;
      const currentIndex = Math.round(rawIndex);

      if (rawIndex >= 11.95) {
        if (e.deltaY > 0) return;
        if (e.deltaY < 0 && rawIndex > 12.05) return;
      }

      const now = Date.now();
      const dt = Math.max(1, now - lastWheelTime);
      lastWheelTime = now;

      if (dt > 180) {
        wheelAccumulator = 0;
        consecutiveRapidEvents = 0;
      } else {
        consecutiveRapidEvents++;
      }
      wheelAccumulator += e.deltaY;

      const isSustainedFastScroll = consecutiveRapidEvents >= 5 && Math.abs(wheelAccumulator) > 320;

      if (isSustainedFastScroll || momentumRaf !== null) {
        e.preventDefault();
        wheelAccumulator = 0;
        addMomentum(e.deltaY * 0.28);
        return;
      }

      if (isSnapping) {
        e.preventDefault();
        return;
      }

      const FLICK_THRESHOLD = 2;
      if (Math.abs(wheelAccumulator) >= FLICK_THRESHOLD) {
        e.preventDefault();
        const direction = wheelAccumulator > 0 ? 1 : -1;
        wheelAccumulator = 0;

        let nextIndex = (isSnapping ? targetSection : currentIndex) + direction;
        nextIndex = Math.max(0, Math.min(sectionCount - 1, nextIndex));

        setScrollDirection(direction > 0 ? 'down' : 'up');
        snapToIndex(nextIndex, 1.8);
      } else {
        e.preventDefault();
      }
    };

    const handleScroll = () => {
      if (currentView !== 'home') return;

      const currentScrollTop = container.scrollTop;
      setScrolled(currentScrollTop > 0);
      const direction = currentScrollTop > lastScrollTop ? 'down' : 'up';
      lastScrollTop = currentScrollTop;

      const windowHeight = window.innerHeight;
      const rawIndex = currentScrollTop / windowHeight;
      const closestIndex = Math.round(rawIndex);

      setCurrentSectionIndex((prev) => {
        if (prev !== closestIndex) {
          setScrollDirection(direction);
          return closestIndex;
        }
        return prev;
      });

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (currentView === 'home' && momentumRaf === null && !isSnapping) {
          const currentRaw = container.scrollTop / window.innerHeight;
          const isPerfectlyAligned = Math.abs(currentRaw - Math.round(currentRaw)) < 0.03;
          const isInsideFooter = currentRaw >= 11.85;

          if (!isPerfectlyAligned && !isInsideFooter) {
            let target = Math.round(currentRaw);
            if (direction === 'down') {
              target = Math.ceil(currentRaw);
            } else if (direction === 'up') {
              target = Math.floor(currentRaw);
            }
            target = Math.max(0, Math.min(sectionCount - 1, target));
            setScrollDirection(direction);
            snapToIndex(target, 1.4);
          }
        }
      }, 320);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchAccumulator = 0;
      lastTouchTime = Date.now();
      consecutiveRapidEvents = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (currentView !== 'home') return;

      const windowHeight = window.innerHeight;
      const rawIndex = container.scrollTop / windowHeight;
      const currentIndex = Math.round(rawIndex);

      if (rawIndex >= 11.95) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      const now = Date.now();
      const dt = Math.max(1, now - lastTouchTime);
      lastTouchTime = now;
      touchStartY = currentY;

      if (dt > 180) {
        touchAccumulator = 0;
      }
      touchAccumulator += deltaY;

      const isSustainedFastTouch = Math.abs(touchAccumulator) > 280;

      if (isSustainedFastTouch || momentumRaf !== null) {
        e.preventDefault();
        touchAccumulator = 0;
        addMomentum(deltaY * 0.38);
        return;
      }

      if (isSnapping) {
        e.preventDefault();
        return;
      }

      const FLICK_THRESHOLD = 1;
      if (Math.abs(touchAccumulator) >= FLICK_THRESHOLD) {
        e.preventDefault();
        const direction = touchAccumulator > 0 ? 1 : -1;
        touchAccumulator = 0;

        let nextIndex = (isSnapping ? targetSection : currentIndex) + direction;
        nextIndex = Math.max(0, Math.min(sectionCount - 1, nextIndex));

        setScrollDirection(direction > 0 ? 'down' : 'up');
        snapToIndex(nextIndex, 1.8);
      } else {
        e.preventDefault();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      stopMomentum();
      stopActiveAnimation();
    };
  }, [currentView]);
}

const App: React.FC = () => {
 const scrollContainerRef = useRef<HTMLDivElement>(null);
 const [scrolled, setScrolled] = useState(false);
 const [navHidden, setNavHidden] = useState(false);
 const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
 const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
 const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
 const lastScrollY = React.useRef(0);
 const isScrolling = React.useRef(false);
 const wheelAccumulator = React.useRef(0);
 const lastWheelTime = React.useRef(0);
 const touchAccumulator = React.useRef(0);
 const lastTouchY = React.useRef(0);
 const [isMobile, setIsMobile] = useState(false);
 const [isLoading, setIsLoading] = useState(true);
 const [currentView, setCurrentView] = useState<'home' | 'login' | 'admin' | 'dashboard' | 'bakery' | 'supermarket' | 'dining' | 'games' | 'water' | 'lounge' | 'about'>('home');
 const [bakeryView, setBakeryView] = useState<'home' | 'menu' | 'architect' | 'wholesale' | 'story'>('home');
 const [supermarketPage, setSupermarketPage] = useState<SupermarketPage>('Home');
 const [isSmartPasteOpen, setIsSmartPasteOpen] = useState(false);
 const [diningView, setDiningView] = useState<DiningView>('menu');
 const [gamesPage, setGamesPage] = useState<GamesPage>(GamesPage.LANDING);
 const [cmsContent, setCmsContent] = useState<any>({});
 const [isGlobalOrderOpen, setIsGlobalOrderOpen] = useState(false);

 useEffect(() => {
   const handleDiningNav = (e: any) => {
     const id = e.detail?.sectionId;
     if (id === 'dining-reservations' || id === 'dining-floor-plan') {
       setDiningView('reservations');
     } else if (id === 'dining-delivery') {
       setDiningView('delivery');
     } else if (id === 'dining-about') {
       setDiningView('about');
     } else if (id === 'dining-dashboard') {
 setCurrentView('dashboard');
     } else {
       setDiningView('menu');
     }
   };
   window.addEventListener('orient:navigate-dining', handleDiningNav);
   return () => window.removeEventListener('orient:navigate-dining', handleDiningNav);
 }, []);

 // Global kitchen order timer & 10-minute warning dispatch
 useOrderTimerManager();

 useEffect(() => {
   const handleOpenOrder = () => setIsGlobalOrderOpen(true);
   window.addEventListener('orient:open-order', handleOpenOrder);
   return () => window.removeEventListener('orient:open-order', handleOpenOrder);
 }, []);

  // --- CMS Content Sync ---
  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const { contentBlocks } = await cmsApi.getAllContentBlocks();
        const globalBlocks = contentBlocks.filter(b => b.division_id === 'global');
        const compiled: any = {};
        globalBlocks.forEach(block => {
          compiled[block.block_type] = block.content_payload;
        });
        setCmsContent(compiled);
      } catch (error) {
        console.error("CMS Sync Error:", error);
      }
    };
    fetchCMS();
  }, [currentView]);
 const [waterPage, setWaterPage] = useState<WaterPage>('home');
 const [loungePage, setLoungePage] = useState<LoungePage>('home');
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const hasPlayedInitialAnimation = React.useRef(false);
 const sectionCount = 13; // Total sections in home view

 useEffect(() => {
 const timer = setTimeout(() => {
 setIsLoading(false);
 setTimeout(() => {
 hasPlayedInitialAnimation.current = true;
 }, 6000);
 }, 4000);
 return () => clearTimeout(timer);
 }, []);

 useEffect(() => {
 if (currentView !== 'home') {
 hasPlayedInitialAnimation.current = true;
 }
 }, [currentView]);

 useEffect(() => {
   const handleResize = () => {
     hasPlayedInitialAnimation.current = true;
   };
   window.addEventListener('resize', handleResize);
   return () => window.removeEventListener('resize', handleResize);
 }, []);

  useEffect(() => {
    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCurrentView(customEvent.detail);
        const container = document.getElementById('main-scroll-container');
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('orient:navigate', handleCustomNav);
    return () => window.removeEventListener('orient:navigate', handleCustomNav);
  }, []);

 // --- NATIVE SCROLL SNAPPING LOGIC (For non-home pages) ---
 useEffect(() => {
 const container = document.getElementById('main-scroll-container');
 if (!container || currentView === 'home') return;

 const handleNativeScroll = () => {
 if (!container) return;
 const currentScrollY = container.scrollTop;
 setScrolled(currentScrollY > 0);
 
 if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
 setScrollDirection('down');
 setNavHidden(true);
 } else {
 setScrollDirection('up');
 setNavHidden(false);
 }
 lastScrollY.current = currentScrollY;
 };

 container.addEventListener('scroll', handleNativeScroll, { passive: true });
 return () => container.removeEventListener('scroll', handleNativeScroll);
 }, [currentView]);

  // --- CUSTOM SNAP SCROLL LOGIC (Momentum engine for home page) ---
  useHomeSnapScroll({
    currentView,
    setCurrentSectionIndex,
    setScrollDirection,
    setScrolled,
  });

  useEffect(() => {
 if (currentView !== 'home') {
 setScrolled(false);
 setNavHidden(false);
 lastScrollY.current = 0;
 const container = document.getElementById('main-scroll-container');
 if (container) container.scrollTop = 0;
 }
 }, [currentView]);

 useEffect(() => {
 if (currentView === 'home') {
 
 setNavHidden(scrollDirection === 'down' && currentSectionIndex > 0);
 }
 }, [currentSectionIndex, scrollDirection, currentView]);

 const handleLogin = () => {
 setIsAuthenticated(true);
 setCurrentView('admin');
 };

 const handleLogout = () => {
 setIsAuthenticated(false);
 setCurrentView('home');
 };

 const getAmbientColor = () => {
 switch(currentView) {
 case 'bakery': return 'bg-amber-500';
 case 'supermarket': return 'bg-emerald-500';
 case 'dining': return 'bg-rose-600';
 case 'games': return 'bg-cyan-500';
 case 'water': return 'bg-sky-500';
 case 'lounge': return 'bg-yellow-600';
 default: return 'bg-primary';
 }
 };

 return (
 <ThemeProvider>
 <>
 <AnimatePresence>
 {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
 </AnimatePresence>
 {/* Outer wrapper requires h-[100dvh] and overflow-hidden for the snap container to work securely */}
 <div className="bg-card transition-colors duration-[1500ms] ease-in-out text-foreground selection:bg-primary selection:text-foreground relative z-10 h-[100dvh] overflow-hidden">
 
 {/* Main Scroll Container */}
 <div ref={scrollContainerRef} className={`fixed inset-0 w-full h-full bg-transparent overflow-y-auto no-scrollbar`} id="main-scroll-container">
 <ScrollContext.Provider value={{ scrollContainerRef, activeSectionId, setActiveSectionId, currentSectionIndex, setCurrentSectionIndex, scrollDirection, setScrollDirection }}>
 {currentView === 'home' && (
 <>
 <Navbar setCurrentView={setCurrentView} scrolled={scrolled} navHidden={navHidden} isReady={!isLoading} skipAnimation={hasPlayedInitialAnimation.current} setCurrentSectionIndex={setCurrentSectionIndex} currentSectionIndex={currentSectionIndex} pageType="hero" heroId="hero" setDiningView={setDiningView} />
 <div className="relative w-full">
 <SectionWrapper id="hero" index={0} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <Hero isReady={!isLoading} isActive={currentSectionIndex === 0} skipAnimation={hasPlayedInitialAnimation.current} cms={cmsContent.hero} />
 </SectionWrapper>
 
 <div className="relative z-10 bg-transparent">
 <SectionWrapper id="services" index={1} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <ServicesGrid setCurrentView={setCurrentView} />
 </SectionWrapper>
 <SectionWrapper id="trust" index={2} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <TrustSection />
 </SectionWrapper>
 <SectionWrapper id="water-deep" index={3} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <WaterDeepDive />
 </SectionWrapper>
 <SectionWrapper id="market-deep" index={4} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <MarketDeepDive />
 </SectionWrapper>
 <SectionWrapper id="bakery-deep" index={5} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <BakeryDeepDive />
 </SectionWrapper>
 <SectionWrapper id="dining-deep" index={6} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <DiningDeepDive />
 </SectionWrapper>
 <SectionWrapper id="lounge-deep" index={7} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <LoungeDeepDive />
 </SectionWrapper>
 <SectionWrapper id="games-deep" index={8} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <GamesDeepDive />
 </SectionWrapper>
 <SectionWrapper id="voices" index={9} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <VoicesOfJos />
 </SectionWrapper>
 <SectionWrapper id="location" index={10} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <LocationSection />
 </SectionWrapper>
 <SectionWrapper id="cta" index={11} className="relative w-full h-[100dvh] flex flex-col justify-center cinematic-section">
 <FinalCTA setCurrentView={setCurrentView} />
 </SectionWrapper>
 </div>

 <SectionWrapper id="footer" index={12} className="relative w-full h-auto min-h-[100dvh] flex flex-col justify-center cinematic-section">
 <Footer setCurrentView={setCurrentView} isCinematic />
 </SectionWrapper>
 
 </div>
 </>
 )}
 {(currentView === 'login' || currentView === 'admin' || currentView === 'dashboard') && (
 <StudioApp onCancel={() => setCurrentView('home')} initialRoute={currentView === 'admin' ? '/admin-login' : currentView === 'dashboard' ? '/dashboard' : '/login'} />
 )}
 {currentView === 'bakery' && (
 <div className="relative">
 <Navbar setCurrentView={setCurrentView} scrolled={scrolled} navHidden={navHidden} isSubpage skipAnimation pageType="hero" heroId="hero-bakery" setDiningView={setDiningView} />
 <div>
 <BakeryNav navHidden={navHidden} currentView={bakeryView} setView={setBakeryView} />
 <div className="pt-0 lg:pt-12">
 <BakeryApp currentView={bakeryView} />
 </div>
 <Footer setCurrentView={setCurrentView} />
 </div>
 </div>
 )}
 {currentView === 'supermarket' && (
 <div className="relative">
 <Navbar setCurrentView={setCurrentView} scrolled={scrolled} navHidden={navHidden} isSubpage skipAnimation pageType="market" setDiningView={setDiningView} />
 <div>
 <SupermarketNav navHidden={navHidden} activePage={supermarketPage} setActivePage={setSupermarketPage} setIsSmartPasteOpen={setIsSmartPasteOpen} />
 <div className="pt-0 lg:pt-12">
 <SupermarketApp activePage={supermarketPage} setActivePage={setSupermarketPage} isSmartPasteOpen={isSmartPasteOpen} setIsSmartPasteOpen={setIsSmartPasteOpen} />
 </div>
 <Footer setCurrentView={setCurrentView} />
 </div>
 </div>
 )}
 {currentView === 'dining' && (
 <div className="relative">
 <Navbar setCurrentView={setCurrentView} scrolled={scrolled} navHidden={navHidden} isSubpage skipAnimation pageType="hero" heroId="hero-dining" setDiningView={setDiningView} />
 <div>
 <DiningNav navHidden={navHidden} currentView={diningView} setView={setDiningView} />
 <div className="pt-0 lg:pt-12">
 <DiningApp currentView={diningView} setView={setDiningView} />
 </div>
 <Footer setCurrentView={setCurrentView} />
 </div>
 </div>
 )}
 {currentView === 'games' && (
 <div className="relative">
 <Navbar setCurrentView={setCurrentView} scrolled={scrolled} navHidden={navHidden} isSubpage skipAnimation pageType="games" setDiningView={setDiningView} />
 <div>
 <GamesNav navHidden={navHidden} currentPage={gamesPage} onNavigate={setGamesPage} />
 <div className="pt-0 lg:pt-12">
 <GamesApp currentPage={gamesPage} onNavigate={setGamesPage} />
 </div>
 <Footer setCurrentView={setCurrentView} />
 </div>
 </div>
 )}
 {currentView === 'water' && (
 <div className="relative">
 <Navbar setCurrentView={setCurrentView} scrolled={scrolled} navHidden={navHidden} isSubpage skipAnimation pageType="hero" heroId="hero-water" setDiningView={setDiningView} />
 <div>
 <WaterNav navHidden={navHidden} currentPage={waterPage} onNavigate={setWaterPage} />
 <div className="pt-0 lg:pt-12">
 <WaterApp currentPage={waterPage} onNavigate={setWaterPage} />
 </div>
 <Footer setCurrentView={setCurrentView} />
 </div>
 </div>
 )}
 {currentView === 'lounge' && (
 <div className="relative">
 <Navbar setCurrentView={setCurrentView} scrolled={scrolled} navHidden={navHidden} isSubpage skipAnimation pageType="hero" heroId="hero-lounge" setDiningView={setDiningView} />
 <div>
 <LoungeNav navHidden={navHidden} currentPage={loungePage} onNavigate={setLoungePage} />
 <div className="pt-0 lg:pt-12">
 <LoungeApp currentPage={loungePage} onNavigate={setLoungePage} />
 </div>
 <Footer setCurrentView={setCurrentView} />
 </div>
 </div>
 )}
 {currentView === 'about' && (
 <div className="relative">
 <Navbar setCurrentView={setCurrentView} scrolled={scrolled} navHidden={navHidden} isSubpage skipAnimation setDiningView={setDiningView} />
 <div className="pt-14 lg:pt-16">
 <About setCurrentView={setCurrentView} />
 <Footer setCurrentView={setCurrentView} />
 </div>
 </div>
 )}
 </ScrollContext.Provider>
 <ChatBot />
 <QuickOrderModal isOpen={isGlobalOrderOpen} onClose={() => setIsGlobalOrderOpen(false)} />
 </div>
 </div>
 </>
 </ThemeProvider>
 );
};

export default App;




