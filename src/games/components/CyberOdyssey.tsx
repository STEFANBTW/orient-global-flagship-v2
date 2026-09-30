import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu, Zap, Crosshair, Radio, Activity, Database, Server, Target } from 'lucide-react';

interface CyberOdysseyProps {
 onBack: () => void;
}

const CyberOdyssey: React.FC<CyberOdysseyProps> = ({ onBack }) => {
 return (
 <div className="bg-[#050505] text-white font-mono overflow-x-hidden selection:bg-primary selection:text-white relative min-h-screen">
 
 {/* Global CRT & Scanline Effects */}
 <div className="fixed inset-0 z-50 pointer-events-none mix-blend-overlay opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]"></div>
 <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent z-50 opacity-50 animate-scanline"></div>

 {/* Custom Navigation */}
 <nav className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-transparent">
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
 <div className="flex items-center justify-between h-16">
 
 <div className="flex items-center gap-4 group cursor-pointer" onClick={onBack}>
 <div className="relative w-8 h-8 flex items-center justify-center border border-primary/50 group-hover:border-primary transition-colors bg-black">
 <Terminal className="w-4 h-4 text-primary" />
 <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary"></div>
 </div>
 <div className="flex flex-col">
 <span className="font-bold text-lg tracking-tighter text-background uppercase leading-none">ORIENT<span className="text-primary">GAMES</span></span>
 <span className="text-[8px] text-muted-foreground uppercase tracking-widest mt-1">SYS.ODYSSEY.V1</span>
 </div>
 </div>

 <div className="hidden xl:flex items-center gap-4 text-[10px] text-muted-foreground tracking-widest">
 <div className="flex items-center gap-2"> UPLINK: SECURE</div>
 <div className="w-px h-4 bg-card/10"></div>
 <div className="flex items-center gap-2"><Activity className="w-3 h-3 text-cyan-500" /> LATENCY: 14MS</div>
 <div className="w-px h-4 bg-card/10"></div>
 <div className="flex items-center gap-2"><Database className="w-3 h-3 text-purple-500" /> DATA: SYNCED</div>
 </div>

 <div className="hidden md:flex items-center space-x-6 text-xs tracking-widest uppercase">
 <a className="text-muted-foreground hover:text-cyan-500 transition-colors relative group" href="#hero">
 Start
 <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
 </a>
 <a className="text-muted-foreground hover:text-primary transition-colors relative group" href="#vr-frontier">
 Frontier
 <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
 </a>
 <a className="text-muted-foreground hover:text-purple-500 transition-colors relative group" href="#arena-dash">
 Arena
 <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
 </a>
 <a className="text-muted-foreground hover:text-green-500 transition-colors relative group" href="#hardware">
 Hardware
 <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
 </a>
 </div>

 <button onClick={onBack} className="flex items-center gap-2 bg-card/5 hover:bg-card text-muted-foreground hover:text-foreground border border-transparent px-4 py-1.5 text-[10px] uppercase tracking-widest transition-all duration-300">
 <span className="w-2 h-2 bg-red-500"></span>
 Terminate
 </button>
 </div>
 </div>
 </nav>

 {/* Hero Section */}
 <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-16" id="hero">
 
 {/* Dense Background */}
 <div className="absolute inset-0 opacity-30">
 <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
 <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
 </div>

 {/* Grid */}
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none"></div>

 <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto px-4">
 
 {/* Glitch Graphic */}
 <div className="mb-12 relative w-full max-w-2xl aspect-video flex items-center justify-center border border-transparent bg-black/50 overflow-hidden group">
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-10 mix-blend-overlay"></div>
 <img alt="Cyber City" className="w-full h-full object-cover filter grayscale contrast-150 group-hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE4WCbuoUrl9ihyygcdwLIFaiB4J2no4e-n4rpfiQJPK_g5VLVldHkbEggusCRxWFS1md0TP8IX7wH3mgvKWyD6lM67qFKF5KqYIsYPnheBbkh6Ft0Ag3NP6roGGajtiTqUp3KkjnajhVv050uRAp25TKnkR0I7Y6BaFcyhc-6bzs-mFTOvmo5SVtR2kZ25m0cbPH7Sc7GbhY8R6ceAA7bzUykRKBirqKHzYu8mEYjczz2iDAMLrY3IgsDYfzQzRHJDkdMEEgX-IFA"/>
 
 {/* Overlay UI */}
 <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 text-[10px] text-cyan-500 tracking-widest text-left">
 <span>REC [•]</span>
 <span>CAM_04 // SECTOR_7</span>
 </div>
 <div className="absolute bottom-4 right-4 z-20 flex gap-1">
 {[...Array(8)].map((_, i) => (
 <div key={i} className="w-1 h-4 bg-primary/50 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
 ))}
 </div>
 
 {/* Crosshair */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-50 pointer-events-none">
 <Crosshair className="w-16 h-16 text-background/30" strokeWidth={1} />
 </div>
 </div>

 <div className="space-y-6 max-w-4xl mx-auto">
 <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm">
 <span className="w-2 h-2 bg-cyan-500 animate-pulse"></span>
 <span className="text-[10px] text-cyan-500 tracking-[0.3em] uppercase">Simulation Active</span>
 </div>
 
 <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-background tracking-tighter leading-[0.85] uppercase relative">
 Cyber
 <br/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Odyssey</span>
 {/* Glitch layers */}
 <span className="absolute top-0 left-[2px] text-red-500 opacity-50 mix-blend-screen z-[-1]">Cyber<br/>Odyssey</span>
 <span className="absolute top-0 -left-[2px] text-blue-500 opacity-50 mix-blend-screen z-[-1]">Cyber<br/>Odyssey</span>
 </h1>
 
 <p className="text-muted-foreground text-xs md:text-sm tracking-[0.4em] uppercase mt-8">
 [ Initialize Deep Dive Sequence ]
 </p>
 
 <div className="mt-12">
 <a className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden text-foreground font-bold tracking-widest uppercase bg-cyan-500 hover:bg-card transition-colors" href="#vr-frontier" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
 <span className="relative flex items-center gap-3">
 Enter The Grid
 </span>
 </a>
 </div>
 </div>
 </div>

 {/* Bottom HUD */}
 <div className="absolute bottom-8 left-0 w-full flex justify-between px-8 items-end opacity-40 text-[10px] text-muted-foreground tracking-widest uppercase">
 <div className="flex flex-col gap-1">
 <span>COORD: 001.002.X</span>
 <span>SEC: MAIN_HUB</span>
 </div>
 <div className="flex flex-col items-center gap-2">
 <span>Scroll to Descend</span>
 <div className="h-12 w-[1px] bg-gradient-to-b from-gray-500 to-transparent relative overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-1/3 bg-card animate-scanline"></div>
 </div>
 </div>
 <div className="text-right flex flex-col gap-1">
 <span>V.2.0.4_BETA</span>
 <span>ENG: UNREAL_5</span>
 </div>
 </div>
 </section>

 {/* VR Frontier - Brutalist List */}
 <div className="relative w-full bg-[#0a0a0a] border-t border-transparent" id="vr-frontier">
 
 {/* Section Header */}
 <div className="sticky top-0 lg:top-12 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-transparent py-4 px-4 lg:px-8 flex justify-between items-center">
 <div className="flex items-center gap-4">
 <span className="text-cyan-500 text-xs tracking-widest">01 //</span>
 <h2 className="text-xl text-background font-bold uppercase tracking-tight">The Frontier</h2>
 </div>
 <div className="flex gap-1">
 <div className="w-8 h-1 bg-cyan-500"></div>
 <div className="w-2 h-1 bg-foreground text-background"></div>
 <div className="w-2 h-1 bg-foreground text-background"></div>
 </div>
 </div>

 {/* Game Entries */}
 <div className="flex flex-col">
 <GameEntry 
 id="01"
 title="Neon Nights"
 desc="High-velocity cyber-parkour in a decaying metropolis. Feel the wind with haptic fan integration."
 img="https://lh3.googleusercontent.com/aida-public/AB6AXuCE4WCbuoUrl9ihyygcdwLIFaiB4J2no4e-n4rpfiQJPK_g5VLVldHkbEggusCRxWFS1md0TP8IX7wH3mgvKWyD6lM67qFKF5KqYIsYPnheBbkh6Ft0Ag3NP6roGGajtiTqUp3KkjnajhVv050uRAp25TKnkR0I7Y6BaFcyhc-6bzs-mFTOvmo5SVtR2kZ25m0cbPH7Sc7GbhY8R6ceAA7bzUykRKBirqKHzYu8mEYjczz2iDAMLrY3IgsDYfzQzRHJDkdMEEgX-IFA"
 accent="cyan"
 />
 <GameEntry 
 id="02"
 title="Void Walker"
 desc="Psychological horror in zero-g. Don't look behind you. Multiplayer enabled."
 img="https://lh3.googleusercontent.com/aida-public/AB6AXuDPENfCNBzaLIMmAK2r-p3wgMqRwvUWuGEJjSJx9QfORIyrbtq1Wf0lbi2WuZl-o8X9Uqif06vE_vFHKN8ThOXf2vPXg1u79XhZUC0BfsGUx9EQQTmU2guGAPHUwc0B0o24SJ1L3eGS_eEPCzyur80-fyIGZa4lb19LTw-I-r5jwm4d3TOzMQQvY59HWjXfQpqO125z0zhjOf9aH75YDi9EPF2rIgfRhUwwiuR82E_fuYfIBFaV6zS-FCxcGy8Jin66Wk-BXYIhY7Zi"
 accent="primary"
 />
 <GameEntry 
 id="03"
 title="Pixel Storm"
 desc="Voxel-based destruction derby. 8-bit nostalgia meets 8K resolution."
 img="https://lh3.googleusercontent.com/aida-public/AB6AXuDBLzp4VE-lcqy0kNGx0lXaxgnt72LHWtr72QGbeDr0TUVlAXAIMrVOFm7luq-PtDUntTG-1AXPZ8KmK9H1Knv6VZFqztDDM0pNvmBbn1a-rDoOdCqn__jd-aMKiYA3mnGowGdt5rHaq5Rt7f7H-XYDfLedcgr3WN3qioN5wIoHgWcdNCOhjt3v_UTFSqZMF9XQQ_EDlTSbYmAYUNd8gpDMiweQq8zOHGJN57f-KLDx5wq54Vww6Hc_-qNxPRLdh0_Y1VWQ-E9sC-PD"
 accent="purple"
 />
 </div>
 </div>

 {/* Arena Dashboard - Data Dense */}
 <section className="relative min-h-screen bg-[#050505] border-t border-transparent flex flex-col" id="arena-dash">
 
 {/* Section Header */}
 <div className="bg-[#111] border-b border-transparent p-4 lg:px-8 flex justify-between items-center z-20">
 <div className="flex items-center gap-4">
 <span className="text-primary text-xs tracking-widest">02 //</span>
 <div>
 <h2 className="text-xl text-background font-bold uppercase tracking-tight leading-none">Live Arena</h2>
 <p className="text-muted-foreground text-[10px] tracking-widest mt-1">TELEMETRY // SEC_7G</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 border border-green-500/30">
 <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span>
 <span className="text-[10px] text-green-500 tracking-widest uppercase">Network Stable</span>
 </div>
 </div>
 </div>

 <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-px bg-card/5">
 
 {/* Activity Feed */}
 <div className="lg:col-span-3 bg-[#0a0a0a] p-6 overflow-y-auto relative flex flex-col">
 <h3 className="text-xs text-muted-foreground tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-transparent pb-2">
 <Radio className="w-3 h-3 text-primary" /> Activity Feed
 </h3>
 <div className="space-y-1 flex-grow">
 <FeedItem time="00:04" text="Player_One achieved High Score in Neon Nights" type="primary" />
 <FeedItem time="00:12" text="Station B4 reserved by Team_Liquid" type="cyan" />
 <FeedItem time="01:30" text="Tournament Tekken 8 Quarter-finals starting now." type="purple" />
 <FeedItem time="05:00" text="System Maintenance scheduled for 03:00 AM." type="gray" />
 <FeedItem time="06:22" text="Ghost_Rider logged in." type="primary" />
 </div>
 </div>

 {/* Main Stage Map */}
 <div className="lg:col-span-6 bg-[#050505] relative flex flex-col p-8">
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
 
 <div className="flex-grow relative flex items-center justify-center border border-transparent bg-black/50">
 
 {/* Radar Rings */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
 <div className="w-[400px] h-[400px] border border-cyan-500/20 rounded-full"></div>
 <div className="w-[200px] h-[200px] border border-cyan-500/30 rounded-full"></div>
 <div className="w-[2px] h-[400px] bg-cyan-500/10 absolute"></div>
 <div className="w-[400px] h-[2px] bg-cyan-500/10 absolute"></div>
 {/* Radar Sweep */}
 <div className="absolute w-[200px] h-[200px] border-r-2 border-cyan-500 rounded-full animate-spin-slow origin-bottom-right" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}></div>
 </div>

 {/* Stations */}
 <div className="grid grid-cols-2 gap-32 relative z-10">
 <div className="grid grid-cols-2 gap-4">
 <Station status="active" id="A1" />
 <Station status="offline" id="A2" />
 <Station status="open" id="A3" />
 <Station status="active" id="A4" />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <Station status="open" id="B1" />
 <Station status="active" id="B2" />
 <Station status="active" id="B3" />
 <Station status="open" id="B4" />
 </div>
 </div>

 {/* Center Core */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-black p-2 border border-cyan-500/50">
 <span className="text-cyan-500 font-bold tracking-widest text-[10px] uppercase">Main Core</span>
 </div>
 </div>
 </div>

 {/* Leaderboard */}
 <div className="lg:col-span-3 bg-[#0a0a0a] p-6 flex flex-col">
 <h3 className="text-xs text-muted-foreground tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-transparent pb-2">
 <Target className="w-3 h-3 text-purple-500" /> Global Ranking
 </h3>
 
 <div className="flex-grow">
 <div className="grid grid-cols-[auto_1fr_auto] gap-4 text-[10px] text-muted-foreground uppercase tracking-widest mb-2 px-2">
 <span>Rnk</span>
 <span>User</span>
 <span className="text-right">Score</span>
 </div>
 <div className="space-y-1">
 <LeaderboardRow rank="01" user="Neon_Samurai" score="99,842" isTop />
 <LeaderboardRow rank="02" user="Cyber_Ninja" score="94,220" />
 <LeaderboardRow rank="03" user="Viper_X" score="88,105" />
 <LeaderboardRow rank="04" user="Glitch_00" score="82,400" />
 <LeaderboardRow rank="05" user="Void_Runner" score="76,990" />
 </div>
 </div>

 {/* Challenge Box */}
 <div className="mt-8 p-4 bg-[#111] border border-transparent relative overflow-hidden group">
 <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
 <h4 className="text-purple-500 font-bold text-[10px] uppercase tracking-widest mb-2 relative z-10">Active Directive</h4>
 <p className="text-background/80 text-xs font-sans relative z-10">"Beat the dev score on Pixel Storm"</p>
 <div className="mt-4 w-full bg-black border border-transparent h-1 relative z-10">
 <div className="bg-purple-500 h-full" style={{ width: '70%' }}></div>
 </div>
 <span className="text-[10px] text-muted-foreground mt-2 block text-right tracking-widest relative z-10">T-MINUS: 72:00:00</span>
 </div>
 </div>
 </div>
 </section>

 {/* Hardware Specs - Technical/Brutalist */}
 <section className="relative py-32 bg-[#050505] border-t border-transparent" id="hardware">
 <div className="max-w-7xl mx-auto px-4 lg:px-8">
 
 <div className="mb-16">
 <span className="text-green-500 text-xs tracking-widest">03 //</span>
 <h2 className="text-4xl md:text-5xl text-background font-bold uppercase tracking-tight mt-2">Hardware Specs</h2>
 <p className="text-muted-foreground text-sm tracking-widest mt-2 uppercase">Authorized Personnel Only</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
 
 {/* Schematic Graphic */}
 <div className="relative aspect-square border border-transparent bg-[#0a0a0a] p-8 flex items-center justify-center group overflow-hidden">
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
 
 {/* Abstract Rig Representation */}
 <div className="relative w-full h-full border border-green-500/20 flex items-center justify-center">
 <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500"></div>
 <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-green-500"></div>
 <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-green-500"></div>
 <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500"></div>
 
 <Server className="w-32 h-32 text-foreground/80 group-hover:text-green-500 transition-colors duration-500" strokeWidth={1} />
 
 {/* Data lines */}
 <div className="absolute top-1/4 left-0 w-1/4 h-px bg-green-500/30"></div>
 <div className="absolute bottom-1/4 right-0 w-1/4 h-px bg-green-500/30"></div>
 </div>

 {/* Labels */}
 <div className="absolute top-4 left-4 text-[8px] text-green-500 tracking-widest uppercase">
 FIG 1.0<br/>IMMERSION RIG
 </div>
 </div>

 {/* Specs List */}
 <div>
 <div className="space-y-6">
 <SpecItem label="Refresh Rate" value="240Hz" desc="Ultra-smooth visual delivery" />
 <SpecItem label="Response Time" value="1ms GtG" desc="Zero latency input processing" />
 <SpecItem label="Compute" value="RTX 4090" desc="Neural-net enhanced rendering" />
 <SpecItem label="Haptics" value="Orient-X" desc="Full-body sensory feedback matrix" />
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Footer */}
 <footer className="bg-[#0a0a0a] border-t border-transparent pt-16 pb-8">
 <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
 <div>
 <span className="font-bold text-xl tracking-tighter text-background uppercase leading-none block mb-4">ORIENT<span className="text-primary">GAMES</span></span>
 <p className="text-muted-foreground text-[10px] tracking-widest uppercase leading-relaxed">
 SYS.CORE.ONLINE<br/>
 EST. 2042<br/>
 NEON DISTRICT
 </p>
 </div>
 
 <FooterCol title="Hub" links={['Start Game', 'VR Experiences', 'Leaderboard']} color="cyan" />
 <FooterCol title="Esports" links={['Tournaments', 'Team Registration', 'Prize Pools']} color="primary" />
 <FooterCol title="Support" links={['Hardware Specs', 'FAQ', 'Contact GM']} color="purple" />
 </div>

 <div className="border-t border-transparent pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-foreground/80 tracking-widest uppercase">
 <p>© 2026 ORIENT GAMES. ALL RIGHTS RESERVED.</p>
 <div className="flex items-center gap-6">
 <span className="hover:text-muted-foreground cursor-pointer">PRIVACY</span>
 <span className="hover:text-muted-foreground cursor-pointer">TERMS</span>
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
 <span className="text-green-500">SYS.OK</span>
 </div>
 </div>
 </div>
 </div>
 </footer>
 </div>
 );
};

// Subcomponents

const GameEntry = ({ id, title, desc, img, accent }: { id: string, title: string, desc: string, img: string, accent: 'cyan' | 'primary' | 'purple' }) => {
 const colorMap = {
 cyan: 'text-cyan-500 border-cyan-500/30 hover:border-cyan-500',
 primary: 'text-primary border-primary/30 hover:border-primary',
 purple: 'text-purple-500 border-purple-500/30 hover:border-purple-500'
 };

 return (
 <div className={`group relative h-[40vh] min-h-[300px] border-b border-transparent flex items-center overflow-hidden bg-[#050505]`}>
 {/* Background Image */}
 <div className="absolute inset-0 w-full h-full">
 <img src={img} alt={title} className="w-full h-full object-cover opacity-20 filter grayscale contrast-150 group-hover:opacity-40 group-hover:grayscale-0 transition-all duration-700" />
 <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent"></div>
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
 </div>

 <div className="relative z-10 max-w-7xl mx-auto w-full px-4 lg:px-8 flex justify-between items-center">
 <div className="max-w-xl transform transition-transform duration-500 group-hover:translate-x-4">
 <span className={`${colorMap[accent].split(' ')[0]} text-[10px] tracking-[0.3em] mb-4 block uppercase`}>/// DIRECTIVE: {id}</span>
 <h3 className="text-5xl md:text-7xl font-black text-background mb-4 uppercase tracking-tighter leading-none">{title}</h3>
 <p className="text-muted-foreground text-sm font-sans leading-relaxed max-w-md">{desc}</p>
 </div>
 
 <div className="hidden md:block opacity-0 group-hover:opacity-100 transform translate-x-8 group-hover:translate-x-0 transition-all duration-500">
 <button className={`px-8 py-3 bg-transparent border ${colorMap[accent].split(' ').slice(1).join(' ')} text-background text-xs tracking-widest uppercase hover:bg-card hover:text-foreground transition-colors`}>
 Initialize
 </button>
 </div>
 </div>
 </div>
 );
};

const FeedItem = ({ time, text, type }: { time: string, text: string, type: 'primary' | 'cyan' | 'purple' | 'gray' }) => {
 const colorMap = {
 primary: 'border-primary text-primary',
 cyan: 'border-cyan-500 text-cyan-500',
 purple: 'border-purple-500 text-purple-500',
 gray: 'border-gray-600 text-muted-foreground'
 };

 return (
 <div className={`p-3 border-l-2 ${colorMap[type].split(' ')[0]} bg-card/5 text-[10px] uppercase tracking-wider hover:bg-card/10 transition-colors`}>
 <span className="text-foreground/80 block mb-1">{time} AGO</span>
 <p className="text-background/80 font-sans">{text}</p>
 </div>
 );
};

const Station = ({ status, id }: { status: 'active' | 'offline' | 'open', id: string }) => {
 const statusMap = {
 active: 'bg-[#111] border-primary text-primary shadow-[0_0_10px_rgba(255,106,0,0.2)]',
 offline: 'bg-[#111] border-border text-foreground/80 opacity-50',
 open: 'bg-green-500/5 border-green-500/50 text-green-500 hover:bg-green-500/20 cursor-pointer transition-colors'
 };

 return (
 <div className={`w-12 h-12 border flex flex-col items-center justify-center relative ${statusMap[status]}`}>
 <span className="text-[8px] tracking-widest">{id}</span>
 {status === 'active' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></div>}
 </div>
 );
};

const LeaderboardRow = ({ rank, user, score, isTop }: { rank: string, user: string, score: string, isTop?: boolean }) => (
 <div className={`grid grid-cols-[auto_1fr_auto] gap-4 p-2 text-xs tracking-widest uppercase items-center ${isTop ? 'bg-primary/10 border border-primary/30' : 'hover:bg-card/5 border border-transparent'}`}>
 <span className={isTop ? 'text-primary font-bold' : 'text-muted-foreground'}>{rank}</span>
 <span className="text-background/80 font-sans">{user}</span>
 <span className={isTop ? 'text-primary font-bold text-right' : 'text-muted-foreground text-right'}>{score}</span>
 </div>
);

const SpecItem = ({ label, value, desc }: { label: string, value: string, desc: string }) => (
 <div className="border-b border-transparent pb-4 group">
 <div className="flex justify-between items-end mb-1">
 <span className="text-[10px] text-muted-foreground tracking-widest uppercase">{label}</span>
 <span className="text-xl text-background font-bold tracking-tight group-hover:text-green-500 transition-colors">{value}</span>
 </div>
 <p className="text-xs text-muted-foreground font-sans">{desc}</p>
 </div>
);

const FooterCol = ({ title, links, color }: { title: string, links: string[], color: 'cyan' | 'primary' | 'purple' }) => {
 const colorClass = {
 cyan: 'text-cyan-500',
 primary: 'text-primary',
 purple: 'text-purple-500'
 }[color];

 return (
 <div>
 <h4 className={`${colorClass} font-bold uppercase tracking-widest text-[10px] mb-4`}>{title}</h4>
 <ul className="space-y-2 text-xs text-muted-foreground tracking-wider uppercase">
 {links.map(link => (
 <li key={link}><a className="hover:text-background transition-colors" href="#">{link}</a></li>
 ))}
 </ul>
 </div>
 );
};

export default CyberOdyssey;
