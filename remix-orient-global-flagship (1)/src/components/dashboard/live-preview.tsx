"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
 Zap, 
 CheckCircle2, 
 XCircle, 
 Trophy, 
 ShieldAlert,
 Layers,
 GlassWater,
 Droplets,
 Tag
} from "lucide-react";

interface LivePreviewProps {
 item: any;
 division: 'dining' | 'games' | 'bakery' | 'market' | 'lounge' | 'water';
 isHOD: boolean;
 onApprove?: () => void;
 onReject?: () => void;
}

export function LivePreview({ item, division, isHOD, onApprove, onReject }: LivePreviewProps) {
 if (!item) return null;

 return (
 <div className="h-full flex flex-col bg-card">
 {/* Visual Header */}
 <div className="aspect-video bg-card relative overflow-hidden">
 {item.imageUrl || item.visualizerSettings?.backgroundVideoUrl ? (
 division === 'lounge' && item.visualizerSettings ? (
 <video 
 autoPlay loop muted playsInline
 className="absolute inset-0 w-full h-full object-cover opacity-40"
 >
 <source src={item.visualizerSettings.backgroundVideoUrl} type="video/mp4" />
 </video>
 ) : (
 <img src={item.imageUrl} className="object-cover w-full h-full opacity-60" alt="Preview" />
 )
 ) : (
 <div className="absolute inset-0 flex items-center justify-center">
 <Layers className="w-12 h-12 text-muted-foreground/50" />
 </div>
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
 <div className="absolute bottom-4 left-6 right-6">
 <Badge className="bg-primary text-primary-foreground text-[8px] uppercase tracking-[0.2em] mb-2 font-bold border-none">
 {item.status?.toUpperCase() || 'STAGED'}
 </Badge>
 <h4 className="text-xl md:text-2xl font-bold text-foreground tracking-tighter italic font-headline truncate">
 {item.name || item.title || item.sku}
 </h4>
 </div>
 </div>

 <ScrollArea className="flex-1 p-4 md:p-6">
 <div className="space-y-6">
 {division === 'lounge' && (
 <div className="space-y-4">
 <div className="p-4 rounded-xl border border-transparent bg-muted/50">
 <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-1">Theme</p>
 <div className="flex items-center gap-4">
 <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.visualizerSettings?.themeColor }} />
 <span className="text-xs font-bold text-foreground uppercase">{item.visualizerSettings?.animationSpeed}</span>
 </div>
 </div>
 <p className="text-xs text-muted-foreground leading-relaxed italic">"{item.teaserText || item.description}"</p>
 </div>
 )}

 {division === 'market' && (
 <div className="space-y-4">
 <div className="flex justify-between items-center border-b pb-4">
 <span className="text-sm font-bold text-foreground">Price</span>
 <span className="text-lg font-code font-bold text-primary">₦{item.price?.toLocaleString()}</span>
 </div>
 <div className="grid grid-cols-2 gap-2">
 <Badge variant="outline" className="justify-center py-2 text-[10px]">{item.isBOGOF ? 'BOGOF' : 'Standard'}</Badge>
 <Badge variant="outline" className="justify-center py-2 text-[10px]">{item.isUnder5 ? 'Under ₦5' : 'Normal'}</Badge>
 </div>
 </div>
 )}

 {division === 'water' && (
 <div className="space-y-4">
 <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl">
 <div className="flex items-center gap-3 mb-2">
 <Droplets className="w-4 h-4 text-sky-500" />
 <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Purity Check</p>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-[8px] text-muted-foreground/70 uppercase">pH</p>
 <p className="text-lg md:text-xl font-bold font-code">{item.ph}</p>
 </div>
 <div>
 <p className="text-[8px] text-muted-foreground/70 uppercase">TDS</p>
 <p className="text-lg md:text-xl font-bold font-code">{item.tds}</p>
 </div>
 </div>
 </div>
 </div>
 )}

 <div className="p-4 bg-muted/50 border border-transparent rounded-xl flex gap-3">
 <ShieldAlert className="w-4 h-4 text-muted-foreground/70 shrink-0" />
 <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed italic">
 Warning: Modifying these fields updates the Global Orient Site.
 </p>
 </div>
 </div>
 </ScrollArea>

 {isHOD && (
 <div className="p-4 md:p-6 border-t border-transparent bg-card flex flex-col xs:flex-row items-center gap-3 sticky bottom-0 z-10">
 <Button 
 variant="ghost" 
 className="w-full xs:flex-1 text-red-500 hover:bg-red-50 font-bold uppercase tracking-widest text-[10px] h-11"
 onClick={onReject}
 >
 <XCircle className="w-4 h-4 mr-2" /> Decline
 </Button>
 <Button 
 className="w-full xs:flex-1 bg-primary text-foreground font-bold uppercase tracking-widest text-[10px] h-11 shadow-lg shadow-primary/20"
 onClick={onApprove}
 >
 <CheckCircle2 className="w-4 h-4 mr-2" /> Publish
 </Button>
 </div>
 )}
 </div>
 );
}
