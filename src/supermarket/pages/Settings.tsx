import React from 'react';

interface Props {
 onNavigate: (page: any) => void;
}

const Settings: React.FC<Props> = ({ onNavigate }) => {
 return (
 <div className="min-h-screen bg-card p-8">
 <div className="max-w-[1600px] mx-auto">
 <button onClick={() => onNavigate('Dashboard')} className="mb-4 text-[#ff6a00] flex items-center gap-1 font-medium"><span className="material-icons">arrow_back</span> Back to Dashboard</button>
 <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
 <div className="space-y-4 max-w-md">
 <div className="flex justify-between items-center border-b pb-4">
 <span>Email Notifications</span>
 <div className="w-10 h-6 bg-[#ff6a00] rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-card rounded-full absolute right-1 top-1"></div></div>
 </div>
 <div className="flex justify-between items-center border-b pb-4">
 <span>Two-Factor Auth</span>
 <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-card rounded-full absolute left-1 top-1"></div></div>
 </div>
 </div>
 </div>
 </div>
 );
};
export default Settings;