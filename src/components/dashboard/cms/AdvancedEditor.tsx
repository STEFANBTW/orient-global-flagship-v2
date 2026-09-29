import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { cmsApi, Division, ContentBlock, WeeklyUpdate } from '@/services/cmsApi';
import { Save, Plus, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function AdvancedCMSEditor() {
 const { toast } = useToast();
 const [divisions, setDivisions] = useState<Division[]>([]);
 const [blocks, setBlocks] = useState<ContentBlock[]>([]);
 const [updates, setUpdates] = useState<WeeklyUpdate[]>([]);
 const [selectedDivision, setSelectedDivision] = useState<string>('');
 const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
 const [payloadStr, setPayloadStr] = useState<string>('');

 useEffect(() => {
 loadData();
 }, []);

 const loadData = async () => {
 try {
 const divRes = await cmsApi.getDivisions();
 setDivisions(divRes.divisions);
 if (divRes.divisions.length > 0 && !selectedDivision) {
 setSelectedDivision(divRes.divisions[0].id);
 }

 const blockRes = await cmsApi.getAllContentBlocks();
 setBlocks(blockRes.contentBlocks);

 const updateRes = await cmsApi.getWeeklyUpdates();
 setUpdates(updateRes.updates);
 } catch (err) {
 console.error(err);
 toast({ title: "Error", description: "Failed to load CMS data", variant: "destructive" });
 }
 };

 const handleEditBlock = (block: ContentBlock) => {
 setEditingBlock(block);
 setPayloadStr(JSON.stringify(block.content_payload, null, 2));
 };

 const handleSaveBlock = async () => {
 if (!editingBlock) return;
 
 try {
 const payload = JSON.parse(payloadStr);
 await cmsApi.updateContentBlock(editingBlock.id, {
 content_payload: payload
 });
 toast({ title: "Block Updated", description: "Saved as draft in Weekly Updates." });
 setEditingBlock(null);
 loadData();
 } catch (e) {
 toast({ title: "Invalid JSON", description: "Please check your payload format.", variant: "destructive" });
 }
 };

 const handleCreateBlock = async () => {
 try {
 await cmsApi.createContentBlock({
 division_id: selectedDivision,
 block_type: 'text',
 content_payload: { title: "New Block", content: "Enter content here" },
 order_index: blocks.filter(b => b.division_id === selectedDivision).length
 });
 toast({ title: "Block Created", description: "New block added as draft." });
 loadData();
 } catch (e) {
 toast({ title: "Error", description: "Failed to create block.", variant: "destructive" });
 }
 };

 const handlePublish = async (updateId: string) => {
 try {
 await cmsApi.publishUpdates([updateId]);
 toast({ title: "Published", description: "Update is now live." });
 loadData();
 } catch (e) {
 toast({ title: "Error", description: "Failed to publish.", variant: "destructive" });
 }
 };

 const filteredBlocks = blocks.filter(b => b.division_id === selectedDivision);

 return (
 <div className="space-y-12">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-bold tracking-tight text-foreground">Advanced CMS Architecture</h2>
 <p className="text-muted-foreground mt-2">Manage Division Content Blocks & Weekly Updates</p>
 </div>
 </div>

 <Tabs defaultValue="editor" className="space-y-8">
 <TabsList className="bg-secondary p-1 h-12 w-full md:w-fit">
 <TabsTrigger value="editor" className="flex-1 md:flex-none data-[state=active]:bg-background data-[state=active]:text-primary font-bold text-[10px] uppercase tracking-[0.2em] px-8">Visual JSON Editor</TabsTrigger>
 <TabsTrigger value="workflow" className="flex-1 md:flex-none data-[state=active]:bg-background data-[state=active]:text-primary font-bold text-[10px] uppercase tracking-[0.2em] px-8">Draft/Publish Workflow</TabsTrigger>
 </TabsList>

 <TabsContent value="editor" className="space-y-8">
 <Card>
 <CardHeader className="border-b border-transparent p-8">
 <CardTitle>Division Content Blocks</CardTitle>
 <CardDescription>Select a division to edit its content payloads.</CardDescription>
 </CardHeader>
 <CardContent className="p-8">
 <div className="mb-8">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Select Division</Label>
 <Select value={selectedDivision} onValueChange={setSelectedDivision}>
 <SelectTrigger className="w-[300px] h-12 rounded-lg border-transparent">
 <SelectValue placeholder="Select a division" />
 </SelectTrigger>
 <SelectContent>
 {divisions.map(d => (
 <SelectItem key={d.id} value={d.id}>{d.name} ({d.theme_config.archetype})</SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="md:col-span-1 space-y-4">
 <div className="flex justify-between items-center">
 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Blocks</h3>
 <Button size="sm" variant="outline" className="h-10 rounded-lg border-transparent" onClick={handleCreateBlock}><Plus className="w-4 h-4 mr-2" /> Add Block</Button>
 </div>
 <div className="space-y-2">
 {filteredBlocks.map(block => (
 <div 
 key={block.id} 
 className={`p-4 border border-transparent rounded-lg cursor-pointer flex justify-between items-center transition-colors ${editingBlock?.id === block.id ? 'border-primary bg-accent' : 'hover:bg-muted/50'}`}
 onClick={() => handleEditBlock(block)}
 >
 <div>
 <div className="font-bold text-[10px] uppercase tracking-[0.1em] text-foreground">{block.block_type.toUpperCase()}</div>
 <div className="text-xs text-muted-foreground truncate w-32">
 {block.content_payload.title || 'Untitled'}
 </div>
 </div>
 <div className="flex items-center gap-2">
 {block.published_at ? (
 <span className="w-2 h-2 rounded-full bg-success" title="Published"></span>
 ) : (
 <span className="w-2 h-2 rounded-full bg-warning" title="Draft"></span>
 )}
 <Edit className="w-4 h-4 text-muted-foreground/70" />
 </div>
 </div>
 ))}
 {filteredBlocks.length === 0 && (
 <div className="text-sm text-muted-foreground text-center py-8">No blocks found for this division.</div>
 )}
 </div>
 </div>

 <div className="md:col-span-2">
 {editingBlock ? (
 <Card className="border-transparent">
 <CardHeader className="pb-3 border-b border-transparent p-6">
 <CardTitle className="text-sm flex justify-between items-center">
 Editing: {editingBlock.id}
 <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 bg-secondary rounded-md text-muted-foreground">{editingBlock.block_type}</span>
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4 p-6">
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">JSON Payload</Label>
 <Textarea 
 className="font-mono text-sm min-h-[300px] bg-muted/50 rounded-lg border-transparent"
 value={payloadStr}
 onChange={(e) => setPayloadStr(e.target.value)}
 />
 <p className="text-xs text-muted-foreground">Edit the JSON payload directly. Changes will be saved as a draft.</p>
 </div>
 <div className="flex justify-end gap-2">
 <Button variant="outline" className="h-12 rounded-lg border-transparent" onClick={() => setEditingBlock(null)}>Cancel</Button>
 <Button className="h-12 rounded-lg bg-primary hover:bg-primary/90" onClick={handleSaveBlock}><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
 </div>
 </CardContent>
 </Card>
 ) : (
 <div className="h-full flex items-center justify-center border-2 border-dashed border-transparent rounded-2xl p-12 text-muted-foreground/70">
 Select a block to edit its JSON payload
 </div>
 )}
 </div>
 </div>
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="workflow" className="space-y-8">
 <Card>
 <CardHeader className="border-b border-transparent p-8">
 <CardTitle>Weekly Updates Workflow</CardTitle>
 <CardDescription>Review and publish draft changes to the live site.</CardDescription>
 </CardHeader>
 <CardContent className="p-8">
 <div className="space-y-4">
 {updates.length === 0 ? (
 <div className="text-center py-12 text-muted-foreground">No updates pending.</div>
 ) : (
 updates.map(update => (
 <div key={update.id} className="flex items-center justify-between p-6 border border-transparent rounded-xl">
 <div className="flex items-center gap-4">
 {update.status === 'published' ? (
 <CheckCircle className="w-8 h-8 text-success" />
 ) : (
 <Clock className="w-8 h-8 text-warning" />
 )}
 <div>
 <h4 className="font-bold text-foreground">{update.title}</h4>
 <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
 <span className="uppercase font-bold tracking-[0.1em]">{update.status}</span>
 <span>•</span>
 <span>Division: {divisions.find(d => d.id === update.division_id)?.name || update.division_id}</span>
 </div>
 </div>
 </div>
 {update.status !== 'published' && (
 <Button onClick={() => handlePublish(update.id)} className="h-12 rounded-lg bg-success hover:bg-success/90">
 Publish Now
 </Button>
 )}
 </div>
 ))
 )}
 </div>
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>
 </div>
 );
}
