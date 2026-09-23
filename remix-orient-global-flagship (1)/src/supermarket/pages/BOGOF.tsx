import React from 'react';

interface Props {
 onNavigate: (page: any) => void;
}

const BOGOF: React.FC<Props> = ({ onNavigate }) => {
 return (
 <div className="min-h-screen bg-card p-8">
 <div className="max-w-[1600px] mx-auto">
 <button onClick={() => onNavigate('Deals')} className="mb-4 text-[#ff6a00] flex items-center gap-1 font-medium"><span className="material-icons">arrow_back</span> Back to Deals</button>
 <h1 className="text-3xl font-bold mb-6">Buy One Get One Free</h1>
 <p className="text-muted-foreground">Exclusive double deals updated hourly.</p>
 </div>
 </div>
 );
};
export default BOGOF;