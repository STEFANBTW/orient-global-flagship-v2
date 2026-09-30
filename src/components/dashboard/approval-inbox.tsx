'use client';

import React, { useState } from 'react';
import { useRoles, type ApprovalRequest } from '@/context/role-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRightLeft, MessageSquare, Clock, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function ApprovalInbox() {
 const { currentUser, requests, updateRequestStatus } = useRoles();
 const { toast } = useToast();
 const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
 const [reason, setReason] = useState("");

 if (!currentUser) return null;

 const filteredRequests = requests.filter(req => {
 if (currentUser.role === 'boss') return req.targetRoleId === 'boss' && req.status === 'pending';
 if (currentUser.role === 'hod') return req.targetRoleId === 'hod' && req.division === currentUser.division && req.status === 'pending';
 return false;
 });

 const handleDeclineClick = (req: ApprovalRequest) => {
 setSelectedRequest(req);
 setReason("");
 };

 const confirmDecline = async () => {
 if (selectedRequest) {
 await updateRequestStatus(selectedRequest.id, 'declined', reason);
 toast({ title: "Request Declined", description: "The request has been declined and the user notified." });
 setSelectedRequest(null);
 }
 };

 const handleApprove = async (id: string) => {
 await updateRequestStatus(id, 'approved');
 toast({ title: "Request Approved", description: "The request has been approved and changes applied." });
 };

 return (
 <div className="space-y-4">
 <AnimatePresence mode="popLayout">
 {filteredRequests.length > 0 ? (
 filteredRequests.map((req) => (
 <motion.div
 key={req.id}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="group bg-card border border-transparent rounded-xl p-5 hover:border-primary/40 transition-all shadow-sm"
 >
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="flex-1 space-y-3">
 <div className="flex items-center gap-3">
 <Badge className="bg-primary/20 text-primary border-none text-[8px] uppercase tracking-widest font-bold">
 {req.division}
 </Badge>
 <span className="text-[10px] text-muted-foreground/70 uppercase font-bold flex items-center gap-1">
 <Clock className="w-3 h-3" /> Just now
 </span>
 </div>
 
 <div>
 <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
 <User className="w-3.5 h-3.5 text-muted-foreground/70" />
 {req.requesterName} proposes: {req.actionLabel}
 </h4>
 <p className="text-xs text-muted-foreground mt-1 italic">{req.description}</p>
 </div>

 {req.oldValue && req.newValue && (
 <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg border border-transparent">
 <div className="flex flex-col">
 <span className="text-[8px] uppercase text-muted-foreground/70 font-bold">Current</span>
 <span className="text-xs text-muted-foreground line-through">{req.oldValue}</span>
 </div>
 <ArrowRightLeft className="w-3 h-3 text-primary" />
 <div className="flex flex-col">
 <span className="text-[8px] uppercase text-primary font-bold">Proposed</span>
 <span className="text-xs text-success font-bold">{req.newValue}</span>
 </div>
 </div>
 )}
 </div>

 <div className="flex items-center gap-3 shrink-0">
 <Button 
 variant="ghost" 
 size="sm" 
 onClick={() => handleDeclineClick(req)}
 className="h-9 px-4 text-destructive hover:bg-destructive/10 font-bold text-[10px] uppercase tracking-widest"
 >
 <X className="w-3.5 h-3.5 mr-2" /> Decline
 </Button>
 <Button 
 size="sm" 
 onClick={() => handleApprove(req.id)}
 className="h-9 px-6 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest"
 >
 <Check className="w-3.5 h-3.5 mr-2" /> Authorize
 </Button>
 </div>
 </div>
 </motion.div>
 ))
 ) : (
 <div className="p-12 text-center bg-muted/50 border border-transparent border-dashed rounded-2xl">
 <Check className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
 <h5 className="text-sm font-bold text-foreground uppercase tracking-widest">Inbox Zero</h5>
 <p className="text-xs text-muted-foreground/70 mt-2">No pending proposals require your clearance.</p>
 </div>
 )}
 </AnimatePresence>

 <Dialog open={!!selectedRequest} onOpenChange={(o) => !o && setSelectedRequest(null)}>
 <DialogContent className="bg-card border-transparent text-foreground max-w-md">
 <DialogTitle className="text-xl font-bold tracking-tighter flex items-center gap-2">
 <MessageSquare className="w-5 h-5 text-destructive" />
 Required Feedback
 </DialogTitle>
 <div className="py-6 space-y-4">
 <p className="text-sm text-muted-foreground">
 Per corporate governance, all declined proposals must include an actionable reason for the requester.
 </p>
 <Textarea 
 placeholder="e.g., Budget constraints for Q3, or incorrect margin calculation..."
 value={reason}
 onChange={(e) => setReason(e.target.value)}
 className="bg-muted/50 border-transparent min-h-[120px] focus:ring-primary text-foreground"
 />
 </div>
 <DialogFooter>
 <Button variant="ghost" onClick={() => setSelectedRequest(null)}>Cancel</Button>
 <Button 
 disabled={!reason.trim()}
 onClick={confirmDecline}
 className="bg-destructive hover:bg-destructive/90 text-foreground font-bold"
 >
 Confirm Refusal
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
 );
}
