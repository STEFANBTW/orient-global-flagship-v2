
import React from 'react';

const Concierge: React.FC = () => {
 return (
 <div className="bg-[#130f09] font-manrope text-white min-h-screen overflow-x-hidden p-8">
 <div className="max-w-6xl mx-auto pt-12">
 <div className="mb-12">
 <h2 className="text-primary/60 text-xs uppercase tracking-[0.3em] mb-4">Midnight Concierge</h2>
 <h1 className="text-4xl md:text-6xl font-light tracking-wide text-background">Welcome back, <br/><span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Alexander.</span></h1>
 </div>

 {/* The Elite Card */}
 <div className="max-w-md w-full aspect-[1.586/1] bg-black border border-transparent rounded-2xl p-8 relative overflow-hidden group mb-16">
 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
 <div className="relative z-10 h-full flex flex-col justify-between">
 <div>
 <span className="text-xs text-background/40 uppercase tracking-widest">Prestige Points</span>
 <div className="text-4xl font-bold text-primary mt-1">12,450</div>
 </div>
 <div className="w-12 h-8 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-md border border-transparent"></div>
 <div className="flex justify-between items-end">
 <div>
 <p className="text-[10px] text-background/30 uppercase tracking-widest mb-1">Member ID</p>
 <p className="font-mono text-background/80 tracking-widest">8821 9004 1120</p>
 </div>
 <span className="text-xs font-bold uppercase tracking-widest">Noir Elite</span>
 </div>
 </div>
 </div>

 {/* Exclusive Access Slider */}
 <div className="mb-20">
 <div className="flex justify-between items-end mb-8">
 <div>
 <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Exclusive Access</h3>
 <h2 className="text-3xl font-light">Reserved For You</h2>
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {[
 { title: 'The Macallan 30', date: 'Nov 14th', tag: 'Tasting Event', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj1YyoUBSrUqWAPMpZ5sP2ycYq9dn5dVvn3lXdnO3pZ8NeXNbEejfTINPwA_UuhX-3V10a3Mj7UwmCYBLH9nfStCHx7ki4lAN0GICxxnVywssK-PtL_hAiLfxtf_81Q0FPFkO5qugkfriQ0WscCCHJoPkZgBwEHxg_P2lgr5ORf066Dd2FKxKfjTza7cT_U4zyO0ed9Chjts8zZhAEWqorNFwn7BKwqrs0VWxGZGTeSlqKxiXz3czqEB84cDupdXnJy91Axzf3c2i_' },
 { title: 'NYE Private Booth', date: 'Dec 31st', tag: 'Priority Booking', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCioRnl00eW24ABrKhQngIa6ytuI-LInYYN2v2oxYoWE7yvzqF3K7Vm55etJw6NjMqvZHM12QziArA9FiuTn_dhkqiZgNeQ0Myw1LYCXjGTNTDeqWj6ihwYguTbGCKuJ8TMZx8q-wKE4lif-MmFcklf5qV0stwi1W9V57ZrWJqrGfby1XbQlneFmqBMX_5Wu8YoklFK49JfGLtkDonDFFFP7kAuZSjjU4VHIRyY-szsMzyql59ygOrYHB9lQFWbK6OZbTmwyZnGwPgF' },
 { title: 'Cigar Lounge Opening', date: 'Dec 2nd', tag: 'Launch Party', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRiu5GpFwTxKy_LD8GJF2wm3Y3_vhr69T8oaTbU-z0X_bx5v8URcmrbWjKzL8L5d0iqwlukhQgOObxZfhT7B-6sNJX6UbKqHA-QCN5z7uNQKU9_E3m_nAheKDZQjvlFjSyx4YxKK2beiIFwa3WiYrKGmymVbsPJCUjXK63spyGOA9Zx7wXuUB1SHY8-UVmk92FIGaFY6z0yJymbdufR_gwV9vNMoOmNxSpJMkv99YKUikjKLwgD-t9-yG9sg0YZKof09Jv4yclZGym' }
 ].map((card, i) => (
 <div key={i} className="group cursor-pointer">
 <div className="relative h-[400px] rounded-xl overflow-hidden mb-4 border border-transparent">
 <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={card.title} src={card.img} />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
 <div className="absolute bottom-0 left-0 p-6">
 <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 rounded border border-primary/30 uppercase">{card.tag}</span>
 <h3 className="text-xl font-medium mt-2">{card.title}</h3>
 <p className="text-sm text-background/60">{card.date}</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* History */}
 <div className="pb-24">
 <h2 className="text-3xl font-light mb-8">Your Signatures</h2>
 <div className="space-y-4">
 <div className="bg-foreground text-background/50 p-6 rounded-xl border border-transparent flex items-center justify-between">
 <div className="flex items-center gap-6">
 <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center text-primary">
 <span className="material-icons">liquor</span>
 </div>
 <div>
 <h4 className="text-lg font-medium">Old Fashioned w/ Smoked Maple</h4>
 <p className="text-sm text-background/40">Ordered 3 times this month</p>
 </div>
 </div>
 <button className="bg-card/5 hover:bg-primary hover:text-foreground px-4 py-2 rounded text-xs uppercase transition-all">Reorder</button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default Concierge;
