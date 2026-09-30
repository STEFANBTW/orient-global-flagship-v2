import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../GamesWrapper';
import { Gamepad2, Disc, Monitor, Cpu, Activity, Zap, ChevronRight, Settings } from 'lucide-react';

interface Props {
 onNavigate: (page: Page) => void;
}

interface SelectionOption {
 id: string;
 type: 'CONSOLE' | 'GAME';
 name: string;
 sub: string;
 color: string;
 icon: React.ReactNode;
 specs: string[];
 img: string;
}

const options: SelectionOption[] = [
 // --- Consoles ---
 {
 id: 'ps5',
 type: 'CONSOLE',
 name: 'STATION_V',
 sub: 'Haptic Immersion',
 color: '#3b82f6', // Blue
 icon: <Gamepad2 className="w-5 h-5" />,
 specs: ['4K @ 120Hz', 'Adaptive Triggers', '3D Audio'],
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRSSgWjLl7l4vAdFdVSK9IIELfDnuRHJSKN97JVfz1i0-nwSMcrW_sJj_NGSulQ_DKewww6PBX-x4RH1kLOf7jXWhtL1p_6g3-FwPUjPiVUnNOGGQzvcWgNNjSLTh5q9mdSc9b2d0PjKhbUYT9iQR0xW4MtS1Pk-a5jJN6bMC_zfsZXyXu1YdzifShBwPwiN58k-qaF6vfuhyEpiWkS1bBTH_eLbCYyZfYyatnQizkAWDAClQinarlYe2qTShum57fNZ2CiFW0NbRo'
 },
 {
 id: 'xbox',
 type: 'CONSOLE',
 name: 'X_SERIES',
 sub: 'Velocity Arch',
 color: '#10b981', // Green
 icon: <Monitor className="w-5 h-5" />,
 specs: ['Quick Resume', 'Dolby Vision', '12 TFLOPS'],
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQO3haxzauLNwSEpt1bqCLFHeSJPKAdCdBjtpJtAj1IY494HnF1cF9UcL3o7KVemu3fme9OvO23-OUABIWDWLVUFUNLV63L84j1osxI-btkFt_sTbL75eWuJXj92HQXmMZn7ImOwlj3FIjDaeGASGTZQELWxMuf2zjxS2JdePQfCMVopqrTG7xGm7vKm2Pf-bu6elcD5hvS2in6_vqne055T0noEFTsMoZzfjb89WgrawLkXlIxyGlEatN-brN_2Xu_b2-iIfkMw-C'
 },
 {
 id: 'pc',
 type: 'CONSOLE',
 name: 'TITAN_PC',
 sub: 'Ultimate Power',
 color: '#f97316', // Orange
 icon: <Cpu className="w-5 h-5" />,
 specs: ['RTX 4090 Ti', 'i9 Extreme', '64GB DDR5'],
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBclQ8Im1ImDIEwPdTuKMespLQVxjvhT9YhpStwrlbtEA30iZXG21L1xwpzYiRv6E_zHU5l90Fm1aBDLPdylYh1qhW7vwT19Eu8NCBFTW5wRWDaIER6DP5zgkMIsZnQ61w4tWfJ6s8Idxfq8tSnnGPFNn6fP8bt55oiL3CKiiGSiX0dlbaeNRHwh6wvULzayKqOgTjY0cUmXj6cqVghnWO_5dqfXQp0QS_OlB3-aehJxghk3ZfmNPe1q1rJJhrwb3OWaWBcRdFF9Ys2'
 },
 {
 id: 'retro',
 type: 'CONSOLE',
 name: 'LEGACY_BOX',
 sub: 'Arcade Classics',
 color: '#d946ef', // Pink
 icon: <Disc className="w-5 h-5" />,
 specs: ['CRT Filter', '3000+ Games', 'Sanwa Sticks'],
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBLzp4VE-lcqy0kNGx0lXaxgnt72LHWtr72QGbeDr0TUVlAXAIMrVOFm7luq-PtDUntTG-1AXPZ8KmK9H1Knv6VZFqztDDM0pNvmBbn1a-rDoOdCqn__jd-aMKiYA3mnGowGdt5rHaq5Rt7f7H-XYDfLedcgr3WN3qioN5wIoHgWcdNCOhjt3v_UTFSqZMF9XQQ_EDlTSbYmAYUNd8gpDMiweQq8zOHGJN57f-KLDx5wq54Vww6Hc_-qNxPRLdh0_Y1VWQ-E9sC-PD'
 },
 // --- Games ---
 {
 id: 'mk1',
 type: 'GAME',
 name: 'MORTAL KOMBAT 1',
 sub: 'It\'s In Our Blood',
 color: '#dc2626', // Blood Red
 icon: <Zap className="w-5 h-5" />,
 specs: ['Kameo Fighters', '4K HDR', 'Local PvP'],
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo6SbAy_quBrJUcl6xaDeIEHSeW8Bz_YyxbqixFrL7BM0LP18qmGr19HnAO5iulAlwRCCvmQn-L2SHTk7yeLC0orayoyc_ol1lGNU4S59Ipmh-feBd29Wk9GsrEY4lpMbxe_UnCga8bvpw7C-ks_8yMYeXXpSX3AaQ2HkV8wT4KfckIiDrSGLIJ9UoCOT476xuHhwew0D7FxCpkJOM2uldah2K9qg2T9U09iAwljsoOJoGw_CM5HRa3hnd4svTLhzR4XwKd1XriHp1'
 },
 {
 id: 'fc24',
 type: 'GAME',
 name: 'FC 24',
 sub: 'The World\'s Game',
 color: '#00ff88', // Toxic Green
 icon: <Activity className="w-5 h-5" />,
 specs: ['HyperMotionV', 'Ultimate Team', 'Pro Clubs'],
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE4WCbuoUrl9ihyygcdwLIFaiB4J2no4e-n4rpfiQJPK_g5VLVldHkbEggusCRxWFS1md0TP8IX7wH3mgvKWyD6lM67qFKF5KqYIsYPnheBbkh6Ft0Ag3NP6roGGajtiTqUp3KkjnajhVv050uRAp25TKnkR0I7Y6BaFcyhc-6bzs-mFTOvmo5SVtR2kZ25m0cbPH7Sc7GbhY8R6ceAA7bzUykRKBirqKHzYu8mEYjczz2iDAMLrY3IgsDYfzQzRHJDkdMEEgX-IFA'
 },
 {
 id: 'spiderman',
 type: 'GAME',
 name: 'SPIDER-MAN 2',
 sub: 'Be Greater Together',
 color: '#ef4444', // Spider Red
 icon: <Activity className="w-5 h-5" />,
 specs: ['Ray Tracing', 'Instant Travel', 'Haptic Web'],
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoCjiYS6IdAhEPA7bgRgiHJbFEuY5O34utIcdITPs5OGgnVyV0-TH4ro3s6dZnVCi6GuIcIu8Nm_-AhE3GfZe2pRPzXFJWLefjJ4_54qvYt8atlI4hrpHppfapltnxi7LxT1Nl-wuML43S_4NcAuS7l4kzV2m6aE7G8PrElOoYn8BRlpsXSbakncw7aH1AraXSd8oRoh8LMUJfQKwgAJxMM7rSXpjbjYlKy1-T8nHVamOCLZSqdX0ti4DvfRM9TycDtbDwnlhGvYRM'
 },
 {
 id: 'gow',
 type: 'GAME',
 name: 'RAGNARÖK',
 sub: 'Myths of Midgard',
 color: '#3b82f6', // Ice Blue
 icon: <Activity className="w-5 h-5" />,
 specs: ['Fimbulwinter', 'No Cut Cam', 'Realm Travel'],
 img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHvLnGRGg2C4l9qWzAbuTRBXcIvzlsjgNtbDpF1KiDg-ggH5Z4xFxn6bDfsPlJWI1L3Ih1Hh1nn1zv3QBOTznrjBu96wBoXcjis6NbnIU4SJ9tdwkyBDkELGqlZi4SrvRhv6iJrAKwp8PzP6vaAUWah5A5XGG4VcUMQJFZWDD9xCuTq5-R7UVAcfCDqRuWTVbGuFK43uhHXgbJKnGTZxFfNR0BtXpRDlnsw8vQiNsmkPsKwzE_TZ7A88V1mKPUds8QO4qYdqJFNP-M'
 }
];

