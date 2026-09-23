'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, saveUser, deleteUserFromStore, AppUser } from '@/services/userService';
import { orderService, CustomerOrder } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Trash2, Edit3, ShoppingBag, Plus, X, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

type SortField = 'name' | 'createdAt' | 'activity';
type SortDir = 'asc' | 'desc';

const EMPTY_USER: Partial<AppUser> = {
  name: '', email: '', phone: '+234 ', deliveryAddress: '', city: 'Lagos', role: 'customer',
};

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<AppUser>>(EMPTY_USER);
  const [viewingUser, setViewingUser] = useState<AppUser | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setUsers(getAllUsers());
    setOrders(await orderService.getOrders());
  };

  useEffect(() => {
    load();
    const onUsers = () => setUsers(getAllUsers());
    const onOrders = () => orderService.getOrders().then(setOrders);
    window.addEventListener('orient_all_users_changed', onUsers);
    window.addEventListener('orient_orders_changed', onOrders);
    return () => {
      window.removeEventListener('orient_all_users_changed', onUsers);
      window.removeEventListener('orient_orders_changed', onOrders);
    };
  }, []);

  const orderCountFor = (u: AppUser) =>
    orders.filter(o =>
      o.customerId === u.id ||
      o.customerEmail?.toLowerCase() === u.email?.toLowerCase()
    ).length;

  const sorted = useMemo(() => {
    let list = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let val = 0;
      if (sortField === 'name') val = a.name.localeCompare(b.name);
      else if (sortField === 'createdAt') val = (a.createdAt || '').localeCompare(b.createdAt || '');
      else if (sortField === 'activity') val = orderCountFor(a) - orderCountFor(b);
      return sortDir === 'asc' ? val : -val;
    });
    return list;
  }, [users, orders, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" permanently? This cannot be undone.`)) return;
    const updated = await deleteUserFromStore(id);
    setUsers(updated);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    const updated = await saveUser({ ...editingUser, updatedAt: new Date().toISOString() });
    setUsers(updated);
    setEditingUser(null);
    setSaving(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.phone) return;
    setSaving(true);
    const id = `usr_${Date.now().toString(36)}`;
    const initials = newUser.name!.trim().split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    const created: AppUser = {
      id,
      name: newUser.name!.trim(),
      email: newUser.email?.trim() || '',
      phone: newUser.phone!.trim(),
      deliveryAddress: newUser.deliveryAddress?.trim() || '',
      city: newUser.city || 'Lagos',
      role: (newUser.role as AppUser['role']) || 'customer',
      avatar: initials || 'US',
      hasActiveOrder: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = await saveUser(created);
    setUsers(updated);
    setCreatingUser(false);
    setNewUser(EMPTY_USER);
    setSaving(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Delete order #${orderId}? This cannot be undone.`)) return;
    await orderService.deleteOrder(orderId);
    setOrders(await orderService.getOrders());
  };

  const userOrders = useMemo(() =>
    viewingUser
      ? orders.filter(o =>
          o.customerId === viewingUser.id ||
          o.customerEmail?.toLowerCase() === viewingUser.email?.toLowerCase()
        )
      : [],
    [orders, viewingUser]
  );

  // ── Shared form ───────────────────────────────────────────────────────────

  const UserFormFields = ({
    data,
    setData,
  }: {
    data: Partial<AppUser>;
    setData: (d: Partial<AppUser>) => void;
  }) => (
    <div className="space-y-3">
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Full Name *</label>
        <Input
          value={data.name || ''}
          onChange={e => setData({ ...data, name: e.target.value })}
          required
          className="h-9 text-xs"
          placeholder="e.g. Babatunde Raji"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Phone *</label>
          <Input
            value={data.phone || ''}
            onChange={e => setData({ ...data, phone: e.target.value })}
            required
            className="h-9 text-xs font-mono"
            placeholder="+234 802 000 0000"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Email</label>
          <Input
            type="email"
            value={data.email || ''}
            onChange={e => setData({ ...data, email: e.target.value })}
            className="h-9 text-xs"
            placeholder="email@example.ng"
          />
        </div>
      </div>
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Delivery Address</label>
        <Input
          value={data.deliveryAddress || ''}
          onChange={e => setData({ ...data, deliveryAddress: e.target.value })}
          className="h-9 text-xs"
          placeholder="Plot 12 Admiralty Way..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">City</label>
          <Input
            value={data.city || ''}
            onChange={e => setData({ ...data, city: e.target.value })}
            className="h-9 text-xs"
            placeholder="Lagos"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Role</label>
          <select
            value={data.role || 'customer'}
            onChange={e => setData({ ...data, role: e.target.value as AppUser['role'] })}
            className="w-full h-9 rounded-lg border border-border/60 bg-background px-3 text-xs text-foreground"
          >
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
            <option value="hod">Head of Department</option>
            <option value="boss">Boss (Admin)</option>
          </select>
        </div>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-0.5">Users</h1>
        </div>
        <Button
          onClick={() => setCreatingUser(true)}
          className="h-9 text-xs font-bold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4"
        >
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: users.length, color: 'text-foreground' },
          { label: 'Customers', value: users.filter(u => u.role === 'customer').length, color: 'text-foreground' },
          { label: 'Total Orders', value: orders.length, color: 'text-foreground' },
          { label: 'Staff / Admins', value: users.filter(u => u.role !== 'customer').length, color: 'text-foreground' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl bg-card border border-border/60">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar: search + sort */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 inset-y-0 my-auto w-3.5 h-3.5 text-white/70 dark:text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="h-9 pl-9 text-xs border-none bg-[#222222] text-white dark:bg-muted/50 dark:text-foreground rounded-lg w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">Sort:</span>
          {(['name', 'createdAt', 'activity'] as SortField[]).map(f => (
            <button
              key={f}
              onClick={() => toggleSort(f)}
              className={`inline-flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                sortField === f
                  ? 'bg-muted text-foreground'
                  : 'bg-muted/30 hover:bg-muted/60 text-muted-foreground'
              }`}
            >
              {f === 'name' ? 'Name' : f === 'createdAt' ? 'Date Added' : 'Activity'}
              <SortIcon field={f} />
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-muted-foreground ml-auto">
          {sorted.length} of {users.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-[10px] uppercase font-mono tracking-wider">
              <TableHead className="py-3">User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-xs text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map(u => {
                const count = orderCountFor(u);
                return (
                  <TableRow key={u.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 bg-primary/10 text-primary shrink-0">
                          <AvatarFallback className="text-[11px] font-bold">
                            {u.avatar || u.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-foreground">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{u.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-foreground">{u.email || '—'}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{u.phone}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-bold border-none uppercase ${
                          u.role === 'boss'
                            ? 'bg-purple-600 text-white'
                            : u.role === 'hod'
                            ? 'bg-blue-600 text-white'
                            : u.role === 'staff'
                            ? 'bg-orange-500 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => setViewingUser(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" /> {count}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingUser(u)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Edit user"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          title="Delete user"
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

      {/* ── Edit User Modal ─────────────────────────────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card border border-border/60 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border/40 bg-muted/20">
              <div>
                <h2 className="text-base font-bold">Edit User</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Changes persist to Firestore and affect login immediately.
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <UserFormFields data={editingUser} setData={d => setEditingUser(d as AppUser)} />
              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)} className="h-9 text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="h-9 text-xs bg-primary hover:bg-primary/90 font-bold">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create User Modal ───────────────────────────────────────────────── */}
      {creatingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card border border-border/60 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border/40 bg-muted/20">
              <div>
                <h2 className="text-base font-bold">Create User</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Saved to Firestore. User can log in immediately.
                </p>
              </div>
              <button
                onClick={() => setCreatingUser(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <UserFormFields data={newUser} setData={setNewUser} />
              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button type="button" variant="outline" onClick={() => setCreatingUser(false)} className="h-9 text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="h-9 text-xs bg-primary hover:bg-primary/90 font-bold">
                  {saving ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Order History Panel ─────────────────────────────────────────────── */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card border border-border/60 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border/40 bg-muted/20 shrink-0">
              <div>
                <h2 className="text-base font-bold">Order History — {viewingUser.name}</h2>
                <p className="text-[11px] text-muted-foreground">
                  {viewingUser.email} · {viewingUser.phone}
                </p>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-3">
              {userOrders.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground">
                  No orders for this user.
                </div>
              ) : (
                userOrders.map(order => (
                  <div key={order.id} className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold">#{order.id}</span>
                        <Badge
                          className={`text-[10px] font-bold border-none uppercase ${
                            order.status === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : order.status === 'cancelled'
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete this order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()} · {order.division || 'dining'}
                    </p>
                    <div className="bg-card rounded-lg border border-border/40 p-3 space-y-1">
                      {order.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-xs text-foreground">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-mono text-muted-foreground">₦{it.quantity * it.price}</span>
                        </div>
                      ))}
                      <div className="border-t border-border/40 pt-1 mt-1 flex justify-between text-xs font-bold">
                        <span>Total</span>
                        <span className="text-emerald-500 font-mono">₦{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-border/40 bg-muted/20 flex justify-end shrink-0">
              <Button onClick={() => setViewingUser(null)} className="h-9 text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
