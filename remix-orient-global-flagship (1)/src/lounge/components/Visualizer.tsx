
import React from 'react';

const Visualizer: React.FC<{ onNavigate?: (p: any) => void }> = ({ onNavigate }) => {
 return (
 <div className="bg-[#050505] text-white font-inter overflow-x-hidden selection:bg-primary-gold selection:text-foreground">
 
 {/* SECTION: HERO */}
 <section id="hero-lounge" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
 <div className="absolute inset-0 z-0">
 <img 
 className="w-full h-full object-cover animate-[hero-pan_30s_infinite_alternate]" 
 src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=2000" 
 alt="Amber Spirit Macro" 
 />
 {/* Darker gradient overlay to compensate for brighter image */}
 <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-[#050505]"></div>
 </div>
 
 <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
 <p className="text-primary-gold text-[10px] md:text-xs tracking-[0.6em] uppercase mb-6 opacity-90 font-semibold animate-pulse">Noir Luxury</p>
 <h1 className="font-newsreader italic text-7xl md:text-[120px] lg:text-[140px] text-background leading-[0.85] mb-8 drop-shadow-2xl">
 UNWIND <br/> <span className="not-italic font-light tracking-tight">IN NOIR</span>
 </h1>
 <p className="text-background/80 font-light text-base md:text-lg tracking-wide mb-12 max-w-xl mx-auto leading-relaxed drop-shadow-lg">
 Where shadows meet the golden hour. Experience the enigma of the Orient.
 </p>
 <div className="flex flex-col md:flex-row items-center justify-center gap-6">
 <button onClick={() => onNavigate?.('booking')} className="bg-primary-gold text-foreground px-12 py-5 rounded-sm uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-card transition-all shadow-xl">
 Reserve a Table
 </button>
 <button className="flex items-center gap-3 text-background border border-transparent px-10 py-5 rounded-sm hover:border-primary-gold hover:text-primary-gold transition-all group backdrop-blur-md">
 <span className="material-icons text-lg group-hover:scale-110">play_arrow</span>
 <span className="uppercase tracking-[0.2em] text-[11px] font-bold">Watch Film</span>
 </button>
 </div>
 </div>
 </section>

 {/* SECTION: CONNOISSEUR'S CELLAR */}
 <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
 <div className="text-center mb-20">
 <h2 className="font-newsreader italic text-4xl md:text-5xl text-background mb-4">The Connoisseur’s Cellar</h2>
 <p className="text-muted-foreground font-light uppercase tracking-[0.2em] text-[10px]">High-contrast macro photography of aged amber spirits.</p>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
 <div className="md:col-span-4 group overflow-hidden rounded-lg">
 <img 
 className="w-full aspect-[3/4] object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" 
 src="https://images.unsplash.com/photo-1527281032555-60dec035c93f?auto=format&fit=crop&q=80&w=800" 
 alt="Decanter" 
 />
 </div>
 <div className="md:col-span-4 group overflow-hidden rounded-lg">
 <img 
 className="w-full aspect-[3/4] object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" 
 src="https://images.unsplash.com/photo-1601063420008-21c56f4c3aba?auto=format&fit=crop&q=80&w=800" 
 alt="Cigar Case" 
 />
 </div>
 <div className="md:col-span-4 space-y-12 pl-4">
 <div className="border-l border-primary-gold/30 pl-8">
 <h4 className="font-newsreader italic text-2xl text-primary-gold mb-4 leading-none">Rare Vintage Selection</h4>
 <p className="text-muted-foreground text-xs font-light leading-relaxed mb-2 uppercase tracking-widest opacity-60">88.8 Pre-Classic</p>
 <p className="text-muted-foreground text-sm font-light leading-relaxed">
 Aged spirits has resonance are messages among cellar-keeper rooms and aromas. Selected for a rare vintage profile.
 </p>
 </div>
 <div className="border-l border-primary-gold/30 pl-8">
 <h4 className="font-newsreader italic text-2xl text-primary-gold mb-4 leading-none">Havy Harvest</h4>
 <p className="text-muted-foreground text-xs font-light leading-relaxed mb-2 uppercase tracking-widest opacity-60">Dry Harvest</p>
 <p className="text-muted-foreground text-sm font-light leading-relaxed">
 Rare vintage harvests inspire deep and earthy notes for our masters. Sample the atmosphere before you arrive.
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* SECTION: SIGNATURE MIXOLOGY */}
 <section className="relative py-32 bg-black border-t border-transparent overflow-hidden" id="mixology">
 <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
 <div>
 <p className="text-primary-gold text-xs uppercase tracking-widest mb-2 font-bold opacity-80">Botanical Alchemy</p>
 <h2 className="text-4xl md:text-5xl text-background italic font-newsreader">Signature Mixology</h2>
 </div>
 <div className="hidden md:flex space-x-4">
 <button className="w-12 h-12 rounded-full border border-transparent flex items-center justify-center text-background hover:border-primary-gold hover:text-primary-gold transition-colors">
 <span className="material-icons">west</span>
 </button>
 <button className="w-12 h-12 rounded-full border border-transparent flex items-center justify-center text-background hover:border-primary-gold hover:text-primary-gold transition-colors">
 <span className="material-icons">east</span>
 </button>
 </div>
 </div>
 <div className="flex overflow-x-auto hide-scrollbar pb-16 px-6 gap-8 md:gap-16 w-full">
 {[
 { 
 name: 'Midnight Espresso', price: '$22', 
 desc: 'A noir take on the classic. Cold brew concentrate, vodka, coffee liqueur, and a whisper of smoked sea salt.',
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9h2YJLHG4zOw8Y3MH3azQ6XMk6ZWYwoUjG2oyqR5Y08jGKazw2hJkt5xXaENlfl2NoSYwpCCMPyY8VqpI03NaIyOuJSS_Jt4ReqXjPrcgy6yFhqTtfLW_6e5Az32jbHAJs_AZ876B13KCJ_WrnkDHLYvJnSdHZ9akiys8zG4GdWt-pVbTrOdbIb9erS4p5DTtmLOoWLoTMr-NN3TafY85WBaYsM3B5rfo499NOeold3ELZayTrCBhdipuzbgYmKcF-RykC2mhaLzi',
 tags: ['Vodka', 'Cold Brew', 'Sea Salt']
 },
 { 
 name: 'The Golden Age', price: '$24', 
 desc: 'Barrel-aged bourbon smoked with hickory, angostura bitters, and a burnt orange zest for the finishing note.',
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqyGVA3ytukL_e81f7SGnGqfFoWSyEpab2saJb5cstFMNv4BoWgEytbPSY6EX55MpuVYNPwDgcUWjHv1WfY3ttNNiZQEOYtnzoLtBvbeYGZ8aoQdSFxhrtVXRY-Pq8IrJuWdhqPUpx67Xe7oxGuaao40XSnNkVxn6CR2qatzPrE_FAl2FuguHuoIOf-E5tlRFALLeu5f6g_p0baUVtRFug2BmZDAukWhObqyYdk0Oq6vz0DUnaCWTXq9qJH_iUjMSKNKGXlzLbum3o',
 tags: ['Bourbon', 'Hickory Smoke', 'Orange']
 }
 ].map((cocktail, i) => (
 <div key={i} className="shrink-0 w-[85vw] md:w-[600px] relative group">
 <div className="bg-gradient-to-br from-[#1a1a1a] to-transparent p-8 md:p-12 rounded-2xl border border-transparent hover:border-primary-gold/30 transition-all duration-500 flex flex-col md:flex-row items-center gap-8">
 <div className="relative w-48 h-64 md:w-56 md:h-72 flex-shrink-0">
 <img src={cocktail.img} alt={cocktail.name} className="w-full h-full object-cover rounded-xl shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700" />
 </div>
 <div className="flex-1 text-center md:text-left">
 <h3 className="text-3xl text-background italic font-newsreader mb-2">{cocktail.name}</h3>
 <p className="text-primary-gold text-lg mb-4">{cocktail.price}</p>
 <p className="text-muted-foreground font-light text-sm leading-relaxed mb-6 italic">{cocktail.desc}</p>
 <div className="flex flex-wrap gap-2 justify-center md:justify-start">
 {cocktail.tags.map(tag => (
 <span key={tag} className="px-3 py-1 bg-card/5 rounded-full text-[10px] text-background/80 border border-transparent uppercase tracking-tighter">{tag}</span>
 ))}
 </div>
 </div>
 </div>
 </div>
 ))}
 <div className="w-8 shrink-0"></div>
 </div>
 </section>

 {/* SECTION: THE SOUND OF ORIENT */}
 <section className="py-32 bg-[#080808]">
 <div className="max-w-7xl mx-auto px-6">
 <div className="text-center mb-16">
 <h2 className="font-newsreader italic text-4xl md:text-5xl text-background mb-4">The Sound of Orient</h2>
 <p className="text-muted-foreground font-light uppercase tracking-[0.2em] text-[10px]">Curated jazz and deep rhythms evolve with the evening.</p>
 </div>
 <div className="flex items-center justify-center gap-1.5 h-48 mb-24 overflow-hidden px-10">
 {[...Array(60)].map((_, i) => (
 <div 
 key={i} 
 className="w-1 bg-primary-gold/40 rounded-full waveform-bar"
 style={{
 height: `${Math.random() * 80 + 20}%`,
 animationDelay: `${i * 0.05}s`
 }}
 ></div>
 ))}
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
 <div className="space-y-4">
 <h3 className="text-[10px] text-primary-gold font-bold uppercase tracking-[0.4em] mb-6">Curated Playlist</h3>
 {[
 { title: 'Midnight Jazz Session', meta: 'Live Now • 03 BPM', time: '02:14' },
 { title: 'Live Nock', meta: 'Rare Names • Guests', time: '02:25' },
 { title: 'Fresh Rhythms', meta: 'Live Now • 03 BPM', time: '02:30' }
 ].map((track, i) => (
 <div key={track.title + i} className="group flex items-center justify-between p-5 bg-card/5 rounded-sm hover:bg-primary-gold/10 border border-transparent hover:border-primary-gold/20 transition-all cursor-pointer">
 <div className="flex items-center gap-6">
 <div className="w-10 h-10 rounded-full border border-primary-gold/30 flex items-center justify-center group-hover:bg-primary-gold group-hover:text-foreground transition-all">
 <span className="material-icons text-primary-gold group-hover:text-foreground text-sm">play_arrow</span>
 </div>
 <div>
 <h4 className="text-sm font-medium text-background tracking-wide">{track.title}</h4>
 <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{track.meta}</p>
 </div>
 </div>
 <span className="text-[10px] font-mono text-primary-gold/60">{track.time}</span>
 </div>
 ))}
 </div>
 <div className="space-y-4 pt-12">
 {[
 { title: 'Flow Neck', meta: 'Best Hands • Guests', time: '02:15' },
 { title: 'Midnight Jazz Session', meta: 'Live Now • 03 BPM', time: '02:20' },
 { title: 'Midnight Jazz Session', meta: 'Live Now • 03 BPM', time: '04:20' }
 ].map((track, i) => (
 <div key={track.title + i} className="group flex items-center justify-between p-5 bg-card/5 rounded-sm hover:bg-primary-gold/10 border border-transparent hover:border-primary-gold/20 transition-all cursor-pointer">
 <div className="flex items-center gap-6">
 <div className="w-10 h-10 rounded-full border border-primary-gold/30 flex items-center justify-center group-hover:bg-primary-gold group-hover:text-foreground transition-all">
 <span className="material-icons text-primary-gold group-hover:text-foreground text-sm">play_arrow</span>
 </div>
 <div>
 <h4 className="text-sm font-medium text-background tracking-wide">{track.title}</h4>
 <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{track.meta}</p>
 </div>
 </div>
 <span className="text-[10px] font-mono text-primary-gold/60">{track.time}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* SECTION: THE ELITE SANCTUARY (Booking Preview) */}
 <section className="py-32 bg-[#050505]">
 <div className="max-w-7xl mx-auto px-6">
 <div className="text-center mb-20">
 <h2 className="font-newsreader italic text-4xl md:text-5xl text-background mb-4">The Elite Sanctuary</h2>
 <p className="text-muted-foreground font-light uppercase tracking-[0.2em] text-[10px]">Choose your preferred vantage point.</p>
 </div>
 <div className="flex overflow-x-auto gap-8 pb-10 hide-scrollbar">
 {[
 { name: 'The Nook', img: 'https://images.unsplash.com/photo-1574091602636-c95191b70990?auto=format&fit=crop&q=80&w=800' },
 { name: 'Lounge A', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800' },
 { name: 'Private Balcony', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800' },
 { name: 'The Vault', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800' }
 ].map((zone, i) => (
 <div key={zone.name + i} className="shrink-0 w-[300px] md:w-[420px] group relative">
 <div className="aspect-video overflow-hidden rounded-sm relative mb-6">
 <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={zone.img} alt={zone.name} />
 <div className="absolute top-4 right-4 bg-primary-gold text-foreground text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-widest uppercase shadow-lg">VIP</div>
 </div>
 <div className="flex justify-between items-start">
 <div>
 <h3 className="font-newsreader italic text-2xl text-background mb-4 tracking-wide">{zone.name}</h3>
 <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Booking Info</p>
 <p className="text-xs text-primary-gold uppercase tracking-widest font-medium">Booth 4 • Ground Floor</p>
 </div>
 <div className="text-right">
 <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 mt-10">Min Spend</p>
 <p className="text-xl font-light text-background">$500</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* SECTION: MIDNIGHT CONCIERGE (Form) */}
 <section className="py-32 bg-[#080808]">
 <div className="max-w-6xl mx-auto px-6">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
 <div className="text-center lg:text-left">
 <div className="mb-10 text-center flex flex-col items-center lg:items-start">
 <span className="material-icons text-primary-gold text-5xl mb-6 opacity-80">face</span>
 <h3 className="font-serif italic text-3xl mb-4"><span className="text-primary-gold">Mask</span> Assistant</h3>
 <p className="text-muted-foreground font-light text-sm max-w-sm leading-relaxed mb-12 italic">
 Exclusive bespoke reservations within <br/> Ingenious form for high-end events.
 </p>
 </div>
 <h2 className="font-newsreader italic text-4xl md:text-5xl text-background mb-6 leading-tight">Midnight Concierge</h2>
 <p className="text-muted-foreground font-light uppercase tracking-[0.2em] text-[10px]">Dedicated premium booking flow with an elegant form for high-end events.</p>
 </div>
 
 <div className="bg-[#121212] p-10 md:p-14 rounded-sm border border-transparent shadow-2xl relative overflow-hidden group">
 <div className="absolute inset-0 bg-primary-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <form className="relative z-10 space-y-8">
 <div>
 <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block font-bold">Date</label>
 <input className="w-full bg-black border border-transparent p-5 rounded-sm outline-none focus:border-primary-gold transition-all text-sm font-light tracking-widest text-background" type="date" />
 </div>
 <div className="grid grid-cols-2 gap-6">
 <div>
 <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block font-bold">Arrival</label>
 <select className="w-full bg-black border border-transparent p-5 rounded-sm outline-none focus:border-primary-gold transition-all text-sm font-light text-background">
 <option>20:00</option>
 <option>21:00</option>
 </select>
 </div>
 <div>
 <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block font-bold">Departure</label>
 <select className="w-full bg-black border border-transparent p-5 rounded-sm outline-none focus:border-primary-gold transition-all text-sm font-light text-background">
 <option>21:00</option>
 <option>22:00</option>
 </select>
 </div>
 </div>
 <div>
 <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block font-bold">Guests</label>
 <select className="w-full bg-black border border-transparent p-5 rounded-sm outline-none focus:border-primary-gold transition-all text-sm font-light tracking-widest text-background">
 <option>2 Guests</option>
 <option>4 Guests</option>
 <option>Private Event</option>
 </select>
 </div>
 <button className="w-full bg-primary-gold text-foreground py-5 rounded-sm font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-card transition-all shadow-lg mt-4">
 Continue Reservation
 </button>
 </form>
 </div>
 </div>
 </div>
 </section>

 </div>
 );
};

export default Visualizer;
