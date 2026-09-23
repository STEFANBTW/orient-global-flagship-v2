import React, { useState, useEffect } from 'react';
import { ProductItem } from '@/data/productsCatalog';
import { cmsApi } from '@/services/cmsApi';
import { 
  Package, 
  Upload, 
  Link as LinkIcon, 
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
  AlertTriangle
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

  const [division, setDivision] = useState<'bakery' | 'market' | 'dining' | 'games' | 'water' | 'lounge'>(
    productToEdit?.division || defaultDivision
  );
  const [category, setCategory] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(10);
  const [discount, setDiscount] = useState<number>(0);
  const [stock, setStock] = useState<number>(5);
  const [unit, setUnit] = useState<string>('piece');
  const [description, setDescription] = useState<string>('');
  
  // Media state
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [videos, setVideos] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');

  // Specialized fields
  const [model3d, setModel3d] = useState<string>('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(11);

  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sync state when editing or changing props
  useEffect(() => {
    if (productToEdit) {
      setDivision(productToEdit.division);
      setCategory(productToEdit.category || DIVISION_CATEGORIES[productToEdit.division]?.[0] || 'General');
      setName(productToEdit.name || '');
      setPrice(productToEdit.price ?? 10);
      setDiscount(productToEdit.discount ?? 0);
      setStock(productToEdit.stock ?? 5);
      setUnit(productToEdit.unit || 'piece');
      setDescription(productToEdit.description || '');

      const imgList = productToEdit.images && productToEdit.images.length > 0
        ? productToEdit.images
        : productToEdit.image ? [productToEdit.image] : [];
      setImages(imgList);

      setVideos(productToEdit.videos || []);
      setModel3d(productToEdit.model3d || '');
      setPrepTimeMinutes(productToEdit.prepTimeMinutes || 11);
    } else {
      setDivision(defaultDivision);
      const defaultCats = DIVISION_CATEGORIES[defaultDivision] || ['General'];
      setCategory(defaultCats[0]);
      setName('');
      setPrice(10);
      setDiscount(0);
      setStock(5);
      setUnit('piece');
      setDescription('');
      setImages(['https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80']);
      setVideos([]);
      setModel3d('');
      setPrepTimeMinutes(11);
    }
    setShowDeleteConfirm(false);
  }, [productToEdit, defaultDivision, isOpen]);

  // When division changes, ensure category matches division's unique category options
  const handleDivisionChange = (newDiv: 'bakery' | 'market' | 'dining' | 'games' | 'water' | 'lounge') => {
    setDivision(newDiv);
    const validCats = DIVISION_CATEGORIES[newDiv] || ['General'];
    if (!validCats.includes(category)) {
      setCategory(validCats[0]);
    }
  };

  // Picture Upload from local device
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImages(prev => [...prev, result]);
          toast({
            title: 'Image Uploaded',
            description: `Added "${file.name}" to pictures gallery.`,
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Add Picture by Link
  const handleAddImageLink = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
    toast({
      title: 'Picture Added',
      description: 'Added image URL to product pictures.',
    });
  };

  // Remove Picture
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Video Upload from local device
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setVideos(prev => [...prev, result]);
          toast({
            title: 'Video Uploaded',
            description: `Added "${file.name}" to product videos.`,
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Add Video by Link
  const handleAddVideoLink = () => {
    if (!newVideoUrl.trim()) return;
    setVideos(prev => [...prev, newVideoUrl.trim()]);
    setNewVideoUrl('');
    toast({
      title: 'Video Link Added',
      description: 'Added video URL to product.',
    });
  };

  // Remove Video
  const handleRemoveVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Save Item
  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: 'Item Name Required',
        description: 'Please type a name for the product.',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const primaryImage = images[0] || 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80';

      const payload: Partial<ProductItem> = {
        name: name.trim(),
        division,
        category: category.trim() || 'General',
        price: Number(price) || 10,
        discount: Number(discount) || 0,
        stock: Math.max(0, Number(stock) || 0),
        unit: unit.trim() || 'piece',
        description: description.trim(),
        image: primaryImage,
        images,
        videos,
        model3d: division === 'market' ? model3d.trim() : undefined,
        prepTimeMinutes: (division === 'bakery' || division === 'dining') ? (Number(prepTimeMinutes) || 11) : undefined,
        status: 'active'
      };

      if (isEditing && productToEdit) {
        await cmsApi.updateProduct(productToEdit.id, payload);
        const updated = { ...productToEdit, ...payload } as ProductItem;
        onProductSaved(updated);
        toast({
          title: 'Item Saved Successfully! ✅',
          description: `"${updated.name}" has been updated in Firestore.`,
        });
      } else {
        const newProduct = await cmsApi.createProduct(payload);
        onProductSaved(newProduct as ProductItem);
        toast({
          title: 'New Item Created! 🎉',
          description: `"${payload.name}" has been added to ${division} division.`,
        });
      }
      onClose();
    } catch (err) {
      toast({
        title: 'Error Saving Item',
        description: 'Could not sync item changes to database.',
        variant: 'destructive'
      });
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
      toast({
        title: 'Item Deleted 🗑️',
        description: `"${productToEdit.name}" was removed from the database.`,
      });
      onClose();
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: 'Could not remove product from database.',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const categoriesForDivision = DIVISION_CATEGORIES[division] || ['General'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-none p-6 bg-card text-card-foreground shadow-2xl rounded-2xl">
        <DialogHeader className="pb-2 border-none">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Package className="w-5 h-5 text-foreground" />
              {isEditing ? `Edit Item: ${name || productToEdit?.name}` : 'Add New Item to Catalog'}
            </DialogTitle>
            <Badge className="bg-[#f8fafc] dark:bg-slate-800 text-foreground border-none uppercase text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {division} Division
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Configure catalog item details, manage multiple pictures and videos, adjust stock on ground, and set preparation timers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 1. Division & Dynamic Category Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="item-division" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" /> Store Division
              </Label>
              <select
                id="item-division"
                value={division}
                onChange={(e) => handleDivisionChange(e.target.value as any)}
                className="w-full text-xs h-9 rounded-xl border-none bg-[#f8fafc] dark:bg-slate-800 px-3 font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="bakery">Bakery & Pastries</option>
                <option value="dining">Dining & Restaurant</option>
                <option value="market">Supermarket & Groceries</option>
                <option value="games">Arcade & Gaming Arena</option>
                <option value="lounge">Lounge & Cocktail Bar</option>
                <option value="water">Pure Table Water</option>
              </select>
            </div>

            {/* Dynamic Category Dropdown specific to the chosen division */}
            <div className="space-y-1.5">
              <Label htmlFor="item-category" className="text-xs font-semibold text-foreground">
                Category ({division})
              </Label>
              <select
                id="item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs h-9 rounded-xl border-none bg-[#f8fafc] dark:bg-slate-800 px-3 font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {categoriesForDivision.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Item Name & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="item-name" className="text-xs font-semibold text-foreground">
                Item / Service Name *
              </Label>
              <Input
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fresh Artisan Sourdough"
                className="text-xs h-9 border-none bg-[#f8fafc] dark:bg-slate-800 focus-visible:ring-1 focus-visible:ring-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-unit" className="text-xs font-semibold text-foreground">
                Unit of Measure
              </Label>
              <Input
                id="item-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. loaf, plate, piece, bottle"
                className="text-xs h-9 border-none bg-[#f8fafc] dark:bg-slate-800 focus-visible:ring-1 focus-visible:ring-slate-400"
              />
            </div>
          </div>

          {/* 3. Price, Discount & Stock with interactive [-] / [+] Steppers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl">
            {/* Price Input */}
            <div className="space-y-1.5">
              <Label htmlFor="item-price" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" /> Price (₦)
              </Label>
              <Input
                id="item-price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="text-xs h-9 font-mono border-none bg-background focus-visible:ring-1 focus-visible:ring-slate-400"
              />
            </div>

            {/* Discount Input */}
            <div className="space-y-1.5">
              <Label htmlFor="item-discount" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-muted-foreground" /> Discount (₦ or %)
              </Label>
              <Input
                id="item-discount"
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="0"
                className="text-xs h-9 font-mono border-none bg-background focus-visible:ring-1 focus-visible:ring-slate-400"
              />
            </div>

            {/* Quantity / Stock with interactive Minus & Plus Steppers */}
            <div className="space-y-1.5">
              <Label htmlFor="item-stock" className="text-xs font-semibold text-foreground">
                Stock on Ground
              </Label>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  id="btn-stock-modal-minus"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStock(s => Math.max(0, s - 1))}
                  className="h-9 w-9 p-0 bg-background hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground transition-colors duration-200 border-none"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>

                <Input
                  id="item-stock"
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="text-xs h-9 text-center font-mono font-bold border-none bg-background focus-visible:ring-1 focus-visible:ring-slate-400"
                />

                <Button
                  type="button"
                  id="btn-stock-modal-plus"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStock(s => s + 1)}
                  className="h-9 w-9 p-0 bg-background hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground transition-colors duration-200 border-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* 4. Division-Specific Fields: 3D Model (Supermarket) & Preparation Time (Dining/Bakery) */}
          {division === 'market' && (
            <div className="space-y-1.5 p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl">
              <Label htmlFor="item-model3d" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-muted-foreground" /> Supermarket 3D Model URL (.glb / .gltf / viewer link)
              </Label>
              <Input
                id="item-model3d"
                value={model3d}
                onChange={(e) => setModel3d(e.target.value)}
                placeholder="https://example.com/models/supermarket-cereal.glb"
                className="text-xs h-9 border-none bg-background focus-visible:ring-1 focus-visible:ring-slate-400"
              />
              <p className="text-[11px] text-muted-foreground">
                Paste a 3D asset link to render interactive product models in the supermarket aisle.
              </p>
            </div>
          )}

          {['dining', 'bakery'].includes(division) && (
            <div className="space-y-1.5 p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl">
              <Label htmlFor="item-preptime" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Kitchen Preparation Time (Minutes)
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="item-preptime"
                  type="number"
                  min={1}
                  max={120}
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(Math.max(1, parseInt(e.target.value) || 15))}
                  className="text-xs h-9 w-32 font-mono font-bold border-none bg-background focus-visible:ring-1 focus-visible:ring-slate-400"
                />
                <span className="text-xs text-muted-foreground font-medium">
                  When a customer orders this, the chef order service will automatically start a {prepTimeMinutes}-minute preparation countdown!
                </span>
              </div>
            </div>
          )}

          {/* 5. Description */}
          <div className="space-y-1.5">
            <Label htmlFor="item-desc" className="text-xs font-semibold text-foreground">
              Description & Highlights
            </Label>
            <textarea
              id="item-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe flavors, ingredients, dietary notes, or features..."
              className="w-full text-xs p-3 rounded-xl border-none bg-[#f8fafc] dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* 6. Pictures Management (Local Upload + Link + Multi-Picture Gallery) */}
          <div className="space-y-3 p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-muted-foreground" /> Product Pictures ({images.length})
              </Label>
              <span className="text-[11px] text-muted-foreground">Upload from device or paste web link</span>
            </div>

            {/* Upload or Link Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2">
                <label 
                  htmlFor="file-upload-images"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-background hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground cursor-pointer text-xs font-semibold transition-colors duration-200 border-none"
                >
                  <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Upload from Device</span>
                  <input
                    id="file-upload-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="https://... image link"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="text-xs h-9 border-none bg-background focus-visible:ring-1 focus-visible:ring-slate-400"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddImageLink}
                  className="bg-foreground hover:bg-foreground/90 text-background h-9 px-3 text-xs transition-colors duration-200 border-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Picture Gallery with delete badges */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden bg-background h-20 shadow-2xs">
                    <img 
                      src={img} 
                      alt={`Product pic ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-red-600 text-white rounded-full opacity-90 group-hover:opacity-100 transition-colors"
                      title="Delete picture"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. Videos Management (Local Upload + Link + Multi-Video List) */}
          <div className="space-y-3 p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <VideoIcon className="w-4 h-4 text-muted-foreground" /> Product Videos ({videos.length})
              </Label>
              <span className="text-[11px] text-muted-foreground">Upload from device or paste link</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label 
                htmlFor="file-upload-videos"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-background hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground cursor-pointer text-xs font-semibold transition-colors duration-200 border-none"
              >
                <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Upload Video File</span>
                <input
                  id="file-upload-videos"
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="https://... video URL"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="text-xs h-9 border-none bg-background focus-visible:ring-1 focus-visible:ring-slate-400"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddVideoLink}
                  className="bg-foreground hover:bg-foreground/90 text-background h-9 px-3 text-xs transition-colors duration-200 border-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Video List */}
            {videos.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {videos.map((vid, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-background text-xs">
                    <span className="truncate max-w-[85%] font-mono text-[11px] text-muted-foreground">
                      🎥 {vid.startsWith('data:') ? 'Uploaded local video file' : vid}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      className="p-1 text-muted-foreground hover:text-red-600 transition-colors"
                      title="Delete video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Warning Box */}
        {showDeleteConfirm && (
          <div className="p-3.5 rounded-xl bg-red-500/10 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Permanently delete "{name || productToEdit?.name}"?</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                className="h-7 text-xs border-none hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white font-bold border-none"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Item'}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-3 flex items-center justify-between">
          {/* Delete button (negative action on hover) */}
          {isEditing && !showDeleteConfirm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="mr-auto text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5 transition-colors duration-200 border-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Item
            </Button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors duration-200 border-none"
            >
              Cancel
            </Button>

            {/* Save button */}
            <Button
              type="button"
              id="btn-save-product-modal"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1.5 transition-colors duration-200 border-none shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Item')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
