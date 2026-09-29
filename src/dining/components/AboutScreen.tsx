import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AboutScreen: React.FC = () => {
 const [isFirstVisit, setIsFirstVisit] = useState(true);

 useEffect(() => {
 const hasVisited = sessionStorage.getItem('hasVisitedDiningAbout');
 if (hasVisited) {
 setIsFirstVisit(false);
 } else {
 sessionStorage.setItem('hasVisitedDiningAbout', 'true');
 }
 }, []);

 return (
 <div className="bg-background font-display text-foreground min-h-screen selection:bg-primary selection:text-background antialiased">
 {/* Navigation - REMOVED redundant local nav */}

 {/* Section 1: The Kitchen (Cinematic Hero) */}
 <section id="kitchen" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
 {/* Video Placeholder / Background */}
 <div className="absolute inset-0 bg-foreground text-background">
 <img 
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCToumsNCMvmFfsQ-fGyzQeDeBYaL8wHm24xFuD6Z5KvbocA8t11lZFUe_cDzGI3Sty_QD-K8bESCWBbSWSPi75UWAWwp3soy9nU5jzQ-mxwE7TCPAhbGrr5OlfnniGWEZ8VjJbxWJhbPMJG01uq2ggXGWpWZdgzcf-6hQj0OiwiVZxvUFvvxpK6NFgygCe1bCwGXUiwm6ccFe6gJDgmIT0OGpIbyS04_VtV_AqOuwTpaLmTxeWIs_bnqrkGucrVdeD4m76ubijMDvR" 
 alt="Chef hands preparing spices cinematic close up" 
 className="w-full h-full object-cover opacity-60" 
 />
 <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark/30"></div>
 </div>
 <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
 <motion.span 
 initial={{ opacity: 0, y: isFirstVisit ? 20 : 5 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: isFirstVisit ? 0.8 : 0.3, delay: isFirstVisit ? 0 : 0.1 }}
 className="block text-primary text-xl md:text-2xl mb-4 italic font-light"
 >
 Behind the Scenes
 </motion.span>
 <motion.h1 
 initial={{ opacity: 0, y: isFirstVisit ? 20 : 5 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: isFirstVisit ? 0.8 : 0.3, delay: isFirstVisit ? 0.2 : 0.15 }}
 className="text-6xl md:text-8xl lg:text-9xl text-background font-light leading-tight mb-8"
 >
 The Art of <br/><span className="italic text-primary/90">Orient</span>
 </motion.h1>
 <motion.p 
 initial={{ opacity: 0, y: isFirstVisit ? 20 : 5 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: isFirstVisit ? 0.8 : 0.3, delay: isFirstVisit ? 0.4 : 0.2 }}
 className="text-xl md:text-2xl text-background font-light tracking-wide max-w-2xl mx-auto"
 >
 Where culinary tradition meets obsessive precision. Witness the craft behind every plate.
 </motion.p>
 <motion.div 
 initial={{ opacity: 0, y: isFirstVisit ? 20 : 5 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: isFirstVisit ? 0.8 : 0.3, delay: isFirstVisit ? 0.6 : 0.25 }}
 className="mt-16"
 >
 <a href="#team" className="inline-flex flex-col items-center text-background/70 hover:text-primary transition-colors duration-300">
 <span className="text-sm uppercase tracking-widest mb-2 font-sans">Explore</span>
 <span className="material-icons animate-bounce">arrow_downward</span>
 </a>
 </motion.div>
 </div>
 </section>

 {/* Section 2: Our Team (Portrait Gallery) */}
 <section id="team" className="py-32 px-6 max-w-7xl mx-auto">
 <div className="text-center mb-24">
 <span className="text-primary text-lg uppercase tracking-widest font-medium block mb-3 font-sans">Our People</span>
 <h2 className="text-5xl md:text-6xl text-foreground font-light">The Brigade</h2>
 <div className="w-24 h-1 bg-primary/30 mx-auto mt-8"></div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
 {/* Team Member 1 */}
 <div className="group cursor-pointer">
 <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-6 shadow-xl">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn-huBoNiSjvhWyyLx6nuwBF2Qzk55Ns-UobHPuwnpJFUIPJqPHyqNxsVVJs9jYp1c4RqEhOYb_KvPlr2cpCEsDl5EirP8de_yQRECS-LL553boJOr7d3RWG6QchdHj5xqIknnvilq4Z2Dt_IOxAzQ2E6f_CDWs3vRCtfAGsAkGiweRRbztjfYvuWp-Ym-pT93crzNBvPSPbhxAsmllDKnPV-HavWucsniyo8AYsJO_F7oag05msqrJCZxQFdLW5m7Y5oSd5Rlp-5U" alt="Marco Rossi" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" />
 <div className="absolute bottom-4 left-4">
 <span className="bg-primary text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-sans">Executive Chef</span>
 </div>
 </div>
 <h3 className="text-3xl text-foreground mb-1 group-hover:text-primary transition-colors">Marco Rossi</h3>
 <p className="text-muted-foreground italic mb-4">"Cooking is an act of love, laid bare on a plate."</p>
 <div className="border-t border-primary/20 pt-4 mt-4">
 <span className="text-sm text-muted-foreground uppercase tracking-wide block mb-1 font-sans">Signature Dish</span>
 <span className="text-lg text-foreground ">Saffron Risotto & Bone Marrow</span>
 </div>
 </div>
 {/* Team Member 2 */}
 <div className="group cursor-pointer md:mt-16">
 <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-6 shadow-xl">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCsjyVHQ2ARO0KRWvg5UqVj6MR0-urvt0PzvtDdkenPoXqCaNPMDGrzQaSAcMWPieU57s1ctTOqJtVkVkhcef3Xg4AsvqmUa0hnGvpcXcd2S_GQR5rbcRa72Z9X_ayXx4nwmqZCx-0xS6v0PMr2SbNOj50BMKEIFjMiWCWPrmNf5IrZlFgRNFS9b-ZMYpPL7Jau15aVc1JmnZzHnyEec1AX6abR-Y3Fw4tSWV_27IU0_iNbhtM6fxzqQ-fdreP1Az_q-fj0tv5m9Th" alt="Elena Chen" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" />
 <div className="absolute bottom-4 left-4">
 <span className="bg-primary text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-sans">Head Pastry</span>
 </div>
 </div>
 <h3 className="text-3xl text-foreground mb-1 group-hover:text-primary transition-colors">Elena Chen</h3>
 <p className="text-muted-foreground italic mb-4">"Sweetness requires balance, not just sugar."</p>
 <div className="border-t border-primary/20 pt-4 mt-4">
 <span className="text-sm text-muted-foreground uppercase tracking-wide block mb-1 font-sans">Signature Dish</span>
 <span className="text-lg text-foreground ">Spiced Cardamom Pear Tart</span>
 </div>
 </div>
 {/* Team Member 3 */}
 <div className="group cursor-pointer">
 <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-6 shadow-xl">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYExP0qaC9RBejBSctMbmeYRbA_V7rgTnzvNVZa8icru2URmuKUpfd_GyLXFS24xHqX71YiNBTtYySunvDw-HugmP1HxyMa6ou_S3MLy-Ja_-DdmOOU_5e-23WwqImEmYz5uzstAILmNt4FS4f5VHqJPTT5srx73gP3PLqZNZ9qjiRXFg0QyGFayn71Mg9BKiMuidFsEYu1WJ7qN0fAJA6qwEGLypMiPljjWwgOBN7owxuTQx9b6AtaencmbyfEKZa-_GYi7dXVBOP" alt="David Okafor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" />
 <div className="absolute bottom-4 left-4">
 <span className="bg-primary text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-sans">Sous Chef</span>
 </div>
 </div>
 <h3 className="text-3xl text-foreground mb-1 group-hover:text-primary transition-colors">David Okafor</h3>
 <p className="text-muted-foreground italic mb-4">"Precision is the difference between good and great."</p>
 <div className="border-t border-primary/20 pt-4 mt-4">
 <span className="text-sm text-muted-foreground uppercase tracking-wide block mb-1 font-sans">Signature Dish</span>
 <span className="text-lg text-foreground ">Charred Octopus & Romesco</span>
 </div>
 </div>
 </div>
 </section>

 {/* Section 3: The Vibe (Auto-Scrolling Marquee) */}
 <section id="vibe" className="py-24 bg-background-dark text-background overflow-hidden relative">
 <div className="px-6 mb-12 max-w-7xl mx-auto flex justify-between items-end">
 <div>
 <span className="text-primary text-sm uppercase tracking-widest font-medium block mb-2 font-sans">Atmosphere</span>
 <h2 className="text-5xl md:text-6xl font-light">The Space</h2>
 </div>
 <p className="hidden md:block text-xl text-muted-foreground italic max-w-md text-right">
 "Dining isn't just about food. It's about how the light hits the table."
 </p>
 </div>
 <div className="relative w-full flex whitespace-nowrap overflow-hidden">
 <div className="animate-marquee flex gap-6 pl-6">
 {/* Image 1 */}
 <div className="w-[500px] h-[350px] flex-shrink-0 relative rounded-lg overflow-hidden group">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAH1Yci4kTz9NytWPx9-Oal1YBbGu1-kL0T33gPt9QzLAocAI65Cwr3pXXHFLyOJyPsKZG4624dL1vaYgPlx9CNf-M6jEc9dtMS2OuzyYkv4U6IwZUo1z3RH1DuqLWPy7KGZjyaaV88nZs9Zj6cIgHdV0awt3Vc3VPzbV3G-uit713izqi_9DxPUfo1KVmMupHZbsSDS-3jzpC4WwwVeLcBJ4peB711XAEbI5BMnXc23XKytl2EpYwYhF21nMWLy9AUmj7fp2CABx2" alt="Main Dining Hall" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
 <span className="text-xl font-light">Main Dining Hall</span>
 </div>
 </div>
 {/* Image 2 */}
 <div className="w-[300px] h-[350px] flex-shrink-0 relative rounded-lg overflow-hidden group">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzeNsX9DjtywP1T3YXQtwr4F0gIDUJBOwb_i2s7O4Q7AmQHyHoCngm-iHLLmWtp_bmVdu6W7ZPKrsBDzdkjrvtIbAqmUqE-iTRNtWlMx-BxNkYgU5e8pAEACEWl7aj4wTkj6TRrIR_T5ZZmFPkNEKgGyw0rZQpw1BYSi2o5018A_SECeFobHwtYzw3P1VSILIfvSSMnKRtlW5oSh-xOgB1XeWdWsTgE-NS8Tyo1SCTylldMRphKQCTtz_eO_PynvukVZL3-pWApawy" alt="The Bar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
 <span className="text-xl font-light">The Bar</span>
 </div>
 </div>
 {/* Image 3 */}
 <div className="w-[600px] h-[350px] flex-shrink-0 relative rounded-lg overflow-hidden group">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKfSBlvs37phAbV4wd3gmpzH6QP1r2JeptBtEmAgdDV1sIaeEOe4sMq-3OODkr7VnTbNfi3ec8A4dLnGiVnIgZ2u5XpM5bw8JlwggbNoq8DJPVgsJlVr1Po6BAEc3u8BR0aMDq4VzStg51k4YS5hl8yyEE9PhpGzrKm-HiyXQH0nS4T4SC3zFelYy7LsVSgPpVNvakKbTTKbM3MqL5WmEiaX5wdPd4K9D_-uC8cdp6i8kSzqAkIipfq3SHG75kR-la06SasGx0gZQ4" alt="Chef's Counter" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
 <span className="text-xl font-light">Chef's Counter</span>
 </div>
 </div>
 {/* Image 4 */}
 <div className="w-[400px] h-[350px] flex-shrink-0 relative rounded-lg overflow-hidden group">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQoL7GxRsffrXYRzt66BgivJ49-Vh0_OwuqTgbNVJ_OHH8x1mUG8I2JL8CKJZky_rOt2lrYjnKkjrgkHvCkG5kUMwbgD1SeN_2FVz2PlilaxiDhi3AhTMe0iQCrxHWO6BKRuyGepnIXIdwHtxBH8ZMJ8GjrIKnL2t0hIlxI47onJKIdG27ARxxd7wvhYZ8363NtBDtC351ZyuG9ZkNM_tI3KMrCaAVgivjhXosGa0yh_NyzxvQXgLgCKuLQmRXhgN1rn2RLf6KU9wA" alt="Signature Cocktails" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
 <span className="text-xl font-light">Signature Cocktails</span>
 </div>
 </div>
 {/* Image 5 */}
 <div className="w-[500px] h-[350px] flex-shrink-0 relative rounded-lg overflow-hidden group">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6gQKlaPaiFEUOtsZTvM0gFUsR4kHeXv2ndEZ2OYsBvdjFmKrpVMzsVxW0z-FATw0qFFMyOcABmxSAhx4VGiUv7zhRJdHgtiyhyKwlRUBVtKkYDP_gDAnS4NhVauqHSYmr78R9y4zrbp71ojpAW96sb0kGUCzv_YGTauRb_DX6dWq0OODrEiWAEw1zilP_JjdfXFAJwiAf18v5KPfrX-QAHFkopjhQAtVUchB55X6DoQrjuSEKiBwWyBGt36dc4UP1XWM7539akhl-" alt="Private Booths" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
 <span className="text-xl font-light">Private Booths</span>
 </div>
 </div>
 {/* Repeat for loop effect */}
 <div className="w-[500px] h-[350px] flex-shrink-0 relative rounded-lg overflow-hidden group">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxP4mdUrgk45XSi16h0WowaIBcNGUJv2BYQoewdl-_Azw8ocuzdmCbx7bwVwEBz-HEz0TuiNUjQUPxRsZ2o88ZIo8k0A3FhJ_IyLVMPIvxeN1TXVBw6vVprDGwOKrsXkV_BlF3tvK2lBwjp7yD--KAOYjNDKba7z18CfvX28hM3Mt3jox_3MSMDOeiojHnmD2b6sWk5oxqn8n0dWDMZV4ssXZ-P_ZXMFm7bDrYXSTT9Cm61SSkbcLtTzsfyYkb7rUyUqOiVMsB4iYD" alt="Dining Hall 2" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
 </div>
 </div>
 </div>
 <div className="text-center mt-8">
 <span className="text-xs text-muted-foreground uppercase tracking-widest font-sans">Swipe to explore</span>
 </div>
 </section>

 {/* Section 4: Farm to Table (Editorial Storytelling) */}
 <section id="farmers" className="py-32 px-6 max-w-6xl mx-auto bg-background ">
 <div className="text-center mb-24">
 <span className="text-primary text-lg uppercase tracking-widest font-medium block mb-3 font-sans">Origins</span>
 <h2 className="text-5xl md:text-6xl text-foreground font-light">Roots & Soil</h2>
 <p className="mt-6 text-xl text-foreground/80 max-w-2xl mx-auto font-light">
 We believe the best flavors are found close to home. Our partnership with local Jos farmers ensures every ingredient tells a story.
 </p>
 </div>
 
 {/* Story Block 1 */}
 <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center mb-32">
 <div className="w-full md:w-1/2 relative group">
 <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full z-0 group-hover:scale-150 transition-transform duration-700"></div>
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO4DlNbV4NORHg8w1Q1mtKsLsjWWZSP-_1OVxoVuoJ-2Y1jyfDO3S2vy8zix8IOs57tvjlROqhfrfehkvEVwxtev64-ZgcQARNsyxkhKPjrJarRFzJ1aflQ4iQ_7lo_JLRAAfl8776Hnu4l9-zZhgplBOZCuIWu3N5OO_hsNpumZqTmMTUwMgLxez8hVhLAT4OrVPMZjWgRQL3UUvF1YFZjNKs1xX1D4_RaQj9tG-BFQk2iOKk1KhkHDBm4WVITMsw_aV-_FXRVOhL" alt="Farmer Yakubu" className="relative z-10 w-full rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
 <div className="absolute -bottom-6 -right-6 bg-card p-4 shadow-lg rounded z-20">
 <span className="block text-primary text-sm font-bold uppercase tracking-wider font-sans">Location</span>
 <span className="text-foreground font-serif italic text-lg">Jos Plateau, Nigeria</span>
 </div>
 </div>
 <div className="w-full md:w-1/2">
 <h3 className="text-3xl md:text-4xl text-foreground mb-6 font-light">The Vegetable Whisperer</h3>
 <div className="prose prose-lg text-foreground/80 font-display">
 <p className="mb-4">
 <span className="text-5xl float-left mr-3 mt-[-10px] text-primary font-serif">M</span>eet Yakubu. Every morning at 4 AM, while the mist still clings to the Plateau hills, he is out inspecting his carrots. He doesn't just grow vegetables; he curates them.
 </p>
 <p>
 "The soil here is special," Yakubu tells us, dusting off a vibrant orange carrot. "It gives the vegetables a sweetness you can't find anywhere else." We've been sourcing exclusively from Yakubu's three-acre plot for over five years.
 </p>
 </div>
 </div>
 </div>

 {/* Story Block 2 (Reverse Layout) */}
 <div className="flex flex-col md:flex-row-reverse gap-12 lg:gap-24 items-center">
 <div className="w-full md:w-1/2 relative group">
 <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full z-0 group-hover:scale-150 transition-transform duration-700"></div>
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdCL9HNNzaoeOA81gAKfwIK6TSr0zbMVfwuQFSKHQEWeIA6suHDpE6wCwMnRy-4vuvUVzRgWekl9bxkIVYwvPr5D_yitMkM31T8J6xRy61fZR0I_rmxxNOYGuGFxhTmN8_jMdZGMhbCpTB5kVCwhmdYrF7Euizwy9RbcEJ5PNCa42tD7gzFmh5hxiRxSXKOH32KkfeHZ8x-lmfJCDci6I0qAdlHSQQTTo0UsByVad0ybRxpq4CZXwyTtIWUl4_dNaklSIgbuKKxPt3" alt="Ethical Meats" className="relative z-10 w-full rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
 <div className="absolute -top-6 -left-6 bg-card p-4 shadow-lg rounded z-20">
 <span className="block text-primary text-sm font-bold uppercase tracking-wider font-sans">Supplier</span>
 <span className="text-foreground font-serif italic text-lg">Barkin Ladi Farms</span>
 </div>
 </div>
 <div className="w-full md:w-1/2">
 <h3 className="text-3xl md:text-4xl text-foreground mb-6 font-light">Ethical Meats</h3>
 <div className="prose prose-lg text-foreground/80 font-display">
 <p className="mb-4">
 Quality isn't just about taste; it's about respect. Respect for the animal, and respect for the land. Our beef comes from free-range cattle that graze on natural pastures.
 </p>
 <p>
 The texture is unmistakable. Rich, marbling that renders down perfectly in our signature steaks. This isn't mass production; it's slow farming for slow food.
 </p>
 </div>
 </div>
 </div>
 </section>
 </div>
 );
};

export default AboutScreen;