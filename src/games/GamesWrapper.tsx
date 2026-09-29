import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Layout, User, Map, Trophy, Cpu, Glasses, Disc } from 'lucide-react';
import { AppView } from './types';
import Landing from './components/Landing';
import Profile from './components/Profile';
import Arena from './components/Arena';
import Tournament from './components/Tournament';
import Hardware from './components/Hardware';
import { VRFrontier } from './components/VRFrontier';
import CyberOdyssey from './components/CyberOdyssey';
import { Navbar as GamesSubNav } from './components/Navbar';

// --- Immersive Navigation Components ---

const GlitchLink = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => {
 const [isHovered, setIsHovered] = useState(false);
 const [displayText, setDisplayText] = useState("BASE");
 const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
 
 useEffect(() => {
 let interval: any;
 if (isHovered) {
 let iteration = 0;
 interval = setInterval(() => {
 setDisplayText(prev => 
 "BASE".split("").map((letter, index) => {
 if (index < iteration) return "BASE"[index];
 return letters[Math.floor(Math.random() * letters.length)];
 }).join("")
 );
 if (iteration >= 4) clearInterval(interval);
 iteration += 1 / 2; // slow down slightly
 }, 50);
 } else {
 setDisplayText("BASE");
 }
 return () => clearInterval(interval);
 }, [isHovered]);

 return (
 <motion.button
 onClick={onClick}
 onHoverStart={() => setIsHovered(true)}
 onHoverEnd={() => setIsHovered(false)}
 className={`relative h-10 flex items-center justify-center overflow-hidden border transition-colors duration-200 rounded-sm
 ${isActive ? 'border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(255,106,0,0.5)]' : 'border-transparent bg-black/50 text-muted-foreground hover:border-primary/50'}
 `}
 style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
 animate={{ width: isHovered || isActive ? 100 : 40 }}
 >
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
 <AnimatePresence>
 {!isHovered && !isActive && (
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 className="absolute inset-0 flex items-center justify-center"
 >
 <Layout className="w-4 h-4" />
 </motion.div>
 )}
 </AnimatePresence>
 
 <div className="flex items-center justify-center whitespace-nowrap overflow-hidden">
 {(isHovered || isActive) && (
 <motion.span 
 initial={{ opacity: 0, x: -10 }} 
 animate={{ opacity: 1, x: 0 }}
 className="font-mono font-bold tracking-widest text-[10px] uppercase"
 >
 {displayText}
 </motion.span>
 )}
 </div>
 
 {/* Decor */}
 {isHovered && (
 <motion.div 
 className="absolute top-0 left-0 w-1 h-full bg-primary"
 animate={{ opacity: [0, 1, 0, 1, 0] }}
 transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
 />
 )}
 </motion.button>
 );
};

const ScanLink = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => {
 const [isHovered, setIsHovered] = useState(false);

 return (
 <motion.button
 onClick={onClick}
 onHoverStart={() => setIsHovered(true)}
 onHoverEnd={() => setIsHovered(false)}
 className={`relative h-10 flex items-center justify-center overflow-hidden border-l-2 transition-all rounded-sm
 ${isActive 
 ? 'border-cyan-500 border-l-cyan-500 bg-cyan-500/10 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
 : 'border-transparent border-l-white/20 bg-black/50 text-muted-foreground hover:border-cyan-500/50'}
 `}
 animate={{ width: isHovered || isActive ? 110 : 40 }}
 >
 <div className="z-10 relative flex items-center gap-2">
 <User className={`w-4 h-4 ${isHovered || isActive ? 'text-cyan-500' : 'text-muted-foreground'}`} />
 {(isHovered || isActive) && (
 <motion.span 
 initial={{ opacity: 0, filter: 'blur(4px)' }} 
 animate={{ opacity: 1, filter: 'blur(0px)' }}
 transition={{ delay: 0.1 }}
 className="font-mono text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
 >
 PROFILE
 </motion.span>
 )}
 </div>

 {/* Scanner Line */}
 {(isHovered || isActive) && (
 <motion.div 
 className="absolute top-0 bottom-0 w-[1px] bg-cyan-500 shadow-[0_0_10px_#06b6d4] z-20"
 initial={{ left: 0 }}
 animate={{ left: "100%" }}
 transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
 />
 )}
 
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
 </motion.button>
 );
};

