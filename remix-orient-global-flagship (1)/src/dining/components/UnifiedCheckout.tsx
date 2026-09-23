import React, { useState, useRef, useEffect } from 'react';
import { getActiveConsumerUser, updateActiveConsumerUserDetails } from '@/services/userService';
import { orderService, OrderItem } from '@/services/orderService';
import { INITIAL_PRODUCTS_CATALOG } from '@/data/productsCatalog';

interface UnifiedCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  initialItems?: OrderItem[]; // From Menu
  source: 'menu' | 'reservation';
  variant?: 'modal' | 'inline'; // inline for reservation page
  onSuccess?: () => void;
  onNavigateToMenu?: () => void;
}

const TIMES = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'];
const MOCK_RESERVED_TIMES: Record<string, string[]> = {
  "M2": ["7:00 PM", "7:30 PM", "8:00 PM"],
  "M6": ["5:00 PM", "5:30 PM"],
  "B2": ["8:00 PM", "8:30 PM", "9:00 PM"],
  "P2": ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"],
  "M4": ["6:00 PM", "6:30 PM"]
};

export const UnifiedCheckout: React.FC<UnifiedCheckoutProps> = ({ 
  isOpen, 
  onClose, 
  initialItems = [], 
  source,
  variant = 'modal',
  onSuccess,
  onNavigateToMenu
}) => {
  const activeUser = getActiveConsumerUser();
  const [orderType, setOrderType] = useState<'dine-in' | 'take-away'>(source === 'reservation' ? 'dine-in' : 'take-away');
  const [takeawayMethod, setTakeawayMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState(activeUser?.deliveryAddress || '');
  
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(2);
  const [preferences, setPreferences] = useState('');
  
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, id: '', seats: '', desc: '' });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If a reservation draft exists in sessionStorage, restore it
    try {
      const saved = sessionStorage.getItem('orient_pending_reservation');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedTableId) setSelectedTableId(parsed.selectedTableId);
        if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
        if (parsed.selectedTime) setSelectedTime(parsed.selectedTime);
        if (parsed.preferences) setPreferences(parsed.preferences);
        if (source === 'menu') {
          setOrderType('dine-in');
        }
      }
    } catch (e) {
      console.error('Failed to parse pending reservation:', e);
    }
  }, [source]);

  useEffect(() => {
    if (isOpen) {
      setItems(initialItems);
      // If we don't already have a saved dine-in reservation draft, set orderType by source
      const hasSavedDraft = Boolean(sessionStorage.getItem('orient_pending_reservation'));
      if (!hasSavedDraft) {
        setOrderType(source === 'reservation' ? 'dine-in' : 'take-away');
      }
      setCurrentStep(1);
    }
  }, [isOpen, initialItems, source]);

  const handleRedirectToMenu = () => {
    try {
      sessionStorage.setItem('orient_pending_reservation', JSON.stringify({
        selectedTableId,
        selectedDate,
        selectedTime,
        preferences
      }));
    } catch (e) {
      console.error('Failed to save pending reservation:', e);
    }

    if (variant === 'modal') {
      onClose();
    }

    if (onNavigateToMenu) {
      onNavigateToMenu();
    } else {
      window.dispatchEvent(new CustomEvent('orient:navigate-dining', { detail: { view: 'menu' } }));
    }

    document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isOpen && variant === 'modal') return null;

  const handleMouseEnter = (e: React.MouseEvent, id: string, seats: string, desc: string) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({ show: true, x: e.clientX - rect.left, y: e.clientY - rect.top, id, seats, desc });
    }
  };

  const getTableClass = (id: string) => {
    if (selectedTableId === id) return "fill-primary/20 stroke-primary stroke-2 cursor-pointer";
    return "fill-white dark:fill-[#2d2018] stroke-gray-300 dark:stroke-white/20 stroke-1 hover:fill-gray-100 dark:hover:fill-[#3d2b20] cursor-pointer transition-colors";
  };

  const handlePlaceOrder = async () => {
    if (orderType === 'take-away' && takeawayMethod === 'delivery' && deliveryAddress !== activeUser?.deliveryAddress) {
      if (window.confirm("Do you want to save this as your new delivery address?")) {
        updateActiveConsumerUserDetails({ deliveryAddress });
      }
    }

    setIsSubmitting(true);
    try {
      await orderService.placeOrder({
        customerId: activeUser?.id || 'usr_guest',
        customerName: activeUser?.name || 'Guest User',
        customerEmail: activeUser?.email || 'guest@orient.app',
        customerPhone: activeUser?.phone || '+234 800 000 0000',
        division: 'dining',
        tableNumber: orderType === 'dine-in' ? `${selectedTableId} (${selectedDate} @ ${selectedTime})` : undefined,
        shippingAddress: orderType === 'take-away' && takeawayMethod === 'delivery' ? deliveryAddress : 'Pick-up / Dine-in',
        notes: preferences,
        items: items,
        totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'awaiting_chef',
        prepDurationMinutes: 15
      });
      // Clear draft on successful placement
      sessionStorage.removeItem('orient_pending_reservation');
      alert('Order Placed / Reservation Confirmed successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-background md:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h2 className="text-xl font-bold">Checkout & Reservation</h2>
        {variant === 'modal' && (
          <button onClick={onClose} className="p-2 bg-card rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <span className="material-icons text-sm">close</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Step 1: Order Type */}
        <div className="bg-card p-4 rounded-xl border border-border">
          <h3 className="font-bold text-lg mb-4 flex items-center justify-between cursor-pointer" onClick={() => setCurrentStep(1)}>
            <span>1. Order Type</span>
            <span className="material-icons">{currentStep === 1 ? 'expand_less' : 'expand_more'}</span>
          </h3>
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              {source === 'menu' && (
                <div className="flex gap-4">
                  <button onClick={() => setOrderType('dine-in')} className={`flex-1 p-4 rounded-xl border ${orderType === 'dine-in' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    <span className="material-icons block text-2xl mb-2 text-primary">restaurant</span>
                    Dine-In
                  </button>
                  <button onClick={() => setOrderType('take-away')} className={`flex-1 p-4 rounded-xl border ${orderType === 'take-away' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    <span className="material-icons block text-2xl mb-2 text-primary">takeout_dining</span>
                    Take-Away
                  </button>
                </div>
              )}
              
              {orderType === 'take-away' && (
                <div className="flex gap-4 mt-4">
                  <button onClick={() => setTakeawayMethod('pickup')} className={`flex-1 p-3 rounded-lg border ${takeawayMethod === 'pickup' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    Pick-Up
                  </button>
                  <button onClick={() => setTakeawayMethod('delivery')} className={`flex-1 p-3 rounded-lg border ${takeawayMethod === 'delivery' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    Delivery
                  </button>
                </div>
              )}

              {orderType === 'take-away' && takeawayMethod === 'delivery' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Delivery Location</label>
                  <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg" placeholder="Enter full delivery address" />
                </div>
              )}

              <button onClick={() => setCurrentStep(2)} className="w-full mt-6 py-3 bg-primary text-white rounded-lg font-bold">Next Step</button>
            </div>
          )}
        </div>

        {/* Step 2: Reservation (If Dine-In) */}
        {orderType === 'dine-in' && (
          <div className="bg-card p-4 rounded-xl border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center justify-between cursor-pointer" onClick={() => setCurrentStep(2)}>
              <span>2. Table & Time</span>
              <span className="material-icons">{currentStep === 2 ? 'expand_less' : 'expand_more'}</span>
            </h3>
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in-up">
                {/* SVG Floor Plan inside relative container */}
                <div className="relative border border-border rounded-xl p-4 bg-background overflow-hidden" ref={mapRef}>
                  <div className="absolute z-20 bg-card text-foreground p-3 rounded-lg shadow-xl border border-primary/30 pointer-events-none" style={{ left: tooltip.x, top: tooltip.y, opacity: tooltip.show ? 1 : 0, visibility: tooltip.show ? 'visible' : 'hidden' }}>
                    <h4 className="font-bold text-primary mb-1 text-sm">Table {tooltip.id}</h4>
                    <p className="text-xs">Seats: {tooltip.seats}</p>
                  </div>
                  
                  <svg className="w-full h-auto" viewBox="0 0 800 500">
                    <rect className="fill-white dark:fill-[#221710]" height="500" rx="10" width="800" x="0" y="0"></rect>
                    <g className="group">
                      <circle onClick={() => setSelectedTableId("M1")} onMouseEnter={(e) => handleMouseEnter(e, "M1", "4", "Near Window")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M1")} cx="150" cy="150" r="25"></circle>
                      <circle onClick={() => setSelectedTableId("M2")} onMouseEnter={(e) => handleMouseEnter(e, "M2", "4", "Window")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M2")} cx="250" cy="150" r="25"></circle>
                      <circle onClick={() => setSelectedTableId("M3")} onMouseEnter={(e) => handleMouseEnter(e, "M3", "4", "Center Room")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M3")} cx="350" cy="150" r="25"></circle>
                      <circle onClick={() => setSelectedTableId("M4")} onMouseEnter={(e) => handleMouseEnter(e, "M4", "4", "Near Kitchen")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M4")} cx="450" cy="150" r="25"></circle>
                    </g>
                    <g className="group">
                      <rect onClick={() => setSelectedTableId("B1")} onMouseEnter={(e) => handleMouseEnter(e, "B1", "2", "Sunset")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("B1")} height="40" rx="4" width="40" x="100" y="410"></rect>
                    </g>
                  </svg>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2 bg-background border border-border rounded-lg" />
                  </div>
                </div>

                {selectedTableId && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Available Times for {selectedTableId}</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {TIMES.map((time, idx) => {
                        const isRes = MOCK_RESERVED_TIMES[selectedTableId]?.includes(time);
                        return (
                          <button key={idx} disabled={isRes} onClick={() => setSelectedTime(time)} className={`p-2 rounded text-xs border ${isRes ? 'bg-card/50 opacity-50 cursor-not-allowed' : selectedTime === time ? 'bg-primary text-white' : 'hover:border-primary'}`}>
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <button disabled={!selectedTableId || !selectedTime} onClick={() => setCurrentStep(3)} className="w-full mt-6 py-3 bg-primary text-white rounded-lg font-bold disabled:opacity-50">Next Step</button>
                {source === 'reservation' && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleRedirectToMenu}
                      className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-icons text-sm">restaurant_menu</span>
                      Want to pick your food first? Browse the menu
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Menu & Preferences */}
        <div className="bg-card p-4 rounded-xl border border-border">
          <h3 className="font-bold text-lg mb-4 flex items-center justify-between cursor-pointer" onClick={() => setCurrentStep(orderType === 'take-away' ? 2 : 3)}>
            <span>{orderType === 'take-away' ? '2' : '3'}. Items & Preferences</span>
            <span className="material-icons">{(orderType === 'take-away' ? currentStep === 2 : currentStep === 3) ? 'expand_less' : 'expand_more'}</span>
          </h3>
          {(orderType === 'take-away' ? currentStep === 2 : currentStep === 3) && (
            <div className="space-y-4 animate-fade-in-up">
              {items.length === 0 ? (
                <div className="p-5 border border-dashed border-border rounded-2xl text-center bg-muted/15 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-foreground font-semibold text-sm">
                    <span className="material-icons text-primary text-base">restaurant</span>
                    <span>No dishes selected yet</span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    {source === 'reservation'
                      ? 'You can confirm your table reservation now and order when you arrive at the restaurant, or head to the menu to pick your meals beforehand.'
                      : 'You can add items from the menu before placing your order.'}
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleRedirectToMenu}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md shadow-primary/20 transition-all hover:scale-[1.02]"
                    >
                      <span className="material-icons text-sm">menu_book</span>
                      Go to Menu to Pick Dishes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pre-ordered Dishes</span>
                    <button
                      type="button"
                      onClick={handleRedirectToMenu}
                      className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span className="material-icons text-xs">add</span> Add more dishes
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {items.map((it, idx) => (
                      <li key={idx} className="flex justify-between items-center p-2.5 bg-background rounded-xl border border-border text-sm">
                        <span className="font-medium text-foreground">{it.quantity}x {it.name}</span>
                        <span className="font-bold text-primary">₦{(it.price * it.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Preferences / Notes</label>
                <textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} placeholder="Allergies, seating requests, utensils..." className="w-full p-3 bg-background border border-border rounded-lg h-24"></textarea>
              </div>

              <button disabled={isSubmitting} onClick={handlePlaceOrder} className="w-full mt-6 py-3 bg-primary text-white rounded-lg font-bold">
                {isSubmitting ? 'Processing...' : 'Confirm & Place Order'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  if (variant === 'inline') {
    return content;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-6">
      <div className="w-full h-full md:w-[600px] md:h-auto">
        {content}
      </div>
    </div>
  );
};
