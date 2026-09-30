import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ConfigState = { tier: number; flavor: string; frosting: string; toppings: string[]; };

export const Architect: React.FC = () => {
 const [step, setStep] = useState(1);
 const [config, setConfig] = useState<ConfigState>({ tier: 2, flavor: 'Vanilla', frosting: 'Buttercream', toppings: [] });

 const tierOptions = [
 { value: 1, label: 'Single Tier', price: 40, desc: 'Serves 10-15' },
 { value: 2, label: 'Double Tier', price: 65, desc: 'Serves 25-30' },
 { value: 3, label: 'Grand Tier', price: 95, desc: 'Serves 50+' },
 ];

 const flavorOptions = [
 { name: 'Vanilla', color: 'none', filter: 'brightness(105%) sepia(20%)', desc: 'Madagascar Bean' },
 { name: 'Chocolate', color: '#5D4037', filter: 'brightness(60%) sepia(80%) hue-rotate(340deg) saturate(150%)', desc: 'Belgian Dark' },
 { name: 'Red Velvet', color: '#C62828', filter: 'brightness(80%) sepia(50%) hue-rotate(310deg) saturate(250%)', desc: 'Classic Southern' },
 { name: 'Lemon', color: '#FBC02D', filter: 'brightness(100%) sepia(100%) hue-rotate(10deg) saturate(150%)', desc: 'Zesty Citrus' },
 ];

 const frostingOptions = [
 { name: 'Buttercream', desc: 'Classic texture', icon: 'blur_on' },
 { name: 'Fondant', desc: 'Smooth finish', icon: 'lens' },
 { name: 'Naked', desc: 'Exposed layers', icon: 'texture' },
 ];

 const toppingOptions = [
 { name: 'Berries', icon: '🍓', price: 5 },
 { name: 'Flowers', icon: '🌸', price: 8 },
 { name: 'Gold Leaf', icon: '✨', price: 12 },
 { name: 'Topper', icon: '🎂', price: 10 },
 ];

 const handleToppingToggle = (name: string) => {
 setConfig(prev => {
 const exists = prev.toppings.includes(name);
 return { ...prev, toppings: exists ? prev.toppings.filter(t => t !== name) : [...prev.toppings, name] };
 });
 };

 const calculateTotal = () => {
 const tierPrice = tierOptions.find(t => t.value === config.tier)?.price || 0;
 const toppingsPrice = config.toppings.reduce((acc, curr) => {
 const top = toppingOptions.find(t => t.name === curr);
 return acc + (top?.price || 0);
 }, 0);
 return tierPrice + toppingsPrice;
 };

 const currentFlavor = flavorOptions.find(f => f.name === config.flavor);
 const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
 const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
 const jumpToStep = (s: number) => setStep(s);

 return (
 <div className="h-screen flex overflow-hidden bg-background pt-0">
 {/* Left Panel: 3D Viewport */}
 <section className="relative flex-grow h-full bg-background flex items-center justify-center overflow-hidden group">
 <div className="relative w-full h-full flex items-center justify-center">
 <AnimatePresence mode='wait'>
 <motion.div
 key={config.tier + config.flavor} // Re-animate on major changes
 initial={{ scale: 0.9, opacity: 0.8 }}
 animate={{ scale: config.tier === 1 ? 0.8 : config.tier === 2 ? 1 : 1.2, opacity: 1 }}
 transition={{ type: "spring", stiffness: 100 }}
 className="relative w-full h-full flex items-center justify-center"
 >
 <img
 alt="3D Cake Render"
 className="max-h-[70%] max-w-[80%] object-contain drop-shadow-2xl transition-all duration-700"
 style={{
 filter: currentFlavor?.filter || 'none', // Simulate frosting texture change slightly via contrast/brightness if needed
 opacity: config.frosting === 'Naked' ? 0.9 : 1
 }}
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjgjqXBUvUI7yxu18cPbEjS1s8IUe5XW_xHaLIr4rMKNABX4YLBU9wyfc9jzXS_72wgh3LEygdAFzWawbgEYl9l56K5jKVevcNj53uFFdozb_fX16MgMXoIUZwbAjcZ3acr816xSDxII3_ETinK7g6fECd9YjnMfzQOZ4a8ETC6ChJfm8vduGzxVmlbogc-Ye-GLnhimriXR1UlqtxeG2ghiYRw2UzyO00cHNlhx7xCNIn_hZyFk9W98hl0w4wRUCjriyWFFU4ZMIa"
 />
 {/* Overlay Toppings */}
 <div className="absolute inset-0 pointer-events-none">
 {config.toppings.includes('Berries') && (
 <>
 <span className="absolute top-[35%] left-[45%] text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🍓</span>
 <span className="absolute top-[40%] right-[42%] text-3xl animate-bounce" style={{ animationDuration: '4s' }}>🍓</span>
 <span className="absolute bottom-[40%] left-[38%] text-3xl">🍓</span>
 </>
 )}
 {config.toppings.includes('Flowers') && (
 <>
 <span className="absolute top-[30%] right-[45%] text-4xl animate-pulse">🌸</span>
 <span className="absolute top-[50%] left-[40%] text-3xl">🌺</span>
 </>
 )}
 {config.toppings.includes('Gold Leaf') && (
 <div className="absolute inset-0 flex items-center justify-center">
 <span className="absolute top-[32%] text-4xl animate-pulse text-yellow-400 opacity-60">✨</span>
 <span className="absolute top-[45%] left-[40%] text-2xl animate-pulse text-yellow-400 opacity-60">✨</span>
 </div>
 )}
 {config.toppings.includes('Topper') && (
 <span className="absolute top-[15%] left-[50%] transform -translate-x-1/2 text-6xl drop-shadow-lg">🎂</span>
 )}
 </div>
 </motion.div>
 </AnimatePresence>
 <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
 </div>

 {/* View Controls */}
 <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-card/70 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-4 shadow-lg">
 <button className="p-2 hover:bg-primary/10 rounded-full transition-colors"><span className="material-icons">rotate_left</span></button>
 <div className="w-px h-4 bg-gray-300 "></div>
 <button className="p-2 hover:bg-primary/10 rounded-full transition-colors"><span className="material-icons">remove</span></button>
 <span className="text-xs font-bold text-muted-foreground">100%</span>
 <button className="p-2 hover:bg-primary/10 rounded-full transition-colors"><span className="material-icons">add</span></button>
 <div className="w-px h-4 bg-gray-300 "></div>
 <button className="p-2 hover:bg-primary/10 rounded-full transition-colors"><span className="material-icons">rotate_right</span></button>
 </div>

 {/* Toggles */}
 <div className="absolute top-6 right-6 flex flex-col gap-2">
 <IconButton icon="wb_sunny" />
 <IconButton icon="grid_4x4" />
 <IconButton icon="fullscreen" />
 </div>
 </section>

 {/* Right Panel: Configurator */}
 <aside className="w-[450px] flex-none bg-card border-l border-border flex flex-col shadow-2xl relative z-10">
 <div className="px-6 py-6 border-b border-border ">
 <div className="flex justify-between items-center mb-2">
 <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {step} of 4</span>
 <span className="text-xs text-muted-foreground font-mono">ID: #CA-8921</span>
 </div>
 <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${(step / 4) * 100}%` }}
 className="h-full bg-primary rounded-full transition-all duration-500"
 ></motion.div>
 </div>
 <div className="flex justify-between mt-2 text-[10px] font-medium text-muted-foreground">
 <span className={step >= 1 ? 'text-primary' : ''}>Base</span>
 <span className={step >= 2 ? 'text-primary' : ''}>Flavor</span>
 <span className={step >= 3 ? 'text-primary' : ''}>Frosting</span>
 <span className={step >= 4 ? 'text-primary' : ''}>Accents</span>
 </div>
 </div>

 <div className="flex-grow overflow-y-auto no-scrollbar px-6 py-8 space-y-6">
 {/* Step 1: Tier */}
 {step === 1 && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <h3 className="text-lg font-bold text-foreground mb-6 font-sans">Select Size & Tier</h3>
 <div className="space-y-3">
 {tierOptions.map((tier) => (
 <button
 key={tier.value}
 onClick={() => setConfig({...config, tier: tier.value})}
 className={`w-full p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all ${
 config.tier === tier.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
 }`}
 >
 <div>
 <span className="block font-bold text-foreground ">{tier.label}</span>
 <span className="text-xs text-muted-foreground">{tier.desc}</span>
 </div>
 <span className="font-bold text-primary">${tier.price}</span>
 </button>
 ))}
 </div>
 </motion.div>
 )}

 {/* Step 2: Flavor */}
 {step === 2 && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
 <h3 className="text-lg font-bold text-foreground mb-6 font-sans">Choose Flavor Profile</h3>
 <div className="grid grid-cols-2 gap-3">
 {flavorOptions.map((flavor) => (
 <button
 key={flavor.name}
 onClick={() => setConfig({...config, flavor: flavor.name})}
 className={`p-4 rounded-xl border-2 text-left transition-all ${
 config.flavor === flavor.name ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
 }`}
 >
 <div className="w-8 h-8 rounded-full mb-3 border border-transparent shadow-sm" style={{ backgroundColor: flavor.color === 'none' ? '#fdf5e6' : flavor.color }}></div>
 <span className="block font-bold text-sm text-foreground ">{flavor.name}</span>
 <span className="text-xs text-muted-foreground">{flavor.desc}</span>
 </button>
 ))}
 </div>
 </motion.div>
 )}

 {/* Step 3: Frosting */}
 {step === 3 && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
 <h3 className="text-lg font-bold text-foreground mb-6 font-sans">Frosting Style</h3>
 <div className="space-y-3">
 {frostingOptions.map((opt) => (
 <button
 key={opt.name}
 onClick={() => setConfig({...config, frosting: opt.name})}
 className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
 config.frosting === opt.name ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'
 }`}
 >
 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.frosting === opt.name ? 'bg-card shadow-sm' : 'bg-background '}`}>
 <span className={`material-icons ${config.frosting === opt.name ? 'text-primary' : 'text-muted-foreground'}`}>{opt.icon}</span>
 </div>
 <div className="text-left">
 <span className="block font-bold text-sm text-foreground ">{opt.name}</span>
 <span className="block text-xs text-muted-foreground">{opt.desc}</span>
 </div>
 </button>
 ))}
 </div>
 </motion.div>
 )}

 {/* Step 4: Toppings */}
 {step === 4 && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
 <h3 className="text-lg font-bold text-foreground mb-6 font-sans">Add Final Touches</h3>
 <div className="grid grid-cols-2 gap-3">
 {toppingOptions.map((top) => (
 <button
 key={top.name}
 onClick={() => handleToppingToggle(top.name)}
 className={`p-4 rounded-xl border-2 text-center transition-all relative ${
 config.toppings.includes(top.name) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
 }`}
 >
 <div className="text-3xl mb-2">{top.icon}</div>
 <span className="block font-bold text-sm text-foreground ">{top.name}</span>
 <span className="text-xs text-primary font-bold">+${top.price}</span>
 {config.toppings.includes(top.name) && (
 <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full text-white flex items-center justify-center">
 <span className="material-icons text-[14px]">check</span>
 </div>
 )}
 </button>
 ))}
 </div>
 </motion.div>
 )}

 {/* Summary of Selection (Visible when not editing that step) */}
 <div className="mt-8 pt-8 border-t border-border space-y-4">
 {step > 1 && <CompletedStep number={1} title="Size" value={tierOptions.find(t => t.value === config.tier)?.label || ''} onEdit={() => jumpToStep(1)} />}
 {step > 2 && <CompletedStep number={2} title="Flavor" value={config.flavor} onEdit={() => jumpToStep(2)} />}
 {step > 3 && <CompletedStep number={3} title="Frosting" value={config.frosting} onEdit={() => jumpToStep(3)} />}
 </div>
 </div>

 {/* Footer */}
 <div className="p-6 bg-card border-t border-border shadow-lg">
 <div className="flex justify-between items-end mb-6">
 <div>
 <p className="text-xs text-muted-foreground uppercase font-semibold">Estimated Total</p>
 <p className="text-3xl font-bold text-foreground font-sans">${calculateTotal().toFixed(2)}</p>
 </div>
 <div className="text-right">
 <p className="text-xs text-green-600 flex items-center justify-end gap-1">
 <span className="material-icons text-[14px]">local_shipping</span> Free delivery
 </p>
 </div>
 </div>
 <div className="grid grid-cols-4 gap-3">
 {step > 1 ? (
 <button onClick={prevStep} className="border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:bg-background dark:hover:bg-foreground text-background transition-colors">
 <span className="material-icons">arrow_back</span>
 </button>
 ) : (
 <button className="border border-border rounded-lg flex items-center justify-center text-background/80 cursor-not-allowed">
 <span className="material-icons">arrow_back</span>
 </button>
 )}
 {step < 4 ? (
 <button onClick={nextStep} className="col-span-3 bg-foreground text-background hover:bg-foreground text-background font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all text-background">
 Next Step
 </button>
 ) : (
 <button className="col-span-3 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all">
 <span>Order via WhatsApp</span>
 <span className="material-icons">send</span>
 </button>
 )}
 </div>
 </div>
 </aside>
 </div>
 );
};

const IconButton: React.FC<{ icon: string }> = ({ icon }) => (
 <button className="bg-card/70 backdrop-blur-md p-3 rounded-lg hover:bg-card transition-colors shadow-sm">
 <span className="material-icons-outlined text-foreground/80 ">{icon}</span>
 </button>
);

const CompletedStep: React.FC<{ number: number; title: string; value: string; onEdit: () => void }> = ({ title, value, onEdit }) => (
 <div className="opacity-60 hover:opacity-100 transition-opacity">
 <div className="flex justify-between items-center mb-1">
 <h3 className="text-xs font-bold flex items-center gap-2 text-foreground uppercase tracking-wider">
 <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]"><span className="material-icons text-[10px]">check</span></span>
 {title}
 </h3>
 <button onClick={onEdit} className="text-xs text-primary underline hover:text-orange-600">Edit</button>
 </div>
 <div className="pl-6">
 <p className="text-sm font-semibold text-foreground ">{value}</p>
 </div>
 </div>
);
