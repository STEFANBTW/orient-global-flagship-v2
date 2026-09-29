import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Cpu, Zap, Crosshair, Shield, Activity, Database, Server, Radio, Target } from 'lucide-react';

const Arena: React.FC = () => {
 const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

 return (
 <div className="min-h-screen bg-[#050505] text-white font-mono relative overflow-x-hidden selection:bg-primary selection:text-white">
 
 {/* Global CRT & Scanline Effects */}
 <div className="fixed inset-0 z-50 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]"></div>
 <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-50 opacity-50 animate-scanline"></div>

 {/* HUD Header */}
 <div className="w-full z-30 bg-[#050505]/90 backdrop-blur-md border-b border-transparent sticky top-0">
 <div className="h-1 w-full bg-card/5">
 <div className="h-full bg-primary w-[35%] shadow-[0_0_10px_#ff6a00] relative">
 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-card"></div>
 </div>
 </div>
 <div className="max-w-[1920px] mx-auto px-4 py-2 flex justify-between items-center text-[10px] text-muted-foreground tracking-widest uppercase">
 <div className="flex items-center gap-4">
 <span className="text-primary font-bold">SYS.ARENA.V2</span>
 <div className="w-px h-3 bg-card/10"></div>
 <span>SEC_7G</span>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 animate-pulse"></div> UPLINK: SECURE</div>
 <div className="hidden sm:flex items-center gap-2"><Activity className="w-3 h-3 text-cyan-500" /> LAT: 12MS</div>
 </div>
 </div>
 </div>

 {/* SECTION 1: HERO - ATTRACT MODE */}
 <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#050505]">
 
 {/* Dense Background */}
 <div className="absolute inset-0 opacity-20">
 <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen"></div>
 <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
 </div>

 {/* Grid Lines */}
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none"></div>

 <div className="relative z-10 container mx-auto px-4 text-center">
 
 <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-primary/30 bg-primary/5 backdrop-blur-sm mb-8">
 <span className="w-2 h-2 bg-primary animate-pulse"></span>
 <span className="text-[10px] text-primary tracking-[0.3em] uppercase">Terminal Access Granted</span>
 </div>

 <div className="mb-12 relative">
 <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-600 tracking-tighter leading-[0.85] uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
 CONSOLE
 <br/>
 <span className="text-primary relative inline-block">
 BAY
 {/* Glitch text effect behind */}
 <span className="absolute top-0 left-[4px] text-cyan-500 opacity-50 mix-blend-screen z-[-1]">BAY</span>
 <span className="absolute top-0 -left-[4px] text-red-500 opacity-50 mix-blend-screen z-[-1]">BAY</span>
 </span>
 </h1>
 </div>

 <p className="text-muted-foreground font-mono text-xs sm:text-sm tracking-[0.4em] mb-16 max-w-2xl mx-auto uppercase">
 [ Initializing secure connection... High-performance terminals ready. ]
 </p>

 <a href="#map" className="group relative inline-flex items-center justify-center px-16 py-5 overflow-hidden font-bold text-foreground uppercase tracking-widest transition-all duration-300 bg-primary hover:bg-card" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
 <span className="relative flex items-center gap-3">
 Initialize Booking
 </span>
 <div className="absolute top-0 left-0 w-full h-[2px] bg-card opacity-0 group-hover:opacity-100 group-hover:animate-scanline"></div>
 </a>
 </div>

 <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
 <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll to Access</span>
 <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent relative overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-1/3 bg-card animate-scanline"></div>
 </div>
 </div>
 </section>

 {/* SECTION 2: LIVE SEAT MAP - Brutalist Data */}
 <section id="map" className="min-h-screen bg-[#0a0a0a] relative py-24 border-t border-transparent">
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 h-full flex flex-col">
 
 <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-transparent pb-6">
 <div>
 <span className="text-primary text-xs tracking-widest uppercase mb-2 block">01 //</span>
 <h2 className="text-3xl md:text-4xl font-bold text-background uppercase tracking-tight leading-none">Live Floor Plan</h2>
 <p className="text-muted-foreground font-mono text-[10px] tracking-widest mt-2 uppercase">Select a terminal to view specs</p>
 </div>
 
 <div className="flex gap-6 mt-6 md:mt-0 font-mono text-[10px] tracking-widest uppercase">
 <div className="flex items-center gap-2">
 <span className="w-2 h-2 bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
 <span className="text-muted-foreground">Open</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="w-2 h-2 bg-primary shadow-[0_0_8px_#ff6a00]"></span>
 <span className="text-muted-foreground">Occupied</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="w-2 h-2 bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>
 <span className="text-muted-foreground">Tournament</span>
 </div>
 </div>
 </div>

 <div className="flex-grow relative bg-[#050505] border border-transparent p-4 lg:p-8 flex items-center justify-center overflow-hidden group">
 
 {/* Decorative HUD corners */}
 <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50"></div>
 <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50"></div>
 <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50"></div>
 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50"></div>

 {/* SVG Map */}
 <div className="relative w-full h-full max-w-5xl aspect-video bg-[#0a0a0a] border border-transparent">
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
 
 <svg className="w-full h-full relative z-10" viewBox="0 0 800 450">
 
 {/* Zone A: General */}
 <g transform="translate(50, 50)">
 <text x="0" y="-15" fill="#666" fontFamily="monospace" fontSize="10" letterSpacing="2">ZONE A [STD]</text>
 <rect onClick={() => setSelectedSeat('A1')} className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/40" x="0" y="0" width="40" height="40" fill="#06b6d4" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />
 <rect onClick={() => setSelectedSeat('A2')} className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/40" x="50" y="0" width="40" height="40" fill="#06b6d4" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />
 <rect onClick={() => setSelectedSeat('A3')} className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/40" x="100" y="0" width="40" height="40" fill="#06b6d4" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />
 <rect className="cursor-not-allowed" x="150" y="0" width="40" height="40" fill="#ff6a00" fillOpacity="0.2" stroke="#ff6a00" strokeWidth="1" /> {/* Occupied */}
 
 <rect onClick={() => setSelectedSeat('A5')} className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/40" x="0" y="60" width="40" height="40" fill="#06b6d4" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />
 <rect className="cursor-not-allowed" x="50" y="60" width="40" height="40" fill="#ff6a00" fillOpacity="0.2" stroke="#ff6a00" strokeWidth="1" />
 <rect onClick={() => setSelectedSeat('A7')} className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/40" x="100" y="60" width="40" height="40" fill="#06b6d4" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />
 <rect onClick={() => setSelectedSeat('A8')} className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/40" x="150" y="60" width="40" height="40" fill="#06b6d4" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />
 </g>

 {/* Zone B: Pro */}
 <g transform="translate(50, 250)">
 <text x="0" y="-15" fill="#666" fontFamily="monospace" fontSize="10" letterSpacing="2">ZONE B [PRO]</text>
 <path d="M0,20 L20,0 L180,0 L200,20 L200,80 L180,100 L20,100 L0,80 Z" fill="none" stroke="#333" strokeDasharray="4,4" strokeWidth="1" />
 <rect onClick={() => setSelectedSeat('B1')} className="cursor-pointer transition-all duration-300 hover:fill-purple-500/40" x="25" y="25" width="40" height="40" fill="#a855f7" fillOpacity="0.1" stroke="#a855f7" strokeWidth="1" />
 <rect onClick={() => setSelectedSeat('B2')} className="cursor-pointer transition-all duration-300 hover:fill-purple-500/40" x="80" y="25" width="40" height="40" fill="#a855f7" fillOpacity="0.1" stroke="#a855f7" strokeWidth="1" />
 <rect onClick={() => setSelectedSeat('B3')} className="cursor-pointer transition-all duration-300 hover:fill-purple-500/40" x="135" y="25" width="40" height="40" fill="#a855f7" fillOpacity="0.1" stroke="#a855f7" strokeWidth="1" />
 </g>

 {/* Zone C: VR */}
 <g transform="translate(500, 50)">
 <text x="0" y="-15" fill="#666" fontFamily="monospace" fontSize="10" letterSpacing="2">ZONE C [VR/SIM]</text>
 <circle onClick={() => setSelectedSeat('VR1')} className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/40" cx="50" cy="50" r="30" fill="#06b6d4" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />
 <circle className="cursor-not-allowed" cx="150" cy="50" r="30" fill="#ff6a00" fillOpacity="0.2" stroke="#ff6a00" strokeWidth="1" />
 <rect className="cursor-not-allowed" x="20" y="120" width="160" height="80" fill="#ff6a00" fillOpacity="0.1" stroke="#ff6a00" strokeWidth="1" />
 <text x="100" y="165" textAnchor="middle" fill="#ff6a00" fontFamily="monospace" fontSize="10" letterSpacing="2">MAIN STAGE</text>
 </g>

 {/* Walkways */}
 <path d="M 300 0 L 300 450" stroke="#111" strokeWidth="40" />
 <path d="M 0 200 L 800 200" stroke="#111" strokeWidth="40" />
 </svg>

 {/* Modal */}
 <AnimatePresence>
 {selectedSeat && (
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-[#050505]/95 border border-primary/50 backdrop-blur-md p-6 z-30 shadow-[0_0_30px_rgba(255,106,0,0.2)]"
 style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
 >
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
 
 <button onClick={() => setSelectedSeat(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-background transition-colors z-10"><X size={16}/></button>
 
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-6 border-b border-transparent pb-4">
 <div>
 <span className="text-[10px] text-primary tracking-widest uppercase block mb-1">Terminal</span>
 <h3 className="text-background font-bold text-2xl uppercase tracking-tight leading-none">{selectedSeat}</h3>
 </div>
 <div className="flex flex-col items-end">
 <div className="w-2 h-2 bg-green-500 animate-pulse mb-1"></div>
 <span className="text-[8px] text-green-500 tracking-widest uppercase">Online</span>
 </div>
 </div>
 
 <div className="space-y-4 mb-6">
 <div className="flex justify-between text-xs">
 <span className="text-muted-foreground uppercase tracking-widest">Compute</span>
 <span className="text-cyan-500">RTX 4080</span>
 </div>
 <div className="flex justify-between text-xs">
 <span className="text-muted-foreground uppercase tracking-widest">Display</span>
 <span className="text-cyan-500">240Hz OLED</span>
 </div>
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-muted-foreground text-[10px] uppercase tracking-widest mb-2">Duration</label>
 <select className="w-full bg-[#111] border border-transparent text-white text-xs p-3 focus:border-primary focus:outline-none appearance-none cursor-pointer">
 <option>1 Hour (50 CR)</option>
 <option>2 Hours (90 CR)</option>
 <option>All Night (200 CR)</option>
 </select>
 </div>
 
 <div className="flex justify-between items-center text-sm border-t border-transparent pt-4 mb-6">
 <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Total</span>
 <span className="text-primary font-bold text-lg">50 CR</span>
 </div>
 
 <button className="w-full bg-primary hover:bg-card text-foreground font-bold py-3 px-4 transition-colors uppercase tracking-widest text-xs" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 Confirm Booking
 </button>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 </section>

 {/* SECTION 3: LIVE LEADERBOARD - High Density */}
 <section className="min-h-screen bg-[#050505] py-24 relative overflow-hidden border-t border-transparent">
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
 
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10">
 
 <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-transparent pb-6">
 <div>
 <span className="text-primary text-xs tracking-widest uppercase mb-2 block">02 //</span>
 <h2 className="text-3xl md:text-4xl font-bold text-background uppercase tracking-tight leading-none">Global Ranking</h2>
 <p className="text-muted-foreground font-mono text-[10px] tracking-widest mt-2 uppercase">Top Operatives</p>
 </div>
 <div className="flex gap-2 mt-6 md:mt-0">
 <button className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/50 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-foreground transition-all">Global</button>
 <button className="px-4 py-1.5 bg-card/5 text-muted-foreground border border-transparent text-[10px] font-bold uppercase tracking-widest hover:text-background transition-all">Local</button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 
 {/* Top Player Spotlight */}
 <div className="lg:col-span-4 relative bg-[#0a0a0a] border border-transparent p-8 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors">
 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
 
 <div className="relative mb-8">
 <div className="w-32 h-32 border border-primary/50 p-1 bg-[#111] transform rotate-45 overflow-hidden">
 <div className="w-full h-full transform -rotate-45 scale-150">
 <img className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" alt="Player" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGQsZcmc5M7fXh-vwRCm3suEekJQYVGf2wjmYTfNpkBSQgeSjCNRTzLMHuDBuFNPgnWE8Y3XoTB9PTMJEQoK2wRh1GO4kST4TnnoehVpX_wWhkVA2uYJf_d68PChTCKbYcCBmBw1HTHFQiK01DpKh14dZsSBOUTFLTmk-Xw3FSj11ntaQ6BWTjLYA8lr2EHgsbQREos1XnUvqbDalYcdZ5IuwNAnCJAFJNPVSoprHic_onyKLKcfeN9pk2EoCuDBOXc7UiDvfdneOS"/>
 </div>
 </div>
 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-foreground text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-black">RANK_01</div>
 </div>
 
 <h3 className="text-3xl font-black text-background mb-2 uppercase tracking-tighter">K3N_MAST3R</h3>
 <p className="text-cyan-500 text-[10px] tracking-widest mb-8 uppercase">TEKKEN 8 • 24 WINSTREAK</p>
 
 <div className="grid grid-cols-3 gap-px bg-card/10 w-full border border-transparent">
 <div className="bg-[#050505] p-4">
 <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">WINS</div>
 <div className="text-xl font-bold text-background">42</div>
 </div>
 <div className="bg-[#050505] p-4">
 <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">K/D</div>
 <div className="text-xl font-bold text-background">3.4</div>
 </div>
 <div className="bg-[#050505] p-4">
 <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">TIME</div>
 <div className="text-xl font-bold text-background">4H</div>
 </div>
 </div>
 </div>

 {/* List */}
 <div className="lg:col-span-8 bg-[#0a0a0a] border border-transparent overflow-hidden flex flex-col">
 <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 border-b border-transparent text-[10px] text-muted-foreground uppercase tracking-widest bg-[#111]">
 <span className="w-8 text-center">Rnk</span>
 <span>Operative</span>
 <span>Directive</span>
 <span className="text-right">Score</span>
 </div>
 <div className="flex-grow flex flex-col">
 <LeaderboardRow rank="02" user="Viper_X" game="COD: MW3" score="15,400" />
 <LeaderboardRow rank="03" user="NoobSlayer99" game="FIFA 24" score="12,250" />
 <LeaderboardRow rank="04" user="Ghost_Rider" game="MK1" score="9,800" />
 <LeaderboardRow rank="05" user="Jinxed_It" game="Valorant" score="8,450" />
 <LeaderboardRow rank="06" user="Cyber_Punk" game="Cyberpunk 2077" score="7,200" />
 <LeaderboardRow rank="07" user="Neon_Demon" game="Doom Eternal" score="6,800" />
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* SECTION 4: STATION SPECS - Brutalist Cards */}
 <section className="min-h-screen bg-[#050505] py-24 border-t border-transparent relative">
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
 
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10">
 
 <div className="mb-16">
 <span className="text-primary text-xs tracking-widest uppercase mb-2 block">03 //</span>
 <h2 className="text-3xl md:text-4xl font-bold text-background uppercase tracking-tight leading-none">System Loadouts</h2>
 <p className="text-muted-foreground font-mono text-[10px] tracking-widest mt-2 uppercase">Hardware Specifications</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 
 {/* Card 1 */}
 <SpecCard 
 level="01"
 title="Standard Ops"
 desc="Perfect for casual competitive gaming."
 img="https://lh3.googleusercontent.com/aida-public/AB6AXuAOW2678j0J0JnnL7v38Fm8ErPkCJfOlNmNJez-Z--1fq4dF7wThmW8G_XuVcx6X9PNDtxh1akvDIJcxkgfaQa0PNiLSPMJZsle-6OPKJFDig-O-T6PlCoDlgLhhH3xbhV9PoBXBLPl_Mf5wGLZOIIQAQzDvYZheVJKSlO33JscOYlTZoB83XkjglP1OusEitvjEvk0sRvHPQUnIC0yZfEgBtEz7xqc9h9jpeig1T1FpQmzzi5SGY2yp_JKCa0ZeshUcJFpT2DaZoHw"
 specs={[
 { icon: <Cpu className="w-3 h-3" />, text: "RTX 3060 12GB" },
 { icon: <Activity className="w-3 h-3" />, text: "165Hz Monitor" },
 { icon: <Terminal className="w-3 h-3" />, text: "Mechanical Keys" }
 ]}
 price="5,000"
 accent="cyan"
 />

 {/* Card 2 */}
 <SpecCard 
 level="02"
 title="Pro Elite"
 desc="Esports grade performance for serious players."
 img="https://lh3.googleusercontent.com/aida-public/AB6AXuDR1hx8gubt143NginHFZ6kPWm-zBTTOc6pNYR7zwB1RYCP6pzcUK0lR62aX9VJa7SBQ7KbSsw7njZLim5jUc2zyqhS_YCWjqbFFPonKbxibGXpkUs8xNUbglD1HAVnL8cgrUKd17kfO3ekTHxnJALLO15WBPEbpIaM7i0HGCx80KbLdWeomMgu9jAKibLRObhQ3sX0tCPEr4bhfohea4mvaWnoi67u0prVSBG8aa5HCihExiL3HpgNf4fOhKGhnS3y49mfmW-J5Nd2"
 specs={[
 { icon: <Cpu className="w-3 h-3" />, text: "RTX 4080 Super" },
 { icon: <Activity className="w-3 h-3" />, text: "360Hz Zowie" },
 { icon: <Radio className="w-3 h-3" />, text: "Noise Canceling" }
 ]}
 price="10,000"
 accent="primary"
 isPopular
 />

 {/* Card 3 */}
 <SpecCard 
 level="03"
 title="Sim & VR"
 desc="Full motion rigs and virtual reality bays."
 img="https://lh3.googleusercontent.com/aida-public/AB6AXuAYu-yXqgsILXPAopVpz1VvlZ7nFzpcb98g0xqcTdBouQmE_ekpiCxjY_VQIxaVBkeQVpSNiZmheldY3v3Z5YRzJpwRvyOBkbxr1uwJbyC_-BGtOCDtoRhHYKliHL-M--Lb5bCXDmvHYz7zt4orU8VVVFHgVIMtSdggIS0lxx1dUvh0aZuxgasDtqF1mIEjp8q7X_NUGFg-nxLShpSaCEQEQuLWYB3cfzBXd-Zq_OoMx1vooDnTlcFsIhUxbuU2tHBlj6AEZObr5axO"
 specs={[
 { icon: <Target className="w-3 h-3" />, text: "Quest 3 / Varjo" },
 { icon: <Zap className="w-3 h-3" />, text: "Direct Drive Sim" },
 { icon: <Crosshair className="w-3 h-3" />, text: "10x10m Space" }
 ]}
 price="15,000"
 accent="purple"
 />
 </div>
 </div>
 </section>

 {/* AI NPC ASSISTANT */}
 <div className="fixed bottom-8 right-8 z-50 flex items-end gap-4 pointer-events-none md:pointer-events-auto">
 <div className="hidden md:block bg-[#0a0a0a]/95 backdrop-blur-md border border-primary/30 p-4 max-w-xs shadow-[0_0_30px_rgba(255,106,0,0.1)] relative" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 <p className="text-background text-xs font-sans leading-relaxed relative z-10">
 <span className="text-primary font-bold font-mono uppercase tracking-widest text-[10px] block mb-1">SYS.GM //</span>
 "Need a wingman? Seat A-04 is hot right now. Or try the VR rig for some Beat Saber!"
 </p>
 <div className="mt-4 flex gap-2 relative z-10">
 <input className="w-full bg-[#111] border border-transparent text-white px-3 py-2 text-[10px] uppercase tracking-widest focus:border-primary focus:outline-none placeholder:text-muted-foreground" placeholder="Input command..." type="text"/>
 <button className="bg-primary hover:bg-card text-foreground px-3 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors">EXE</button>
 </div>
 </div>
 <div className="relative group cursor-pointer pointer-events-auto">
 <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
 <div className="w-14 h-14 bg-[#111] border border-primary flex items-center justify-center relative shadow-[0_0_15px_rgba(255,106,0,0.3)] hover:bg-primary group-hover:text-foreground transition-all duration-300" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' }}>
 <Terminal className="w-6 h-6 text-primary group-hover:text-foreground transition-colors" />
 </div>
 <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border border-black rounded-full"></div>
 </div>
 </div>
 </div>
 );
};

// Subcomponents

const LeaderboardRow = ({ rank, user, game, score }: { rank: string, user: string, game: string, score: string }) => (
 <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 border-b border-transparent text-xs items-center hover:bg-card/5 transition-colors">
 <span className="w-8 text-center text-muted-foreground font-bold">{rank}</span>
 <span className="text-background font-sans">{user}</span>
 <span className="text-muted-foreground uppercase tracking-widest text-[10px]">{game}</span>
 <span className="text-primary font-bold text-right">{score}</span>
 </div>
);

const SpecCard = ({ level, title, desc, img, specs, price, accent, isPopular }: { level: string, title: string, desc: string, img: string, specs: {icon: React.ReactNode, text: string}[], price: string, accent: 'cyan' | 'primary' | 'purple', isPopular?: boolean }) => {
 const colorMap = {
 cyan: 'border-cyan-500/30 hover:border-cyan-500 text-cyan-500 bg-cyan-500',
 primary: 'border-primary/30 hover:border-primary text-primary bg-primary',
 purple: 'border-purple-500/30 hover:border-purple-500 text-purple-500 bg-purple-500'
 };

 const colorClass = colorMap[accent];
 const borderColor = colorClass.split(' ')[0];
 const hoverBorderColor = colorClass.split(' ')[1];
 const textColor = colorClass.split(' ')[2];
 const bgColor = colorClass.split(' ')[3];

 return (
 <div className={`relative bg-[#0a0a0a] border ${borderColor} ${hoverBorderColor} transition-all duration-300 group flex flex-col`} style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 
 {isPopular && (
 <div className={`absolute top-4 right-4 z-20 ${bgColor} text-foreground text-[8px] font-bold px-2 py-1 uppercase tracking-widest`}>
 Optimal
 </div>
 )}

 <div className="h-48 relative overflow-hidden border-b border-transparent">
 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
 <img className="w-full h-full object-cover opacity-50 filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={img} alt={title}/>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay z-10"></div>
 </div>
 
 <div className="p-6 flex-grow flex flex-col relative z-20">
 <div className="flex items-center gap-2 mb-2">
 <span className={`${textColor} text-[10px] tracking-widest uppercase`}>LVL_{level}</span>
 </div>
 <h3 className="text-2xl font-bold text-background mb-2 uppercase tracking-tight">{title}</h3>
 <p className="text-muted-foreground text-xs font-sans mb-6 leading-relaxed">{desc}</p>
 
 <ul className="space-y-3 mb-8 flex-grow">
 {specs.map((spec, i) => (
 <li key={i} className="flex items-center gap-3 text-[10px] text-background/80 uppercase tracking-widest">
 <span className={textColor}>{spec.icon}</span>
 {spec.text}
 </li>
 ))}
 </ul>
 
 <div className="flex items-center justify-between border-t border-transparent pt-6 mt-auto">
 <div className="text-background font-bold text-xl">₦{price}<span className="text-[10px] text-muted-foreground font-normal ml-1 tracking-widest uppercase">/HR</span></div>
 <button className={`px-6 py-2 bg-transparent border ${borderColor} ${textColor} text-[10px] uppercase tracking-widest font-bold hover:${bgColor} hover:text-foreground transition-colors`}>
 Select
 </button>
 </div>
 </div>
 </div>
 );
};

export default Arena;
