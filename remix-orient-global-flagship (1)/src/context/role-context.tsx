
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { cmsApi } from '@/services/cmsApi';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, doc, getDoc, setDoc, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/firebase';
import { getActiveConsumerUser, setActiveConsumerUser, getActiveAdminUser, setActiveAdminUser } from '@/services/userService';

export type UserRole = 'boss' | 'hod' | 'staff' | 'customer';
export type DivisionId = 'bakery' | 'dining' | 'games' | 'lounge' | 'market' | 'water' | 'global';

export interface UserProfile {
 id: string;
 name: string;
 email: string;
 role: UserRole;
 division: DivisionId;
 avatar: string;
 status?: 'active' | 'pending';
}

export interface ApprovalRequest {
 id: string;
 requesterId: string;
 requesterName: string;
 targetRoleId: 'hod' | 'boss';
 division: DivisionId;
 actionLabel: string;
 description: string;
 status: 'pending' | 'approved' | 'declined';
 timestamp: string;
 declineReason?: string;
 oldValue?: string;
 newValue?: string;
 payload?: any;
}

export interface AuditLog {
 id: string;
 timestamp: string;
 itemName: string;
 oldValue: string;
 newValue: string;
 staffName: string;
 staffRole: string;
 approverName: string;
 approverRole: string;
 reason: string;
 division: DivisionId;
}

export interface MenuItem {
 id: string;
 name: string;
 category: string;
 price: number;
 description: string;
 ingredients?: string[];
 isAvailable: boolean;
 isChefSpecial?: boolean;
 imageUrl: string;
 status: 'live' | 'staged';
 isNew?: boolean;
}

export interface LabDrink {
 id: string;
 name: string;
 status: 'testing' | 'featured' | 'retired';
 teaserText: string;
 visualizerSettings: {
 themeColor: string;
 animationSpeed: 'slow' | 'pulse' | 'rapid';
 backgroundVideoUrl: string;
 };
}

export interface VIPBooking {
 id: string;
 customerName: string;
 tableId: string;
 date: string;
 partySize: number;
 status: 'pending' | 'approved' | 'rejected';
}

export interface WaterLog {
 id: string;
 date: string;
 ph: number;
 tds: number;
 status: 'nominal' | 'alert' | 'critical';
}

export interface SKUItem {
 id: string;
 sku: string;
 name: string;
 brand: string;
 category: 'Produce' | 'Pantry' | 'Beverages' | 'Household' | 'Imported';
 price: number;
 stock: number;
 isBOGOF: boolean;
 isUnder5: boolean;
}

export interface Tournament {
 id: string;
 title: string;
 prizePool: number;
 status: string;
 game_title: string;
}

export interface HardwareRig {
 id: string;
 type: string;
 status: string;
 health: number;
}

export interface Notification {
 id: string;
 userId: string;
 message: string;
 timestamp: string;
 read: boolean;
 status?: 'attended' | 'unattended' | 'in_progress';
 division?: string;
 category?: 'inventory' | 'staff' | 'finance' | 'system';
}

export interface RoleContextType {
 currentUser: UserProfile | null;
 setCurrentUser: (user: UserProfile | null) => void;
 loginWithGoogle: () => Promise<void>;
 loginWithEmail: (email: string, password: string) => Promise<void>;
 signupWithEmail: (email: string, password: string, name: string, role?: UserRole, division?: DivisionId) => Promise<void>;
 logout: () => Promise<void>;
 isAuthReady: boolean;
 requests: ApprovalRequest[];
 auditLogs: AuditLog[];
 notifications: Notification[];
 createRequest: (request: Omit<ApprovalRequest, 'id' | 'timestamp' | 'status'>) => void;
 addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
 updateRequestStatus: (id: string, status: 'approved' | 'declined', reason?: string) => Promise<void>;
 addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
 markNotificationRead: (id: string) => void;
 updateNotificationStatus: (id: string, status: 'attended' | 'unattended' | 'in_progress') => void;
 activeDivisionView: DivisionId;
 setActiveDivisionView: (division: DivisionId) => void;
 activeModule: string;
 setActiveModule: (module: string) => void;
 canExecuteLocally: (sensitivity: 'low' | 'high') => boolean;
 
 // Division States
 diningMenu: MenuItem[];
 loungeMenu: MenuItem[];
 labDrinks: LabDrink[];
 vipBookings: VIPBooking[];
 waterLogs: WaterLog[];
 skus: SKUItem[];
 
 tournaments: Tournament[];
 hardwareRigs: HardwareRig[];
 sommelierList: any[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    let active = null;
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('orient_dashboard_mode');
      if (mode === 'admin') {
        active = getActiveAdminUser();
      } else if (mode === 'customer') {
        active = getActiveConsumerUser();
      } else {
        active = getActiveConsumerUser();
      }
    }
    
