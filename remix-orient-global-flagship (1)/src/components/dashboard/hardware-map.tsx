"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Monitor, Zap, Activity, AlertTriangle } from "lucide-react";
import { HardwareRig } from "@/context/role-context";

interface HardwareMapProps {
 rigs: HardwareRig[];
 onSelectRig: (rig: HardwareRig) => void;
 selectedRigId?: string;
}

export function HardwareMap({ rigs, onSelectRig, selectedRigId }: HardwareMapProps) {
 return (
 <div className="relative w-full aspect-square md:aspect-video bg-background rounded-2xl overflow-hidden p-12 border border-transparent shadow-2xl">
 {/* Animated Grid Background */}
 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #8A4DE6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

 {/* Map Content */}
 <div className="relative h-full grid grid-cols-4 md:grid-cols-6 gap-6 items-center justify-center">
 {rigs.map((rig, i) => (
 <motion.div
 key={rig.id}
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.05 }}
 whileHover={{ scale: 1.05 }}
 onClick={() => onSelectRig(rig)}
 className={`
 relative aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300
 ${selectedRigId === rig.id 
 ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20' 
 : 'bg-card/80 border-transparent hover:border-transparent'
 }
 `}
 >
 {/* Rig Visualizer */}
 <div className={`
 w-12 h-12 rounded-xl flex items-center justify-center transition-colors
 ${rig.status === 'maintenance' ? 'bg-red-500/10 text-red-500' : 
 rig.status === 'occupied' ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'}
 `}>
 <Monitor className="w-6 h-6" />
 </div>

 <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{rig.id}</span>
 
 {/* Tooltip-like label */}
 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
 <Badge className="whitespace-nowrap bg-card border-transparent text-[8px] font-bold uppercase tracking-widest">
 {rig.type} • {rig.health}%
 </Badge>
 </div>
 </motion.div>
 ))}

 {/* Legend */}
 <div className="absolute bottom-6 left-6 flex gap-6 p-4 bg-card/50 backdrop-blur-md rounded-xl border border-transparent">
 <div className="flex items-center gap-2">
 <span className="text-[8px] font-bold text-muted-foreground/70 uppercase tracking-widest">Available</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-[8px] font-bold text-muted-foreground/70 uppercase tracking-widest">Occupied</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-[8px] font-bold text-muted-foreground/70 uppercase tracking-widest">Maintenance</span>
 </div>
 </div>
 </div>
 </div>
 );
}
