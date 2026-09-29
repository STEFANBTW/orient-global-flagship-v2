import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cmsApi } from '@/services/cmsApi';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';
import { Product } from '../types';

interface ProduceProps {
 onNavigate: (page: any) => void;
}

const Produce: React.FC<ProduceProps> = ({ onNavigate }) => {
 const [searchTerm, setSearchTerm] = useState('');
 const [cmsData, setCmsData] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [isFirstVisit, setIsFirstVisit] = useState(true);
 const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 const { addToCart } = useCart();

 useEffect(() => {
 const hasVisited = sessionStorage.getItem('hasVisitedProduce');
 if (hasVisited) {
 setIsFirstVisit(false);
 } else {
 sessionStorage.setItem('hasVisitedProduce', 'true');
 }

 const fetchData = async () => {
 try {
 const data = await cmsApi.getDivisionContent('market');
 setCmsData(data);
 } catch (error) {
 console.error("Failed to fetch CMS data", error);
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, []);

 const heroBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'produce_hero')?.content_payload || {
 title: "Freshness\nGuaranteed",
 subtitle: "Farm Direct",
 stats: []
 };

 const bestSellersBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'produce_bestsellers')?.content_payload || { items: [] };
 const specialsBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'produce_specials')?.content_payload || { items: [] };

 const quickReorderBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'quick_reorder')?.content_payload || { items: [] };
 const quickReorderItems = quickReorderBlock.items;

 const bestSellers = bestSellersBlock.items.length > 0 ? bestSellersBlock.items : [
 { name: "Organic Strawberries", price: "4.99", unit: "", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM8pKrsve-Hsj7bZJX1-9KlNRvoCWYl5G6DUmCpAQ9ePX3MZYAukyMkkQi9J0Np11wBcyHAedNaXlJ-csKMnP19WqZ21uNCFRLONd0iE8bn69EmHwUpWN7-xL3oj_ob-LsHtqc6km408cTMkvKqR2MuFlSDGyXY7j7I6YUgRTzsVuffaztzdRmCOTusY4AFpDCl5H1w0d9WR06Mb7t7B7X9TOGxGqDjaAhUI0fUjEJ3RrPUOVHwqshuARGhgZcO1uyuNpfEjzHW0H3", tag: "POPULAR", tagColor: "bg-yellow-100 text-yellow-800" },
 { name: "Fresh Broccoli Crown", price: "1.89", unit: "/lb", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9t68yp7eD8EbfgYgN8yPh9E8fINlAf8HuLVVnTGvCD3qUc3e23T2JGun-nJP6bXRoxLvgVjcWe2ClNCdUfBufe8QcXHwnZ0OciLkZ2N8bdRmt7B9LTt6rLvk-_tylwPFTYz_ay5m83naj88w2Akuwsll5wPjike46V0BokthCbRAbULhpwLdNLYdHnfjENioDCvo1aACWNopQHcbPVAEijcfvPbTyxzofDhri5y9sDrddVVqSTvw8ukWK0tOl0fcMlOG7g3KUJAbH" },
 { name: "Bunce Carrots", price: "1.99", unit: "", oldPrice: "2.50", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTdK9Xp4RFtLQy4bHYyJNZQms2i9H2qddc1lRxi1NsG8KDkLY1hTq4_GwMyqsM7UifzQjV11gqNHxkUh97rRBgPS753S2H4O2HymiaSdFjXvOz7WiW_SNf_I1JihhzeFClhsM7hAQ2NwwbD-iADvS74iIc38fsN5mEVZoBfohZWJOjJtSWpw9ePEk2RDXjHujYjB9nagJCEE_3CQw5f7CQFsPbBV6xb_cmgZOuB1yNPduw9VuOgit2mS6uO7yOrcGIqyiwl1rL_ZwB", tag: "SALE", tagColor: "bg-orange-100 text-orange-800" },
 { name: "Gala Apples", price: "1.29", unit: "/lb", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGfRHTi2SUjfIoV1DUpWLE6Gxy8bdHP0A2Aa06_cFbITi7g6teKE6YVjI0m3SVBi7q5h2q7yudvjmTgf16tMqWv_gaAsVFE8saK-OFdqN7beX9XI_UVQI9mkuY8bZhbOiFSD6c0fB58iSI_mprlaHQdifACwD4_vUIXJ4ugQXnTpBOCUldLdmjyA8G-tUAHNs8yAXRmgcv2xvBk5fjzCFPfP6Igf91UsWccgaRbLtzLD14q3GGIz7VopVqCo0fb2KVOXTFnpE7jdyU" }
 ];

 const aisleSpecials = specialsBlock.items.length > 0 ? specialsBlock.items : [
 { name: "Bell Peppers 3-Pack", price: "3.49", oldPrice: "4.99", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAy5F7r7nePXG8NGmud1dxusITHs1bRYNvfGzKrcUSEPjPV0GbGAMBqixMsfkL6TkW74AsW3tc7pJCjlGtaAQ2O5T4edOomLl_ykdtZnOnEAeyWUpdmdbX36IzAldPswOVOVzmhGMDEvNFx5b9fZLw6IVxwD5AhUOlXfc3rYdymdbEvx9gf3X7jVpgigl4Z57qkg71ujGDet2pzwYUARpf42UIzcWU2kRB97YI6dSHFyM2Y1UWh9n5YMetQqLZgsoR9dnz0nEG2x_e" },
 { name: "Baby Carrots", price: "0.99", oldPrice: "1.99", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAziwwU98hSNZgMjvSEn-w4umS-8oOsp543BDdcP20dv008vBlNE12K8D0YgncHiFTWuPeKix1OhOmHxB5jKZA_TsxHrc7g_V4LO43PD1f2urJHGIRUiN32GlMo6CGti3YQ31OSMuwnf3oqKn8kIVgqtpEOdS7aTScqQLpwiF4psGuZOLk9w5u23TeWwTLdt0HjeBojUqc5nuvF3h1NhSu3kBMyL6Cq6VIWK7YqW8hyY0BcRTu4AWv4y9RX-8q72WGjz-bInNkf5eGp" }
 ];

 // Filtering function
 const filterList = (list: any[]) => list.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

 const filteredBestSellers = filterList(bestSellers);
 const filteredSpecials = filterList(aisleSpecials);
 const filteredReorder = filterList(quickReorderItems);

 return (
 <div className="font-sans bg-background min-h-screen text-foreground">
 <header className="sticky top-14 z-30 bg-card/95 backdrop-blur-sm border-b border-border transition-all duration-300">
 <div className="max-w-[1800px] mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-8">
 <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer group" onClick={() => onNavigate('Home')}>
 <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:bg-olive-600 group-hover:text-background transition-colors">
 <span className="material-icons text-lg">arrow_back</span>
 </div>
 <h1 className="text-base font-sans font-bold text-foreground">
 Produce Market
 </h1>
 </div>
 <div className="flex-1 max-w-xl relative hidden md:block">
 <input 
 type="text" 
 className="w-full bg-background border border-border rounded-full py-2 pl-12 pr-6 text-sm font-sans placeholder:text-muted-foreground focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500 transition-all shadow-sm" 
 placeholder="Search fresh produce..." 
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 <span className="material-icons absolute left-4 top-2 text-muted-foreground text-lg">search</span>
 </div>
 <div className="flex items-center gap-4 flex-shrink-0">
 <button onClick={() => onNavigate('Favorites')} className="p-2 hover:bg-background rounded-full transition-colors text-foreground/80">
 <span className="material-icons">favorite_border</span>
 </button>
 <button onClick={() => onNavigate('Cart')} className="flex items-center gap-2 bg-foreground text-background text-background px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-olive-800 transition-colors shadow-lg shadow-slate-900/10">
 Cart ($42.50)
 </button>
 </div>
 </div>
 </header>

 <main className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6 space-y-8">
 {/* Hero - Hide when searching */}
 {!searchTerm && (
 <motion.div 
 initial={{ opacity: 0, y: isFirstVisit ? 20 : 5 }} 
 animate={{ opacity: 1, y: 0 }} 
 transition={{ duration: isFirstVisit ? 0.8 : 0.3, delay: isFirstVisit ? 0 : 0.1 }}
 className="relative w-full h-[320px] rounded-3xl overflow-hidden group shadow-xl"
 >
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZaVZsuIcPt-Snqtd00ARadGGhvApZXRSLHFds0nhdY0X2XM2kV9tJ5rjDPZWKo4HpfqVXQcISZG8W__pRUmkDBo-9tDRZlXZm0pVeIXQPvACFQQhs5QEZyWOk4geSuBrWEs6y2_XEARkWI6z2I0R7u_HbsazyDkQ5x0UGRcWg6nhBc5ra-0d9EJZt0vTj8cE5joHZpNhvptffB8mcLhxiHj5rVSqj7JQF2yNfwy71ShpKudl8Vb6DtIxHTEtSYdZ9nVtAk1gNU01e" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Hero" />
 <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center">
 <div className="pl-8 md:pl-12 max-w-xl">
 <span className="inline-block bg-olive-600 text-white text-[10px] font-bold px-3 py-1.5 mb-4 uppercase tracking-widest rounded-full">Farm Direct</span>
 <h1 className="text-4xl md:text-6xl font-serif text-background mb-4 leading-tight">{heroBlock.title}</h1>
 <p className="text-background/90 mb-6 font-sans text-base font-light max-w-md">{heroBlock.subtitle}</p>
 <button className="bg-card text-foreground font-bold py-3 px-8 text-xs uppercase tracking-widest rounded-full hover:bg-background transition-colors shadow-lg">Shop Harvest</button>
 </div>
 </div>
 </motion.div>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
 <aside className="hidden lg:block lg:col-span-1 space-y-6">
 <div className="bg-card p-5 rounded-xl shadow-sm border border-border">
 <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
 <h3 className="font-sans font-bold text-base text-foreground">Quick Reorder</h3>
 <span className="text-xs font-bold text-olive-600 cursor-pointer hover:underline">View All</span>
 </div>
 <div className="space-y-3">
 {filteredReorder.length > 0 ? (
 filteredReorder.map((item, i) => (
 <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-background p-2 -mx-2 rounded-lg transition-colors">
 <div className="w-10 h-10 bg-background rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
 <img src={item.img} className="w-full h-full object-cover mix-blend-multiply" alt={item.name}/>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-xs font-bold truncate text-foreground group-hover:text-olive-700 font-sans">{item.name}</p>
 <p className="text-[10px] text-muted-foreground font-sans">{item.price}</p>
 </div>
 <button 
 onClick={(e) => {
 e.stopPropagation();
 addToCart({
 id: item.name,
 name: item.name,
 price: parseFloat(item.price),
 image: item.img,
 category: 'Produce',
 context: 'RETAIL'
 }, 1);
 }}
 className="w-7 h-7 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:bg-olive-600 hover:text-background hover:border-olive-600 transition-all shadow-sm"
 >
 <span className="material-icons text-xs">add</span>
 </button>
 </div>
 ))
 ) : (
 <p className="text-xs text-muted-foreground italic">No items match.</p>
 )}
 </div>
 </div>
 </aside>

 <div className="col-span-1 lg:col-span-3 space-y-8">
 <section>
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-2xl font-serif text-foreground">Best Sellers</h2>
 <a href="#" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-olive-600 transition-colors">See All</a>
 </div>
 <AnimatePresence>
 {filteredBestSellers.length > 0 ? (
 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
 {filteredBestSellers.map((item, i) => (
 <motion.div 
 layout 
 initial={{ opacity: 0, y: 20 }} 
 animate={{ opacity: 1, y: 0 }} 
 exit={{ opacity: 0 }} 
 transition={{ delay: i * 0.05 }}
 key={item.name} 
 className="bg-card p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group relative border border-border cursor-pointer"
 onClick={() => setSelectedProduct({
 id: item.name,
 name: item.name,
 price: parseFloat(item.price),
 oldPrice: item.oldPrice ? parseFloat(item.oldPrice) : undefined,
 unit: item.unit,
 image: item.img,
 category: 'Produce',
 context: 'RETAIL',
 tag: item.tag,
 tagColor: item.tagColor
 })}
 >
 {item.tag && (
 <div className={`absolute top-4 left-4 z-10 ${item.tagColor} text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-full shadow-sm`}>
 {item.tag}
 </div>
 )}
 <div className="h-48 overflow-hidden flex items-center justify-center mb-6 bg-background rounded-xl group-hover:bg-card transition-colors">
 <img src={item.img} className="h-36 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={item.name}/>
 </div>
 <div>
 <h3 className="font-serif font-bold text-lg mb-2 text-foreground leading-tight group-hover:text-olive-700 transition-colors">{item.name}</h3>
 <div className="flex items-end justify-between">
 <div className="flex flex-col">
 {item.oldPrice && <span className="text-xs text-muted-foreground line-through font-sans mb-0.5">${item.oldPrice}</span>}
 <span className="text-lg font-bold font-sans text-foreground">${item.price}<span className="text-xs font-normal text-muted-foreground ml-1">{item.unit}</span></span>
 </div>
 <button 
 onClick={(e) => {
 e.stopPropagation();
 addToCart({
 id: item.name,
 name: item.name,
 price: parseFloat(item.price),
 image: item.img,
 category: 'Produce',
 context: 'RETAIL'
 }, 1);
 }}
 className="w-10 h-10 flex items-center justify-center rounded-full bg-background text-foreground/80 hover:bg-olive-600 hover:text-background transition-all shadow-sm"
 >
 <span className="material-icons text-lg">add</span>
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 ) : (
 <div className="p-12 text-center bg-card rounded-2xl border border-border">
 <p className="text-muted-foreground font-serif italic text-lg">No produce found matching "{searchTerm}"</p>
 </div>
 )}
 </AnimatePresence>
 </section>

 <section>
 <h2 className="text-2xl font-serif text-foreground mb-6">Weekly Aisle Specials</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {/* Featured Special Card */}
 {!searchTerm && (
 <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-foreground text-background relative group h-64 rounded-3xl overflow-hidden shadow-xl">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaQls-KZe2qWGVBK4US4NVKus1Et7wCaI2781cxcHy7Prjyce5HO0y7PHl_aXZO7u0e4w5ynJVtzoEEp2cOaspMB5ja3AwlHp8UqDnumHPfPslyYDnY9gmjTanRRxlgFBNNv8bPDDTJbUuktxW2nB81VRuXDD3ogcn-SGYU3su08j3E8BN_gwjBnwkFTiJsz5njhi90uDyws8uE7xFcopgxc4c3So8sfQ0Cm8EQrKFMFbPK_ngeIvHegXxOs7A_I-e0uLRAO_3-oUs" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Citrus" />
 <div className="relative p-6 h-full flex flex-col justify-end">
 <span className="bg-orange-500 text-white text-[9px] font-bold px-2.5 py-1 w-fit mb-3 uppercase tracking-widest rounded-full shadow-lg">30% OFF</span>
 <h3 className="text-2xl font-serif text-background mb-1">Citrus Festival</h3>
 <p className="text-background/80 text-xs mb-4 font-sans">Oranges, Lemons, Grapefruits</p>
 <button className="bg-card text-foreground font-bold py-2.5 px-5 text-[10px] uppercase tracking-widest rounded-full w-fit hover:bg-background transition-colors shadow-lg">Browse Deals</button>
 </div>
 </div>
 )}
 
 {filteredSpecials.map((item, i) => (
 <motion.div 
 layout 
 key={item.name} 
 className="bg-card p-4 flex gap-4 hover:shadow-xl transition-all duration-300 rounded-2xl border border-border group cursor-pointer"
 onClick={() => setSelectedProduct({
 id: item.name,
 name: item.name,
 price: parseFloat(item.price),
 oldPrice: item.oldPrice ? parseFloat(item.oldPrice) : undefined,
 unit: item.unit,
 image: item.img,
 category: 'Produce',
 context: 'RETAIL',
 tag: item.tag,
 tagColor: item.tagColor
 })}
 >
 <div className="w-20 h-20 bg-background rounded-xl flex-shrink-0 flex items-center justify-center p-2">
 <img src={item.img} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={item.name}/>
 </div>
 <div className="flex flex-col justify-between flex-1 py-0.5">
 <div>
 <h4 className="font-serif font-bold text-base text-foreground mb-0.5 group-hover:text-olive-700 transition-colors">{item.name}</h4>
 <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Mixed Colors</div>
 </div>
 <div className="flex items-center justify-between mt-2">
 <div className="flex flex-col">
 <span className="text-[10px] text-muted-foreground line-through font-sans mb-0.5">${item.oldPrice}</span>
 <span className="text-base font-bold text-orange-600 font-sans">${item.price}</span>
 </div>
 <button 
 onClick={(e) => {
 e.stopPropagation();
 addToCart({
 id: item.name,
 name: item.name,
 price: parseFloat(item.price),
 image: item.img,
 category: 'Produce',
 context: 'RETAIL'
 }, 1);
 }}
 className="w-8 h-8 flex items-center justify-center rounded-full bg-background text-muted-foreground hover:bg-foreground text-background hover:text-background transition-all"
 >
 <span className="material-icons text-xs">add</span>
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </section>
 </div>
 </div>
 </main>

 {selectedProduct && (
 <ProductDetailModal 
 product={selectedProduct} 
 onClose={() => setSelectedProduct(null)} 
 />
 )}
 </div>
 );
};

export default Produce;