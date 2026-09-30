import React from 'react';

interface Props {
 onNavigate: (page: any) => void;
}

const PreviouslyBought: React.FC<Props> = ({ onNavigate }) => {
 return (
 <div className="min-h-screen bg-card p-8">
 <div className="max-w-[1600px] mx-auto">
 <button onClick={() => onNavigate('Home')} className="mb-4 text-[#ff6a00] flex items-center gap-1 font-medium"><span className="material-icons">arrow_back</span> Back to Storefront</button>
 <h1 className="text-3xl font-bold mb-6">Previously Bought</h1>
 <div className="bg-yellow-50 p-8 rounded-xl border border-yellow-100 text-center text-foreground/80">
 No purchase history found for this session.
 </div>
 </div>
 </div>
 );
};
export default PreviouslyBought;