import React, { useState, useEffect } from 'react';
import { cmsApi, ContentBlock, WeeklyUpdate } from '@/services/cmsApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2, Plus, Trash2, CheckCircle2, Clock, Send, Globe, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRoles } from '@/context/role-context';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MarketCMSEditor({ activeModule = 'cms-storefront' }: { activeModule?: string }) {
 const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
 const [pendingUpdates, setPendingUpdates] = useState<WeeklyUpdate[]>([]);
 const [loading, setLoading] = useState(true);
 const { toast } = useToast();
 const { currentUser, requests, updateRequestStatus, addNotification } = useRoles();
 const role = currentUser?.role;
 const isHOD = role === 'hod' || role === 'boss';

 useEffect(() => {
 fetchData();
 }, []);

 const fetchData = async () => {
 try {
 setLoading(true);
 const [contentData, updatesData] = await Promise.all([
 cmsApi.getAllContentBlocks(),
 cmsApi.getWeeklyUpdates()
 ]);
 setContentBlocks(contentData.contentBlocks?.filter(b => b.division_id === 'div_market') || []);
 setPendingUpdates(updatesData.updates?.filter(u => u.division_id === 'div_market' && u.status !== 'published') || []);
 } catch (error) {
 toast({ variant: "destructive", title: "Error", description: "Failed to fetch CMS data" });
 } finally {
 setLoading(false);
 }
 };

 const handleSaveDraft = async (blockType: string, newPayload: any) => {
 const block = contentBlocks.find(b => b.block_type === blockType);
 try {
 if (!block) {
 await cmsApi.createContentBlock({
 division_id: 'div_market',
 block_type: blockType,
 content_payload: newPayload,
 order_index: 0
 }, { role: role || '', id: currentUser?.id || '' });
 } else {
 await cmsApi.updateContentBlock(block.id, {
 content_payload: newPayload
 }, { role: role || '', id: currentUser?.id || '' });

 if (isHOD) {
 // Check for conflicting pending updates from staff
 const conflictingUpdates = pendingUpdates.filter(u => 
 u.changeset?.block_id === block.id && u.status === 'pending_review'
 );

 conflictingUpdates.forEach(async update => {
 const requestedData = update.changeset?.payload;
 const isExactMatch = JSON.stringify(requestedData) === JSON.stringify(newPayload);

 // Since weeklyUpdates are managed by the backend, we might need to update their status via API.
 // But for the notification part, we can use the context.
 if (!isExactMatch) {
 addNotification({
 userId: update.created_by,
 message: `Your request to update the ${blockType} block was superseded by a direct change from the HOD.`
 });
 } else {
 addNotification({
 userId: update.created_by,
 message: `Your requested changes to the ${blockType} block were applied directly by the HOD.`
 });
 }
 // Delete the superseded update from the backend
 await cmsApi.deleteWeeklyUpdate(update.id);
 });
 }
 }
 toast({ title: "Saved", description: isHOD ? "Content published live." : "Update submitted for review." });
 fetchData();
 } catch (error) {
 toast({ variant: "destructive", title: "Error", description: "Failed to save update" });
 }
 };

 const handlePublish = async (updateIds: string[]) => {
 try {
 await cmsApi.publishUpdates(updateIds, { role: role || '', id: currentUser?.id || '' });
 toast({ title: "Published", description: "Changes are now live on the site." });
 fetchData();
 } catch (error) {
 toast({ variant: "destructive", title: "Error", description: "Failed to publish updates" });
 }
 };

 const getBlockPayload = (blockType: string, defaultPayload: any) => {
 const block = contentBlocks.find(b => b.block_type === blockType);
 return block ? block.content_payload : defaultPayload;
 };

 // --- Hero Editor ---
 const HeroEditor = () => {
 const defaultPayload = { title: "Freshness\nGuaranteed", subtitle: "Farm Direct", stats: [] };
 const [payload, setPayload] = useState(getBlockPayload('produce_hero', defaultPayload));

 return (
 <div className="space-y-4">
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Hero Title</Label>
 <Textarea 
 className="font-mono text-sm min-h-[100px]"
 value={payload.title} 
 onChange={(e) => setPayload({...payload, title: e.target.value})} 
 />
 </div>
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Subtitle</Label>
 <Input value={payload.subtitle} onChange={(e) => setPayload({...payload, subtitle: e.target.value})} />
 </div>
 <Button 
 className="w-full bg-card hover:bg-secondary text-foreground"
 onClick={() => handleSaveDraft('produce_hero', payload)}
 >
 {isHOD ? <Globe className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
 {isHOD ? "Publish Live" : "Submit for Review"}
 </Button>
 </div>
 );
 };

 // --- Aisles Editor ---
 const AislesEditor = () => {
 const defaultPayload = { aisles: [] };
 const [payload, setPayload] = useState(getBlockPayload('market_aisles', defaultPayload));

 const addAisle = () => {
 setPayload({
 ...payload,
 aisles: [...(payload.aisles || []), { id: Date.now().toString(), name: '', description: '', image: '' }]
 });
 };

 const updateAisle = (id: string, field: string, value: string) => {
 setPayload({
 ...payload,
 aisles: payload.aisles.map((a: any) => a.id === id ? { ...a, [field]: value } : a)
 });
 };

 const removeAisle = (id: string) => {
 setPayload({
 ...payload,
 aisles: payload.aisles.filter((a: any) => a.id !== id)
 });
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">Manage Aisles</h3>
 <Button onClick={addAisle} size="sm" variant="outline" className="h-8 border-transparent bg-secondary hover:bg-primary/20"><Plus className="w-4 h-4 mr-2"/> Add Aisle</Button>
 </div>
 <div className="space-y-4">
 {(payload.aisles || []).map((aisle: any) => (
 <Card key={aisle.id} className="p-4 relative border-transparent shadow-sm bg-muted/30">
 <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => removeAisle(aisle.id)}>
 <Trash2 className="w-4 h-4" />
 </Button>
 <div className="space-y-4 pr-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Aisle Name</Label>
 <Input value={aisle.name} onChange={(e) => updateAisle(aisle.id, 'name', e.target.value)} placeholder="e.g. Fresh Produce" className="bg-card" />
 </div>
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Image URL</Label>
 <Input value={aisle.image} onChange={(e) => updateAisle(aisle.id, 'image', e.target.value)} placeholder="https://..." className="bg-card" />
 </div>
 </div>
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Description</Label>
 <Textarea value={aisle.description} onChange={(e) => updateAisle(aisle.id, 'description', e.target.value)} placeholder="Aisle description..." className="h-20 bg-card" />
 </div>
 </div>
 </Card>
 ))}
 {(!payload.aisles || payload.aisles.length === 0) && (
 <div className="text-center py-8 border border-dashed border-muted-foreground/20 rounded-xl text-muted-foreground/70 text-xs uppercase tracking-widest font-bold">
 No aisles configured
 </div>
 )}
 </div>
 <Button 
 className="w-full bg-card hover:bg-secondary text-foreground mt-4"
 onClick={() => handleSaveDraft('market_aisles', payload)}
 >
 {isHOD ? <Globe className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
 {isHOD ? "Publish Live" : "Submit for Review"}
 </Button>
 </div>
 );
 };

 // --- Simple Generic Editor ---
 const SimpleEditor = ({ blockType, title, fields }: { blockType: string, title: string, fields: {key: string, label: string, type: 'text'|'textarea'}[] }) => {
 const defaultPayload = fields.reduce((acc, f) => ({...acc, [f.key]: ''}), {});
 const [payload, setPayload] = useState(getBlockPayload(blockType, defaultPayload));

 return (
 <div className="space-y-4">
 <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 mb-4">{title}</h3>
 {fields.map(f => (
 <div key={f.key} className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{f.label}</Label>
 {f.type === 'textarea' ? (
 <Textarea value={payload[f.key] || ''} onChange={(e) => setPayload({...payload, [f.key]: e.target.value})} className="min-h-[100px]" />
 ) : (
 <Input value={payload[f.key] || ''} onChange={(e) => setPayload({...payload, [f.key]: e.target.value})} />
 )}
 </div>
 ))}
 <Button 
 className="w-full bg-card hover:bg-secondary text-foreground mt-4"
 onClick={() => handleSaveDraft(blockType, payload)}
 >
 {isHOD ? <Globe className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
 {isHOD ? "Publish Live" : "Submit for Review"}
 </Button>
 </div>
 );
 };

 const renderEditor = () => {
 switch(activeModule) {
 case 'cms-storefront': return <HeroEditor />;
 case 'cms-aisles': return <AislesEditor />;
 case 'cms-flash-sales': return <SimpleEditor blockType="market_flash_sales" title="Flash Sales Configuration" fields={[{key: 'title', label: 'Campaign Title', type: 'text'}, {key: 'discount_text', label: 'Discount Text', type: 'text'}]} />;
 case 'cms-fresh-deals': return <SimpleEditor blockType="market_fresh_deals" title="Fresh Deals Configuration" fields={[{key: 'title', label: 'Section Title', type: 'text'}, {key: 'description', label: 'Description', type: 'textarea'}]} />;
 case 'cms-wholesale': return <SimpleEditor blockType="market_wholesale_cms" title="Wholesale Page Content" fields={[{key: 'title', label: 'Page Title', type: 'text'}, {key: 'contact_email', label: 'B2B Contact Email', type: 'text'}, {key: 'minimum_order', label: 'Minimum Order Value Text', type: 'text'}]} />;
 default: return <HeroEditor />;
 }
 };

 // --- Pending Updates View ---
 const PendingUpdatesView = () => (
 <div className="space-y-4">
 <div className="flex items-center justify-between mb-2">
 <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
 <Clock className="w-4 h-4" /> Queue for Approval
 </h3>
 <Badge variant="outline" className="text-[10px]">{pendingUpdates.length} Pending</Badge>
 </div>
 <ScrollArea className="h-[400px] pr-4">
 <div className="space-y-3">
 {pendingUpdates.length === 0 ? (
 <div className="text-center py-10 border border-dashed rounded-xl">
 <p className="text-xs text-muted-foreground/70 font-medium">No pending updates in queue</p>
 </div>
 ) : (
 pendingUpdates.map((update) => (
 <Card key={update.id} className="border-transparent shadow-none hover:border-primary/30 transition-colors">
 <CardContent className="p-4">
 <div className="flex justify-between items-start gap-4">
 <div className="space-y-1">
 <p className="text-xs font-bold text-foreground">{update.title}</p>
 <div className="flex items-center gap-2">
 <Badge className="bg-warning/10 text-warning border-none text-[8px] uppercase tracking-widest">
 {update.status.replace('_', ' ')}
 </Badge>
 <span className="text-[10px] text-muted-foreground/70 font-mono">
 {new Date(update.created_at || '').toLocaleDateString()}
 </span>
 </div>
 </div>
 {isHOD && (
 <Button 
 size="sm" 
 className="bg-success hover:bg-success/90 text-foreground h-8 text-[10px] uppercase font-bold tracking-widest"
 onClick={() => handlePublish([update.id])}
 >
 <CheckCircle2 className="w-3 h-3 mr-1.5" /> Approve & Publish
 </Button>
 )}
 </div>
 </CardContent>
 </Card>
 ))
 )}
 </div>
 </ScrollArea>
 </div>
 );

 if (loading) return (
 <div className="flex flex-col items-center justify-center h-64 space-y-4">
 <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/70" />
 <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Syncing CMS Core...</p>
 </div>
 );

 return (
 <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
 <div className="xl:col-span-8">
 <Card className="border-transparent shadow-sm rounded-xl overflow-hidden bg-card">
 <CardHeader className="border-b border-transparent pb-4 bg-muted/50/50">
 <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
 <Globe className="w-4 h-4" /> 
 {activeModule.replace('cms-', '').replace(/-/g, ' ')} Editor
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6">
 {renderEditor()}
 </CardContent>
 </Card>
 </div>

 <div className="xl:col-span-4 space-y-6">
 <Card className="border-transparent shadow-sm rounded-xl bg-card">
 <CardHeader className="border-b border-transparent pb-4">
 <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
 <History className="w-4 h-4" /> Workflow Status
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6">
 <PendingUpdatesView />
 </CardContent>
 </Card>

 <Card className="bg-card text-foreground rounded-xl p-6 space-y-4">
 <div className="flex items-center gap-2">
 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">System Integrity</p>
 </div>
 <h4 className="text-sm font-bold">Role: {role?.replace('admin_', '').toUpperCase()}</h4>
 <p className="text-[10px] opacity-70 leading-relaxed">
 {isHOD 
 ? "Full administrative override active. All changes bypass review and deploy directly to production."
 : "Editor access active. All changes are saved as drafts and require HOD approval."}
 </p>
 </Card>
 </div>
 </div>
 );
}
