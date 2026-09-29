import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const Wholesale: React.FC = () => {
 const [units, setUnits] = useState(450);

 // Calculation logic for the widget
 const basePricePerUnit = 950;
 // Mock calculation
 const baseTotal = units * basePricePerUnit;
 const discountRate = units > 800 ? 0.20 : units > 400 ? 0.12 : 0.05;
 const discountAmount = baseTotal * discountRate;
 const finalTotal = baseTotal - discountAmount;

 return (
 <div className="bg-foreground text-background text-background font-sans selection:bg-primary selection:text-background pt-0">
 {/* Section 1: Professional Hero */}
 <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
 <div className="absolute inset-0 z-0">
 <img
 alt="High-end banquet catering setup with chefs serving food"
 className="w-full h-full object-cover"
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF_lco6zprEdQlI2LmcDLCSaXVyBB8sfTNRNQBZtPsBrXL6WpfVvb_Rhvg8zDIa-fYvgnDxVUQX-66V4dPxxANmhZdEaMyMlV1R2DZ5AvRfCgjRipVcBIS0HCdHjN5qrXr4CObMPzHS9HXJQHExewlvcHHpf8PDRLfpxYmjw0LFXE-88dpfDQfpkEWHnfqTD6V9dipw-i5Jl4N7SbYSfjM_StPM4T9Y6ww6OIWhf4iWRpr7Utv6DsIBvyjVA64s7c4Ye0yc2R8DPrQ"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
 </div>

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest mb-6"
 >
 <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
 Premium B2B Services
 </motion.div>

 <motion.h1
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-tight tracking-tighter"
 >
 Feeding the Crowd <br/> with <span className="text-primary">Excellence.</span>
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="mt-4 max-w-2xl mx-auto text-lg text-background/80 font-light"
 >
 The trusted partner for hotels, schools, and large-scale events across Plateau State. Precision baking meets reliable logistics.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
 >
 <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 active:scale-95 text-sm">
 <span className="material-icons text-lg">inventory_2</span> Wholesale Portal
 </button>
 <button className="px-8 py-3 bg-card/10 backdrop-blur-sm border border-transparent text-background font-bold rounded-xl hover:bg-card/20 transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 text-sm">
 <span className="material-icons text-lg">calendar_month</span> Event Catering
 </button>
 </motion.div>

 {/* Quick Stats */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.6 }}
 className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-transparent pt-8"
 >
 <div>
 <div className="text-2xl font-bold text-background">50k+</div>
 <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Daily Loaves</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-background">200+</div>
 <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Corporate Partners</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-background">99%</div>
 <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">On-Time Delivery</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-background">Jos</div>
 <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">HQ & Distribution</div>
 </div>
 </motion.div>
 </div>
 </section>

 {/* Section 2: Bulk Ordering Portal */}
 <section className="py-16 bg-foreground text-background relative" id="quick-order">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
 <div>
 <h2 className="text-3xl font-bold text-background mb-2 tracking-tight">Bulk Ordering Portal</h2>
 <p className="text-muted-foreground text-sm">Streamlined procurement for high-volume accounts.</p>
 </div>
 <div className="flex gap-3">
 <button className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/10 transition">
 Price List (PDF)
 </button>
 <button className="text-[10px] font-bold uppercase tracking-widest text-background/80 bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground text-background transition flex items-center gap-2">
 <span className="material-icons text-sm">filter_list</span> Filter
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Data Table */}
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="lg:col-span-2 bg-foreground text-background/50 rounded-2xl border border-transparent overflow-hidden shadow-2xl"
 >
 <div className="overflow-x-auto no-scrollbar">
 <table className="w-full text-left text-sm text-muted-foreground">
 <thead className="bg-foreground text-background text-background font-bold uppercase text-[10px] tracking-widest">
 <tr>
 <th className="px-6 py-4">SKU</th>
 <th className="px-6 py-4">Item Name</th>
 <th className="px-6 py-4 text-right">Price</th>
 <th className="px-6 py-4 text-center">Stock</th>
 <th className="px-6 py-4 text-center">Qty</th>
 <th className="px-6 py-4 text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 <WholesaleRow sku="OB-W-001" name="Premium Family Loaf (Sliced)" price="₦1,200" stock="High" stockColor="text-emerald-500" defaultQty={50} />
 <WholesaleRow sku="OB-P-045" name="Meat Pie Catering Box (24pcs)" price="₦12,500" stock="Med" stockColor="text-amber-500" defaultQty={10} bg />
 <WholesaleRow sku="OB-W-003" name="Whole Wheat Healthy Loaf" price="₦1,500" stock="High" stockColor="text-emerald-500" defaultQty={25} />
 <WholesaleRow sku="OB-D-112" name="Glazed Doughnut Tray (50pcs)" price="₦8,000" stock="High" stockColor="text-emerald-500" defaultQty={5} bg />
 <WholesaleRow sku="OB-B-088" name="Burger Buns (Pack of 12)" price="₦1,800" stock="Low" stockColor="text-rose-500" defaultQty={100} />
 </tbody>
 </table>
 </div>
 </motion.div>

 {/* Savings Calculator Widget */}
 <div className="lg:col-span-1 space-y-6">
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-transparent shadow-lg"
 >
 <div className="flex items-center gap-2 mb-4">
 <span className="material-icons text-primary">calculate</span>
 <h3 className="text-lg font-bold text-background">Bulk Savings</h3>
 </div>
 <p className="text-xs text-muted-foreground mb-6">Enter total units to see your volume discount tier.</p>
 
 <div className="space-y-4">
 <div>
 <label className="block text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Total Units</label>
 <input
 className="w-full h-1.5 bg-foreground text-background rounded-lg appearance-none cursor-pointer accent-primary"
 max="1000"
 min="0"
 type="range"
 value={units}
 onChange={(e) => setUnits(parseInt(e.target.value))}
 />
 <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-bold">
 <span>0</span>
 <span className="text-background">{units} Units</span>
 <span>1000+</span>
 </div>
 </div>

 <div className="p-4 bg-foreground text-background/50 rounded-xl border border-primary/20">
 <div className="flex justify-between items-center mb-2 text-xs">
 <span className="text-muted-foreground">Base Price</span>
 <span className="text-background line-through decoration-rose-500">₦{baseTotal.toLocaleString()}</span>
 </div>
 <div className="flex justify-between items-center mb-2 text-xs">
 <span className="text-primary font-bold">Tier {units > 800 ? '3' : units > 400 ? '2' : '1'} Discount ({(discountRate * 100).toFixed(0)}%)</span>
 <span className="text-primary">-₦{discountAmount.toLocaleString()}</span>
 </div>
 <div className="h-px bg-card/10 my-2"></div>
 <div className="flex justify-between items-center">
 <span className="text-background font-bold text-sm">Est. Total</span>
 <span className="text-background font-bold text-xl">₦{finalTotal.toLocaleString()}</span>
 </div>
 </div>

 <button className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all mt-4 transform active:scale-95 text-sm">
 Apply to Cart
 </button>
 </div>
 </motion.div>

 {/* Alert Box */}
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-xl"
 >
 <div className="flex">
 <div className="flex-shrink-0">
 <span className="material-icons text-primary text-xl">local_shipping</span>
 </div>
 <div className="ml-3">
 <p className="text-xs text-primary font-bold uppercase tracking-widest">Free Delivery</p>
 <p className="text-[11px] text-primary/80 mt-1">
 Orders over ₦200k qualify for free same-day logistics within Jos metropolis.
 </p>
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 </div>
 </section>

 {/* Section 3: The Logistics Map */}
 <section className="py-16 bg-foreground text-background relative overflow-hidden">
 <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-black/20 to-transparent"></div>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 className="order-2 lg:order-1 relative"
 >
 <div className="relative w-full aspect-square md:aspect-[4/3] bg-foreground text-background rounded-2xl overflow-hidden border border-transparent shadow-2xl">
 <img
 alt="Stylized dark map of Jos city showing road networks"
 className="w-full h-full object-cover opacity-30 grayscale invert"
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmprho5MDhuLhOfVgQEqJ-MUQ5tryytP6ON6i2vb0Yoas281JrIx5dNJAucfKXPOOFFUgNLyIFF4GZuXazlicapLXhwWNXITxICQlPYIF5qZZniDLtCUMgTKpW_oYroBsTc7QQXHjG5DrZB2-GZhlhc50WljO155_6CVN9WtYDkI7vb0cr3eUJuULhifa5fu8oEtvjoUZQZig2wEWyhSS28U56WA_hXDK5WNWmWJpkPusDA0D68wwI5alXHGVzZnbZty1Hr66H0pYU"
 />
 <div className="absolute inset-0 p-6 pointer-events-none">
 <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 10 }}>
 <path className="opacity-60" d="M 100 250 Q 200 150 350 100 T 500 150" fill="none" stroke="#f26c0d" strokeDasharray="5,5" strokeWidth="2"></path>
 <circle cx="100" cy="250" fill="#f26c0d" r="4"></circle>
 <circle cx="500" cy="150" fill="#f26c0d" r="4"></circle>
 </svg>
 {/* Hub Marker 1 */}
 <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer">
 <div className="w-4 h-4 bg-primary rounded-full relative">
 <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
 </div>
 </div>
 {/* Hub Marker 2 */}
 <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer">
 <div className="w-3 h-3 bg-card rounded-full"></div>
 </div>
 
 <div className="absolute bottom-4 left-4 bg-foreground text-background/90 backdrop-blur border border-transparent p-4 rounded-xl shadow-lg max-w-xs pointer-events-auto">
 <h4 className="text-background font-bold text-xs mb-1 uppercase tracking-widest">Route: North Jos</h4>
 <div className="flex items-center text-[10px] text-emerald-400 mb-2 font-bold">
 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span> Active Now
 </div>
 <p className="text-[10px] text-muted-foreground">Truck #OB-44 is currently near University of Jos. ETA to next stop: 15 mins.</p>
 </div>
 </div>
 </div>
 </motion.div>

 <div className="order-1 lg:order-2">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-4">
 <span className="material-icons text-lg">local_shipping</span> Logistics Network
 </div>
 <h2 className="text-3xl md:text-4xl font-bold text-background mb-6 tracking-tight">Precision Delivery Across The Plateau</h2>
 <p className="text-muted-foreground text-base mb-8 leading-relaxed">
 Our dedicated fleet ensures your wholesale orders arrive fresh and on schedule. We operate specialized routes for schools, hotels, and retail partners with real-time tracking capabilities.
 </p>
 <ul className="space-y-6">
 <WholesaleFeature icon="schedule" title="Scheduled Windows" desc="Choose from Morning (6AM-9AM) or Afternoon (2PM-5PM) delivery slots guaranteed." />
 <WholesaleFeature icon="thermostat" title="Climate Controlled" desc="Our vans are equipped to maintain optimal temperature for pastries and sensitive items." />
 </ul>
 </motion.div>
 </div>
 </div>
 </div>
 </section>

 {/* Section 4: Event Inquiry */}
 <section className="py-16 bg-foreground text-background border-t border-transparent">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-10">
 <h2 className="text-3xl font-bold text-background mb-4 tracking-tight">Plan Your Event Catering</h2>
 <p className="text-muted-foreground text-sm">Tell us about your occasion. We'll craft the perfect bakery menu.</p>
 </div>

 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="bg-foreground text-background/50 rounded-3xl border border-transparent shadow-2xl overflow-hidden"
 >
 <div className="bg-foreground text-background h-1.5 w-full">
 <div className="bg-primary h-full w-2/3" role="progressbar"></div>
 </div>
 <div className="p-8 md:p-10">
 <div className="flex justify-between items-center mb-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
 <span className="text-primary">Step 2 of 3</span>
 <span>Event Details</span>
 </div>

 <form className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <WholesaleFormField label="Event Type" type="select" options={['Wedding Reception', 'Corporate Gala', 'Birthday Party', 'Conference']} />
 <WholesaleFormField label="Event Date" type="date" />
 <WholesaleFormField label="Expected Guests" type="number" placeholder="e.g. 250" />
 <WholesaleFormField label="Budget Range (₦)" type="select" options={['₦100k - ₦250k', '₦250k - ₦500k', '₦500k+']} />
 </div>

 <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
 <div>
 <h4 className="text-background font-bold text-sm">Schedule a Tasting Session?</h4>
 <p className="text-[10px] text-muted-foreground">Visit our HQ to sample selected menu items before finalizing.</p>
 </div>
 <label className="relative inline-flex items-center cursor-pointer">
 <input defaultChecked className="sr-only peer" type="checkbox" />
 <div className="w-10 h-5 bg-foreground text-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-transparent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
 </label>
 </div>

 <div className="flex justify-between items-center pt-6 border-t border-transparent">
 <button className="text-muted-foreground hover:text-background font-bold text-xs uppercase tracking-widest px-6 py-2" type="button">Back</button>
 <button className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all transform active:scale-95 text-sm" type="button">
 Continue
 </button>
 </div>
 </form>
 </div>
 </motion.div>
 </div>
 </section>

 {/* Section 5: Trust Pillars */}
 <section className="py-16 bg-foreground text-background border-t border-transparent">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
 <TrustPillar icon="verified_user" iconColor="text-emerald-500" title="NAFDAC Certified" desc="Fully compliant with all national food safety regulations. Reg No: A1-4589L." />
 <div className="flex flex-col items-center">
 <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary mb-6 relative">
 <div className="absolute inset-0 border border-primary rounded-full animate-ping opacity-20"></div>
 <span className="font-bold text-lg text-primary tracking-tighter leading-tight">NAIJA<br/>MADE</span>
 </div>
 <h3 className="text-lg font-bold text-background mb-2">Proudly Nigerian</h3>
 <p className="text-muted-foreground text-xs max-w-xs">Sourcing 90% of our flour and ingredients from local farmers in Northern Nigeria.</p>
 </div>
 <TrustPillar icon="workspace_premium" iconColor="text-sky-400" title="Premium Standards" desc="ISO 9001:2015 compliant processes ensuring consistency in every loaf." />
 </div>
 </div>
 </section>
 </div>
 );
};

