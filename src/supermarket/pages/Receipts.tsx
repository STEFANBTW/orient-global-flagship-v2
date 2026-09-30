import React from 'react';

interface Props {
 onNavigate: (page: any) => void;
}

const Receipts: React.FC<Props> = ({ onNavigate }) => {
 return (
 <div className="min-h-screen bg-card p-8">
 <div className="max-w-[1600px] mx-auto">
 <button onClick={() => onNavigate('Dashboard')} className="mb-4 text-[#ff6a00] flex items-center gap-1 font-medium"><span className="material-icons">arrow_back</span> Back to Dashboard</button>
 <h1 className="text-3xl font-bold mb-6">Purchase History</h1>
 <div className="space-y-4">
 {[1,2,3].map(i => (
 <div key={i} className="border border-border p-4 rounded-lg flex justify-between items-center">
 <div>
 <p className="font-bold">Order #{4000+i}</p>
 <p className="text-sm text-muted-foreground">Placed on Oct {10+i}, 2023</p>
 </div>
 <button className="text-[#ff6a00] font-medium text-sm">View Details</button>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};
export default Receipts;