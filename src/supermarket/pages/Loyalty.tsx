import React from 'react';

interface Props {
 onNavigate: (page: any) => void;
}

const Loyalty: React.FC<Props> = ({ onNavigate }) => {
 return (
 <div className="min-h-screen bg-card p-8">
 <div className="max-w-[1600px] mx-auto">
 <button onClick={() => onNavigate('Dashboard')} className="mb-4 text-[#ff6a00] flex items-center gap-1 font-medium"><span className="material-icons">arrow_back</span> Back to Dashboard</button>
 <h1 className="text-3xl font-bold mb-6">Loyalty Program</h1>
 <div className="bg-gradient-to-r from-yellow-400 to-[#ff6a00] p-8 rounded-xl text-background shadow-lg mb-8">
 <h2 className="text-2xl font-bold">Gold Tier</h2>
 <p className="opacity-90">2,450 Points Balance</p>
 </div>
 </div>
 </div>
 );
};
export default Loyalty;