import React, { useState, useEffect } from 'react';
import { getActiveConsumerUser, setActiveConsumerUser, AppUser, MockConsumerUser, MOCK_NIGERIAN_USERS } from '@/services/userService';
import { cmsApi } from '@/services/cmsApi';

interface DashboardScreenProps {
  onNavigateToMenu?: () => void;
  onNavigateToReservations?: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateToMenu, onNavigateToReservations }) => {
  const [activeUser, setActiveUser] = useState<AppUser | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [editAddress, setEditAddress] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');

  // Initialize active user
  useEffect(() => {
    const current = getActiveConsumerUser();
    if (current) {
      setActiveUser(current);
      setEditAddress(current.deliveryAddress);
      setEditPhone(current.phone);
    }
  }, []);

  // Listen for user changes externally
  useEffect(() => {
    const handleUserChange = (e: any) => {
      const newUser = e.detail;
      if (newUser) {
        setActiveUser(newUser);
        setEditAddress(newUser.deliveryAddress);
        setEditPhone(newUser.phone);
      }
    };
    window.addEventListener('orient_consumer_user_changed', handleUserChange);
    return () => window.removeEventListener('orient_consumer_user_changed', handleUserChange);
  }, []);

  // Fetch orders when activeUser changes
  useEffect(() => {
    if (!activeUser) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await cmsApi.getOrders();
        if (res?.orders) {
          const filtered = res.orders.filter(
            (o: any) =>
              o.userId === activeUser.id ||
              o.userEmail?.toLowerCase() === activeUser.email.toLowerCase()
          );
          setUserOrders(filtered);
        } else {
          setUserOrders([]);
        }
      } catch (err) {
        console.warn('Could not load user orders', err);
        setUserOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [activeUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSelectUser = (user: MockConsumerUser) => {
    setActiveUser(user);
    setActiveConsumerUser(user);
    setEditAddress(user.deliveryAddress);
    setEditPhone(user.phone);
    setIsEditingAddress(false);
    showToast(`Switched active profile to ${user.name} (${user.city})`);
  };

  const handleSaveProfileUpdates = () => {
    if (!activeUser) return;
    const updatedUser: MockConsumerUser = {
      ...activeUser,
      deliveryAddress: editAddress,
      phone: editPhone
    };
    setActiveUser(updatedUser);
    setActiveConsumerUser(updatedUser);
    setIsEditingAddress(false);
    showToast('Delivery address & phone updated successfully!');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 sm:top-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[100] max-w-sm sm:max-w-md mx-auto bg-neutral-900/95 text-white border border-white/10 px-4 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. TESTER PROFILE SWITCHER BAR (5 REGISTERED PROFILES)    */}
      {/* ========================================================= */}
      <section className="bg-card/80 dark:bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary text-xl">switch_account</span>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Consumer Profile Tester (5 Registered Profiles)
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select any profile below to test dashboard state, place orders, or review order history.
            </p>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0 self-start sm:self-auto">
            5 New Profiles • 0 History
          </span>
        </div>

        {/* 5 Profile Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MOCK_NIGERIAN_USERS.map((user) => {
            const isSelected = activeUser?.id === user.id;

            return (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`flex flex-col items-start p-3.5 rounded-xl text-left transition-all duration-200 relative group cursor-pointer ${
                  isSelected
                    ? 'bg-primary/15 border-2 border-primary shadow-md'
                    : 'bg-background hover:bg-muted/50 border border-border/60 hover:border-border'
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Active
                  </span>
                )}

                <div className="flex items-center gap-2.5 mb-2 w-full pr-12">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    isSelected ? 'bg-primary text-white' : 'bg-muted text-foreground'
                  }`}>
                    {user.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {user.city?.split(' ')[0]}
                    </p>
                  </div>
                </div>

                <div className="w-full pt-1.5 border-t border-border/30 text-[10px] space-y-0.5">
                  <p className="text-muted-foreground truncate font-mono">{user.email}</p>
                  <p className="text-foreground/80 font-medium truncate">{user.phone}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. ACTIVE USER HERO CARD & PROFILE SUMMARY                 */}
      {/* ========================================================= */}
      {activeUser && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main User Card (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-card via-card to-background border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shrink-0">
                    {activeUser.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-sans tracking-tight">
                        {activeUser.name}
                      </h1>
                      <span className="material-icons text-emerald-500 text-lg" title="Verified Nigerian User">
                        verified
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-mono">
                      {activeUser.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        New Member
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {activeUser.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-card/90 border border-border/60 p-3 rounded-2xl text-right shrink-0 w-full sm:w-auto">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Member ID Code</p>
                  <p className="text-sm font-mono font-bold text-foreground tracking-widest mt-0.5">
                    ORI-2024-{activeUser.id.slice(-4).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    Active • Registered
                  </p>
                </div>
              </div>

              {/* Delivery Address & Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-background/80 border border-border/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <span className="material-icons text-primary text-xs">place</span>
                      Delivery Address
                    </span>
                    {!isEditingAddress && (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        Edit Address
                      </button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="Enter full street address"
                        className="w-full text-xs p-2 rounded-lg bg-card border border-primary focus:outline-none text-foreground font-medium"
                      />
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="Phone number (+234...)"
                        className="w-full text-xs p-2 rounded-lg bg-card border border-primary focus:outline-none text-foreground font-medium"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={handleSaveProfileUpdates}
                          className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingAddress(false);
                            setEditAddress(activeUser.deliveryAddress);
                            setEditPhone(activeUser.phone);
                          }}
                          className="px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-relaxed">
                        {activeUser.deliveryAddress}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {activeUser.phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-background/80 border border-border/50 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <span className="material-icons text-primary text-xs">card_giftcard</span>
                    Loyalty Status & Perks
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-foreground">100</span>
                    <span className="text-xs text-primary font-bold">Welcome Taste Points</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    New user welcome bonus applied. Earn 10 points for every ₦1,000 spent on dining.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Quick Action Banner */}
            <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                Testing active profile: <strong className="text-foreground">{activeUser.name}</strong>
              </span>
              <div className="flex items-center gap-2">
                {onNavigateToMenu && (
                  <button
                    onClick={onNavigateToMenu}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-icons text-sm">restaurant_menu</span>
                    <span>Browse Menu & Order</span>
                  </button>
                )}
                {onNavigateToReservations && (
                  <button
                    onClick={onNavigateToReservations}
                    className="px-4 py-2 rounded-xl bg-card hover:bg-muted text-foreground border border-border font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-icons text-sm">event</span>
                    <span>Book Table</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Side Welcome Perks Widget */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40">
                <span className="material-icons text-amber-500 text-xl">stars</span>
                <h3 className="text-base font-bold text-foreground">New User Welcome Perks</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-background border border-border/50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                    <span className="material-icons text-base">local_offer</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">10% Off First Dining Order</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      Automatically applied to your first order tray. Valid across all menu items.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-background border border-border/50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                    <span className="material-icons text-base">local_shipping</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Free Rayfield Delivery</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      Complimentary courier delivery on food orders over ₦5,000 in your zone.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-background border border-border/50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                    <span className="material-icons text-base">wine_bar</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Complimentary Sommelier Infusion</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      Receive a free chilled Zobo or Chapman drink with any meal reservation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 text-center">
              <p className="text-[11px] font-semibold text-primary">
                Account Status: Active & Ready for Testing
              </p>
            </div>
          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* 3. ORDER HISTORY SECTION (CONNECTED TO FIRESTORE)          */}
      {/* ========================================================= */}
      <section className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary text-xl">history</span>
              <h2 className="text-xl font-bold text-foreground font-sans">
                Recent Order History ({activeUser?.name})
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live orders placed by this profile will automatically synchronize here in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              Status: {userOrders.length} Orders Recorded
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loadingOrders ? (
          <div className="py-12 text-center text-muted-foreground text-xs flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
            <span>Checking order history for {activeUser?.name}...</span>
          </div>
        ) : userOrders.length === 0 ? (
          /* Clean Empty History State for New Profiles */
          <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
              <span className="material-icons text-3xl">receipt_long</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground font-sans">
                No Order History Found
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Welcome, <strong className="text-foreground">{activeUser?.name}</strong>! As a new profile, you currently have 0 prior orders recorded. Place your first order to test live delivery & kitchen tracking!
              </p>
            </div>
            {onNavigateToMenu && (
              <button
                onClick={onNavigateToMenu}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-primary/90 shadow-md transition-all cursor-pointer"
              >
                <span className="material-icons text-sm">restaurant_menu</span>
                <span>Place First Order Now</span>
              </button>
            )}
          </div>
        ) : (
          /* Real Orders List */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-background/50">
                  <th className="p-3">Order ID & Date</th>
                  <th className="p-3">Division</th>
                  <th className="p-3">Items Purchased</th>
                  <th className="p-3">Delivery Address</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {userOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <p className="font-mono font-bold text-foreground">{order.id}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Just now'}
                      </p>
                    </td>
                    <td className="p-3">
                      <span className="capitalize font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10 text-[10px]">
                        {order.division || 'Dining'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="max-w-xs space-y-0.5">
                        {order.items?.map((it: any, idx: number) => (
                          <p key={idx} className="truncate text-foreground font-medium">
                            {it.quantity}x {it.name}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 max-w-xs truncate text-muted-foreground">
                      {order.deliveryAddress || activeUser?.deliveryAddress}
                    </td>
                    <td className="p-3 font-mono font-bold text-foreground">
                      ₦{order.totalAmount?.toLocaleString() || '10'}
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 4. RESERVATIONS & OCCASIONS SECTION                       */}
      {/* ========================================================= */}
      <section className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary text-xl">event_seat</span>
              <h2 className="text-xl font-bold text-foreground font-sans">
                Table Reservations ({activeUser?.name})
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review active table bookings at Orient fine dining hall.
            </p>
          </div>
        </div>

        <div className="py-8 px-4 text-center max-w-sm mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <span className="material-icons text-2xl">table_restaurant</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No active table reservations booked for <strong className="text-foreground">{activeUser?.name}</strong>.
          </p>
          {onNavigateToReservations && (
            <button
              onClick={onNavigateToReservations}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card hover:bg-muted text-foreground border border-border font-bold text-xs transition-all cursor-pointer"
            >
              <span className="material-icons text-sm">event</span>
              <span>Pick Table & Reserve</span>
            </button>
          )}
        </div>
      </section>

    </div>
  );
};

export default DashboardScreen;
