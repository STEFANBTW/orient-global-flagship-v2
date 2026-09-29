import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Page } from '../GamesWrapper';
import { Play, ChevronDown, ChevronRight, Crosshair, Zap, Shield, Cpu } from 'lucide-react';
import { cmsApi } from '@/services/cmsApi';

interface HomeProps {
 onNavigate: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
 const [cmsData, setCmsData] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchData = async () => {
 try {
 const data = await cmsApi.getDivisionContent('games');
 setCmsData(data);
 } catch (error) {
 console.error("Failed to fetch CMS data", error);
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, []);

 if (loading) {
 return (
 <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-[#0df2f2]">
 <div className="animate-pulse tracking-[0.5em] uppercase text-xs">Initializing System...</div>
 </div>
 );
 }

 // Extract blocks
 const heroBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'hero')?.content_payload || {
 title: "LEVEL UP", highlight: "REALITY", subtitle: "System Online // Initialize Sequence"
 };
 
 const vrBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'vr_games')?.content_payload || {
 games: []
 };

 return (
 <div className="bg-[#050505] text-white min-h-screen relative overflow-x-hidden font-mono selection:bg-[#0df2f2] selection:text-foreground">
 
 {/* Global CRT & Scanline Effects */}
 <div className="fixed inset-0 z-0 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]"></div>
 <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0df2f2] to-transparent z-50 opacity-50 animate-scanline"></div>

