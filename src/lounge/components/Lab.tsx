
import React from 'react';

const Lab: React.FC = () => {
 return (
 <div className="bg-background-dark font-display text-background overflow-x-hidden min-h-screen">
 {/* Hero */}
 <section className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden">
 <div className="absolute inset-0 w-full h-full">
 <img className="w-full h-full object-cover animate-[hero-pan_30s_infinite_alternate]" alt="Lit cigar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa7JuvXQNp2lTMLEOllsid_J3ttz_2QGFpL4Roq-OQ6TfYiH2gQjrwf8IdmtCMbYX46-HMbf5F9oROl_osce0l8l7v_gl2YgOsvFEC56Htk67UF_deHy9rAW7rfAcRj8WBunSqAjUeAtiV8b7FRcGZlWTjJKKpRz0tmopgY76IOLKoOA53bjBYBCLLu9Slce22zcOfiI5kd2J6wOOCdDFbSb2B6SBZK_CGO6nGcBvRPzbTjmOOSZ8o0eSl8VhUg9JVKvIzqosfpqJ6" />
 <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent"></div>
 </div>
 <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div className="space-y-8">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
 <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
 <span className="text-xs font-medium text-primary uppercase tracking-widest">Digital Sommelier v4.0</span>
 </div>
 <h1 className="text-6xl md:text-8xl font-bold leading-tight text-background tracking-tighter">
 The Art of <br/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">The Draw.</span>
 </h1>
 <p className="text-xl text-background/80 max-w-lg leading-relaxed border-l-2 border-primary pl-6">
 Discover the perfect alchemy between spirit and smoke. Enter the Orient Lounge pairing lab.
 </p>
 </div>
 </div>
 </section>

 {/* The Lab Input */}
 <section className="py-32 bg-background-dark relative">
 <div className="max-w-5xl mx-auto px-6">
 <div className="text-center mb-16">
 <h2 className="text-4xl md:text-5xl font-bold mb-4">The Concierge Lab</h2>
 <p className="text-muted-foreground">Tell us your drink of choice, and our AI will curate the ideal cigar companion.</p>
 </div>
 <div className="bg-foreground text-background border border-transparent rounded-2xl p-8 md:p-12 shadow-2xl">
 <div className="flex flex-col md:flex-row gap-4">
 <input className="flex-grow bg-black border border-transparent rounded-xl py-4 px-6 text-background placeholder:text-muted-foreground outline-none focus:border-primary transition-all" placeholder="e.g., Macallan 18, Cognac..." />
 <button className="bg-primary text-foreground font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-yellow-400">
 <span>Find Match</span>
 <span className="material-icons">auto_awesome</span>
 </button>
 </div>

 <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-transparent pt-10">
 <div className="md:col-span-7 space-y-6">
 <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase rounded-full">98% Match Score</span>
 <h3 className="text-3xl font-bold">Cohiba Behike 52</h3>
 <p className="text-background/80 leading-relaxed">A legendary Cuban cigar known for its rare medio tiempo leaves. Creamy, earthy, sublime.</p>
 <div className="grid grid-cols-3 gap-4">
 <div className="bg-black p-4 rounded-lg text-center border border-transparent">
 <div className="text-primary font-bold">Full</div>
 <div className="text-[10px] uppercase text-muted-foreground">Body</div>
 </div>
 <div className="bg-black p-4 rounded-lg text-center border border-transparent">
 <div className="text-primary font-bold">45m</div>
 <div className="text-[10px] uppercase text-muted-foreground">Duration</div>
 </div>
 <div className="bg-black p-4 rounded-lg text-center border border-transparent">
 <div className="text-primary font-bold">Cuba</div>
 <div className="text-[10px] uppercase text-muted-foreground">Origin</div>
 </div>
 </div>
 </div>
 <div className="md:col-span-5 h-64 rounded-xl overflow-hidden border border-transparent">
 <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4qgfvQRf4kKImHbqpS4a2JdOhIBrb534G6yJ8NnblGiZsTskQw35B-UfOA5DIJpqH6R5o8tLpocuaflfLgBaw9t5E1qTFcHDriDtKqtZ9z55DWc1QewBXUZGIQIkHf8NipYGp7XOqx1of-rzgHJM_cZhMVshvrmpeQWMLMiDu0qthF2TLiliABjgX30Ltl37mgEsg1eju6vwCD1Ac8Q76eWvy6a1BLwMR-RcjNCiJ_JQvQwH46MXjw8R9kS1_HYT3LRoscYh0Mr3e" alt="Cigar Match" />
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Flavor Dynamics */}
 <section className="py-32 bg-[#1a160e]">
 <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
 <div>
 <h2 className="text-4xl font-bold mb-12">Flavor Dynamics</h2>
 <div className="space-y-8">
 <div className="flex gap-4 group">
 <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-foreground transition-all">
 <span className="material-icons">forest</span>
 </div>
 <div>
 <h4 className="text-xl font-bold">Oak & Earth</h4>
 <p className="text-muted-foreground text-sm">Interaction between charred oak barrels and soil-rich tobacco.</p>
 </div>
 </div>
 <div className="flex gap-4 group">
 <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-foreground transition-all">
 <span className="material-icons">grain</span>
 </div>
 <div>
 <h4 className="text-xl font-bold">Spice & Leather</h4>
 <p className="text-muted-foreground text-sm">Notes of black pepper and worn leather emerging in the final third.</p>
 </div>
 </div>
 </div>
 </div>
 <div className="flex justify-center">
 <div className="w-80 h-80 rounded-full border-4 border-transparent relative flex items-center justify-center">
 <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
 <div className="text-center">
 <div className="text-5xl font-bold">98%</div>
 <div className="text-[10px] uppercase tracking-widest text-primary">Synergy</div>
 </div>
 </div>
 </div>
 </div>
 </section>
 </div>
 );
};

export default Lab;
