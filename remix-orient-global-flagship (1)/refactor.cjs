const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

// Helper to replace a component block
function replaceComponent(name, replacement) {
  const regex = new RegExp(`const ${name}: React\\.FC<\\{ isActive\\?: boolean \\}> = \\(\\{ isActive = false \\}\\) => \\{[\\s\\S]*?^\\};`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    console.log(`Replaced ${name}`);
  } else {
    console.log(`Could not find ${name}`);
  }
}

const waterDeepDive = `const WaterDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <div className="flex flex-col justify-center px-6 bg-transparent border-t border-black/5 dark:border-white/5 relative items-center h-screen">
      <ScrollReveal isActive={isActive} className="lg:max-w-[67vw] mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center w-full max-h-[90vh] justify-center">
        <div className="lg:hidden order-1 text-center w-full">
          <RevealItem index={0} totalItems={5}>
            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-2 block">Technical Purity</span>
          </RevealItem>
          <RevealItem index={1} totalItems={5}>
            <h2 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter leading-tight">7-STEP <br/><span className="text-primary">Filtration</span></h2>
          </RevealItem>
        </div>
        <RevealItem index={4} totalItems={5} className="order-2 lg:order-2 w-full">
          <div className="relative aspect-video lg:aspect-square max-h-[30vh] lg:max-h-none rounded-2xl lg:rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-elite">
            <ParallaxImage src="https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=2036&auto=format&fit=crop" alt="Water Laboratory" className="w-full h-full" />
          </div>
        </RevealItem>
        <div className="order-3 lg:order-1 flex flex-col w-full">
          <div className="hidden lg:block">
            <RevealItem index={0} totalItems={5}>
              <span className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">Technical Purity</span>
            </RevealItem>
            <RevealItem index={1} totalItems={5}>
              <h2 className="text-4xl sm:text-5xl font-black dark:text-white text-slate-900 uppercase tracking-tighter mb-6 leading-tight">7-STEP <br/><span className="text-primary">Filtration</span></h2>
            </RevealItem>
          </div>
          <RevealItem index={2} totalItems={5}>
            <p className="text-sm lg:text-base dark:text-gray-400 text-slate-600 leading-relaxed mb-6 lg:mb-8 font-medium text-center lg:text-left">Beyond standard purification, Orient Water undergoes a rigorous 7-step process including Reverse Osmosis, UV Sterilization, and Ozone Treatment. We test every batch in our on-site laboratory to ensure absolute safety.</p>
          </RevealItem>
          <RevealItem index={3} totalItems={5}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {['Reverse Osmosis', 'UV Sterilization', 'Ozone Treatment', 'Mineral Balancing'].map(step => (
                <div key={step} className="flex items-center gap-4 p-3 lg:p-4 rounded-2xl lg:rounded-3xl dark:bg-white/5 bg-white border dark:border-white/10 border-black/5 shadow-soft">
                  <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                  <span className="dark:text-white text-slate-900 text-[10px] font-black uppercase tracking-widest">{step}</span>
                </div>
              ))}
            </div>
          </RevealItem>
        </div>
      </ScrollReveal>
    </div>
  );
};`;

