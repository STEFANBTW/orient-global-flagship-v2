import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Monitor, HardDrive, Zap, Crosshair, Activity, Server, Shield, Terminal } from 'lucide-react';

const Hardware: React.FC = () => {
 return (
 <div className="min-h-screen bg-[#050505] text-white font-mono relative overflow-x-hidden selection:bg-[#0df2f2] selection:text-foreground md:pr-16">
 
 {/* Global CRT & Scanline Effects */}
 <div className="fixed inset-0 z-0 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]"></div>
 <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0df2f2] to-transparent z-50 opacity-50 animate-scanline"></div>

 {/* Grid Overlay Background */}
 <div 
 className="fixed inset-0 pointer-events-none z-0 opacity-20"
 style={{
 backgroundImage: "linear-gradient(to right, #0df2f2 1px, transparent 1px), linear-gradient(to bottom, #0df2f2 1px, transparent 1px)",
 backgroundSize: "40px 40px",
 maskImage: "radial-gradient(circle at center, black, transparent 80%)"
 }}
 ></div>

 {/* Sticky Nav Rail */}
 <nav className="fixed right-0 top-0 h-full w-16 hidden md:flex flex-col justify-center items-center z-50 border-l border-transparent bg-[#050505]/80 backdrop-blur-md">
 <div className="flex flex-col gap-12 text-[10px] font-bold tracking-widest text-muted-foreground rotate-180 uppercase" style={{ writingMode: 'vertical-rl' }}>
 <a className="hover:text-[#0df2f2] transition-colors flex items-center gap-2 cursor-pointer" href="#seating">
 <span className="text-[#0df2f2]">04</span> // SEAT
 </a>
 <a className="hover:text-[#0df2f2] transition-colors flex items-center gap-2 cursor-pointer" href="#screens">
 <span className="text-[#0df2f2]">03</span> // DISP
 </a>
 <a className="hover:text-[#0df2f2] transition-colors flex items-center gap-2 cursor-pointer" href="#rigs">
 <span className="text-[#0df2f2]">02</span> // RIGS
 </a>
 <a className="text-[#0df2f2] transition-colors flex items-center gap-2 cursor-pointer" href="#hero">
 <span>01</span> // HERO
 </a>
 </div>
 <div className="absolute bottom-8 w-[1px] h-24 bg-gradient-to-t from-[#0df2f2] to-transparent"></div>
 </nav>

 {/* Header / Nav Overlay */}
 <header className="fixed top-0 left-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-[#050505]/90 backdrop-blur-md border-b border-transparent pointer-events-none md:pr-16">
 <div className="flex items-center gap-3 pointer-events-auto">
 <div className="w-8 h-8 bg-[#0df2f2] flex items-center justify-center text-foreground shadow-[0_0_15px_rgba(13,242,242,0.4)]">
 <Cpu className="w-4 h-4" />
 </div>
 <div className="flex flex-col">
 <span className="text-sm font-bold tracking-widest text-background leading-none">ORIENT<span className="text-[#0df2f2]">GAMES</span></span>
 <span className="text-[8px] text-muted-foreground tracking-[0.2em] mt-1">HARDWARE LAB // V.5.0</span>
 </div>
 </div>
 <div className="hidden md:flex gap-8 text-[10px] tracking-widest font-bold text-muted-foreground uppercase">
 <span className="text-[#0df2f2] flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#0df2f2] animate-pulse"></span> SYS.STATUS: ONLINE</span>
 <span>TEMP: 32°C</span>
 <span>PING: 1MS</span>
 </div>
 <button className="pointer-events-auto bg-[#0df2f2]/10 hover:bg-[#0df2f2] text-[#0df2f2] hover:text-foreground border border-[#0df2f2] px-6 py-2 text-[10px] font-bold tracking-widest transition-all duration-300 uppercase" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 Access Terminal
 </button>
 </header>

 {/* Section 1: Hero */}
 <section className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-20 border-b border-transparent" id="hero">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#0df2f2]/5 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>
 
 <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
 <div className="lg:col-span-8">
 <div className="flex items-center gap-2 mb-6">
 <span className="h-[1px] w-12 bg-[#0df2f2]"></span>
 <span className="text-[#0df2f2] text-[10px] tracking-[0.3em] font-bold uppercase">Specification Overview v.5.0</span>
 </div>
 <motion.h1 
 initial={{ y: 20, opacity: 0 }}
 whileInView={{ y: 0, opacity: 1 }}
 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter text-background mb-8 break-words uppercase"
 >
 ZERO<br/>
 LATENCY.<br/>
 <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '2px #0df2f2' }}>8K REALITY.</span>
 </motion.h1>
 <div className="flex flex-wrap gap-8 text-sm text-muted-foreground font-mono mt-8 border-t border-transparent pt-8 max-w-2xl bg-[#111] p-6" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 <div className="flex flex-col">
 <span className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest">Render Scale</span>
 <span className="text-[#0df2f2] text-2xl font-bold">200%</span>
 </div>
 <div className="flex flex-col border-l border-transparent pl-8">
 <span className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest">Frame Rate</span>
 <span className="text-[#0df2f2] text-2xl font-bold">UNLOCKED</span>
 </div>
 <div className="flex flex-col border-l border-transparent pl-8">
 <span className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest">Input Lag</span>
 <span className="text-[#0df2f2] text-2xl font-bold">&lt;0.5ms</span>
 </div>
 </div>
 </div>

 <div className="lg:col-span-4 relative h-full min-h-[400px] flex items-center justify-center">
 {/* Abstract Tech Visual */}
 <div className="relative w-full aspect-square border border-[#0df2f2]/30 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
 <div className="absolute inset-2 border border-dashed border-[#0df2f2]/20 rounded-full"></div>
 <div className="absolute inset-8 border border-[#0df2f2]/10 rounded-full"></div>
 </div>
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-64 h-80 bg-[#0a0a0a] border border-[#0df2f2]/50 overflow-hidden relative group" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-10 pointer-events-none"></div>
 <img 
 alt="Abstract glowing circuit board pattern" 
 className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-100 transition-opacity duration-500 filter contrast-125" 
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_3MenTI34UcsY1S2iTxfSuz7KAhaqEcysu_kTcqpeRRQx8t76M7DBzxJ8u84C-LiSXBuzdgeA0ZpUqbdHb-YNFpWMtK0VBJKtz2eaXDU-IWmWSNJRDZfT3XgGfgm0iaKfglVRrP-5xPLHpyq269hciogPl4DfarpBnfgCH8Uo5v1xcmr1XB5aiOEwcFwvEUEvvwzhzXyB52l-qftY8PCoG8--1sGJur5yOIchPm1dscxD8eA2zQPoUuWK3T8Kg9e9bFkVkQJhvyxi"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
 <div className="absolute bottom-4 left-4 right-4 z-20">
 <div className="text-[10px] text-[#0df2f2] mb-1 tracking-widest uppercase">System Architecture</div>
 <div className="h-1 w-full bg-[#111] overflow-hidden">
 <div className="h-full bg-[#0df2f2] w-3/4 shadow-[0_0_10px_#0df2f2]"></div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
 <span className="text-[10px] tracking-widest text-[#0df2f2] animate-pulse uppercase">Scroll to Initialize</span>
 <div className="h-12 w-[1px] bg-gradient-to-b from-[#0df2f2] to-transparent"></div>
 </div>
 </section>

 {/* Section 2: The Rigs */}
 <section className="py-32 px-4 relative border-b border-transparent overflow-hidden bg-[#0a0a0a]" id="rigs">
 <div className="absolute top-20 right-20 text-[10px] text-foreground/80 font-mono hidden lg:block uppercase tracking-widest">
 COORD: 9.896, 8.858<br/>
 SEC: RIG_BAY_01
 </div>
 
 <div className="max-w-[1920px] mx-auto">
 <div className="flex flex-col md:flex-row justify-between items-end mb-20">
 <div>
 <span className="text-[#0df2f2] text-[10px] tracking-widest font-bold block mb-2 uppercase">02 // Hardware Configuration</span>
 <h2 className="text-5xl md:text-7xl font-black text-background uppercase tracking-tighter">The Rigs</h2>
 </div>
 <div className="flex gap-2 mt-6 md:mt-0">
 <button className="px-6 py-2 bg-[#0df2f2] text-foreground font-bold text-[10px] tracking-widest uppercase transition-colors" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>PC TIER 1</button>
 <button className="px-6 py-2 bg-[#111] border border-transparent text-muted-foreground font-bold text-[10px] tracking-widest uppercase hover:border-[#0df2f2] hover:text-[#0df2f2] transition-colors" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>PS5 PRO</button>
 <button className="px-6 py-2 bg-[#111] border border-transparent text-muted-foreground font-bold text-[10px] tracking-widest uppercase hover:border-[#0df2f2] hover:text-[#0df2f2] transition-colors" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>XBOX SX</button>
 </div>
 </div>

 <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 {/* Exploded View Visualization Area */}
 <div className="relative h-[600px] bg-[#050505] border border-transparent flex items-center justify-center p-8 group" style={{ clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 <div className="absolute top-4 left-4 text-[10px] text-muted-foreground font-mono uppercase tracking-widest">FIG 2.1 - EXPLODED VIEW</div>
 
 {/* Center Image */}
 <div className="relative z-10 w-full h-full flex items-center justify-center">
 <img 
 alt="High-end gaming PC internal components with RGB lighting" 
 className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_25px_rgba(13,242,242,0.2)] grayscale group-hover:grayscale-0 transition-all duration-700" 
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBclQ8Im1ImDIEwPdTuKMespLQVxjvhT9YhpStwrlbtEA30iZXG21L1xwpzYiRv6E_zHU5l90Fm1aBDLPdylYh1qhW7vwT19Eu8NCBFTW5wRWDaIER6DP5zgkMIsZnQ61w4tWfJ6s8Idxfq8tSnnGPFNn6fP8bt55oiL3CKiiGSiX0dlbaeNRHwh6wvULzayKqOgTjY0cUmXj6cqVghnWO_5dqfXQp0QS_OlB3-aehJxghk3ZfmNPe1q1rJJhrwb3OWaWBcRdFF9Ys2"
 />
 
 {/* Overlay Lines */}
 <div className="absolute top-1/4 right-1/4 w-32 h-[1px] bg-[#0df2f2]/50 transform rotate-[-30deg]"></div>
 <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#0df2f2] transform translate-x-1 -translate-y-1 shadow-[0_0_10px_#0df2f2]"></div>
 <div className="absolute top-[20%] right-[10%] bg-[#111] border border-[#0df2f2]/40 p-3 text-[10px] text-[#0df2f2] w-32 backdrop-blur-md uppercase tracking-widest" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
 RTX 4090 TI<br/>
 <span className="text-muted-foreground">24GB GDDR6X</span>
 </div>

 <div className="absolute bottom-1/3 left-1/4 w-24 h-[1px] bg-[#0df2f2]/50 transform rotate-[15deg]"></div>
 <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[#0df2f2] transform -translate-x-1 shadow-[0_0_10px_#0df2f2]"></div>
 <div className="absolute bottom-[25%] left-[5%] bg-[#111] border border-[#0df2f2]/40 p-3 text-[10px] text-[#0df2f2] w-32 backdrop-blur-md text-right uppercase tracking-widest" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
 LIQUID COOLING<br/>
 <span className="text-muted-foreground">Custom Loop</span>
 </div>
 </div>
 {/* Grid in card */}
 <div 
 className="absolute inset-0 opacity-10"
 style={{
 backgroundImage: "linear-gradient(to right, #0df2f2 1px, transparent 1px), linear-gradient(to bottom, #0df2f2 1px, transparent 1px)",
 backgroundSize: "20px 20px"
 }}
 ></div>
 </div>

 {/* Specs Detail */}
 <div className="space-y-8">
 <div className="border-l-2 border-[#0df2f2] pl-6 py-2 bg-gradient-to-r from-[#0df2f2]/10 to-transparent">
 <h3 className="text-3xl font-black text-background mb-2 uppercase tracking-tight">Custom "Titan" Build</h3>
 <p className="text-muted-foreground text-xs tracking-widest uppercase leading-relaxed max-w-md">
 Engineered for zero-compromise performance. Our custom loop cooling system ensures peak clock speeds are maintained indefinitely, even during 8K rendering loads.
 </p>
 </div>
 
 <div className="space-y-4">
 <SpecCard icon={<Cpu className="w-5 h-5" />} title="Processor" value="Intel Core i9-14900KS" unit="6.2" sub="GHz" />
 <SpecCard icon={<Monitor className="w-5 h-5" />} title="Graphics" value="NVIDIA RTX 4090 OC" unit="24" sub="GB" />
 <SpecCard icon={<HardDrive className="w-5 h-5" />} title="Memory" value="Corsair Dominator Platinum" unit="64" sub="GB" />
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Section 3: The Screens */}
 <section className="py-32 px-4 relative bg-[#050505] border-b border-transparent" id="screens">
 <div 
 className="absolute inset-0 opacity-10"
 style={{
 backgroundImage: "radial-gradient(#0df2f2 1px, transparent 1px)",
 backgroundSize: "20px 20px"
 }}
 ></div>
 
 <div className="max-w-[1920px] mx-auto relative z-10">
 <div className="text-center mb-16">
 <span className="text-[#0df2f2] text-[10px] tracking-[0.5em] font-bold uppercase block mb-2">03 // Display Technology</span>
 <h2 className="text-5xl md:text-7xl font-black text-background uppercase tracking-tighter">Visual Fidelity</h2>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
 <StatCard bigText="8K" title="7680 x 4320" sub="Native Resolution" desc="Four times the pixel density of standard 4K. Every texture, every particle, rendered in absolute clarity." progress={95} />
 <StatCard bigText="Hz" title="120 Hz" sub="Refresh Rate" desc="Fluid motion with zero ghosting. Competitive advantage through superior frame delivery." progress={100} />
 <StatCard bigText="ms" title="0.01 ms" sub="Response Time" desc="Instantaneous pixel transition. OLED technology eliminates motion blur entirely." progress={100} />
 </div>

 {/* Comparison Visual */}
 <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden border border-transparent group bg-[#111]" style={{ clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)' }}>
 <div className="absolute inset-0 flex">
 <div className="w-1/2 relative overflow-hidden bg-[#050505] border-r border-[#0df2f2] z-10">
 <img alt="Standard" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px] grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOgF5tPJs61i5WaTDiiC-5zwghXfkTeNM9kdIPQLsBFCT3pWTCs_G1nCeeIqLwyN_N5dIM1usiRfIysnlXJ0ZQc_t9BB4yr3yqvawJ59Y8iTx52-gkr9EYNWAQDj4ITq_ICf5KqF26UNTP8NisLg0gYqdzf9pTkLIESRxVyWP1SCZVBGHO1mm8cHkugwlCeBFt5FwHasMFSw23TAVJJysbBftwyTm2ZENgra1-qz1k6R7AqQtpQkLvu9Vs2ILdhr3wocXKNvVZr7DM"/>
 <div className="absolute top-4 left-4 bg-[#050505] text-muted-foreground px-3 py-1 text-[10px] uppercase tracking-widest border border-transparent">STD_LCD // 60HZ</div>
 </div>
 <div className="w-1/2 relative overflow-hidden">
 <img alt="8K" className="absolute inset-0 w-full h-full object-cover scale-110 contrast-125 brightness-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC20zBnbqzfVT3l0rLcOuDT_e3JhokDx9cUzBt8S5JiPTXMdHZr0wfohQlgDE3MSaHsphQZjBzVZAxFTFmarkI9xvFLyi2W3zMjGstlRb0vBOe7Rz26JALxTML6Vw2Bbs4-KhLOeTbHzJAkXB-IiRxGB7Js9b-Q8nnkiV9w18yHD64r4noTEebrrDQeRQ-BUSTVVXgadHpmOyJdoIpo7ed8VYxk5IRUfmiyT1vzPy7ry0__j8KbAhFheU_SqFW9NTpauVGY_kn5FTfG"/>
 <div className="absolute top-4 right-4 bg-[#0df2f2]/10 text-[#0df2f2] px-3 py-1 text-[10px] uppercase tracking-widest border border-[#0df2f2] font-bold">ORIENT_OLED // 120HZ</div>
 </div>
 </div>
 {/* Slider Handle Visual */}
 <div className="absolute inset-y-0 left-1/2 w-8 -ml-4 flex items-center justify-center z-20 pointer-events-none">
 <div className="w-[2px] h-full bg-[#0df2f2] shadow-[0_0_15px_#0df2f2]"></div>
 <div className="w-8 h-8 bg-[#050505] border-2 border-[#0df2f2] flex items-center justify-center absolute">
 <svg className="text-[#0df2f2] w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
 </div>
 </div>
 </div>
 
 <div className="mt-8 flex justify-between text-[10px] font-mono text-foreground/80 uppercase tracking-widest border-t border-transparent pt-4">
 <span>// Panel ID: LG_C2_EVO_MOD</span>
 <span>// Color Gamut: 99% DCI-P3</span>
 <span>// HDR: Dolby Vision IQ</span>
 </div>
 </div>
 </section>

 {/* Section 4: The Seating */}
 <section className="py-32 px-4 pb-48 relative overflow-hidden bg-[#0a0a0a]" id="seating">
 <div 
 className="absolute inset-0 opacity-5 pointer-events-none"
 style={{
 backgroundImage: "linear-gradient(to right, #0df2f2 1px, transparent 1px), linear-gradient(to bottom, #0df2f2 1px, transparent 1px)",
 backgroundSize: "40px 40px"
 }}
 ></div>
 
 <div className="max-w-[1920px] mx-auto">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
 <div className="lg:col-span-5 order-2 lg:order-1">
 <span className="text-[#0df2f2] text-[10px] tracking-widest font-bold block mb-4 uppercase">04 // Pilot Interface</span>
 <h2 className="text-5xl md:text-7xl font-black text-background mb-8 uppercase tracking-tighter">Ergonomic<br/>Command</h2>
 <p className="text-muted-foreground mb-10 text-xs tracking-widest uppercase leading-relaxed">
 Extended sessions require absolute comfort. Our "Command Module" chairs feature dynamic lumbar support, 4D armrests, and cooling gel-infused memory foam to keep you focused on the objective.
 </p>
 <div className="space-y-4">
 <FeatureRow icon={<Activity className="w-4 h-4" />} title="Active Lumbar" desc="Adapts to spine curvature" />
 <FeatureRow icon={<Zap className="w-4 h-4" />} title="Breathable Weave" desc="Temperature regulation mesh" />
 <FeatureRow icon={<Crosshair className="w-4 h-4" />} title="165° Recline" desc="Zero-gravity mechanism" />
 </div>
 </div>

 <div className="lg:col-span-7 order-1 lg:order-2 relative">
 <div className="relative w-full aspect-square md:aspect-[4/3] border border-transparent bg-[#050505] p-8 flex items-center justify-center group overflow-hidden" style={{ clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 
 {/* Chair Visual */}
 <img 
 alt="Futuristic ergonomic gaming chair silhouette" 
 className="relative z-10 w-3/4 h-3/4 object-contain filter drop-shadow-[0_0_30px_rgba(13,242,242,0.2)] grayscale contrast-125" 
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6HGNUsdmu-WEdG9cRolP76yONyQyaSPdtbKaIOZ26zpNlVgLhK0JgT_0oFAbqbOvXrdeP5KRX2c5F0DY384T00nDVZ8ggxQ9jeXBu_eBXY43MWrnRjvv2rS3pjCKPNDKDf3mzBpLAVN0SwyIQD-ONrAVw9RAZJ3cei9NY7Vr9KOTkozvfbhRgcxtv-uQ_Y0FNNbTC7bk-0OsUO3Mf4s6M6FRPtso0JfkxV2Vzqkx1XZE9ZPOHq0wo3qSGSVDhytoqTM8cXfJ2F6yy"
 />
 
 {/* Floating Stats */}
 <div className="absolute top-1/4 left-10 z-20 animate-[bounce_3s_infinite]">
 <div className="bg-[#111] border border-[#0df2f2]/40 px-3 py-2 text-[10px] text-white shadow-[0_0_15px_rgba(13,242,242,0.2)] uppercase tracking-widest" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
 <div className="text-[#0df2f2] font-bold mb-1">HEADREST</div>
 <div>MEM_FOAM_D50</div>
 </div>
 <div className="h-8 w-[1px] bg-[#0df2f2]/40 mx-auto"></div>
 <div className="w-2 h-2 bg-[#0df2f2] mx-auto"></div>
 </div>
 
 <div className="absolute bottom-1/3 right-10 z-20 animate-[bounce_4s_infinite]">
 <div className="w-2 h-2 bg-[#0df2f2] mx-auto"></div>
 <div className="h-8 w-[1px] bg-[#0df2f2]/40 mx-auto"></div>
 <div className="bg-[#111] border border-[#0df2f2]/40 px-3 py-2 text-[10px] text-white shadow-[0_0_15px_rgba(13,242,242,0.2)] text-right uppercase tracking-widest" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
 <div className="text-[#0df2f2] font-bold mb-1">HYDRAULICS</div>
 <div>CLASS_4_PISTON</div>
 </div>
 </div>

 {/* Scanner Beam */}
 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0df2f2]/10 to-transparent h-20 w-full animate-[scan_4s_linear_infinite] pointer-events-none" style={{ top: '-100%' }}></div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Footer */}
 <footer className="border-t border-transparent bg-[#050505] py-12 px-6">
 <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
 <div className="flex items-center gap-3">
 <div className="w-6 h-6 bg-[#0df2f2] flex items-center justify-center">
 <Terminal className="w-3 h-3 text-foreground" />
 </div>
 <span className="text-sm font-bold tracking-widest text-background uppercase">ORIENT<span className="text-[#0df2f2]">GAMES</span></span>
 </div>
 <div className="text-[10px] text-foreground/80 font-mono text-center md:text-right uppercase tracking-widest">
 <p>SYSTEM INTEGRITY CHECK: PASSED</p>
 <p>© 2025 ORIENT GAMES ARENA. ALL RIGHTS RESERVED.</p>
 </div>
 </div>
 </footer>
 
 <style>{`
 @keyframes scan {
 0% { transform: translateY(0); top: -20%; }
 100% { transform: translateY(1000px); top: 120%; }
 }
 `}</style>
 </div>
 );
};

const SpecCard = ({ icon, title, value, unit, sub }: any) => (
 <div className="bg-[#111] border border-transparent p-4 flex justify-between items-center group hover:border-[#0df2f2]/60 transition-colors cursor-default" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="flex items-center gap-4">
 <div className="text-foreground/80 group-hover:text-[#0df2f2] transition-colors">{icon}</div>
 <div>
 <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{title}</div>
 <div className="text-background font-bold text-xs uppercase tracking-wider">{value}</div>
 </div>
 </div>
 <div className="text-right">
 <div className="text-2xl font-black text-[#0df2f2]">{unit}<span className="text-[10px] text-muted-foreground ml-1 uppercase tracking-widest">{sub}</span></div>
 </div>
 </div>
);

const StatCard = ({ bigText, title, sub, desc, progress }: any) => (
 <div className="bg-[#111] border border-transparent p-8 relative overflow-hidden group hover:border-[#0df2f2] transition-colors" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 <div className="absolute -right-4 -top-4 text-9xl font-black text-background/5 group-hover:text-[#0df2f2]/10 transition-colors pointer-events-none">{bigText}</div>
 
 <h3 className="text-3xl font-black text-background mb-2 uppercase tracking-tight relative z-10">{title}</h3>
 <p className="text-[#0df2f2] text-[10px] tracking-widest uppercase mb-6 relative z-10">{sub}</p>
 
 <div className="w-full bg-[#050505] h-1 mb-6 overflow-hidden relative z-10">
 <div className="h-full bg-[#0df2f2] shadow-[0_0_10px_#0df2f2]" style={{ width: `${progress}%` }}></div>
 </div>
 
 <p className="text-muted-foreground text-[10px] uppercase tracking-widest leading-relaxed relative z-10">{desc}</p>
 </div>
);

const FeatureRow = ({ icon, title, desc }: any) => (
 <div className="flex items-center gap-4 bg-[#111] p-4 border border-transparent" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="w-10 h-10 bg-[#050505] border border-transparent flex items-center justify-center text-[#0df2f2]">
 {icon}
 </div>
 <div>
 <h4 className="text-background font-bold text-xs uppercase tracking-wider">{title}</h4>
 <p className="text-muted-foreground text-[10px] uppercase tracking-widest">{desc}</p>
 </div>
 </div>
);

export default Hardware;
