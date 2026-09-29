import React from 'react';
import { motion } from 'framer-motion';
import { TextReveal } from '../../App';

const About: React.FC<{ setCurrentView: (v: any) => void }> = ({ setCurrentView }) => {
 return (
 <section className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 bg-background transition-colors duration-500">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-16 sm:mb-24">
 <span className="text-primary font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-4 block">Our Story</span>
 <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-foreground mb-6 sm:mb-8 font-heading uppercase leading-none tracking-tighter">
 <TextReveal text="BEYOND" /><br />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-gray-500">
 <TextReveal text="EXPECTATIONS" delay={0.2} />
 </span>
 </h1>
 <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-foreground/80 font-medium leading-relaxed px-4">
 Orient Global Services is a convergence of world-class lifestyle divisions, redefined for the modern Nigerian landscape. Born in Jos, built for the world.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center mb-20 sm:mb-32">
 <motion.div 
 initial={{ opacity: 0, x: -50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl border border-transparent group"
 >
 <img 
 src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
 alt="Corporate Vision" 
 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
 <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10">
 <h3 className="text-2xl sm:text-3xl font-black text-background uppercase tracking-tight mb-2">The Vision</h3>
 <p className="text-sm sm:text-base text-background/80 font-medium">To establish Plateau State as a premier destination for luxury, culinary excellence, and technological innovation.</p>
 </div>
 </motion.div>
 
 <div className="space-y-8 sm:space-y-12">
 {[
 { title: "Excellence", desc: "We don't just meet standards; we set them. From our NAFDAC-certified water to our chef-curated menus." },
 { title: "Innovation", desc: "Pioneering the first VR gaming arena and smart-cart supermarket experience in the region." },
 { title: "Community", desc: "Rooted in Rayfield, we are committed to local sourcing, employment, and sustainable growth." }
 ].map((item, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.2, duration: 0.6 }}
 className="flex gap-4 sm:gap-6"
 >
 <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
 <span className="material-icons text-lg sm:text-xl">verified</span>
 </div>
 <div>
 <h4 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight mb-2">{item.title}</h4>
 <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">{item.desc}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>

 <div className="bg-foreground text-background rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden border border-transparent">
 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="relative z-10">
 <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-background uppercase tracking-tighter mb-6 sm:mb-8">Ready to Experience It?</h2>
 <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto">Visit us at Amanda Plaza, Rayfield, Jos. Open daily from 8 AM to 10 PM.</p>
 <button onClick={() => { setCurrentView('home'); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full sm:w-auto px-10 py-4 bg-primary text-foreground font-black uppercase tracking-[0.2em] rounded-full hover:bg-card transition-all shadow-[0_0_30px_rgba(242,158,13,0.4)]">
 Back to Home
 </button>
 </div>
 </div>
 </div>
 </section>
 );
};

export default About;
