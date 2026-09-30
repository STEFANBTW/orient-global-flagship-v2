import React, { useState, useEffect, useRef } from 'react';

const steps = [
 {
 title: 'Pre-Filtration',
 subtitle: 'Sediment Removal',
 desc: 'The journey begins. Raw water passes through a 5-micron polypropylene filter, capturing coarse particles like sand, rust, and silt. This foundational step protects the delicate membranes downstream.',
 stats: { label: 'Pore Size', value: '5 Micron' },
 img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop' // Liquid/Water texture
 },
 {
 title: 'Ultraviolet Sterilization',
 subtitle: 'Biological Defense',
 desc: 'High-intensity UV-C light at 254nm disrupts the DNA of bacteria and viruses, rendering them harmless without adding chemicals to the water.',
 stats: { label: 'Wavelength', value: '254 nm' },
 img: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?q=80&w=2070&auto=format&fit=crop' // Dark/Abstract light
 },
 {
 title: 'Mineralization',
 subtitle: 'Nature’s Balance',
 desc: 'Pure water is hungry water. We reintroduce essential electrolytes—Calcium and Magnesium—to balance pH and create a smooth, refreshing taste profile.',
 stats: { label: 'Added', value: 'Ca+ / Mg+' },
 img: 'https://images.unsplash.com/photo-1610725663727-08795a947815?q=80&w=2070&auto=format&fit=crop' // Stones/Minerals
 },
 {
 title: 'Alkaline Balance',
 subtitle: 'pH Optimization',
 desc: 'We precisely adjust the alkalinity to a pH of 7.8, aligning with the body’s natural state and improving hydration efficiency.',
 stats: { label: 'Target pH', value: '7.8' },
 img: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=2070&auto=format&fit=crop' // Lab/Blue liquid
 },
 {
 title: 'Reverse Osmosis (RO)',
 subtitle: 'Molecular Refinement',
 desc: 'The core of our purity. Water is forced through a semi-permeable membrane at high pressure, removing 99.9% of dissolved solids, heavy metals, and impurities.',
 stats: { label: 'Rejection Rate', value: '99.9%' },
 img: 'https://images.unsplash.com/photo-1562016600-ece13e8ba570?q=80&w=2070&auto=format&fit=crop' // Membrane/Tech texture
 },
 {
 title: 'Ultrafiltration (UF)',
 subtitle: 'Final Polish',
 desc: 'A secondary microscopic barrier ensures absolute clarity and sterility, catching any remaining microscopic organic matter.',
 stats: { label: 'Precision', value: '0.01 Micron' },
 img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=2070&auto=format&fit=crop' // Bubbles/Clear
 },
 {
 title: 'Post-Filtration',
 subtitle: 'Taste Conditioning',
 desc: 'Before bottling, water flows through activated coconut shell carbon to polish the flavor, removing any lingering odors or tastes.',
 stats: { label: 'Media', value: 'Coconut Carbon' },
 img: 'https://images.unsplash.com/photo-1603825704953-b3bcf3203c99?q=80&w=2070&auto=format&fit=crop' // Bottling/Glass
 },
];

