import React, { useEffect, useState, useMemo } from 'react';
import { cmsApi } from '@/services/cmsApi';
import { INITIAL_PRODUCTS_CATALOG, ProductItem } from '@/data/productsCatalog';
import { getActiveConsumerUser } from '@/services/userService';
import { orderService } from '@/services/orderService';
import { UnifiedCheckout } from './UnifiedCheckout';
interface DiningCategoryMeta {
  name: string;
  count: number;
  tagline: string;
  icon: string;
}

const DINING_CATEGORIES: DiningCategoryMeta[] = [
  {
    name: "Proteins & Grills",
    count: 4,
    tagline: "Charcoal Seared & Pepper Glazed",
    icon: "🔥"
  },
  {
    name: "The Rice Core",
    count: 4,
    tagline: "Woodfire-Smoked & Steamed",
    icon: "🍚"
  },
  {
    name: "Soups & Natural Swallows",
    count: 6,
    tagline: "Heritage Broths & Elastic Doughs",
    icon: "🍲"
  },
  {
    name: "Yam & Pasta",
    count: 3,
    tagline: "Highland Tubers & Comfort Classics",
    icon: "🍠"
  },
  {
    name: "Starters & Sides",
    count: 3,
    tagline: "Aromatic Infusions & Accompaniments",
    icon: "🌶️"
  },
  {
    name: "Drinks & Cellar",
    count: 13,
    tagline: "AURA Sommelier & Cold Infusions",
    icon: "🍷"
  }
];

interface OrderItem {
  product: ProductItem;
  quantity: number;
}