 {/* Hero Section */}
 <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] border-b border-[#0df2f2]/20">
 {/* Background Animations */}
 <div className="absolute inset-0 z-0">
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
 <motion.div 
 animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
 className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0df2f2]/20 rounded-full blur-[120px]"
 ></motion.div>
 <motion.div 
 animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
 className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]"
 ></motion.div>
 </div>

 {/* Floating Controller Graphic */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
 <motion.img 
 animate={{ 
 y: [-20, 20, -20],
 rotateZ: [-2, 2, -2]
 }}
 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
 alt="Controller" 
 className="w-[800px] h-auto object-contain opacity-40 mix-blend-screen filter hue-rotate-15 contrast-150 grayscale"
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZrD6i0FqloEUoOSiNUUybl8uwMnt1YRfyG-j7JQPdHCshNwcA6fQHd6hK501vMDiT6CfEw6i_uMLQn21ihB3YgNzWPl-nbMPfhWvtsdlMRZLbIe9XN_0qU8qZAxBGS_n6yaGkWBb_xaqYPaTAKpfge9KCsfe_jj2DgYzimezHXOTZ5bm_Qt936BEV0epBuyeSKxqd3kLeJkNeh4MrmlsL7vwGi6DX_K7BUn9KgWFcu3DtJuKlfTP59nasSivOlnSaD-7C_iJf6YZp"
 />
 </div>

 <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="inline-flex items-center gap-2 border border-[#0df2f2]/30 bg-[#0df2f2]/10 px-4 py-1 mb-8 backdrop-blur-sm"
 style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
 >
 <span className="w-2 h-2 bg-[#0df2f2] animate-pulse"></span>
 <span className="text-[#0df2f2] text-[10px] font-bold uppercase tracking-[0.3em]">{heroBlock.subtitle}</span>
 </motion.div>

 <motion.h1 
 initial={{ opacity: 0, y: 50 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.2 }}
 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-background mb-6 uppercase tracking-tighter leading-none mix-blend-overlay opacity-90 relative"
 >
 <span className="absolute -left-1 -top-1 text-[#ff00ff] opacity-40 animate-pulse pointer-events-none">{heroBlock.title}</span>
 <span className="absolute -right-1 -bottom-1 text-[#0df2f2] opacity-40 animate-pulse pointer-events-none">{heroBlock.title}</span>
 {heroBlock.title} <br/>
 <span className="text-transparent stroke-text relative inline-block" style={{ WebkitTextStroke: '2px #0df2f2' }}>
 {heroBlock.highlight}
 <div className="absolute inset-0 bg-[#0df2f2] mix-blend-overlay opacity-20 animate-[glitch_2s_linear_infinite]"></div>
 </span>
 </motion.h1>
 
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 1 }}
 className="flex justify-center mt-12"
 >
 <button 
 onClick={() => onNavigate(Page.VR)}
 className="group relative px-12 py-5 bg-[#0df2f2] text-foreground font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-transform duration-300 hover:scale-105"
 style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
 >
 <span className="relative z-10 flex items-center gap-3 group-hover:tracking-[0.3em] transition-all duration-300">
 <Play className="w-5 h-5 fill-black" />
 Initialize Link
 </span>
 <div className="absolute inset-0 bg-card opacity-0 group-hover:opacity-50 transition-opacity"></div>
 </button>
 </motion.div>
 </div>

 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
 <motion.div 
 animate={{ y: [0, 10, 0] }}
 transition={{ duration: 1.5, repeat: Infinity }}
 className="text-[10px] text-[#0df2f2] tracking-[0.5em] uppercase font-bold flex flex-col items-center gap-2"
 >
 Scroll to Enter
 <ChevronDown className="w-4 h-4" />
 </motion.div>
 </div>
 </section>

 {/* VR Zone */}
 <section className="py-24 bg-[#0a0a0a] relative border-b border-[#0df2f2]/20">
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none z-0"></div>
 
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10">
 <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-transparent pb-6 gap-6">
 <div>
 <div className="flex items-center gap-4 mb-2">
 <div className="w-1 h-8 bg-[#0df2f2]"></div>
 <h2 className="text-4xl md:text-6xl font-black text-background uppercase tracking-tight">VR <span className="text-[#0df2f2]">Immersion</span></h2>
 </div>
 <p className="text-muted-foreground text-xs uppercase tracking-widest ml-5">Select your dimension. Full-body haptics enabled.</p>
 </div>
 <div className="hidden md:flex items-center gap-4">
 <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Sector</span>
 <span className="text-[#0df2f2] font-black text-4xl leading-none">02</span>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {vrBlock.games.map((card: any, idx: number) => (
 <motion.div 
 key={idx}
 whileHover={{ y: -10 }}
 onClick={() => onNavigate(Page.VR)}
 className={`group relative h-[450px] bg-[#111] cursor-pointer border border-transparent hover:${card.borderColor} transition-colors duration-300 overflow-hidden`}
 style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
 >
 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10"></div>
 <img alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale contrast-125 group-hover:grayscale-0" src={card.img} />
 
 <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
 <div className={`p-2 bg-[#050505]/80 border ${card.borderColor}/50 backdrop-blur-sm`}>
 <Crosshair className={`w-5 h-5 ${card.color}`} />
 </div>
 </div>

 <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
 <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
 {card.tags.map((tag: string) => (
 <span key={tag} className={`px-2 py-1 bg-[#050505]/80 ${card.color} text-[8px] font-bold uppercase tracking-widest border ${card.borderColor}/30`}>{tag}</span>
 ))}
 </div>
 <h3 className={`text-3xl font-black text-background mb-2 uppercase tracking-tight group-hover:${card.color} transition-colors leading-none`}>{card.title}</h3>
 <p className="text-muted-foreground text-[10px] uppercase tracking-widest line-clamp-2 mb-4 leading-relaxed">{card.desc}</p>
 
 <div className="h-[2px] w-0 bg-card group-hover:w-full transition-all duration-500 ease-out mb-4"></div>
 
 <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
 <span className="text-[10px] font-bold uppercase tracking-widest text-background">System Ready</span>
 <ChevronRight className={`w-4 h-4 ${card.color}`} />
 </div>
 </div>

 {/* Scanning Effect on Hover */}
 <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
 <div className="absolute top-0 left-0 w-full h-[2px] bg-card/50 shadow-[0_0_10px_white] animate-[scanline_2s_linear_infinite]"></div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 </div>
 );
};

export default Home;
