
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, ArrowRightLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

export interface Proposal {
 id: string;
 type: 'Price' | 'Media' | 'Metadata' | 'Promo';
 item: string;
 oldValue: string;
 newValue: string;
 staff: string;
 timestamp: string;
 division: string;
}

interface ApprovalQueueProps {
 proposals: Proposal[];
 onApprove: (id: string) => void;
 onDecline: (id: string, reason: string) => void;
}

export function ApprovalQueue({ proposals, onApprove, onDecline }: ApprovalQueueProps) {
 const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
 const [declineReason, setDeclineReason] = useState("");

 return (
 <div className="space-y-4">
 <AnimatePresence>
 {proposals.map((prop) => (
 <motion.div
 key={prop.id}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="group relative bg-card/40 backdrop-blur-xl border border-transparent rounded-xl p-4 hover:border-primary/20 transition-all"
 >
 <div className="flex items-center justify-between gap-4">
 <div className="flex-1 space-y-1">
 <div className="flex items-center gap-2">
 <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-primary/20 text-primary">
 {prop.type}
 </Badge>
 <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
 {prop.timestamp}
 </span>
 </div>
 <h4 className="text-sm font-bold text-foreground">{prop.item}</h4>
 <div className="flex items-center gap-3 mt-2">
 <span className="text-xs text-muted-foreground line-through decoration-destructive/50">{prop.oldValue}</span>
 <ArrowRightLeft className="w-3 h-3 text-primary" />
 <span className="text-xs text-success font-bold">{prop.newValue}</span>
 </div>
 </div>
 
 <div className="flex items-center gap-2">
 <Button 
 size="sm" 
 variant="ghost" 
 className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
 onClick={() => setSelectedProposal(prop)}
 >
 <X className="w-4 h-4" />
 </Button>
 <Button 
 size="sm" 
 className="h-8 bg-primary text-primary-foreground font-bold text-[10px] uppercase px-4"
 onClick={() => onApprove(prop.id)}
 >
 <Check className="w-3.5 h-3.5 mr-1" /> Approve
 </Button>
 </div>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>

 <Dialog open={!!selectedProposal} onOpenChange={(open) => !open && setSelectedProposal(null)}>
 <DialogContent className="bg-background border-transparent text-foreground">
 <DialogTitle className="text-xl font-bold tracking-tighter">Decline Proposal</DialogTitle>
 <div className="space-y-4 py-4">
 <p className="text-sm text-muted-foreground italic">
 Providing a reason helps {selectedProposal?.staff} understand the refusal and improve future drafts.
 </p>
 <Textarea 
 placeholder="Reason for declination (Mandatory)..."
 value={declineReason}
 onChange={(e) => setDeclineReason(e.target.value)}
 className="bg-card border-transparent min-h-[120px] focus:ring-primary"
 />
 </div>
 <DialogFooter>
 <Button variant="ghost" onClick={() => setSelectedProposal(null)}>Cancel</Button>
 <Button 
 className="bg-destructive hover:bg-destructive/90 text-foreground font-bold"
 disabled={!declineReason}
 onClick={() => {
 if (selectedProposal) onDecline(selectedProposal.id, declineReason);
 setSelectedProposal(null);
 setDeclineReason("");
 }}
 >
 Confirm Decline
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
 );
}
