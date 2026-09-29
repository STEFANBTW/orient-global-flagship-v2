import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---

export type GlobalContent = {
 homepage: {
 heroTitle: string;
 heroSubtitle: string;
 announcement: {
 active: boolean;
 text: string;
 };
 };
 about: {
 mission: string;
 story: string;
 values: string[];
 };
 contact: {
 email: string;
 phone: string;
 address: string;
 social: {
 twitter: string;
 instagram: string;
 linkedin: string;
 };
 };
};

export type DivisionContent = {
 heroTitle: string;
 description: string;
 heroImageUrl: string;
 specials: Array<{ id: string; title: string; price: string; description: string; imageUrl: string }>;
 hours: string;
 announcement: string;
 staff: Array<{ id: string; name: string; role: string; imageUrl: string }>;
};

export type CMSState = {
 global: GlobalContent;
 divisions: {
 bakery: DivisionContent;
 dining: DivisionContent;
 games: DivisionContent;
 lounge: DivisionContent;
 market: DivisionContent;
 water: DivisionContent;
 };
};

export type CMSRequest = {
 id: string;
 division: keyof CMSState['divisions'];
 content: DivisionContent;
 author: {
 id: string;
 name: string;
 role: string;
 };
 timestamp: string;
 status: 'pending' | 'approved' | 'rejected';
};

// --- Initial State ---

const initialGlobalContent: GlobalContent = {
 homepage: {
 heroTitle: "Welcome to Orient",
 heroSubtitle: "Experience the pinnacle of luxury and service.",
 announcement: {
 active: true,
 text: "Grand Opening Special: 20% off all services this week!",
 },
 },
 about: {
 mission: "To redefine luxury and service in every interaction.",
 story: "Founded in 2024, Orient has grown from a humble bakery to a multi-faceted lifestyle brand.",
 values: ["Excellence", "Integrity", "Innovation"],
 },
 contact: {
 email: "contact@orient.com",
 phone: "+234 800 ORIENT",
 address: "123 Luxury Lane, Victoria Island, Lagos",
 social: {
 twitter: "@orient_ng",
 instagram: "@orient_ng",
 linkedin: "Orient Group",
 },
 },
};

const initialDivisionContent: DivisionContent = {
 heroTitle: "Division Overview",
 description: "Discover our premium offerings.",
 heroImageUrl: "https://picsum.photos/seed/orient/1200/600",
 specials: [],
 hours: "9:00 AM - 9:00 PM",
 announcement: "",
 staff: [],
};

const initialState: CMSState = {
 global: initialGlobalContent,
 divisions: {
 bakery: { ...initialDivisionContent, heroTitle: "Artisan Bakery", description: "Freshly baked goods daily." },
 dining: { ...initialDivisionContent, heroTitle: "Fine Dining", description: "Culinary excellence." },
 games: { ...initialDivisionContent, heroTitle: "Gaming Arena", description: "Immersive entertainment." },
 lounge: { ...initialDivisionContent, heroTitle: "Executive Lounge", description: "Relax in style." },
 market: { ...initialDivisionContent, heroTitle: "Global Market", description: "Curated goods from around the world." },
 water: { ...initialDivisionContent, heroTitle: "Pure Water", description: "Hydration redefined." },
 },
};

// --- Context ---

type CMSContextType = {
 state: CMSState;
 requests: CMSRequest[];
 updateGlobal: (section: keyof GlobalContent, data: Partial<GlobalContent[keyof GlobalContent]>) => void;
 updateDivision: (division: keyof CMSState['divisions'], data: Partial<DivisionContent>) => void;
 submitRequest: (division: keyof CMSState['divisions'], content: DivisionContent, author: CMSRequest['author']) => void;
 approveRequest: (requestId: string) => void;
 rejectRequest: (requestId: string) => void;
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
 const [state, setState] = useState<CMSState>(() => {
 if (typeof window !== 'undefined') {
 const saved = localStorage.getItem('orient_cms_state');
 if (saved) {
 try {
 return JSON.parse(saved);
 } catch (e) {
 console.error("Failed to parse CMS state", e);
 }
 }
 }
 return initialState;
 });

 const [requests, setRequests] = useState<CMSRequest[]>(() => {
 if (typeof window !== 'undefined') {
 const saved = localStorage.getItem('orient_cms_requests');
 if (saved) {
 try {
 return JSON.parse(saved);
 } catch (e) {
 console.error("Failed to parse CMS requests", e);
 }
 }
 }
 return [];
 });

 useEffect(() => {
 localStorage.setItem('orient_cms_state', JSON.stringify(state));
 }, [state]);

 useEffect(() => {
 localStorage.setItem('orient_cms_requests', JSON.stringify(requests));
 }, [requests]);

 const updateGlobal = (section: keyof GlobalContent, data: any) => {
 setState(prev => ({
 ...prev,
 global: {
 ...prev.global,
 [section]: { ...prev.global[section], ...data }
 }
 }));
 };

 const updateDivision = (division: keyof CMSState['divisions'], data: Partial<DivisionContent>) => {
 setState(prev => ({
 ...prev,
 divisions: {
 ...prev.divisions,
 [division]: { ...prev.divisions[division], ...data }
 }
 }));
 };

 const submitRequest = (division: keyof CMSState['divisions'], content: DivisionContent, author: CMSRequest['author']) => {
 const newRequest: CMSRequest = {
 id: `REQ-${Date.now()}`,
 division,
 content,
 author,
 timestamp: new Date().toISOString(),
 status: 'pending'
 };
 setRequests(prev => [newRequest, ...prev]);
 };

 const approveRequest = (requestId: string) => {
 const request = requests.find(r => r.id === requestId);
 if (request) {
 updateDivision(request.division, request.content);
 setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
 }
 };

 const rejectRequest = (requestId: string) => {
 setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
 };

 return (
 <CMSContext.Provider value={{ state, requests, updateGlobal, updateDivision, submitRequest, approveRequest, rejectRequest }}>
 {children}
 </CMSContext.Provider>
 );
}

export function useCMS() {
 const context = useContext(CMSContext);
 if (context === undefined) {
 throw new Error('useCMS must be used within a CMSProvider');
 }
 return context;
}
