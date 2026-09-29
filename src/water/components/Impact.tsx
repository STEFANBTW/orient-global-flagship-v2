import React from 'react';

const Impact: React.FC = () => {
 return (
 <div className="min-h-screen pt-20 bg-background-light transition-colors duration-500">
 {/* Hero Split */}
 <div className="relative h-[600px] flex flex-col md:flex-row">
 <div className="w-full md:w-1/2 relative h-full">
 <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Community" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-12">
 <div>
 <h1 className="text-background text-4xl md:text-5xl font-bold mb-4">Nourishing Communities,<br/>Empowering Lives.</h1>
 <p className="text-background/80 text-xl"><span className="material-icons align-middle mr-2 text-sm">location_on</span>Jos, Nigeria.</p>
 </div>
 </div>
 </div>
 <div className="w-full md:w-1/2 bg-card flex items-center justify-center p-12 transition-colors duration-500">
 <div className="max-w-md">
 <span className="text-green-600 font-bold tracking-widest uppercase text-xs mb-2 block">Sustainability Initiative</span>
 <h2 className="text-3xl font-bold text-foreground mb-6">Our "Zero Plastic Waste" Initiative: The 19L Dispenser Lifecycle</h2>
 <p className="text-muted-foreground leading-relaxed mb-8">
 We believe in a circular economy. Our sturdy 19L dispenser bottles are designed for hundreds of reuses, drastically reducing single-use plastic in our landfills.
 </p>
 <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors">
 Explore the Process
 </button>
 </div>
 </div>
 </div>

 {/* Recycling Loop Visual */}
 <div className="py-24 bg-blue-50 transition-colors duration-500">
 <div className="max-w-5xl mx-auto px-4">
 <div className="text-center mb-16">
 <h2 className="text-2xl font-bold text-foreground ">The Recycling Loop</h2>
 <p className="text-muted-foreground ">How we maintain zero waste.</p>
 </div>

 <div className="relative">
 {/* Central line */}
 <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-green-200 -translate-x-1/2 hidden md:block border-l border-dashed border-green-400 "></div>

 <div className="space-y-12 md:space-y-24">
 {/* Step 1 */}
 <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
 <div className="w-full md:w-1/2 text-right pr-8 hidden md:block">
 <h3 className="text-xl font-bold text-foreground ">Production & Delivery</h3>
 <p className="text-sm text-muted-foreground ">Clean 19L bottles enter the cycle.</p>
 </div>
 <div className="w-16 h-16 rounded-full bg-card border-4 border-green-500 flex items-center justify-center shadow-lg text-green-600 font-bold text-xl">1</div>
 <div className="w-full md:w-1/2 pl-8 md:block flex flex-col items-center text-center md:text-left">
 <div className="block md:hidden mb-2">
 <h3 className="text-xl font-bold text-foreground ">Production & Delivery</h3>
 </div>
 <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=200&q=80" className="w-32 h-32 rounded-full object-cover border-4 border-transparent shadow-md" alt="Delivery" />
 </div>
 </div>

 {/* Step 2 */}
 <div className="flex flex-col md:flex-row-reverse items-center gap-8 relative z-10">
 <div className="w-full md:w-1/2 text-left pl-8 hidden md:block">
 <h3 className="text-xl font-bold text-foreground ">Community Use & Return</h3>
 <p className="text-sm text-muted-foreground ">Families use water, bottles are collected.</p>
 </div>
 <div className="w-16 h-16 rounded-full bg-card border-4 border-green-500 flex items-center justify-center shadow-lg text-green-600 font-bold text-xl">2</div>
 <div className="w-full md:w-1/2 pr-8 md:block flex flex-col items-center text-center md:text-right">
 <div className="block md:hidden mb-2">
 <h3 className="text-xl font-bold text-foreground ">Community Use & Return</h3>
 </div>
 <div className="flex justify-end w-full md:w-auto">
 <img src="https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=200&q=80" className="w-32 h-32 rounded-full object-cover border-4 border-transparent shadow-md mx-auto md:mx-0" alt="Use" />
 </div>
 </div>
 </div>

 {/* Step 3 */}
 <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
 <div className="w-full md:w-1/2 text-right pr-8 hidden md:block">
 <h3 className="text-xl font-bold text-foreground ">Sanitization & Refill</h3>
 <p className="text-sm text-muted-foreground ">Intense sterilization for reuse.</p>
 </div>
 <div className="w-16 h-16 rounded-full bg-card border-4 border-green-500 flex items-center justify-center shadow-lg text-green-600 font-bold text-xl">3</div>
 <div className="w-full md:w-1/2 pl-8 md:block flex flex-col items-center text-center md:text-left">
 <div className="block md:hidden mb-2">
 <h3 className="text-xl font-bold text-foreground ">Sanitization & Refill</h3>
 </div>
 <img src="https://images.unsplash.com/photo-1584036561566-b93a50208c3c?auto=format&fit=crop&w=200&q=80" className="w-32 h-32 rounded-full object-cover border-4 border-transparent shadow-md" alt="Sanitize" />
 </div>
 </div>

 {/* Step 4 */}
 <div className="flex flex-col md:flex-row-reverse items-center gap-8 relative z-10">
 <div className="w-full md:w-1/2 text-left pl-8 hidden md:block">
 <h3 className="text-xl font-bold text-foreground ">Material Recovery</h3>
 <p className="text-sm text-muted-foreground ">Damaged bottles are recycled into new products.</p>
 </div>
 <div className="w-16 h-16 rounded-full bg-card border-4 border-green-500 flex items-center justify-center shadow-lg text-green-600 font-bold text-xl">4</div>
 <div className="w-full md:w-1/2 pr-8 md:block flex flex-col items-center text-center md:text-right">
 <div className="block md:hidden mb-2">
 <h3 className="text-xl font-bold text-foreground ">Material Recovery</h3>
 </div>
 <div className="flex justify-end w-full md:w-auto">
 <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=200&q=80" className="w-32 h-32 rounded-full object-cover border-4 border-transparent shadow-md mx-auto md:mx-0" alt="Recycle" />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Impact Stories */}
 <div className="py-24 bg-card transition-colors duration-500">
 <div className="max-w-7xl mx-auto px-4">
 <h2 className="text-3xl font-bold text-center mb-12 text-foreground ">Impact Stories <span className="block text-sm font-normal text-muted-foreground mt-2">Voices of Change</span></h2>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="rounded-xl overflow-hidden shadow-lg group relative cursor-pointer">
 <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" alt="Video Thumb" />
 <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
 <span className="material-icons text-background text-6xl">play_circle</span>
 </div>
 <div className="p-4 bg-card ">
 <h3 className="font-bold text-foreground ">Staff Interview: Musa, Delivery Driver</h3>
 <p className="text-sm text-muted-foreground ">On delivering clean water and its impact.</p>
 </div>
 </div>
 <div className="rounded-xl overflow-hidden shadow-lg group relative cursor-pointer">
 <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" alt="Video Thumb" />
 <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
 <span className="material-icons text-background text-6xl">play_circle</span>
 </div>
 <div className="p-4 bg-card ">
 <h3 className="font-bold text-foreground ">Community Member: Mrs. Fatima, Jos</h3>
 <p className="text-sm text-muted-foreground ">How clean water changed her family's health.</p>
 </div>
 </div>
 </div>

 {/* Partners */}
 <div className="mt-20 bg-green-50 rounded-2xl p-8">
 <h3 className="text-center font-bold text-foreground mb-8">Growing Together: Local Schools & Hospitals</h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {['Jos Central Primary', 'Plateau Specialist Hospital', 'Hillside Academy', 'Community Health Center'].map((name, i) => (
 <div key={i} className="flex flex-col items-center text-center">
 <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-sm mb-3">
 <span className="material-icons text-green-600 ">school</span>
 </div>
 <span className="text-sm font-bold text-foreground/80 ">{name}</span>
 <span className="text-xs text-muted-foreground ">Partner since 2018</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default Impact;