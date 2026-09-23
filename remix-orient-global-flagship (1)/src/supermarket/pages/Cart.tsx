import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { cmsApi } from '../../services/cmsApi';
import { orderService } from '../../services/orderService';
import { useToast } from '@/hooks/use-toast';
import { useRoles } from '../../context/role-context';

interface CartProps {
 onNavigate?: (page: any) => void;
}

const Cart: React.FC<CartProps> = ({ onNavigate }) => {
 const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
 const { toast } = useToast();
 const { currentUser } = useRoles();
 const [isPlacingOrder, setIsPlacingOrder] = useState(false);
 const [orderSuccess, setOrderSuccess] = useState(false);
 const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
 const [shippingAddress, setShippingAddress] = useState('Orient Market, Lagos');
 
 const handlePlaceOrder = async () => {
 if (cart.items.length === 0) return;
 if (!shippingAddress.trim()) {
 toast({
 title: "Address Required",
 description: "Please enter a shipping address.",
 variant: "destructive"
 });
 return;
 }
 
 setIsPlacingOrder(true);
 try {
 const order = await orderService.placeOrder({
 customerName: currentUser?.name || 'Customer',
 customerPhone: '0803-123-4567',
 shippingAddress: shippingAddress.trim(),
 items: cart.items.map(item => ({
 id: item.id,
 name: item.name,
 quantity: item.quantity,
 division: 'market',
 category: item.category,
 image: item.image,
 price: 10
 })),
 prepDurationMinutes: 25
 });
 
 setPlacedOrderId(order.id);
 setOrderSuccess(true);
 clearCart();
 toast({
 title: "Order Placed Successfully! (₦10/item)",
 description: `Order #${order.id} sent to kitchen. Awaiting chef confirmation!`,
 });
 } catch (error: any) {
 toast({
 title: "Order Failed",
 description: error.message || "Something went wrong. Please try again.",
 variant: "destructive"
 });
 } finally {
 setIsPlacingOrder(false);
 }
 };

 // Separation of concerns for display
 const retailItems = cart.items.filter(i => i.context === 'RETAIL');
 const wholesaleItems = cart.items.filter(i => i.context === 'WHOLESALE');

 return (
 <div className="font-sans bg-background min-h-screen flex flex-col transition-colors duration-300">
 <header className="bg-card border-b border-border sticky top-0 z-50 transition-colors duration-300">
 <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="material-icons text-[#ff6a00] text-3xl">shopping_basket</span>
 <h1 className="text-2xl font-bold tracking-tight">
 <span className="text-[#ff6a00]">ORIENT</span> <span className="text-foreground ">SUPERMARKET</span>
 </h1>
 </div>
 <div className="hidden md:flex items-center gap-4">
 <div className="flex items-center gap-2 text-[#ff6a00] font-semibold"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#ff6a00] text-white text-xs">1</span><span>Unified Cart</span></div>
 <div className="w-12 h-px bg-gray-300 "></div>
 <div className="flex items-center gap-2 text-muted-foreground "><span className="flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs">2</span><span>Logistics</span></div>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground "><span className="material-icons text-lg">lock</span> Secure Checkout</div>
 {currentUser && (
 <div className="w-8 h-8 rounded-full bg-foreground text-background font-bold text-xs flex items-center justify-center">
 {currentUser.avatar}
 </div>
 )}
 </div>
 </div>
 </header>

 <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 lg:px-6 py-8">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 <div className="lg:col-span-8 space-y-6">
 <div className="flex items-center justify-between mb-2">
 <h1 className="text-2xl font-bold text-foreground ">Shopping Cart <span className="text-muted-foreground text-lg font-normal ml-2">({cart.items.length} Items)</span></h1>
 <button onClick={clearCart} className="text-[#ff6a00] font-medium text-sm flex items-center gap-1"><span className="material-icons text-sm">delete_outline</span> Clear Cart</button>
 </div>

 {cart.items.length === 0 && !orderSuccess && (
 <div className="p-12 text-center bg-card rounded-xl border border-border ">
 <span className="material-icons text-6xl text-background mb-4">production_quantity_limits</span>
 <p className="text-muted-foreground text-lg">Your cart is empty.</p>
 </div>
 )}

 {orderSuccess && (
 <div className="p-10 text-center bg-card rounded-2xl border border-primary/40 shadow-xl space-y-4">
 <span className="material-icons text-6xl text-primary mb-2">shopping_bag</span>
 <h2 className="text-2xl font-bold text-foreground">Order Successfully Placed! (₦10/item)</h2>
 {placedOrderId && (
 <div className="inline-block bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full font-mono text-sm font-bold text-primary">
 Order #{placedOrderId}
 </div>
 )}
 <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl max-w-md mx-auto text-xs text-amber-600 dark:text-amber-400">
 <p className="font-bold text-sm mb-1">⏳ Waiting for Chef Confirmation</p>
 <p>Your order has been safely sent to the backend. Stock will auto-decrement once the chef starts cooking, and you will receive a 10-minute warning alert before completion!</p>
 </div>
 <div className="flex justify-center gap-3 pt-2">
 <button onClick={() => {
 setOrderSuccess(false);
 if (onNavigate) onNavigate('Home');
 }} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 transition-all">Continue Shopping</button>
 </div>
 </div>
 )}
 
 {/* Retail Section */}
 {retailItems.length > 0 && (
 <div className="space-y-4">
 <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><span className="material-icons text-base">storefront</span> Retail Items</h3>
 {retailItems.map((item) => (
 <motion.div layout key={item.cartId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl p-4 shadow-sm border border-border flex flex-col sm:flex-row gap-4 items-center">
 <div className="w-24 h-24 rounded-lg bg-background overflow-hidden flex-shrink-0"><img src={item.image} className="w-full h-full object-cover" alt={item.name}/></div>
 <div className="flex-grow min-w-0 w-full">
 <div className="flex justify-between items-start">
 <div><h3 className="font-bold text-lg text-foreground ">{item.name}</h3></div>
 <button onClick={() => removeFromCart(item.cartId)} className="text-muted-foreground hover:text-red-500 p-1"><span className="material-icons text-xl">close</span></button>
 </div>
 <div className="flex justify-between items-end mt-2">
 <div className="flex items-center border border-border rounded-lg bg-background ">
 <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-3 py-1 hover:bg-background dark:hover:bg-slate-600 rounded-l-lg text-foreground/80 ">-</button>
 <span className="w-10 text-center text-sm font-semibold text-foreground ">{item.quantity}</span>
 <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-3 py-1 hover:bg-background dark:hover:bg-slate-600 rounded-r-lg text-foreground/80 ">+</button>
 </div>
 <div className="text-right">
 <span className="block text-xl font-bold text-foreground ">₦{item.price.toLocaleString()}</span>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}

 {/* Wholesale Section */}
 {wholesaleItems.length > 0 && (
 <div className="space-y-4 mt-8 pt-6 border-t border-border ">
 <h3 className="text-sm font-bold text-[#ff6a00] uppercase tracking-wider flex items-center gap-2"><span className="material-icons text-base">inventory_2</span> Wholesale / Bulk Items</h3>
 {wholesaleItems.map((item) => (
 <motion.div layout key={item.cartId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-orange-50/50 rounded-xl p-4 shadow-sm border border-orange-100 flex flex-col sm:flex-row gap-4 items-center">
 <div className="w-24 h-24 rounded-lg bg-background overflow-hidden flex-shrink-0 relative">
 <img src={item.image} className="w-full h-full object-cover" alt={item.name}/>
 <div className="absolute top-0 left-0 bg-[#ff6a00] text-white text-[10px] px-1 py-0.5 font-bold">BULK</div>
 </div>
 <div className="flex-grow min-w-0 w-full">
 <div className="flex justify-between items-start">
 <div><h3 className="font-bold text-lg text-foreground ">{item.name}</h3><p className="text-sm text-muted-foreground ">{item.unit} • {item.tierInfo}</p></div>
 <button onClick={() => removeFromCart(item.cartId)} className="text-muted-foreground hover:text-red-500 p-1"><span className="material-icons text-xl">close</span></button>
 </div>
 <div className="flex justify-between items-end mt-2">
 <div className="flex items-center border border-orange-200 rounded-lg bg-card ">
 <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-3 py-1 hover:bg-background dark:hover:bg-foreground text-background rounded-l-lg text-foreground/80 ">-</button>
 <span className="w-12 text-center text-sm font-semibold text-foreground ">{item.quantity}</span>
 <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-3 py-1 hover:bg-background dark:hover:bg-foreground text-background rounded-r-lg text-foreground/80 ">+</button>
 </div>
 <div className="text-right">
 <span className="block text-xl font-bold text-foreground ">₦{(item.price * item.quantity).toLocaleString()}</span>
 <span className="text-xs text-muted-foreground ">Unit: ₦{item.price.toLocaleString()}</span>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </div>

 <div className="lg:col-span-4 space-y-6">
 <div className="bg-card rounded-xl shadow-lg border border-border p-6 sticky top-24 transition-colors duration-300">
 <h2 className="text-xl font-bold mb-4 text-foreground ">Checkout Summary</h2>
 <div className="space-y-3 mb-6">
 <div className="flex justify-between text-sm text-foreground/80 "><span>Retail Subtotal</span><span>₦{cart.retailSubtotal.toLocaleString()}</span></div>
 <div className="flex justify-between text-sm text-foreground/80 "><span>Wholesale Subtotal</span><span>₦{cart.wholesaleSubtotal.toLocaleString()}</span></div>
 
 {/* Dynamic Logistics Fee */}
 {cart.wholesaleSubtotal > 0 && (
 <div className="flex justify-between text-sm text-foreground/80 ">
 <span>Freight Logistics</span>
 <span>₦{(cart.wholesaleSubtotal * 0.05).toLocaleString()}</span>
 </div>
 )}
 {cart.retailSubtotal > 0 && (
 <div className="flex justify-between text-sm text-foreground/80 ">
 <span>Standard Delivery</span>
 <span>₦2,500</span>
 </div>
 )}
 
 <div className="border-t border-border pt-3 flex justify-between items-center"><span className="text-base font-bold text-foreground ">Grand Total</span><span className="text-2xl font-bold text-foreground ">₦{(cart.total + (cart.retailSubtotal > 0 ? 2500 : 0) + (cart.wholesaleSubtotal * 0.05)).toLocaleString()}</span></div>
 </div>
 
 <div className="mb-6">
 <label htmlFor="shippingAddress" className="block text-sm font-medium text-foreground/80 mb-2">Shipping Address</label>
 <textarea
 id="shippingAddress"
 rows={3}
 className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6a00] bg-card text-foreground "
 placeholder="Enter your full delivery address..."
 value={shippingAddress}
 onChange={(e) => setShippingAddress(e.target.value)}
 ></textarea>
 </div>

 <button 
 onClick={handlePlaceOrder}
 disabled={isPlacingOrder || cart.items.length === 0}
 className="w-full bg-[#ff6a00] hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg transition-all transform active:scale-[0.98]"
 >
 {isPlacingOrder ? 'Processing...' : 'Place Order'}
 </button>
 </div>
 </div>
 </div>
 </main>
 </div>
 );
};

export default Cart;
