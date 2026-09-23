
import React from 'react';

const Booking: React.FC = () => {
 return (
 <div className="bg-background-dark font-display text-background min-h-screen overflow-x-hidden">
 {/* Hero */}
 <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
 <div className="absolute inset-0 z-0">
 <img className="w-full h-full object-cover animate-[hero-pan_30s_infinite_alternate]" alt="Lounge" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT9A6yls7951yfoo6ClqY2nrNQtN9LOisNkfxzieJ3LrAzX3q5yNQZLeYJiVL6BNIy6w0QlRlDI4kI0XoMohG4az0pvyT7nYVsnB6GjuzMcd4o2DUiSV7PNO_tDnzHX3Ng-yQyWTd8azbBENmEWvJqCUsaMFoi2H_0jNTZPemJ4NWYkU6KUbi4eY9WAaM47nJonhd72QXMBszAkg-kvtJOP30_-llKyT8c1du3jKDjxF7-XjGNPjCO-NjuKG_HNLXGC03-VF7sgQ0F" />
 <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
 </div>
 <div className="relative z-10 text-center px-6">
 <span className="text-primary text-xs font-bold tracking-widest uppercase mb-4 block">Private Access Only</span>
 <h1 className="text-6xl md:text-8xl font-bold mb-6">Sanctuary <br/><span className="text-primary">Awaits</span></h1>
 <p className="text-background/80 max-w-xl mx-auto mb-8 font-light">Reserve your private corner of the night. Where shadows meet gold.</p>
 <button className="bg-primary text-foreground px-10 py-4 rounded font-bold uppercase tracking-widest hover:bg-card transition-all">Select Your Sanctuary</button>
 </div>
 </section>

 {/* Map Section */}
 <section className="py-24 bg-gradient-noir">
 <div className="text-center mb-16">
 <h2 className="text-4xl md:text-5xl font-bold mb-4">The Floor Plan</h2>
 <p className="text-muted-foreground">Navigate the lounge. Click a zone to verify availability.</p>
 </div>
 <div className="perspective-container max-w-5xl mx-auto h-[600px] bg-foreground text-background/50 rounded-2xl border border-transparent relative overflow-hidden group">
 <img className="w-full h-full object-cover opacity-20 transition-all group-hover:opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwjtlH3vG2sTOF8NREdcUCTEaHhG1d2lZfpCDDR20MyMZSBpcrPHCBuSFTb3T30XSDmDNyhEfWV6SYDX63j3m_tfpQS-4r9n4blHzA8_336GBomd-u_V7o5AmYp-clTdVqFRJcFFF8tGn3yLh5P8E4JCYz2H9MstPdZDmaWPU-ORv4yLbNVIPi8bPeJlL8NHBU1QNcVWarIldyyEEwTIL-H-10esRw4gXZjSUDzJbo41KixlMDUHivj3jiodFzsKaI8LnLaVvRY6Vf" alt="Blueprint" />
 <div className="absolute top-[20%] left-[20%]">
 <button className="w-6 h-6 rounded-full bg-primary animate-pulse-gold"></button>
 </div>
 <div className="absolute top-[30%] right-[25%]">
 <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse-gold">
 <span className="material-icons text-foreground text-xs">lock</span>
 </button>
 </div>
 <div className="absolute bottom-6 right-6 border border-transparent px-4 py-2 rounded bg-black/40 text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
 <span className="material-icons text-sm">explore</span> Interactive Map
 </div>
 </div>
 </section>

 {/* Packages */}
 <section className="py-24 px-6 bg-background-dark">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-4xl font-bold mb-12">Exclusivity Packages</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-[#121214] rounded-xl border border-transparent overflow-hidden flex flex-col md:flex-row h-auto md:h-80 hover:border-primary transition-all">
 <div className="w-full md:w-1/3 relative">
 <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_9UOaJq303dsKv8MpWkaQ8YAc3TE8wuyFTUCTNdttd-Zq_-cn8eLzdj1o6W4ox__8zoInN237h-kpGhUHfHGXCexBG8LppFDw-kdKkUXMSPW-pwsM-MykL59Edr3EvT7cAirrWXGgmkQh1viMwTfr_-EtFZHyMvTuJ5YY1xN8QZ5-Wp5gR2yXZsjj9MKjvcQRGJvPoI-QmXp66NHe47qlQ98RKc71gr1fiFlz2-syVRmWHDRDu5GLJnxspSevQNvE3OAWz47zBhxx" alt="Gold Standard" />
 <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
 </div>
 <div className="flex-1 p-8 flex flex-col justify-between">
 <div>
 <h3 className="text-2xl font-bold mb-4">The Gold Standard</h3>
 <p className="text-muted-foreground text-sm mb-4">The essential VIP experience. Reserved booth, bottle service, personal server.</p>
 </div>
 <div className="flex justify-between items-end border-t border-transparent pt-4">
 <div>
 <span className="text-[10px] text-muted-foreground uppercase">Starting At</span>
 <div className="text-xl font-bold">₦1,500,000</div>
 </div>
 <button className="text-primary text-xs uppercase font-bold">Select</button>
 </div>
 </div>
 </div>
 <div className="bg-gradient-to-br from-blue-900/20 to-black rounded-xl border border-primary/20 overflow-hidden flex flex-col md:flex-row h-auto md:h-80 hover:border-primary transition-all">
 <div className="w-full md:w-1/3 relative">
 <img className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM8sZEAxN_ymrTCB4T2y64ICZiLGqxx_hwiPzDsOAk_l7wqQ7E5gR2uEsRdE6Uf4Oc4ccbL0KqDl0KM2-V7oVZQlOvhuQ0Oa0cW7HC_QvySEr322dZ55CF20WiNXk6IAjLx6HXCf4voFdbkaebOUQ-hMsgZxKsvIvsXMGopf2lQ9dcXHUdg8wyucFmv1co5LiJfnpJsZv1dMibQLUhQo7ky4PIwWpfxiXmN9yF4Z5lq5cW4U2aDlp89WVrVpbyEPwFEdcD88-Tw0t1" alt="Noir Elite" />
 </div>
 <div className="flex-1 p-8 flex flex-col justify-between">
 <div>
 <h3 className="text-2xl font-bold mb-4">Noir Elite</h3>
 <p className="text-muted-foreground text-sm mb-4">Uncompromised privacy. Access to The Private Vault via secret entrance.</p>
 </div>
 <div className="flex justify-between items-end border-t border-transparent pt-4">
 <div>
 <span className="text-[10px] text-muted-foreground uppercase">Starting At</span>
 <div className="text-xl font-bold">₦5,000,000</div>
 </div>
 <button className="text-primary text-xs uppercase font-bold">Select</button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Booking Form */}
 <section className="py-24 px-6 bg-black">
 <div className="max-w-4xl mx-auto bg-foreground text-background p-12 rounded-2xl border border-transparent shadow-2xl">
 <h2 className="text-3xl font-bold text-center mb-12">Secure Your Reservation</h2>
 <form className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <input className="bg-black border border-transparent rounded-lg p-4 outline-none focus:border-primary" type="date" />
 <select className="bg-black border border-transparent rounded-lg p-4 outline-none focus:border-primary">
 <option>09:00 PM</option>
 <option>10:00 PM</option>
 </select>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="p-4 border border-transparent rounded-lg text-center hover:bg-card/5 cursor-pointer">The Balcony</div>
 <div className="p-4 border border-primary bg-primary/10 rounded-lg text-center cursor-pointer">Private Vault</div>
 <div className="p-4 border border-transparent rounded-lg text-center hover:bg-card/5 cursor-pointer">Main Bar</div>
 </div>
 <button className="w-full bg-primary text-foreground py-4 rounded-full font-bold uppercase tracking-widest mt-8 hover:bg-yellow-400">Request VIP Access</button>
 </form>
 </div>
 </section>
 </div>
 );
};

export default Booking;
