import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartState, Product } from '../types';

interface CartContextType {
 cart: CartState;
 addToCart: (product: Product, quantity?: number) => void;
 removeFromCart: (cartId: string) => void;
 updateQuantity: (cartId: string, quantity: number) => void;
 clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [cart, setCart] = useState<CartState>({ 
 items: [],
 total: 0,
 retailSubtotal: 0,
 wholesaleSubtotal: 0
 });

 const calculateTotals = (items: CartItem[]) => {
 const retailSubtotal = items
 .filter(i => i.context === 'RETAIL')
 .reduce((sum, i) => sum + i.price * i.quantity, 0);
 const wholesaleSubtotal = items
 .filter(i => i.context === 'WHOLESALE')
 .reduce((sum, i) => sum + i.price * i.quantity, 0);
 const total = retailSubtotal + wholesaleSubtotal;
 return { retailSubtotal, wholesaleSubtotal, total };
 };

 const addToCart = (product: Product, quantity: number = 1) => {
 const standardizedProduct: Product = { ...product, price: 10 };
 setCart(prev => {
 const existing = prev.items.find(i => i.id === standardizedProduct.id && i.context === standardizedProduct.context);
 let newItems;
 if (existing) {
 newItems = prev.items.map(i => (i.id === standardizedProduct.id && i.context === standardizedProduct.context) ? { ...i, price: 10, quantity: i.quantity + quantity } : i);
 } else {
 newItems = [...prev.items, { ...standardizedProduct, price: 10, cartId: `${standardizedProduct.id}-${standardizedProduct.context}`, quantity }];
 }
 return { items: newItems, ...calculateTotals(newItems) };
 });
 };

 const removeFromCart = (cartId: string) => {
 setCart(prev => {
 const newItems = prev.items.filter(i => i.cartId !== cartId);
 return { items: newItems, ...calculateTotals(newItems) };
 });
 };

 const updateQuantity = (cartId: string, quantity: number) => {
 if (quantity <= 0) {
 removeFromCart(cartId);
 return;
 }
 setCart(prev => {
 const newItems = prev.items.map(i => i.cartId === cartId ? { ...i, quantity } : i);
 return { items: newItems, ...calculateTotals(newItems) };
 });
 };

 const clearCart = () => setCart({ items: [], total: 0, retailSubtotal: 0, wholesaleSubtotal: 0 });

 return (
 <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
 {children}
 </CartContext.Provider>
 );
};

export const useCart = () => {
 const context = useContext(CartContext);
 if (!context) throw new Error('useCart must be used within a CartProvider');
 return context;
};