const marketDeepDive = `const MarketDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <div className="flex flex-col justify-center px-6 bg-transparent border-t border-black/5 dark:border-white/5 relative items-center h-screen">
      <ScrollReveal isActive={isActive} className="lg:max-w-[67vw] mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center w-full max-h-[90vh] justify-center">
        <div className="lg:hidden order-1 text-center w-full">
          <RevealItem index={0} totalItems={5}>
            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-2 block">Supply Chain</span>
          </RevealItem>
          <RevealItem index={1} totalItems={5}>
            <h2 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter leading-tight">INSTITUTIONAL <br/><span className="text-primary">Quality</span></h2>
          </RevealItem>
        </div>
        <RevealItem index={4} totalItems={5} className="order-2 lg:order-2 w-full">
          <div className="relative aspect-video lg:aspect-square max-h-[30vh] lg:max-h-none rounded-2xl lg:rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-elite">
            <ParallaxImage src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974&auto=format&fit=crop" alt="Market Logistics" className="w-full h-full" />
          </div>
        </RevealItem>
        <div className="order-3 lg:order-1 flex flex-col w-full">
          <div className="hidden lg:block">
            <RevealItem index={0} totalItems={5}>
              <span className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">Supply Chain</span>
            </RevealItem>
            <RevealItem index={1} totalItems={5}>
              <h2 className="text-4xl sm:text-5xl font-black dark:text-white text-slate-900 uppercase tracking-tighter mb-6 leading-tight">INSTITUTIONAL <br/><span className="text-primary">Quality</span></h2>
            </RevealItem>
          </div>
          <RevealItem index={2} totalItems={5}>
            <p className="text-sm lg:text-base dark:text-gray-400 text-slate-600 leading-relaxed mb-6 lg:mb-8 font-medium text-center lg:text-left">Our global procurement network ensures that the finest products from around the world are available in Jos. From organic dairy to international spices, we maintain a strict cold chain and quality control protocol.</p>
          </RevealItem>
          <RevealItem index={3} totalItems={5}>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="p-4 lg:p-6 rounded-2xl lg:rounded-3xl dark:bg-white/5 bg-white border dark:border-white/10 border-black/5 shadow-soft text-center lg:text-left">
                <h4 className="dark:text-white text-slate-900 font-black uppercase text-[10px] lg:text-xs tracking-widest mb-1 lg:mb-2">Cold Chain</h4>
                <p className="dark:text-gray-500 text-slate-500 text-[10px] lg:text-xs font-medium">24/7 Temperature Monitoring</p>
              </div>
              <div className="p-4 lg:p-6 rounded-2xl lg:rounded-3xl dark:bg-white/5 bg-white border dark:border-white/10 border-black/5 shadow-soft text-center lg:text-left">
                <h4 className="dark:text-white text-slate-900 font-black uppercase text-[10px] lg:text-xs tracking-widest mb-1 lg:mb-2">Sourcing</h4>
                <p className="dark:text-gray-500 text-slate-500 text-[10px] lg:text-xs font-medium">Direct from Global Producers</p>
              </div>
            </div>
          </RevealItem>
        </div>
      </ScrollReveal>
    </div>
  );
};`;

const bakeryDeepDive = `const BakeryDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <div className="flex flex-col justify-center px-6 bg-transparent border-t border-black/5 dark:border-white/5 relative items-center h-screen">
      <ScrollReveal isActive={isActive} className="lg:max-w-[67vw] mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center w-full max-h-[90vh] justify-center">
        <div className="lg:hidden order-1 text-center w-full">
          <RevealItem index={1} totalItems={7}>
            <span className="text-primary font-black tracking-[0.5em] uppercase text-[10px] mb-2 block">Artisanal Process</span>
          </RevealItem>
          <RevealItem index={2} totalItems={7}>
            <h2 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter leading-tight">THE SCIENCE OF <br/><span className="text-primary">Fermentation</span></h2>
          </RevealItem>
        </div>
        <RevealItem className="order-2 lg:order-1 w-full" index={0} totalItems={7}>
          <div className="relative aspect-video lg:aspect-square max-h-[30vh] lg:max-h-none rounded-2xl lg:rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-elite">
            <ParallaxImage src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop" alt="Baking Process" className="w-full h-full" />
          </div>
        </RevealItem>
        <div className="order-3 lg:order-2 flex flex-col w-full">
          <div className="hidden lg:block">
            <RevealItem index={1} totalItems={7}>
              <span className="text-primary font-black tracking-[0.5em] uppercase text-[10px] mb-4 block">Artisanal Process</span>
            </RevealItem>
            <RevealItem index={2} totalItems={7}>
              <h2 className="text-4xl sm:text-5xl font-black dark:text-white text-slate-900 uppercase tracking-tighter mb-6 leading-tight">THE SCIENCE OF <br/><span className="text-primary">Fermentation</span></h2>
            </RevealItem>
          </div>
          <RevealItem index={3} totalItems={7}>
            <p className="text-sm lg:text-base dark:text-gray-400 text-slate-600 leading-relaxed mb-6 lg:mb-8 font-medium text-center lg:text-left">Our master bakers utilize a 48-hour cold fermentation process, allowing complex flavors to develop naturally. We source our grains from sustainable farms, ensuring every loaf meets the Orient Global standard of purity.</p>
          </RevealItem>
          <ul className="space-y-3 lg:space-y-4">
            {['Natural Sourdough Starters', 'Stone-Ground Flour', 'No Artificial Additives'].map((item, i) => (
              <RevealItem key={item} index={4 + i} totalItems={7}>
                <li className="flex items-center gap-3 lg:gap-4 dark:text-white text-slate-900 font-bold uppercase tracking-widest text-[10px] lg:text-xs justify-center lg:justify-start">
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(242,158,13,0.5)]" />
                  {item}
                </li>
              </RevealItem>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </div>
  );
};`;

