import React from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronDown, Gamepad2, Layers, Cpu, Zap, Shield, Target } from 'lucide-react';
import { AppView } from '../types';

interface LandingProps {
 onChangeView: (view: AppView) => void;
}

const Landing: React.FC<LandingProps> = ({ onChangeView }) => {
 return (
 <div className="relative font-sans">
 {/* Hero Section - High Density Cyberpunk */}
 <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
 
 {/* Dense Background Elements */}
 <div className="absolute inset-0 opacity-20">
 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse mix-blend-screen"></div>
 <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
 </div>

 {/* Grid Lines */}
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none"></div>

 {/* Floating Controller Graphic */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
 <motion.img 
 animate={{ 
 y: [0, -15, 0],
 rotate: [0, 2, -2, 0],
 scale: [1, 1.02, 1]
 }}
 transition={{ 
 duration: 8,
 repeat: Infinity,
 ease: "easeInOut"
 }}
 alt="Futuristic Controller" 
 className="w-[900px] h-auto object-contain opacity-40 mix-blend-screen filter hue-rotate-15 contrast-150 saturate-200" 
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZrD6i0FqloEUoOSiNUUybl8uwMnt1YRfyG-j7JQPdHCshNwcA6fQHd6hK501vMDiT6CfEw6i_uMLQn21ihB3YgNzWPl-nbMPfhWvtsdlMRZLbIe9XN_0qU8qZAxBGS_n6yaGkWBb_xaqYPaTAKpfge9KCsfe_jj2DgYzimezHXOTZ5bm_Qt936BEV0epBuyeSKxqd3kLeJkNeh4MrmlsL7vwGi6DX_K7BUn9KgWFcu3DtJuKlfTP59nasSivOlnSaD-7C_iJf6YZp"
 />
 </div>

 {/* HUD Elements */}
 <div className="absolute top-24 left-8 hidden lg:flex flex-col gap-2 opacity-60">
 <div className="font-mono text-[10px] text-primary tracking-widest">SYS.CORE.V2.4</div>
 <div className="w-32 h-[1px] bg-primary/50"></div>
 <div className="font-mono text-[10px] text-muted-foreground">MEM: 84% ALLOC</div>
 <div className="font-mono text-[10px] text-muted-foreground">NET: UPLINK SECURE</div>
 </div>
 
 <div className="absolute bottom-24 right-8 hidden lg:flex flex-col items-end gap-2 opacity-60">
 <div className="font-mono text-[10px] text-cyan-500 tracking-widest">TARGET.LOCK</div>
 <div className="w-32 h-[1px] bg-cyan-500/50"></div>
 <div className="flex gap-1 mt-1">
 {[...Array(5)].map((_, i) => (
 <div key={i} className="w-2 h-4 bg-cyan-500/30 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
 ))}
 </div>
 </div>

 {/* Hero Content */}
 <div className="relative z-10 text-center max-w-6xl mx-auto px-4 w-full">
 
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="inline-flex items-center gap-3 px-4 py-1.5 mb-8 bg-black/50 border border-primary/30 backdrop-blur-sm"
 style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
 >
 <span className="w-2 h-2 bg-primary animate-pulse"></span>
 <span className="font-mono text-[10px] text-primary tracking-[0.3em] uppercase">Neural Link Active</span>
 </motion.div>

 <motion.h1 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="font-mono text-6xl md:text-[9rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-600 mb-2 leading-[0.85] tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
 >
 LEVEL UP
 </motion.h1>
 
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="relative inline-block mb-12"
 >
 <h2 className="font-mono text-4xl md:text-7xl font-bold text-primary tracking-tight relative z-10">
 YOUR REALITY
 </h2>
 <div className="absolute -inset-4 bg-primary/20 blur-2xl z-0"></div>
 {/* Glitch text effect behind */}
 <h2 className="absolute top-0 left-[2px] font-mono text-4xl md:text-7xl font-bold text-cyan-500 tracking-tight z-0 opacity-50 mix-blend-screen">YOUR REALITY</h2>
 <h2 className="absolute top-0 -left-[2px] font-mono text-4xl md:text-7xl font-bold text-red-500 tracking-tight z-0 opacity-50 mix-blend-screen">YOUR REALITY</h2>
 </motion.div>
 
 <motion.p 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.4 }}
 className="text-cyan-500 font-mono text-sm md:text-base tracking-[0.3em] mb-16 uppercase opacity-80"
 >
 // System Ready // Initialize Sequence //
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.6 }}
 >
 <button 
 onClick={() => onChangeView(AppView.ODYSSEY)}
 className="group relative inline-flex items-center justify-center px-16 py-6 overflow-hidden font-mono font-bold text-foreground transition-all duration-300 bg-primary hover:bg-card"
 style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
 >
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
 <span className="relative flex items-center gap-4 text-xl tracking-[0.2em] uppercase">
 <Play className="w-6 h-6 fill-current" />
 Press Start
 </span>
 {/* Hover scanline */}
 <div className="absolute top-0 left-0 w-full h-[2px] bg-card opacity-0 group-hover:opacity-100 group-hover:animate-scanline"></div>
 </button>
 </motion.div>
 </div>

 <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
 <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll to Initialize</span>
 <ChevronDown className="animate-bounce text-primary w-4 h-4" />
 </div>
 </section>

 {/* Stats Bar - High Density Info */}
 <div className="w-full bg-[#111] border-y border-transparent py-4 overflow-hidden relative z-20">
 <div className="max-w-[1600px] mx-auto px-4 flex justify-between items-center font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
 <div className="flex items-center gap-2"><Zap className="w-3 h-3 text-yellow-500" /> Latency: 12ms</div>
 <div className="hidden md:flex items-center gap-2"><Shield className="w-3 h-3 text-cyan-500" /> Anti-Cheat: Active</div>
 <div className="flex items-center gap-2"><Target className="w-3 h-3 text-red-500" /> Players Online: 14,208</div>
 <div className="hidden sm:flex items-center gap-2"><Cpu className="w-3 h-3 text-purple-500" /> Server Load: 42%</div>
 </div>
 </div>

 {/* Features Grid - Brutalist / Cyberpunk */}
 <section className="py-32 bg-[#050505] relative border-t border-primary/10">
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
 
 <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
 
 <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-transparent pb-8">
 <div>
 <h2 className="font-mono text-4xl md:text-5xl font-bold text-background mb-2 uppercase tracking-tight">Core Modules</h2>
 <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Select your operational sector</p>
 </div>
 <div className="font-mono text-[10px] text-primary tracking-widest text-right">
 [ MODULE_COUNT: 03 ]<br/>
 [ STATUS: OPTIMAL ]
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <FeatureCard 
 title="VR IMMERSION"
 desc="Full-body haptics enabled. Step into the void."
 icon={<Layers className="w-6 h-6 text-cyan-500" />}
 img="https://lh3.googleusercontent.com/aida-public/AB6AXuCE4WCbuoUrl9ihyygcdwLIFaiB4J2no4e-n4rpfiQJPK_g5VLVldHkbEggusCRxWFS1md0TP8IX7wH3mgvKWyD6lM67qFKF5KqYIsYPnheBbkh6Ft0Ag3NP6roGGajtiTqUp3KkjnajhVv050uRAp25TKnkR0I7Y6BaFcyhc-6bzs-mFTOvmo5SVtR2kZ25m0cbPH7Sc7GbhY8R6ceAA7bzUykRKBirqKHzYu8mEYjczz2iDAMLrY3IgsDYfzQzRHJDkdMEEgX-IFA"
 onClick={() => onChangeView(AppView.VR)}
 accentColor="cyan"
 number="01"
 />
 <FeatureCard 
 title="CONSOLE BAY"
 desc="Next-gen consoles. 4K 120Hz Displays."
 icon={<Gamepad2 className="w-6 h-6 text-primary" />}
 img="https://lh3.googleusercontent.com/aida-public/AB6AXuDBLzp4VE-lcqy0kNGx0lXaxgnt72LHWtr72QGbeDr0TUVlAXAIMrVOFm7luq-PtDUntTG-1AXPZ8KmK9H1Knv6VZFqztDDM0pNvmBbn1a-rDoOdCqn__jd-aMKiYA3mnGowGdt5rHaq5Rt7f7H-XYDfLedcgr3WN3qioN5wIoHgWcdNCOhjt3v_UTFSqZMF9XQQ_EDlTSbYmAYUNd8gpDMiweQq8zOHGJN57f-KLDx5wq54Vww6Hc_-qNxPRLdh0_Y1VWQ-E9sC-PD"
 onClick={() => onChangeView(AppView.ARENA)}
 accentColor="primary"
 number="02"
 />
 <FeatureCard 
 title="HARDWARE LAB"
 desc="RTX 4090 Rigs. Zero Latency."
 icon={<Cpu className="w-6 h-6 text-purple-500" />}
 img="https://lh3.googleusercontent.com/aida-public/AB6AXuBclQ8Im1ImDIEwPdTuKMespLQVxjvhT9YhpStwrlbtEA30iZXG21L1xwpzYiRv6E_zHU5l90Fm1aBDLPdylYh1qhW7vwT19Eu8NCBFTW5wRWDaIER6DP5zgkMIsZnQ61w4tWfJ6s8Idxfq8tSnnGPFNn6fP8bt55oiL3CKiiGSiX0dlbaeNRHwh6wvULzayKqOgTjY0cUmXj6cqVghnWO_5dqfXQp0QS_OlB3-aehJxghk3ZfmNPe1q1rJJhrwb3OWaWBcRdFF9Ys2"
 onClick={() => onChangeView(AppView.HARDWARE)}
 accentColor="purple"
 number="03"
 />
 </div>
 </div>
 </section>
 </div>
 );
};

