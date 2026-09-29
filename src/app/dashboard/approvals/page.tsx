"use client";

import { useMemo, useState, useEffect } from "react";
import { useRoles } from "@/context/role-context";
import { useCMS, CMSRequest } from "@/context/cms-context";
import { db } from "@/firebase";
import { doc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock, User, UserPlus, FileText, ArrowRight, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const fadeInUp = {
 initial: { opacity: 0, y: 40 },
 whileInView: { opacity: 1, y: 0 },
 viewport: { once: true, margin: "-50px" },
 transition: { duration: 1.2 }
};

export default function ApprovalsPage() {
 const { currentUser, requests: roleRequests, updateRequestStatus } = useRoles();
 const { requests: cmsRequests, approveRequest: approveCMS, rejectRequest: rejectCMS } = useCMS();

 const role = currentUser?.role;
 const division = currentUser?.division;

 const isBoss = role === 'boss';
 
 const [enrollmentRequests, setEnrollmentRequests] = useState<any[]>([]);

 useEffect(() => {
 if (!db || !isBoss) return;
 const q = query(collection(db, 'enrollmentRequests'), where('status', '==', 'pending'));
 const unsubscribe = onSnapshot(q, (snapshot) => {
 setEnrollmentRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
 });
 return () => unsubscribe();
 }, [isBoss]);

 const handleApproveEnrollment = async (reqId: string, uid: string) => {
 if (!db) return;
 updateDoc(doc(db, "enrollmentRequests", reqId), { status: "approved" });
 updateDoc(doc(db, "users", uid), { status: "active" });
 toast({ title: "Access Granted", description: "User has been activated." });
 };

 const handleDeclineEnrollment = async (reqId: string, uid: string) => {
 if (!db) return;
 updateDoc(doc(db, "enrollmentRequests", reqId), { status: "rejected" });
 updateDoc(doc(db, "users", uid), { status: "rejected" });
 toast({ title: "Access Denied", description: "Enrollment request rejected." });
 };

 const handleApproveCMS = (id: string) => {
 approveCMS(id);
 toast({ title: "Changes Published", description: "Content update approved and live." });
 };

 const handleRejectCMS = (id: string) => {
 rejectCMS(id);
 toast({ title: "Request Rejected", description: "Content update declined." });
 };

 const handleApproveRoleRequest = (id: string) => {
 updateRequestStatus(id, 'approved');
 toast({ title: "Action Authorized", description: "Operational request approved." });
 };

 const handleRejectRoleRequest = (id: string) => {
 updateRequestStatus(id, 'declined');
 toast({ title: "Action Declined", description: "Operational request rejected." });
 };

 // Filter and normalize CMS requests
 const pendingCMS = cmsRequests
 .filter(req => req.status === 'pending' && (isBoss || req.division === division))
 .map(req => ({
 id: req.id,
 type: 'cms',
 requesterName: req.author.name,
 requesterRole: req.author.role,
 division: req.division,
 actionLabel: 'Content Update',
 timestamp: req.timestamp,
 original: req
 }));

 // Filter and normalize Role requests
 const pendingRole = roleRequests
 .filter(req => req.status === 'pending' && (isBoss || req.division === division))
 .map(req => ({
 id: req.id,
 type: 'role',
 requesterName: req.requesterName,
 requesterRole: 'staff', // Assuming mostly staff makes requests
 division: req.division,
 actionLabel: req.actionLabel,
 timestamp: req.timestamp,
 original: req
 }));

 const allPending = [...pendingCMS, ...pendingRole].sort((a, b) => 
 new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
 );

 return (
 <div className="space-y-6 max-w-[1200px] mx-auto">
 <motion.div {...fadeInUp} className="flex flex-col gap-2">
 <h1 className="text-4xl font-bold text-foreground tracking-tighter">Approval Center</h1>
 <p className="text-muted-foreground font-medium italic">
 {isBoss ? "Reviewing global policy changes and staff enrollment." : `Reviewing Staff requests for ${division} operations.`}
 </p>
 </motion.div>

 <Tabs defaultValue="operational" className="w-full">
 <TabsList className="bg-secondary border border-transparent p-1 h-12 mb-6">
 <TabsTrigger value="operational" className="data-[state=active]:bg-primary data-[state=active]:text-foreground font-bold text-[14px] uppercase tracking-widest px-8">
 <Clock className="w-3.5 h-3.5 mr-2" /> Operational Queue
 {allPending.length > 0 && (
 <Badge className="ml-2 bg-red-500 text-foreground border-none h-5 w-5 p-0 flex items-center justify-center rounded-full">
 {allPending.length}
 </Badge>
 )}
 </TabsTrigger>
 {isBoss && (
 <TabsTrigger value="enrollment" className="data-[state=active]:bg-primary data-[state=active]:text-foreground font-bold text-[14px] uppercase tracking-widest px-8">
 <UserPlus className="w-3.5 h-3.5 mr-2" /> Enrollment Requests
 </TabsTrigger>
 )}
 </TabsList>

 <TabsContent value="operational">
 {allPending.length > 0 ? (
 <Card className="bg-card border-transparent overflow-hidden shadow-sm">
 <Table>
 <TableHeader className="bg-muted/50">
 <TableRow className="border-transparent">
 <TableHead className="text-[14px] font-bold uppercase tracking-widest text-primary">Requester</TableHead>
 <TableHead className="text-[14px] font-bold uppercase tracking-widest text-primary">Division</TableHead>
 <TableHead className="text-[14px] font-bold uppercase tracking-widest text-primary">Request</TableHead>
 <TableHead className="text-[14px] font-bold uppercase tracking-widest text-primary">Submitted</TableHead>
 <TableHead className="text-[14px] font-bold uppercase tracking-widest text-primary text-right">Action</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {allPending.map((req) => (
 <TableRow key={req.id} className="border-transparent hover:bg-muted/50/50">
 <TableCell>
 <div className="flex items-center gap-2">
 <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/70">
 <User className="w-4 h-4" />
 </div>
 <div className="flex flex-col">
 <span className="text-sm font-bold text-foreground">{req.requesterName}</span>
 <span className="text-[14px] text-muted-foreground/70 capitalize">{req.requesterRole.replace('admin_', '')}</span>
 </div>
 </div>
 </TableCell>
 <TableCell>
 <Badge variant="outline" className="text-[14px] uppercase border-transparent text-muted-foreground bg-muted/50">
 {req.division}
 </Badge>
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
 {req.type === 'cms' ? (
 <FileText className="w-3.5 h-3.5 text-muted-foreground/70" />
 ) : (
 <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground/70" />
 )}
 {req.actionLabel}
 </div>
 </TableCell>
 <TableCell className="text-xs text-muted-foreground">
 {format(new Date(req.timestamp), 'MMM d, HH:mm')}
 </TableCell>
 <TableCell className="text-right">
 <div className="flex items-center justify-end gap-2">
 <Button 
 variant="ghost" 
 size="sm" 
 onClick={() => req.type === 'cms' ? handleRejectCMS(req.id) : handleRejectRoleRequest(req.id)}
 className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
 >
 <X className="w-4 h-4" />
 </Button>
 <Button 
 size="sm" 
 onClick={() => req.type === 'cms' ? handleApproveCMS(req.id) : handleApproveRoleRequest(req.id)}
 className="h-8 bg-emerald-600 hover:bg-emerald-700 text-foreground font-bold text-[14px] uppercase px-4"
 >
 <Check className="w-3.5 h-3.5 mr-2" /> Approve
 </Button>
 </div>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </Card>
 ) : (
 <Card className="bg-card border-transparent p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
 <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center border border-transparent">
 <Check className="h-6 w-6 text-emerald-500" />
 </div>
 <div>
 <h3 className="text-lg font-bold text-foreground">Queue Clear</h3>
 <p className="text-sm text-muted-foreground">No pending operational requests require your authorization.</p>
 </div>
 </Card>
 )}
 </TabsContent>

 {isBoss && (
 <TabsContent value="enrollment">
 <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
 {enrollmentRequests && enrollmentRequests.length > 0 ? (
 <Card className="bg-card border-transparent overflow-hidden shadow-sm">
 <Table>
 <TableHeader className="bg-muted/50">
 <TableRow className="border-transparent">
 <TableHead className="text-[14px] font-bold uppercase tracking-widest text-primary">Applicant</TableHead>
 <TableHead className="text-[14px] font-bold uppercase tracking-widest text-primary">Requested Division</TableHead>
 <TableHead className="text-[14px] font-bold uppercase tracking-widest text-primary">Submitted</TableHead>
 <TableHead className="text-[14px] font-bold uppercase tracking-widest text-primary text-right">Clearance</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {enrollmentRequests.map((req: any) => (
 <TableRow key={req.id} className="border-transparent hover:bg-muted/50/50">
 <TableCell>
 <div className="flex items-center gap-2">
 <User className="w-3.5 h-3.5 text-muted-foreground/70" />
 <div className="flex flex-col">
 <span className="text-sm font-bold text-foreground">{req.name}</span>
 <span className="text-[14px] text-muted-foreground/70">{req.email}</span>
 </div>
 </div>
 </TableCell>
 <TableCell>
 <Badge variant="outline" className="text-[14px] uppercase border-primary/20 text-primary bg-primary/5">
 {req.requestedDivision}
 </Badge>
 </TableCell>
 <TableCell className="text-xs text-muted-foreground">
 {req.timestamp?.seconds ? format(new Date(req.timestamp.seconds * 1000), 'MMM d, HH:mm') : 'Recent'}
 </TableCell>
 <TableCell className="text-right">
 <div className="flex items-center justify-end gap-2">
 <Button 
 variant="ghost" 
 size="sm" 
 onClick={() => handleDeclineEnrollment(req.id, req.uid)}
 className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
 >
 <X className="w-4 h-4" />
 </Button>
 <Button 
 size="sm" 
 onClick={() => handleApproveEnrollment(req.id, req.uid)}
 className="h-8 bg-primary text-foreground font-bold text-[14px] uppercase px-4"
 >
 Grant Access
 </Button>
 </div>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </Card>
 ) : (
 <Card className="bg-card border-transparent p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
 <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center border border-transparent">
 <UserPlus className="h-6 w-6 text-muted-foreground/50" />
 </div>
 <div>
 <h3 className="text-lg font-bold text-foreground">No Pending Applicants</h3>
 <p className="text-sm text-muted-foreground">All enrollment requests have been processed.</p>
 </div>
 </Card>
 )}
 </motion.div>
 </TabsContent>
 )}
 </Tabs>
 </div>
 );
}
