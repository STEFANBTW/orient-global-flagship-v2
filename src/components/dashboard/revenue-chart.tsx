
"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DIVISIONS } from "@/app/lib/mock-data";
import { cn } from "@/lib/utils";

const data = [
 { name: "Mon", bakery: 4000, dining: 2400, games: 1200, lounge: 3200, market: 5100, water: 800 },
 { name: "Tue", bakery: 3000, dining: 1398, games: 2100, lounge: 2800, market: 4800, water: 950 },
 { name: "Wed", bakery: 2000, dining: 9800, games: 2290, lounge: 3500, market: 5500, water: 1100 },
 { name: "Thu", bakery: 2780, dining: 3908, games: 2000, lounge: 3100, market: 4200, water: 1200 },
 { name: "Fri", bakery: 1890, dining: 4800, games: 2181, lounge: 4200, market: 6100, water: 1400 },
 { name: "Sat", bakery: 2390, dining: 3800, games: 2500, lounge: 5500, market: 7200, water: 1800 },
 { name: "Sun", bakery: 3490, dining: 4300, games: 2100, lounge: 4800, market: 6800, water: 1600 },
];

const divisionColors: Record<string, string> = {
 bakery: "hsl(var(--primary))", // Gold
 dining: "#10b981", // Emerald
 games: "#3b82f6", // Blue
 lounge: "#a855f7", // Purple
 market: "#06b6d4", // Cyan
 water: "#0ea5e9", // Sky
};

export function RevenueChart() {
 const [selectedDivisions, setSelectedDivisions] = useState<string[]>(["bakery", "dining"]);

 const toggleDivision = (id: string) => {
 setSelectedDivisions((prev) =>
 prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
 );
 };

 return (
 <div className="w-full h-full flex flex-col space-y-6">
 {/* Checkbox Filter UI */}
 <div className="flex flex-wrap items-center gap-6 pb-4 border-b border-transparent">
 <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Compare Nodes:</p>
 <div className="flex flex-wrap gap-4">
 {DIVISIONS.map((division) => (
 <div key={division.id} className="flex items-center space-x-2">
 <Checkbox 
 id={`filter-${division.id}`} 
 checked={selectedDivisions.includes(division.id)}
 onCheckedChange={() => toggleDivision(division.id)}
 className="border-transparent data-[state=checked]:bg-primary data-[state=checked]:border-primary"
 />
 <Label 
 htmlFor={`filter-${division.id}`}
 className={cn(
 "text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors",
 selectedDivisions.includes(division.id) ? "text-foreground" : "text-muted-foreground/60 hover:text-muted-foreground"
 )}
 >
 {division.name}
 </Label>
 </div>
 ))}
 </div>
 </div>

 <div className="flex-1 min-h-[350px]">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={data}>
 <defs>
 {Object.entries(divisionColors).map(([id, color]) => (
 <linearGradient key={`grad-${id}`} id={`color-${id}`} x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor={color} stopOpacity={0.2} />
 <stop offset="95%" stopColor={color} stopOpacity={0} />
 </linearGradient>
 ))}
 </defs>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
 <XAxis 
 dataKey="name" 
 axisLine={false} 
 tickLine={false} 
 tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
 dy={10}
 />
 <YAxis 
 axisLine={false} 
 tickLine={false} 
 tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
 tickFormatter={(value) => `₦${(value / 1000).toFixed(1)}k`}
 />
 <Tooltip 
 contentStyle={{ 
 backgroundColor: '#0f172a', 
 border: '1px solid rgba(255,255,255,0.1)', 
 borderRadius: '12px',
 padding: '12px',
 boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
 }}
 itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', padding: '2px 0' }}
 labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}
 cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
 />
 {selectedDivisions.map((id) => (
 <Area 
 key={id}
 type="monotone" 
 dataKey={id} 
 stroke={divisionColors[id]} 
 fillOpacity={1} 
 fill={`url(#color-${id})`} 
 strokeWidth={3}
 animationDuration={1500}
 activeDot={{ r: 6, fill: divisionColors[id], strokeWidth: 2, stroke: '#020617' }}
 />
 ))}
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>
 );
}