const WholesaleRow: React.FC<{ sku: string; name: string; price: string; stock: string; stockColor: string; defaultQty: number; bg?: boolean }> = ({ sku, name, price, stock, stockColor, defaultQty, bg }) => (
 <tr className={`hover:bg-card/5 transition-colors ${bg ? 'bg-card/[0.02]' : ''}`}>
 <td className="px-6 py-4 font-mono text-primary text-[10px]">{sku}</td>
 <td className="px-6 py-4 font-bold text-background text-xs">{name}</td>
 <td className="px-6 py-4 text-right font-bold text-background text-xs">{price}</td>
 <td className={`px-6 py-4 text-center font-bold text-[10px] uppercase tracking-widest ${stockColor}`}>{stock}</td>
 <td className="px-6 py-4 text-center">
 <input className="w-16 bg-foreground text-background border border-transparent rounded-lg px-2 py-1 text-center text-background focus:ring-primary focus:border-primary text-xs outline-none font-bold" min="1" type="number" defaultValue={defaultQty} />
 </td>
 <td className="px-6 py-4 text-right">
 <button className="text-primary hover:text-background transition transform active:scale-75">
 <span className="material-icons text-lg">add_shopping_cart</span>
 </button>
 </td>
 </tr>
);

const WholesaleFeature: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
 <li className="flex items-start">
 <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary mt-1">
 <span className="material-icons text-xl">{icon}</span>
 </div>
 <div className="ml-4">
 <h4 className="text-base font-bold text-background tracking-tight">{title}</h4>
 <p className="text-muted-foreground text-xs leading-relaxed mt-1">{desc}</p>
 </div>
 </li>
);

const WholesaleFormField: React.FC<{ label: string; type: string; options?: string[]; placeholder?: string }> = ({ label, type, options, placeholder }) => (
 <div className="space-y-2">
 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</label>
 {type === 'select' ? (
 <select className="block w-full bg-foreground text-background border border-transparent rounded-xl text-background py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none text-xs font-bold">
 {options?.map(opt => <option key={opt}>{opt}</option>)}
 </select>
 ) : (
 <input type={type} placeholder={placeholder} className="block w-full bg-foreground text-background border border-transparent rounded-xl text-background py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-xs font-bold" />
 )}
 </div>
);

const TrustPillar: React.FC<{ icon: string; title: string; desc: string; iconColor: string }> = ({ icon, title, desc, iconColor }) => (
 <div className="flex flex-col items-center">
 <div className="h-16 w-16 rounded-2xl bg-card/5 flex items-center justify-center border border-transparent mb-6">
 <span className={`material-icons text-3xl ${iconColor}`}>{icon}</span>
 </div>
 <h3 className="text-lg font-bold text-background mb-2 tracking-tight">{title}</h3>
 <p className="text-muted-foreground text-xs max-w-xs">{desc}</p>
 </div>
);
