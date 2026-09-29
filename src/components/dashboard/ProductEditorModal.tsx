import React, { useState, useEffect } from 'react';
import { ProductItem } from '@/data/productsCatalog';
import { cmsApi } from '@/services/cmsApi';
import {
  Package,
  Upload,
  X,
  Plus,
  Minus,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
  Box,
  Clock,
  Percent,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Star,
  Tag,
  Utensils,
  Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

export const DIVISION_CATEGORIES: Record<string, string[]> = {
  bakery: ['Bread', 'Pastries', 'Cakes', 'Artisan Specials', 'Savory Bakes'],
  dining: ['Proteins & Grills', 'The Rice Core', 'Soups & Natural Swallows', 'Yam & Pasta', 'Starters & Sides', 'Drinks & Cellar'],
  market: ['Pantry', 'Produce', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Household'],
  games: ['Hourly Passes', 'VR Experiences', 'Console Gaming', 'Arcade Coins', 'Table Games'],
  lounge: ['Cocktails', 'Wine & Champagne', 'Spirits', 'Small Plates'],
  water: ['Bottled Water', 'Water Dispensers', 'Bulk Packs', 'Accessories']
};

const UNIT_OPTIONS = ['portion', 'plate', 'bowl', 'bottle', 'glass', 'cup', 'piece', 'kg', 'litre', 'pack', 'bag', 'loaf', 'slot', 'session'];

const DIETARY_TAG_OPTIONS = ['Spicy', 'Vegetarian', 'Vegan', 'Contains Nuts', 'Nut-Free', 'Contains Shellfish', 'Gluten-Free', 'Halal', 'Dairy-Free', 'Contains Alcohol'];

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: ProductItem | null;
  defaultDivision?: 'bakery' | 'market' | 'dining' | 'games' | 'water' | 'lounge';
  onProductSaved: (product: ProductItem) => void;
  onProductDeleted?: (productId: string) => void;
}

export function ProductEditorModal({
  isOpen,
  onClose,
  productToEdit,
  defaultDivision = 'bakery',
  onProductSaved,
  onProductDeleted
}: ProductEditorModalProps) {
  const isEditing = !!productToEdit;

  // --- Core Identity ---
  const [division, setDivision] = useState<'bakery' | 'market' | 'dining' | 'games' | 'water' | 'lounge'>(
    productToEdit?.division || defaultDivision
  );
  const [category, setCategory] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');

  // --- Pricing ---
  const [price, setPrice] = useState<number>(10);
  const [costOfProduction, setCostOfProduction] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number>(0);

  // --- Stock ---
  const [stock, setStock] = useState<number>(5);
  const [minStockThreshold, setMinStockThreshold] = useState<number | ''>('');

  // --- Unit ---
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>('piece');

  // --- Preparation ---
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(11);

  // --- Content ---
  const [ingredients, setIngredients] = useState<string>('');
  const [suggestedPairing, setSuggestedPairing] = useState<string>('');

  // --- Discovery ---
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  // --- Media ---
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [videos, setVideos] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');
  const [model3d, setModel3d] = useState<string>('');

  // --- UI State ---
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sync state when editing or changing props
  useEffect(() => {
    if (productToEdit) {
      setDivision(productToEdit.division);
      setCategory(productToEdit.category || DIVISION_CATEGORIES[productToEdit.division]?.[0] || 'General');
      setName(productToEdit.name || '');
      setDescription(productToEdit.description || '');
      setStatus((productToEdit.status as 'active' | 'draft' | 'archived') || 'active');
      setPrice(productToEdit.price ?? 10);
      setCostOfProduction(productToEdit.cost_of_production ?? '');
      setDiscount(productToEdit.discount ?? 0);
      setStock(productToEdit.stock ?? 5);
      setMinStockThreshold(productToEdit.minimum_stock_threshold ?? '');
      setUnitOfMeasure(productToEdit.unit_of_measure || productToEdit.unit || 'piece');
      setPrepTimeMinutes(productToEdit.prep_time || productToEdit.prepTimeMinutes || 11);
      setIngredients(productToEdit.ingredients || '');
      setSuggestedPairing(productToEdit.suggested_pairing || '');
      setDietaryTags(productToEdit.dietary_tags || []);
      setIsFeatured(productToEdit.is_featured || false);

      const imgList = productToEdit.images && productToEdit.images.length > 0
        ? productToEdit.images
        : productToEdit.image ? [productToEdit.image] : [];
      setImages(imgList);
      setVideos(productToEdit.videos || []);
      setModel3d(productToEdit.model3d || '');
    } else {
      setDivision(defaultDivision);
      const defaultCats = DIVISION_CATEGORIES[defaultDivision] || ['General'];
      setCategory(defaultCats[0]);
      setName('');
      setDescription('');
      setStatus('active');
      setPrice(10);
      setCostOfProduction('');
      setDiscount(0);
      setStock(5);
      setMinStockThreshold('');
      setUnitOfMeasure('piece');
      setPrepTimeMinutes(11);
      setIngredients('');
      setSuggestedPairing('');
      setDietaryTags([]);
      setIsFeatured(false);
      setImages(['https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80']);
      setVideos([]);
      setModel3d('');
    }
    setShowDeleteConfirm(false);
  }, [productToEdit, defaultDivision, isOpen]);

  const handleDivisionChange = (newDiv: 'bakery' | 'market' | 'dining' | 'games' | 'water' | 'lounge') => {
    setDivision(newDiv);
    const validCats = DIVISION_CATEGORIES[newDiv] || ['General'];
    if (!validCats.includes(category)) setCategory(validCats[0]);
  };

  const toggleDietaryTag = (tag: string) => {
    setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Picture Upload
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddImageLink = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Video Upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) setVideos(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddVideoLink = () => {
    if (!newVideoUrl.trim()) return;
    setVideos(prev => [...prev, newVideoUrl.trim()]);
    setNewVideoUrl('');
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Save Item
  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Item Name Required', description: 'Please type a name for the product.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const primaryImage = images[0] || 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80';

      const payload: Partial<ProductItem> = {
        name: name.trim(),
        description: description.trim(),
        division,
        category: category.trim() || 'General',
        status,
        price: Number(price) || 10,
        cost_of_production: costOfProduction !== '' ? Number(costOfProduction) : undefined,
        discount: Number(discount) || 0,
        stock: Math.max(0, Number(stock) || 0),
        minimum_stock_threshold: minStockThreshold !== '' ? Number(minStockThreshold) : undefined,
        unit: unitOfMeasure.trim() || 'piece',
        unit_of_measure: unitOfMeasure.trim() || 'piece',
        prepTimeMinutes: (division === 'bakery' || division === 'dining') ? (Number(prepTimeMinutes) || 11) : undefined,
        prep_time: (division === 'bakery' || division === 'dining') ? (Number(prepTimeMinutes) || 11) : undefined,
        ingredients: ingredients.trim() || undefined,
        suggested_pairing: suggestedPairing.trim() || undefined,
        dietary_tags: dietaryTags.length > 0 ? dietaryTags : undefined,
        is_featured: isFeatured,
        image: primaryImage,
        images,
        videos,
        model3d: division === 'market' ? model3d.trim() : undefined,
      };

      if (isEditing && productToEdit) {
        await cmsApi.updateProduct(productToEdit.id, payload);
        const updated = { ...productToEdit, ...payload } as ProductItem;
        onProductSaved(updated);
        toast({ title: 'Item Saved! ✅', description: `"${updated.name}" has been updated.` });
      } else {
        const newProduct = await cmsApi.createProduct(payload);
        onProductSaved(newProduct as ProductItem);
        toast({ title: 'New Item Created! 🎉', description: `"${payload.name}" has been added to ${division} division.` });
      }
      onClose();
    } catch (err) {
      toast({ title: 'Error Saving Item', description: 'Could not sync item changes to database.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Delete Item
  const handleDelete = async () => {
    if (!productToEdit) return;
    setDeleting(true);
    try {
      await cmsApi.deleteProduct(productToEdit.id);
      onProductDeleted?.(productToEdit.id);
      toast({ title: 'Item Deleted 🗑️', description: `"${productToEdit.name}" was removed from the database.` });
      onClose();
    } catch (err) {
      toast({ title: 'Delete Failed', description: 'Could not remove product from database.', variant: 'destructive' });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const categoriesForDivision = DIVISION_CATEGORIES[division] || ['General'];

  const sectionClass = "space-y-3 p-4 bg-[#f8fafc] dark:bg-slate-800/50 rounded-2xl";
  const sectionTitle = "text-xs font-bold text-foreground flex items-center gap-1.5 mb-3";
  const inputClass = "text-xs h-9 border-none bg-background focus-visible:ring-1 focus-visible:ring-slate-400";
  const selectClass = "w-full text-xs h-9 rounded-xl border-none bg-background px-3 font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-slate-400";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-none p-6 bg-card text-card-foreground shadow-2xl rounded-2xl">
        <DialogHeader className="pb-2 border-none">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Package className="w-5 h-5 text-foreground" />
              {isEditing ? `Edit: ${name || productToEdit?.name}` : 'Add New Item'}
            </DialogTitle>
            <Badge className="bg-orange-500/10 text-orange-600 border-none uppercase text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {division} Division
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {isEditing ? `ID: ${productToEdit?.id} · Created: ${productToEdit?.createdAt || 'N/A'}` : 'Configure catalog item details, pricing, and discovery settings.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* === SECTION 1: Classification === */}
          <div className={sectionClass}>
            <p className={sectionTitle}><Layers className="w-3.5 h-3.5 text-muted-foreground" /> Classification</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Division</Label>
                <select value={division} onChange={(e) => handleDivisionChange(e.target.value as any)} className={selectClass}>
                  <option value="bakery">Bakery</option>
                  <option value="dining">Restaurant</option>
                  <option value="market">Supermarket</option>
                  <option value="games">Games</option>
                  <option value="lounge">Lounge</option>
                  <option value="water">Water</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category</Label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                  {categoriesForDivision.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Status</Label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className={selectClass}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* === SECTION 2: Basic Info === */}
          <div className={sectionClass}>
            <p className={sectionTitle}><Info className="w-3.5 h-3.5 text-muted-foreground" /> Basic Info</p>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-semibold">Item Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jollof Rice with Chicken" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Unit of Measure</Label>
                  <select value={unitOfMeasure} onChange={(e) => setUnitOfMeasure(e.target.value)} className={selectClass}>
                    {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Description</Label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe flavors, preparation style, or key highlights..."
                  className="w-full text-xs p-3 rounded-xl border-none bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* === SECTION 3: Pricing === */}
          <div className={sectionClass}>
            <p className={sectionTitle}><DollarSign className="w-3.5 h-3.5 text-muted-foreground" /> Pricing</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Selling Price (₦) *</Label>
                <Input type="number" min={0} value={price} onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))} className={inputClass + " font-mono"} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Cost of Production (₦) <span className="text-[10px] italic">Internal</span></Label>
                <Input type="number" min={0} value={costOfProduction} onChange={(e) => setCostOfProduction(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))} placeholder="e.g. 800" className={inputClass + " font-mono"} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Discount (₦)</Label>
                <Input type="number" min={0} value={discount} onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))} placeholder="0" className={inputClass + " font-mono"} />
              </div>
            </div>
            {costOfProduction !== '' && Number(costOfProduction) > 0 && (
              <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                Gross Profit: ₦{(price - Number(costOfProduction)).toLocaleString()} ({Math.round(((price - Number(costOfProduction)) / price) * 100)}% margin)
              </div>
            )}
          </div>

          {/* === SECTION 4: Stock === */}
          <div className={sectionClass}>
            <p className={sectionTitle}><Box className="w-3.5 h-3.5 text-muted-foreground" /> Stock & Availability</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Stock on Ground</Label>
                <div className="flex items-center gap-1.5">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setStock(s => Math.max(0, s - 1))} className="h-9 w-9 p-0 bg-background hover:bg-slate-200 dark:hover:bg-slate-700 border-none">
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <Input type="number" min={0} value={stock} onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))} className={inputClass + " text-center font-mono font-bold"} />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setStock(s => s + 1)} className="h-9 w-9 p-0 bg-background hover:bg-slate-200 dark:hover:bg-slate-700 border-none">
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Low-Stock Alert Threshold</Label>
                <Input type="number" min={0} value={minStockThreshold} onChange={(e) => setMinStockThreshold(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))} placeholder="e.g. 3 (alert when stock ≤ this)" className={inputClass} />
                <p className="text-[10px] text-muted-foreground">Chef gets alerted before stock hits zero.</p>
              </div>
            </div>
          </div>

          {/* === SECTION 5: Preparation (Dining & Bakery only) === */}
          {['dining', 'bakery'].includes(division) && (
            <div className={sectionClass}>
              <p className={sectionTitle}><Clock className="w-3.5 h-3.5 text-muted-foreground" /> Kitchen Preparation</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Prep Time (Minutes)</Label>
                  <div className="flex items-center gap-1.5">
                    <Input type="number" min={1} max={180} value={prepTimeMinutes} onChange={(e) => setPrepTimeMinutes(Math.max(1, parseInt(e.target.value) || 11))} className={inputClass + " font-mono font-bold w-24"} />
                    <span className="text-xs text-muted-foreground">mins · countdown timer fires on chef confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === SECTION 6: Content === */}
          <div className={sectionClass}>
            <p className={sectionTitle}><Utensils className="w-3.5 h-3.5 text-muted-foreground" /> Content & Pairings</p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Ingredients</Label>
                <textarea
                  rows={2}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. Long grain parboiled rice, tomatoes, Titus fish, seasoning..."
                  className="w-full text-xs p-3 rounded-xl border-none bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Suggested Pairing</Label>
                <Input value={suggestedPairing} onChange={(e) => setSuggestedPairing(e.target.value)} placeholder="e.g. Best enjoyed with a glass of Chapman" className={inputClass} />
              </div>
            </div>
          </div>

          {/* === SECTION 7: Discovery === */}
          <div className={sectionClass}>
            <p className={sectionTitle}><Tag className="w-3.5 h-3.5 text-muted-foreground" /> Dietary & Discovery</p>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold mb-2 block">Dietary & Allergen Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_TAG_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDietaryTag(tag)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                        dietaryTags.includes(tag)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-background text-muted-foreground border-border/50 hover:border-orange-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-xl">
                <div>
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-orange-500" /> Chef Special / Featured
                  </Label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Pin this item to the top hero section of the public menu.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeatured(f => !f)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer border-none ${isFeatured ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isFeatured ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* === SECTION 8: Images === */}
          <div className={sectionClass}>
            <p className={sectionTitle}><ImageIcon className="w-3.5 h-3.5 text-muted-foreground" /> Product Pictures ({images.length})</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <label htmlFor="file-upload-images" className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-background hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer text-xs font-semibold transition-colors border-none">
                <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                Upload from Device
                <input id="file-upload-images" type="file" accept="image/*" multiple onChange={handleImageFileUpload} className="hidden" />
              </label>
              <div className="flex items-center gap-1.5">
                <Input placeholder="https://... image link" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className={inputClass} />
                <Button type="button" size="sm" onClick={handleAddImageLink} className="bg-foreground hover:bg-foreground/90 text-background h-9 px-3 text-xs border-none">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden bg-background h-20 shadow-sm">
                    <img src={img} alt={`pic ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && <span className="absolute bottom-1 left-1 bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Cover</span>}
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-red-600 text-white rounded-full opacity-90 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* === SECTION 9: Videos === */}
          <div className={sectionClass}>
            <p className={sectionTitle}><VideoIcon className="w-3.5 h-3.5 text-muted-foreground" /> Product Videos ({videos.length})</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2">
              <label htmlFor="file-upload-videos" className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-background hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer text-xs font-semibold transition-colors border-none">
                <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                Upload Video File
                <input id="file-upload-videos" type="file" accept="video/*" multiple onChange={handleVideoFileUpload} className="hidden" />
              </label>
              <div className="flex items-center gap-1.5">
                <Input placeholder="https://... video URL" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} className={inputClass} />
                <Button type="button" size="sm" onClick={handleAddVideoLink} className="bg-foreground hover:bg-foreground/90 text-background h-9 px-3 text-xs border-none">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            {videos.length > 0 && (
              <div className="space-y-1.5">
                {videos.map((vid, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-background text-xs">
                    <span className="truncate max-w-[85%] font-mono text-[11px] text-muted-foreground">🎥 {vid.startsWith('data:') ? 'Uploaded local video file' : vid}</span>
                    <button type="button" onClick={() => handleRemoveVideo(idx)} className="p-1 text-muted-foreground hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* === SECTION 10: 3D Model (Supermarket only) === */}
          {division === 'market' && (
            <div className={sectionClass}>
              <p className={sectionTitle}><Box className="w-3.5 h-3.5 text-muted-foreground" /> 3D Model (Supermarket Aisle)</p>
              <Input value={model3d} onChange={(e) => setModel3d(e.target.value)} placeholder="https://example.com/models/cereal.glb" className={inputClass} />
            </div>
          )}
        </div>

        {/* Delete Confirm */}
        {showDeleteConfirm && (
          <div className="p-3.5 rounded-xl bg-red-500/10 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Permanently delete "{name || productToEdit?.name}"?
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="h-7 text-xs border-none">Cancel</Button>
              <Button size="sm" onClick={handleDelete} disabled={deleting} className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white font-bold border-none">
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 pt-3 flex items-center justify-between">
          {isEditing && !showDeleteConfirm && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)} className="mr-auto text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5 border-none">
              <Trash2 className="w-3.5 h-3.5" /> Delete Item
            </Button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border-none">Cancel</Button>
            <Button type="button" id="btn-save-product-modal" size="sm" onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1.5 border-none shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Item')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
