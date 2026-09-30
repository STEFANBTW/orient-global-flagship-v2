import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, Shield, MapPin, Zap, Monitor, ShoppingBag, Star, Crown, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
 return (
 <div className="min-h-screen bg-[#050505] text-white font-mono relative pb-20 transition-colors duration-500 selection:bg-purple-500 selection:text-white">
 
 {/* Global CRT & Scanline Effects */}
 <div className="fixed inset-0 z-0 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]"></div>
 <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent z-50 opacity-50 animate-scanline"></div>

 {/* Background Decor */}
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

 {/* Hero Header */}
 <header className="relative w-full h-[50vh] min-h-[400px] flex items-end justify-center pb-12 overflow-hidden border-b border-transparent">
 <div className="absolute inset-0 z-0">
 <img 
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHvLnGRGg2C4l9qWzAbuTRBXcIvzlsjgNtbDpF1KiDg-ggH5Z4xFxn6bDfsPlJWI1L3Ih1Hh1nn1zv3QBOTznrjBu96wBoXcjis6NbnIU4SJ9tdwkyBDkELGqlZi4SrvRhv6iJrAKwp8PzP6vaAUWah5A5XGG4VcUMQJFZWDD9xCuTq5-R7UVAcfCDqRuWTVbGuFK43uhHXgbJKnGTZxFfNR0BtXpRDlnsw8vQiNsmkPsKwzE_TZ7A88V1mKPUds8QO4qYdqJFNP-M" 
 alt="Setup" 
 className="w-full h-full object-cover opacity-40 filter grayscale contrast-125"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
 </div>

 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 relative z-10 w-full">
 <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
 {/* Avatar with Enhanced Shadow/Backdrop */}
 <div className="relative group">
 <motion.div 
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="w-32 h-32 md:w-40 md:h-40 border-2 border-purple-500 p-1 relative overflow-hidden bg-[#050505] shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-xl"
 style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
 >
 <img 
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4JUWwVLCwvkYyfjsjRK-Fbz3smiARVypYdwcSMugW2355J35oEf0_dXwe2nzXsF19FBxEkfs-IcZeTMjFMSV9YIq8oVsA4Uk-ajbbXCYakmKrPviykExS7d0VSgtxsup5jGAl4A1OQE6pMIFBK-dszp5pk5dlVJufI9s0CyFRpFXIxv5WhHnSQTH5Fn1DfjeI8u5vkYAFNaxmmp1ihxndFfSZFJhDID6HctgkXjsZgwZh9cxwMcO_M6zITLfAEbKnmN3hIy5Hu3IL" 
 alt="Avatar" 
 className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 filter grayscale contrast-125 hover:grayscale-0"
 />
 </motion.div>
 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#050505] border border-purple-500 text-purple-500 px-3 py-1 text-[8px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.4)] flex items-center gap-2">
 <span className="w-1.5 h-1.5 bg-purple-500 animate-pulse"></span> Online
 </div>
 </div>

 {/* Info */}
 <div className="flex-1 w-full pb-2">
 <div className="flex flex-col md:flex-row md:items-end justify-between mb-2">
 <div>
 <h2 className="text-purple-500 text-[10px] font-bold tracking-[0.2em] mb-1 uppercase flex items-center gap-2">
 <Shield className="w-3 h-3" /> Orient Arena Member
 </h2>
 <h1 className="text-4xl md:text-6xl font-black text-background mb-2 uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">NEON_SAMURAI</h1>
 <p className="text-muted-foreground text-[10px] flex items-center gap-2 uppercase tracking-widest">
 <MapPin className="w-3 h-3 text-purple-500" />
 Tokyo Server
 <span className="w-1 h-1 bg-gray-600 mx-2"></span>
 Rank: Diamond II
 </p>
 </div>
 <div className="text-right hidden md:block">
 <div className="text-6xl font-black text-purple-500 opacity-20 select-none uppercase tracking-tighter">LVL 42</div>
 </div>
 </div>

 {/* XP Bar */}
 <div className="relative mt-6 bg-[#111] border border-transparent p-4" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <div className="flex justify-between text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">
 <span>Level 42</span>
 <span className="text-purple-500">4,200 / 5,000 XP</span>
 </div>
 <div className="h-2 bg-[#050505] overflow-hidden border border-transparent relative">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: "84%" }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 className="h-full bg-purple-500 relative shadow-[0_0_10px_#a855f7]"
 >
 <div className="absolute right-0 top-0 bottom-0 w-2 bg-card/50 blur-[2px]"></div>
 </motion.div>
 </div>
 <div className="mt-3 text-[8px] text-muted-foreground uppercase tracking-widest text-right">Next Reward: Legendary Skin Box</div>
 </div>
 </div>
 </div>
 </div>
 </header>

 {/* Main Content Grid */}
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8 mt-12 space-y-12 relative z-10">
 
 {/* Stats Row */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 <StatBox label="Total Wins" value="1,248" />
 <StatBox label="Win Rate" value="68.4%" color="text-purple-500" />
 <StatBox label="Time Played" value="482h" />
 <StatBox label="Global Rank" value="#4,092" />
 </div>

 {/* The Vault */}
 <section>
 <div className="flex items-center justify-between mb-6 border-b border-transparent pb-4">
 <div className="flex items-center gap-4">
 <div className="w-1 h-8 bg-purple-500"></div>
 <h2 className="text-2xl font-black text-background uppercase tracking-tight">The Vault</h2>
 </div>
 <span className="text-[10px] text-muted-foreground uppercase tracking-widest border border-transparent px-3 py-1 bg-[#111]">12/50 UNLOCKED</span>
 </div>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <BadgeCard name="Flawless Victory" desc="Win without taking damage" icon={<Trophy size={20} />} rarity="RARE" />
 <BadgeCard name="Night Owl" desc="Play between 2AM - 5AM" icon={<Clock size={20} />} rarity="COMMON" />
 <BadgeCard name="Sniper Elite" desc="50 Headshots in one match" icon={<Target size={20} />} rarity="LEGENDARY" />
 <BadgeCard name="Marathon Runner" desc="Play for 6 hours continuously" icon={<Zap size={20} />} rarity="EPIC" />
 </div>
 </section>

 {/* Combat Log */}
 <section>
 <div className="flex items-center justify-between mb-6 border-b border-transparent pb-4">
 <div className="flex items-center gap-4">
 <div className="w-1 h-8 bg-purple-500"></div>
 <h2 className="text-2xl font-black text-background uppercase tracking-tight">Combat Log</h2>
 </div>
 <div className="flex gap-2">
 <button className="text-[10px] bg-purple-500 text-foreground px-4 py-1 font-bold uppercase tracking-widest transition-colors hover:bg-card" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>All</button>
 <button className="text-[10px] bg-[#111] border border-transparent text-muted-foreground hover:text-white px-4 py-1 font-bold uppercase tracking-widest transition-colors hover:border-transparent" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>Ranked</button>
 </div>
 </div>

 <div className="bg-[#0a0a0a] border border-transparent overflow-hidden relative" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
 
 {/* Table Header */}
 <div className="hidden md:grid grid-cols-6 gap-4 p-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest border-b border-transparent bg-[#111] relative z-10">
 <div className="col-span-1">Status</div>
 <div className="col-span-2">Game Title</div>
 <div className="col-span-1">Date</div>
 <div className="col-span-1">Duration</div>
 <div className="col-span-1 text-right">XP Gained</div>
 </div>

 <div className="relative z-10">
 <MatchRow status="VICTORY" game="Apex Legends" date="Today, 14:30" duration="24m 12s" kda="4.2" xp="+1,250" color="text-green-500" />
 <MatchRow status="DEFEAT" game="League of Legends" date="Today, 12:15" duration="45m 02s" kda="1.8" xp="+120" color="text-red-500" />
 <MatchRow status="VICTORY" game="Valorant" date="Yesterday, 22:10" duration="38m 45s" kda="2.5" xp="+850" color="text-green-500" />
 <MatchRow status="DRAW" game="Overwatch 2" date="Yesterday, 20:00" duration="12m 30s" kda="3.0" xp="+400" color="text-muted-foreground" />
 <MatchRow status="VICTORY" game="Apex Legends" date="Yesterday, 18:45" duration="18m 22s" kda="5.1" xp="+1,100" color="text-green-500" />
 </div>
 
 <div className="p-4 text-center border-t border-transparent bg-[#111] relative z-10">
 <button className="text-[10px] text-purple-500 font-bold uppercase tracking-widest hover:text-background transition-colors flex items-center justify-center gap-2 mx-auto">
 View Full History <ChevronRight className="w-3 h-3" />
 </button>
 </div>
 </div>
 </section>

 {/* Loot Box Section */}
 <section>
 <div className="flex items-center justify-between mb-6 border-b border-transparent pb-4">
 <div className="flex items-center gap-4">
 <div className="w-1 h-8 bg-purple-500"></div>
 <h2 className="text-2xl font-black text-background uppercase tracking-tight">The Loot Box</h2>
 </div>
 <div className="bg-[#111] border border-transparent px-4 py-2 text-right" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 <span className="text-[8px] text-muted-foreground block uppercase tracking-widest mb-1">Available Balance</span>
 <span className="text-lg font-black text-background">14,250 XP</span>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <LootCard 
 title="1 Hour Free Play" 
 desc="Redeem for one hour of access to any standard PC station in the arena."
 price="1,000"
 tag="MOST POPULAR"
 img="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
 />
 <LootCard 
 title="Energy Refuel" 
 desc="Get any energy drink or snack from the Orient Supermarket kiosk."
 price="500"
 img="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800"
 />
 <LootCard 
 title="Reserved VIP Station" 
 desc="Priority booking for the VIP room with RTX 4090 setup for 2 hours."
 price="2,000"
 tag="VIP"
 tagColor="bg-yellow-500 text-foreground"
 img="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800"
 />
 </div>
 </section>
 </div>
 </div>
 );
};

