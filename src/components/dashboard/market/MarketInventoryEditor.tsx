import React, { useState, useEffect } from 'react';
import { cmsApi } from '@/services/cmsApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRoles } from '@/context/role-context';

export default function MarketInventoryEditor() {
 const [products, setProducts] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [isDialogOpen, setIsDialogOpen] = useState(false);
 const [editingProduct, setEditingProduct] = useState<any>(null);
 const { toast } = useToast();

 const [formData, setFormData] = useState({
 name: '',
 price: 0,
 oldPrice: 0,
 unit: '',
 category: 'Produce',
 stock: 0,
 image: '',
 tags: '',
 tierInfo: ''
 });

 useEffect(() => {
 fetchProducts();
 }, []);

 const fetchProducts = async () => {
 try {
 setLoading(true);
 const data = await cmsApi.getProducts();
 setProducts(data.products || []);
 } catch (error) {
 toast({ variant: "destructive", title: "Error", description: "Failed to fetch products" });
 } finally {
 setLoading(false);
 }
 };

 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
 setSearchTerm(e.target.value);
 };

 const filteredProducts = products.filter(p => 
 p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 p.category.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const handleOpenDialog = (product?: any) => {
 if (product) {
 setEditingProduct(product);
 setFormData({
 name: product.name,
 price: product.price,
 oldPrice: product.oldPrice || 0,
 unit: product.unit,
 category: product.category,
 stock: product.stock,
 image: product.image,
 tags: product.tags?.join(', ') || '',
 tierInfo: product.tierInfo || ''
 });
 } else {
 setEditingProduct(null);
 setFormData({
 name: '',
 price: 0,
 oldPrice: 0,
 unit: '',
 category: 'Produce',
 stock: 0,
 image: '',
 tags: '',
 tierInfo: ''
 });
 }
 setIsDialogOpen(true);
 };

 const { currentUser, requests, updateRequestStatus, addNotification, createRequest } = useRoles();
 const role = currentUser?.role;
 const isHOD = role === 'hod' || role === 'boss';

 const handleSubmit = async () => {
 try {
 const payload = {
 ...formData,
 tags: formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '')
 };

 if (!isHOD) {
 // Staff creates a request
 createRequest({
 requesterId: currentUser?.id || '',
 requesterName: currentUser?.name || '',
 targetRoleId: 'hod',
 division: 'market',
 actionLabel: editingProduct ? `Update Product: ${payload.name}` : `Create Product: ${payload.name}`,
 description: editingProduct ? `Requested to update product details for ${payload.name}` : `Requested to add new product ${payload.name}`,
 oldValue: editingProduct ? JSON.stringify(editingProduct) : undefined,
 newValue: JSON.stringify(payload),
 payload: { type: 'product', action: editingProduct ? 'update' : 'create', id: editingProduct?.id, data: payload }
 });
 toast({ title: "Request Sent", description: "Your product update request has been sent for approval." });
 } else {
 // HOD or Boss updates directly
 if (editingProduct) {
 await cmsApi.updateProduct(editingProduct.id, payload);
 toast({ title: "Success", description: "Product updated successfully" });

 // Check for conflicting pending requests from staff
 const conflictingRequests = requests.filter(r => 
 r.status === 'pending' && 
 r.payload?.type === 'product' && 
 r.payload?.id === editingProduct.id
 );

 conflictingRequests.forEach(req => {
 // If the staff's requested changes don't exactly match what the HOD just did
 const requestedData = req.payload?.data;
 const isExactMatch = JSON.stringify(requestedData) === JSON.stringify(payload);

 if (!isExactMatch) {
 updateRequestStatus(req.id, 'declined', 'Superseded by direct HOD edit');
 addNotification({
 userId: req.requesterId,
 message: `Your request to update "${editingProduct.name}" was superseded by a direct change from the HOD.`
 });
 } else {
 // If it matches exactly, we can just approve it
 updateRequestStatus(req.id, 'approved', 'HOD applied these exact changes directly');
 addNotification({
 userId: req.requesterId,
 message: `Your requested changes to "${editingProduct.name}" were applied directly by the HOD.`
 });
 }
 });

 } else {
 await cmsApi.createProduct(payload);
 toast({ title: "Success", description: "Product created successfully" });
 }
 }

 setIsDialogOpen(false);
 fetchProducts();
 } catch (error) {
 toast({ variant: "destructive", title: "Error", description: "Failed to save product" });
 }
 };

 const handleDelete = async (id: string, name: string) => {
 if (!isHOD) {
 toast({ variant: "destructive", title: "Access Denied", description: "Only HOD or Boss can delete products." });
 return;
 }
 if (confirm("Are you sure you want to delete this product?")) {
 try {
 await cmsApi.deleteProduct(id);
 toast({ title: "Success", description: "Product deleted successfully" });
 
 // Check for conflicting pending requests from staff
 const conflictingRequests = requests.filter(r => 
 r.status === 'pending' && 
 r.payload?.type === 'product' && 
 r.payload?.id === id
 );

 conflictingRequests.forEach(req => {
 updateRequestStatus(req.id, 'declined', 'Product was deleted by HOD');
 addNotification({
 userId: req.requesterId,
 message: `Your request to update "${name}" was superseded because the product was deleted by the HOD.`
 });
 });

 fetchProducts();
 } catch (error) {
 toast({ variant: "destructive", title: "Error", description: "Failed to delete product" });
 }
 }
 };

 return (
 <Card className="h-full flex flex-col border-none shadow-none">
 <CardHeader className="px-0">
 <div className="flex items-center justify-between">
 <div>
 <CardTitle>Product Inventory</CardTitle>
 <CardDescription>Manage your supermarket products, prices, and stock levels.</CardDescription>
 </div>
 <Button onClick={() => handleOpenDialog()} className="bg-success hover:bg-success/90">
 <Plus className="w-4 h-4 mr-2" /> Add Product
 </Button>
 </div>
 <div className="relative flex items-center mt-4">
 <Search className="absolute left-3 w-4 h-4 text-muted-foreground/70 pointer-events-none z-10 shrink-0" />
 <Input 
 placeholder="Search products..." 
 className="pl-9 h-9 text-xs bg-[#f8fafc] dark:bg-[#1a1a1a] border-none w-full" 
 value={searchTerm}
 onChange={handleSearch}
 />
 </div>
 </CardHeader>
 <CardContent className="px-0 flex-1 overflow-auto">
 {loading ? (
 <div className="flex items-center justify-center h-40">
 <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/70" />
 </div>
 ) : (
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Product</TableHead>
 <TableHead>Category</TableHead>
 <TableHead className="text-right">Price</TableHead>
 <TableHead className="text-right">Stock</TableHead>
 <TableHead className="text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {filteredProducts.map((product) => (
 <TableRow key={product.id}>
 <TableCell className="font-medium">
 <div className="flex items-center gap-3">
 {product.image && (
 <div className="w-8 h-8 rounded bg-secondary overflow-hidden">
 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
 </div>
 )}
 {product.name}
 </div>
 </TableCell>
 <TableCell>{product.category}</TableCell>
 <TableCell className="text-right">₦{product.price.toLocaleString()} / {product.unit}</TableCell>
 <TableCell className="text-right">{product.stock}</TableCell>
 <TableCell className="text-right">
 <div className="flex justify-end gap-2">
 <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
 <Pencil className="w-4 h-4 text-muted-foreground" />
 </Button>
 <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id, product.name)}>
 <Trash2 className="w-4 h-4 text-destructive" />
 </Button>
 </div>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 )}
 </CardContent>

 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
 <DialogContent>
 <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
 <div className="grid gap-4 py-4">
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="name" className="text-right">Name</Label>
 <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="col-span-3" />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="category" className="text-right">Category</Label>
 <Input id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="col-span-3" />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="price" className="text-right">Price (₦)</Label>
 <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="col-span-3" />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="oldPrice" className="text-right">Old Price (₦)</Label>
 <Input id="oldPrice" type="number" value={formData.oldPrice} onChange={(e) => setFormData({...formData, oldPrice: Number(e.target.value)})} className="col-span-3" placeholder="Leave 0 if no discount" />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="unit" className="text-right">Unit</Label>
 <Input id="unit" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="col-span-3" placeholder="e.g. kg, pack, bunch" />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="stock" className="text-right">Stock</Label>
 <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="col-span-3" />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="image" className="text-right">Image URL</Label>
 <Input id="image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="col-span-3" />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="tags" className="text-right">Tags</Label>
 <Input id="tags" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="col-span-3" placeholder="e.g. Fresh, Sale, Bulk (comma separated)" />
 </div>
 <div className="grid grid-cols-4 items-center gap-4">
 <Label htmlFor="tierInfo" className="text-right">Tier Info</Label>
 <Input id="tierInfo" value={formData.tierInfo} onChange={(e) => setFormData({...formData, tierInfo: e.target.value})} className="col-span-3" placeholder="e.g. -10% @ 10+" />
 </div>
 </div>
 <DialogFooter>
 <Button onClick={handleSubmit}>{editingProduct ? 'Save Changes' : 'Create Product'}</Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </Card>
 );
}
