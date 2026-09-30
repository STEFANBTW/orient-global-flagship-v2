import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { cmsApi } from '@/services/cmsApi';

interface SmartPasteProps {
 onClose: () => void;
}

interface SmartResult {
 name: string;
 match: string;
 price: number;
 img: string;
 qty: number;
 status: string;
}

const SmartPaste: React.FC<SmartPasteProps> = ({ onClose }) => {
 const [input, setInput] = useState('');
 const [processing, setProcessing] = useState(false);
 const [results, setResults] = useState<SmartResult[]>([]);
 const [analyzed, setAnalyzed] = useState(false);
 const [products, setProducts] = useState<Product[]>([]);

 useEffect(() => {
 const fetchProducts = async () => {
 try {
 const data = await cmsApi.getProducts();
 setProducts(data.products || []);
 } catch (error) {
 console.error("Failed to fetch products", error);
 }
 };
 fetchProducts();
 }, []);

 const processList = () => {
 setProcessing(true);
 setAnalyzed(false);

 // Simulate network delay for AI processing
 setTimeout(() => {
 const lines = input.split(/\n|,/).filter(line => line.trim() !== '');
 const foundItems: SmartResult[] = [];

 lines.forEach(line => {
 const lowerLine = line.toLowerCase();
 // Simple naive search: check if any product name part exists in the line
 // In a real app, this would use fuzzy search or LLM
 const match = products.find(p => {
 const nameParts = p.name.toLowerCase().split(' ');
 // Check if at least one significant word matches
 return nameParts.some(part => part.length > 3 && lowerLine.includes(part));
 });

 if (match) {
 // Try to extract quantity (basic heuristic)
 const qtyMatch = line.match(/(\d+)/);
 const qty = qtyMatch ? parseInt(qtyMatch[0]) : 1;

 foundItems.push({
 name: match.name,
 match: `Matched from "${line.trim()}"`,
 price: match.price,
 img: match.image,
 qty: qty,
 status: match.stock && match.stock > 0 ? 'In Stock' : 'Out of Stock'
 });
 }
 });

 setResults(foundItems);
 setProcessing(false);
 setAnalyzed(true);
 }, 1500);
 };

 return (
 <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
 <motion.div 
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="w-full max-w-5xl h-[85vh] bg-card rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5"
 >
 {/* Header */}
 <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-card shrink-0">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-[#ff6a00]/10 rounded-lg"><span className="material-icons text-[#ff6a00] text-xl">content_paste</span></div>
 <div>
 <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
 <span className="text-[#ff6a00]">ORIENT</span> SUPERMARKET <span className="text-muted-foreground font-normal">| Smart Paste</span>
 </h2>
 <p className="text-xs text-muted-foreground ">Paste your raw list and let AI find the items.</p>
 </div>
 </div>
 <button onClick={onClose} className="p-2 hover:bg-background dark:hover:bg-foreground text-background rounded-full text-muted-foreground"><span className="material-icons">close</span></button>
 </div>

 <div className="flex flex-1 overflow-hidden">
 {/* Input Area */}
 <div className="w-5/12 border-r border-border bg-[#f8f5f2] flex flex-col p-6 relative">
 <div className="flex justify-between items-center mb-2">
 <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Note</span>
 <button className="text-xs text-[#ff6a00] underline" onClick={() => { setInput(''); setResults([]); setAnalyzed(false); }}>Clear List</button>
 </div>
 <div className="relative flex-1 bg-card rounded-lg shadow-sm ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-[#ff6a00]/50">
 <textarea 
 className="w-full h-full p-4 bg-transparent border-0 focus:ring-0 resize-none text-foreground/80 text-base leading-relaxed" 
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Type or paste your list here... e.g. '2 bags of rice, carton of indomie'"
 />
 <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-gray-200/50 dark:from-slate-800/50 to-transparent pointer-events-none rounded-br-lg"></div>
 </div>
 <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1"><span className="material-icons text-[14px]">info</span> AI parses natural language automatically.</p>
 </div>

 {/* Results Area */}
 <div className="w-7/12 bg-card flex flex-col relative">
 <div className="px-6 py-3 border-b border-border bg-[#fef5ee] flex justify-between items-center">
 <div className="flex items-center gap-2">
 {processing ? (
 <>
 <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
 <span className="text-xs font-semibold text-[#96320e] uppercase tracking-wide">Processing...</span>
 </>
 ) : analyzed ? (
 <>
 <span className="w-2 h-2 rounded-full bg-slate-500"></span>
 <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Analysis Complete</span>
 </>
 ) : (
 <span className="text-xs text-muted-foreground uppercase tracking-wide">Waiting for input</span>
 )}
 </div>
 <span className="text-xs text-muted-foreground ">{results.length > 0 ? `Found ${results.length} items` : 'No items found yet'}</span>
 </div>

 <div className="flex-1 overflow-y-auto p-6 space-y-4">
 {results.map((item, i) => (
 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex items-start gap-4 p-3 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
 <div className="w-16 h-16 bg-background rounded-md overflow-hidden shrink-0 relative">
 <img src={item.img} className="w-full h-full object-cover" alt={item.name}/>
 <div className="absolute bottom-0 right-0 bg-slate-500 text-background p-[2px] rounded-tl-md"><span className="material-icons text-[10px] block">check</span></div>
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex justify-between items-start">
 <div><h4 className="font-semibold text-foreground ">{item.name}</h4><p className="text-xs text-muted-foreground mt-0.5">{item.match}</p></div>
 <div className="text-right"><span className="block font-bold text-[#ff6a00] text-lg">₦{item.price.toLocaleString()}</span></div>
 </div>
 <div className="mt-2 flex items-center justify-between">
 <div className="flex items-center border border-border rounded-md bg-background h-8">
 <button className="px-2 text-muted-foreground ">-</button>
 <span className="px-2 text-sm font-medium border-x border-border w-8 text-center text-foreground ">{item.qty}</span>
 <button className="px-2 text-muted-foreground ">+</button>
 </div>
 {item.status && <span className="text-xs text-green-600 flex items-center gap-1 bg-background px-2 py-1 rounded"><span className="material-icons text-[12px]">verified</span> {item.status}</span>}
 </div>
 </div>
 </motion.div>
 ))}
 
 {analyzed && results.length === 0 && (
 <div className="text-center py-10 text-muted-foreground">
 <span className="material-icons text-4xl mb-2">manage_search</span>
 <p>No matches found in our database.</p>
 </div>
 )}
 </div>
 </div>
 </div>
 
 <div className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-between bg-card ">
 <div className="flex flex-col">
 <span className="text-sm text-muted-foreground ">Total Estimated Cost</span>
 <span className="text-2xl font-bold text-foreground tracking-tight">
 ₦{results.reduce((acc, curr) => acc + (curr.price * curr.qty), 0).toLocaleString()}
 </span>
 </div>
 <div className="flex gap-4">
 <button onClick={onClose} className="px-6 py-2.5 rounded-lg border border-border text-foreground/80 font-medium hover:bg-background dark:hover:bg-foreground text-background">Cancel</button>
 <button 
 onClick={processList}
 disabled={processing}
 className="px-8 py-2.5 rounded-lg bg-[#ff6a00] text-white font-semibold hover:bg-[#d65a05] shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
 >
 {processing ? (
 <>Processing...</>
 ) : analyzed ? (
 <><span>Add All to Cart</span><span className="bg-card/20 px-1.5 py-0.5 rounded text-xs font-bold">{results.length}</span></>
 ) : (
 <><span>Analyze List</span><span className="material-icons text-sm">auto_awesome</span></>
 )}
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 );
};

export default SmartPaste;