const StatBox = ({ label, value, color = "text-background" }: any) => (
 <div className="bg-[#111] border border-transparent p-6 flex flex-col justify-center transition-colors hover:border-purple-500/50 group" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
 <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-bold group-hover:text-muted-foreground transition-colors">{label}</span>
 <span className={`text-3xl md:text-4xl font-black uppercase tracking-tighter ${color}`}>{value}</span>
 </div>
);

const BadgeCard = ({ name, desc, icon, rarity }: any) => {
 let rarityColor = "text-muted-foreground border-gray-600/30";
 if (rarity === "LEGENDARY") rarityColor = "text-yellow-500 border-yellow-500/50 bg-yellow-500/5";
 if (rarity === "EPIC") rarityColor = "text-purple-500 border-purple-500/50 bg-purple-500/5";
 if (rarity === "RARE") rarityColor = "text-cyan-500 border-cyan-500/50 bg-cyan-500/5";

 return (
 <motion.div 
 whileHover={{ y: -5 }}
 className="bg-[#111] p-6 border border-transparent flex flex-col items-center text-center hover:bg-[#1a1a1a] transition-colors cursor-pointer group hover:border-transparent"
 style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
 >
 <div className={`w-16 h-16 flex items-center justify-center border mb-6 ${rarityColor} group-hover:scale-110 transition-transform shadow-lg`}>
 {icon}
 </div>
 <div className="font-bold text-background mb-2 text-sm uppercase tracking-wider">{name}</div>
 <div className="text-[10px] text-muted-foreground mb-4 uppercase tracking-widest leading-relaxed">{desc}</div>
 <div className={`text-[8px] font-bold uppercase px-3 py-1 border ${rarityColor.replace('bg-', '')} bg-transparent tracking-widest mt-auto`}>
 {rarity}
 </div>
 </motion.div>
 );
};

