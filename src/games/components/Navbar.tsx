import React from 'react';
import { motion } from 'framer-motion';
import { Page } from '../GamesWrapper';

interface NavbarProps {
 onNavigate: (page: Page) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
 return (
 <nav className="sticky top-20 w-full z-[50] bg-[#050505]/90 backdrop-blur-md border-b border-transparent">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-20">
 <div className="hidden sm:flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate(Page.LANDING)}>
 <span className="material-icons text-[#ff6a00] text-3xl group-hover:animate-pulse transition-all">sports_esports</span>
 <span className="font-tech font-bold text-2xl tracking-widest text-background group-hover:text-background transition-colors">ORIENT<span className="text-[#ff6a00]">GAMES</span></span>
 </div>
 <div className="hidden md:block">
 <div className="ml-10 flex items-baseline space-x-8">
 {[
 { page: Page.LANDING, label: 'Base' },
 { page: Page.VR, label: 'VR Zone' },
 { page: Page.ARENA, label: 'Console Bay' },
 { page: Page.TOURNAMENT, label: 'Tournaments' },
 { page: Page.HARDWARE, label: 'Hardware' }
 ].map((item) => (
 <button 
 key={item.label}
 onClick={() => onNavigate(item.page)} 
 className="text-background/80 hover:text-[#ff6a00] px-3 py-2 rounded-md text-sm font-medium transition-colors uppercase tracking-wider"
 >
 {item.label}
 </button>
 ))}
 </div>
 </div>
 <div>
 <motion.button 
 onClick={() => onNavigate(Page.PROFILE)}
 whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 106, 0, 0.5)" }}
 whileTap={{ scale: 0.95 }}
 className="bg-[#ff6a00]/20 border border-[#ff6a00] text-[#ff6a00] hover:text-white px-6 py-2 rounded font-tech text-sm font-bold uppercase transition-all duration-300 clip-path-hex"
 style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
 >
 Login_System
 </motion.button>
 </div>
 </div>
 </div>
 </nav>
 );
};