    if (active) {
      return {
        id: active.id,
        name: active.name,
        email: active.email || `${active.phone.replace(/\s+/g, '')}@orientglobal.ng`,
        role: (active.role as UserRole) || 'customer',
        division: (active.division as DivisionId) || 'global',
        avatar: active.avatar || 'US'
      };
    }
    return null;
  });
  const [isAuthReady, setIsAuthReady] = useState(true);
  const [activeDivisionView, setActiveDivisionView] = useState<DivisionId>('global');
  const [activeModule, setActiveModule] = useState<string>('');
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Synchronize state dynamically whenever active user changes anywhere in the app
  useEffect(() => {
    const syncUser = (e?: any) => {
      let active = e?.detail;
      if (!active) {
        const mode = sessionStorage.getItem('orient_dashboard_mode');
        active = mode === 'admin' ? getActiveAdminUser() : getActiveConsumerUser();
      }
      if (active) {
        setCurrentUser({
          id: active.id,
          name: active.name,
          email: active.email || `${active.phone.replace(/\s+/g, '')}@orientglobal.ng`,
          role: (active.role as UserRole) || 'customer',
          division: (active.division as DivisionId) || 'global',
          avatar: active.avatar || 'US'
        });
      } else {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener('orient_consumer_user_changed', syncUser);
    window.addEventListener('orient_admin_user_changed', syncUser);
    return () => {
      window.removeEventListener('orient_consumer_user_changed', syncUser);
      window.removeEventListener('orient_admin_user_changed', syncUser);
    };
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  const loginWithGoogle = async () => {};

  const loginWithEmail = async (email: string, password: string) => {};

  const signupWithEmail = async (email: string, password: string, name: string, role: UserRole = 'customer', division: DivisionId = 'global') => {};

  const logout = async () => {
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('orient_dashboard_mode');
      if (mode === 'admin') {
        setActiveAdminUser(null);
      } else {
        setActiveConsumerUser(null);
      }
      sessionStorage.removeItem('orient_dashboard_mode');
    }
    setCurrentUser(null);
  };

 // Initial Mock Audit Logs
 useEffect(() => {
 setAuditLogs([
 {
 id: 'LOG-001',
 timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
 itemName: 'Raspberry Velvet Cake',
 oldValue: '₦40,000',
 newValue: '₦45,000',
 staffName: 'Ahmed Lawal',
 staffRole: 'Staff',
 approverName: 'Chef Tunde',
 approverRole: 'Manager',
 reason: 'Increased ingredient costs',
 division: 'bakery'
 },
 {
 id: 'LOG-002',
 timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
 itemName: 'Dom Perignon',
 oldValue: '₦220,000',
 newValue: '₦250,000',
 staffName: 'Elena Rossi',
 staffRole: 'Staff',
 approverName: 'Femi Kuti',
 approverRole: 'Manager',
 reason: 'Vintage scarcity adjustment',
 division: 'lounge'
 }
 ]);
 }, []);

 // Dining
 const [diningMenu] = useState<MenuItem[]>([
 { id: 'MENU-001', name: 'Pounded Yam & Egusi', category: 'Traditional', price: 12500, description: 'Hand-pounded yam with rich egusi soup.', ingredients: ['Yam', 'Melon Seed'], isAvailable: true, imageUrl: 'https://picsum.photos/seed/yam/400/300', status: 'live' },
 ]);

 // Lounge
 const [loungeMenu] = useState<MenuItem[]>([
 { id: 'L-001', name: 'Dom Perignon', category: 'Bottle Service', price: 250000, description: 'Vintage Champagne.', isAvailable: true, imageUrl: 'https://picsum.photos/seed/lounge1/400/300', status: 'live' },
 ]);
 const [labDrinks] = useState<LabDrink[]>([
 { id: 'LAB-402', name: 'Zobo Infusion v2', status: 'testing', teaserText: 'Hibiscus meets cold nitrogen.', visualizerSettings: { themeColor: '#FF00FF', animationSpeed: 'pulse', backgroundVideoUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1eHhkd3R4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKDkDbIDJieKbVm/giphy.mp4' } }
 ]);
 const [vipBookings] = useState<VIPBooking[]>([
 { id: 'B-001', customerName: 'Chief Okoro', tableId: 'V-04', date: '2024-05-20', partySize: 4, status: 'pending' }
 ]);

 // Water
 const [waterLogs] = useState<WaterLog[]>([
 { id: 'W-001', date: '2024-05-18', ph: 7.2, tds: 125, status: 'nominal' }
 ]);

 // Market
 const [skus] = useState<SKUItem[]>([
 { id: 'SKU-001', sku: 'MKT-IMP-902', name: 'Swiss Dark Chocolate', brand: 'Lindt', category: 'Imported', price: 8500, stock: 45, isBOGOF: false, isUnder5: false }
 ]);

 const [tournaments] = useState([
 { id: 'TOUR-01', title: 'Cyber Odyssey 2024', prizePool: 50000000, status: 'live', game_title: 'Lagos Saber' },
 ]);
 const [hardwareRigs] = useState([
 { id: 'RIG-01', type: 'Pro VR', status: 'available', health: 98 },
 { id: 'RIG-02', type: 'Pro VR', status: 'maintenance', health: 42 },
 ]);
 const [sommelierList] = useState([]);

 useEffect(() => {
 if (currentUser) setActiveDivisionView(currentUser.division);
 }, [currentUser]);

 const createRequest = (req: Omit<ApprovalRequest, 'id' | 'timestamp' | 'status'>) => {
 const newRequest: ApprovalRequest = {
 ...req,
 id: `REQ-${Math.floor(Math.random() * 10000)}`,
 status: 'pending',
 timestamp: new Date().toISOString(),
 };
 setRequests(prev => [newRequest, ...prev]);
 };

 const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
 const newLog: AuditLog = {
 ...log,
 id: `LOG-${Math.floor(Math.random() * 100000)}`,
 timestamp: new Date().toISOString(),
 };
 setAuditLogs(prev => [newLog, ...prev]);
 };

 const sendDeviceNotification = (title: string, body: string) => {
   if (typeof window !== 'undefined' && 'Notification' in window) {
     if (Notification.permission === 'granted') {
       try {
         new Notification(title, { body, icon: '/favicon.ico' });
       } catch (e) {
         console.warn('Device notification error:', e);
       }
     } else if (Notification.permission !== 'denied') {
       Notification.requestPermission().then(permission => {
         if (permission === 'granted') {
           try {
             new Notification(title, { body, icon: '/favicon.ico' });
           } catch (e) {
             console.warn('Device notification error:', e);
           }
         }
       });
     }
   }
 };

 const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
 const newNotif: Notification = {
 ...notif,
 id: `NOTIF-${Math.floor(Math.random() * 10000)}`,
 timestamp: new Date().toISOString(),
 read: false,
 };
 setNotifications(prev => [newNotif, ...prev]);

 sendDeviceNotification(
   notif.message || 'Orient Global Notification',
   notif.division ? `Division: ${notif.division}` : 'Orient Global System Update'
 );
 };

 const markNotificationRead = (id: string) => {
 setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
 };

 const updateNotificationStatus = (id: string, status: 'attended' | 'unattended' | 'in_progress') => {
 setNotifications(prev => prev.map(n => n.id === id ? { ...n, status, read: true } : n));
 };

 const updateRequestStatus = async (id: string, status: 'approved' | 'declined', reason?: string) => {
 const request = requests.find(r => r.id === id);
 if (!request) return;

 if (status === 'approved') {
 if (request.oldValue && request.newValue) {
 addAuditLog({
 itemName: request.actionLabel,
 oldValue: request.oldValue,
 newValue: request.newValue,
 staffName: request.requesterName,
 staffRole: 'Staff',
 approverName: currentUser?.name || 'Manager',
 approverRole: currentUser?.role === 'boss' ? 'Director' : 'Manager',
 reason: request.description,
 division: request.division
 });
 }

 // Apply the actual change
 if (request.payload?.type === 'product') {
 try {
 if (request.payload.action === 'update' && request.payload.id) {
 await cmsApi.updateProduct(request.payload.id, request.payload.data);
 } else if (request.payload.action === 'create') {
 await cmsApi.createProduct(request.payload.data);
 }
 } catch (error) {
 console.error("Failed to apply approved product changes:", error);
 // Might want to handle this error more gracefully, but for now we'll just log it
 }
 }
 }

 setRequests(prev => prev.map(r => r.id === id ? { ...r, status, declineReason: reason } : r));
 
 // Notify the requester
 addNotification({
 userId: request.requesterId,
 message: `Your request "${request.actionLabel}" was ${status}. ${reason ? `Reason: ${reason}` : ''}`
 });
 };

  const canExecuteLocally = (sensitivity: 'low' | 'high') => {
    return true;
  };

  return (
 <RoleContext.Provider value={{ 
 currentUser, setCurrentUser, loginWithGoogle, loginWithEmail, signupWithEmail, logout, isAuthReady, requests, auditLogs, notifications, createRequest, addAuditLog, updateRequestStatus, addNotification, markNotificationRead, updateNotificationStatus,
 activeDivisionView, setActiveDivisionView, activeModule, setActiveModule, canExecuteLocally,
 diningMenu, loungeMenu, labDrinks, vipBookings, waterLogs, skus,
 tournaments, hardwareRigs, sommelierList
 }}>
 {children}
 </RoleContext.Provider>
 );
}

export function useRoles() {
 const context = useContext(RoleContext);
 if (!context) throw new Error('useRoles must be used within a RoleProvider');
 return context;
}
