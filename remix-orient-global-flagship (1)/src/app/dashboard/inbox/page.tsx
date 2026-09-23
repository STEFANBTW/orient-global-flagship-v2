'use client';

import { useRoles } from "@/context/role-context";
import { ApprovalInbox } from "@/components/dashboard/approval-inbox";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Inbox, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function InboxPage() {
 const { currentUser, requests } = useRoles();

 if (!currentUser) return null;

 const isBoss = currentUser.role === 'boss';
 
 const pendingCount = requests.filter(r => {
 if (currentUser.role === 'boss') return r.targetRoleId === 'boss' && r.status === 'pending';
 if (currentUser.role === 'hod') return r.targetRoleId === 'hod' && r.division === currentUser.division && r.status === 'pending';
 return false;
 }).length;

 return (
 <div className="space-y-10 max-w-[1200px] mx-auto pb-20">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-transparent pb-10"
 >
 <div className="space-y-3">
 <div className="flex items-center gap-3">
 <div className="bg-primary/20 p-2 rounded-lg">
 <Inbox className="w-5 h-5 text-primary" />
 </div>
 <Badge className="bg-primary/10 border-primary/20 text-primary text-[9px] font-bold tracking-[0.2em] px-3 italic">
 AUTHORITY INBOX
 </Badge>
 </div>
 <h1 className="text-6xl font-bold text-foreground tracking-tighter uppercase font-headline italic">
 Proposals
 </h1>
 <p className="text-muted-foreground font-medium italic">
 Awaiting executive clearance for <span className="text-primary font-bold not-italic underline decoration-primary/30">
 {isBoss ? "Global Operations" : `${currentUser.division} Node`}
 </span>
 </p>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="text-right">
 <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.2em]">Awaiting Review</p>
 <p className="text-4xl font-bold text-foreground font-code">{pendingCount}</p>
 </div>
 </div>
 </motion.div>

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
 <div className="lg:col-span-3">
 <ApprovalInbox />
 </div>

 <div className="space-y-8">
 <Card className="bg-card border-transparent p-8 shadow-sm">
 <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70 mb-8 font-code flex items-center gap-2">
 <ShieldAlert className="w-3 h-3" /> Audit Rules
 </h3>
 <ul className="space-y-6">
 {[
 "All declines require a valid reason.",
 "Authorized actions are permanent.",
 "Security logs capture all reviews.",
 "Tier 01 overrides all pending."
 ].map((rule, idx) => (
 <li key={idx} className="flex gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
 <span className="text-primary">0{idx + 1}</span>
 {rule}
 </li>
 ))}
 </ul>
 </Card>

 <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center gap-4">
 <Clock className="w-8 h-8 text-primary/40" />
 <p className="text-[10px] font-bold text-foreground uppercase tracking-widest leading-relaxed">
 Avg. Review Time: <span className="text-primary">12.4m</span>
 </p>
 </div>
 </div>
 </div>
 </div>
 );
}
