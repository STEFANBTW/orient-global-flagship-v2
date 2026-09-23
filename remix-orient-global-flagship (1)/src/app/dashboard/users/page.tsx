
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  getAllUsers, 
  saveUser, 
  deleteUserFromStore, 
  AppUser,
  MockConsumerUser 
} from '@/services/userService';
import { orderService, CustomerOrder } from '@/services/orderService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Trash2, 
  Edit3, 
  ShoppingBag, 
  UserX, 
  UserCheck, 
  X, 
  Check, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldAlert, 
  Plus,
  Ban,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<MockConsumerUser[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [editingUser, setEditingUser] = useState<MockConsumerUser | null>(null);
  const [viewingOrdersUser, setViewingOrdersUser] = useState<MockConsumerUser | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  // New user form state
  const [newUserForm, setNewUserForm] = useState<Partial<MockConsumerUser>>({
    name: '',
    email: '',
    phone: '+234 ',
    deliveryAddress: '',
    city: 'Lagos (South-West)',
    role: 'customer'
  });

  const loadData = async () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    const allOrders = await orderService.getOrders();
    setOrders(allOrders);
  };

  useEffect(() => {
    loadData();

    const handleUsersChange = () => {
      setUsers(getAllUsers());
    };
    const handleOrdersChange = () => {
      orderService.getOrders().then(setOrders);
    };

    window.addEventListener('orient_all_users_changed', handleUsersChange);
    window.addEventListener('orient_orders_changed', handleOrdersChange);

    return () => {
      window.removeEventListener('orient_all_users_changed', handleUsersChange);
      window.removeEventListener('orient_orders_changed', handleOrdersChange);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u => 
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      u.deliveryAddress?.toLowerCase().includes(q) ||
      u.city?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  // Actions
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
      const updated = await deleteUserFromStore(userId);
      setUsers(updated);
    }
  };

  const handleSaveEditedUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const updated = await saveUser(editingUser);
    setUsers(updated);
    setEditingUser(null);
  };

  const handleCreateNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const id = `usr_custom_${Date.now().toString().slice(-5)}`;
    const initials = newUserForm.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const created: MockConsumerUser = {
      id,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      phone: newUserForm.phone?.trim() || '+234 800 000 0000',
      deliveryAddress: newUserForm.deliveryAddress?.trim() || 'Standard Delivery',
      city: newUserForm.city || 'Lagos',
      role: newUserForm.role || 'customer',
      avatar: initials || 'US',
      hasActiveOrder: false
    };

    const updated = await saveUser(created);
    setUsers(updated);
    setIsNewUserModalOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '+234 ',
      deliveryAddress: '',
      city: 'Lagos (South-West)',
      role: 'customer'
    });
  };

  const handleDeclineOrder = async (orderId: string) => {
    if (window.confirm(`Are you sure you want to decline / cancel order #${orderId}?`)) {
      await orderService.updateOrderStatus(orderId, 'cancelled');
      const refreshed = await orderService.getOrders();
      setOrders(refreshed);
    }
  };

  // User's order history
  const userOrdersList = useMemo(() => {
    if (!viewingOrdersUser) return [];
    return orders.filter(o => 
      o.customerId === viewingOrdersUser.id ||
      o.customerEmail?.toLowerCase() === viewingOrdersUser.email.toLowerCase() ||
      o.customerName?.toLowerCase() === viewingOrdersUser.name.toLowerCase()
    );
  }, [orders, viewingOrdersUser]);

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">
              Admin CMS • Identity & Access Center
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-headline mt-1">
            User Accounts Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            View, edit, or delete customer accounts, monitor personal order history, and manage order dispatches.
          </p>
        </div>

        <Button 
          onClick={() => setIsNewUserModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Customer Account
        </Button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm">
          <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">Total Accounts</span>
          <span className="text-2xl font-black text-foreground">{users.length}</span>
        </div>
        <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm">
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-500 block">Active Customers</span>
          <span className="text-2xl font-black text-emerald-600">{users.filter(u => u.role === 'customer').length}</span>
        </div>
        <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm">
          <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 block">Total Orders Recorded</span>
          <span className="text-2xl font-black text-amber-600">{orders.length}</span>
        </div>
        <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm">
          <span className="text-[10px] uppercase font-mono tracking-wider text-primary block">CMS Staff / Admins</span>
          <span className="text-2xl font-black text-primary">{users.filter(u => u.role !== 'customer').length}</span>
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/40 bg-muted/20 flex items-center justify-between gap-4">
          <div className="relative flex items-center max-w-md w-full">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none z-10 shrink-0" />
            <Input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, city or address..." 
              className="pl-9 bg-[#f8fafc] dark:bg-[#1a1a1a] border-none h-10 text-xs w-full rounded-lg"
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>

        <Table>
          <TableHeader className="bg-muted/40 text-[11px] uppercase font-mono tracking-wider">
            <TableRow>
              <TableHead className="py-3.5">User Profile</TableHead>
              <TableHead>Contact Details</TableHead>
              <TableHead>Delivery Address & Region</TableHead>
              <TableHead>System Role</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  No matching user accounts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => {
                const userOrders = orders.filter(o => 
                  o.customerId === u.id ||
                  o.customerEmail?.toLowerCase() === u.email.toLowerCase() ||
                  o.customerName?.toLowerCase() === u.name.toLowerCase()
                );

                return (
                  <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/20 bg-primary/10 text-primary font-bold text-xs shrink-0">
                          <AvatarFallback>{u.avatar || u.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-foreground">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">ID: {u.id}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-1 text-foreground">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span>{u.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span>{u.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5 text-xs max-w-[240px]">
                        <p className="font-medium text-foreground truncate">{u.deliveryAddress}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary shrink-0" />
                          {u.city || 'Nigeria'}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge 
                        className={`text-[9px] font-extrabold uppercase border-none ${
                          u.role === 'boss' ? 'bg-purple-600 text-white' :
                          u.role === 'hod' ? 'bg-blue-600 text-white' :
                          'bg-slate-200 dark:bg-slate-700 text-foreground'
                        }`}
                      >
                        {u.role || 'customer'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => setViewingOrdersUser(u)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{userOrders.length} Orders</span>
                      </button>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingOrdersUser(u)}
                          className="h-8 text-xs font-semibold gap-1.5 border-border/60 hover:bg-muted"
                          title="View order history & decline orders"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                          Orders ({userOrders.length})
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingUser(u)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Edit user details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          title="Delete user permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* EDIT USER MODAL */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/80 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-5 border-b border-border/40 flex items-center justify-between bg-muted/20">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Edit User Profile</h2>
                  <p className="text-xs text-muted-foreground">Update customer details, delivery address, or system roles.</p>
                </div>
                <button 
                  onClick={() => setEditingUser(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedUser} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Full Name</label>
                  <Input 
                    value={editingUser.name}
                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Email Address</label>
                    <Input 
                      type="email"
                      value={editingUser.email}
                      onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Phone Number</label>
                    <Input 
                      value={editingUser.phone}
                      onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                      required
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Delivery Address</label>
                  <Input 
                    value={editingUser.deliveryAddress}
                    onChange={e => setEditingUser({ ...editingUser, deliveryAddress: e.target.value })}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">City / State Region</label>
                    <Input 
                      value={editingUser.city || ''}
                      onChange={e => setEditingUser({ ...editingUser, city: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">System Role</label>
                    <select
                      value={editingUser.role || 'customer'}
                      onChange={e => setEditingUser({ ...editingUser, role: e.target.value as any })}
                      className="w-full h-9 rounded-lg border border-border/80 bg-background px-3 text-xs text-foreground"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin CMS Boss</option>
                      <option value="hod">Head of Department (HOD)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-border/40">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingUser(null)}
                    className="h-9 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD NEW USER MODAL */}
      <AnimatePresence>
        {isNewUserModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/80 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-5 border-b border-border/40 flex items-center justify-between bg-muted/20">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Create New Customer Account</h2>
                  <p className="text-xs text-muted-foreground">Register a new customer for ordering in the system.</p>
                </div>
                <button 
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNewUser} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Full Name</label>
                  <Input 
                    placeholder="e.g. Babatunde Raji"
                    value={newUserForm.name}
                    onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Email Address</label>
                    <Input 
                      type="email"
                      placeholder="babatunde@example.ng"
                      value={newUserForm.email}
                      onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Phone Number</label>
                    <Input 
                      placeholder="+234 802 123 4567"
                      value={newUserForm.phone}
                      onChange={e => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                      required
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Delivery Address</label>
                  <Input 
                    placeholder="e.g. Plot 12 Admiralty Way, Lekki Phase 1"
                    value={newUserForm.deliveryAddress}
                    onChange={e => setNewUserForm({ ...newUserForm, deliveryAddress: e.target.value })}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">City Region</label>
                    <Input 
                      placeholder="Lagos (South-West)"
                      value={newUserForm.city}
                      onChange={e => setNewUserForm({ ...newUserForm, city: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Role</label>
                    <select
                      value={newUserForm.role || 'customer'}
                      onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                      className="w-full h-9 rounded-lg border border-border/80 bg-background px-3 text-xs text-foreground"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin CMS Boss</option>
                      <option value="hod">HOD</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-border/40">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsNewUserModalOpen(false)}
                    className="h-9 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW & DECLINE USER ORDERS MODAL */}
      <AnimatePresence>
        {viewingOrdersUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-card border border-border/80 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-border/40 flex items-center justify-between bg-muted/20 shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/20 bg-primary/10 text-primary font-bold text-xs">
                    <AvatarFallback>{viewingOrdersUser.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-base font-bold text-foreground">Order History for {viewingOrdersUser.name}</h2>
                    <p className="text-xs text-muted-foreground">{viewingOrdersUser.email} • {viewingOrdersUser.phone}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingOrdersUser(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {userOrdersList.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground/40" />
                    <p>No orders placed by {viewingOrdersUser.name} yet.</p>
                  </div>
                ) : (
                  userOrdersList.map(order => (
                    <div 
                      key={order.id} 
                      className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-foreground">#{order.id}</span>
                            <Badge className="bg-primary/10 text-primary text-[10px] font-bold border-none uppercase">
                              {order.division || 'dining'}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">
                            Placed: {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`text-[10px] font-bold uppercase border-none ${
                              order.status === 'completed' ? 'bg-emerald-600 text-white' :
                              order.status === 'cancelled' ? 'bg-red-600 text-white' :
                              order.status === 'ready' ? 'bg-emerald-500 text-white' :
                              'bg-amber-500 text-white'
                            }`}
                          >
                            {order.status}
                          </Badge>

                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeclineOrder(order.id)}
                              className="h-7 text-[11px] font-bold px-2.5 gap-1"
                              title="Decline order and mark as cancelled"
                            >
                              <Ban className="w-3 h-3" />
                              Decline Order
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 bg-card p-3 rounded-lg border border-border/40 text-xs">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                          Items Ordered (₦10 fixed rate)
                        </span>
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-foreground font-medium">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="font-mono text-muted-foreground">₦{it.quantity * 10}</span>
                          </div>
                        ))}
                        <div className="border-t border-border/40 pt-1.5 mt-1.5 flex justify-between items-center font-bold text-xs">
                          <span>Total Amount</span>
                          <span className="text-emerald-600 font-mono">₦{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-border/40 bg-muted/20 flex justify-end shrink-0">
                <Button 
                  onClick={() => setViewingOrdersUser(null)}
                  className="h-9 text-xs"
                >
                  Close History
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