const RadarLink = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => {
 const [isHovered, setIsHovered] = useState(false);

 return (
 <motion.button
 onClick={onClick}
 onHoverStart={() => setIsHovered(true)}
 onHoverEnd={() => setIsHovered(false)}
 className={`relative h-10 flex items-center justify-center bg-black/80 rounded-sm border
 ${isActive ? 'border-red-500/50 text-red-500 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]' : 'border-transparent text-muted-foreground hover:border-red-500/30'}
 `}
 animate={{ width: isHovered || isActive ? 100 : 40 }}
 >
 <div className="relative z-10 flex items-center gap-2">
 <Map className={`w-4 h-4 ${isHovered || isActive ? 'animate-pulse text-red-500' : ''}`} />
 {(isHovered || isActive) && (
 <motion.span 
 initial={{ opacity: 0 }}
 animate={{ opacity: [0, 1, 0, 1] }}
 transition={{ duration: 0.4, times: [0, 0.2, 0.8, 1] }}
 className="font-mono text-[10px] font-bold text-red-500 tracking-widest whitespace-nowrap"
 >
 ARENA
 </motion.span>
 )}
 </div>

 {/* Radar Sweep */}
 {(isHovered || isActive) && (
 <motion.div 
 className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(239,68,68,0.2)_90deg,transparent_90deg)]"
 animate={{ rotate: 360 }}
 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
 />
 )}
 </motion.button>
 );
};

const GoldLink = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => {
 const [isHovered, setIsHovered] = useState(false);

 return (
 <motion.button
 onClick={onClick}
 onHoverStart={() => setIsHovered(true)}
 onHoverEnd={() => setIsHovered(false)}
 className={`relative h-10 flex items-center justify-center overflow-hidden rounded-sm border
 ${isActive ? 'border-yellow-500/50 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border-transparent text-muted-foreground hover:border-yellow-500/30'}
 `}
 style={{ 
 background: isHovered || isActive 
 ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, rgba(0,0,0,0.8) 100%)'
 : 'rgba(0,0,0,0.5)'
 }}
 animate={{ width: isHovered || isActive ? 130 : 40 }}
 >
 <div className="relative z-10 flex items-center gap-2">
 <Trophy className={`w-4 h-4 ${isHovered || isActive ? 'text-yellow-500' : 'text-muted-foreground'}`} />
 {(isHovered || isActive) && (
 <motion.span 
 initial={{ y: 10, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 className="font-mono text-[10px] font-bold text-yellow-500 tracking-widest uppercase whitespace-nowrap"
 >
 TOURNEYS
 </motion.span>
 )}
 </div>
 
 {/* Scanline overlay */}
 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDIgMkw0IDBaIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-50 pointer-events-none"></div>
 </motion.button>
 );
};

const PistonLink = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => {
 const [isHovered, setIsHovered] = useState(false);

 return (
 <motion.button
 onClick={onClick}
 onHoverStart={() => setIsHovered(true)}
 onHoverEnd={() => setIsHovered(false)}
 className={`relative h-10 flex items-center justify-center bg-[#111] border-b-2 rounded-sm
 ${isActive ? 'border-gray-400 text-background bg-[#222]' : 'border-transparent text-muted-foreground hover:border-gray-600'}
 `}
 animate={{ 
 width: isHovered || isActive ? 120 : 40,
 y: isHovered ? [0, 2, 0] : 0
 }}
 transition={{ width: { duration: 0.2 }, y: { duration: 0.1 } }}
 >
 <div className="relative z-10 flex items-center gap-2">
 <Cpu className={`w-4 h-4 ${isHovered || isActive ? 'text-background' : 'text-muted-foreground'}`} />
 {(isHovered || isActive) && (
 <motion.span 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="font-mono text-[10px] font-bold text-background/80 tracking-widest uppercase whitespace-nowrap"
 >
 HARDWARE
 </motion.span>
 )}
 </div>
 
 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]"></div>
 </motion.button>
 );
};

