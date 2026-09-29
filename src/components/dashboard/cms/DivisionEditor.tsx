import React, { useState } from 'react';
import { useCMS, DivisionContent } from '@/context/cms-context';
import { useRoles } from '@/context/role-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Trash2, Clock, Megaphone, LayoutTemplate, Users, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type DivisionEditorProps = {
 division: 'bakery' | 'dining' | 'games' | 'lounge' | 'market' | 'water';
};

export default function DivisionCMSEditor({ division }: DivisionEditorProps) {
 const { state, updateDivision, submitRequest, requests: cmsRequests, rejectRequest, approveRequest } = useCMS();
 const { currentUser, addNotification } = useRoles();
 const { toast } = useToast();
 const content = state.divisions[division];
 
 // Local state
 const [formData, setFormData] = useState<DivisionContent>(content);

 const isStaff = false;

 const handleSave = () => {
 updateDivision(division, formData);
 
 // Check for conflicting pending requests from staff
 const conflictingRequests = cmsRequests.filter(r => r.division === division && r.status === 'pending');
 
 conflictingRequests.forEach(req => {
 const isExactMatch = JSON.stringify(req.content) === JSON.stringify(formData);
 
 if (!isExactMatch) {
 rejectRequest(req.id);
 addNotification({
 userId: req.author.id,
 message: `Your request to update ${division.toUpperCase()} content was superseded by a direct change from the HOD.`
 });
 } else {
 approveRequest(req.id);
 addNotification({
 userId: req.author.id,
 message: `Your requested changes to ${division.toUpperCase()} content were applied directly by the HOD.`
 });
 }
 });
 };

 const addSpecial = () => {
 const newSpecial = {
 id: Date.now().toString(),
 title: "New Item",
 price: "$0.00",
 description: "Description here",
 imageUrl: ""
 };
 setFormData({
 ...formData,
 specials: [...formData.specials, newSpecial]
 });
 };

 const removeSpecial = (id: string) => {
 setFormData({
 ...formData,
 specials: formData.specials.filter(s => s.id !== id)
 });
 };

 const updateSpecial = (id: string, field: string, value: string) => {
 setFormData({
 ...formData,
 specials: formData.specials.map(s => s.id === id ? { ...s, [field]: value } : s)
 });
 };

 const addStaff = () => {
 const newStaff = {
 id: Date.now().toString(),
 name: "New Staff",
 role: "Role",
 imageUrl: ""
 };
 setFormData({
 ...formData,
 staff: [...(formData.staff || []), newStaff]
 });
 };

 const removeStaff = (id: string) => {
 setFormData({
 ...formData,
 staff: (formData.staff || []).filter(s => s.id !== id)
 });
 };

 const updateStaff = (id: string, field: string, value: string) => {
 setFormData({
 ...formData,
 staff: (formData.staff || []).map(s => s.id === id ? { ...s, [field]: value } : s)
 });
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-xl font-bold tracking-tight capitalize">{division} Content Manager</h2>
 <p className="text-sm text-muted-foreground">
 {isStaff ? "Draft changes and submit for approval." : "Manage public page content."}
 </p>
 </div>
 <Button onClick={handleSave} className={isStaff ? "bg-warning hover:bg-warning/90" : ""}>
 {isStaff ? <Send className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
 {isStaff ? "Submit Request" : "Save Changes"}
 </Button>
 </div>

 <Tabs defaultValue="general" className="space-y-4">
 <TabsList>
 <TabsTrigger value="general" className="flex items-center gap-2"><LayoutTemplate className="w-4 h-4" /> General</TabsTrigger>
 <TabsTrigger value="specials" className="flex items-center gap-2"><Megaphone className="w-4 h-4" /> Specials</TabsTrigger>
 <TabsTrigger value="staff" className="flex items-center gap-2"><Users className="w-4 h-4" /> Staff</TabsTrigger>
 </TabsList>

 <TabsContent value="general">
 <Card>
 <CardHeader>
 <CardTitle>Page Header</CardTitle>
 <CardDescription>Customize the landing area.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="space-y-2">
 <Label>Hero Title</Label>
 <Input 
 value={formData.heroTitle} 
 onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
 />
 </div>
 <div className="space-y-2">
 <Label>Description</Label>
 <Textarea 
 value={formData.description} 
 onChange={(e) => setFormData({...formData, description: e.target.value})}
 />
 </div>
 <div className="space-y-2">
 <Label>Hero Image URL</Label>
 <div className="flex gap-2">
 <Input 
 value={formData.heroImageUrl || ''} 
 onChange={(e) => setFormData({...formData, heroImageUrl: e.target.value})}
 placeholder="https://..."
 />
 {formData.heroImageUrl && (
 <div className="w-10 h-10 rounded overflow-hidden border shrink-0">
 <img src={formData.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
 </div>
 )}
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label>Operating Hours</Label>
 <div className="relative">
 <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
 <Input 
 className="pl-8"
 value={formData.hours} 
 onChange={(e) => setFormData({...formData, hours: e.target.value})}
 />
 </div>
 </div>
 <div className="space-y-2">
 <Label>Announcement</Label>
 <Input 
 value={formData.announcement} 
 onChange={(e) => setFormData({...formData, announcement: e.target.value})}
 placeholder="e.g. 50% off today!"
 />
 </div>
 </div>
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="specials">
 <Card>
 <CardHeader>
 <div className="flex items-center justify-between">
 <div>
 <CardTitle>Specials & Featured Items</CardTitle>
 <CardDescription>Items highlighted on the public page.</CardDescription>
 </div>
 <Button variant="outline" size="sm" onClick={addSpecial}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 {formData.specials.length === 0 && (
 <p className="text-sm text-muted-foreground text-center py-8">No specials added yet.</p>
 )}
 {formData.specials.map((special, index) => (
 <div key={special.id} className="grid grid-cols-12 gap-4 items-start border p-4 rounded-lg">
 <div className="col-span-3 space-y-2">
 <Label>Title</Label>
 <Input 
 value={special.title} 
 onChange={(e) => updateSpecial(special.id, 'title', e.target.value)}
 />
 </div>
 <div className="col-span-2 space-y-2">
 <Label>Price</Label>
 <Input 
 value={special.price} 
 onChange={(e) => updateSpecial(special.id, 'price', e.target.value)}
 />
 </div>
 <div className="col-span-4 space-y-2">
 <Label>Description</Label>
 <Input 
 value={special.description} 
 onChange={(e) => updateSpecial(special.id, 'description', e.target.value)}
 />
 </div>
 <div className="col-span-2 space-y-2">
 <Label>Image URL</Label>
 <Input 
 value={special.imageUrl || ''} 
 onChange={(e) => updateSpecial(special.id, 'imageUrl', e.target.value)}
 placeholder="https://..."
 />
 </div>
 <div className="col-span-1 flex items-end justify-end h-full pb-1">
 <Button variant="ghost" size="icon" onClick={() => removeSpecial(special.id)} className="text-destructive hover:bg-destructive/10">
 <Trash2 className="w-4 h-4" />
 </Button>
 </div>
 </div>
 ))}
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="staff">
 <Card>
 <CardHeader>
 <div className="flex items-center justify-between">
 <div>
 <CardTitle>Team Members</CardTitle>
 <CardDescription>Manage staff profiles displayed on the page.</CardDescription>
 </div>
 <Button variant="outline" size="sm" onClick={addStaff}><Plus className="w-4 h-4 mr-2" /> Add Staff</Button>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 {(!formData.staff || formData.staff.length === 0) && (
 <p className="text-sm text-muted-foreground text-center py-8">No staff members added yet.</p>
 )}
 {(formData.staff || []).map((member) => (
 <div key={member.id} className="flex gap-4 items-start border p-4 rounded-lg">
 <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden shrink-0 border">
 {member.imageUrl ? (
 <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
 <Users className="w-6 h-6" />
 </div>
 )}
 </div>
 <div className="flex-1 grid grid-cols-3 gap-4">
 <div className="space-y-2">
 <Label>Name</Label>
 <Input 
 value={member.name} 
 onChange={(e) => updateStaff(member.id, 'name', e.target.value)}
 />
 </div>
 <div className="space-y-2">
 <Label>Role</Label>
 <Input 
 value={member.role} 
 onChange={(e) => updateStaff(member.id, 'role', e.target.value)}
 />
 </div>
 <div className="space-y-2">
 <Label>Image URL</Label>
 <Input 
 value={member.imageUrl || ''} 
 onChange={(e) => updateStaff(member.id, 'imageUrl', e.target.value)}
 placeholder="https://..."
 />
 </div>
 </div>
 <div className="flex items-center justify-center h-full pt-8">
 <Button variant="ghost" size="icon" onClick={() => removeStaff(member.id)} className="text-destructive hover:bg-destructive/10">
 <Trash2 className="w-4 h-4" />
 </Button>
 </div>
 </div>
 ))}
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>
 </div>
 );
}
