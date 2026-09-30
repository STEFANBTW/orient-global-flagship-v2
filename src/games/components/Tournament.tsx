import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Clock, Play, MessageSquare, Send, Medal, Shield, Target, Activity } from 'lucide-react';
import { cmsApi } from '@/services/cmsApi';

const Tournament: React.FC = () => {
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
 <div className="animate-pulse tracking-[0.5em] uppercase text-xs">Loading Tournament Data...</div>
 </div>
 );
 }

 const tournamentBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'tournament')?.content_payload || {
 eventName: "Warzone Wednesdays", prizePool: "100,000", teams: 32, date: "Oct 25th", time: "20:00 WAT"
 };

 return (
 <div className="min-h-screen bg-[#050505] text-white font-mono relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
 
 {/* Global CRT & Scanline Effects */}
 <div className="fixed inset-0 z-50 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]"></div>
 <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent z-50 opacity-50 animate-scanline"></div>

 {/* Sticky Command Bar */}
 <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-transparent h-16 flex items-center justify-between px-4 lg:px-8">
 <div className="flex items-center gap-4">
 <div className="w-8 h-8 bg-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
 <Trophy className="text-foreground w-4 h-4" />
 </div>
 <div>
 <h1 className="text-sm font-bold uppercase tracking-wider text-background leading-none">ORIENT<span className="text-purple-500">GAMES</span></h1>
 <p className="text-[8px] text-muted-foreground font-medium tracking-widest mt-1">SYS.TOURNAMENT // V.3.0</p>
 </div>
 </div>
 <div className="hidden md:flex items-center gap-8 text-[10px] tracking-widest uppercase">
 <a className="text-muted-foreground hover:text-purple-500 transition-colors" href="#bracket">Bracket</a>
 <a className="text-muted-foreground hover:text-purple-500 transition-colors" href="#register">Register</a>
 <a className="text-muted-foreground hover:text-purple-500 transition-colors" href="#stream">Stream</a>
 <a className="text-muted-foreground hover:text-purple-500 transition-colors" href="#fame">Hall of Fame</a>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30">
 <div className="w-1.5 h-1.5 bg-red-500 animate-pulse"></div>
 <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Now</span>
 </div>
 </div>
 </nav>

 {/* SECTION 1: LIVE BRACKET */}
 <section className="min-h-screen pt-24 pb-20 relative flex flex-col items-center justify-start overflow-hidden bg-[#0a0a0a]" id="bracket">
 
 {/* Dense Background */}
 <div className="absolute inset-0 opacity-20 pointer-events-none">
 <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
 <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
 </div>
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10 flex flex-col h-full w-full">
 
 <div className="text-center mb-12">
 <span className="inline-block py-1 px-3 bg-purple-500/10 text-purple-500 border border-purple-500/30 text-[10px] font-bold uppercase tracking-widest mb-4">{tournamentBlock.eventName} • SEASON 5</span>
 <h2 className="text-4xl md:text-6xl font-black text-background uppercase tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Elimination Protocol</h2>
 <p className="text-muted-foreground text-xs tracking-widest uppercase">Quarter Finals in Progress</p>
 </div>

 {/* SVG Bracket Container */}
 <div className="flex-grow w-full overflow-x-auto overflow-y-hidden custom-scrollbar bg-[#050505] border border-transparent p-8 relative group">
 
 <div className="min-w-[1000px] h-full flex justify-between items-center relative">
 
 {/* Quarter Finals Column */}
 <div className="flex flex-col justify-around h-full gap-16 w-64 z-10">
 {/* Match 1 */}
 <div className="bg-[#111] border border-transparent hover:border-purple-500 transition-all duration-300 p-0 overflow-hidden group cursor-pointer relative" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 
 <div className="flex justify-between items-center p-2 bg-card/5 border-b border-transparent">
 <span className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">MATCH QF-01</span>
 <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span>
 </div>
 <div className="p-4 space-y-3 relative z-10">
 <div className="flex justify-between items-center">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-[#050505] border border-transparent flex items-center justify-center overflow-hidden">
 <img className="w-full h-full object-cover grayscale contrast-125" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQFKaov3G_N_VuvIUe3hB4xqr7rjk4mI8qtbLZGbJWZyhxia47jSyRJxJ-z48CdsF6zFSm5U6_EmaaCzVBup3XQnkFzIyYnQO9bmAzDfoQO3hM8ko4cc4_f-BO_6FS33VLo9CLMFQ-TK1ZhDCrGCyqUlqN0jmyf_0B45BGtxLqkl2MIUBg5iCGM-SpDvXNx_uUr-NcMn_KW4dEda5nbNq-ZN3WNAlso1kUMd2xI8P9malbm5Uv7Rv3MKx80w2BUetBdfGGmMtk4ICt"/>
 </div>
 <span className="font-bold text-background text-xs uppercase tracking-wider group-hover:text-purple-500 transition-colors">Viper_X</span>
 </div>
 <span className="text-xl font-bold text-background">3</span>
 </div>
 <div className="flex justify-between items-center opacity-50">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-[#050505] border border-transparent flex items-center justify-center overflow-hidden">
 <img className="w-full h-full object-cover grayscale contrast-125" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbv6abQq7dt3LuFdbuNcrgNO4zaqWV2goqXMy0gPrscszyIExkVP748-_zINZZBTV5G3txOBldxf1R4UGBfvxIJulPbAbnUSnGQDaoGxu3_0mRxu5ZcfYzYVd0vKVJniNrAugPTS02ji0hWf6dPSTsbpvPsjh8IgJTGm5uorgJ4otCd1JTRwmWdcsqn8Vc9AHvnfXylohzMpMaODziEXgdyoUCcNLWJnDAXjC_ehSdAbkFZuAk3YFEz9lIzNjZtmEt1-Ly35ui9Sjp"/>
 </div>
 <span className="font-bold text-muted-foreground text-xs uppercase tracking-wider">NoobSlayer</span>
 </div>
 <span className="text-xl font-bold text-muted-foreground">1</span>
 </div>
 </div>
 </div>

 {/* Match 2 */}
 <div className="bg-[#111] border border-transparent hover:border-purple-500 transition-all duration-300 p-0 overflow-hidden group cursor-pointer opacity-70 hover:opacity-100 relative" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 
 <div className="flex justify-between items-center p-2 bg-card/5 border-b border-transparent">
 <span className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">MATCH QF-02</span>
 <span className="text-[8px] text-muted-foreground tracking-widest uppercase">ENDED</span>
 </div>
 <div className="p-4 space-y-3 relative z-10">
 <div className="flex justify-between items-center">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-500 text-[10px] font-bold">DL</div>
 <span className="font-bold text-background text-xs uppercase tracking-wider group-hover:text-purple-500 transition-colors">DriftLord</span>
 </div>
 <span className="text-xl font-bold text-background">2</span>
 </div>
 <div className="flex justify-between items-center opacity-50">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-[#050505] border border-transparent flex items-center justify-center text-muted-foreground text-[10px] font-bold">K9</div>
 <span className="font-bold text-muted-foreground text-xs uppercase tracking-wider">K9Unit</span>
 </div>
 <span className="text-xl font-bold text-muted-foreground">0</span>
 </div>
 </div>
 </div>
 </div>

 {/* Connector Lines SVG */}
 <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
 <path d="M 320,180 C 400,180 400,320 480,320" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,4" />
 <path d="M 320,530 C 400,530 400,320 480,320" fill="none" stroke="#333" strokeWidth="1" />
 <path d="M 736,320 L 800,320" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="2,2" />
 </svg>

 {/* Semi Finals Column */}
 <div className="flex flex-col justify-center h-full gap-32 w-64 z-10 pl-16">
 <div className="bg-[#111] border border-purple-500/50 p-0 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] relative" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 
 <div className="flex justify-between items-center p-2 bg-purple-500/10 border-b border-purple-500/30">
 <span className="text-[10px] text-purple-500 font-bold tracking-widest uppercase">SEMI-FINAL</span>
 <span className="text-[8px] text-red-500 font-bold animate-pulse tracking-widest uppercase">LIVE</span>
 </div>
 <div className="p-4 space-y-3 relative z-10">
 <div className="flex justify-between items-center bg-card/5 p-2 border border-transparent">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-[#050505] border border-purple-500 flex items-center justify-center overflow-hidden">
 <img className="w-full h-full object-cover grayscale contrast-125" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_wV7jhsCprrzkBxxLZQCLtVUjU_ZSe8iDOX9jnsRVAx3-rj9Nry9QDdgGelOsgWRu_wRJUQCXtz71UprShA7kNIZq7_0IeibUwPDoPS5clzsB3XdGwIE1T5R13R0NcGcAdGrTIO0zkIt-0Tav0YBcxIWVl7YNa3SfOab8THJ3x1S-OpZ2wfX7I-cIBHl8HOgNTz_ZeLRZ5yOkCG-o9MJoRvnx9ue_CNFM14wpwt_Is4tAvH_mD6Qk8cL5lF-zjBfWfffPzxzfXBIs"/>
 </div>
 <span className="font-bold text-background text-xs uppercase tracking-wider">Viper_X</span>
 </div>
 <span className="text-2xl font-bold text-purple-500">1</span>
 </div>
 <div className="flex justify-between items-center p-2 border border-transparent">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-[#050505] border border-transparent flex items-center justify-center text-muted-foreground text-[10px] font-bold">??</div>
 <span className="font-bold text-muted-foreground text-xs uppercase tracking-wider">TBD</span>
 </div>
 <span className="text-2xl font-bold text-foreground/80">0</span>
 </div>
 </div>
 </div>
 </div>

 {/* Finals Column */}
 <div className="flex flex-col justify-center h-full gap-16 w-64 z-10 pl-16 opacity-40">
 <div className="border border-dashed border-border p-8 flex flex-col items-center justify-center gap-4 text-center h-48 bg-[#111]">
 <Trophy className="w-8 h-8 text-foreground/80" />
 <div>
 <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Grand Final</h4>
 <p className="text-[8px] text-foreground/80 mt-1 uppercase tracking-widest">Awaiting Challenger</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* SECTION 2: REGISTRATION - Brutalist Form */}
 <section className="py-24 relative bg-[#050505] border-t border-transparent" id="register">
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
 
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10">
 <div className="flex flex-col lg:flex-row gap-16 items-center">
 
 <div className="w-full lg:w-1/2 space-y-10">
 <div>
 <span className="text-purple-500 text-xs tracking-widest uppercase mb-2 block">01 // UPCOMING EVENT</span>
 <h2 className="text-5xl lg:text-7xl font-black text-background uppercase leading-none tracking-tighter">{tournamentBlock.eventName}</h2>
 </div>
 
 <div className="bg-[#0a0a0a] border border-transparent p-8 relative overflow-hidden group hover:border-purple-500/50 transition-colors duration-500" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 
 <h4 className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest mb-2 relative z-10">Total Prize Pool</h4>
 <div className="text-5xl md:text-6xl font-bold text-background tracking-tighter tabular-nums flex items-baseline gap-2 relative z-10">
 <span className="text-purple-500">₦</span>{tournamentBlock.prizePool}
 <span className="text-[10px] text-muted-foreground font-normal tracking-widest uppercase ml-2">Guaranteed</span>
 </div>
 
 <div className="mt-8 flex flex-wrap gap-6 text-[10px] text-muted-foreground uppercase tracking-widest relative z-10 border-t border-transparent pt-6">
 <div className="flex items-center gap-2"><Users className="w-3 h-3 text-purple-500" /> {tournamentBlock.teams} Teams</div>
 <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-purple-500" /> {tournamentBlock.date}</div>
 <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-purple-500" /> {tournamentBlock.time}</div>
 </div>
 </div>
 </div>

 <div className="w-full lg:w-1/2">
 <div className="bg-[#0a0a0a] border border-transparent p-8 md:p-10 relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 
 <form className="relative z-10 space-y-8">
 <div className="border-b border-transparent pb-4 mb-8">
 <h3 className="text-2xl font-bold text-background uppercase tracking-tight">Join the Fight</h3>
 <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-1">Input Squad Data</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Team Name</label>
 <input className="w-full bg-[#111] border border-transparent p-3 text-white text-xs uppercase tracking-wider focus:border-purple-500 focus:outline-none transition-colors placeholder-gray-700" placeholder="e.g. Delta Squad" type="text"/>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Captain Gamertag</label>
 <input className="w-full bg-[#111] border border-transparent p-3 text-white text-xs uppercase tracking-wider focus:border-purple-500 focus:outline-none transition-colors placeholder-gray-700" placeholder="e.g. Slayer_01" type="text"/>
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
 <input className="w-full bg-[#111] border border-transparent p-3 text-white text-xs uppercase tracking-wider focus:border-purple-500 focus:outline-none transition-colors placeholder-gray-700" placeholder="captain@example.com" type="email"/>
 </div>
 
 <div className="pt-6 border-t border-transparent">
 <button className="w-full bg-purple-500 hover:bg-card text-foreground font-bold py-4 uppercase tracking-widest text-xs transition-colors" type="button" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 Deploy Squad
 </button>
 <p className="text-center text-[8px] text-foreground/80 mt-4 tracking-widest uppercase">By registering, you agree to the Arena Rules & Regulations.</p>
 </div>
 </form>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* SECTION 3: LIVE STREAM - High Density */}
 <section className="min-h-screen py-24 bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden border-t border-transparent" id="stream">
 
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row gap-px bg-card/10 border border-transparent">
 
 {/* Video Player */}
 <div className="flex-grow bg-[#050505] relative group aspect-video lg:aspect-auto min-h-[50vh]">
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-10 mix-blend-overlay pointer-events-none"></div>
 <img className="absolute inset-0 w-full h-full object-cover opacity-50 filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr2wVS3uNMEBKqkGxWX6a4hX_K37LDTBFSNDL1ZY3j0lIn5yZbaRbFzY-pFOWO7VIKnekF7XIzsdyrWRop97frzOUgBtGgA-CQYSUZlqVQwCcvkF7wmEXUSO1plO9XvnChQiAdyWvrGft-WL2aCPUuIjzNb5zYBY_yP3yERCsP4I6h0ApdpmgxoThv2lRTi7nvKxMm624cOflWJfS2r6Xb6H3WEKn1oGS6GeQt5i9vZzuvYDCcWgbqSVHa8cFb2cg8fmucilnVLsl6" alt="Stream"/>
 
 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none"></div>

 <div className="relative z-20 flex flex-col items-center justify-center h-full">
 <button className="w-20 h-20 bg-purple-500/20 border border-purple-500 backdrop-blur-sm flex items-center justify-center hover:bg-purple-500 hover:text-foreground transition-all duration-300 group-hover:scale-110" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' }}>
 <Play className="w-8 h-8 ml-1" />
 </button>
 <p className="mt-6 text-background font-bold tracking-widest uppercase text-[10px]">Live from Arena 1</p>
 </div>
 
 <div className="absolute top-6 left-6 z-20 flex gap-3">
 <span className="bg-red-500 text-foreground text-[10px] font-bold px-3 py-1 uppercase tracking-widest flex items-center gap-2">
 <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span> REC
 </span>
 <span className="bg-[#111] border border-transparent text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest flex items-center gap-2">
 <Users className="w-3 h-3" /> 12.4K
 </span>
 </div>
 </div>

 {/* Chat Sidebar */}
 <div className="w-full lg:w-96 bg-[#050505] flex flex-col h-[400px] lg:h-auto">
 <div className="p-4 border-b border-transparent bg-[#111] flex justify-between items-center">
 <h4 className="text-background font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
 <MessageSquare className="w-3 h-3 text-purple-500" /> Arena Chat
 </h4>
 <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span>
 </div>
 
 <div className="flex-grow overflow-y-auto p-4 space-y-4 text-[10px] uppercase tracking-wider custom-scrollbar">
 <div className="flex gap-3"><span className="text-purple-500 font-bold whitespace-nowrap">NeonRider:</span><span className="text-muted-foreground">That headshot was insane! 🔥</span></div>
 <div className="flex gap-3"><span className="text-cyan-500 font-bold whitespace-nowrap">Glitch_00:</span><span className="text-muted-foreground">Who is winning?</span></div>
 <div className="flex gap-3"><span className="text-yellow-500 font-bold whitespace-nowrap">SYS_BOT:</span><span className="text-foreground/80">Welcome to the stream! Follow the rules.</span></div>
 <div className="flex gap-3"><span className="text-primary font-bold whitespace-nowrap">SniperElite:</span><span className="text-muted-foreground">Lets go Orient Games!</span></div>
 <div className="flex gap-3"><span className="text-green-500 font-bold whitespace-nowrap">Viper_X:</span><span className="text-muted-foreground">GG WP</span></div>
 </div>
 
 <div className="p-4 bg-[#111] border-t border-transparent">
 <div className="relative flex gap-2">
 <input className="w-full bg-[#050505] border border-transparent p-3 text-white text-[10px] uppercase tracking-widest focus:border-purple-500 focus:outline-none placeholder-gray-700" placeholder="Input message..." type="text"/>
 <button className="bg-purple-500 hover:bg-card text-foreground px-4 flex items-center justify-center transition-colors">
 <Send className="w-3 h-3" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* SECTION 4: HALL OF FAME - Brutalist Cards */}
 <section className="py-24 bg-[#050505] border-t border-transparent relative" id="fame">
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10">
 
 <div className="mb-16">
 <span className="text-purple-500 text-xs tracking-widest uppercase mb-2 block">04 //</span>
 <h2 className="text-3xl md:text-4xl font-bold text-background uppercase tracking-tight leading-none">Hall of Fame</h2>
 <p className="text-muted-foreground font-mono text-[10px] tracking-widest mt-2 uppercase">Honoring the Champions</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
 
 {/* Card 1 */}
 <div className="group relative bg-[#0a0a0a] border border-transparent hover:border-yellow-500/50 transition-all duration-300 flex flex-col" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 <div className="h-48 relative overflow-hidden border-b border-transparent">
 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
 <img className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNQM9yzJn0BvEjpcduVlARWuf3PqOAIinggwM1aXKp39OpKqs8Pi_0m0JnQCPat9zJqy5SH-TCPA0s6el56hLxAgXCHUTUcunjUOfJJvA3TMe-XzY_73rejDeupKI5kofIwqRkaFE7hw_2IHZOUVFoLtsFIOy5LcZISg1zGtVJzfMVtkeT0bQqQ_O4wGnKgbaZMi9h_UsJrdacP7qxWFoDZTr7O2ICWCFCvQkb1YqvSGwHBuRBzNRqsAUZ7FVumpdAqzcPJ_OCw1ne" alt="Winner"/>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay z-10"></div>
 
 <div className="absolute top-4 right-4 z-20 bg-yellow-500 text-foreground text-[8px] font-bold px-2 py-1 uppercase tracking-widest flex items-center gap-1">
 <Medal className="w-3 h-3" /> 1ST
 </div>
 </div>
 
 <div className="p-6 flex-grow flex flex-col relative z-20">
 <h3 className="text-2xl font-bold text-background mb-1 uppercase tracking-tight group-hover:text-yellow-500 transition-colors">Shadow_King</h3>
 <p className="text-muted-foreground text-[10px] tracking-widest uppercase mb-6">Season 4 Champion</p>
 
 <div className="flex justify-between items-center border-t border-transparent pt-6 mt-auto">
 <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Prize Won</div>
 <div className="text-background font-bold text-lg">₦80,000</div>
 </div>
 </div>
 </div>

 {/* Card 2 */}
 <div className="group relative bg-[#0a0a0a] border border-transparent hover:border-gray-400/50 transition-all duration-300 flex flex-col" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 <div className="h-48 relative overflow-hidden border-b border-transparent">
 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
 <img className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY3GR9OuBcYRXB8E57-9BJPXNo6rfLAQx_BPK21Oe3xlcqoQNkkKCfUj-hqU0qQpuuFrzYFfLmENIkEUBJl6qTG2rG1VWEivkGKePezBEHL39MOAmDHY2NjeaqCVibfobKe06Ib--Aqo4BCgPl4N_rBXsPlrFHj1gs7MKhc0H_mEp7JduZlf_8YSbERCQbfqNdmUobuAu9UGNn7FMmcEJHj_qO62sVEwXp07q-kydrGkxBVO--ANMPG0QnFw1m_8MDZ_dEZkvbvN4J" alt="Winner"/>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay z-10"></div>
 
 <div className="absolute top-4 right-4 z-20 bg-gray-300 text-foreground text-[8px] font-bold px-2 py-1 uppercase tracking-widest flex items-center gap-1">
 <Medal className="w-3 h-3" /> 2ND
 </div>
 </div>
 
 <div className="p-6 flex-grow flex flex-col relative z-20">
 <h3 className="text-2xl font-bold text-background mb-1 uppercase tracking-tight group-hover:text-background/80 transition-colors">Pixel_Valkyrie</h3>
 <p className="text-muted-foreground text-[10px] tracking-widest uppercase mb-6">Season 4 Runner-up</p>
 
 <div className="flex justify-between items-center border-t border-transparent pt-6 mt-auto">
 <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Prize Won</div>
 <div className="text-background font-bold text-lg">₦40,000</div>
 </div>
 </div>
 </div>

 </div>
 </div>
 </section>
 </div>
 );
};

export default Tournament;