const WarpLink = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => {
 const [isHovered, setIsHovered] = useState(false);

 return (
 <motion.button
 onClick={onClick}
 onHoverStart={() => setIsHovered(true)}
 onHoverEnd={() => setIsHovered(false)}
 className={`relative h-10 flex items-center justify-center overflow-hidden rounded-sm border
 ${isActive ? 'bg-purple-900/30 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-black/50 border-transparent text-muted-foreground hover:border-purple-500/30'}
 `}
 animate={{ 
 width: isHovered || isActive ? 110 : 40,
 skewX: isHovered ? [0, -5, 5, 0] : 0
 }}
 transition={{ duration: 0.2 }}
 >
 <div className="relative z-10 flex items-center gap-2">
 <Glasses className={`w-4 h-4 ${isHovered || isActive ? 'text-purple-400' : 'text-muted-foreground'}`} />
 {(isHovered || isActive) && (
 <div className="relative">
 <motion.span 
 className="absolute inset-0 font-mono text-[10px] font-bold text-red-500 tracking-widest uppercase whitespace-nowrap opacity-70 mix-blend-screen"
 animate={{ x: isHovered ? [-1, 1, 0] : 0 }}
 >VR_ZONE</motion.span>
 <motion.span 
 className="absolute inset-0 font-mono text-[10px] font-bold text-cyan-500 tracking-widest uppercase whitespace-nowrap opacity-70 mix-blend-screen"
 animate={{ x: isHovered ? [1, -1, 0] : 0 }}
 >VR_ZONE</motion.span>
 <span className="relative font-mono text-[10px] font-bold text-background tracking-widest uppercase whitespace-nowrap">
 VR_ZONE
 </span>
 </div>
 )}
 </div>
 </motion.button>
 );
};

const OdysseyLink = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => {
 const [isHovered, setIsHovered] = useState(false);

 return (
 <motion.button
 onClick={onClick}
 onHoverStart={() => setIsHovered(true)}
 onHoverEnd={() => setIsHovered(false)}
 className={`relative h-10 flex items-center justify-center overflow-hidden rounded-sm border
 ${isActive ? 'bg-primary/10 border-primary/50 text-primary shadow-[0_0_15px_rgba(255,106,0,0.3)]' : 'bg-black/50 border-transparent text-muted-foreground hover:border-primary/30'}
 `}
 animate={{ 
 width: isHovered || isActive ? 110 : 40
 }}
 >
 <div className="relative z-10 flex items-center gap-2">
 <Disc className={`w-4 h-4 ${isHovered || isActive ? 'text-primary animate-spin-slow' : 'text-muted-foreground'}`} />
 {(isHovered || isActive) && (
 <motion.span 
 initial={{ opacity: 0, x: 5 }}
 animate={{ opacity: 1, x: 0 }}
 className="font-mono text-[10px] font-bold text-background tracking-[0.2em] uppercase whitespace-nowrap"
 >
 ODYSSEY
 </motion.span>
 )}
 </div>
 {isActive && (
 <motion.div 
 layoutId="odyssey-indicator"
 className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#ff6a00]"
 />
 )}
 </motion.button>
 );
};

