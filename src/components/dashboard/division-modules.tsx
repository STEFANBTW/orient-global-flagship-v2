"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VR_RIGS, FLEET_STATUS } from "@/app/lib/mock-data";
import { Activity, Truck, ShieldCheck, Zap, AlertTriangle, Droplets } from "lucide-react";
import { ActionGuard } from "./action-guard";

export function GamesModule() {
 return (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <Card className="bg-card/40 border-transparent">
 <CardHeader>
 <CardTitle className="text-sm font-bold flex items-center gap-2">
 <Zap className="w-4 h-4 text-primary" /> VR Rig Telemetry
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 {VR_RIGS.map((rig) => (
 <div key={rig.id} className="space-y-2">
 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
 <span className="text-foreground">{rig.name}</span>
 <Badge variant="outline" className={rig.status === 'active' ? 'text-emerald-500 border-emerald-500/20' : 'text-red-500 border-red-500/20'}>
 {rig.status}
 </Badge>
 </div>
 <Progress value={rig.health} className="h-1 bg-secondary" />
 <div className="flex justify-between text-[9px] text-muted-foreground">
 <span>Health: {rig.health}%</span>
 <span>Last Service: {rig.lastService}</span>
 </div>
 </div>
 ))}
 <ActionGuard sensitivity="high" actionLabel="Authorize Fleet Repair" className="w-full mt-4" />
 </CardContent>
 </Card>

 <Card className="bg-card/40 border-transparent">
 <CardHeader>
 <CardTitle className="text-sm font-bold flex items-center gap-2">
 <ShieldCheck className="w-4 h-4 text-primary" /> Tournament Director
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
 <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Cyber Odyssey</p>
 <h4 className="text-xl font-bold text-foreground mb-2">Prize Pool: ₦50M</h4>
 <div className="flex gap-2">
 <Badge className="bg-secondary text-[10px]">Active Round: 3</Badge>
 <Badge className="bg-secondary text-[10px]">128 Players</Badge>
 </div>
 </div>
 <ActionGuard sensitivity="high" actionLabel="Finalize Match Results" className="w-full" />
 </CardContent>
 </Card>
 </div>
 );
}

export function WaterModule() {
 return (
 <div className="grid grid-cols-1 gap-6">
 <Card className="bg-card/40 border-transparent">
 <CardHeader>
 <CardTitle className="text-sm font-bold flex items-center gap-2">
 <Truck className="w-4 h-4 text-primary" /> Fleet Command
 </CardTitle>
 </CardHeader>
 <CardContent>
 <Table>
 <TableHeader className="bg-background/50">
 <TableRow className="border-transparent">
 <TableHead className="text-[10px] font-bold uppercase tracking-widest">Truck ID</TableHead>
 <TableHead className="text-[10px] font-bold uppercase tracking-widest">Driver</TableHead>
 <TableHead className="text-[10px] font-bold uppercase tracking-widest">Location</TableHead>
 <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
 <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Action</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {FLEET_STATUS.map((truck) => (
 <TableRow key={truck.id} className="border-transparent">
 <TableCell className="font-code font-bold text-foreground">{truck.id}</TableCell>
 <TableCell className="text-sm text-muted-foreground/50">{truck.driver}</TableCell>
 <TableCell className="text-xs text-muted-foreground">{truck.location}</TableCell>
 <TableCell>
 <Badge variant="outline" className="text-[9px] uppercase border-transparent">
 {truck.status} ({truck.delay})
 </Badge>
 </TableCell>
 <TableCell className="text-right">
 <ActionGuard sensitivity="low" actionLabel="Reroute" size="sm" />
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </CardContent>
 </Card>

 <Card className="bg-card/40 border-transparent">
 <CardHeader>
 <CardTitle className="text-sm font-bold flex items-center gap-2">
 <Droplets className="w-4 h-4 text-sky-400" /> Quality Logbook
 </CardTitle>
 </CardHeader>
 <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="p-4 rounded-lg bg-secondary/50 border border-transparent text-center">
 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Last pH Reading</p>
 <h5 className="text-2xl font-bold text-foreground">7.2</h5>
 </div>
 <div className="p-4 rounded-lg bg-secondary/50 border border-transparent text-center">
 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">TDS Level</p>
 <h5 className="text-2xl font-bold text-foreground">125 ppm</h5>
 </div>
 <div className="flex items-center justify-center">
 <ActionGuard sensitivity="high" actionLabel="Verify Compliance" className="w-full h-full" />
 </div>
 </CardContent>
 </Card>
 </div>
 );
}

export function BakeryModule() {
 return (
 <Card className="bg-card/40 border-transparent">
 <CardHeader>
 <CardTitle className="text-sm font-bold flex items-center gap-2">
 <Activity className="w-4 h-4 text-amber-500" /> Custom Cake Queue (3D Configurator)
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {['Pending Design', 'In Baking', 'Quality Check'].map((stage) => (
 <div key={stage} className="space-y-4">
 <h6 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">{stage}</h6>
 <div className="p-4 rounded-xl bg-secondary/30 border border-transparent space-y-3">
 <Badge className="bg-amber-500/20 text-amber-500 border-none">Order #8842</Badge>
 <p className="text-xs font-bold text-foreground">Raspberry Velvet Cake</p>
 <p className="text-[9px] text-muted-foreground italic">"Happy 50th Anniversary Chief!"</p>
 <ActionGuard sensitivity="low" actionLabel="Advance Stage" size="sm" className="w-full" />
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 );
}