const Process: React.FC = () => {
 const [activeStep, setActiveStep] = useState(0);
 const [batchId, setBatchId] = useState('');
 const [isVerified, setIsVerified] = useState(false);
 const scrollContainerRef = useRef<HTMLDivElement>(null);

 // Handle Scroll Logic for Immersive Section
 useEffect(() => {
 const handleScroll = () => {
 if (!scrollContainerRef.current) return;
 
 const container = scrollContainerRef.current;
 const { top } = container.getBoundingClientRect();
 const stepHeight = window.innerHeight;
 
 // Calculate which step we are on based on how far we've scrolled into the container
 // Using -top because top becomes negative as we scroll down
 const step = Math.max(0, Math.min(steps.length - 1, Math.floor(-top / stepHeight)));
 
 setActiveStep(step);
 };

 window.addEventListener('scroll', handleScroll);
 handleScroll(); // Initial check
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const handleVerify = (e: React.FormEvent) => {
 e.preventDefault();
 if(batchId) setIsVerified(true);
 };

 return (
 <div className="bg-foreground text-background min-h-screen">
 
 {/* 
 IMMERSIVE SCROLL CONTAINER 
 Height = Number of steps * 100vh (approx) to create scroll track
 */}
 <div ref={scrollContainerRef} className="relative" style={{ height: `${steps.length * 100}vh` }}>
 
 {/* STICKY VIEWPORT - Locks content to screen while scrolling "through" time */}
 <div className="sticky top-24 h-[calc(100vh-6rem)] w-full overflow-hidden flex flex-col justify-center">
 
 {/* BACKGROUND IMAGES LAYER */}
 <div className="absolute inset-0 z-0">
 {steps.map((step, index) => (
 <div
 key={`img-${index}`}
 className="absolute inset-0 transition-all duration-1000 ease-in-out"
 style={{
 opacity: index === activeStep ? 1 : 0,
 transform: index === activeStep ? 'scale(1.05)' : 'scale(1.15)',
 filter: index === activeStep ? 'blur(0px)' : 'blur(10px)',
 zIndex: index === activeStep ? 10 : 0
 }}
 >
 <img 
 src={step.img} 
 alt={step.title} 
 className="w-full h-full object-cover" 
 />
 {/* Dark Overlay for Text Readability */}
 <div className="absolute inset-0 bg-foreground text-background/60 mix-blend-multiply"></div>
 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
 </div>
 ))}
 </div>

 {/* CONTENT LAYER */}
 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full pointer-events-none">
 
 {/* TIMELINE (Left) */}
 <div 
 className="absolute left-4 md:left-8 transition-all duration-1000 ease-in-out flex flex-col gap-6 border-l-2 border-transparent pl-6 md:pl-8 pointer-events-auto"
 style={{
 // Starts at bottom (80%) for first step, moves up to 35% for subsequent steps
 top: activeStep === 0 ? '75%' : '35%', 
 transform: 'translateY(-50%)' 
 }}
 >
 {steps.map((step, index) => (
 <div 
 key={`timeline-${index}`}
 className={`transition-all duration-500 flex items-center gap-4 ${
 index === activeStep 
 ? 'opacity-100 scale-100' 
 : 'opacity-30 scale-90'
 }`}
 >
 {/* Step Number Bubble */}
 <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors duration-500 ${
 index === activeStep ? 'bg-primary border-primary text-secondary' : 'border-transparent text-background'
 }`}>
 {index + 1}
 </div>
 
 {/* Text Label */}
 <div className={`${index === activeStep ? 'block' : 'hidden md:block'}`}>
 <span className="text-background font-bold text-sm tracking-widest uppercase">{step.title}</span>
 </div>
 </div>
 ))}
 </div>

 {/* DEEP DIVE GLASS CARDS (Bottom Right) */}
 <div className="absolute bottom-12 right-4 md:right-8 md:bottom-24 w-full md:max-w-xl pointer-events-auto">
 {steps.map((step, index) => (
 <div
 key={`card-${index}`}
 className="absolute bottom-0 right-0 w-full bg-card/90 backdrop-blur-xl p-8 rounded-2xl border border-transparent shadow-2xl transition-all duration-700 ease-out"
 style={{
 opacity: index === activeStep ? 1 : 0,
 transform: index === activeStep ? 'translateY(0)' : 'translateY(100px)',
 pointerEvents: index === activeStep ? 'auto' : 'none'
 }}
 >
 <div className="flex items-center gap-3 mb-4">
 <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/30">
 STAGE 0{index + 1}
 </span>
 <span className="h-px flex-1 bg-card/20"></span>
 <span className="text-xs font-mono text-background/70">{step.stats.label}: {step.stats.value}</span>
 </div>
 
 <h2 className="text-3xl md:text-4xl font-bold text-background mb-2">{step.title}</h2>
 <h3 className="text-lg text-primary mb-6 font-medium">{step.subtitle}</h3>
 <p className="text-background leading-relaxed text-sm md:text-base">
 {step.desc}
 </p>
 
 {/* Decorative Elements */}
 <div className="mt-6 flex gap-2">
 <div className="w-12 h-1 bg-primary rounded-full animate-pulse"></div>
 <div className="w-2 h-1 bg-card/30 rounded-full"></div>
 <div className="w-2 h-1 bg-card/30 rounded-full"></div>
 </div>
 </div>
 ))}
 </div>

 </div>

 {/* SCROLL INDICATOR (Only visible on first step) */}
 <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${activeStep === 0 ? 'opacity-100' : 'opacity-0'}`}>
 <div className="flex flex-col items-center gap-2">
 <span className="text-background/50 text-xs uppercase tracking-widest">Scroll to Explore</span>
 <span className="material-icons text-background animate-bounce">keyboard_arrow_down</span>
 </div>
 </div>

 </div>
 </div>

 {/* BATCH VERIFY SECTION (Appended at the end) */}
 <div id="verify" className="w-full bg-background-light relative z-20 transition-colors duration-500">
 <div className="bg-secondary text-background py-24 relative overflow-hidden">
 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1920&q=80')] bg-cover mix-blend-overlay opacity-20"></div>
 <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
 <h1 className="text-4xl md:text-5xl font-bold mb-6">TRUST THROUGH DATA.</h1>
 <p className="text-xl text-blue-100 mb-12">Our commitment to transparency. Every drop verified. Trace your bottle's journey from source to sip.</p>
 
 <form onSubmit={handleVerify} className="max-w-2xl mx-auto relative">
 <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
 <input 
 type="text" 
 value={batchId}
 onChange={(e) => setBatchId(e.target.value)}
 placeholder="ENTER YOUR BOTTLE NECK CODE (e.g., OW-4192)" 
 className="w-full h-16 pl-14 pr-4 rounded-full text-foreground outline-none focus:ring-4 focus:ring-primary/50 shadow-2xl"
 />
 {isVerified && (
 <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2">
 <span className="material-icons text-background animate-bounce">arrow_downward</span>
 </div>
 )}
 </form>
 </div>
 </div>

 {/* Verification Result */}
 {isVerified ? (
 <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-20 pb-24 animate-fade-in">
 <div className="bg-card rounded-xl shadow-xl border-t-4 border-primary overflow-hidden">
 <div className="bg-blue-50 p-4 border-b border-blue-100 text-center">
 <h2 className="text-xl font-bold text-secondary uppercase">Batch #{batchId || '4192'} VERIFIED</h2>
 </div>
 
 <div className="p-8 space-y-8">
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
 <span className="material-icons text-blue-600 ">schedule</span>
 </div>
 <div>
 <h4 className="text-xs font-bold text-muted-foreground uppercase">Bottling Time</h4>
 <p className="text-lg font-medium text-foreground ">12:45 PM, OCTOBER 26, 2023</p>
 </div>
 </div>

 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
 <span className="material-icons text-blue-600 ">person</span>
 </div>
 <div>
 <h4 className="text-xs font-bold text-muted-foreground uppercase">Lab Technician</h4>
 <p className="text-lg font-medium text-foreground ">Dr. A. Yusuf</p>
 </div>
 </div>

 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
 <span className="material-icons text-blue-600 ">science</span>
 </div>
 <div>
 <h4 className="text-xs font-bold text-muted-foreground uppercase">Mineral Levels (mg/L)</h4>
 <p className="text-lg font-medium text-foreground ">Calcium 42, Magnesium 18, Potassium 5, Bicarbonates 150, pH 7.4</p>
 </div>
 </div>
 </div>
 
 <div className="bg-green-50 p-4 flex items-center justify-center gap-2 text-green-700 font-bold">
 <span className="material-icons">check_circle</span>
 QUALITY APPROVED
 </div>
 </div>
 </div>
 ) : (
 <div className="h-24"></div>
 )}

 {/* Lab Gallery */}
 <section className="bg-card py-24 transition-colors duration-500">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16">
 <h2 className="text-2xl font-bold text-foreground uppercase tracking-widest mb-2">Our Clinical Lab in Jos</h2>
 <div className="w-20 h-1 bg-primary mx-auto"></div>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {[
 { title: 'Microbiological Testing', img: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&w=400&q=80' },
 { title: 'Mineral Analysis Station', img: 'https://images.unsplash.com/photo-1581093588401-fbb0736d9138?auto=format&fit=crop&w=400&q=80' },
 { title: 'Advanced Filtration', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80' },
 { title: 'Dr. Yusuf at Work', img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80' },
 { title: 'Quality Control Check', img: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=400&q=80' },
 { title: 'The Jos Facility', img: 'https://images.unsplash.com/photo-1565514020176-db7102e34568?auto=format&fit=crop&w=400&q=80' },
 ].map((item, i) => (
 <div key={i} className="group">
 <div className="overflow-hidden rounded-lg mb-4 shadow-md">
 <img src={item.img} alt={item.title} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" />
 </div>
 <h3 className="text-center font-medium text-foreground/80 ">{item.title}</h3>
 </div>
 ))}
 </div>
 </div>
 </section>
 </div>
 </div>
 );
};

export default Process;