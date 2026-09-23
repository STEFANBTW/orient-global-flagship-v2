
import React from 'react';

const Menu: React.FC = () => {
 return (
 <div className="bg-[#050505] font-newsreader text-white min-h-screen selection:bg-primary-gold selection:text-foreground">
 {/* Header */}
 <header className="relative h-[85vh] flex items-center justify-center overflow-hidden">
 <div className="absolute inset-0">
 <img 
 className="w-full h-full object-cover animate-[hero-pan_30s_infinite_alternate]" 
 src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000" 
 alt="Menu Atmosphere" 
 />
 <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/40 to-[#050505]"></div>
 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-60"></div>
 </div>
 <div className="relative z-10 text-center max-w-5xl px-6 pt-20">
 <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-up">
 <div className="h-[1px] w-12 bg-primary-gold/50"></div>
 <p className="text-primary-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Collection</p>
 <div className="h-[1px] w-12 bg-primary-gold/50"></div>
 </div>
 <h1 className="text-7xl md:text-9xl italic font-light drop-shadow-2xl mb-8 leading-[0.9]">
 Visual <span className="not-italic font-display font-thin text-background/50">&</span> <br/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-gold via-white to-primary-gold">Sensory</span>
 </h1>
 <p className="text-background/80 font-display text-sm tracking-wide max-w-lg mx-auto leading-relaxed border-t border-b border-transparent py-6 mt-10 backdrop-blur-sm">
 A curated anthology where every pour and plate is a masterpiece. Browse our visual archive of rare vintages, molecular mixology, and charcoal-fired delicacies.
 </p>
 </div>
 </header>

 {/* SECTION: SIGNATURE COCKTAILS */}
 <section className="py-24 px-6 max-w-[1400px] mx-auto">
 <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-2">
 <div>
 <h2 className="text-5xl md:text-6xl italic text-background mb-4">Signature Mixology</h2>
 <p className="font-display text-xs text-primary-gold uppercase tracking-[0.2em] font-bold">Molecular & Classic Reinterpretations</p>
 </div>
 <p className="font-display text-xs text-muted-foreground mt-4 md:mt-0 max-w-xs text-right hidden md:block">
 Designed to stimulate the palate and evoke nostalgia through scent and smoke.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {[
 { 
 name: 'The Zobo Royale', price: '₦12,000', 
 desc: 'Hibiscus flower infusion, ginger spice, premium vodka, garnished with candied pineapple.',
 tags: ['Local', 'Spicy'],
 img: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=800'
 },
 { 
 name: 'Lagos Island Iced Tea', price: '₦15,000', 
 desc: 'A potent mix of 5 white spirits, splash of Chapman, finished with blue curacao.',
 tags: ['Strong', 'Party'],
 img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800'
 },
 { 
 name: 'Golden Geisha', price: '₦28,000', 
 desc: 'Yuzu infusion, premium vodka, sake vermouth, adorned with 24k gold leaf.',
 tags: ['Citrus', 'Luxurious'],
 img: 'https://images.unsplash.com/photo-1572116469696-9587215f2faa?auto=format&fit=crop&q=80&w=800'
 },
 { 
 name: 'Midnight Espresso', price: '₦10,000', 
 desc: 'Cold brew concentrate, coffee liqueur, vanilla bean, smoked sea salt rim.',
 tags: ['Rich', 'Energizing'],
 img: 'https://images.unsplash.com/photo-1629249623868-b79e248b649d?auto=format&fit=crop&q=80&w=800'
 },
 { 
 name: 'Spiced Pear Mule', price: '₦11,000', 
 desc: 'Grey Goose La Poire, house ginger beer, cinnamon stick, star anise.',
 tags: ['Spicy', 'Crisp'],
 img: 'https://images.unsplash.com/photo-1530991037767-1d5423854199?auto=format&fit=crop&q=80&w=800'
 },
 { 
 name: 'Palm Wine Punch', price: '₦8,000', 
 desc: 'Fresh palm wine, coconut rum, fresh lime, served in a bamboo cup.',
 tags: ['Traditional', 'Sweet'],
 img: 'https://images.unsplash.com/photo-1536935338788-843bb5287c96?auto=format&fit=crop&q=80&w=800'
 }
 ].map((item, i) => (
 <div key={i} className="group relative bg-[#0a0a0a] border border-transparent hover:border-primary-gold/30 transition-all duration-500 overflow-hidden flex flex-col">
 <div className="relative aspect-[4/5] overflow-hidden">
 <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90"></div>
 <div className="absolute bottom-6 left-6 right-6">
 <div className="flex justify-between items-end mb-2">
 <h3 className="text-3xl text-background font-serif italic leading-none">{item.name}</h3>
 <span className="font-display text-lg text-primary-gold font-bold">{item.price}</span>
 </div>
 </div>
 </div>
 <div className="p-8 pt-2 flex-grow flex flex-col justify-between">
 <p className="font-display text-sm text-muted-foreground leading-relaxed mb-6">{item.desc}</p>
 <div className="flex gap-2">
 {item.tags.map(tag => (
 <span key={tag} className="px-3 py-1 border border-transparent rounded-full text-[10px] uppercase tracking-widest text-muted-foreground group-hover:border-primary-gold/20 group-hover:text-primary-gold transition-all">
 {tag}
 </span>
 ))}
 </div>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* SECTION: ROASTED MEATS (Darker Theme) */}
 <section className="py-32 bg-[#080808] relative">
 <div className="max-w-[1400px] mx-auto px-6 relative z-20">
 <div className="text-center mb-24">
 <span className="material-icons text-orange-500/50 text-4xl mb-4 animate-pulse">local_fire_department</span>
 <h2 className="text-6xl md:text-7xl italic text-background mb-6">Charcoal & Flame</h2>
 <p className="font-display text-primary-gold uppercase tracking-[0.3em] text-xs">Robatayaki & Slow Roast</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
 {[
 {
 name: 'Suya Spiced Lamb Chops',
 price: '₦45,000',
 desc: 'Grilled to perfection with Yaji spice, served with mint yogurt dip.',
 detail: 'Spicy',
 img: 'https://images.unsplash.com/photo-1558030006-4506719b7435?auto=format&fit=crop&q=80&w=800'
 },
 {
 name: 'Smoked Duck Breast',
 price: '₦32,000',
 desc: 'Cherry wood smoked, plum glaze, star anise reduction.',
 detail: 'Medium Rare',
 img: 'https://images.unsplash.com/photo-1627916579294-0d7e63b6528d?auto=format&fit=crop&q=80&w=800'
 },
 {
 name: 'Roasted Bone Marrow',
 price: '₦24,000',
 desc: 'Herb crust, parsley shallot salad, grilled sourdough.',
 detail: 'Rich',
 img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'
 },
 {
 name: 'Charred Octopus',
 price: '₦28,000',
 desc: 'Spanish octopus, romesco sauce, burnt lemon, chorizo oil.',
 detail: 'Tender',
 img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800'
 },
 {
 name: 'Slow-Roasted Goat Leg',
 price: '₦38,000',
 desc: '12-hour slow roast, pomegranate molasses, pistachio dukkah.',
 detail: 'Succulent',
 img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?auto=format&fit=crop&q=80&w=800'
 },
 {
 name: 'Tomahawk Steak',
 price: '₦120,000',
 desc: '32oz dry-aged ribeye, rosemary butter, roasted garlic head.',
 detail: 'Shareable',
 img: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800'
 }
 ].map((dish, i) => (
 <div key={i} className="group relative h-[400px] overflow-hidden rounded-lg border border-transparent">
 <img src={dish.img} alt={dish.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.7] group-hover:brightness-100" />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
 
 <div className="absolute bottom-0 left-0 w-full p-8 transition-transform duration-500 transform translate-y-2 group-hover:translate-y-0">
 <div className="flex justify-between items-center mb-2">
 <span className="text-[10px] uppercase tracking-widest text-orange-500/90 bg-black/50 px-2 py-1 backdrop-blur-md rounded">{dish.detail}</span>
 <span className="font-display font-bold text-xl text-primary-gold">{dish.price}</span>
 </div>
 <h3 className="text-4xl text-background italic font-serif mb-2">{dish.name}</h3>
 <p className="font-display text-sm text-background/80 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{dish.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* SECTION: RARE SPIRITS */}
 <section className="py-32 px-6 max-w-[1400px] mx-auto border-b border-transparent">
 <div className="flex items-center gap-4 mb-16 justify-center">
 <div className="w-10 h-10 rounded-full border border-primary-gold flex items-center justify-center">
 <span className="material-icons text-primary-gold text-sm">liquor</span>
 </div>
 <h2 className="text-5xl italic text-background">Rare Spirits</h2>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
 {[
 { name: 'Macallan M', price: '₦450,000', origin: 'Highland', img: 'https://images.unsplash.com/photo-1527281032555-60dec035c93f?auto=format&fit=crop&q=80&w=800' },
 { name: 'Louis XIII', price: '₦380,000', origin: 'Cognac', img: 'https://images.unsplash.com/photo-1569529465841-dfecd798f639?auto=format&fit=crop&q=80&w=800' },
 { name: 'Hibiki 30', price: '₦500,000', origin: 'Japan', img: 'https://images.unsplash.com/photo-1517551694605-ffbb87886475?auto=format&fit=crop&q=80&w=800' },
 { name: 'Pappy 23', price: '₦220,000', origin: 'Kentucky', img: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?auto=format&fit=crop&q=80&w=800' },
 { name: 'Clase Azul', price: '₦300,000', origin: 'Mexico', img: 'https://images.unsplash.com/photo-1516535794938-606387ce567e?auto=format&fit=crop&q=80&w=800' }
 ].map((spirit, i) => (
 <div key={i} className="group cursor-pointer">
 <div className="aspect-[3/4] overflow-hidden rounded-sm mb-6 relative">
 <img src={spirit.img} alt={spirit.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
 <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-primary-gold/50 transition-all duration-500"></div>
 </div>
 <div className="text-center">
 <h3 className="text-xl text-background font-serif italic mb-1">{spirit.name}</h3>
 <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{spirit.origin}</p>
 <p className="text-primary-gold font-bold text-sm">{spirit.price} <span className="text-[9px] font-normal text-foreground/80">/ 1oz</span></p>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* SECTION: WINE VAULT */}
 <section className="py-32 px-6 max-w-[1400px] mx-auto">
 <div className="flex items-center gap-4 mb-16 justify-center">
 <div className="w-10 h-10 rounded-full border border-primary-gold flex items-center justify-center">
 <span className="material-icons text-primary-gold text-sm">wine_bar</span>
 </div>
 <h2 className="text-5xl italic text-background">The Wine Vault</h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
 {[
 { name: 'Château Margaux', price: '₦1,800,000', origin: 'Bordeaux', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800' },
 { name: 'Opus One 2018', price: '₦650,000', origin: 'Napa Valley', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800' },
 { name: 'Penfolds Grange', price: '₦950,000', origin: 'Australia', img: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=800' },
 { name: 'Tignanello', price: '₦420,000', origin: 'Tuscany', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800' },
 { name: 'Dom Pérignon', price: '₦750,000', origin: 'Champagne', img: 'https://images.unsplash.com/photo-1594453000627-c1d4791723f5?auto=format&fit=crop&q=80&w=800' }
 ].map((wine, i) => (
 <div key={i} className="group cursor-pointer">
 <div className="aspect-[3/4] overflow-hidden rounded-sm mb-6 relative">
 <img src={wine.img} alt={wine.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
 <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-primary-gold/50 transition-all duration-500"></div>
 </div>
 <div className="text-center">
 <h3 className="text-xl text-background font-serif italic mb-1">{wine.name}</h3>
 <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{wine.origin}</p>
 <p className="text-primary-gold font-bold text-sm">{wine.price} <span className="text-[9px] font-normal text-foreground/80">/ btl</span></p>
 </div>
 </div>
 ))}
 </div>
 </section>
 
 </div>
 );
};

export default Menu;