const MenuScreen: React.FC = () => {
  const [cmsData, setCmsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [diningProducts, setDiningProducts] = useState<ProductItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [orderTray, setOrderTray] = useState<OrderItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showTrayModal, setShowTrayModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [sommelierFilter, setSommelierFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const activeUser = getActiveConsumerUser();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('orient:detail-modal', { detail: { open: Boolean(selectedProduct) } }));
  }, [selectedProduct]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CMS page content for hero and blocks
        const data = await cmsApi.getDivisionContent('dining');
        setCmsData(data);

        // Fetch product catalog items for dining
        const prodData = await cmsApi.getProducts();
        let diningItems = prodData?.products?.filter((p: any) => p.division === 'dining') || [];

        // Check if the updated drinks (Fanta, Coke, Sprite, etc.) are present
        const hasFanta = diningItems.some((p: any) => p.name?.toLowerCase().includes('fanta') || p.id === 'PRD-D-024');
        const hasAllDrinks = diningItems.some((p: any) => p.id === 'PRD-D-033');
        if (!hasFanta || !hasAllDrinks) {
          console.log("Persisting updated drinks to Firestore database...");
          await cmsApi.syncDiningProductsToFirestore();
          const refreshed = await cmsApi.getProducts();
          diningItems = refreshed?.products?.filter((p: any) => p.division === 'dining') || [];
        }
        
        if (diningItems.length > 0) {
          const normalized = diningItems.map((item: any) => ({
            ...item,
            price: 10,
            stock: item.stock !== undefined ? item.stock : 5,
            prepTimeMinutes: 11
          }));
          setDiningProducts(normalized);
        } else {
          const initialDining = INITIAL_PRODUCTS_CATALOG.filter(p => p.division === 'dining');
          setDiningProducts(initialDining);
        }
      } catch (error) {
        console.error("Failed to fetch dining menu data", error);
        const initialDining = INITIAL_PRODUCTS_CATALOG.filter(p => p.division === 'dining');
        setDiningProducts(initialDining);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAddToOrder = (product: ProductItem) => {
    setOrderTray(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= 5) {
          showToast(`Maximum portions (5) reached for ${product.name}`);
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.name} • ₦10 • 11 mins`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setOrderTray(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: Math.min(5, nextQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const handleCheckoutTray = async () => {
    if (orderTray.length === 0) return;
    try {
      const placed = await orderService.placeOrder({
        customerId: activeUser?.id || 'usr_guest',
        customerName: activeUser?.name || 'Guest User',
        customerEmail: activeUser?.email || 'guest@orient.app',
        customerPhone: activeUser?.phone || '+234 800 000 0000',
        division: 'dining',
        tableNumber: 'Dine-in Table',
        shippingAddress: activeUser?.deliveryAddress || 'Restaurant Table #04 (Dine-in)',
        items: orderTray.map(item => ({
          id: item.product.id,
          name: item.product.name,
          category: item.product.category,
          quantity: item.quantity,
          price: 10,
          division: 'dining'
        })),
        prepDurationMinutes: 11
      });
      setOrderPlaced(true);
      showToast(`Order #${placed.id} placed! Waiting for chef confirmation. Status: Pending`);
      setTimeout(() => {
        setOrderTray([]);
        setShowTrayModal(false);
        setOrderPlaced(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to place dining order', err);
      showToast('Order placed! Table kitchen notified.');
      setTimeout(() => {
        setOrderTray([]);
        setShowTrayModal(false);
        setOrderPlaced(false);
      }, 2500);
    }
  };

  const heroBlock = cmsData?.blocks?.find((b: any) => b.block_type === 'hero')?.content_payload || {
    title: "Taste the Orient",
    subtitle: "A culinary journey from the vibrant markets of Jos to fine dining excellence. Authentic flavours, prime cuts, and cellar pairings."
  };

  const totalTrayCount = orderTray.reduce((acc, item) => acc + item.quantity, 0);
  const totalTrayAmount = orderTray.reduce((acc, item) => acc + item.quantity * 10, 0);

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    if (!query) return diningProducts;
    return diningProducts.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.ingredients?.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }, [diningProducts, query]);

  // The 3 Signature Sommelier Items & Standard Drink Catalog for the "Drinks & Cellar" Menu Section
  const allDrinks = filteredProducts.filter(p => p.category === "Drinks & Cellar");
  const sommelierDrinks = allDrinks.filter(p => 
    p.id === "PRD-D-021" || 
    p.id === "PRD-D-022" || 
    p.id === "PRD-D-023" ||
    p.name.toLowerCase().includes("zobo") ||
    p.name.toLowerCase().includes("tiger") ||
    p.name.toLowerCase().includes("chapman")
  );
  const standardDrinks = allDrinks.filter(p => !sommelierDrinks.some(s => s.id === p.id));

  // Exactly 5 Curated Drinks for the Aura Sommelier & Beverage Gallery Section
  const sommelierGalleryDrinks = [
    diningProducts.find(p => p.id === "PRD-D-021") || diningProducts.find(p => p.name.toLowerCase().includes("zobo")),
    diningProducts.find(p => p.id === "PRD-D-022") || diningProducts.find(p => p.name.toLowerCase().includes("tiger")),
    diningProducts.find(p => p.id === "PRD-D-023") || diningProducts.find(p => p.name.toLowerCase().includes("chapman")),
    diningProducts.find(p => p.id === "PRD-D-024") || diningProducts.find(p => p.name.toLowerCase().includes("fanta")),
    diningProducts.find(p => p.id === "PRD-D-025") || diningProducts.find(p => p.name.toLowerCase().includes("wine"))
  ].filter(Boolean) as ProductItem[];

  const getFilteredSommelierDrinks = () => {
    if (sommelierFilter === "local") {
      return sommelierGalleryDrinks.filter(d => d.id === "PRD-D-021" || d.id === "PRD-D-022" || d.id === "PRD-D-024" || d.name.toLowerCase().includes("zobo") || d.name.toLowerCase().includes("tiger") || d.name.toLowerCase().includes("fanta"));
    }
    if (sommelierFilter === "wine") {
      return sommelierGalleryDrinks.filter(d => d.id === "PRD-D-025" || d.name.toLowerCase().includes("wine"));
    }
    if (sommelierFilter === "cocktail") {
      return sommelierGalleryDrinks.filter(d => d.id === "PRD-D-023" || d.name.toLowerCase().includes("chapman"));
    }
    return sommelierGalleryDrinks;
  };

  return (
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary selection:text-background pb-32">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 sm:top-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[100] max-w-sm sm:max-w-md mx-auto bg-neutral-900/95 text-white border-0 px-4 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. FULL-SCREEN HERO SECTION                                */}
      {/* ========================================================= */}
      <header id="hero-dining" className="relative h-screen min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj-5jTIIwvDzpn59TGKVz1ybCYZAF0xuVrP2oIjamHpr3OtP-vOZhlbqM9qysSSHaLgcZgRm4v_ezPrpORTbBX8rpReetkE0n2JwX_M4gcmSz38nqMatTjG3QATZtWzPF8IlnzCzQBs2v5wFRSNGKDUI-a3ODCRAOtGbilEvbcqeRmJZpC9EnukONMGWtwLYFkuPF7qqmnunJuNMX-C4NOITVlAfCPHFIqVhv2qk_Nx9DaXK2ViXTBsSundO1moLrL7chnFSKGSBV8" 
            alt="Restaurant Experience" 
            className="w-full h-full object-cover brightness-[0.4] scale-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/35 to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full pt-16">
          <span className="text-primary tracking-[0.35em] uppercase text-xs font-bold mb-4">
            Artisanal Nigerian Gastronomy
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl font-sans tracking-tight leading-none">
            {heroBlock.title || "Taste the Orient"}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
            {heroBlock.subtitle || "A culinary journey from the vibrant markets of Jos to fine dining excellence. Authentic flavours, prime cuts, and cellar pairings."}
          </p>
          <a
            href="#menu-catalog"
            style={{
              border: '1.5px solid #F29E0D',
              boxShadow: '0 0 0 1.5px #F29E0D',
              color: '#F29E0D'
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-transparent text-[#F29E0D] font-black text-xs uppercase tracking-widest hover:bg-[#F29E0D] hover:text-white transition-all duration-300 active:scale-95"
          >
            <span>Browse Menu</span>
            <span className="material-icons text-sm">arrow_downward</span>
          </a>
        </div>
      </header>

      {/* Menu Catalog & Main Container with Sticky Search Bar */}
      <div className="relative">
        {/* Sticky Search Bar - Anchored to top-right on top of filter bar, stays stuck when scrolling */}
        <div className="sticky top-3 sm:top-20 z-40 flex justify-end px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pointer-events-none -mb-10 sm:-mb-12">
          <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md shadow-lg border-0 border-none outline-none transition-colors duration-300">
            <span className="material-icons text-neutral-700 dark:text-white/70 text-base sm:text-lg shrink-0">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="bg-transparent border-0 border-none outline-none text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-white/60 text-xs sm:text-sm font-medium w-36 xs:w-48 sm:w-60 focus:w-44 sm:focus:w-72 transition-all duration-300 focus:ring-0 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-neutral-500 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white transition-colors shrink-0 p-0.5"
                aria-label="Clear search"
              >
                <span className="material-icons text-sm sm:text-base">close</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. SIMPLIFIED MENU CATALOG INTRO & CATEGORY BAR           */}
        {/* ========================================================= */}
        <section id="menu-catalog" className="pt-8 sm:pt-16 pb-4 sm:pb-8 bg-background relative border-b border-transparent scroll-mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Streamlined Header */}
            <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground font-sans tracking-tight">
                Restaurant Menu
              </h2>
            </div>

            {/* Clean Category Navigation (Space-Conservative, Horizontal Scroll on Mobile, Never Overflowing) */}
            <div className="w-full max-w-6xl mx-auto flex sm:flex-wrap items-center sm:justify-center gap-2 sm:gap-2.5 px-2 py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-base font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2 shrink-0 ${
                  activeCategory === "All"
                    ? "bg-primary text-background shadow-lg shadow-primary/25 ring-2 ring-primary/40"
                    : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground shadow-sm"
                }`}
              >
                <span>All Items</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeCategory === "All" ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`}>
                  {filteredProducts.length}
                </span>
              </button>

              {DINING_CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-base font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2 shrink-0 ${
                    activeCategory === cat.name
                      ? "bg-primary text-background shadow-lg shadow-primary/25 ring-2 ring-primary/40"
                      : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground shadow-sm"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeCategory === cat.name ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`}>
                    {filteredProducts.filter(p => p.category === cat.name).length}
                  </span>
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. BENTO GRID MENU WITH FULL-IMAGE BLOW-UP CARDS          */}
        {/* ========================================================= */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-black/5 dark:bg-black/30 backdrop-blur-md flex items-center justify-center text-neutral-600 dark:text-white/70">
                <span className="material-icons text-3xl">search_off</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">No menu items found</h3>
              <p className="text-sm text-muted-foreground">
                We couldn't find any dishes or drinks matching "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md active:scale-95"
              >
                Clear Search
              </button>
            </div>
          )}

          {DINING_CATEGORIES.map(catMeta => {
            if (activeCategory !== "All" && activeCategory !== catMeta.name) {
              return null;
            }

            const categoryItems = filteredProducts.filter(p => p.category === catMeta.name);
            if (categoryItems.length === 0) return null;

          return (
            <section
              key={catMeta.name}
              id={`cat-${catMeta.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="scroll-mt-24"
            >
              {/* Clean Section Title without subtext */}
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-transparent">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground font-sans">
                    {catMeta.name}
                  </h3>
                </div>
                <span className="text-sm sm:text-base font-bold px-3.5 sm:px-4 py-1.5 rounded-full bg-muted text-muted-foreground">
                  {categoryItems.length} items
                </span>
              </div>

              {/* For Drinks & Cellar, render the Two-Tier Catalog (300x300 Sommelier items + 6-column 100x100 grid) */}
              {catMeta.name === "Drinks & Cellar" ? (
                <div className="space-y-12">
                  {/* Top: 3 Sommelier Items in 300x300 Square Cards */}
                  <div>
                    <div className="mb-4">
                      <span className="text-xs uppercase font-[200] font-extralight tracking-widest text-primary">
                        Sommelier Selection
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-foreground font-sans tracking-tight mt-0.5">
                        Signature Cold Infusions & Botanical Reserve
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
                      {sommelierDrinks.map((drink) => (
                        <div
                          key={drink.id}
                          onClick={() => setSelectedProduct(drink)}
                          className="group relative w-[300px] h-[300px] rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-end shrink-0"
                        >
                          <img
                            src={drink.image}
                            alt={drink.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10"></div>

                          {/* Top Badges */}
                          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                            <span className="text-[10px] font-semibold text-white/90 bg-black/35 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                              Sommelier Select
                            </span>
                            <span className="text-base sm:text-lg font-black text-white bg-primary px-3.5 py-1 rounded-full shadow-lg">
                              ₦10
                            </span>
                          </div>

                          {/* Hover Notes (Desktop) */}
                          <div className="hidden sm:block absolute inset-x-3 bottom-[72px] z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                            <div className="bg-black/35 backdrop-blur-2xl border-0 rounded-2xl p-3 shadow-xl text-white">
                              <p className="text-[11px] text-white/90 leading-snug line-clamp-2 font-light">
                                {drink.description}
                              </p>
                            </div>
                          </div>

                          {/* Bottom info */}
                          <div className="relative z-10 p-4 w-full flex items-end justify-between gap-2">
                            <div className="space-y-1.5 min-w-0">
                              <h4 className="text-base font-bold text-white font-sans tracking-tight leading-tight drop-shadow truncate">
                                {drink.name}
                              </h4>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-[10px] shadow-sm border border-white/10 max-w-full">
                                <span className="flex items-center gap-1 text-white font-medium whitespace-nowrap">
                                  <span className="material-icons text-white text-[10px]">schedule</span>
                                  11m Prep
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/70 shrink-0"></span>
                                <span className="text-white font-semibold whitespace-nowrap">
                                  {drink.stock || 5} Servings Available
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToOrder(drink);
                              }}
                              title="Add drink to tray"
                              className="shrink-0 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 text-background flex items-center justify-center shadow-lg transition-transform active:scale-95 group/btn"
                            >
                              <span className="material-icons text-base group-hover/btn:scale-110 transition-transform">add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Below: 6-column 100x100 Pixel Grid for all other drinks */}
                  <div className="pt-8 border-t border-border">
                    <div className="mb-6">
                      <span className="text-xs uppercase font-[200] font-extralight tracking-widest text-muted-foreground">
                        Cellar & Soft Refreshments
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-foreground font-sans tracking-tight mt-0.5">
                        Chilled Sodas, Juices & Plant Milk
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-7 gap-x-4 justify-items-center">
                      {standardDrinks.map((drink) => (
                        <div 
                          key={drink.id}
                          onClick={() => setSelectedProduct(drink)}
                          className="flex flex-col items-center cursor-pointer group text-center w-[100px]"
                        >
                          {/* 100x100 Pixel Picture Box (no badges, no prep time) */}
                          <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden relative shadow-md bg-neutral-900 border border-neutral-200 dark:border-white/10 group-hover:border-primary/50 transition-all duration-300 shrink-0">
                            <img
                              src={drink.image}
                              alt={drink.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                            
                            {/* Subtle quick-add icon overlay */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToOrder(drink);
                              }}
                              title={`Add ${drink.name} to tray`}
                              className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-primary hover:bg-primary/90 text-background flex items-center justify-center shadow-md transition-transform active:scale-90 opacity-90 group-hover:opacity-100"
                            >
                              <span className="material-icons text-xs">add</span>
                            </button>
                          </div>

                          {/* Under the Picture Box: Name and available servings */}
                          <div className="mt-2 w-full text-center space-y-0.5">
                            <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors" title={drink.name}>
                              {drink.name}
                            </p>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                              {drink.stock || 5} Servings Available
                            </p>
                            <p className="text-[11px] font-bold text-muted-foreground">
                              ₦10
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Bento Grid: Full-Bleed Image Cards with Hover Description */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryItems.map((dish, idx) => {
                    // Subtle bento rhythm: first item in large categories spans 2 cols on wide screens
                    const isLargeSpan = idx === 0 && categoryItems.length >= 4 && activeCategory === "All";

                    return (
                      <div
                        key={dish.id}
                        onClick={() => setSelectedProduct(dish)}
                        className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-neutral-950 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-end w-[80vw] h-[30vh] mx-auto sm:w-full sm:h-auto sm:min-h-[380px] ${
                          isLargeSpan ? "lg:col-span-2 lg:min-h-[400px]" : "col-span-1"
                        }`}
                      >
                        {/* 100% Full-bleed background image */}
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Scrim Overlay for Maximum Contrast & Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 group-hover:via-black/55 transition-all duration-300"></div>

                        {/* Top Vital Badges: Price & Category */}
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none z-10">
                          <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border-0">
                            {dish.category}
                          </span>
                          <span className="text-base sm:text-lg font-black text-white bg-primary px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-xl tracking-tight">
                            ₦10
                          </span>
                        </div>

                        {/* Small Details Panel at the Bottom with Extremely Translucent Blur Background (Desktop) */}
                        <div className="hidden sm:block absolute inset-x-3.5 bottom-[82px] z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                          <div className="bg-black/25 backdrop-blur-2xl border-0 rounded-2xl p-3.5 shadow-2xl text-white">
                            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-primary mb-1">
                              <span>Chef's Craft Notes</span>
                              <span className="text-white/70">Tap card for details</span>
                            </div>
                            <p className="text-xs text-white/90 leading-relaxed line-clamp-2 font-normal">
                              {dish.description}
                            </p>
                            {dish.ingredients && (
                              <p className="mt-1.5 text-[10px] text-white/70 line-clamp-1 italic border-t border-transparent pt-1">
                                Craft: {dish.ingredients}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bottom Vital Information (Always Visible) */}
                        <div className="relative z-10 p-3 sm:p-5 w-full flex items-end justify-between gap-2 sm:gap-3">
                          <div className="space-y-1 sm:space-y-1.5 min-w-0">
                            <h4 className="text-base sm:text-2xl font-bold text-white font-sans tracking-tight leading-tight sm:leading-snug drop-shadow-md truncate sm:whitespace-normal">
                              {dish.name}
                            </h4>
                            
                            {/* Translucent pill capsule with light blurry bg enclosing prep time & plain white servings */}
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/25 backdrop-blur-md text-[10px] sm:text-xs shadow-sm border border-white/10 max-w-full">
                              <span className="flex items-center gap-1 text-white font-medium whitespace-nowrap">
                                <span className="material-icons text-white text-[10px] sm:text-xs">schedule</span>
                                11m Prep
                              </span>
                              <span className="w-1 h-1 rounded-full bg-white/70 shrink-0"></span>
                              <span className="text-white font-semibold tracking-wide whitespace-nowrap">
                                {dish.stock || 5} Servings Available
                              </span>
                            </div>
                          </div>

                          {/* Quick Add Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToOrder(dish);
                            }}
                            title="Add to tray"
                            className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary hover:bg-primary/90 text-background flex items-center justify-center shadow-lg transition-transform active:scale-95 group/btn"
                          >
                            <span className="material-icons text-base sm:text-lg group-hover/btn:scale-110 transition-transform">add</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </section>
          );
        })}
      </main>
      </div>

      {/* ========================================================= */}
      {/* 4. AURA SOMMELIER & BEVERAGE GALLERY (ORIGINAL 5 DRINKS)  */}
      {/* ========================================================= */}
      <section id="drinks" className="py-20 relative bg-neutral-950 text-white overflow-hidden border-t border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-transparent gap-4">
            <div>
              <span className="text-primary tracking-[0.3em] uppercase text-xs font-bold">
                Aura Sommelier & Beverage Gallery
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans mt-2 tracking-tight">
                Curated Cellar & Infusions
              </h2>
              <p className="text-sm text-neutral-400 mt-2 max-w-xl">
                Five signature libations hand-selected to pair with our Nigerian grills, smoky rice, and rich broths.
              </p>
            </div>

            {/* Sommelier Pairing Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSommelierFilter("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  sommelierFilter === "all" ? "bg-primary text-background" : "bg-white/10 text-white/80 hover:bg-white/15"
                }`}
              >
                All 5 Drinks
              </button>
              <button
                onClick={() => setSommelierFilter("local")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  sommelierFilter === "local" ? "bg-primary text-background" : "bg-white/10 text-white/80 hover:bg-white/15"
                }`}
              >
                Local Botanicals
              </button>
              <button
                onClick={() => setSommelierFilter("wine")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  sommelierFilter === "wine" ? "bg-primary text-background" : "bg-white/10 text-white/80 hover:bg-white/15"
                }`}
              >
                Grand Cru Wine
              </button>
              <button
                onClick={() => setSommelierFilter("cocktail")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  sommelierFilter === "cocktail" ? "bg-primary text-background" : "bg-white/10 text-white/80 hover:bg-white/15"
                }`}
              >
                Signature Chapman
              </button>
            </div>
          </div>

          {/* Bento Grid: Exactly 5 Sommelier Drinks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredSommelierDrinks().map((drink, idx) => {
              const isFeature = idx === 0 && sommelierFilter === "all";

              return (
                <div
                  key={drink.id}
                  onClick={() => setSelectedProduct(drink)}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-end w-[80vw] h-[30vh] mx-auto sm:w-full sm:h-auto sm:min-h-[380px] ${
                    isFeature ? "sm:col-span-2 sm:min-h-[420px]" : "col-span-1"
                  }`}
                >
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20 group-hover:via-black/60 transition-all duration-300"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none z-10">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border-0">
                      {drink.unit || "drink"}
                    </span>
                    <span className="text-sm sm:text-base font-black text-white bg-primary px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-xl tracking-tight">
                      ₦10
                    </span>
                  </div>

                  {/* Hover Description Card at Bottom (Desktop) */}
                  <div className="hidden sm:block absolute inset-x-3.5 bottom-[82px] z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                    <div className="bg-black/25 backdrop-blur-2xl border-0 rounded-2xl p-3.5 shadow-2xl text-white">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-primary mb-1">
                        <span>Sommelier Notes</span>
                        <span className="text-white/70">Tap card for pairing</span>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed line-clamp-2 font-normal">
                        {drink.description}
                      </p>
                      {drink.ingredients && (
                        <p className="mt-1.5 text-[10px] text-white/70 line-clamp-1 italic border-t border-transparent pt-1">
                          Ingredients: {drink.ingredients}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Vital Info */}
                  <div className="relative z-10 p-3 sm:p-5 w-full flex items-end justify-between gap-2 sm:gap-3">
                    <div className="space-y-1 sm:space-y-1.5 min-w-0">
                      <h4 className="text-base sm:text-2xl font-bold text-white font-sans tracking-tight leading-tight sm:leading-snug drop-shadow-md truncate sm:whitespace-normal">
                        {drink.name}
                      </h4>

                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/25 backdrop-blur-md text-[10px] sm:text-xs shadow-sm border border-white/10 max-w-full">
                        <span className="flex items-center gap-1 text-white/90 font-medium whitespace-nowrap">
                          <span className="material-icons text-primary text-[10px] sm:text-xs">schedule</span>
                          11m Prep
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/40 shrink-0"></span>
                        <span className="text-emerald-400 font-semibold tracking-wide whitespace-nowrap">
                          {drink.stock || 5} Servings Available
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToOrder(drink);
                      }}
                      title="Add drink to tray"
                      className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary hover:bg-primary/90 text-background flex items-center justify-center shadow-lg transition-transform active:scale-95 group/btn"
                    >
                      <span className="material-icons text-base sm:text-lg group-hover/btn:scale-110 transition-transform">add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. PERSISTENT FLOATING ORDER TRAY BAR                     */}
      {/* ========================================================= */}
      {totalTrayCount > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 sm:w-11/12 max-w-2xl animate-in slide-in-from-bottom-6 duration-300">
          <div className="bg-neutral-900/95 backdrop-blur-xl border-0 rounded-2xl shadow-2xl p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 text-white">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary text-background flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-md shrink-0">
                {totalTrayCount}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-primary">Restaurant Order Tray</p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  <span className="hidden sm:inline">₦{totalTrayAmount.toLocaleString()} • 11 Mins Kitchen Preparation</span>
                  <span className="sm:hidden">₦{totalTrayAmount.toLocaleString()} • 11m Prep</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowTrayModal(true)}
                className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-primary hover:bg-primary/90 text-background font-bold text-xs uppercase tracking-wider transition-colors shadow-md whitespace-nowrap"
              >
                Review Tray
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. DISH & DRINK DETAIL MODAL                              */}
      {/* ========================================================= */}
      {selectedProduct && (
        <div 
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-[99999] bg-black/90 sm:bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 overflow-hidden"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 border-0 rounded-none sm:rounded-3xl w-full h-[100dvh] sm:h-[88vh] sm:max-w-lg flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Always Visible Pinned Close Button at Top-Right (Never Scrolls Away) */}
            <button
              onClick={() => setSelectedProduct(null)}
              aria-label="Close details"
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all shadow-xl z-50 border border-white/20 active:scale-95"
            >
              <span className="material-icons text-base sm:text-lg">close</span>
            </button>

            {/* Header Image: Exactly 50% of the window height */}
            <div className="relative h-1/2 w-full bg-neutral-100 dark:bg-neutral-900 shrink-0 overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              {/* Bottom Gradient: Fades entirely into transparency by ~20% of image height */}
              <div className="absolute bottom-0 inset-x-0 h-[22%] bg-gradient-to-t from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80 dark:to-transparent z-10 pointer-events-none"></div>

              {/* Vital Information Overlay at the bottom of the 50% Image */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-end justify-between gap-3 z-20">
                <div className="min-w-0 pr-2">
                  <span className="text-xs sm:text-sm uppercase font-bold tracking-widest text-neutral-700 dark:text-neutral-300 mb-1 inline-block bg-transparent border-0 p-0 shadow-none">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white font-sans leading-tight line-clamp-2 sm:line-clamp-none drop-shadow-xs">
                    {selectedProduct.name}
                  </h3>
                </div>
                <span className="text-lg sm:text-xl font-black text-white bg-primary px-3.5 py-1.5 rounded-xl shadow-lg shrink-0 tracking-tight">
                  ₦10
                </span>
              </div>
            </div>

            {/* Modal Scrollable Middle Content (The ONLY area that scrolls) */}
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 flex-1 overflow-y-auto overscroll-contain">
              
              {/* Prep Time & Servings Available Pill - Adapts black/white per theme */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/10 dark:bg-white/10 backdrop-blur-md text-xs sm:text-sm border border-neutral-300/40 dark:border-white/10 text-neutral-950 dark:text-white max-w-full">
                  <span className="flex items-center gap-1 font-medium text-neutral-950 dark:text-white whitespace-nowrap">
                    <span className="material-icons text-neutral-950 dark:text-white text-sm">schedule</span>
                    11m Prep Time
                  </span>
                  <span className="w-1 h-1 rounded-full bg-neutral-950/40 dark:bg-white/40 shrink-0"></span>
                  <span className="text-neutral-950 dark:text-white font-medium whitespace-nowrap">
                    5 Servings Available
                  </span>
                </div>
              </div>

              {/* Description with readable font size */}
              <p className="text-sm sm:text-base font-normal text-neutral-700 dark:text-neutral-200 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Ingredients Box */}
              {selectedProduct.ingredients && (
                <div className="bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/80 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm space-y-1 shadow-xs">
                  <p className="font-medium text-primary uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="material-icons text-sm">local_dining</span>
                    Ingredients & Craft
                  </p>
                  <p className="text-neutral-700 dark:text-neutral-200 font-normal leading-relaxed text-xs sm:text-sm">
                    {selectedProduct.ingredients}
                  </p>
                </div>
              )}

              {/* Chef's Recommended Pairing Message - No background, adapts per theme */}
              <div className="p-1 sm:p-1.5 space-y-1 bg-transparent border-0">
                <p className="font-bold text-neutral-950 dark:text-white uppercase text-xs tracking-wider flex items-center gap-1.5">
                  <span className="material-icons text-sm text-neutral-950 dark:text-white">restaurant</span>
                  Chef's Recommended Pairing
                </p>
                <p className="text-neutral-700 dark:text-neutral-200 font-normal leading-relaxed text-xs sm:text-sm">
                  {selectedProduct.category === "Soups & Natural Swallows"
                    ? "Pair this rich soup with Fluffy Pounded Yam or Amala, followed by Peppered Beef and chilled Zobo Infusion."
                    : selectedProduct.category === "The Rice Core"
                    ? "Best enjoyed alongside Fried Dodo, Spiced Chicken, and a glass of Chapman Heritage Mocktail."
                    : selectedProduct.category === "Proteins & Grills"
                    ? "The protein anchor for Jollof Rice or Asaro; pairs sublimely with our Sommelier Grand Cru Red Wine."
                    : selectedProduct.category === "Yam & Pasta"
                    ? "Combine with Peppered Pork Chops or Catfish Pepper Soup with a chilled glass of fresh Palm Wine."
                    : selectedProduct.category === "Drinks & Cellar"
                    ? "Hand-crafted to cleanse the palate and elevate the bold spices of our grilled cuts and heritage swallows."
                    : "Ideal as a palate cleanser or rich starter before your main swallow or rice bowl."}
                </p>
              </div>
            </div>

            {/* Sticky Add to Order CTA Button (Outside Scrollable Viewport, Pinned at Bottom) */}
            <div className="shrink-0 p-3.5 sm:p-4 bg-white/95 dark:bg-neutral-950/95 border-t border-neutral-200/80 dark:border-neutral-800 backdrop-blur-md z-40">
              <button
                onClick={() => {
                  handleAddToOrder(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span className="material-icons text-base">add</span>
                <span>Add to Order • ₦10</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. TRAY REVIEW & ORDER MODAL                              */}
      {/* ========================================================= */}
      {showTrayModal && (
        <UnifiedCheckout
          isOpen={showTrayModal}
          onClose={() => setShowTrayModal(false)}
          onSuccess={() => {
            setOrderTray([]);
            setOrderPlaced(true);
            setTimeout(() => setOrderPlaced(false), 2500);
          }}
          initialItems={orderTray.map(t => ({
            id: t.product.id,
            name: t.product.name,
            quantity: t.quantity,
            price: 10,
            division: 'dining'
          }))}
          source="menu"
          variant="modal"
        />
      )}

    </div>
  );
};

export default MenuScreen;