const diningDeepDive = `const DiningDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <div className="flex flex-col justify-center px-6 bg-transparent border-t border-black/5 dark:border-white/5 relative items-center h-screen">
      <ScrollReveal isActive={isActive} className="lg:max-w-[67vw] mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center w-full max-h-[90vh] justify-center">
        <div className="lg:hidden order-1 text-center w-full">
          <RevealItem index={1} totalItems={7}>
            <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] mb-2 block">Chef's Philosophy</span>
          </RevealItem>
          <RevealItem index={2} totalItems={7}>
            <h2 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter leading-tight">FUSION OF <br/><span className="text-primary">Heritage</span></h2>
          </RevealItem>
        </div>
        <RevealItem className="order-2 lg:order-1 w-full" index={0} totalItems={7}>
          <div className="relative aspect-video lg:aspect-square max-h-[30vh] lg:max-h-none rounded-2xl lg:rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-elite">
            <ParallaxImage src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" alt="Chef at Work" className="w-full h-full" />
          </div>
        </RevealItem>
        <div className="order-3 lg:order-2 flex flex-col w-full">
          <div className="hidden lg:block">
            <RevealItem index={1} totalItems={7}>
              <span className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">Chef's Philosophy</span>
            </RevealItem>
            <RevealItem index={2} totalItems={7}>
              <h2 className="text-4xl sm:text-5xl font-black dark:text-white text-slate-900 uppercase tracking-tighter mb-6 leading-tight">FUSION OF <br/><span className="text-primary">Heritage</span></h2>
            </RevealItem>
          </div>
          <RevealItem index={3} totalItems={7}>
            <p className="text-sm lg:text-base dark:text-gray-400 text-slate-600 leading-relaxed mb-6 lg:mb-8 font-medium text-center lg:text-left">Our culinary team explores the intersection of traditional Plateau ingredients and modern gastronomic techniques. We believe in "Root-to-Table" dining, where every ingredient tells a story of the land.</p>
          </RevealItem>
          <div className="space-y-2">
            {['Locally Sourced Produce', 'Artisanal Plating', 'Curated Wine Pairings'].map((item, i) => (
              <RevealItem key={item} index={4 + i} totalItems={7}>
                <div className="flex items-center gap-4 lg:gap-6 p-2 lg:p-3 rounded-xl lg:rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-black/5 shadow-soft justify-center lg:justify-start">
                  <span className="material-icons text-primary text-xl lg:text-2xl">restaurant_menu</span>
                  <span className="dark:text-white text-slate-900 font-bold uppercase tracking-widest text-[10px] lg:text-xs">{item}</span>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};`;

