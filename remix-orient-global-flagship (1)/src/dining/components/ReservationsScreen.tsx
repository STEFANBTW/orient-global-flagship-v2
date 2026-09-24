import React, { useState, useRef } from 'react';
import { UnifiedCheckout } from './UnifiedCheckout';
interface ReservationsScreenProps {
  onNavigateToMenu?: () => void;
}

const ReservationsScreen: React.FC<ReservationsScreenProps> = ({ onNavigateToMenu }) => {
  const TIMES = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'];
  
  const [tooltip, setTooltip] = useState<{show: boolean, x: number, y: number, id: string, seats: string, desc: string}>({
    show: false, x: 0, y: 0, id: '', seats: '', desc: ''
  });
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(2);

  const mapRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent, id: string, seats: string, desc: string) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTooltip({ show: true, x, y, id, seats, desc });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  const handleTableClick = (id: string) => {
    setSelectedTableId(id);
    setSelectedTime(null);
  };
  
  const getTableClass = (id: string) => {
    if (selectedTableId === id) return "table-seat fill-primary/20 stroke-primary stroke-2 cursor-pointer";
    return "table-seat fill-white dark:fill-[#2d2018] stroke-gray-300 dark:stroke-white/20 stroke-1 hover:fill-gray-100 dark:hover:fill-[#3d2b20] cursor-pointer transition-colors";
  };

 return (
 <div className="bg-background text-foreground font-display min-h-screen selection:bg-primary selection:text-background">
 {/* Navigation - REMOVED redundant local nav */}

 {/* Section 1: Hero */}
 <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
 {/* Background Image with Overlay */}
 <div className="absolute inset-0 z-0">
 <img 
 alt="Atmospheric dining room at sunset with warm lighting" 
 className="w-full h-full object-cover opacity-60 dark:opacity-60" 
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUe5ZP5MQA7ixW0Da_MfWshoZ0lELmWcPtpCFS_7XhwFeNxobxMNmSqA0iWAsLI1TIvXT2NikxEZIUmLUv1x3sOH5b0GP9zGK9ak3Eq7JdpZjfHixGVVDDtqOyvhen7_eriB3oXUcGRu_9YOlpDpdEX-dZkLfxCML86oAFi2psfygVI9nBjc7COk76SLtG4eCuyKnvQ02nwQZLV5gOy9r5JPEwXVMzd_cSQAaGfgkFkUJY9uGZWSft4gLTZrqyXGfPiL7_oLLlBVfu"
 />
 <div className="absolute inset-0 bg-gradient-to-b from-background-light/30 dark:from-background-dark/30 via-background-light/50 dark:via-background-dark/50 to-background-light dark:to-background-dark"></div>
 </div>
 <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10 animate-fade-in-up">
 <span className="text-primary font-medium tracking-widest uppercase mb-3 block text-sm">Welcome to Orient</span>
 <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
 Taste the Sunset.<br/>
 <span className="text-foreground/80 font-light italic">Reserve Your Moment.</span>
 </h1>
 <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto font-light">
 Experience culinary excellence in an atmosphere of warmth and elegance. From intimate balcony seating to grand hall feasts.
 </p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <a className="bg-primary text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20" href="#floor-plan">
 <span className="material-icons text-lg">table_restaurant</span>
 Pick Your Spot
 </a>
 <a className="bg-card/50 backdrop-blur-md text-foreground border border-border px-6 py-3 rounded-lg font-semibold text-base hover:bg-card/60 dark:hover:bg-card/20 transition-all flex items-center justify-center gap-2" href="#occasions">
 <span className="material-icons text-lg">celebration</span>
 Plan an Event
 </a>
 </div>
 </div>
 {/* Scroll Indicator */}
 <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
 <span className="material-icons text-foreground/50 text-3xl">keyboard_arrow_down</span>
 </div>
 </section>

 {/* Section 2: Unified Reservation Form */}
 <section className="py-8 md:py-16 px-0 md:px-6 relative bg-card transition-colors" id="floor-plan">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-12">
 <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Reserve Your Table</h2>
 <p className="text-muted-foreground text-sm">Select a table, time, and tell us your preferences.</p>
 </div>
 
 <UnifiedCheckout
 isOpen={true}
 onClose={() => {}}
 source="reservation"
 variant="inline"
 onNavigateToMenu={onNavigateToMenu}
 />
 </div>
 </section>

 {/* Section 3: Special Occasions */}
 <section className="py-16 bg-background transition-colors" id="occasions">
 <div className="max-w-7xl mx-auto px-6">
 <div className="text-center mb-16">
 <span className="text-primary font-bold uppercase tracking-widest text-xs">Beyond Dining</span>
 <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Special Occasions</h2>
 </div>
 {/* Content Blocks */}
 <div className="space-y-16">
 {/* Birthday Packages */}
 <div className="flex flex-col md:flex-row gap-10 items-center">
 <div className="w-full md:w-1/2 relative group">
 <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-all duration-500"></div>
 <img alt="Friends celebrating with cake and champagne" className="relative rounded-xl w-full h-[320px] object-cover shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz4t63zQlqwgNr3V3xWIh6dUAcyR4skNP93N-2mQX8sQoYB5MIv4S8m0siIUlwEDD-Q7KmFJw0JndqVdz0xaUaY22al93QbjmS-EMEb0jZjhloqVYi8rkFYVF_cjl1ULasiSvs7RvbxX8LfGtk_c9uo6tVUW1BNA4hIXGjVpdjKFAtwgdKB0CiSER1Bh-RLwHCFlBB3TgYGnvu_fm-POqKHUxDO3ZcDFmTR8HkaAMv22JMhw9n717aomsL2mwPrc1N8m4Rf1eQPHei"/>
 </div>
 <div className="w-full md:w-1/2 space-y-5">
 <h3 className="text-2xl font-bold text-foreground ">Birthday Packages</h3>
 <p className="text-foreground/80 leading-relaxed text-sm">
 Turn another year older into a timeless memory. Our birthday packages include a complimentary bottle of vintage champagne, a custom dessert presentation by our pastry chef, and a personalized menu card for the guest of honor.
 </p>
 <ul className="space-y-2 text-muted-foreground text-sm">
 <li className="flex items-center gap-2"><span className="text-primary material-icons text-xs">check_circle</span> Private booth options</li>
 <li className="flex items-center gap-2"><span className="text-primary material-icons text-xs">check_circle</span> Custom cake pre-ordering</li>
 <li className="flex items-center gap-2"><span className="text-primary material-icons text-xs">check_circle</span> Dedicated server</li>
 </ul>
 <button className="text-primary font-semibold hover:text-orange-600 dark:hover:text-background transition-colors flex items-center gap-2 group text-sm">
 Inquire Now <span className="material-icons text-sm transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
 </button>
 </div>
 </div>
 {/* Corporate Dinners */}
 <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
 <div className="w-full md:w-1/2 relative group">
 <div className="absolute -inset-2 bg-background rounded-xl blur-lg group-hover:bg-gray-300 dark:group-hover:bg-card/10 transition-all duration-500"></div>
 <img alt="Formal table setting for business dinner" className="relative rounded-xl w-full h-[320px] object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD79xwYBgrkDa55G-uxTYJPYvV5-BgKp-660ClVwGRdAoxn3tNIzlmM2XDM7yRnrX5sEyAdgUuIqX2cHZUT9e5VQ_oVgIyDhQ-sUNJNAEKoSzkSzSNrQVIN1dNqlKMdwmbJMR_KitQ5-RimBcp54wEjUQuhtmY7dtymNi4-NRRe5OoxUK8G8ysxwKXhKEogNg37lZW77yQkjpU62xlUIocOkMW5CmdW4a9hRBIz1TvJ65LEaNKjy6q6gZJF4Ti3oKx48kSy_Wgceu0Q"/>
 </div>
 <div className="w-full md:w-1/2 space-y-5">
 <h3 className="text-2xl font-bold text-foreground ">Corporate Dinners</h3>
 <p className="text-foreground/80 leading-relaxed text-sm">
 Seal the deal or celebrate the team in our sound-proofed private suites. We offer AV capabilities for presentations and a discreet service style that ensures your meeting flow is never interrupted.
 </p>
 <div className="grid grid-cols-2 gap-3">
 <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
 <span className="text-primary font-bold text-lg block mb-0.5">12-40</span>
 <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Guests</span>
 </div>
 <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
 <span className="text-primary font-bold text-lg block mb-0.5">AV/Tech</span>
 <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Available</span>
 </div>
 </div>
 </div>
 </div>
 {/* Private Chef */}
 <div className="flex flex-col md:flex-row gap-10 items-center">
 <div className="w-full md:w-1/2 relative group">
 <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-all duration-500"></div>
 <img alt="Chef plating a gourmet dish up close" className="relative rounded-xl w-full h-[320px] object-cover shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByB2nt681amZpjVAOBAqxaUa0qELYH0n32eZoV_15SEnr0MIAXVSH3wSPUF3s4Yt0Lr_G5gJdCCDKPAUZwkshbLQGOEu2aYr3bWqfzRFEwLrPewdfjngjYqiBM45TGGJaGHWQYltsd0KOBP22Ca93LZXmEjEzywN_FRlAOErJmUEEqrMAmyAp71fykSF3Qq6F5hiMP4t2Cw9h2rt5Sx9lzLGKGjq-nKYanTpbxsRK9mOmeaPP-Mmcjhw88b06DYSk4--Df20YQX6MA"/>
 </div>
 <div className="w-full md:w-1/2 space-y-5">
 <h3 className="text-2xl font-bold text-foreground ">Private Chef Experiences</h3>
 <p className="text-foreground/80 leading-relaxed text-sm">
 For the ultimate gastronome. Sit at the exclusive Chef's Table or book a private room for a 7-course tasting menu curated specifically for your palate, paired with rare wines from our cellar.
 </p>
 <button className="bg-background hover:bg-background dark:hover:bg-card/20 text-foreground px-5 py-2.5 rounded-lg border border-border transition-all text-sm">
 View Sample Menu
 </button>
 </div>
 </div>
 </div>
 {/* Bento Grid Gallery */}
 <div className="mt-20">
 <h4 className="text-xl font-bold text-foreground mb-6 border-l-4 border-primary pl-4">Past Events Gallery</h4>
 <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[500px]">
 <div className="col-span-2 row-span-2 relative overflow-hidden rounded-none group">
 <img alt="Long banquet table with candles" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJSOEfy1uJQdgDqGWc1IemM3lHFGr3tll1HhiqWazGB5r6R_8Ly1YTGwM-P-_qzbPKcd0VUQjITZk8HJHa65zxtv4Qt4aFoAxXTW6rHhECDNilhSdD19ASth5inMS7osmUlVuuveCBcRc6UXpb9P6qzjz6RD1v1xY60L6s8JlFjgjw69IgJ_z_19vODB1gXIzA9rZfWJ5CvaRZIKQVOKpsUtAqqbV13WsA0Ov0xuXe2wqFFA-aQg918SxgooN4Jo6LYlu2Z6OZ1ady"/>
 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
 </div>
 <div className="relative overflow-hidden rounded-none group col-span-1 row-span-1">
 <img alt="Detailed cocktail shot" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGTun2jiwF4ZlK-9Y5G5NTO4lje8X2bWHEZybGGUxWn_oTRPBR0XXTTM5CN99j31RXivgXd-1JpZjOpD6uowUltWAqMI4JXIzmZSA6ci0aTI3dOGhJcWt0N3NAZ2lu3DARQJT0Qc6B0m-tXwy5SuLiZnaqRl-zuNbpj_-GzkYtxE_xna1SPQ6uIj4SRUzTGbA8vcRwxfWKlz-l3X95BcVKshaS6QBTylxmINcx8ZBfbvRYp0P3Uf9wsTgQHGJ5lky2z-2m0Y5ANnIe"/>
 </div>
 <div className="relative overflow-hidden rounded-none group col-span-1 row-span-1">
 <img alt="Happy couple dining" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqNwMz6y9xntz3uZ9rTjiHrQsbjTOi4xUXMif1BnL2dJoPm1wNmUzlEGpVNJCKbtnUtBexZ4-xffZ2PPRFaplEqC_BMwUHiqIMfSM1eNtX0rzSptgxtQLtOSURylhh9XYs-dJgQ59wc7yEm9A43UhPZIOKXwtv0tp_5Ypo5HGIGt6zP1AkFepJn8f4hoxJaNSoKd-dkVBzl7is3GfAtRkLCg5wgknWTKB7yHaxOkmUvl_x-G8pm5dQTcd0ZITrPApuB6yf4BijS90l"/>
 </div>
 <div className="col-span-2 relative overflow-hidden rounded-none group row-span-1">
 <img alt="Plated gourmet food overhead" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5GtUzp-YVlOJ65tIH6ETdbvCfa_7uK4hYxFiGjRpK9jpeoC5Mvw0RcOaWcQXBIPs8sDSF9PbTqXBXMmeC2GgEI1z3NdAUacFlDYLuuv33qreElmANarbVzlEvBTGDOJsxvqoDxLUtI5SDEIeIXUII9fDmjIlJ-xj9MkeiEDql1XSEiREwRbNDAXhcOssuq0ZtefnNM52uhBidofgBf515jzWqWMyeyT2O09HS8QY4FxdkGZqQc5XZr6vfBorlcNpJtXQaUbACChsn"/>
 </div>
 </div>
 </div>
 </div>
 </section>



 {/* AI Assistant: The Concierge */}
 <div className="fixed bottom-24 right-6 z-50 group">
 <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-foreground text-background px-3 py-1 rounded text-xs text-background whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-transparent">
 Ask The Concierge
 </div>
 <button className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffd700] to-[#b8860b] shadow-xl shadow-yellow-900/40 flex items-center justify-center transform hover:scale-110 transition-transform duration-300 relative overflow-hidden">
 <div className="absolute inset-0 bg-card/20 animate-pulse"></div>
 <span className="material-icons text-foreground text-3xl font-bold">theater_comedy</span>
 </button>
 </div>
 </div>
 );
};

export default ReservationsScreen;