export const ConsoleSelection: React.FC<Props> = ({ onNavigate }) => {
 const [selected, setSelected] = useState<string | null>(null);

 return (
 <div className="bg-[#050505] text-white min-h-screen relative overflow-hidden font-mono selection:bg-purple-500 selection:text-white">
 
 {/* Global CRT & Scanline Effects */}
 <div className="fixed inset-0 z-0 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]"></div>
 <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent z-50 opacity-50 animate-scanline"></div>

 {/* Background Animations */}
 <div className="fixed inset-0 pointer-events-none z-0">
 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_70%)]"></div>
 </div>

 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 pt-24 pb-32 relative z-10 flex flex-col min-h-screen">
 
 {/* Header */}
 <motion.div 
 initial={{ y: -20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 className="text-center mb-16"
 >
 <div className="inline-flex items-center gap-2 border border-purple-500/30 bg-purple-500/10 px-4 py-1 mb-4" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
 <span className="w-1.5 h-1.5 bg-purple-500 animate-pulse"></span>
 <span className="text-purple-500 text-[10px] font-bold uppercase tracking-widest">System Online // Awaiting Input</span>
 </div>
 <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">Select Platform <span className="text-purple-500 text-2xl align-top">+</span> Game</h1>
 <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest max-w-md mx-auto">Choose your interface or quick-launch a featured title. Performance parameters will adjust automatically.</p>
 </motion.div>

 {/* Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
 {options.map((c, i) => (
 <motion.div
 key={c.id}
 initial={{ y: 50, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: i * 0.1 }}
 onClick={() => setSelected(c.id)}
 className={`group relative h-[400px] cursor-pointer transition-all duration-300 transform perspective-1000 ${selected === c.id ? 'scale-105 z-20 ring-1 ring-offset-2 ring-offset-[#050505]' : 'hover:scale-105 hover:z-10'}`}
 style={{ 
 borderColor: selected === c.id ? c.color : 'rgba(255,255,255,0.1)',
 borderWidth: '1px',
 boxShadow: selected === c.id ? `0 0 30px ${c.color}40` : 'none',
 clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
 }}
 >
 {/* Card Background & Image */}
 <div className="absolute inset-0 overflow-hidden bg-[#111]">
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0 pointer-events-none"></div>
 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-10"></div>
 <img src={c.img} alt={c.name} className="w-full h-full object-cover opacity-50 filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
 
 {/* Selected Overlay */}
 {selected === c.id && (
 <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
 )}
 </div>

 {/* Content */}
 <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
 {/* Top Badge */}
 <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
 <div className="bg-[#050505]/80 backdrop-blur-md border border-transparent p-2 flex items-center gap-2" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
 <span className="text-background">{c.icon}</span>
 {c.type === 'GAME' && <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Featured</span>}
 </div>
 {selected === c.id && (
 <motion.div 
 initial={{ scale: 0 }} animate={{ scale: 1 }}
 className="bg-purple-500 text-foreground text-[8px] font-bold px-3 py-1 uppercase tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.4)]"
 style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}
 >
 Selected
 </motion.div>
 )}
 </div>

 <h3 className="text-2xl font-black text-background mb-1 uppercase tracking-tight leading-none group-hover:text-background transition-colors">{c.name}</h3>
 <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: c.color }}>{c.sub}</p>
 
 <div className="space-y-2 border-t border-transparent pt-4">
 {c.specs.map((spec, idx) => (
 <div key={idx} className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
 <span className="w-1 h-1 bg-gray-600"></span>
 {spec}
 </div>
 ))}
 </div>
 </div>

 {/* Scanning Effect on Hover */}
 <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
 <div className="absolute top-0 left-0 w-full h-[2px] bg-card/50 shadow-[0_0_10px_white] animate-[scanline_2s_linear_infinite]"></div>
 </div>
 </motion.div>
 ))}
 </div>

 {/* Bottom Action Bar */}
 <AnimatePresence>
 {selected && (
 <motion.div 
 initial={{ y: 100, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 100, opacity: 0 }}
 className="fixed bottom-0 left-0 w-full bg-[#050505]/90 border-t border-transparent p-6 z-50 backdrop-blur-md"
 >
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 border border-transparent flex items-center justify-center bg-[#111]" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
 <Settings className="w-5 h-5 animate-spin-slow" style={{ color: options.find(c => c.id === selected)?.color }} />
 </div>
 <div>
 <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Configuration Locked</div>
 <div className="text-xl font-black text-background uppercase tracking-tight">Ready to Initialize</div>
 </div>
 </div>

 <div className="flex items-center gap-8">
 <div className="hidden md:block text-right">
 <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Est. Load Time</div>
 <div className="text-purple-500 font-bold text-sm">0.4 SEC</div>
 </div>
 <button 
 className="relative group overflow-hidden px-10 py-4 bg-purple-500 text-foreground font-bold text-xs uppercase tracking-widest hover:bg-card transition-all duration-300"
 style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
 >
 <span className="relative z-10 flex items-center gap-2">
 Initialize Link <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </span>
 </button>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 );
};

export default ConsoleSelection;