const loungeDeepDive = `const LoungeDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <div className="flex flex-col justify-center px-6 bg-transparent border-t border-black/5 dark:border-white/5 relative items-center h-screen">
      <ScrollReveal isActive={isActive} className="lg:max-w-[67vw] mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center w-full max-h-[90vh] justify-center">
        <div className="lg:hidden order-1 text-center w-full">
          <RevealItem index={0} totalItems={7}>
            <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] mb-2 block">Atmosphere</span>
          </RevealItem>
          <RevealItem index={1} totalItems={7}>
            <h2 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter leading-tight">SONIC <br/><span className="text-primary">Architecture</span></h2>
          </RevealItem>
        </div>
        <RevealItem index={6} totalItems={7} className="order-2 lg:order-2 w-full">
          <div className="relative aspect-video lg:aspect-square max-h-[30vh] lg:max-h-none rounded-2xl lg:rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-elite">
            <ParallaxImage src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop" alt="Lounge Atmosphere" className="w-full h-full" />
          </div>
        </RevealItem>
        <div className="order-3 lg:order-1 flex flex-col w-full">
          <div className="hidden lg:block">
            <RevealItem index={0} totalItems={7}>
              <span className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-4 block">Atmosphere</span>
            </RevealItem>
            <RevealItem index={1} totalItems={7}>
              <h2 className="text-4xl sm:text-5xl font-black dark:text-white text-slate-900 uppercase tracking-tighter mb-6 leading-tight">SONIC <br/><span className="text-primary">Architecture</span></h2>
            </RevealItem>
          </div>
          <RevealItem index={2} totalItems={7}>
            <p className="text-sm lg:text-base dark:text-gray-400 text-slate-600 leading-relaxed mb-6 lg:mb-8 font-medium text-center lg:text-left">The lounge is acoustically treated to provide perfect sound isolation. Our resident DJs curate soundscapes that evolve through the night, paired with our signature mixology program.</p>
          </RevealItem>
          <div className="space-y-2">
            {['Void Acoustics Sound System', 'Custom Lighting Rig', 'VIP Concierge'].map((item, i) => (
              <RevealItem key={item} index={3 + i} totalItems={7}>
                <div className="flex items-center justify-between p-2 lg:p-3 rounded-xl lg:rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-black/5 shadow-soft">
                  <span className="dark:text-white text-slate-900 font-bold uppercase tracking-widest text-[10px] lg:text-xs">{item}</span>
                  <span className="material-icons text-primary text-lg lg:text-xl">graphic_eq</span>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};`;

const gamesDeepDive = `const GamesDeepDive: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <div className="flex flex-col justify-center px-6 bg-transparent border-t border-black/5 dark:border-white/5 relative items-center h-screen">
      <ScrollReveal isActive={isActive} className="lg:max-w-[67vw] mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center w-full max-h-[90vh] justify-center">
        <div className="order-1 lg:order-1 flex flex-col w-full text-center lg:text-left">
          <RevealItem index={0} totalItems={7}>
            <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] lg:text-sm mb-2 lg:mb-4 block">Tech Ecosystem</span>
          </RevealItem>
          <RevealItem index={1} totalItems={7}>
            <h2 className="text-3xl lg:text-4xl sm:text-5xl font-black dark:text-white text-slate-900 uppercase tracking-tighter mb-4 lg:mb-6 leading-tight">ZERO LAG <br/><span className="text-primary">Infrastructure</span></h2>
          </RevealItem>
          <RevealItem index={2} totalItems={7}>
            <p className="text-sm lg:text-base dark:text-gray-400 text-slate-600 leading-relaxed mb-6 lg:mb-8 font-medium">We've built a dedicated fiber-optic network to ensure sub-10ms latency for competitive play. Our hardware is refreshed quarterly, featuring the latest RTX GPUs and high-fidelity VR peripherals.</p>
          </RevealItem>
          <div className="space-y-2">
            {['Fiber-Optic Backbone', 'RTX 40-Series GPUs', '240Hz Displays'].map((spec, i) => (
              <RevealItem key={spec} index={3 + i} totalItems={7}>
                <div className="flex items-center justify-between p-2 lg:p-3 rounded-xl lg:rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-black/5 shadow-soft">
                  <span className="dark:text-white text-slate-900 font-bold uppercase tracking-widest text-[10px] lg:text-xs">{spec}</span>
                  <span className="material-icons text-primary text-lg lg:text-xl">bolt</span>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
        <RevealItem index={6} totalItems={7} className="order-2 lg:order-2 w-full h-[30vh] lg:h-full lg:min-h-[400px]">
          <div className="relative h-full w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-elite">
            <VerticalFerrisCarousel />
          </div>
        </RevealItem>
      </ScrollReveal>
    </div>
  );
};`;

replaceComponent('WaterDeepDive', waterDeepDive);
replaceComponent('MarketDeepDive', marketDeepDive);
replaceComponent('BakeryDeepDive', bakeryDeepDive);
replaceComponent('DiningDeepDive', diningDeepDive);
replaceComponent('LoungeDeepDive', loungeDeepDive);
replaceComponent('GamesDeepDive', gamesDeepDive);

fs.writeFileSync('App.tsx', content);
