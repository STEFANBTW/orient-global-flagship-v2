'use client';

import React from 'react';
import { useRoles } from '@/context/role-context';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RequestStatusTable() {
 const { currentUser, requests } = useRoles();

 if (!currentUser) return null;

 const myRequests = requests.filter(req => req.requesterId === currentUser.id);

 return (
 <div className="bg-card rounded-xl border border-transparent overflow-hidden shadow-sm">
 <Table>
 <TableHeader className="bg-muted/50">
 <TableRow className="border-transparent">
 <TableHead className="text-[10px] font-bold uppercase tracking-widest text-primary">Proposal</TableHead>
 <TableHead className="text-[10px] font-bold uppercase tracking-widest text-primary">Authority</TableHead>
 <TableHead className="text-[10px] font-bold uppercase tracking-widest text-primary">Status</TableHead>
 <TableHead className="text-[10px] font-bold uppercase tracking-widest text-primary text-right">Feedback</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {myRequests.length > 0 ? (
 myRequests.map((req) => (
 <TableRow key={req.id} className="border-transparent hover:bg-muted/50/50 transition-colors">
 <TableCell>
 <div className="flex flex-col">
 <span className="text-sm font-bold text-foreground">{req.actionLabel}</span>
 <span className="text-[10px] text-muted-foreground/70 italic truncate max-w-[200px]">{req.description}</span>
 </div>
 </TableCell>
 <TableCell>
 <Badge variant="outline" className="text-[8px] tracking-tighter uppercase bg-secondary border-none text-muted-foreground">
 {req.targetRoleId.replace('admin_', '')}
 </Badge>
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-2">
 {req.status === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
 {req.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
 {req.status === 'declined' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
 <span className={cn(
 "text-[10px] font-bold uppercase tracking-widest",
 req.status === 'pending' ? 'text-amber-500' :
 req.status === 'approved' ? 'text-emerald-500' : 'text-red-500'
 )}>
 {req.status}
 </span>
 </div>
 </TableCell>
 <TableCell className="text-right">
 {req.declineReason ? (
 <div className="flex items-center justify-end gap-2 text-red-500">
 <MessageCircle className="w-3.5 h-3.5" />
 <span className="text-[10px] italic font-medium">{req.declineReason}</span>
 </div>
 ) : req.status === 'approved' ? (
 <span className="text-[10px] text-emerald-500 italic">Implemented globally</span>
 ) : (
 <span className="text-[10px] text-muted-foreground/70 italic">Awaiting review...</span>
 )}
 </TableCell>
 </TableRow>
 ))
 ) : (
 <TableRow>
 <TableCell colSpan={4} className="h-24 text-center text-muted-foreground/70 text-[10px] uppercase tracking-widest">
 You have not drafted any node proposals yet.
 </TableCell>
 </TableRow>
 )}
 </TableBody>
 </Table>
 </div>
 );
}
