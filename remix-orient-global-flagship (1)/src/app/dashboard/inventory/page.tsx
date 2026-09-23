'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRoles } from '@/context/role-context';
import { cmsApi } from '@/services/cmsApi';
import { INITIAL_PRODUCTS_CATALOG, ProductItem } from '@/data/productsCatalog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  Search, 
  Plus, 
  Minus, 
  Edit3, 
  RotateCcw, 
  Box, 
  Layers, 
  Check, 
  AlertCircle, 
  Filter, 
  ChefHat, 
  Store, 
  Utensils, 
  Gamepad2, 
  Droplets, 
  Wine,
  Sparkles,
  ExternalLink,
  PackageCheck,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuickOrderModal } from '@/components/QuickOrderModal';
import { motion, AnimatePresence } from 'framer-motion';

const DIVISION_CONFIG = [
  { id: 'all', name: 'All Divisions', icon: Layers, expected: 90, color: 'text-foreground' },
  { id: 'bakery', name: 'Bakery', icon: ChefHat, expected: 20, color: 'text-amber-500' },
  { id: 'market', name: 'Market', icon: Store, expected: 20, color: 'text-cyan-500' },
  { id: 'dining', name: 'Dining', icon: Utensils, expected: 20, color: 'text-emerald-500' },
  { id: 'games', name: 'Games', icon: Gamepad2, expected: 5, color: 'text-blue-500' },
  { id: 'water', name: 'Water', icon: Droplets, expected: 5, color: 'text-sky-400' },
  { id: 'lounge', name: 'Lounge', icon: Wine, expected: 20, color: 'text-purple-500' },
];

