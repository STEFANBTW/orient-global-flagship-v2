import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollContext } from '../../ScrollContext';
import { Page } from '../GamesWrapper';
import { Globe, Zap, Shield, Crosshair, Activity, Cpu } from 'lucide-react';

interface Props {
 onNavigate: (page: Page) => void;
}

export const VRFrontier: React.FC<Props> = ({ onNavigate }) => {
 const containerRef = useRef<HTMLDivElement>(null);
 const { scrollContainerRef } = React.useContext(ScrollContext);
 const { scrollYProgress } = useScroll({
 target: containerRef,
 container: scrollContainerRef || undefined,
 offset: ["start start", "end end"]
 });

 const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.5]);
 const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

 return (
 <div ref={containerRef} className="bg-[#050505] text-white font-mono min-h-screen relative overflow-x-hidden selection:bg-[#0df2f2] selection:text-foreground vr-scroll">
 
 {/* Global Effects */}
 <div className="fixed inset-0 z-0 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]"></div>

 {/* Side Progress Rail */}
 <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4 items-end pointer-events-none mix-blend-screen">
 <div className="flex items-center gap-3">
 <span className="text-[10px] font-bold tracking-widest text-[#0df2f2] uppercase">Scroll_Y</span>
 <div className="w-1 h-32 bg-card/10 relative overflow-hidden">
 <motion.div style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }} className="w-full bg-[#0df2f2] absolute top-0 left-0 shadow-[0_0_10px_#0df2f2]" />
 </div>
 </div>
 </div>

 {/* HERO: INFINITE TUNNEL */}
 <section className="relative h-screen w-full flex items-center justify-center overflow-hidden border-b border-[#0df2f2]/20">
 <div className="absolute inset-0 z-0 bg-black">
 {/* Layer 1: Moving Tunnel */}
 <motion.div 
 animate={{ 
 scale: [1, 3],
 opacity: [0, 1, 0],
 zIndex: [1, 2, 1]
 }}
 transition={{ 
 duration: 4, 
 repeat: Infinity, 
 ease: "linear",
 }}
 className="absolute inset-0 w-full h-full"
 >
 <img alt="Tunnel Layer 1" className="w-full h-full object-cover opacity-60 filter hue-rotate-180" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBscarJZ8vB1Of9-zQhPVSAqk3Sv1UNp7i6keT9Hmbu3-tE2150EpaYFr791yfvLydXOItnb-UqdQ-W3FbL9IG0isqeXWQBtzrwPZRn7DUtBOcOjcL0Y9Um2AeAGcRFPJVA1Y0d4mRfFdPEq5bKvNN6QvmhW9zhnuqwlZytkx8pNPSKQA9PIYx3I92LRfYQyWYlzJ2R-XNNv_DMlWdkoSO17PGTxa1fo15QOPvf-tKf2A63u_o6p0cw42KHSIniEGk4-s0tVHhZKA0h"/>
 </motion.div>

 {/* Layer 2: Offset Moving Tunnel */}
 <motion.div 
 animate={{ 
 scale: [1, 3],
 opacity: [0, 1, 0],
 zIndex: [1, 2, 1]
 }}
 transition={{ 
 duration: 4, 
 repeat: Infinity, 
 ease: "linear",
 delay: 2
 }}
 className="absolute inset-0 w-full h-full"
 >
 <img alt="Tunnel Layer 2" className="w-full h-full object-cover opacity-60 filter hue-rotate-180" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBscarJZ8vB1Of9-zQhPVSAqk3Sv1UNp7i6keT9Hmbu3-tE2150EpaYFr791yfvLydXOItnb-UqdQ-W3FbL9IG0isqeXWQBtzrwPZRn7DUtBOcOjcL0Y9Um2AeAGcRFPJVA1Y0d4mRfFdPEq5bKvNN6QvmhW9zhnuqwlZytkx8pNPSKQA9PIYx3I92LRfYQyWYlzJ2R-XNNv_DMlWdkoSO17PGTxa1fo15QOPvf-tKf2A63u_o6p0cw42KHSIniEGk4-s0tVHhZKA0h"/>
 </motion.div>

 {/* Vignette Overlay */}
 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_80%)] z-10"></div>
 </div>

 <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative z-20 text-center max-w-5xl px-4">
 <motion.div 
 initial={{ y: -50, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ duration: 0.8, delay: 0.5 }}
 className="mb-6 inline-flex items-center gap-2 px-4 py-2 border border-[#0df2f2]/30 bg-[#0df2f2]/10 backdrop-blur-md"
 style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
 >
 <Globe className="text-[#0df2f2] w-4 h-4 animate-spin-slow" />
 <span className="text-[#0df2f2] text-[10px] tracking-[0.3em] font-bold uppercase">Immersive Reality V.2.0</span>
 </motion.div>
 
 <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-background mb-6 uppercase tracking-tighter leading-none mix-blend-overlay opacity-90 relative">
 <span className="absolute -left-1 -top-1 text-[#ff00ff] opacity-40 animate-pulse pointer-events-none">THE FRONTIER</span>
 <span className="absolute -right-1 -bottom-1 text-[#0df2f2] opacity-40 animate-pulse pointer-events-none">THE FRONTIER</span>
 THE FRONTIER
 </h1>
 
 <motion.p 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 1, delay: 1 }}
 className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-10 uppercase tracking-widest leading-relaxed"
 >
 Step beyond the physical realm. Orient Games Arena invites you to the bleeding edge of virtual entertainment. 
 <span className="text-[#0df2f2] animate-pulse block mt-2">Prepare for initialization.</span>
 </motion.p>
 
 <motion.div 
 initial={{ y: 50, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ duration: 0.8, delay: 1.5 }}
 className="flex flex-col md:flex-row gap-6 justify-center items-center"
 >
 <button className="group relative px-12 py-5 bg-[#0df2f2] text-foreground font-black text-sm uppercase tracking-widest overflow-hidden transition-transform duration-300 hover:scale-105" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
 <span className="relative z-10 group-hover:tracking-[0.3em] transition-all duration-300">Enter Portal</span>
 <div className="absolute inset-0 bg-card opacity-0 group-hover:opacity-50 transition-opacity"></div>
 </button>
 </motion.div>
 </motion.div>

 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
 <motion.div 
 animate={{ y: [0, 10, 0] }}
 transition={{ duration: 1.5, repeat: Infinity }}
 className="text-[10px] text-[#0df2f2] tracking-[0.5em] uppercase font-bold"
 >
 Scroll to Dive
 </motion.div>
 <div className="w-[1px] h-12 bg-gradient-to-b from-[#0df2f2] to-transparent"></div>
 </div>
 </section>

 {/* Game 1: Rhythm Action */}
 <section id="games" className="relative min-h-screen w-full flex items-center border-b border-[#0df2f2]/20 overflow-hidden group bg-[#0a0a0a]">
 <div className="absolute inset-0 z-0">
 <img alt="Background Neon" className="w-full h-full object-cover opacity-20 scale-105 group-hover:scale-110 transition-transform duration-[20s] ease-linear filter hue-rotate-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo53PigyESN8SP1zrX90WU596t61CI6vbhEz6TFdTGbDD2r77350avs0BcE3NUAUT0H3ON3bWwLpB0LEcKkaIYMPg85Yam5Y6lHzXoDF8iARmDyOrWrWgjdgtjv3p9W7Q6r6P0MZHv87FbJnCzXl4AKCVOPu7DC8uw1jgVliRCO4RvgNdVAX-NW8u6uZXPRjQf5QjEX-CNdKl0PUgg2AUIa13oUg8yEKKIjj1jmt-h2USyu3PqKczUbPthgC1pCogWMfR9OJat33m-"/>
 <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent"></div>
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
 </div>
 
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
 <motion.div 
 initial={{ x: -100, opacity: 0 }}
 whileInView={{ x: 0, opacity: 1 }}
 viewport={{ once: false, margin: "-100px" }}
 transition={{ duration: 0.8 }}
 className="space-y-8"
 >
 <div className="flex items-center gap-4">
 <span className="text-8xl font-black text-[#0df2f2]/10 absolute -left-10 -top-20 select-none pointer-events-none">01</span>
 <div className="h-[1px] w-12 bg-[#0df2f2]"></div>
 <span className="text-[#0df2f2] tracking-widest text-[10px] font-bold uppercase">Rhythm Action</span>
 </div>
 <h2 className="text-5xl md:text-7xl font-black text-background uppercase leading-tight tracking-tighter">
 Lagos <br/><span className="text-transparent stroke-text" style={{ WebkitTextStroke: '2px #0df2f2' }}>Saber</span>
 </h2>
 <p className="text-muted-foreground text-xs uppercase tracking-widest max-w-md leading-relaxed">
 Slice through the beats in a futuristic world. Experience the adrenaline of music manifesting as physical objects.
 </p>
 
 {/* HUD Stats */}
 <div className="grid grid-cols-2 gap-4 max-w-md">
 <div className="bg-[#111] border border-transparent p-4 hover:border-[#0df2f2]/50 transition-colors" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="flex justify-between items-start mb-4">
 <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Intensity</span>
 <Zap className="text-[#0df2f2] w-4 h-4" />
 </div>
 <div className="w-full bg-[#050505] h-1 mb-2 overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 whileInView={{ width: "85%" }}
 transition={{ duration: 1, delay: 0.5 }}
 className="bg-[#0df2f2] h-full shadow-[0_0_10px_#0df2f2]"
 ></motion.div>
 </div>
 <span className="text-lg font-black text-background uppercase tracking-wider">HIGH</span>
 </div>
 
 <div className="bg-[#111] border border-transparent p-4 hover:border-[#0df2f2]/50 transition-colors" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="flex justify-between items-start mb-4">
 <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Comfort</span>
 <Shield className="text-green-500 w-4 h-4" />
 </div>
 <div className="text-lg font-black text-background uppercase tracking-wider mb-1">STABLE</div>
 <span className="text-[8px] text-muted-foreground uppercase tracking-widest">Minimal Motion Sickness</span>
 </div>
 </div>
 
 <button className="mt-4 px-8 py-4 border border-[#0df2f2] text-[#0df2f2] hover:bg-[#0df2f2] hover:text-foreground transition-all uppercase text-[10px] font-bold tracking-widest hover:shadow-[0_0_20px_rgba(13,242,242,0.4)]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 Launch Simulation
 </button>
 </motion.div>
 
 {/* Game Visual */}
 <motion.div 
 initial={{ x: 100, opacity: 0 }}
 whileInView={{ x: 0, opacity: 1 }}
 viewport={{ once: false, margin: "-100px" }}
 transition={{ duration: 0.8 }}
 className="relative aspect-video overflow-hidden border border-transparent shadow-2xl group-hover:shadow-[0_0_50px_rgba(13,242,242,0.2)] transition-all duration-500 bg-[#111]"
 style={{ clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)' }}
 >
 <div className="absolute inset-0 bg-[#0df2f2]/20 mix-blend-overlay z-10 pointer-events-none"></div>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 z-10 pointer-events-none mix-blend-overlay"></div>
 <img alt="Saber Game" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 filter contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoCjiYS6IdAhEPA7bgRgiHJbFEuY5O34utIcdITPs5OGgnVyV0-TH4ro3s6dZnVCi6GuIcIu8Nm_-AhE3GfZe2pRPzXFJWLefjJ4_54qvYt8atlI4hrpHppfapltnxi7LxT1Nl-wuML43S_4NcAuS7l4kzV2m6aE7G8PrElOoYn8BRlpsXSbakncw7aH1AraXSd8oRoh8LMUJfQKwgAJxMM7rSXpjbjYlKy1-T8nHVamOCLZSqdX0ti4DvfRM9TycDtbDwnlhGvYRM"/>
 
 <div className="absolute bottom-4 left-4 z-20 flex gap-2">
 <span className="px-3 py-1 bg-[#050505]/80 text-[#0df2f2] text-[10px] uppercase tracking-widest border border-[#0df2f2]/30 flex items-center gap-2">
 <span className="w-1.5 h-1.5 bg-[#0df2f2] rounded-full animate-pulse"></span> REC
 </span>
 <span className="px-3 py-1 bg-[#050505]/80 text-white text-[10px] uppercase tracking-widest border border-transparent">FOV: 110°</span>
 </div>
 </motion.div>
 </div>
 </section>

 {/* Game 2: Zombie Survival */}
 <section className="relative min-h-screen w-full flex items-center border-b border-transparent overflow-hidden group bg-[#050505]">
 <div className="absolute inset-0 z-0">
 <img alt="Background Zombie" className="w-full h-full object-cover opacity-10 saturate-0 group-hover:saturate-50 transition-all duration-[5s]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxwwDmrdzG1cqxirrtfi1Lrw5HoEhqHOm6ypblXinrT76idkQ5Fr0-FWm9U0Noowx9YAVT9yaziTYYUV4v3Ykd6GJ6mY5khMySuhIu3Ph4tVXAVbBEZHdHWFMdXBRAaf6M-AnwLielS7fdXD0dlXxQdNSWRXV988C4zLf9XZjETttluInCxcSFe3g9-SI7fpHhiSSVxsd4D3tdqUsYQKDHjlUM4qcP423fMyCe_yAGZab8K2tNi515NeelGuSuB83FVxR4rgR2mM2v"/>
 <div className="absolute inset-0 bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent"></div>
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
 </div>
 
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
 {/* Visual Left */}
 <motion.div 
 initial={{ scale: 0.8, opacity: 0 }}
 whileInView={{ scale: 1, opacity: 1 }}
 viewport={{ once: false }}
 transition={{ duration: 0.8 }}
 className="order-2 lg:order-1 relative aspect-square lg:aspect-video overflow-hidden border border-red-500/30 shadow-2xl bg-[#111]"
 style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}
 >
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 z-10 pointer-events-none mix-blend-overlay"></div>
 <div className="absolute top-4 right-4 z-20">
 <span className="animate-pulse text-red-500 font-bold text-[8px] uppercase tracking-widest border border-red-500/50 px-3 py-1 bg-[#050505]/80">WARNING: GRAPHIC CONTENT</span>
 </div>
 <img alt="Zombie Game" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 filter contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo6SbAy_quBrJUcl6xaDeIEHSeW8Bz_YyxbqixFrL7BM0LP18qmGr19HnAO5iulAlwRCCvmQn-L2SHTk7yeLC0orayoyc_ol1lGNU4S59Ipmh-feBd29Wk9GsrEY4lpMbxe_UnCga8bvpw7C-ks_8yMYeXXpSX3AaQ2HkV8wT4KfckIiDrSGLIJ9UoCOT476xuHhwew0D7FxCpkJOM2uldah2K9qg2T9U09iAwljsoOJoGw_CM5HRa3hnd4svTLhzR4XwKd1XriHp1"/>
 </motion.div>
 
 <motion.div 
 initial={{ x: 50, opacity: 0 }}
 whileInView={{ x: 0, opacity: 1 }}
 viewport={{ once: false }}
 transition={{ duration: 0.8 }}
 className="order-1 lg:order-2 space-y-8 text-right lg:text-left"
 >
 <div className="flex items-center justify-end lg:justify-start gap-4">
 <span className="text-[#0df2f2] tracking-widest text-[10px] font-bold uppercase">Survival Horror</span>
 <div className="h-[1px] w-12 bg-[#0df2f2]"></div>
 <span className="text-8xl font-black text-background/5 absolute -right-4 lg:left-auto lg:right-10 -top-20 select-none pointer-events-none">02</span>
 </div>
 <h2 className="text-5xl md:text-7xl font-black text-background uppercase leading-tight tracking-tighter">
 Sahara <br/><span className="text-transparent stroke-text" style={{ WebkitTextStroke: '2px #ef4444' }}>Heat</span>
 </h2>
 <p className="text-muted-foreground text-xs uppercase tracking-widest ml-auto lg:ml-0 max-w-md leading-relaxed">
 Survive the apocalypse under the scorching sun. Every bullet counts. Immersive haptic feedback makes every shot feel real.
 </p>
 
 {/* HUD Stats */}
 <div className="grid grid-cols-2 gap-4 max-w-md ml-auto lg:ml-0">
 <div className="bg-[#111] border border-transparent p-4 text-left hover:border-red-500/50 transition-colors" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="flex justify-between items-start mb-4">
 <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Fear Factor</span>
 <Activity className="text-red-500 w-4 h-4" />
 </div>
 <div className="w-full bg-[#050505] h-1 mb-2 overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 whileInView={{ width: "95%" }}
 transition={{ duration: 1, delay: 0.5 }}
 className="bg-red-500 h-full shadow-[0_0_10px_red]"
 ></motion.div>
 </div>
 <span className="text-lg font-black text-background uppercase tracking-wider">EXTREME</span>
 </div>
 
 <div className="bg-[#111] border border-transparent p-4 text-left hover:border-red-500/50 transition-colors" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="flex justify-between items-start mb-4">
 <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Comfort</span>
 <Shield className="text-yellow-500 w-4 h-4" />
 </div>
 <div className="text-lg font-black text-background uppercase tracking-wider mb-1">MODERATE</div>
 <span className="text-[8px] text-muted-foreground uppercase tracking-widest">Locomotion Movement</span>
 </div>
 </div>
 
 <div className="flex justify-end lg:justify-start">
 <button className="mt-4 px-8 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500 transition-all uppercase text-[10px] font-bold tracking-widest hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 Enter War Zone
 </button>
 </div>
 </motion.div>
 </div>
 </section>

 {/* Game 3: Tactical Time */}
 <section className="relative min-h-screen w-full flex items-center border-b border-[#0df2f2]/20 overflow-hidden bg-[#0a0a0a]">
 <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
 <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0df2f2]/5 to-transparent skew-x-12 transform origin-bottom pointer-events-none"></div>
 
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
 <motion.div 
 initial={{ y: 50, opacity: 0 }}
 whileInView={{ y: 0, opacity: 1 }}
 viewport={{ once: false }}
 transition={{ duration: 0.8 }}
 className="space-y-8"
 >
 <div className="flex items-center gap-4">
 <span className="text-8xl font-black text-background/5 absolute -left-10 -top-20 select-none pointer-events-none">03</span>
 <div className="h-[1px] w-12 bg-card"></div>
 <span className="text-background tracking-widest text-[10px] font-bold uppercase">Tactical Puzzle</span>
 </div>
 <h2 className="text-5xl md:text-7xl font-black text-background uppercase leading-tight tracking-tighter">
 SUPER <br/><span className="text-[#0df2f2] italic">HOT</span>
 </h2>
 <p className="text-muted-foreground text-xs uppercase tracking-widest max-w-md border-l-2 border-[#0df2f2] pl-4 leading-relaxed">
 Time moves only when you move. Blur the lines between strategy and mayhem in this stylized shooter.
 </p>
 
 <div className="flex gap-4">
 <button className="px-8 py-4 bg-card text-foreground hover:bg-[#0df2f2] transition-colors uppercase text-[10px] font-bold tracking-widest" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 Initialize
 </button>
 </div>
 </motion.div>
 
 <motion.div 
 initial={{ scale: 0.9, opacity: 0 }}
 whileInView={{ scale: 1, opacity: 1 }}
 viewport={{ once: false }}
 transition={{ duration: 0.8 }}
 className="relative aspect-video bg-card/5 border border-transparent p-4 flex items-center justify-center group"
 style={{ clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)' }}
 >
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 <div className="text-center relative z-10">
 <Crosshair className="w-16 h-16 text-background/20 mx-auto mb-4 group-hover:text-[#0df2f2] group-hover:scale-110 transition-all duration-500" />
 <div className="text-background font-black tracking-[0.5em] text-xl uppercase group-hover:text-[#0df2f2] transition-colors">Awaiting Target</div>
 </div>
 <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#0df2f2]/30 transition-colors duration-500 m-4 pointer-events-none" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}></div>
 </motion.div>
 </div>
 </section>
 </div>
 );
};

export default VRFrontier;
