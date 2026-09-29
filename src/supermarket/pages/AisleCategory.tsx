import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cmsApi } from '@/services/cmsApi';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';

interface Props {
 category: string;
 onNavigate: (page: any) => void;
}

const AisleCategory: React.FC<Props> = ({ category, onNavigate }) => {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const { addToCart } = useCart();
 const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

 useEffect(() => {
 const fetchProducts = async () => {
 try {
 const data = await cmsApi.getProducts();
 // Filter products by category (case-insensitive)
 const filtered = (data.products || []).filter(
 (p: Product) => p.category.toLowerCase() === category.toLowerCase()
 );
 setProducts(filtered);
 } catch (error) {
 console.error("Failed to fetch products", error);
 } finally {
 setLoading(false);
 }
 };
 fetchProducts();
 }, [category]);

 const filteredProducts = products.filter(p => 
 p.name.toLowerCase().includes(searchTerm.toLowerCase())
 );

 return (
 <div className="font-sans bg-background min-h-screen text-foreground transition-colors duration-300">
 <header className="sticky top-0 lg:top-14 z-30 bg-card/95 backdrop-blur-sm border-b border-border transition-all duration-300">
 <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-8">
 <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer group" onClick={() => onNavigate('Aisles')}>
 <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:bg-orange-500 group-hover:text-background transition-colors">
 <span className="material-icons text-lg">arrow_back</span>
 </div>
 <h1 className="text-base font-sans font-bold text-foreground capitalize">
 {category} Aisle
 </h1>
 </div>
 <div className="flex-1 max-w-xl relative hidden md:block">
 <input 
 type="text" 
 className="w-full bg-background border border-border rounded-full py-2 pl-12 pr-6 text-sm font-sans placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm text-foreground " 
 placeholder={`Search ${category}...`}
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 <span className="material-icons absolute left-4 top-2 text-muted-foreground text-lg">search</span>
 </div>
 </div>
 </header>

 <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 space-y-8">
 {loading ? (
 <div className="flex justify-center items-center h-64">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
 </div>
 ) : filteredProducts.length === 0 ? (
 <div className="text-center py-20">
 <span className="material-icons text-6xl text-background/80 mb-4">inventory_2</span>
 <h2 className="text-2xl font-bold text-foreground mb-2">No products found</h2>
 <p className="text-muted-foreground ">We couldn't find any products in the {category} aisle.</p>
 </div>
 ) : (
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
 {filteredProducts.map((product, i) => (
 <motion.div 
 key={product.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-orange-500/30 transition-all duration-300 flex flex-col cursor-pointer"
 onClick={() => setSelectedProduct(product)}
 >
 <div className="relative aspect-square bg-background p-4 flex items-center justify-center overflow-hidden">
 <img 
 src={product.image || 'https://picsum.photos/seed/placeholder/400/400'} 
 alt={product.name} 
 className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
 referrerPolicy="no-referrer"
 />
 {product.tag && (
 <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${product.tagColor || 'bg-orange-100 text-orange-800'}`}>
 {product.tag}
 </div>
 )}
 <button 
 onClick={(e) => {
 e.stopPropagation();
 addToCart(product, 1);
 }}
 className="absolute bottom-3 right-3 w-10 h-10 bg-card rounded-full shadow-lg flex items-center justify-center text-foreground hover:bg-orange-500 hover:text-background dark:hover:bg-orange-500 transition-colors translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
 >
 <span className="material-icons text-sm">add_shopping_cart</span>
 </button>
 </div>
 <div className="p-4 flex-1 flex flex-col">
 <h3 className="font-bold text-sm text-foreground leading-tight mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">{product.name}</h3>
 <div className="mt-auto pt-3 flex items-end justify-between">
 <div>
 {product.oldPrice && (
 <span className="text-xs text-muted-foreground line-through block mb-0.5">₦{product.oldPrice.toLocaleString()}</span>
 )}
 <div className="flex items-baseline gap-1">
 <span className="font-bold text-lg text-foreground ">₦{product.price.toLocaleString()}</span>
 {product.unit && <span className="text-xs text-muted-foreground ">{product.unit}</span>}
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
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

export default AisleCategory;
