
import React, { useState, useEffect } from 'react';
import { useRoles } from '@/context/role-context';
import { cmsApi } from '@/services/cmsApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Layout, 
  Type, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Settings2,
  Sparkles,
  History,
  MessageSquare,
  Star,
  Users
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SECTION_OPTIONS = [
  { id: 'hero', label: 'Hero Section', icon: Sparkles },
  { id: 'services', label: 'Services Wrapper', icon: Layout },
  { id: 'about', label: 'About Brand', icon: Type },
  { id: 'testimonials', label: 'Client Voices', icon: Type },
  { id: 'footer', label: 'Global Footer', icon: Settings2 },
];

export default function HomeCMS() {
  const { currentUser, createRequest } = useRoles();
  const [activeSection, setActiveSection] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>({});
  const [isHOD, setIsHOD] = useState(false);

  useEffect(() => {
    setIsHOD(currentUser?.role === 'boss' || currentUser?.role === 'hod');
  }, [currentUser]);

  useEffect(() => {
    fetchContent();
  }, [activeSection]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { contentBlocks } = await cmsApi.getAllContentBlocks();
      const block = contentBlocks.find(b => b.block_type === activeSection && b.division_id === 'global');
      if (block) {
        setContent(block.content_payload);
      } else {
        setContent({});
      }
    } catch (error) {
      console.error("Failed to fetch home content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { contentBlocks } = await cmsApi.getAllContentBlocks();
      const existingBlock = contentBlocks.find(b => b.block_type === activeSection && b.division_id === 'global');
      
      const payload = {
        division_id: 'global',
        block_type: activeSection,
        content_payload: content,
        order_index: 0
      };

      if (existingBlock) {
        await cmsApi.updateContentBlock(existingBlock.id, payload, { role: 'boss', id: 'admin' });
      } else {
        await cmsApi.createContentBlock(payload, { role: 'boss', id: 'admin' });
      }

      toast({
        title: "Content Published",
        description: `Successfully updated ${activeSection} content on live storefront.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error?.message || "Could not publish content to live storefront.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase italic underline decoration-primary decoration-4 underline-offset-8">Global Site Editor</h2>
          <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest font-medium">Refine every visual and textual detail of the primary storefront</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('orient:navigate', { detail: 'home' }));
              }
            }}
            className="border-transparent bg-secondary h-11 px-6 uppercase text-[10px] font-bold tracking-widest cursor-pointer hover:bg-secondary/80"
          >
            <Eye className="w-4 h-4 mr-2" /> Preview Site
          </Button>
          <Button 
            disabled={loading} 
            onClick={handleSave}
            className="bg-primary text-primary-foreground h-11 px-8 uppercase text-[10px] font-bold tracking-[0.2em] shadow-lg shadow-primary/20"
          >
            {loading ? "Processing..." : "Publish Direct"}
            {!loading && <Save className="ml-2 w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-card/50 backdrop-blur-xl border-transparent professional-shadow">
            <CardHeader className="p-6 border-b border-transparent">
              <CardTitle className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Editor Nodes</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                {SECTION_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                      activeSection === item.id 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className={`border-transparent shadow-2xl`}>
            <CardHeader className="bg-background/50 p-8 border-b border-transparent">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold uppercase italic tracking-tight">{SECTION_OPTIONS.find(s => s.id === activeSection)?.label} Configuration</CardTitle>
                  <CardDescription className="text-[10px] uppercase tracking-widest font-bold mt-1">Direct Payload Modifier</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {activeSection === 'hero' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold">Main Headline</Label>
                          <Input 
                            value={content.headline || ""} 
                            onChange={(e) => setContent({ ...content, headline: e.target.value })}
                            placeholder="Enter headline..."
                            className="h-12 bg-background/50 focus-visible:ring-primary text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold">Accent Text</Label>
                          <Input 
                            value={content.accentText || ""} 
                            onChange={(e) => setContent({ ...content, accentText: e.target.value })}
                            placeholder="e.g. Modern Living"
                            className="h-12 bg-background/50 focus-visible:ring-primary text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold">Welcome Text Prefix</Label>
                          <Input 
                            value={content.welcomeText || ""} 
                            onChange={(e) => setContent({ ...content, welcomeText: e.target.value })}
                            placeholder="e.g. Welcome to"
                            className="h-12 bg-background/50 focus-visible:ring-primary text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold">Hero Image URL</Label>
                          <Input 
                            value={content.heroImage || ""} 
                            onChange={(e) => setContent({ ...content, heroImage: e.target.value })}
                            placeholder="https://..."
                            className="h-12 bg-background/50 focus-visible:ring-primary text-sm font-medium"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold">Description Paragraph</Label>
                        <Textarea 
                          value={content.description || ""} 
                          onChange={(e) => setContent({ ...content, description: e.target.value })}
                          placeholder="Compelling description..."
                          className="min-h-[120px] bg-background/50 focus-visible:ring-primary text-sm leading-relaxed"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold">CTA Button Labels</Label>
                          <div className="flex gap-4">
                            <Input 
                              placeholder="Primary Button" 
                              value={content.ctaPrimary || ""} 
                              onChange={(e) => setContent({ ...content, ctaPrimary: e.target.value })}
                              className="h-11 bg-background"
                            />
                            <Input 
                              placeholder="Secondary Button" 
                              value={content.ctaSecondary || ""} 
                              onChange={(e) => setContent({ ...content, ctaSecondary: e.target.value })}
                              className="h-11 bg-background"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold">Hero Image Reference</Label>
                          <div className="flex gap-3">
                            <Input 
                              placeholder="/path/to/image.jpg" 
                              value={content.heroImage || ""} 
                              onChange={(e) => setContent({ ...content, heroImage: e.target.value })}
                              className="h-11 bg-background font-code text-xs"
                            />
                            <Button size="icon" variant="secondary" className="h-11 w-11 shrink-0"><ImageIcon className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeSection === 'services' && (
                    <div className="space-y-8">
                      <div className="bg-muted/30 p-6 rounded-2xl space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                          <Layout className="w-3 h-3" /> Core Service Blocks
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[1, 2, 3, 4].map(num => (
                            <div key={num} className="p-4 bg-background rounded-xl border border-transparent hover:border-primary/20 transition-all space-y-4">
                              <div className="flex justify-between">
                                <Label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Service {num}</Label>
                                <button className="text-destructive hover:scale-110 transition-transform"><Trash2 className="w-3 h-3" /></button>
                              </div>
                              <Input 
                                placeholder="Service Title" 
                                value={content[`service${num}_title`] || ""}
                                onChange={(e) => setContent({ ...content, [`service${num}_title`]: e.target.value })}
                                className="h-10 text-[11px] font-bold uppercase tracking-wider"
                              />
                              <Textarea 
                                placeholder="Service Summary"
                                value={content[`service${num}_desc`] || ""}
                                onChange={(e) => setContent({ ...content, [`service${num}_desc`]: e.target.value })}
                                className="h-20 text-[10px] border-none bg-muted/50 focus-visible:ring-0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {(activeSection !== 'hero' && activeSection !== 'services') && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Settings2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Unified Schema Loader</h3>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">This section is being synchronized with the global blueprint</p>
                        </div>
                        <Button variant="outline" className="mt-4 text-[9px] uppercase tracking-widest h-9 px-6 border-transparent">Initialize Meta-Fields</Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
