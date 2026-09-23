
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        localStorage.setItem(key, val);
      }
    } catch (e) {}
  }
};
import { db, auth } from '../firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, Timestamp, writeBatch, increment } from 'firebase/firestore';
import { INITIAL_PRODUCTS_CATALOG } from '../data/productsCatalog';

export interface Division {
 id: string;
 name: string;
 slug: string;
 theme_config: any;
 active_status: boolean;
}

export interface ContentBlock {
 id: string;
 division_id: string;
 block_type: string;
 content_payload: any;
 order_index: number;
 published_at: string | null;
}

export interface WeeklyUpdate {
 id: string;
 division_id: string;
 title: string;
 status: 'draft' | 'pending_review' | 'published';
 scheduled_for: string | null;
 changeset: {
 action: 'create' | 'update' | 'delete';
 block_id: string;
 payload?: any;
 };
 created_by?: string;
 created_at?: string;
}

enum OperationType {
 CREATE = 'create',
 UPDATE = 'update',
 DELETE = 'delete',
 LIST = 'list',
 GET = 'get',
 WRITE = 'write',
}

interface FirestoreErrorInfo {
 error: string;
 operationType: OperationType;
 path: string | null;
 authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
 const errInfo: FirestoreErrorInfo = {
 error: error instanceof Error ? error.message : String(error),
 authInfo: {
 userId: auth.currentUser?.uid,
 email: auth.currentUser?.email,
 emailVerified: auth.currentUser?.emailVerified,
 isAnonymous: auth.currentUser?.isAnonymous,
 tenantId: auth.currentUser?.tenantId,
 providerInfo: auth.currentUser?.providerData.map(provider => ({
 providerId: provider.providerId,
 displayName: provider.displayName,
 email: provider.email,
 photoUrl: provider.photoURL
 })) || []
 },
 operationType,
 path
 };
 console.error('Firestore Error: ', JSON.stringify(errInfo));
 throw new Error(JSON.stringify(errInfo));
}

// Hardcoded divisions for now as they are static config
const DIVISIONS: Division[] = [
 { id: "div_bakery", name: "Bakery", slug: "bakery", theme_config: { archetype: "Warm Organic / Cultural" }, active_status: true },
 { id: "div_market", name: "Market", slug: "market", theme_config: { archetype: "Clean Utility / Data Grid" }, active_status: true },
 { id: "div_dining", name: "Dining", slug: "dining", theme_config: { archetype: "Dark Luxury / Editorial" }, active_status: true },
 { id: "div_games", name: "Games", slug: "games", theme_config: { archetype: "Brutalist / Technical Dashboard" }, active_status: true },
 { id: "div_water", name: "Water", slug: "water", theme_config: { archetype: "Atmospheric / Ultra-Minimalist" }, active_status: true },
 { id: "div_lounge", name: "Lounge", slug: "lounge", theme_config: { archetype: "Prestige / Immersive Media" }, active_status: true }
];

