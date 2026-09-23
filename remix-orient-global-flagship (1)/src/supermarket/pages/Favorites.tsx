import React from 'react';

interface Props {
 onNavigate: (page: any) => void;
}

const Favorites: React.FC<Props> = ({ onNavigate }) => {
 return (
 <div className="min-h-screen bg-card p-8">
 <div className="max-w-[1600px] mx-auto">
 <button onClick={() => onNavigate('Dashboard')} className="mb-4 text-[#ff6a00] flex items-center gap-1 font-medium"><span className="material-icons">arrow_back</span> Back to Dashboard</button>
 <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
 <p className="text-muted-foreground">Your most loved items.</p>
 </div>
 </div>
 );
};
export default Favorites;