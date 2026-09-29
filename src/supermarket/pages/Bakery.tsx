import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';
import { Product } from '../types';
import { cmsApi } from '@/services/cmsApi';

interface BakeryProps {
 onNavigate: (page: any) => void;
}

const Bakery: React.FC<BakeryProps> = ({ onNavigate }) => {
 const { addToCart } = useCart();
 const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
 const [cmsData, setCmsData] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [isFirstVisit, setIsFirstVisit] = useState(true);

 useEffect(() => {
 const hasVisited = sessionStorage.getItem('hasVisitedBakery');
 if (hasVisited) {
 setIsFirstVisit(false);
 } else {
 sessionStorage.setItem('hasVisitedBakery', 'true');
 }

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

 const heroBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'hero')?.content_payload || {
 title: "Artisan \nTraditions",
 subtitle: "Every loaf tells a story of patience and craft. We use only organic flour, natural leaven, and time-honored techniques.",
 est: "Est. 2024",
 cta: "View Today's Menu",
 image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
 };

 const productsBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'products')?.content_payload || { categories: [], items: [] };

 const categories = productsBlock.categories.length > 0 ? productsBlock.categories : ["Artisan Bread", "Pastries", "Cakes", "Gluten Free"];
 
 const products = productsBlock.items.length > 0 ? productsBlock.items : [
 { name: "Sourdough Boule", price: "$6.50", desc: "Fermented for 48 hours", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9t68yp7eD8EbfgYgN8yPh9E8fINlAf8HuLVVnTGvCD3qUc3e23T2JGun-nJP6bXRoxLvgVjcWe2ClNCdUfBufe8QcXHwnZ0OciLkZ2N8bdRmt7B9LTt6rLvk-_tylwPFTYz_ay5m83naj88w2Akuwsll5wPjike46V0BokthCbRAbULhpwLdNLYdHnfjENioDCvo1aACWNopQHcbPVAEijcfvPbTyxzofDhri5y9sDrddVVqSTvw8ukWK0tOl0fcMlOG7g3KUJAbH" },
 { name: "Pain au Chocolat", price: "$4.25", desc: "Rich dark chocolate", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM8pKrsve-Hsj7bZJX1-9KlNRvoCWYl5G6DUmCpAQ9ePX3MZYAukyMkkQi9J0Np11wBcyHAedNaXlJ-csKMnP19WqZ21uNCFRLONd0iE8bn69EmHwUpWN7-xL3oj_ob-LsHtqc6km408cTMkvKqR2MuFlSDGyXY7j7I6YUgRTzsVuffaztzdRmCOTusY4AFpDCl5H1w0d9WR06Mb7t7B7X9TOGxGqDjaAhUI0fUjEJ3RrPUOVHwqshuARGhgZcO1uyuNpfEjzHW0H3" },
 { name: "Olive Focaccia", price: "$5.75", desc: "Rosemary & sea salt", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhQ-F9wusQ9tYzEARZ75JEBmmbjYOJu1BPLTcPrMezcQ5TrNe8SNrjrcDPKa3XtCkPk66CN3k5EaTyyLF5HE_aGWcM0oIXoaA3R0UoGUQplQhC7Rydzywu5-D6unPylNBeUdZRrGNm5WoxbBD_F9uiK38tOuKVjmmh1J7ftouqXh1TP3HtSIfozaVNzjcZx9h7xGSinlUY6Tqkm-vFBrA9EwTQ987rV052t1YVhPHwOI0NZ0rj9r7EoufEqGU4d-YqY7H5Voh5uYhc" },
 { name: "Almond Croissant", price: "$4.75", desc: "Toasted almond flakes", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdtvcfnlP4Iieg3vcHqItD-0FtFjLHCmUns6ze42h8qXWFbF2e_i3VUn56MPO8V6qcg-YYqZHxOkRiOBmAtL7pEIuUn3KAIR9r1KN_hUU68wBE6A1obJ4mWq3pnE2PFvxCTfU_53_oVzfhEds4gxVjOMq_ey0J3EB2l9xHgUED2QHTd3vIQdIQxAwWAHeq8QTUXWbNDX8Qhu3NjybSYegFz7QB1CV-whWjtHCRXo8nMNncMP_FpKsgEZLS6uw_XPA7VBTdY36tqSaC" },
 ];

 return (
 <div className="min-h-screen bg-[#f5f5f0] text-[#4a4a3b] font-serif selection:bg-[#5A5A40] selection:text-white">
 <header className="fixed top-0 w-full z-50 bg-[#f5f5f0]/80 backdrop-blur-md border-b border-[#5A5A40]/10">
 <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
 <button onClick={() => onNavigate('Home')} className="flex items-center gap-3 group">
 <span className="material-icons text-[#5A5A40] text-2xl group-hover:-translate-x-1 transition-transform">west</span>
 <span className="text-sm font-sans uppercase tracking-widest text-[#5A5A40]">Back to Market</span>
 </button>
 <h1 className="text-3xl font-serif italic text-[#5A5A40]">The Bakery</h1>
 <button className="relative p-2">
 <span className="material-icons text-[#5A5A40]">shopping_bag</span>
 <span className="absolute top-0 right-0 w-2 h-2 bg-[#5A5A40] rounded-full"></span>
 </button>
 </div>
 </header>

 <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
 {/* Hero Section */}
 <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <motion.div 
 initial={{ opacity: 0, y: isFirstVisit ? 20 : 5 }} 
 animate={{ opacity: 1, y: 0 }} 
 transition={{ duration: isFirstVisit ? 0.8 : 0.3, delay: isFirstVisit ? 0 : 0.1 }}
 >
 <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#5A5A40] mb-3 block">{heroBlock.est}</span>
 <h2 className="text-5xl md:text-7xl leading-[0.9] mb-6 text-[#2c2c24] whitespace-pre-line">
 {heroBlock.title}
 </h2>
 <p className="font-sans text-base leading-relaxed max-w-md mb-8 text-[#5A5A40]/80">
 {heroBlock.subtitle}
 </p>
 <button className="bg-[#5A5A40] text-[#f5f5f0] px-7 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest hover:bg-[#4a4a35] transition-colors">
 {heroBlock.cta}
 </button>
 </motion.div>
 <motion.div 
 initial={{ opacity: 0, scale: isFirstVisit ? 0.95 : 0.99 }} 
 animate={{ opacity: 1, scale: 1 }} 
 transition={{ duration: isFirstVisit ? 1 : 0.4, delay: isFirstVisit ? 0.2 : 0.1 }}
 className="relative h-[450px] rounded-[40px] overflow-hidden"
 >
 <img 
 src={heroBlock.image} 
 alt="Baker kneading dough" 
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-[#5A5A40]/10 mix-blend-multiply"></div>
 </motion.div>
 </section>

 {/* Categories */}
 <section className="mb-16">
 <div className="flex flex-wrap gap-3 justify-center mb-10">
 {categories.map((cat, i) => (
 <button key={cat} className={`px-6 py-2.5 rounded-full border border-[#5A5A40] font-sans text-xs uppercase tracking-wider transition-all ${i === 0 ? 'bg-[#5A5A40] text-[#f5f5f0]' : 'hover:bg-[#5A5A40]/5 text-[#5A5A40]'}`}>
 {cat}
 </button>
 ))}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {products.map((product, i) => (
 <motion.div 
 key={product.name}
 initial={{ opacity: 0, y: 100 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, amount: 0.5 }}
 transition={{ delay: i * 0.1 }}
 className="group cursor-pointer"
 onClick={() => setSelectedProduct({
 id: product.name,
 name: product.name,
 price: parseFloat(product.price.replace('₦', '').replace(',', '')),
 image: product.img,
 category: 'Bakery',
 context: 'RETAIL'
 })}
 >
 <div className="bg-card rounded-[32px] p-4 mb-5 shadow-[0_4px_20px_rgba(90,90,64,0.05)] transition-shadow group-hover:shadow-[0_8px_30px_rgba(90,90,64,0.1)]">
 <div className="h-64 rounded-[24px] overflow-hidden relative">
 <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
 <button 
 onClick={(e) => {
 e.stopPropagation();
 addToCart({
 id: product.name,
 name: product.name,
 price: parseFloat(product.price.replace('₦', '').replace(',', '')),
 image: product.img,
 category: 'Bakery',
 context: 'RETAIL'
 }, 1);
 }}
 className="absolute bottom-4 right-4 w-10 h-10 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#5A5A40] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
 >
 <span className="material-icons text-sm">add</span>
 </button>
 </div>
 </div>
 <div className="px-4 flex justify-between items-baseline">
 <div>
 <h3 className="text-xl mb-1 group-hover:italic transition-all">{product.name}</h3>
 <p className="font-sans text-[10px] text-[#5A5A40]/60 uppercase tracking-wide">{product.desc}</p>
 </div>
 <span className="font-sans font-bold text-base text-[#5A5A40]">{product.price}</span>
 </div>
 </motion.div>
 ))}
 </div>
 </section>

 {/* Newsletter */}
 <section className="bg-[#5A5A40] rounded-[40px] p-10 md:p-16 text-center text-[#f5f5f0] relative overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
 <div className="relative z-10 max-w-2xl mx-auto">
 <span className="material-icons text-4xl mb-6 opacity-80">local_cafe</span>
 <h2 className="text-4xl md:text-5xl mb-6">Join the Morning Club</h2>
 <p className="font-sans text-lg opacity-80 mb-10 leading-relaxed">
 Sign up for our newsletter to receive daily baking schedules, special offers, and invitations to our tasting events.
 </p>
 <div className="flex flex-col md:flex-row gap-4">
 <input 
 type="email" 
 placeholder="Your email address" 
 className="flex-1 bg-[#f5f5f0]/10 border border-[#f5f5f0]/20 rounded-full px-8 py-4 text-[#f5f5f0] placeholder-[#f5f5f0]/40 focus:outline-none focus:bg-[#f5f5f0]/20 font-sans"
 />
 <button className="bg-[#f5f5f0] text-[#5A5A40] px-10 py-4 rounded-full font-sans font-bold uppercase tracking-widest hover:bg-card transition-colors">
 Subscribe
 </button>
 </div>
 </div>
 </section>
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

export default Bakery;