export const GamesNav: React.FC<{ navHidden: boolean, currentPage: AppView, onNavigate: (p: AppView) => void }> = ({ navHidden, currentPage, onNavigate }) => {
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
 className={`fixed bottom-0 origin-bottom left-0 w-full z-30 lg:top-0 lg:bottom-auto bg-[#050505]/95 backdrop-blur-md border-t border-transparent h-13 lg:h-12 pointer-events-auto shadow-[0_-10px_30px_rgba(0,0,0,0.8)] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
 (navHidden || !isMobile)
 ? 'translate-y-0 scale-100 opacity-100 blur-0' 
 : 'translate-y-[-50%] scale-50 opacity-0 blur-md pointer-events-none'
 }`}
 >
 {/* Cyberpunk Top Accent Line */}
 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

 <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between px-4">
 
 {/* Logo Area */}
 <div className="hidden sm:flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate(AppView.LANDING)}>
 <div className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center rounded-sm group-hover:bg-primary/20 transition-colors relative overflow-hidden">
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
 <span className="font-mono font-bold text-primary text-sm relative z-10">OG</span>
 </div>
 <span className="font-mono font-bold text-sm tracking-widest text-background hidden sm:block">
 ORIENT<span className="text-primary">GAMES</span>
 </span>
 </div>

 {/* Navigation Links */}
 <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-card/20 [&::-webkit-scrollbar-thumb]:rounded-full [mask-image:linear-gradient(to_right,black_90%,transparent_100%)] px-2 flex-1 justify-start md:justify-center text-sm after:content-[''] after:w-4 after:shrink-0">
 <GlitchLink isActive={currentPage === AppView.LANDING} onClick={() => onNavigate(AppView.LANDING)} />
 <div className="w-[1px] h-4 bg-card/10 mx-1 shrink-0" />
 <ScanLink isActive={currentPage === AppView.PROFILE} onClick={() => onNavigate(AppView.PROFILE)} />
 <RadarLink isActive={currentPage === AppView.ARENA} onClick={() => onNavigate(AppView.ARENA)} />
 <GoldLink isActive={currentPage === AppView.TOURNAMENT} onClick={() => onNavigate(AppView.TOURNAMENT)} />
 <PistonLink isActive={currentPage === AppView.HARDWARE} onClick={() => onNavigate(AppView.HARDWARE)} />
 <WarpLink isActive={currentPage === AppView.VR} onClick={() => onNavigate(AppView.VR)} />
 <div className="w-[1px] h-4 bg-card/10 mx-1 shrink-0" />
 <OdysseyLink isActive={currentPage === AppView.ODYSSEY} onClick={() => onNavigate(AppView.ODYSSEY)} />
 </div>

 {/* Right Actions */}
 <div className="flex items-center gap-4">
 <div className="hidden md:flex flex-col items-end mr-4">
 <span className="text-[9px] font-mono text-primary uppercase tracking-widest">System Status</span>
 <span className="text-[10px] font-mono text-green-500 uppercase flex items-center gap-1">
 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
 Online
 </span>
 </div>
 
 <button 
 onClick={() => onNavigate(AppView.PROFILE)}
 className="relative px-4 py-1.5 bg-primary/10 border border-primary text-primary font-mono text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-foreground transition-all duration-300"
 style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
 >
 Login
 </button>
 </div>

 </div>
 </nav>
 );
};

export const GamesApp: React.FC<{ currentPage: AppView, onNavigate: (p: AppView) => void }> = ({ currentPage, onNavigate }) => {
 const renderView = () => {
 switch (currentPage) {
 case AppView.LANDING:
 return <Landing onChangeView={onNavigate} />;
 case AppView.PROFILE:
 return <Profile />;
 case AppView.ARENA:
 return <Arena />;
 case AppView.TOURNAMENT:
 return <Tournament />;
 case AppView.HARDWARE:
 return <Hardware />;
 case AppView.VR:
 return <VRFrontier onNavigate={onNavigate} />;
 case AppView.ODYSSEY:
 return <CyberOdyssey onBack={() => onNavigate(AppView.LANDING)} />;
 default:
 return <Landing onChangeView={onNavigate} />;
 }
 };

 return (
 <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-foreground font-sans">
 {/* Global Cyberpunk Grid Background */}
 <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none z-0"></div>
 
 <main className="relative z-10">
 <AnimatePresence mode="wait">
 <motion.div
 key={currentPage}
 initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
 animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
 exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.02 }}
 transition={{ duration: 0.4, ease: "circOut" }}
 >
 {renderView()}
 </motion.div>
 </AnimatePresence>
 </main>
 </div>
 );
};

const GamesWrapper: React.FC = () => {
 const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
 return (
 <>
 <GamesSubNav onNavigate={setCurrentView} />
 <GamesApp currentPage={currentView} onNavigate={setCurrentView} />
 </>
 );
};

export { AppView as Page } from './types';
export default GamesWrapper;