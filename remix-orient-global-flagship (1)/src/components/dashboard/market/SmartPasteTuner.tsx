import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cmsApi } from '@/services/cmsApi';
import { useRoles } from '@/context/role-context';

export default function SmartPasteTuner() {
 const [input, setInput] = useState('');
 const [tuning, setTuning] = useState(false);
 const [result, setResult] = useState<any>(null);
 const { toast } = useToast();
 const { currentUser } = useRoles();

 const handleTune = async () => {
 if (!input.trim()) return;
 
 setTuning(true);
 // Simulate AI tuning
 setTimeout(() => {
 const tuned = {
 title: input.split('\n')[0] || "Fresh Market Update",
 subtitle: "Curated by AI Tuner",
 desc: input.length > 50 ? input : "Discover our latest seasonal selections, handpicked for quality and freshness. From farm to your table, we ensure the best for your family.",
 stats: [
 { label: "Freshness", value: "100%" },
 { label: "Organic", value: "85%" }
 ]
 };
 setResult(tuned);
 setTuning(false);
 toast({ title: "AI Tuning Complete", description: "Content has been optimized for the Market archetype." });
 }, 1500);
 };

 const handleApply = async () => {
 try {
 await cmsApi.createContentBlock({
 division_id: 'div_market',
 block_type: 'ai_tuned_content',
 content_payload: result,
 order_index: 10
 }, { role: currentUser?.role || '', id: currentUser?.id || '' });
 
 toast({ title: "Applied", description: "Tuned content submitted to CMS queue." });
 setResult(null);
 setInput('');
 } catch (error) {
 toast({ variant: "destructive", title: "Error", description: "Failed to apply content" });
 }
 };

 return (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
 <Card className="border-transparent shadow-sm bg-card rounded-xl flex flex-col">
 <CardHeader>
 <div className="flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-info" />
 <CardTitle className="text-xs font-bold uppercase tracking-widest">Input Stream</CardTitle>
 </div>
 <CardDescription className="text-[10px] uppercase tracking-tight">Paste raw product descriptions or campaign notes</CardDescription>
 </CardHeader>
 <CardContent className="flex-1 flex flex-col gap-4">
 <Textarea 
 placeholder="e.g. We have fresh spinach from the farm today. It's very green and healthy. Price is 500 per bunch."
 className="flex-1 font-mono text-sm resize-none bg-muted/50 border-transparent focus:bg-card transition-colors"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 />
 <Button 
 onClick={handleTune} 
 disabled={tuning || !input}
 className="w-full bg-card hover:bg-secondary text-foreground h-12 uppercase font-bold tracking-widest text-[10px]"
 >
 {tuning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
 {tuning ? "Tuning Engine..." : "Run Smart Paste AI"}
 </Button>
 </CardContent>
 </Card>

 <Card className="border-transparent shadow-sm bg-muted/50/50 rounded-xl flex flex-col border-dashed">
 <CardHeader>
 <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Optimized Output</CardTitle>
 </CardHeader>
 <CardContent className="flex-1 flex flex-col justify-center">
 {result ? (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
 <div className="space-y-2">
 <Badge className="bg-success text-foreground text-[8px] uppercase tracking-widest">Optimized</Badge>
 <h3 className="text-2xl font-bold tracking-tight text-foreground">{result.title}</h3>
 <p className="text-sm text-muted-foreground leading-relaxed">{result.desc}</p>
 </div>
 <div className="grid grid-cols-2 gap-4">
 {result.stats.map((stat: any) => (
 <div key={stat.label} className="bg-card p-3 rounded-lg border border-transparent">
 <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/70">{stat.label}</p>
 <p className="text-lg font-bold text-foreground">{stat.value}</p>
 </div>
 ))}
 </div>
 <Button 
 onClick={handleApply}
 className="w-full bg-success hover:bg-success/90 text-foreground h-12 uppercase font-bold tracking-widest text-[10px]"
 >
 <Send className="w-4 h-4 mr-2" /> Inject to CMS Queue
 </Button>
 </div>
 ) : (
 <div className="text-center space-y-2 py-20">
 <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto" />
 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Awaiting AI Input</p>
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 );
}
