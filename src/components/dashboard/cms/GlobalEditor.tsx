import React, { useState } from 'react';
import { useCMS } from '@/context/cms-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Globe, Info, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function GlobalCMSEditor() {
 const { state, updateGlobal } = useCMS();
 const { toast } = useToast();
 
 // Local state for form handling
 const [homepage, setHomepage] = useState(state.global.homepage);
 const [about, setAbout] = useState(state.global.about);
 const [contact, setContact] = useState(state.global.contact);

 const handleHomepageSave = () => {
 updateGlobal('homepage', homepage);
 toast({ title: "Homepage Updated", description: "Changes have been saved globally." });
 };

 const handleAboutSave = () => {
 updateGlobal('about', about);
 toast({ title: "About Us Updated", description: "Company story updated." });
 };

 const handleContactSave = () => {
 updateGlobal('contact', contact);
 toast({ title: "Contact Info Updated", description: "Contact details updated." });
 };

 return (
 <div className="space-y-12">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-bold tracking-tight text-foreground">Global Content Manager</h2>
 <p className="text-muted-foreground mt-2">Manage the content for the public-facing website.</p>
 </div>
 </div>

 <Tabs defaultValue="homepage" className="space-y-8">
 <TabsList className="bg-secondary p-1 h-12 w-full md:w-fit">
 <TabsTrigger value="homepage" className="flex-1 md:flex-none data-[state=active]:bg-background data-[state=active]:text-primary font-bold text-[10px] uppercase tracking-[0.2em] px-8"><Globe className="w-4 h-4 mr-2" /> Homepage</TabsTrigger>
 <TabsTrigger value="about" className="flex-1 md:flex-none data-[state=active]:bg-background data-[state=active]:text-primary font-bold text-[10px] uppercase tracking-[0.2em] px-8"><Info className="w-4 h-4 mr-2" /> About Us</TabsTrigger>
 <TabsTrigger value="contact" className="flex-1 md:flex-none data-[state=active]:bg-background data-[state=active]:text-primary font-bold text-[10px] uppercase tracking-[0.2em] px-8"><Phone className="w-4 h-4 mr-2" /> Contact</TabsTrigger>
 </TabsList>

 <TabsContent value="homepage">
 <Card>
 <CardHeader className="border-b border-transparent p-8">
 <CardTitle>Homepage Settings</CardTitle>
 <CardDescription>Customize the hero section and announcements.</CardDescription>
 </CardHeader>
 <CardContent className="p-8 space-y-6">
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Hero Title</Label>
 <Input 
 className="h-12 rounded-lg border-transparent"
 value={homepage.heroTitle} 
 onChange={(e) => setHomepage({...homepage, heroTitle: e.target.value})}
 />
 </div>
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Hero Subtitle</Label>
 <Textarea 
 className="rounded-lg border-transparent"
 value={homepage.heroSubtitle} 
 onChange={(e) => setHomepage({...homepage, heroSubtitle: e.target.value})}
 />
 </div>
 <div className="flex items-center justify-between border border-transparent p-6 rounded-xl">
 <div className="space-y-0.5">
 <Label className="font-bold text-foreground">Announcement Bar</Label>
 <p className="text-xs text-muted-foreground">Show a banner at the top of the site.</p>
 </div>
 <Switch 
 checked={homepage.announcement.active}
 onCheckedChange={(checked) => setHomepage({...homepage, announcement: {...homepage.announcement, active: checked}})}
 />
 </div>
 {homepage.announcement.active && (
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Announcement Text</Label>
 <Input 
 className="h-12 rounded-lg border-transparent"
 value={homepage.announcement.text} 
 onChange={(e) => setHomepage({...homepage, announcement: {...homepage.announcement, text: e.target.value}})}
 />
 </div>
 )}
 <Button onClick={handleHomepageSave} className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90"><Save className="w-4 h-4 mr-2" /> Save Homepage</Button>
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="about">
 <Card>
 <CardHeader className="border-b border-transparent p-8">
 <CardTitle>About Us</CardTitle>
 <CardDescription>Tell the Orient story.</CardDescription>
 </CardHeader>
 <CardContent className="p-8 space-y-6">
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mission Statement</Label>
 <Textarea 
 className="rounded-lg border-transparent"
 value={about.mission} 
 onChange={(e) => setAbout({...about, mission: e.target.value})}
 />
 </div>
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Our Story</Label>
 <Textarea 
 className="min-h-[150px] rounded-lg border-transparent"
 value={about.story} 
 onChange={(e) => setAbout({...about, story: e.target.value})}
 />
 </div>
 <Button onClick={handleAboutSave} className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90"><Save className="w-4 h-4 mr-2" /> Save About Us</Button>
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="contact">
 <Card>
 <CardHeader className="border-b border-transparent p-8">
 <CardTitle>Contact Information</CardTitle>
 <CardDescription>Update how customers reach you.</CardDescription>
 </CardHeader>
 <CardContent className="p-8 space-y-6">
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email Address</Label>
 <Input 
 className="h-12 rounded-lg border-transparent"
 value={contact.email} 
 onChange={(e) => setContact({...contact, email: e.target.value})}
 />
 </div>
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Phone Number</Label>
 <Input 
 className="h-12 rounded-lg border-transparent"
 value={contact.phone} 
 onChange={(e) => setContact({...contact, phone: e.target.value})}
 />
 </div>
 </div>
 <div className="space-y-2">
 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Physical Address</Label>
 <Input 
 className="h-12 rounded-lg border-transparent"
 value={contact.address} 
 onChange={(e) => setContact({...contact, address: e.target.value})}
 />
 </div>
 <Button onClick={handleContactSave} className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90"><Save className="w-4 h-4 mr-2" /> Save Contact Info</Button>
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>
 </div>
 );
}