const MatchRow = ({ status, game, date, duration, kda, xp, color }: any) => (
 <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 p-4 border-b border-transparent hover:bg-[#111] transition-colors items-center">
 <div className="col-span-1">
 <span className={`text-[8px] font-bold px-2 py-1 bg-[#050505] ${color} border border-transparent uppercase tracking-widest flex items-center gap-2 w-fit`}>
 <span className={`w-1.5 h-1.5 ${color.replace('text-', 'bg-')} animate-pulse`}></span>
 {status}
 </span>
 </div>
 <div className="col-span-2 flex items-center gap-3">
 <div className="w-8 h-8 bg-[#050505] border border-transparent flex items-center justify-center">
 <Monitor size={14} className="text-muted-foreground"/>
 </div>
 <span className="text-background font-bold text-xs uppercase tracking-wider">{game}</span>
 </div>
 <div className="col-span-1 text-[10px] text-muted-foreground uppercase tracking-widest">{date}</div>
 <div className="col-span-1 text-[10px] text-muted-foreground font-mono tracking-widest">{duration}</div>
 <div className="col-span-1 text-right">
 <div className="text-xs text-purple-500 font-bold tracking-wider">{xp} XP</div>
 <div className="text-[8px] text-foreground/80 font-mono hidden md:block mt-1 uppercase tracking-widest">{kda} KDA</div>
 </div>
 </div>
);

const LootCard = ({ title, desc, price, tag, tagColor = "bg-purple-500 text-background", img }: any) => (
 <div className="bg-[#0a0a0a] border border-transparent overflow-hidden group hover:border-purple-500/50 transition-colors flex flex-col h-full relative" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none z-0"></div>
 
 <div className="h-48 relative overflow-hidden border-b border-transparent z-10">
 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
 <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter grayscale contrast-125 group-hover:grayscale-0" />
 {tag && (
 <div className={`absolute top-4 left-4 z-20 ${tagColor} text-[8px] font-bold px-3 py-1 uppercase tracking-widest shadow-lg`}>
 {tag}
 </div>
 )}
 </div>
 
 <div className="p-6 flex-1 flex flex-col relative z-10">
 <h3 className="text-xl font-black text-background mb-3 uppercase tracking-tight">{title}</h3>
 <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-8 flex-1 leading-relaxed">{desc}</p>
 
 <div className="flex items-center justify-between mt-auto border-t border-transparent pt-6">
 <div className="text-purple-500 font-black text-xl tracking-tighter">{price} XP</div>
 <button className="px-6 py-3 border border-transparent text-muted-foreground hover:bg-purple-500 hover:border-purple-500 hover:text-foreground text-[10px] font-bold uppercase tracking-widest transition-all" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
 Redeem
 </button>
 </div>
 </div>
 </div>
);

export default Profile;