export default function InventoryPage() {
  const { currentUser } = useRoles();
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS_CATALOG);
  const [loading, setLoading] = useState(true);
  const [activeDivision, setActiveDivision] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low' | 'out'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Order Placement Modal State
  const [orderProduct, setOrderProduct] = useState<ProductItem | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await cmsApi.getProducts();
      if (res.products && res.products.length > 0) {
        setProducts(res.products);
      } else {
        setProducts(INITIAL_PRODUCTS_CATALOG);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts(INITIAL_PRODUCTS_CATALOG);
    } finally {
      setLoading(false);
    }
  };

  // Quantity Stepper (Test #2: Change Quantity)
  const handleQuantityChange = async (product: ProductItem, delta: number) => {
    const currentStock = Number(product.stock) || 0;
    const newStock = Math.max(0, currentStock + delta);
    if (newStock === currentStock) return;

    setUpdatingId(product.id);
    // Optimistic UI update
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));

    try {
      await cmsApi.updateStock(product.id, newStock);
      toast({
        title: 'Quantity Updated',
        description: `${product.name}: stock adjusted to ${newStock} unit${newStock === 1 ? '' : 's'}.`,
      });
    } catch (error) {
      console.error('Failed to update stock:', error);
      // Rollback
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: currentStock } : p));
      toast({
        variant: 'destructive',
        title: 'Stock Update Failed',
        description: 'Could not sync quantity to database. Restoring previous value.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Direct Stock Input
  const handleDirectStockChange = async (product: ProductItem, valueStr: string) => {
    const parsed = parseInt(valueStr, 10);
    if (isNaN(parsed) || parsed < 0) return;

    setUpdatingId(product.id);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: parsed } : p));

    try {
      await cmsApi.updateStock(product.id, parsed);
      toast({
        title: 'Quantity Updated',
        description: `${product.name}: stock set to ${parsed}.`,
      });
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update stock on server.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Edit Modal (Test #1: Edit Item Details)
  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  // Save Edit Modal
  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setSaveLoading(true);

    try {
      const updatedData: Partial<ProductItem> = {
        name: editingProduct.name,
        price: Number(editingProduct.price) || 0,
        stock: Number(editingProduct.stock) || 0,
        category: editingProduct.category,
        division: editingProduct.division,
        description: editingProduct.description,
        sensitivity: editingProduct.sensitivity,
        volume: editingProduct.volume,
        image: editingProduct.image,
        highlight: editingProduct.highlight
      };

      await cmsApi.updateProduct(editingProduct.id, updatedData);

      // Update state
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...updatedData } : p));

      toast({
        title: 'Item Details Saved',
        description: `Successfully updated "${editingProduct.name}".`,
      });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Failed to save item:', error);
      toast({
        variant: 'destructive',
        title: 'Save Error',
        description: error?.message || 'Could not save item updates to database.',
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // Reset all 90 items back to 5 on ground
  const handleResetAllTo5 = async () => {
    setLoading(true);
    try {
      await cmsApi.seedInitialProducts(true);
      const res = await cmsApi.getProducts();
      setProducts(res.products);
      toast({
        title: 'Inventory Reset Complete',
        description: 'All 90 products have been restored with exactly 5 quantity on ground.',
      });
    } catch (error) {
      console.error('Failed to reset inventory:', error);
      toast({
        variant: 'destructive',
        title: 'Reset Failed',
        description: 'Could not reset inventory in database.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Division filter
      if (activeDivision !== 'all' && product.division !== activeDivision) {
        return false;
      }

      // Stock status filter
      if (stockFilter === 'in_stock' && (product.stock ?? 0) <= 2) return false;
      if (stockFilter === 'low' && ((product.stock ?? 0) === 0 || (product.stock ?? 0) > 2)) return false;
      if (stockFilter === 'out' && (product.stock ?? 0) !== 0) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(q);
        const matchesId = product.id?.toLowerCase().includes(q);
        const matchesCat = product.category?.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        return matchesName || matchesId || matchesCat || matchesDesc;
      }

      return true;
    });
  }, [products, activeDivision, stockFilter, searchQuery]);

  // Quick stats
  const totalCount = products.length;
  const inStockCount = products.filter(p => (p.stock ?? 0) > 2).length;
  const lowStockCount = products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 2).length;
  const outOfStockCount = products.filter(p => (p.stock ?? 0) === 0).length;

  return (
    <div id="inventory-management-root" className="space-y-6 max-w-[1600px] mx-auto pb-24 px-2 md:px-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/60 border border-border/40 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live CMS & Inventory Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline text-foreground mt-1">
            Master Inventory Catalog
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Complete multi-division catalog with 90 verified SKUs. Test editing item details and dynamically adjusting stock levels on ground in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/dashboard/orders">
            <Button
              id="btn-goto-orders"
              size="sm"
              className="text-xs gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <ChefHat className="w-3.5 h-3.5" />
              Kitchen & Orders Station
            </Button>
          </Link>

          <Button
            id="btn-refresh-inventory"
            variant="outline"
            size="sm"
            onClick={loadProducts}
            disabled={loading}
            className="text-xs gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            id="btn-reset-all-5"
            variant="secondary"
            size="sm"
            onClick={handleResetAllTo5}
            disabled={loading}
            className="text-xs gap-2 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            Reset All SKUs to 5
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setStockFilter('all')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${stockFilter === 'all' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/40 bg-card/40 hover:bg-card/70'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total SKUs</span>
            <Box className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{totalCount}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Across all 6 luxury divisions</p>
        </div>

        <div 
          onClick={() => setStockFilter('in_stock')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${stockFilter === 'in_stock' ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500' : 'border-border/40 bg-card/40 hover:bg-card/70'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">In Stock (&gt;2)</span>
            <PackageCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500 mt-2">{inStockCount}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Ready for immediate fulfillment</p>
        </div>

        <div 
          onClick={() => setStockFilter('low')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${stockFilter === 'low' ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500' : 'border-border/40 bg-card/40 hover:bg-card/70'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Low Stock (1-2)</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-2">{lowStockCount}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Requires replenishment soon</p>
        </div>

        <div 
          onClick={() => setStockFilter('out')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${stockFilter === 'out' ? 'border-red-500 bg-red-500/5 ring-1 ring-red-500' : 'border-border/40 bg-card/40 hover:bg-card/70'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Out of Stock (0)</span>
            <Minus className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-500 mt-2">{outOfStockCount}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Sold out / zero balance</p>
        </div>
      </div>

      {/* Division Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/40 scrollbar-none">
        {DIVISION_CONFIG.map((div) => {
          const Icon = div.icon;
          const count = div.id === 'all' 
            ? products.length 
            : products.filter(p => p.division === div.id).length;
          const isActive = activeDivision === div.id;

          return (
            <button
              key={div.id}
              id={`tab-div-${div.id}`}
              onClick={() => setActiveDivision(div.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-foreground' : div.color}`} />
              <span>{div.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/40 p-4 rounded-xl border border-border/30">
        <div className="relative flex items-center w-full sm:max-w-md">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none z-10 shrink-0" />
          <Input
            id="input-search-inventory"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, product name, or category..."
            className="pl-9 pr-8 h-9 text-xs bg-[#f8fafc] dark:bg-[#1a1a1a] border-none w-full"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-muted-foreground hover:text-foreground z-10"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-background/60 p-1 rounded-lg border border-border/40 text-xs">
            <span className="text-[10px] text-muted-foreground uppercase px-2 font-semibold">Filter:</span>
            <button
              onClick={() => setStockFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${stockFilter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter('in_stock')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${stockFilter === 'in_stock' ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
            >
              In Stock
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${stockFilter === 'low' ? 'bg-amber-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Low
            </button>
            <button
              onClick={() => setStockFilter('out')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${stockFilter === 'out' ? 'bg-red-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Out
            </button>
          </div>

          <Badge variant="outline" className="text-[11px] font-medium px-2.5 py-1">
            Showing <strong className="mx-1 text-foreground">{filteredProducts.length}</strong> of {products.length}
          </Badge>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-border/40 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-[70px]">Image</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-[110px]">SKU / ID</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground min-w-[220px]">Item & Category</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-[100px]">Division</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-[120px]">Unit Price</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground min-w-[210px]">
                <span className="flex items-center gap-1.5 text-primary">
                  <span>Quantity on Ground</span>
                  <Badge variant="secondary" className="text-[9px] py-0 px-1.5 bg-primary/10 text-primary">Test #2</Badge>
                </span>
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right min-w-[150px]">
                <span className="flex items-center justify-end gap-1.5 text-primary">
                  <span>Details</span>
                  <Badge variant="secondary" className="text-[9px] py-0 px-1.5 bg-primary/10 text-primary">Test #1</Badge>
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Box className="w-8 h-8 mb-2 opacity-40" />
                    <p className="font-semibold text-sm">No items match your filter criteria</p>
                    <p className="text-xs mt-1">Try clearing your search query or selecting "All Divisions".</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setSearchQuery(''); setActiveDivision('all'); setStockFilter('all'); }}
                      className="mt-3 text-xs"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const stock = Number(product.stock) || 0;
                const isLow = stock > 0 && stock <= 2;
                const isOut = stock === 0;
                const isUpdating = updatingId === product.id;

                return (
                  <TableRow 
                    key={product.id}
                    id={`product-row-${product.id}`}
                    className="border-border/30 hover:bg-muted/30 transition-colors group"
                  >
                    {/* Thumbnail Image */}
                    <TableCell className="p-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/60 border border-border/40 flex items-center justify-center shrink-0">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Box className="w-5 h-5 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableCell>

                    {/* SKU ID */}
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {product.id}
                      {product.sensitivity === 'high' && (
                        <span className="block text-[8px] font-sans font-bold text-amber-500 uppercase">High Sensitivity</span>
                      )}
                    </TableCell>

                    {/* Name & Category */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">
                            {product.category}
                          </span>
                          {product.volume && (
                            <span className="text-[10px] text-muted-foreground/70">
                              • {product.volume}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Division Badge */}
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="text-[10px] font-semibold uppercase tracking-wider capitalize border-border/50 bg-background/50"
                      >
                        {product.division}
                      </Badge>
                    </TableCell>

                    {/* Unit Price */}
                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                      ₦{product.price.toLocaleString()}
                    </TableCell>

                    {/* Quantity Stepper (Test #2) */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Stepper Buttons */}
                        <div className="flex items-center bg-background border border-border/60 rounded-lg p-0.5 shadow-sm">
                          <button
                            id={`btn-dec-${product.id}`}
                            onClick={() => handleQuantityChange(product, -1)}
                            disabled={stock <= 0 || isUpdating}
                            title="Decrease quantity by 1"
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted active:scale-95 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <input
                            id={`input-stock-${product.id}`}
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => handleDirectStockChange(product, e.target.value)}
                            disabled={isUpdating}
                            title="Directly edit quantity on ground"
                            className="w-12 text-center text-xs font-bold font-mono bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />

                          <button
                            id={`btn-inc-${product.id}`}
                            onClick={() => handleQuantityChange(product, 1)}
                            disabled={isUpdating}
                            title="Increase quantity by 1"
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted active:scale-95 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Status Pill */}
                        <div>
                          {isOut ? (
                            <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold uppercase">
                              Out
                            </Badge>
                          ) : isLow ? (
                            <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold uppercase">
                              Low ({stock})
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold uppercase">
                              In Stock ({stock})
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Action Buttons: Order & Edit Details */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          id={`btn-order-${product.id}`}
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setOrderProduct(product);
                            setIsOrderModalOpen(true);
                          }}
                          className="text-xs h-8 gap-1 font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
                          title="Place order for this item (₦10)"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Order (₦10)</span>
                        </Button>

                        <Button
                          id={`btn-edit-details-${product.id}`}
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(product)}
                          className="text-xs h-8 gap-1.5 hover:border-primary hover:text-primary transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Product Modal Dialog (Test #1) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent id="modal-edit-product-dialog" className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                {editingProduct?.id}
              </Badge>
              <span className="text-xs text-muted-foreground capitalize">
                Division: {editingProduct?.division}
              </span>
            </div>
            <DialogTitle className="text-xl font-bold font-headline mt-1">
              Edit Item Details
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update pricing, quantity on ground, category, descriptions, and media for this SKU.
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-4 py-3">
              {/* Product Name */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-semibold">Product / Item Name *</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Raspberry Velvet Cake"
                  className="text-sm"
                />
              </div>

              {/* Grid 2 Cols: Category & Unit/Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-category" className="text-xs font-semibold">Category *</Label>
                  <Input
                    id="edit-category"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    placeholder="e.g. Signature Bakery"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-volume" className="text-xs font-semibold">Volume / Unit / Weight</Label>
                  <Input
                    id="edit-volume"
                    value={editingProduct.volume || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                    placeholder="e.g. 1kg cake, 750ml bottle, 30 min session"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Grid 2 Cols: Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price" className="text-xs font-semibold">Unit Price (₦) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) || 0 })}
                    placeholder="e.g. 45000"
                    className="text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-stock" className="text-xs font-semibold">Quantity on Ground *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    min="0"
                    value={editingProduct.stock ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) || 0 })}
                    placeholder="5"
                    className="text-sm font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-description" className="text-xs font-semibold">Item Description & Notes</Label>
                <Textarea
                  id="edit-description"
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Artisanal description of the item, ingredients, or presentation details..."
                  className="text-sm resize-none"
                />
              </div>

              {/* Image URL & Live Preview */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-image" className="text-xs font-semibold">Product Photo URL</Label>
                <div className="flex gap-3 items-start">
                  <Input
                    id="edit-image"
                    value={editingProduct.image || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="text-xs font-mono flex-1"
                  />
                  {editingProduct.image && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                      <img 
                        src={editingProduct.image} 
                        alt="Preview" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 mt-4 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={saveLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              id="btn-save-edit-product"
              onClick={handleSaveEdit}
              disabled={saveLoading}
              className="text-xs gap-2"
            >
              {saveLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Order Modal (₦10/item) */}
      <QuickOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          loadProducts();
        }}
        preselectedProduct={orderProduct}
      />
    </div>
  );
}
