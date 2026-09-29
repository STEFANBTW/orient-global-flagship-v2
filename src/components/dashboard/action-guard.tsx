
'use client';

import React, { useState } from 'react';
import { useRoles } from '@/context/role-context';
import { Button, ButtonProps } from '@/components/ui/button';
import { Send, CheckCircle2, ShieldAlert, Loader2, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
 Tooltip, 
 TooltipContent, 
 TooltipProvider, 
 TooltipTrigger 
} from "@/components/ui/tooltip";

interface ActionGuardProps extends ButtonProps {
 sensitivity?: 'low' | 'high';
 actionLabel: string;
 description?: string;
 onExecute?: () => void;
 oldValue?: string;
 newValue?: string;
}

export function ActionGuard({ 
 sensitivity = 'low', 
 actionLabel, 
 description = "Standard operational update",
 onExecute, 
 oldValue,
 newValue,
 children,
 className,
 ...props 
}: ActionGuardProps) {
 const { currentUser, canExecuteLocally, createRequest, addAuditLog } = useRoles();
 const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');

 const isBoss = currentUser?.role === 'boss';
 const hasPermission = canExecuteLocally(sensitivity);

 const handleAction = async () => {
 if (!currentUser) return;
 
 setStatus('processing');
 await new Promise(r => setTimeout(r, 600));

 if (hasPermission || isBoss) {
 if (onExecute) onExecute();
 
 // Auto-Log if it's an instant update
 if (oldValue && newValue) {
 addAuditLog({
 itemName: actionLabel,
 oldValue,
 newValue,
 staffName: currentUser.name,
 staffRole: currentUser.role === 'boss' ? 'Director' : currentUser.role === 'hod' ? 'Manager' : 'Staff',
 approverName: currentUser.name,
 approverRole: currentUser.role === 'boss' ? 'Director' : currentUser.role === 'hod' ? 'Manager' : 'Staff',
 reason: description,
 division: currentUser.division
 });
 }

 toast({
 title: "Update Authorized",
 description: `${actionLabel} has been updated.`,
 });
 setStatus('completed');
 } else {
 const targetRole = currentUser.role === 'staff' ? 'hod' : 'boss';
 
 createRequest({
 requesterId: currentUser.id,
 requesterName: currentUser.name,
 targetRoleId: targetRole,
 division: currentUser.division,
 actionLabel,
 description,
 oldValue,
 newValue
 });

 toast({
 title: "Request Sent",
 description: `Approval for "${actionLabel}" has been requested.`,
 });
 setStatus('completed');
 }
 
 setTimeout(() => setStatus('idle'), 2000);
 };

 return (
 <TooltipProvider>
 <Tooltip>
 <TooltipTrigger asChild>
 <Button 
 {...props} 
 disabled={status !== 'idle' || props.disabled}
 onClick={handleAction}
 className={cn(
 "font-bold uppercase tracking-widest text-[10px] h-9 px-4 transition-all duration-200 professional-shadow",
 isBoss 
 ? "bg-card text-primary border border-primary/20 hover:bg-secondary"
 : !hasPermission 
 ? "bg-secondary text-muted-foreground border border-transparent hover:bg-muted" 
 : "bg-primary text-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
 status === 'completed' && "bg-emerald-500 text-foreground",
 className
 )}
 >
 {status === 'processing' ? (
 <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
 ) : status === 'completed' ? (
 <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
 ) : isBoss ? (
 <Zap className="w-3.5 h-3.5 mr-2 text-primary" />
 ) : !hasPermission ? (
 <Send className="w-3.5 h-3.5 mr-2" />
 ) : (
 <ShieldAlert className="w-3.5 h-3.5 mr-2" />
 )}
 
 {status === 'processing' ? "Saving..." : 
 status === 'completed' ? (hasPermission || isBoss ? "Authorized" : "Requested") : 
 isBoss ? `Direct Update` :
 !hasPermission ? `Request Update` : children || actionLabel}
 </Button>
 </TooltipTrigger>
 <TooltipContent className="bg-card border-transparent text-[10px] font-medium p-2 text-foreground">
 {isBoss 
 ? "Director bypass. Changes applied instantly."
 : hasPermission 
 ? "You have local authority for this action." 
 : `Approval required from your ${currentUser?.role === 'staff' ? 'Manager' : 'Director'}.`}
 </TooltipContent>
 </Tooltip>
 </TooltipProvider>
 );
}
