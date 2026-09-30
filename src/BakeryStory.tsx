import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cmsApi } from './services/cmsApi';

export const Story: React.FC = () => {
 const [cmsData, setCmsData] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchData = async () => {
 try {
 const data = await cmsApi.getDivisionContent('bakery');
 setCmsData(data);
 } catch (error) {
 console.error("Failed to fetch CMS data", error);
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, []);

 if (loading) {
 return (
 <div className="min-h-screen bg-background flex items-center justify-center font-sans text-muted-foreground">
 <div className="animate-pulse tracking-[0.2em] uppercase text-sm">Loading Bakery Story...</div>
 </div>
 );
 }

 const heroBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'hero')?.content_payload || {
 title: "Jos’s Morning Ritual",
 subtitle: "Hot, fresh, and ready by 7:00 AM."
 };

 const rollsBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'rolls')?.content_payload || {
 items: [
 { title: "Sticky Cinnamon Roll", price: "$12.00", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd_TmNBtFRIqwh5bh7iSlOdqRDJSGJVKP1T-3YCFoq-WnNanHo6WbBuRXRvvs8tGQSZK1dZn6I3a6iJHL4byM9r5DC26JFjA7U9s_o2o2ia367BS2gVpc2LHYMwm5e_UPo_r_GPIZKyQHnoR8vXlbdPWdS5z5SZxXQd68-5uWq1QMGTj01wNIGMZG1jB4PPdc9XAUU0ZRvEHw44Sdxiw4c5TdmJpuXivg3eodT1I-xcIyM6u9Br9l8Z00zpX_O4pUx_7yGlsf2Knwr" },
 { title: "Cinnamon Rolls (Fresh)", price: "$12.00", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYvf77WkTzo48ZPbJwUbQetCY5GnPm0VNmBHX0NT52ceOmSMsQZHiYsq9NcCufvHkW87mOr6Z7DTgftYf8q1h6AHQM8XNZeZnPrLJoJNhWZvwsRgqxS8vOeeR2JCDpJoMJqdY6l7G-xynMPgrNZX3i-mBcBfzq3YlV640wg5x5BjcnS_G_UbOryxsD1iSmAv08WogejIlucFklzxkv2CI0kfa_ilSMPwqWo6-tr1Z6Wd7aoOqW5gpClZIalrlkkyU4U9a7i9ViNPEd" },
 { title: "Sticky Cinnamon Roll", price: "$15.00", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzuTGeynABEZq_RNMW_0DWnpySiwUdY708i6ZVWjZ7aIl0DpPLMJq1VQVEwuiE3nMamKg_bwuczTqbcV6ecYVDUXjY9SZK519_nntwfz9HAhku_iqDi_Ef3RUdWrVu9jrh-MWAyUVc-FKp3_XCiyFx_P2OM-jDXRGULnYJqVqUqqx6jyHp_XoHc7SCS-NUZMRZsCvKWvMaSW8Dsah1KUa05a9i3V7cPWokidQYzWZ7hkP9T04I1yuxLjt0g6HhgWkppOALuJnR6wrU" },
 { title: "Cinnamon Rolls", price: "$18.50", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCye9YH_o_PRcnhP-s4c_Ay_E9zoNz1oReHKAlsEWfNNc7YuV1Ha_6yYsqEUNMItX38C0VGq1fAUZNac96Mv6pe6yEH50CBl63aS0HNTNeWMPszVliMAlJsLceV2USAOc-QqVgcYwFhNWDkWc-U21cu4YBhsJY4vLKePO8OOJu4Ob-3FXxKeGeeC0ntOXjwSXivoh7nmf_8bN0KAJXnAI1QrUdSzNf-eKfwDlmUyKwpzDVdMYGPCLtqb1ExbXZnDi5J0HvGIlco5PcP" }
 ]
 };

 return (
 <div className="bg-background overflow-x-hidden pt-0">
 {/* 1. Hero Header - Jos's Morning Ritual */}
 <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-foreground text-background">
 <div className="absolute inset-0 z-0">
 <img
 alt="Baker dusting flour on dough"
 className="w-full h-full object-cover opacity-60 grayscale-[30%]"
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6SG_V94G3jAOPP14HMgaAc2y6fE1y54l-T9C_E8xI1lee7tUiF_qJrO8kXpExWPXmuyi8aqoigi93IDoakFe7g9F7qjyPpIDuf5zvLq-T9HQck89ar2rvOtJOWbapiebrimVajx_o7xAq0UfknDkv0sjaGWYqUmPn7GOzTdfsSZqTNiJPRV2YdCQ87VO5yahIhmngNShbsfl5AgO4_w5JoN1TT8lQmCaRisnMIBX9YW4YySXwnKh-Uwv2ioOH1i39jT1EUr1eVcIX"
 />
 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900"></div>
 </div>
 <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
 <motion.h1
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 1 }}
 className="font-sans text-5xl md:text-7xl lg:text-8xl text-background font-bold mb-4 tracking-tighter"
 >
 {heroBlock.title}
 </motion.h1>
 <motion.p
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 transition={{ delay: 0.5, duration: 1 }}
 className="text-background/80 text-lg md:text-xl font-light tracking-[0.2em] uppercase"
 >
 {heroBlock.subtitle}
 </motion.p>
 </div>
 </section>

 {/* 2. The Artisanal Process - Staggered Organic Sections */}
 <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
 <div className="text-center mb-16">
 <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">The Artisanal Process</h2>
 <div className="w-16 h-1 bg-primary mx-auto"></div>
 </div>
 <div className="space-y-24 md:space-y-32">
 {/* Step 1 */}
 <ProcessStep
 index={1}
 title="45-Hour Fermentation"
 desc="Slow fermentation ensures a rich, complex flavor and a texture that is light yet substantial. Every batch is nurtured over two days to ensure maximum health benefits and depth."
 image="https://lh3.googleusercontent.com/aida-public/AB6AXuD9AdQcTD0npuPqeB1MkUOpzNcQ_bmlr55FObJd7BiXSrLsv21dC8nYt7TMtdWa9rUF2xR7Dv7ZjA8VTXqcWt961UQEfZIsle-QgyvY-W_l2FdtGhXgDxcPC7BVvYBlihw6uwo8qGfPj1HFG0LUTU-6-xUllZRQ_sNuGDnDR1ndaGj4QlDrwzLDNnx8NFDEk9xAUKMJzSBMJ4EdWxutNIiONZeeTQDLxyIdSsUImu6287f0OhweUM6HW_lF5K8CBEnwGxwdvygXaPFT"
 reverse
 />
 {/* Step 2 */}
 <ProcessStep
 index={2}
 title="48-Hour Fermentation"
 desc="Our signature sourdough culture is exactly what makes our bread unique. Patience is our primary ingredient, allowing the wild yeast to transform simple flour into something extraordinary."
 image="https://lh3.googleusercontent.com/aida-public/AB6AXuA8jmr4oztTQ8QwKXjjb4cQPlKaOB4R-eWMBq8_Csa1ENWeji-HcmhbUesMcE8hbj-0Ax3JZhTLc0GyCOeRcwrbYzTViEqywn3R_2-SthdRopZVMVTNZ1WqnQBr8-LK7OnNKYx4rWuj8_szD_q6-mKdt56d1BeZHSURh5EXpjkKwfe7LNALEI6xpoF0MENRWl-MIwX0My0xHjChEy7JhmtHGr-AYk4l1f6dCEOxq-0Ep04yKLYygUtXUhb5RozBayayNVk-Lug0tPjj"
 />
 {/* Step 3 */}
 <ProcessStep
 index={3}
 title="Skillfully Scored"
 desc="The scoring isn't just aesthetic; it allows the bread to expand perfectly in the oven. Each loaf is hand-scored with precision to create the iconic crust and ear we are known for."
 image="https://lh3.googleusercontent.com/aida-public/AB6AXuAnDkmQLViId92Xb5EIwK923g9s4vEyP7kRlaoy-PSt-Q5O0XHMLFkbPtmcHArRNuxNfF0tn5WpSr4cadPNsC7b9MCBCn1LdhvH_CGIUR-ktHXG4FsOH1apFckqn7x4tnXxB0QVPJDycxVhTK2kWSOBdfFrldA95svT7P3iGydLOAxlyeiM07nPh86t_cM1naYI95F7GOQFfRaCn9oTK5SHmBnOS5QQKAPj7G81IFRGKK6nMwwdbaX0m0WZrSvRW8-rJDYLC9zGGoUC"
 reverse
 />
 {/* Step 4 */}
 <ProcessStep
 index={4}
 title="The Final Bake"
 desc="Controlled heat and steam are the final elements. Our ovens are timed precisely to capture the peak of the oven-spring, resulting in a thin, crisp, caramelized crust."
 image="https://lh3.googleusercontent.com/aida-public/AB6AXuCd_TmNBtFRIqwh5bh7iSlOdqRDJSGJVKP1T-3YCFoq-WnNanHo6WbBuRXRvvs8tGQSZK1dZn6I3a6iJHL4byM9r5DC26JFjA7U9s_o2o2ia367BS2gVpc2LHYMwm5e_UPo_r_GPIZKyQHnoR8vXlbdPWdS5z5SZxXQd68-5uWq1QMGTj01wNIGMZG1jB4PPdc9XAUU0ZRvEHw44Sdxiw4c5TdmJpuXivg3eodT1I-xcIyM6u9Br9l8Z00zpX_O4pUx_7yGlsf2Knwr"
 />
 </div>
 </section>

 {/* 3. Interactive Items Grid */}
 <section className="py-16 bg-background">
 <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
 <div className="space-y-6">
 <h2 className="font-sans text-4xl font-bold text-foreground leading-tight tracking-tight">Interactive Items</h2>
 <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
 Great products start with great ingredients. Every component of our pastries is selected for its origin and quality, from Madagascar vanilla beans to local farm-fresh eggs.
 </p>
 <div className="grid grid-cols-2 gap-4">
 <div className="aspect-square bg-card rounded-2xl p-6 shadow-sm flex flex-col justify-end group hover:bg-primary transition-all duration-500 cursor-pointer border border-border ">
 <span className="material-icons text-primary group-hover:text-background mb-4 text-3xl">local_florist</span>
 <p className="font-bold group-hover:text-background text-sm">Organic Flour</p>
 </div>
 <div className="aspect-square bg-card rounded-2xl p-6 shadow-sm flex flex-col justify-end group hover:bg-primary transition-all duration-500 cursor-pointer border border-border ">
 <span className="material-icons text-primary group-hover:text-background mb-4 text-3xl">water_drop</span>
 <p className="font-bold group-hover:text-background text-sm">Filtered Water</p>
 </div>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <img
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO0ZKFr0Vq3u2qIGbwTklVk1NRf5LudR3o-9VQzWsVuBWiMBm3gxTiHb7qBh3fYEk0cekwvM0yU9p15-SjoL5kWnxf9mWHV_5_ZsKyOsTlIJOJb_pOnEf4EfjaMOCSP9Tc4-jCtBART-M6O0BPS3TdgOAMoa9e2TH5TVRHZXhD8zWBsvjqg0_T7ylozMovy05X9SAfSvH6TlwHSA4bdT0PmjMrzw3T37Zh7kynz6ox1Xp0FwJrkOXYmvuQBHfAO9m9x-S4TWUZZ3th"
 className="rounded-2xl w-full h-80 object-cover"
 alt="Pastry item"
 />
 <img
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ePjwRPlUyPcBB-gEiNv8MkH16tu35a6aB6_9Zj6vvtAjNzfpPl3j9BZxEiFIodTQCe9Zyw5LOmhozbuIXP9okz3ngRIWl4rKMS0SKUkOmK6mttKGX1C0orlgu70xhnIsPKsKFQHKXqBCEG3fDWZZyFyXYR9JfQecs2L1EYLc-A8kNIM_-KsioMgNvsvR0T2bdRbRNnU00mKgnsB7VshRYE5j0sjBCg60QWs45waEvck39YPu_VtdDweJzzP-3pE_auMe0BbiyI3c"
 className="rounded-2xl w-full h-80 object-cover mt-12"
 alt="Bread item"
 />
 </div>
 </div>
 </section>

 {/* 4. Interactive Daily Selection - The Cinnamon Rolls Grid */}
 <section className="py-16 max-w-7xl mx-auto px-4">
 <div className="text-center mb-12">
 <h2 className="font-sans text-4xl font-bold mb-6 tracking-tight">Interactive Daily Selection</h2>
 <div className="flex justify-center gap-3">
 {['All', 'Bread', 'Pastries', 'Savory'].map((cat, i) => (
 <button
 key={cat}
 className={`px-5 py-1.5 rounded-full text-xs font-bold ${i === 0 ? 'bg-primary text-background' : 'bg-background text-foreground/80 '}`}
 >
 {cat}
 </button>
 ))}
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {rollsBlock.items.map((item: any, idx: number) => (
 <RollCard
 key={idx}
 title={item.title}
 price={item.price}
 image={item.image}
 />
 ))}
 </div>
 </section>

 {/* 5. Signature 3D Showcase */}
 <section className="py-16 bg-background overflow-hidden">
 <div className="max-w-7xl mx-auto px-4 text-center">
 <h2 className="font-sans text-4xl md:text-5xl font-bold mb-12 tracking-tight">Signature 3D Showcase</h2>
 <div className="relative inline-block group">
 <motion.div
 animate={{ y: [0, -20, 0] }}
 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
 className="relative z-10"
 >
 <img
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO0ZKFr0Vq3u2qIGbwTklVk1NRf5LudR3o-9VQzWsVuBWiMBm3gxTiHb7qBh3fYEk0cekwvM0yU9p15-SjoL5kWnxf9mWHV_5_ZsKyOsTlIJOJb_pOnEf4EfjaMOCSP9Tc4-jCtBART-M6O0BPS3TdgOAMoa9e2TH5TVRHZXhD8zWBsvjqg0_T7ylozMovy05X9SAfSvH6TlwHSA4bdT0PmjMrzw3T37Zh7kynz6ox1Xp0FwJrkOXYmvuQBHfAO9m9x-S4TWUZZ3th"
 className="w-full max-w-md mx-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)]"
 alt="Signature cake"
 />
 </motion.div>
 {/* Floaties */}
 <div className="absolute inset-0 pointer-events-none">
 <span className="material-icons text-primary absolute top-0 left-0 animate-bounce">local_florist</span>
 <span className="material-icons text-primary absolute top-10 right-0 animate-pulse">grain</span>
 <span className="material-icons text-primary absolute bottom-0 left-10 animate-pulse">spa</span>
 </div>
 </div>
 <div className="mt-12 flex justify-center items-center gap-8">
 <div className="flex gap-4">
 <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-background transition-all"><span className="material-icons">chevron_left</span></button>
 <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-background transition-all"><span className="material-icons">chevron_right</span></button>
 </div>
 <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-orange-600 transform hover:scale-105 active:scale-95 transition-all">
 Customize & Order $85.00
 </button>
 </div>
 </div>
 </section>

 {/* 6. Catering & Bulk */}
 <section className="py-16 bg-foreground text-background text-background relative">
 <div className="max-w-7xl mx-auto px-4">
 <h2 className="font-sans text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">Catering & Bulk</h2>
 <div className="grid md:grid-cols-3 gap-6">
 <CateringCard
 title="Corporate"
 desc="Corporate event photography and catering tailored to your brand."
 image="https://lh3.googleusercontent.com/aida-public/AB6AXuBF_lco6zprEdQlI2LmcDLCSaXVyBB8sfTNRNQBZtPsBrXL6WpfVvb_Rhvg8zDIa-fYvgnDxVUQX-66V4dPxxANmhZdEaMyMlV1R2DZ5AvRfCgjRipVcBIS0HCdHjN5qrXr4CObMPzHS9HXJQHExewlvcHHpf8PDRLfpxYmjw0LFXE-88dpfDQfpkEWHnfqTD6V9dipw-i5Jl4N7SbYSfjM_StPM4T9Y6ww6OIWhf4iWRpr7Utv6DsIBvyjVA64s7c4Ye0yc2R8DPrQ"
 cta="Download Menu"
 />
 <CateringCard
 title="Events"
 desc="Delectable event photography for your most precious moments."
 image="https://lh3.googleusercontent.com/aida-public/AB6AXuDjgjqXBUvUI7yxu18cPbEjS1s8IUe5XW_xHaLIr4rMKNABX4YLBU9wyfc9jzXS_72wgh3LEygdAFzWawbgEYl9l56K5jKVevcNj53uFFdozb_fX16MgMXoIUZwbAjcZ3acr816xSDxII3_ETinK7g6fECd9YjnMfzQOZ4a8ETC6ChJfm8vduGzxVmlbogc-Ye-GLnhimriXR1UlqtxeG2ghiYRw2UzyO00cHNlhx7xCNIn_hZyFk9W98hl0w4wRUCjriyWFFU4ZMIa"
 cta="Inquire Now"
 active
 />
 <CateringCard
 title="Wholesale"
 desc="Occasional event photography and bulk orders for your business."
 image="https://lh3.googleusercontent.com/aida-public/AB6AXuAnDkmQLViId92Xb5EIwK923g9s4vEyP7kRlaoy-PSt-Q5O0XHMLFkbPtmcHArRNuxNfF0tn5WpSr4cadPNsC7b9MCBCn1LdhvH_CGIUR-ktHXG4FsOH1apFckqn7x4tnXxB0QVPJDycxVhTK2kWSOBdfFrldA95svT7P3iGydLOAxlyeiM07nPh86t_cM1naYI95F7GOQFfRaCn9oTK5SHmBnOS5QQKAPj7G81IFRGKK6nMwwdbaX0m0WZrSvRW8-rJDYLC9zGGoUC"
 cta="Learn More"
 />
 </div>
 </div>
 </section>

 {/* 7. The Baker's Story (Editorial) */}
 <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
 <h2 className="font-sans text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight">The Baker’s Story</h2>
 <div className="grid lg:grid-cols-2 gap-12 items-start">
 <div className="space-y-8">
 <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
 <img
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6SG_V94G3jAOPP14HMgaAc2y6fE1y54l-T9C_E8xI1lee7tUiF_qJrO8kXpExWPXmuyi8aqoigi93IDoakFe7g9F7qjyPpIDuf5zvLq-T9HQck89ar2rvOtJOWbapiebrimVajx_o7xAq0UfknDkv0sjaGWYqUmPn7GOzTdfsSZqTNiJPRV2YdCQ87VO5yahIhmngNShbsfl5AgO4_w5JoN1TT8lQmCaRisnMIBX9YW4YySXwnKh-Uwv2ioOH1i39jT1EUr1eVcIX"
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
 alt="Baker in kitchen"
 />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-16 h-16 bg-primary/90 text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
 <span className="material-icons text-3xl">play_arrow</span>
 </div>
 </div>
 </div>
 <div className="p-6 border-l-4 border-primary bg-background rounded-r-3xl">
 <h3 className="font-sans text-2xl font-bold mb-3 ">The Baker's Editorial</h3>
 <p className="text-muted-foreground italic text-sm">
 "Baking is a conversation between the grains and the baker. Every loaf we make tells the story of the farmer who grew the wheat, the water that fed it, and the fire that transformed it."
 </p>
 </div>
 </div>
 <div className="prose prose-slate dark:prose-invert">
 <p className="text-lg text-foreground/80 leading-relaxed font-sans">
 When I first started this journey in the heart of Jos, I had nothing but a handful of family recipes and a persistent dream of bringing artisan quality to every breakfast table. Today, Orient Bakery is more than just a place to buy bread; it's a testament to the community that supported us.
 </p>
 <p className="text-muted-foreground leading-relaxed text-sm">
 We sourcing 90% of our ingredients locally because we believe the soil of Northern Nigeria produces grains that are unparalleled in flavor and nutrition. Our 48-hour fermentation isn't a marketing tactic; it's a commitment to your health and the integrity of the process.
 </p>
 <div className="flex gap-4 mt-8">
 <img className="w-16 h-16 rounded-2xl object-cover" src="https://picsum.photos/200" alt="Baker portrait" />
 <div>
 <p className="font-bold text-xl ">Jos O.</p>
 <p className="text-primary font-bold uppercase tracking-widest text-xs">Founder & CEO</p>
 </div>
 </div>
 </div>
 </div>
 </section>
 </div>
 );
};

const ProcessStep: React.FC<{ index: number; title: string; desc: string; image: string; reverse?: boolean }> = ({ index, title, desc, image, reverse }) => (
 <div className={`flex flex-col md:flex-row items-center gap-8 ${reverse ? 'md:flex-row-reverse' : ''}`}>
 <motion.div
 initial={{ opacity: 0, x: reverse ? 50 : -50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="w-full md:w-1/2 relative group"
 >
 <div
 className="w-full h-[250px] md:h-[400px] overflow-hidden shadow-2xl transition-all duration-700 group-hover:scale-[1.02]"
 style={{
 borderRadius: reverse ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '70% 30% 30% 70% / 60% 40% 60% 40%',
 clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' // Simplification for safety, using border-radius for blob look
 }}
 >
 <img src={image} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt={title} />
 </div>
 <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 text-background/10 font-sans text-8xl pointer-events-none font-bold">0{index}</div>
 </motion.div>
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="w-full md:w-1/2 space-y-4"
 >
 <span className="text-primary font-bold uppercase tracking-widest text-xs block">Artisan Notes</span>
 <h3 className="font-sans text-3xl md:text-4xl font-bold text-foreground tracking-tight">{title}</h3>
 <p className="text-base text-muted-foreground leading-relaxed font-light">{desc}</p>
 <button className="text-primary font-bold text-sm flex items-center gap-2 hover:translate-x-2 transition-transform">
 Read the science <span className="material-icons text-sm">arrow_forward</span>
 </button>
 </motion.div>
 </div>
);

const RollCard: React.FC<{ title: string; price: string; image: string }> = ({ title, price, image }) => (
 <motion.div
 whileHover={{ y: -8 }}
 className="bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border "
 >
 <div className="relative h-56 overflow-hidden">
 <img src={image} className="w-full h-full object-cover" alt={title} />
 <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">New</div>
 </div>
 <div className="p-5">
 <h4 className="font-sans font-bold text-lg mb-1 ">{title}</h4>
 <p className="text-primary font-bold text-sm">{price}</p>
 </div>
 </motion.div>
);

const CateringCard: React.FC<{ title: string; desc: string; image: string; cta: string; active?: boolean }> = ({ title, desc, image, cta, active }) => (
 <div className={`p-6 rounded-[32px] transition-all duration-500 ${active ? 'bg-primary scale-105 shadow-[0_20px_40px_rgba(236,109,19,0.3)]' : 'bg-foreground text-background hover:bg-foreground text-background'}`}>
 <div className="aspect-video rounded-2xl overflow-hidden mb-6 shadow-inner">
 <img src={image} className="w-full h-full object-cover opacity-80" alt={title} />
 </div>
 <div className="flex items-center gap-3 mb-3">
 <span className="material-icons text-2xl">{title === 'Corporate' ? 'business' : title === 'Events' ? 'celebration' : 'local_shipping'}</span>
 <h3 className="text-xl font-sans font-bold">{title}</h3>
 </div>
 <p className={`text-xs mb-6 leading-relaxed ${active ? 'text-background' : 'text-muted-foreground'}`}>{desc}</p>
 <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${active ? 'bg-card text-primary' : 'bg-foreground text-background text-background hover:bg-black'}`}>
 {cta}
 </button>
 </div>
);
