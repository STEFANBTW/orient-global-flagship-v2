'use client';

import React, { useState } from 'react';
import HomeCMS from '@/components/dashboard/cms/HomeCMS';
import InventoryPage from '@/app/dashboard/inventory/page';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Box, Palette, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'site'>('inventory');

  return (
    <div id="cms-page-wrapper" className="max-w-[1800px] mx-auto pb-20 space-y-6">
      {/* Top Navigation Tabs for CMS testing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold uppercase tracking-widest text-primary">Content Management System</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline text-foreground mt-1">
            CMS Control Hub
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test and manage all 90 catalog items, real-time inventory on ground, and live storefront copy.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'inventory' | 'site')} className="w-auto">
          <TabsList className="bg-card/70 border border-border/40 p-1 rounded-xl">
            <TabsTrigger value="inventory" className="text-xs font-semibold gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2">
              <Box className="w-3.5 h-3.5" />
              <span>Catalog & Inventory (90 Items)</span>
              <Badge variant="secondary" className="text-[13px] px-1.5 py-0 bg-primary-foreground/20 text-primary-foreground">
                Active Test
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="site" className="text-xs font-semibold gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2">
              <Palette className="w-3.5 h-3.5" />
              <span>Storefront Copy & Sections</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === 'inventory' ? (
        <div>
          <InventoryPage />
        </div>
      ) : (
        <div>
          <HomeCMS />
        </div>
      )}
    </div>
  );
}