export const cmsApi = {
 // Public
 getDivisionContent: async (slug: string) => {
 try {
 const division = DIVISIONS.find(d => d.slug === slug);
 if (!division) throw new Error("Division not found");
 
 const q = query(collection(db, 'cms_content'), where('division_id', '==', division.id), where('status', '==', 'published'));
 const snapshot = await getDocs(q);
 const blocks = snapshot.docs.map(doc => {
 const data = doc.data();
 return {
 id: data.id,
 division_id: data.division_id,
 block_type: data.block_type,
 content_payload: data.content_payload,
 order_index: data.order_index,
 published_at: data.published_at ? data.published_at.toDate().toISOString() : null
 } as ContentBlock;
 });
 return { division, blocks };
 } catch (error) {
 console.warn(`Could not fetch cms_content for division ${slug}:`, error);
 const division = DIVISIONS.find(d => d.slug === slug) || { id: `div_${slug}`, name: slug, slug, theme_config: {}, active_status: true };
 return { division, blocks: [] };
 }
 },
 
 // Admin
 getDivisions: async (): Promise<{ divisions: Division[] }> => {
 return { divisions: DIVISIONS };
 },
 
 getAllContentBlocks: async (): Promise<{ contentBlocks: ContentBlock[] }> => {
 try {
 const snapshot = await getDocs(collection(db, 'cms_content'));
 const contentBlocks = snapshot.docs.map(doc => {
 const data = doc.data();
 return {
 id: data.id,
 division_id: data.division_id,
 block_type: data.block_type,
 content_payload: data.content_payload,
 order_index: data.order_index,
 published_at: data.published_at ? data.published_at.toDate().toISOString() : null
 } as ContentBlock;
 });
 return { contentBlocks };
 } catch (error) {
 console.warn("Could not fetch all content blocks from cms_content:", error);
 return { contentBlocks: [] };
 }
 },
 
 createContentBlock: async (data: Partial<ContentBlock>, userContext?: { role: string; id: string }): Promise<ContentBlock> => {
 try {
 const newId = `cb_${Date.now()}`;
 const isHOD = userContext?.role === 'boss' || userContext?.role === 'hod';
 
 const newBlock = {
 id: newId,
 division_id: data.division_id || 'div_market',
 block_type: data.block_type || 'unknown',
 content_payload: data.content_payload || {},
 order_index: data.order_index || 0,
 status: isHOD ? 'published' : 'draft',
 updatedBy: userContext?.id || 'anonymous',
 updatedAt: Timestamp.now(),
 ...(isHOD ? { published_at: Timestamp.now() } : {})
 };
 
 await setDoc(doc(db, 'cms_content', newId), newBlock);
 
 if (!isHOD) {
 const updateId = `wu_${Date.now()}`;
 await setDoc(doc(db, 'weekly_updates', updateId), {
 id: updateId,
 division_id: data.division_id || 'div_market',
 title: `New ${data.block_type} block added`,
 status: 'pending_review',
 scheduled_for: null,
 changeset: { action: 'create', block_id: newId },
 created_by: userContext?.id || 'anonymous',
 created_at: new Date().toISOString()
 });
 }
 
 return {
 id: newBlock.id,
 division_id: newBlock.division_id,
 block_type: newBlock.block_type,
 content_payload: newBlock.content_payload,
 order_index: newBlock.order_index,
 published_at: isHOD ? new Date().toISOString() : null
 };
 } catch (error) {
 handleFirestoreError(error, OperationType.CREATE, 'cms_content');
 throw error;
 }
 },
 
 updateContentBlock: async (id: string, data: Partial<ContentBlock>, userContext?: { role: string; id: string }): Promise<ContentBlock> => {
 try {
 const isHOD = userContext?.role === 'boss' || userContext?.role === 'hod';
 const blockRef = doc(db, 'cms_content', id);
 const blockSnap = await getDoc(blockRef);
 
 if (!blockSnap.exists()) throw new Error("Block not found");
 const blockData = blockSnap.data();
 
 if (isHOD) {
 await updateDoc(blockRef, {
 content_payload: data.content_payload || blockData.content_payload,
 order_index: data.order_index !== undefined ? data.order_index : blockData.order_index,
 status: 'published',
 updatedBy: userContext?.id || 'anonymous',
 updatedAt: Timestamp.now(),
 published_at: Timestamp.now()
 });
 } else {
 const updateId = `wu_${Date.now()}`;
 await setDoc(doc(db, 'weekly_updates', updateId), {
 id: updateId,
 division_id: blockData.division_id,
 title: `Update request for block ${id}`,
 status: 'pending_review',
 scheduled_for: null,
 changeset: { action: 'update', block_id: id, payload: data.content_payload },
 created_by: userContext?.id || 'anonymous',
 created_at: new Date().toISOString()
 });
 }
 
 return {
 id: blockData.id,
 division_id: blockData.division_id,
 block_type: blockData.block_type,
 content_payload: isHOD ? (data.content_payload || blockData.content_payload) : blockData.content_payload,
 order_index: isHOD ? (data.order_index !== undefined ? data.order_index : blockData.order_index) : blockData.order_index,
 published_at: isHOD ? new Date().toISOString() : (blockData.published_at ? blockData.published_at.toDate().toISOString() : null)
 };
 } catch (error) {
 handleFirestoreError(error, OperationType.UPDATE, `cms_content/${id}`);
 throw error;
 }
 },
 
 getWeeklyUpdates: async (): Promise<{ updates: WeeklyUpdate[] }> => {
 try {
 const snapshot = await getDocs(collection(db, 'weekly_updates'));
 const updates = snapshot.docs.map(doc => doc.data() as WeeklyUpdate);
 return { updates };
 } catch (error) {
 console.warn("Could not fetch weekly_updates:", error);
 return { updates: [] };
 }
 },
 
 publishUpdates: async (updateIds: string[], userContext?: { role: string; id: string }): Promise<any> => {
 try {
 const isHOD = userContext?.role === 'boss' || userContext?.role === 'hod';
 if (!isHOD) throw new Error("Unauthorized to publish");

 for (const uid of updateIds) {
 const updateRef = doc(db, 'weekly_updates', uid);
 const updateSnap = await getDoc(updateRef);
 if (updateSnap.exists()) {
 const updateData = updateSnap.data() as WeeklyUpdate;
 if (updateData.status !== 'published') {
 await updateDoc(updateRef, { status: 'published' });
 
 const blockId = updateData.changeset.block_id;
 const blockRef = doc(db, 'cms_content', blockId);
 const blockSnap = await getDoc(blockRef);
 
 if (blockSnap.exists()) {
 const updatePayload: any = {
 status: 'published',
 updatedBy: userContext?.id || 'anonymous',
 updatedAt: Timestamp.now(),
 published_at: Timestamp.now()
 };
 if (updateData.changeset.action === 'update' && updateData.changeset.payload) {
 updatePayload.content_payload = updateData.changeset.payload;
 }
 await updateDoc(blockRef, updatePayload);
 }
 }
 }
 }
 return { message: "Updates published successfully" };
 } catch (error) {
 handleFirestoreError(error, OperationType.UPDATE, 'weekly_updates');
 throw error;
 }
 },

 deleteWeeklyUpdate: async (id: string): Promise<any> => {
 try {
 await deleteDoc(doc(db, 'weekly_updates', id));
 return { success: true };
 } catch (error) {
 handleFirestoreError(error, OperationType.DELETE, `weekly_updates/${id}`);
 throw error;
 }
 },

   // --- Product Management ---

  getProducts: async (): Promise<{ products: any[] }> => {
    let cached: any[] = [];
    try {
      const raw = safeStorage.getItem("orient_products_cache");
      if (raw) {
        cached = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Could not read products cache", e);
    }

    try {
      const snapshot = await getDocs(collection(db, "products"));
      if (snapshot.empty) {
        console.log("Firestore products empty, auto-seeding initial 90 items...");
        await cmsApi.seedInitialProducts(false);
        return { products: INITIAL_PRODUCTS_CATALOG };
      }

      let products: any[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: data.id || doc.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
        };
      });

      // Check if dining products have the new categories including Drinks & Cellar
      const hasDrinksCategory = products.some(p => p.division === 'dining' && p.category === 'Drinks & Cellar');
      if (!hasDrinksCategory) {
        console.log("Updating Firestore dining products with Drinks & Cellar category (5 drinks)...");
        await cmsApi.syncDiningProductsToFirestore();
        // Merge the updated dining items into products
        const diningCatalog = INITIAL_PRODUCTS_CATALOG.filter(p => p.division === 'dining');
        const nonDining = products.filter(p => p.division !== 'dining');
        products = [...nonDining, ...diningCatalog];
      }

      try {
        safeStorage.setItem("orient_products_cache", JSON.stringify(products));
      } catch (e) {}

      return { products };
    } catch (error) {
      console.warn("Firestore fetch error, falling back to cache or initial catalog:", error);
      if (cached && cached.length > 0) {
        return { products: cached };
      }
      return { products: INITIAL_PRODUCTS_CATALOG };
    }
  },

  syncDiningProductsToFirestore: async (): Promise<void> => {
    try {
      const diningItems = INITIAL_PRODUCTS_CATALOG.filter(p => p.division === 'dining');
      const batch = writeBatch(db);
      for (const item of diningItems) {
        const docRef = doc(db, "products", item.id);
        batch.set(docRef, {
          ...item,
          price: 10,
          stock: 5,
          prepTimeMinutes: 11,
          status: item.status || "active",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }, { merge: true });
      }
      await batch.commit();
      try {
        const raw = safeStorage.getItem("orient_products_cache");
        let list = raw ? JSON.parse(raw) : [...INITIAL_PRODUCTS_CATALOG];
        // remove old dining items and insert updated ones
        list = list.filter((p: any) => p.division !== 'dining');
        list.push(...diningItems.map(item => ({
          ...item,
          price: 10,
          stock: 5,
          prepTimeMinutes: 11,
          status: item.status || "active"
        })));
        safeStorage.setItem("orient_products_cache", JSON.stringify(list));
      } catch (e) {}
      console.log("Successfully synced Nigerian dining dishes & drinks to Firestore and cache!");
    } catch (err) {
      console.warn("Could not batch sync dining products to Firestore:", err);
    }
  },

  seedInitialProducts: async (force: boolean = false): Promise<void> => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      if (!snapshot.empty && !force) {
        return;
      }
      const batch = writeBatch(db);
      for (const item of INITIAL_PRODUCTS_CATALOG) {
        const docRef = doc(db, "products", item.id);
        batch.set(docRef, {
          ...item,
          price: item.division === 'dining' ? 10 : item.price,
          stock: 5,
          prepTimeMinutes: item.division === 'dining' ? 11 : item.prepTimeMinutes,
          status: item.status || "active",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }, { merge: true });
      }
      await batch.commit();
      try {
        safeStorage.setItem("orient_products_cache", JSON.stringify(INITIAL_PRODUCTS_CATALOG));
      } catch (e) {}
      console.log("Successfully seeded 90 products with stock: 5 to Firestore!");
    } catch (error) {
      console.error("Failed to seed initial products:", error);
      try {
        safeStorage.setItem("orient_products_cache", JSON.stringify(INITIAL_PRODUCTS_CATALOG));
      } catch (e) {}
    }
  },

  createProduct: async (product: any) => {
    try {
      const newId = product.id || `p${Date.now()}`;
      const newProduct = {
        ...product,
        id: newId,
        status: product.status || "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      await setDoc(doc(db, "products", newId), newProduct);

      try {
        const raw = safeStorage.getItem("orient_products_cache");
        const list = raw ? JSON.parse(raw) : [...INITIAL_PRODUCTS_CATALOG];
        list.push({ ...newProduct, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        safeStorage.setItem("orient_products_cache", JSON.stringify(list));
      } catch (e) {}

      return {
        ...newProduct,
        createdAt: newProduct.createdAt.toDate().toISOString(),
        updatedAt: newProduct.updatedAt.toDate().toISOString()
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "products");
      throw error;
    }
  },

  updateProduct: async (id: string, product: any) => {
    try {
      const productRef = doc(db, "products", id);
      const updateData = {
        ...product,
        updatedAt: Timestamp.now()
      };
      delete updateData.createdAt;
      
      await setDoc(productRef, updateData, { merge: true });

      try {
        const raw = safeStorage.getItem("orient_products_cache");
        if (raw) {
          const list = JSON.parse(raw);
          const index = list.findIndex((p: any) => p.id === id);
          if (index !== -1) {
            list[index] = { ...list[index], ...updateData, updatedAt: new Date().toISOString() };
            safeStorage.setItem("orient_products_cache", JSON.stringify(list));
          }
        }
      } catch (e) {}

      return { id, ...updateData };
    } catch (error) {
      console.warn("Firestore update error, updating local cache:", error);
      try {
        const raw = safeStorage.getItem("orient_products_cache");
        if (raw) {
          const list = JSON.parse(raw);
          const index = list.findIndex((p: any) => p.id === id);
          if (index !== -1) {
            list[index] = { ...list[index], ...product, updatedAt: new Date().toISOString() };
            safeStorage.setItem("orient_products_cache", JSON.stringify(list));
          }
        }
      } catch (e) {}
      return { id, ...product };
    }
  },

  updateStock: async (id: string, newStock: number) => {
    const stockVal = Math.max(0, Number(newStock) || 0);
    return cmsApi.updateProduct(id, { stock: stockVal });
  },

  deleteProduct: async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      try {
        const raw = safeStorage.getItem("orient_products_cache");
        if (raw) {
          const list = JSON.parse(raw).filter((p: any) => p.id !== id);
          safeStorage.setItem("orient_products_cache", JSON.stringify(list));
        }
      } catch (e) {}
      return { message: "Product deleted" };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      throw error;
    }
  },

// --- Order Management ---
 getOrders: async () => {
 try {
 const snapshot = await getDocs(collection(db, 'orders'));
 const orders = snapshot.docs.map(doc => {
 const data = doc.data();
 return {
 ...data,
 createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
 updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null
 };
 });
 return { orders };
 } catch (error) {
 handleFirestoreError(error, OperationType.LIST, 'orders');
 return { orders: [] };
 }
 },

 createOrder: async (order: any) => {
 try {
 const newId = `ORD-${Date.now()}`;
 const newOrder = {
 ...order,
 id: newId,
 createdAt: Timestamp.now(),
 updatedAt: Timestamp.now()
 };
 
 const batch = writeBatch(db);
 
 // Add the order to the batch
 const orderRef = doc(db, 'orders', newId);
 batch.set(orderRef, newOrder);
 
 // Deduct stock for each item
 if (order.items && Array.isArray(order.items)) {
 for (const item of order.items) {
 if (item.id) {
 const productRef = doc(db, 'products', item.id);
 batch.update(productRef, {
 stock: increment(-item.quantity),
 updatedAt: Timestamp.now()
 });
 }
 }
 }
 
 await batch.commit();
 
 return {
 ...newOrder,
 createdAt: newOrder.createdAt.toDate().toISOString(),
 updatedAt: newOrder.updatedAt.toDate().toISOString()
 };
 } catch (error) {
 handleFirestoreError(error, OperationType.CREATE, 'orders');
 throw error;
 }
 },

 updateOrder: async (id: string, updates: any) => {
 try {
 const orderRef = doc(db, 'orders', id);
 const updateData = {
 ...updates,
 updatedAt: Timestamp.now()
 };
 // Remove id and createdAt so they aren't overwritten
 delete updateData.id;
 delete updateData.createdAt;
 
 await updateDoc(orderRef, updateData);
 return { id, ...updateData };
 } catch (error) {
 handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
 throw error;
 }
 },

 getOrderById: async (id: string) => {
 try {
 const docRef = doc(db, 'orders', id);
 const snapshot = await getDoc(docRef);
 if (!snapshot.exists()) return null;
 const data = snapshot.data();
 return {
 ...data,
 id: snapshot.id,
 createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
 updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null
 };
 } catch (error) {
 handleFirestoreError(error, OperationType.GET, `orders/${id}`);
 throw error;
 }
 }
};
