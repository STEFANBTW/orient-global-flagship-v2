const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'dining', 'components', 'UnifiedCheckout.tsx');

const content = `import React, { useState, useRef, useEffect } from 'react';
import { getActiveConsumerUser, updateActiveConsumerUserDetails, saveUser, setActiveConsumerUser, AppUser, MOCK_NIGERIAN_USERS } from '@/services/userService';
import { orderService, OrderItem } from '@/services/orderService';
import { INITIAL_PRODUCTS_CATALOG } from '@/data/productsCatalog';

interface UnifiedCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  initialItems?: OrderItem[]; 
  source: 'menu' | 'reservation';
  variant?: 'modal' | 'inline'; 
  onSuccess?: () => void;
  onNavigateToMenu?: () => void;
  onNavigateToDashboard?: () => void;
}

const MOCK_RESERVED_TIMES: Record<string, string[]> = {
  "M1": ["1:00 PM", "1:30 PM", "7:00 PM"],
  "M2": ["12:30 PM", "1:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"],
  "M3": ["2:00 PM", "2:30 PM", "8:00 PM"],
  "M4": ["1:00 PM", "1:30 PM", "2:00 PM", "6:00 PM", "6:30 PM"],
  "M5": ["7:30 PM", "8:00 PM", "8:30 PM"],
  "M6": ["12:00 PM", "12:30 PM", "5:00 PM", "5:30 PM"],
  "M7": ["1:30 PM", "2:00 PM", "8:00 PM"],
  "B1": ["1:00 PM", "6:00 PM", "6:30 PM"],
  "B2": ["8:00 PM", "8:30 PM", "9:00 PM"],
  "B3": ["12:30 PM", "1:00 PM", "7:00 PM"],
  "B4": ["2:00 PM", "2:30 PM"],
  "P1": ["1:00 PM", "1:30 PM", "2:00 PM", "7:00 PM", "7:30 PM", "8:00 PM"],
  "P2": ["12:00 PM", "12:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"],
  "P3": ["8:30 PM", "9:00 PM"]
};

// Internal component for the Circular Time Picker
const CircularTimePicker = ({ 
  value, 
  onChange, 
  unavailableTimes 
}: { 
  value: string | null; 
  onChange: (time: string) => void;
  unavailableTimes: string[];
}) => {
  const [view, setView] = useState<'hour' | 'minute'>('hour');
  
  // Default to 12:00 PM if no value is set
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM');

  // Sync internal state if value prop changes externally (e.g. initial load)
  useEffect(() => {
    if (value) {
      const match = value.match(/(\\d+):(\\d+)\\s+(AM|PM)/);
      if (match) {
        setHour(parseInt(match[1], 10));
        setMinute(parseInt(match[2], 10));
        setPeriod(match[3] as 'AM' | 'PM');
      }
    }
  }, [value]);

  const updateExternalValue = (h: number, m: number, p: 'AM' | 'PM') => {
    const formattedHour = h.toString();
    const formattedMinute = m.toString().padStart(2, '0');
    onChange(\`\${formattedHour}:\${formattedMinute} \${p}\`);
  };

  const handleHourClick = (h: number) => {
    setHour(h);
    setView('minute');
    updateExternalValue(h, minute, period);
  };

  const handleMinuteClick = (m: number) => {
    setMinute(m);
    updateExternalValue(hour, m, period);
  };

  const handlePeriodClick = (p: 'AM' | 'PM') => {
    setPeriod(p);
    updateExternalValue(hour, minute, p);
  };

  const getPositionStyle = (index: number, total: number) => {
    const angle = ((index / total) * 360 - 90) * (Math.PI / 180);
    const radius = 40; // percentage
    const left = 50 + radius * Math.cos(angle);
    const top = 50 + radius * Math.sin(angle);
    return { left: \`\${left}%\`, top: \`\${top}%\`, transform: 'translate(-50%, -50%)' };
  };

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Helper to check if a specific hour/min is entirely unavailable (complex to do perfectly, so we just let them pick and validate on selection, but for UX we can show red if the exact string is in unavailableTimes)
  const currentFormatted = \`\${hour}:\${minute.toString().padStart(2, '0')} \${period}\`;
  const isCurrentlyUnavailable = unavailableTimes.includes(currentFormatted);

  return (
    <div className="flex flex-col items-center bg-background border border-border/50 rounded-2xl p-4 shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 bg-muted/30 p-3 rounded-xl border border-border/50">
        <div className="flex items-baseline text-3xl font-black text-foreground tracking-tight">
          <button 
            onClick={() => setView('hour')} 
            className={\`hover:text-primary transition-colors \${view === 'hour' ? 'text-primary' : ''}\`}
          >
            {hour}
          </button>
          <span className="mx-1 text-muted-foreground opacity-50">:</span>
          <button 
            onClick={() => setView('minute')} 
            className={\`hover:text-primary transition-colors \${view === 'minute' ? 'text-primary' : ''}\`}
          >
            {minute.toString().padStart(2, '0')}
          </button>
        </div>
        <div className="flex flex-col gap-1 ml-2 text-xs font-bold">
          <button 
            onClick={() => handlePeriodClick('AM')} 
            className={\`px-2 py-0.5 rounded \${period === 'AM' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}\`}
          >
            AM
          </button>
          <button 
            onClick={() => handlePeriodClick('PM')} 
            className={\`px-2 py-0.5 rounded \${period === 'PM' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}\`}
          >
            PM
          </button>
        </div>
      </div>

      {/* Clock Face */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-muted/20 border-4 border-muted/30 mb-2 shadow-inner flex items-center justify-center">
        {/* Center dot */}
        <div className="w-2 h-2 rounded-full bg-primary z-10 absolute"></div>
        
        {/* The items */}
        {view === 'hour' && hours.map((h, i) => {
          const isSelected = hour === h;
          return (
            <button
              key={'h'+h}
              onClick={() => handleHourClick(h)}
              style={getPositionStyle(i, 12)}
              className={\`absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all \${isSelected ? 'bg-primary text-white shadow-md scale-110' : 'text-foreground hover:bg-muted'}\`}
            >
              {h}
            </button>
          );
        })}

        {view === 'minute' && minutes.map((m, i) => {
          const isSelected = minute === m;
          return (
            <button
              key={'m'+m}
              onClick={() => handleMinuteClick(m)}
              style={getPositionStyle(i, 12)}
              className={\`absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all \${isSelected ? 'bg-primary text-white shadow-md scale-110' : 'text-foreground hover:bg-muted'}\`}
            >
              {m.toString().padStart(2, '0')}
            </button>
          );
        })}
      </div>
      
      {isCurrentlyUnavailable && (
        <div className="mt-3 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-1.5 animate-pulse">
          <span className="material-icons text-[14px]">error</span>
          Time Unavailable
        </div>
      )}
    </div>
  );
};


export const UnifiedCheckout: React.FC<UnifiedCheckoutProps> = ({ 
  isOpen, 
  onClose, 
  initialItems = [], 
  source,
  variant = 'modal',
  onSuccess,
  onNavigateToMenu,
  onNavigateToDashboard
}) => {
  const [activeUser, setActiveUser] = useState<AppUser | null>(getActiveConsumerUser());
  const [orderType, setOrderType] = useState<'dine-in' | 'take-away'>(source === 'reservation' ? 'dine-in' : 'take-away');
  const [takeawayMethod, setTakeawayMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState(activeUser?.deliveryAddress || '');
  
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [preferences, setPreferences] = useState('');
  
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, id: '', seats: '', desc: '' });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const [timeErrorToast, setTimeErrorToast] = useState<string | null>(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [signupForm, setSignupForm] = useState({ name: '', phone: '', email: '', address: '' });
  
  // Mobile Clock Modal State
  const [showMobileClock, setShowMobileClock] = useState(false);

  useEffect(() => {
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
    } catch (e) {}
  }, [source]);

  useEffect(() => {
    if (isOpen) {
      setItems(initialItems);
      const hasSavedDraft = Boolean(sessionStorage.getItem('orient_pending_reservation'));
      if (!hasSavedDraft) {
        setOrderType(source === 'reservation' ? 'dine-in' : 'take-away');
      }
      setCurrentStep(1);
      setActiveUser(getActiveConsumerUser());
      
      if (variant === 'modal') {
        window.dispatchEvent(new CustomEvent('orient:detail-modal', { detail: { open: true } }));
      }
    } else {
      if (variant === 'modal') {
        window.dispatchEvent(new CustomEvent('orient:detail-modal', { detail: { open: false } }));
      }
    }
    
    return () => {
      if (variant === 'modal') {
        window.dispatchEvent(new CustomEvent('orient:detail-modal', { detail: { open: false } }));
      }
    };
  }, [isOpen, initialItems, source, variant]);

  const handleRedirectToMenu = () => {
    try {
      sessionStorage.setItem('orient_pending_reservation', JSON.stringify({
        selectedTableId,
        selectedDate,
        selectedTime,
        preferences
      }));
    } catch (e) {}

    if (variant === 'modal') onClose();
    if (onNavigateToMenu) onNavigateToMenu();
    else window.dispatchEvent(new CustomEvent('orient:navigate-dining', { detail: { view: 'menu' } }));

    document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDashboard = () => {
    if (onNavigateToDashboard) onNavigateToDashboard();
    else window.dispatchEvent(new CustomEvent('orient:navigate-dining', { detail: { view: 'dashboard' } }));
    document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrderClick = () => {
    if (!activeUser || !activeUser.id || activeUser.id === 'usr_guest') {
      setShowAuthModal(true);
      return;
    }
    
    // Check if the currently selected time is in the unavailable array
    if (selectedTableId && selectedTime && MOCK_RESERVED_TIMES[selectedTableId]?.includes(selectedTime)) {
      setTimeErrorToast(\`This time (\${selectedTime}) has already been selected.\`);
      setTimeout(() => setTimeErrorToast(null), 2500);
      return;
    }

    processOrderPlacement(activeUser);
  };

  const processOrderPlacement = async (userToUse: AppUser) => {
    if (orderType === 'take-away' && takeawayMethod === 'delivery' && deliveryAddress && deliveryAddress !== userToUse.deliveryAddress) {
      if (window.confirm("Do you want to save this as your new delivery address?")) {
        updateActiveConsumerUserDetails({ deliveryAddress });
      }
    }

    setIsSubmitting(true);
    try {
      await orderService.placeOrder({
        customerId: userToUse.id,
        customerName: userToUse.name,
        customerEmail: userToUse.email || 'guest@orient.app',
        customerPhone: userToUse.phone,
        division: 'dining',
        tableNumber: orderType === 'dine-in' ? \`\${selectedTableId} (\${selectedDate} @ \${selectedTime})\` : undefined,
        shippingAddress: orderType === 'take-away' && takeawayMethod === 'delivery' ? deliveryAddress : 'Pick-up / Dine-in',
        notes: preferences,
        items: items,
        totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'awaiting_chef',
        prepDurationMinutes: 15
      });
      
      sessionStorage.removeItem('orient_pending_reservation');
      sessionStorage.setItem('orient_active_order_notification', JSON.stringify({
        tableNumber: orderType === 'dine-in' ? \`\${selectedTableId} (\${selectedDate} @ \${selectedTime})\` : undefined,
        orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        status: 'awaiting_chef',
        timestamp: Date.now()
      }));

      if (onSuccess) onSuccess();
      if (variant === 'modal') onClose();
      handleNavigateToDashboard();
    } catch (e) {
      console.error(e);
      alert('Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupAndOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.phone) {
      alert("Name and Phone are required.");
      return;
    }
    const newUser: AppUser = {
      id: \`usr_\${Date.now()}\`,
      name: signupForm.name,
      phone: signupForm.phone,
      email: signupForm.email,
      role: 'customer',
      deliveryAddress: signupForm.address || deliveryAddress,
      avatar: signupForm.name.slice(0, 2).toUpperCase(),
      hasActiveOrder: true
    };
    await saveUser(newUser);
    setActiveConsumerUser(newUser);
    setActiveUser(newUser);
    window.dispatchEvent(new CustomEvent('orient_consumer_user_changed', { detail: newUser }));
    setShowAuthModal(false);
    
    // Check time conflict again just in case
    if (selectedTableId && selectedTime && MOCK_RESERVED_TIMES[selectedTableId]?.includes(selectedTime)) {
      setTimeErrorToast(\`This time (\${selectedTime}) has already been selected.\`);
      setTimeout(() => setTimeErrorToast(null), 2500);
      return;
    }

    processOrderPlacement(newUser);
  };

  const handleSelectDemoUserAndOrder = async (user: AppUser) => {
    setActiveConsumerUser(user);
    setActiveUser(user);
    window.dispatchEvent(new CustomEvent('orient_consumer_user_changed', { detail: user }));
    setShowAuthModal(false);
    
    if (selectedTableId && selectedTime && MOCK_RESERVED_TIMES[selectedTableId]?.includes(selectedTime)) {
      setTimeErrorToast(\`This time (\${selectedTime}) has already been selected.\`);
      setTimeout(() => setTimeErrorToast(null), 2500);
      return;
    }
    
    processOrderPlacement(user);
  };

  if (!isOpen && variant === 'modal') return null;

  const handleMouseEnter = (e: React.MouseEvent, id: string, seats: string, desc: string) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({ show: true, x: e.clientX - rect.left, y: e.clientY - rect.top, id, seats, desc });
    }
  };

  const getTableClass = (id: string) => {
    if (selectedTableId === id) return "fill-primary/30 stroke-primary stroke-2 cursor-pointer";
    const hasRes = MOCK_RESERVED_TIMES[id]?.length > 0;
    if (hasRes) return "fill-white dark:fill-[#2d2018] stroke-red-500/40 dark:stroke-red-400/40 stroke-1 hover:fill-red-500/10 cursor-pointer transition-colors";
    return "fill-white dark:fill-[#2d2018] stroke-gray-300 dark:stroke-white/20 stroke-1 hover:fill-gray-100 dark:hover:fill-[#3d2b20] cursor-pointer transition-colors";
  };

  const currentTableReservedTimes = selectedTableId ? (MOCK_RESERVED_TIMES[selectedTableId] || []) : [];
  const isSelectedTimeUnavailable = selectedTime && currentTableReservedTimes.includes(selectedTime);

  const content = (
    <div className="flex flex-col h-full bg-background md:rounded-3xl shadow-2xl overflow-hidden md:max-h-[92vh]">
      <div className="flex justify-between items-center p-4 sm:p-5 border-b border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Checkout & Reservation</h2>
          <p className="text-xs text-muted-foreground mt-1">Complete your order securely</p>
        </div>
        {variant === 'modal' && (
          <button onClick={() => {
            window.dispatchEvent(new CustomEvent('orient:detail-modal', { detail: { open: false } }));
            onClose();
          }} className="p-2 hover:bg-muted rounded-full transition-colors text-foreground">
            <span className="material-icons">close</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 pb-24 md:pb-5">
        {/* Step 1: Order Type */}
        <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border">
          <h3 className="font-bold text-lg mb-4 flex items-center justify-between cursor-pointer" onClick={() => setCurrentStep(1)}>
            <span>1. Order Type</span>
            <span className="material-icons">{currentStep === 1 ? 'expand_less' : 'expand_more'}</span>
          </h3>
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOrderType('dine-in')}
                  className={\`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all \${orderType === 'dine-in' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-[1.02]' : 'hover:border-primary border-border bg-background'}\`}
                >
                  <span className="material-icons text-2xl">restaurant</span>
                  <span className="font-bold">Dine-In</span>
                </button>
                <button
                  onClick={() => setOrderType('take-away')}
                  className={\`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all \${orderType === 'take-away' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-[1.02]' : 'hover:border-primary border-border bg-background'}\`}
                >
                  <span className="material-icons text-2xl">takeout_dining</span>
                  <span className="font-bold">Take-Away</span>
                </button>
              </div>

              {orderType === 'take-away' && (
                <div className="mt-4 pt-4 border-t border-border">
                  <label className="block text-sm font-bold mb-3">Pickup or Delivery?</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTakeawayMethod('pickup')}
                      className={\`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors \${takeawayMethod === 'pickup' ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted border-border bg-background text-foreground'}\`}
                    >
                      Pickup
                    </button>
                    <button
                      onClick={() => setTakeawayMethod('delivery')}
                      className={\`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors \${takeawayMethod === 'delivery' ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted border-border bg-background text-foreground'}\`}
                    >
                      Delivery
                    </button>
                  </div>
                </div>
              )}

              {orderType === 'take-away' && takeawayMethod === 'delivery' && (
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-2">Delivery Location</label>
                  <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Enter full delivery address" />
                </div>
              )}

              <button onClick={() => setCurrentStep(2)} className="w-full mt-6 py-3.5 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all">Next Step</button>
            </div>
          )}
        </div>

        {/* Step 2: Table & Time */}
        {orderType === 'dine-in' && (
          <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center justify-between cursor-pointer" onClick={() => setCurrentStep(2)}>
              <span>2. Table & Time</span>
              <span className="material-icons">{currentStep === 2 ? 'expand_less' : 'expand_more'}</span>
            </h3>
            {currentStep === 2 && (
              <div className="animate-fade-in-up">
                
                {/* Desktop 70/30 Split layout applied via grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* 70% Column: Interactive Floor Plan */}
                  <div className="lg:col-span-8 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Restaurant Floor Plan</h4>
                    </div>
                    <div className="relative border border-border/80 rounded-2xl p-2 sm:p-6 bg-background shadow-inner overflow-x-auto overflow-y-hidden" ref={mapRef}>
                      <div className="absolute z-20 bg-card text-foreground p-3 rounded-xl shadow-xl border border-primary/30 pointer-events-none" style={{ left: tooltip.x, top: tooltip.y, opacity: tooltip.show ? 1 : 0, visibility: tooltip.show ? 'visible' : 'hidden' }}>
                        <h4 className="font-bold text-primary mb-1 text-sm">Table {tooltip.id}</h4>
                        <p className="text-xs text-muted-foreground">{tooltip.desc}</p>
                        <p className="text-xs font-semibold mt-1">{tooltip.seats} Seats</p>
                      </div>
                      
                      {/* Detailed SVG Map */}
                      <svg className="w-full min-w-[500px] md:min-w-[600px] h-auto drop-shadow-sm select-none" viewBox="0 0 800 500">
                        <rect className="fill-white dark:fill-[#221710]" height="500" rx="12" width="800" x="0" y="0"></rect>
                        
                        <path d="M 50 50 L 550 50 L 550 350 L 50 350 Z" fill="none" className="stroke-border dark:stroke-[#3d2b20]" strokeWidth="2"></path>
                        <text className="fill-muted-foreground" fontSize="13" fontWeight="bold" letterSpacing="2" x="65" y="80">MAIN DINING HALL</text>
                        
                        <path d="M 50 370 L 550 370 L 550 480 L 50 480 Z" className="fill-muted/20 dark:fill-[#2d2018] stroke-border dark:stroke-[#3d2b20]" strokeWidth="2"></path>
                        <text className="fill-muted-foreground" fontSize="13" fontWeight="bold" letterSpacing="2" x="65" y="400">THE SUNSET BALCONY</text>
                        
                        <path d="M 570 50 L 750 50 L 750 480 L 570 480 Z" className="fill-muted/30 dark:fill-[#1a110c] stroke-border dark:stroke-[#3d2b20]" strokeWidth="2"></path>
                        <text className="fill-muted-foreground" fontSize="13" fontWeight="bold" letterSpacing="2" x="585" y="80">PRIVATE SUITES</text>

                        {/* Main Hall Tables */}
                        <circle onClick={() => setSelectedTableId("M1")} onMouseEnter={(e) => handleMouseEnter(e, "M1", "4", "Near Window")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M1")} cx="150" cy="150" r="25"></circle>
                        <text x="150" y="155" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">M1</text>
                        
                        <circle onClick={() => setSelectedTableId("M2")} onMouseEnter={(e) => handleMouseEnter(e, "M2", "4", "Window View")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M2")} cx="250" cy="150" r="25"></circle>
                        <text x="250" y="155" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">M2</text>

                        <circle onClick={() => setSelectedTableId("M3")} onMouseEnter={(e) => handleMouseEnter(e, "M3", "4", "Center Room")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M3")} cx="350" cy="150" r="25"></circle>
                        <text x="350" y="155" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">M3</text>

                        <circle onClick={() => setSelectedTableId("M4")} onMouseEnter={(e) => handleMouseEnter(e, "M4", "4", "Near Kitchen")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M4")} cx="450" cy="150" r="25"></circle>
                        <text x="450" y="155" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">M4</text>

                        <circle onClick={() => setSelectedTableId("M5")} onMouseEnter={(e) => handleMouseEnter(e, "M5", "4", "Quiet Corner")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M5")} cx="150" cy="250" r="25"></circle>
                        <text x="150" y="255" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">M5</text>

                        <circle onClick={() => setSelectedTableId("M6")} onMouseEnter={(e) => handleMouseEnter(e, "M6", "4", "Center Room")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M6")} cx="250" cy="250" r="25"></circle>
                        <text x="250" y="255" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">M6</text>

                        <circle onClick={() => setSelectedTableId("M7")} onMouseEnter={(e) => handleMouseEnter(e, "M7", "4", "Garden View")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("M7")} cx="350" cy="250" r="25"></circle>
                        <text x="350" y="255" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">M7</text>

                        {/* Balcony Tables */}
                        <rect onClick={() => setSelectedTableId("B1")} onMouseEnter={(e) => handleMouseEnter(e, "B1", "2", "Sunset View")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("B1")} height="40" rx="4" width="40" x="100" y="410"></rect>
                        <text x="120" y="435" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">B1</text>

                        <rect onClick={() => setSelectedTableId("B2")} onMouseEnter={(e) => handleMouseEnter(e, "B2", "2", "Intimate")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("B2")} height="40" rx="4" width="40" x="200" y="410"></rect>
                        <text x="220" y="435" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">B2</text>
                        
                        <rect onClick={() => setSelectedTableId("B3")} onMouseEnter={(e) => handleMouseEnter(e, "B3", "2", "Panorama")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("B3")} height="40" rx="4" width="40" x="300" y="410"></rect>
                        <text x="320" y="435" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">B3</text>

                        <rect onClick={() => setSelectedTableId("B4")} onMouseEnter={(e) => handleMouseEnter(e, "B4", "2", "Balcony")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("B4")} height="40" rx="4" width="40" x="400" y="410"></rect>
                        <text x="420" y="435" textAnchor="middle" className="text-[10px] font-bold fill-foreground pointer-events-none">B4</text>

                        {/* Private Suites */}
                        <rect onClick={() => setSelectedTableId("P1")} onMouseEnter={(e) => handleMouseEnter(e, "P1", "12", "Jade Suite")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("P1")} height="70" rx="8" width="110" x="600" y="110"></rect>
                        <text x="655" y="150" textAnchor="middle" className="text-[12px] font-bold fill-foreground pointer-events-none">P1</text>

                        <rect onClick={() => setSelectedTableId("P2")} onMouseEnter={(e) => handleMouseEnter(e, "P2", "12", "Amber Suite")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("P2")} height="70" rx="8" width="110" x="600" y="220"></rect>
                        <text x="655" y="260" textAnchor="middle" className="text-[12px] font-bold fill-foreground pointer-events-none">P2</text>
                        
                        <rect onClick={() => setSelectedTableId("P3")} onMouseEnter={(e) => handleMouseEnter(e, "P3", "14", "Onyx VIP")} onMouseLeave={() => setTooltip(p => ({...p, show: false}))} className={getTableClass("P3")} height="70" rx="8" width="110" x="600" y="330"></rect>
                        <text x="655" y="370" textAnchor="middle" className="text-[12px] font-bold fill-foreground pointer-events-none">P3</text>
                      </svg>
                      
                      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-border/50 text-[10px] sm:text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-background border border-border"></span>
                          <span className="text-muted-foreground">Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-primary/30 border-2 border-primary"></span>
                          <span className="text-foreground font-bold">Selected</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-background border border-red-500/40"></span>
                          <span className="text-muted-foreground">Has Bookings</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 30% Column: Specs, Date, Reserved Times, Time Slots */}
                  <div className="lg:col-span-4 flex flex-col space-y-4 bg-muted/20 border border-border/80 rounded-2xl p-4 sm:p-5">
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Reservation Date</label>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2.5 bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary/50" />
                      </div>
                    </div>

                    {!selectedTableId ? (
                      <div className="py-12 px-4 text-center border-2 border-dashed border-border rounded-xl bg-background mt-4">
                        <span className="material-icons text-4xl text-muted-foreground/50 mb-2">touch_app</span>
                        <p className="text-sm font-semibold text-foreground">Select a table</p>
                        <p className="text-xs text-muted-foreground mt-1">Tap a table on the floor plan to view its availability.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between pb-3 border-b border-border/50">
                          <div>
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Selected</p>
                            <h4 className="text-lg font-black text-foreground">Table {selectedTableId}</h4>
                          </div>
                        </div>
                        
                        {/* Reserved Times Banner - ONLY shows if there are actual conflicts */}
                        {currentTableReservedTimes.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500">
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2">
                              <span className="material-icons text-sm">block</span>
                              <span>Reserved Times</span>
                            </div>
                            <p className="text-[11px] text-red-600 dark:text-red-400 mb-2 font-medium">
                              The following slots are unavailable:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {currentTableReservedTimes.map((time, idx) => (
                                <span key={idx} className="px-2 py-1 text-[10px] font-bold rounded bg-red-500/20 border border-red-500/40 line-through">
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Choose Seating Time
                          </label>
                          
                          {/* Desktop Inline Clock */}
                          <div className="hidden lg:block">
                            <CircularTimePicker 
                              value={selectedTime} 
                              onChange={(val) => {
                                setSelectedTime(val);
                                if (currentTableReservedTimes.includes(val)) {
                                  setTimeErrorToast(\`This time (\${val}) has already been selected.\`);
                                  setTimeout(() => setTimeErrorToast(null), 2500);
                                }
                              }}
                              unavailableTimes={currentTableReservedTimes} 
                            />
                          </div>

                          {/* Mobile Button triggering Modal */}
                          <div className="block lg:hidden">
                            <button
                              onClick={() => setShowMobileClock(true)}
                              className="w-full py-4 px-4 bg-background border-2 border-primary/20 rounded-xl font-bold flex items-center justify-between hover:border-primary/50 transition-colors"
                            >
                              <span className="flex items-center gap-2">
                                <span className="material-icons text-primary text-xl">schedule</span>
                                {selectedTime || "Select a time"}
                              </span>
                              <span className="material-icons text-muted-foreground">chevron_right</span>
                            </button>
                          </div>
                        </div>

                        <button 
                          disabled={!selectedTime || isSelectedTimeUnavailable} 
                          onClick={() => setCurrentStep(3)} 
                          className="w-full mt-4 py-3.5 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                          Next Step
                        </button>
                        
                        {source === 'reservation' && (
                          <div className="text-center pt-2">
                            <button
                              type="button"
                              onClick={handleRedirectToMenu}
                              className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <span className="material-icons text-[14px]">restaurant_menu</span>
                              Want to pick your food first?
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Menu & Preferences */}
        <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border">
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
                      <span className="material-icons text-[14px]">add</span> Add more dishes
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {items.map((it, idx) => (
                      <li key={idx} className="flex justify-between items-center p-3 bg-background rounded-xl border border-border text-sm">
                        <span className="font-medium text-foreground">{it.quantity}x {it.name}</span>
                        <span className="font-bold text-primary">₦{(it.price * it.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center p-3 mt-2 bg-muted/30 rounded-xl">
                    <span className="font-bold text-sm">Total</span>
                    <span className="font-black text-lg text-primary">₦{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <label className="block text-sm font-bold mb-2">Preferences / Notes</label>
                <textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} placeholder="Allergies, seating requests, utensils..." className="w-full p-3 bg-background border border-border rounded-xl h-24 text-sm focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
              </div>

              <button disabled={isSubmitting || (orderType === 'dine-in' && isSelectedTimeUnavailable)} onClick={handlePlaceOrderClick} className="w-full mt-6 py-4 bg-primary text-white rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none">
                {isSubmitting ? 'Processing...' : (
                  <>
                    <span className="material-icons text-xl">check_circle</span>
                    Confirm & Place Order
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  return (
    <>
      {timeErrorToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100002] bg-red-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce border border-white/20">
          <span className="material-icons text-base">error_outline</span>
          <span>{timeErrorToast}</span>
        </div>
      )}

      {/* Mobile Clock Modal */}
      {showMobileClock && (
        <div className="fixed inset-0 z-[100001] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-foreground">Select Time</h3>
              <button onClick={() => setShowMobileClock(false)} className="text-muted-foreground hover:text-foreground">
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="py-2">
              <CircularTimePicker 
                value={selectedTime} 
                onChange={(val) => {
                  setSelectedTime(val);
                  if (currentTableReservedTimes.includes(val)) {
                    setTimeErrorToast(\`This time (\${val}) has already been selected.\`);
                    setTimeout(() => setTimeErrorToast(null), 2500);
                  }
                }}
                unavailableTimes={currentTableReservedTimes} 
              />
            </div>
            
            <button
              onClick={() => setShowMobileClock(false)}
              className="w-full py-3.5 mt-4 bg-primary text-white rounded-xl font-bold"
            >
              Confirm Time
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal overlay over the checkout modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-foreground">Account Required</h3>
                <p className="text-xs text-muted-foreground mt-1">Guests cannot place orders. Please sign up or select a profile.</p>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="p-2 bg-muted hover:bg-muted/70 rounded-full transition-colors text-foreground">
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Quick Sign up Form */}
              <form onSubmit={handleSignupAndOrder} className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">1. Quick Sign Up</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input required type="text" value={signupForm.name} onChange={e => setSignupForm({...signupForm, name: e.target.value})} className="w-full p-2.5 rounded-xl border border-border bg-background" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5">Phone <span className="text-red-500">*</span></label>
                    <input required type="tel" value={signupForm.phone} onChange={e => setSignupForm({...signupForm, phone: e.target.value})} className="w-full p-2.5 rounded-xl border border-border bg-background" placeholder="0800 000 0000" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1.5">Email Address</label>
                    <input type="email" value={signupForm.email} onChange={e => setSignupForm({...signupForm, email: e.target.value})} className="w-full p-2.5 rounded-xl border border-border bg-background" placeholder="john@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1.5">Delivery Address (Optional)</label>
                    <input type="text" value={signupForm.address} onChange={e => setSignupForm({...signupForm, address: e.target.value})} className="w-full p-2.5 rounded-xl border border-border bg-background" placeholder="123 Rayfield, Jos" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3.5 bg-foreground text-background font-bold rounded-xl shadow-md hover:opacity-90 mt-2">
                  Sign Up & Place Order
                </button>
              </form>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60"></div></div>
                <div className="relative px-4 bg-card text-xs font-bold text-muted-foreground uppercase tracking-widest">OR</div>
              </div>

              {/* Demo Quick Switcher */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">2. Select Demo Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_NIGERIAN_USERS.filter(u => u.role === 'customer').slice(0, 4).map(user => (
                    <button 
                      key={user.id} 
                      type="button"
                      onClick={() => handleSelectDemoUserAndOrder(user)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-primary/50 text-left transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {user.avatar}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-sm text-foreground truncate">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.phone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Checkout Modal */}
      {variant === 'inline' ? content : (
        <div className="fixed inset-0 z-[99998] flex flex-col md:items-center md:justify-center bg-black/75 backdrop-blur-sm p-0 md:p-6 lg:p-8 overflow-y-auto w-full h-full">
          <div className="w-full min-h-screen md:min-h-0 md:h-auto md:max-h-[92vh] max-w-6xl xl:max-w-7xl bg-background md:rounded-3xl shadow-2xl border-0 md:border md:border-border overflow-hidden flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully wrote UnifiedCheckout.tsx');
