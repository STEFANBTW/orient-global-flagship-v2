import React, { useState, useEffect, useRef } from 'react';

const Logistics: React.FC = () => {
 const [activeChapter, setActiveChapter] = useState(0);
 const containerRef = useRef<HTMLDivElement>(null);

 // Scroll handling to determine active chapter
 useEffect(() => {
 const handleScroll = () => {
 if (!containerRef.current) return;
 const { top } = containerRef.current.getBoundingClientRect();
 const vh = window.innerHeight;
 // Calculate which 100vh section we are currently viewing
 // We have 5 chapters.
 const chapter = Math.max(0, Math.min(4, Math.floor(-top / vh)));
 setActiveChapter(chapter);
 };

 window.addEventListener('scroll', handleScroll);
 handleScroll();
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const chapters = [
 { title: "Command Center", subtitle: "Global Operations" },
 { title: "The Payload", subtitle: "Bulk Services" },
 { title: "The Fleet", subtitle: "Hardware" },
 { title: "The Intelligence", subtitle: "Tech Stack" },
 { title: "The Last Mile", subtitle: "Coverage Zones" }
 ];

 return (
 <div className="bg-foreground text-background min-h-screen text-background font-sans selection:bg-primary selection:text-foreground">
 
 {/* Scroll Track - 500vh height */}
 <div ref={containerRef} className="relative h-[500vh]">
 
 {/* Sticky Viewport */}
 <div className="sticky top-24 h-[calc(100vh-6rem)] w-full overflow-hidden flex flex-col">
 
 {/* BACKGROUND LAYERS */}
 {/* Chapter 1 BG: Map */}
 <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center transition-opacity duration-1000 ${activeChapter === 0 ? 'opacity-20' : 'opacity-0'}`}></div>
 
 {/* Chapter 2 BG: Warehouse/Industrial */}
 <div className={`absolute inset-0 bg-gradient-to-b from-slate-900 to-blue-900/20 transition-opacity duration-1000 ${activeChapter === 1 ? 'opacity-100' : 'opacity-0'}`}>
 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-950 to-slate-950"></div>
 </div>

 {/* Chapter 3 BG: Asphalt/Road */}
 <div className={`absolute inset-0 bg-foreground text-background transition-opacity duration-1000 ${activeChapter === 2 ? 'opacity-100' : 'opacity-0'}`}>
 <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%,transparent_50%,#1e293b_50%,#1e293b_75%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
 </div>

 {/* Chapter 4 BG: Grid/Tech */}
 <div className={`absolute inset-0 bg-foreground text-background transition-opacity duration-1000 ${activeChapter === 3 ? 'opacity-100' : 'opacity-0'}`}>
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[length:40px_40px] opacity-20"></div>
 </div>

 {/* Chapter 5 BG: Map Zones */}
 <div className={`absolute inset-0 bg-foreground text-background transition-opacity duration-1000 ${activeChapter === 4 ? 'opacity-100' : 'opacity-0'}`}></div>


 {/* CONTENT CONTAINER */}
 <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
 
 {/* CHAPTER 1: COMMAND CENTER */}
 <div className={`w-full transition-all duration-700 absolute ${activeChapter === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
 <div className="border-l-4 border-primary pl-8 mb-12">
 <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tighter">PRECISION<br/><span className="text-primary">IN MOTION.</span></h1>
 <p className="text-2xl text-muted-foreground max-w-2xl">The heartbeat of Orient Water's supply chain. Monitoring millions of liters in real-time.</p>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="bg-foreground text-background/50 border border-border p-8 backdrop-blur-sm">
 <span className="text-xs font-mono text-primary mb-2 block">ACTIVE FLEET</span>
 <div className="text-5xl font-bold font-mono">047<span className="text-lg text-muted-foreground">/050</span></div>
 <div className="w-full bg-foreground text-background h-1 mt-4"><div className="w-[94%] h-full bg-primary animate-pulse"></div></div>
 </div>
 <div className="bg-foreground text-background/50 border border-border p-8 backdrop-blur-sm">
 <span className="text-xs font-mono text-primary mb-2 block">ON-TIME RATE</span>
 <div className="text-5xl font-bold font-mono">99.8<span className="text-lg text-muted-foreground">%</span></div>
 <div className="w-full bg-foreground text-background h-1 mt-4"><div className="w-[99.8%] h-full bg-green-500"></div></div>
 </div>
 <div className="bg-foreground text-background/50 border border-border p-8 backdrop-blur-sm">
 <span className="text-xs font-mono text-primary mb-2 block">LITERS IN TRANSIT</span>
 <div className="text-5xl font-bold font-mono">12,500<span className="text-lg text-muted-foreground">L</span></div>
 <div className="w-full bg-foreground text-background h-1 mt-4"><div className="w-[60%] h-full bg-blue-500"></div></div>
 </div>
 </div>
 </div>

 {/* CHAPTER 2: THE PAYLOAD (GOODS) */}
 <div className={`w-full transition-all duration-700 absolute ${activeChapter === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
 <div className="flex flex-col md:flex-row gap-12 items-center">
 <div className="w-full md:w-1/2">
 <h2 className="text-primary font-mono text-sm mb-4 tracking-widest">LOGISTIC SERVICES</h2>
 <h1 className="text-5xl font-bold mb-8">The Heavy Lift.</h1>
 <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
 We don't just move water; we move volume. Specialized transport solutions for wholesale, corporate, and large-scale events.
 </p>
 
 <div className="space-y-6">
 <div className="group border-l-2 border-border pl-6 hover:border-primary transition-colors cursor-pointer">
 <h3 className="text-2xl font-bold text-background group-hover:text-primary transition-colors">Wholesale Pallets</h3>
 <p className="text-muted-foreground">Standardized ISO pallets. 75cl/50cl cases shrink-wrapped for stability. Forklift ready.</p>
 </div>
 <div className="group border-l-2 border-border pl-6 hover:border-primary transition-colors cursor-pointer">
 <h3 className="text-2xl font-bold text-background group-hover:text-primary transition-colors">Corporate Refill Racks</h3>
 <p className="text-muted-foreground">Custom modular racking for 19L dispensers. Prevents bottle abrasion. Efficient vertical stacking.</p>
 </div>
 <div className="group border-l-2 border-border pl-6 hover:border-primary transition-colors cursor-pointer">
 <h3 className="text-2xl font-bold text-background group-hover:text-primary transition-colors">Event Tankers</h3>
 <p className="text-muted-foreground">Mobile hydration stations for festivals and conferences. 1000L+ capacity units.</p>
 </div>
 </div>
 </div>
 
 <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
 {/* Visual representation of goods */}
 <div className="bg-foreground text-background rounded-xl p-6 h-64 flex flex-col justify-between border border-border hover:border-primary transition-colors">
 <span className="material-icons text-4xl text-muted-foreground">layers</span>
 <div>
 <span className="text-3xl font-bold block text-background">48 Cases</span>
 <span className="text-sm text-muted-foreground">Per Euro Pallet</span>
 </div>
 </div>
 <div className="bg-foreground text-background rounded-xl p-6 h-64 flex flex-col justify-between border border-border hover:border-primary transition-colors translate-y-8">
 <span className="material-icons text-4xl text-muted-foreground">propane_tank</span>
 <div>
 <span className="text-3xl font-bold block text-background">32 Units</span>
 <span className="text-sm text-muted-foreground">Per Modular Rack</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* CHAPTER 3: THE FLEET */}
 <div className={`w-full transition-all duration-700 absolute ${activeChapter === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
 <div className="text-center mb-16">
 <h2 className="text-primary font-mono text-sm mb-4 tracking-widest">HARDWARE</h2>
 <h1 className="text-5xl md:text-6xl font-bold">Purpose-Built Fleet.</h1>
 </div>

 <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
 {/* Heavy Hauler */}
 <div className="bg-foreground text-background border border-border p-1 w-full md:w-1/3 rounded-2xl hover:border-primary transition-colors duration-500 group">
 <div className="h-64 bg-foreground text-background rounded-xl mb-6 overflow-hidden relative">
 <img src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="Truck" />
 <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">LONG HAUL</div>
 </div>
 <div className="px-6 pb-6">
 <h3 className="text-2xl font-bold text-background mb-2">The Heavy Hauler</h3>
 <p className="text-muted-foreground text-sm mb-6">6-Ton capacity rigid trucks tailored for depot-to-depot transfers.</p>
 <div className="grid grid-cols-2 gap-4 text-xs font-mono text-muted-foreground border-t border-border pt-4">
 <div>
 <span className="block text-background/80">Payload</span>
 5,400 KG
 </div>
 <div>
 <span className="block text-background/80">Range</span>
 800 KM
 </div>
 <div>
 <span className="block text-background/80">Temp</span>
 Controlled
 </div>
 </div>
 </div>
 </div>

 {/* Sprint Van */}
 <div className="bg-foreground text-background border border-border p-1 w-full md:w-1/3 rounded-2xl hover:border-primary transition-colors duration-500 group">
 <div className="h-64 bg-foreground text-background rounded-xl mb-6 overflow-hidden relative">
 <img src="https://images.unsplash.com/photo-1616432043562-3671ea2e5242?q=80&w=1888&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="Van" />
 <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">EXPRESS</div>
 </div>
 <div className="px-6 pb-6">
 <h3 className="text-2xl font-bold text-background mb-2">Urban Sprint Van</h3>
 <p className="text-muted-foreground text-sm mb-6">Agile units designed for tight residential streets and rapid fulfillment.</p>
 <div className="grid grid-cols-2 gap-4 text-xs font-mono text-muted-foreground border-t border-border pt-4">
 <div>
 <span className="block text-background/80">Payload</span>
 1,200 KG
 </div>
 <div>
 <span className="block text-background/80">Turn Radius</span>
 4.2 M
 </div>
 <div>
 <span className="block text-background/80">Speed</span>
 High
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* CHAPTER 4: INTELLIGENCE */}
 <div className={`w-full transition-all duration-700 absolute ${activeChapter === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
 <div className="flex flex-col md:flex-row-reverse items-center gap-16">
 <div className="w-full md:w-1/2">
 <h2 className="text-primary font-mono text-sm mb-4 tracking-widest">TECH STACK</h2>
 <h1 className="text-5xl font-bold mb-8">Data-Driven Purity.</h1>
 
 <ul className="space-y-8">
 <li className="flex gap-6">
 <div className="w-12 h-12 rounded-lg bg-foreground text-background border border-border flex items-center justify-center text-primary shadow-[0_0_15px_rgba(166,243,252,0.2)]">
 <span className="material-icons">satellite_alt</span>
 </div>
 <div>
 <h3 className="text-xl font-bold text-background mb-2">GPS Telemetry</h3>
 <p className="text-muted-foreground">Real-time tracking of every liter. Route optimization algorithms reduce fuel consumption by 18%.</p>
 </div>
 </li>
 <li className="flex gap-6">
 <div className="w-12 h-12 rounded-lg bg-foreground text-background border border-border flex items-center justify-center text-primary shadow-[0_0_15px_rgba(166,243,252,0.2)]">
 <span className="material-icons">qr_code_2</span>
 </div>
 <div>
 <h3 className="text-xl font-bold text-background mb-2">Digital Manifests</h3>
 <p className="text-muted-foreground">End-to-end chain of custody. Scan-to-verify ensures the bottle you receive is the bottle we filled.</p>
 </div>
 </li>
 <li className="flex gap-6">
 <div className="w-12 h-12 rounded-lg bg-foreground text-background border border-border flex items-center justify-center text-primary shadow-[0_0_15px_rgba(166,243,252,0.2)]">
 <span className="material-icons">timeline</span>
 </div>
 <div>
 <h3 className="text-xl font-bold text-background mb-2">Predictive Refills</h3>
 <p className="text-muted-foreground">Our systems analyze your consumption patterns to suggest refill dates before you run dry.</p>
 </div>
 </li>
 </ul>
 </div>
 
 <div className="w-full md:w-1/2 bg-foreground text-background border border-border rounded-3xl p-8 relative overflow-hidden aspect-square flex items-center justify-center">
 {/* Stylized Node Animation */}
 <div className="absolute inset-0 flex items-center justify-center opacity-30">
 <div className="w-64 h-64 border border-primary rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
 <div className="w-48 h-48 border border-primary rounded-full animate-ping" style={{animationDuration: '3s', animationDelay: '0.5s'}}></div>
 <div className="w-32 h-32 border border-primary rounded-full animate-ping" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
 </div>
 <div className="z-10 text-center">
 <div className="text-6xl font-mono font-bold text-background mb-2">LIVE</div>
 <div className="text-primary tracking-widest animate-pulse">SYSTEM OPTIMIZED</div>
 </div>
 </div>
 </div>
 </div>

 {/* CHAPTER 5: LAST MILE */}
 <div className={`w-full transition-all duration-700 absolute ${activeChapter === 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
 <div className="text-center mb-16">
 <h1 className="text-5xl font-bold mb-6">Operational Zones.</h1>
 <p className="text-xl text-muted-foreground">Current network status in Jos Metropolis.</p>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-foreground text-background border border-border p-8 rounded-2xl relative overflow-hidden group hover:border-green-500 transition-colors">
 <div className="absolute top-0 right-0 p-4">
 <span className="flex h-3 w-3 relative">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
 </span>
 </div>
 <h3 className="text-2xl font-bold text-background mb-2">Zone A</h3>
 <p className="text-sm font-mono text-green-400 mb-6">STATUS: ACTIVE</p>
 <p className="text-muted-foreground mb-4">Rayfield, GRA, Liberty Dam, Lamingo</p>
 <div className="w-full bg-foreground text-background h-1"><div className="w-1/4 h-full bg-green-500"></div></div>
 <p className="text-xs text-muted-foreground mt-2">Load: Light</p>
 </div>

 <div className="bg-foreground text-background border border-border p-8 rounded-2xl relative overflow-hidden group hover:border-green-500 transition-colors">
 <div className="absolute top-0 right-0 p-4">
 <span className="flex h-3 w-3 relative">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
 </span>
 </div>
 <h3 className="text-2xl font-bold text-background mb-2">Zone B</h3>
 <p className="text-sm font-mono text-green-400 mb-6">STATUS: ACTIVE</p>
 <p className="text-muted-foreground mb-4">Tudun Wada, Hwolshe, Secretariat</p>
 <div className="w-full bg-foreground text-background h-1"><div className="w-3/4 h-full bg-yellow-500"></div></div>
 <p className="text-xs text-muted-foreground mt-2">Load: High</p>
 </div>

 <div className="bg-foreground text-background border border-border p-8 rounded-2xl relative overflow-hidden group hover:border-red-500 transition-colors">
 <div className="absolute top-0 right-0 p-4">
 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
 </div>
 <h3 className="text-2xl font-bold text-background mb-2">Zone C</h3>
 <p className="text-sm font-mono text-red-400 mb-6">STATUS: CONGESTED</p>
 <p className="text-muted-foreground mb-4">Bukuru, Zawan, Trade Centre</p>
 <div className="w-full bg-foreground text-background h-1"><div className="w-full h-full bg-red-500"></div></div>
 <p className="text-xs text-muted-foreground mt-2">Load: Critical</p>
 </div>
 </div>

 <div className="mt-16 text-center">
 <button className="bg-primary text-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-card transition-colors animate-bounce">
 Scroll For Bulk Options
 <span className="material-icons block mt-2">arrow_downward</span>
 </button>
 </div>
 </div>

 </div>

 {/* CHAPTER INDICATORS (Right Side) */}
 <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 z-50">
 {chapters.map((c, i) => (
 <div key={i} className="flex items-center justify-end gap-3 group cursor-pointer" onClick={() => document.getElementById('main-scroll-container')?.scrollTo({top: i * window.innerHeight, behavior: 'smooth'})}>
 <div className={`text-right transition-opacity duration-300 ${activeChapter === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
 <span className="block text-xs font-bold text-background uppercase">{c.title}</span>
 <span className="block text-xs text-muted-foreground uppercase">{c.subtitle}</span>
 </div>
 <div className={`w-1 transition-all duration-300 ${activeChapter === i ? 'h-8 bg-primary' : 'h-4 bg-slate-600 group-hover:bg-slate-400'}`}></div>
 </div>
 ))}
 </div>

 </div>
 </div>

 {/* BULK PRODUCT SHOWCASE */}
 <section className="py-32 bg-foreground text-background border-t border-border relative z-20">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16">
 <span className="text-primary font-mono text-sm tracking-widest uppercase">Wholesale Direct</span>
 <h2 className="text-4xl md:text-5xl font-bold text-background mt-2 mb-6">Bulk Logistics Catalog</h2>
 <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
 Leverage our fleet for volume pricing. Optimized for pallets, racks, and industrial fulfillment.
 </p>
 </div>

 {/* Advantages Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
 <div className="bg-foreground text-background/50 p-8 rounded-2xl border border-border hover:border-primary transition-colors">
 <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
 <span className="material-icons text-primary">percent</span>
 </div>
 <h3 className="text-xl font-bold text-background mb-2">Volume Discounts</h3>
 <p className="text-muted-foreground">Save up to 18% when ordering full pallet loads. Dynamic pricing scales with your hydration needs.</p>
 </div>
 <div className="bg-foreground text-background/50 p-8 rounded-2xl border border-border hover:border-primary transition-colors">
 <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
 <span className="material-icons text-primary">priority_high</span>
 </div>
 <h3 className="text-xl font-bold text-background mb-2">Priority Scheduling</h3>
 <p className="text-muted-foreground">Bulk orders get "Zone-Skip" privileges, ensuring earliest morning delivery windows.</p>
 </div>
 <div className="bg-foreground text-background/50 p-8 rounded-2xl border border-border hover:border-primary transition-colors">
 <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
 <span className="material-icons text-primary">inventory</span>
 </div>
 <h3 className="text-xl font-bold text-background mb-2">Zero-Touch Restocking</h3>
 <p className="text-muted-foreground">Our logistics team manages your inventory levels, swapping pallets seamlessly without your intervention.</p>
 </div>
 </div>

 {/* Products Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {[
 { 
 name: 'Corporate Refill Rack', 
 desc: '19L Dispensers (Pack of 20)', 
 price: 24000, 
 bulkPrice: 20000,
 unit: 'per rack',
 savings: '16%',
 image: 'https://images.unsplash.com/photo-1595246140625-573b715d1128?auto=format&fit=crop&w=400&q=80'
 },
 { 
 name: 'Euro Pallet: 75cl', 
 desc: 'Premium Water (50 Cases)', 
 price: 90000, 
 bulkPrice: 81000,
 unit: 'per pallet',
 savings: '10%',
 image: 'https://images.unsplash.com/photo-1627483262268-9c96d8a318b8?auto=format&fit=crop&w=400&q=80'
 },
 { 
 name: 'Euro Pallet: 50cl', 
 desc: 'On-the-Go (60 Cases)', 
 price: 144000, 
 bulkPrice: 122400,
 unit: 'per pallet',
 savings: '15%',
 image: 'https://images.unsplash.com/photo-1580913428706-c311ab527ebc?auto=format&fit=crop&w=400&q=80'
 }
 ].map((item, i) => (
 <div key={i} className="bg-foreground text-background rounded-2xl overflow-hidden border border-border group hover:border-primary/50 transition-all duration-300">
 <div className="h-64 overflow-hidden relative">
 <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt={item.name} />
 <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg">
 SAVE {item.savings}
 </div>
 </div>
 <div className="p-8">
 <h3 className="text-2xl font-bold text-background mb-1">{item.name}</h3>
 <p className="text-muted-foreground mb-6">{item.desc}</p>
 
 <div className="flex items-end gap-4 mb-8">
 <div>
 <span className="block text-xs text-muted-foreground line-through">Standard: ₦{item.price.toLocaleString()}</span>
 <span className="block text-3xl font-bold text-primary">₦{item.bulkPrice.toLocaleString()}</span>
 </div>
 <span className="text-sm text-muted-foreground mb-2">{item.unit}</span>
 </div>

 <button className="w-full py-4 bg-foreground text-background hover:bg-primary hover:text-foreground text-background rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2">
 <span className="material-icons">add_shopping_cart</span>
 Add to Manifest
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 </div>
 );
};

export default Logistics;