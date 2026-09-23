import React, { useState } from 'react';

const Quality: React.FC = () => {
 const [batchId, setBatchId] = useState('');
 const [isVerified, setIsVerified] = useState(false);

 const handleVerify = (e: React.FormEvent) => {
 e.preventDefault();
 if(batchId) setIsVerified(true);
 };

 return (
 <div className="min-h-screen pt-20 bg-background-light">
 {/* Hero */}
 <div className="bg-secondary text-background py-24 relative overflow-hidden">
 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1920&q=80')] bg-cover mix-blend-overlay opacity-20"></div>
 <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
 <h1 className="text-4xl md:text-5xl font-bold mb-6">TRUST THROUGH DATA.</h1>
 <p className="text-xl text-blue-100 mb-12">Our commitment to transparency. Every drop verified. Trace your bottle's journey from source to sip.</p>
 
 <form onSubmit={handleVerify} className="max-w-2xl mx-auto relative">
 <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
 <input 
 type="text" 
 value={batchId}
 onChange={(e) => setBatchId(e.target.value)}
 placeholder="ENTER YOUR BOTTLE NECK CODE (e.g., OW-4192)" 
 className="w-full h-16 pl-14 pr-4 rounded-full text-foreground outline-none focus:ring-4 focus:ring-primary/50 shadow-2xl"
 />
 {isVerified && (
 <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2">
 <span className="material-icons text-background animate-bounce">arrow_downward</span>
 </div>
 )}
 </form>
 </div>
 </div>

 {/* Verification Result */}
 {isVerified ? (
 <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-20 pb-24 animate-fade-in">
 <div className="bg-card rounded-xl shadow-xl border-t-4 border-primary overflow-hidden">
 <div className="bg-blue-50 p-4 border-b border-blue-100 text-center">
 <h2 className="text-xl font-bold text-secondary uppercase">Batch #{batchId || '4192'} VERIFIED</h2>
 </div>
 
 <div className="p-8 space-y-8">
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
 <span className="material-icons text-blue-600">schedule</span>
 </div>
 <div>
 <h4 className="text-xs font-bold text-muted-foreground uppercase">Bottling Time</h4>
 <p className="text-lg font-medium text-foreground">12:45 PM, OCTOBER 26, 2023</p>
 </div>
 </div>

 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
 <span className="material-icons text-blue-600">person</span>
 </div>
 <div>
 <h4 className="text-xs font-bold text-muted-foreground uppercase">Lab Technician</h4>
 <p className="text-lg font-medium text-foreground">Dr. A. Yusuf</p>
 </div>
 </div>

 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
 <span className="material-icons text-blue-600">science</span>
 </div>
 <div>
 <h4 className="text-xs font-bold text-muted-foreground uppercase">Mineral Levels (mg/L)</h4>
 <p className="text-lg font-medium text-foreground">Calcium 42, Magnesium 18, Potassium 5, Bicarbonates 150, pH 7.4</p>
 </div>
 </div>
 </div>
 
 <div className="bg-green-50 p-4 flex items-center justify-center gap-2 text-green-700 font-bold">
 <span className="material-icons">check_circle</span>
 QUALITY APPROVED
 </div>
 </div>
 </div>
 ) : (
 <div className="h-24"></div>
 )}

 {/* Lab Gallery */}
 <section className="bg-card py-24">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16">
 <h2 className="text-2xl font-bold text-foreground uppercase tracking-widest mb-2">Our Clinical Lab in Jos</h2>
 <div className="w-20 h-1 bg-primary mx-auto"></div>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {[
 { title: 'Microbiological Testing', img: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&w=400&q=80' },
 { title: 'Mineral Analysis Station', img: 'https://images.unsplash.com/photo-1581093588401-fbb0736d9138?auto=format&fit=crop&w=400&q=80' },
 { title: 'Advanced Filtration', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80' },
 { title: 'Dr. Yusuf at Work', img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80' },
 { title: 'Quality Control Check', img: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=400&q=80' },
 { title: 'The Jos Facility', img: 'https://images.unsplash.com/photo-1565514020176-db7102e34568?auto=format&fit=crop&w=400&q=80' },
 ].map((item, i) => (
 <div key={i} className="group">
 <div className="overflow-hidden rounded-lg mb-4 shadow-md">
 <img src={item.img} alt={item.title} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" />
 </div>
 <h3 className="text-center font-medium text-foreground/80">{item.title}</h3>
 </div>
 ))}
 </div>
 </div>
 </section>
 </div>
 );
};

export default Quality;