const FeatureCard = ({ title, desc, icon, img, onClick, accentColor, number }: { title: string, desc: string, icon: React.ReactNode, img: string, onClick: () => void, accentColor: string, number: string }) => {
 
 const colorMap: Record<string, string> = {
 cyan: 'border-cyan-500/50 hover:border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-cyan-500',
 primary: 'border-primary/50 hover:border-primary shadow-[0_0_15px_rgba(255,106,0,0)] hover:shadow-[0_0_20px_rgba(255,106,0,0.3)] text-primary',
 purple: 'border-purple-500/50 hover:border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-purple-500',
 };

 return (
 <motion.div 
 whileHover={{ y: -5 }}
 onClick={onClick}
 className={`group relative h-[450px] cursor-pointer border bg-[#111] transition-all duration-300 ${colorMap[accentColor].split(' text-')[0]}`}
 style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}
 >
 {/* Image Background */}
 <div className="absolute inset-0 z-0">
 <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-500 z-10"></div>
 <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-125 group-hover:grayscale-0" />
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 z-20 mix-blend-overlay"></div>
 </div>

 {/* Content */}
 <div className="absolute inset-0 z-30 flex flex-col justify-between p-6">
 {/* Top Bar */}
 <div className="flex justify-between items-start">
 <div className={`font-mono text-4xl font-black opacity-50 ${colorMap[accentColor].split(' ').pop()}`}>{number}</div>
 <div className="p-3 bg-black/80 backdrop-blur-sm border border-transparent rounded-sm">
 {icon}
 </div>
 </div>

 {/* Bottom Info */}
 <div className="bg-black/80 backdrop-blur-md border border-transparent p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}>
 <h3 className="font-mono text-2xl font-bold text-background mb-2 uppercase tracking-tight">{title}</h3>
 <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest leading-relaxed">{desc}</p>
 
 <div className="mt-6 flex items-center gap-2 font-mono text-[10px] text-background uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
 <span className="w-4 h-[1px] bg-card"></span>
 Initialize
 </div>
 </div>
 </div>

 {/* Cyberpunk Accents */}
 <div className={`absolute top-0 left-0 w-2 h-20 ${colorMap[accentColor].split(' ').pop()?.replace('text-', 'bg-')} z-40 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
 </motion.div>
 );
};

export default Landing;
