import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cmsApi } from '@/services/cmsApi';

interface Props {
 onNavigate: (page: any) => void;
}

const container = {
 hidden: { opacity: 0 },
 show: {
 opacity: 1,
 transition: {
 staggerChildren: 0.1
 }
 }
};

const itemAnim = {
 hidden: { opacity: 0, y: 30, scale: 0.9 },
 show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 50 } }
};

const Aisles: React.FC<Props> = ({ onNavigate }) => {
 const [cmsData, setCmsData] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
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

 const aislesBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'aisles')?.content_payload || {
 aisles: [
 { id: 'produce', name: 'Fresh Produce', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1xd2NZ3opaoe4vIhkG1KskQa5eycV1mBsXfOpf4j-MJsKt-ypLr-6_f-boyuKPonX3JvaXMTTGJY1hKM0gEqNIgAkn5V9b1TkeoiqKOc8GE1gvBAc-0rZTeFQXb2hVo2qsOMh-mQjOIQyjMOqqNlfYfFsvBlSYuCF5w-_Pq0TYPBlahOL2PCyCACTheQjxsJQIsNA5NND-7NqRH8t_thzBfpoRNDtE-gks7qVYG2cBaVC8C0IL9am7k5uv13czpM1U-14-_uj-Q9w', color: 'bg-green-100 text-green-800' },
 { id: 'bakery', name: 'Bakery & Bread', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnmhadoCVKHfYOfzPDp4J-6pCxjbZzTpGP75Vr_EksxMx5s-niabV7JQ0xEJAGhT6JS3uI5vilRbeFyK2EZzgvV2tCNaDGuY3AUvcd-1qmWdnf_UTBwWXlavafUaKatDnX2FVp60K_6UujA-_6AQVuHME2tSYnvfAGbqOh-74zdGtg6ddQmlBGHxLRQwJBGzO3cc0woi5qtRnAAH41xL31J5tx7UGTq9Adz2r-cl9V4BEIC4ZxsSZ_kPlJiju2gk4htfJnj3ppuzqM', color: 'bg-yellow-100 text-yellow-800' },
 { id: 'dairy', name: 'Dairy & Eggs', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbd0wFC57LwPQUOyUC38exd7j2pV9Jh0K_hLRw0yjkF5iFVsqmQz3jfBgM6_G9ZX2p6VAPIkOf-aOOXEFojpbgtgemiFiYnfzuWMcxe_MW3GkeN7U1_fuwGfrPp_Mffjm4aVHsil05PJE3o7PJg3_DDy0iQgexr7xzJPYp9S1no5rXRRZyo7BpWPEieVoHvLFrn_Nv8NF65PZWTEUQQwc7WIMR7bDeekusfqamGTmuycHFki2QQcAFevyUSfJUH8gln0PTyPBEB5MX', color: 'bg-blue-100 text-blue-800' },
 { id: 'pantry', name: 'Pantry Staples', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfoq8Qt1i7X_77OeMmegd2_Pq0DTvro1D9LRM41EHPXBvfhGfBUFUH9Hxz6iRXpsKH0WopOq6O_kC6qnviNMVijikGIXmg2_kEoGYs1dpOg2jDHPARVYUD9l8q5TSbVWMd66a8oJEmxm4TKvrUgiDQSj9NVd1rcUAE7R5dxHnKIrs9TFbKXLxgjuA6DVPTbfZ01F1DuQ5dl6lAIl20nZh9Y_PpPo159YTLemPsPv9zW0IBTa5E5lL9qd5UMd_feG8lscDICVmlTxgD', color: 'bg-orange-100 text-orange-800' },
 { id: 'meat', name: 'Meat & Seafood', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZaVZsuIcPt-Snqtd00ARadGGhvApZXRSLHFds0nhdY0X2XM2kV9tJ5rjDPZWKo4HpfqVXQcISZG8W__pRUmkDBo-9tDRZlXZm0pVeIXQPvACFQQhs5QEZyWOk4geSuBrWEs6y2_XEARkWI6z2I0R7u_HbsazyDkQ5x0UGRcWg6nhBc5ra-0d9EJZt0vTj8cE5joHZpNhvptffB8mcLhxiHj5rVSqj7JQF2yNfwy71ShpKudl8Vb6DtIxHTEtSYdZ9nVtAk1gNU01e', color: 'bg-red-100 text-red-800' },
 { id: 'frozen', name: 'Frozen Foods', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoLnVeL44jkjtmwQxjCJ4Fbt14l3Jbz8YC278yJslk1GE1LehJCw8YjnicdmDXRWfEDtkqb483NspodmfrV1Q0Jo9EbwICzgvukibkvP4bi0kSS4h-WKj3njHMuF18yFP0Lhvq5s22o0-PuE1ybYNyWLBLXJws_wfIIddru9TozcLJdj0HbIO7sU1go_xmCYJ313XT4HeCkqsoPDNpgB7NilpejuOfSstw0xnlZtse27wNMW3ChICF4PI9gXgRDtttmtbd9jw51FWU', color: 'bg-cyan-100 text-cyan-800' },
 { id: 'beverages', name: 'Beverages', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6yO9YpD7WzXoPz8rWqU2tV9sQ4xR3yM6nO1lA2bC5dE8fG9hI0jK3mL4nP5oQ6rS7tU8vW9xY0zB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2r', color: 'bg-purple-100 text-purple-800' },
 { id: 'household', name: 'Household', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR3BqvgI_JtzoDPnzd2B4va9ct4322umJBsiC4ir_l-N3MBrGNm4n-c9mdgd4GV-At7oFks2rep4HKnSd1YNmkpQWJxm3JUk-2XngzcLnstZd9nWgJldDEnqie660w8R5k5JtBm4a6XJMLa8HapRDf1S2RAw6CrZPTaGdyPkrcd8ESOfAiZOilFrNsR-RgK99FauncBpDUmq7rmrGhove30EiaBy9Rf9z2162_Y_5D34T-oRqR404T-IX9RC-m2fPDnhc62KzIHA66', color: 'bg-background text-foreground' },
 ]
 };

 const aisles = aislesBlock.aisles;

 const handleAisleClick = (aisle: any) => {
 // Dynamic navigation based on id
 // Capitalize first letter for page name convention
 const pageName = aisle.id.charAt(0).toUpperCase() + aisle.id.slice(1);
 onNavigate(pageName);
 };

 if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

 return (
 <div className="min-h-screen bg-background p-4 md:p-6 transition-colors duration-300 font-sans">
 <div className="max-w-[1600px] mx-auto">
 <motion.button 
 initial={{ x: -20, opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 onClick={() => onNavigate('Home')} 
 className="mb-4 text-orange-600 flex items-center gap-2 font-bold hover:underline uppercase tracking-widest text-xs font-sans"
 >
 <span className="material-icons text-sm">arrow_back</span> Back to Storefront
 </motion.button>
 
 <motion.div 
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-6"
 >
 <h1 className="text-2xl font-bold mb-1 text-foreground ">Shop by Aisle</h1>
 <p className="text-muted-foreground text-xs font-sans font-light max-w-2xl">Explore our departments to find exactly what you need.</p>
 </motion.div>

 <motion.div 
 variants={container}
 initial="hidden"
 animate="show"
 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
 >
 {aisles.map((aisle) => (
 <motion.div 
 key={aisle.id} 
 variants={itemAnim}
 whileHover={{ y: -10 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => handleAisleClick(aisle)}
 className="group relative h-56 bg-card rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-xl cursor-pointer border border-border transition-all duration-500"
 >
 <div className="absolute inset-0 bg-background ">
 <img src={aisle.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" alt={aisle.name} />
 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
 </div>
 
 <div className="absolute bottom-0 left-0 p-6 w-full z-10">
 <div className="flex justify-between items-end">
 <div>
 <motion.span 
 className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold mb-2 shadow-sm uppercase tracking-widest bg-card/20 backdrop-blur-md text-background border border-transparent`}
 >
 {aisle.id}
 </motion.span>
 <h2 className="text-3xl font-bold text-background leading-none mb-1 group-hover:text-orange-200 transition-colors">{aisle.name}</h2>
 </div>
 <motion.div 
 initial={{ opacity: 0, x: -10 }}
 whileHover={{ opacity: 1, x: 0 }}
 className="bg-card text-foreground rounded-full p-2 shadow-lg"
 >
 <span className="material-icons text-lg">arrow_forward</span>
 </motion.div>
 </div>
 </div>
 </motion.div>
 ))}
 </motion.div>
 </div>
 </div>
 );
};
export default Aisles;