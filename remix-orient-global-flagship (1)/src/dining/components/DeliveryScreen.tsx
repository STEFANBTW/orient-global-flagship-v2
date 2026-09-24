import React, { useState, useEffect } from 'react';
import { orderService, CustomerOrder } from '../../services/orderService';
import { getActiveConsumerUser } from '../../services/userService';

const DeliveryScreen: React.FC = () => {
  const [showAllBundles, setShowAllBundles] = useState(false);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const activeUser = getActiveConsumerUser();
    const userId = activeUser?.id || 'usr_guest';
    const unsub = orderService.subscribeToOrders((allOrders) => {
      const myOrders = allOrders.filter(o => o.customerId === userId);
      setOrders(myOrders);
      if (myOrders.length > 0) {
        setSelectedOrderId(prev => {
          if (!prev || !myOrders.find(o => o.id === prev)) {
            return myOrders[0].id;
          }
          return prev;
        });
      }
    });
    return () => unsub();
  }, []);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const navigateToMenu = () => {
    window.dispatchEvent(new CustomEvent('orient:navigate-dining', { detail: 'menu' }));
  };

  const handleSupport = () => {
    alert('Connecting you to support...');
  };

  const handleAddToCart = (item: string) => {
    alert(`${item} added to cart!`);
  };

  return (
 <div className="bg-background min-h-screen text-foreground font-sans pb-24">
 {/* Map Hero */}
 <section className="relative w-full h-[60vh] overflow-hidden">
 <div className="absolute top-4 left-4 right-4 md:right-auto md:w-72 md:top-6 md:left-6 z-10 bg-card/90 backdrop-blur-md p-5 rounded-xl shadow-lg border border-border ">
 <h1 className="text-2xl font-bold text-foreground mb-1.5 leading-tight">Live Delivery in Jos</h1>
 <p className="text-foreground/80 mb-3 text-xs">We deliver to every corner of Jos.</p>
 <div className="flex items-center space-x-2 mb-3">
 <span className="text-xs font-semibold text-primary">12 Bikes Active Now</span>
 </div>
 <div className="flex space-x-2">
 <button onClick={navigateToMenu} className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-3 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 text-sm">
 <span className="material-icons text-sm">restaurant_menu</span>
 <span>Order Now</span>
 </button>
 <button onClick={() => alert('Locating...')} className="p-2.5 bg-background hover:bg-background dark:hover:bg-foreground text-background text-foreground/80 rounded-lg transition-colors">
 <span className="material-icons text-sm">my_location</span>
 </button>
 </div>
 </div>
 <div className="w-full h-full bg-background relative">
 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOF2-UxrSgKqtyyAiO5h6WcGYdcZlJU5a5YPFvCx1AEYUXlyZhzzsN6bV1QJo8EGo4E288JaXmDhcKFWdIVZEL3sZrcdYmADe35wKYkUF60XzUl8MYKPJpDYq-2o-xvyNHCmOlJHDLrK4lLWppxbxW7-VfGlKvyEj2HW_Bf6EJsTL_oh_8CO3nP-kuIqf6cBptsA4QzIXkYwJSh6f_Wg_N4Z4sFHzGSXsI_XzqMzYFPiZjJZMg6mXQaP9YJw8IYA5T8W7LP4LnaYPK" className="w-full h-full object-cover opacity-80 dark:opacity-40 grayscale-[20%]" alt="Map" />
 
 {/* Markers */}
 <div className="absolute top-1/3 left-1/4 animate-pulse-ring">
 <div className="bg-card p-1.5 rounded-full shadow-lg border-2 border-primary cursor-pointer hover:scale-110 transition-transform">
 <span className="material-icons text-primary text-lg">two_wheeler</span>
 </div>
 <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">Driver: Musa</div>
 </div>
 <div className="absolute top-2/3 right-1/3 animate-pulse-ring animation-delay-500">
 <div className="bg-card p-1.5 rounded-full shadow-lg border-2 border-primary cursor-pointer hover:scale-110 transition-transform">
 <span className="material-icons text-primary text-lg">two_wheeler</span>
 </div>
 </div>
 {/* User Location */}
 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
 <div className="bg-blue-500 bg-opacity-20 p-4 rounded-full">
 <div className="bg-blue-600 h-4 w-4 rounded-full border-2 border-transparent shadow-md"></div>
 </div>
 <span className="bg-card text-foreground text-xs font-bold px-2 py-1 rounded mt-1 shadow-sm">You are here</span>
 </div>
 </div>
 {/* Gradient Overlay Bottom */}
 <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
 </section>

 <div className="relative z-20 bg-white dark:bg-[#1a1a1a] w-full pt-12 pb-16">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Quick Bundles */}
 <section className="mb-16">
 <div className="flex items-end justify-between mb-6">
 <div>
 <h2 className="text-3xl font-bold text-foreground mb-1.5">Quick Bundles</h2>
 <p className="text-muted-foreground text-base">Curated packs for every occasion. Delivered in 30 mins.</p>
 </div>
 <button onClick={navigateToMenu} className="text-primary font-semibold hover:text-primary/80 flex items-center transition-colors text-sm">
 View Full Menu <span className="material-icons text-xs ml-1">arrow_forward</span>
 </button>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 <BundleCard 
 title="Family Sunday Feast"
 price="₦12,500"
 desc="A generous platter serving 4-6 people. Includes Jollof Rice, Grilled Chicken, Coleslaw, and 4 drinks."
 image="/generated_images/family_feast.jpg"
 badge="Top Seller"
 people="4-6 ppl"
 time="45m"
 onAddToCart={() => handleAddToCart('Family Sunday Feast')}
 />
 <BundleCard 
 title="Student Exam Pack"
 price="₦3,200"
 desc="Late night fuel for study sessions. Large Pizza (Pepperoni or BBQ) + Energy Drink."
 image="/generated_images/student_pack.jpg"
 badge="-15% Off"
 badgeColor="bg-red-500 text-background"
 people="1-2 ppl"
 time="Instant"
 icon="bolt"
 onAddToCart={() => handleAddToCart('Student Exam Pack')}
 />
 <BundleCard 
 title="Date Night Special"
 price="₦8,000"
 desc="Romantic dinner for two. Choice of Pasta, Dessert to share, and a bottle of non-alcoholic wine."
 image="/generated_images/date_night.jpg"
 people="2 ppl"
 time="40m"
 icon="favorite"
 onAddToCart={() => handleAddToCart('Date Night Special')}
 />
 {showAllBundles && (
 <>
 <BundleCard 
 title="Office Lunch Pack"
 price="₦15,000"
 desc="Assorted meals for the team. 5 varieties of Rice dishes, 5 sides, and 5 drinks."
 image="/generated_images/family_feast.jpg"
 people="5 ppl"
 time="60m"
 onAddToCart={() => handleAddToCart('Office Lunch Pack')}
 />
 <BundleCard 
 title="Game Night Snacks"
 price="₦5,500"
 desc="Perfect for game night. Chicken wings, Suya, Fries, and large Soda."
 image="https://lh3.googleusercontent.com/aida-public/AB6AXuBqqsgyAfMtr__rQY4L2rlmmJY-oF0IFTGlXJkbSOQn_nfdvr3fpcLOy-yEJkT5Put4cCaQnDgJnBNRqg8QOvBzy-CcB4cfZmwwGm5bmgU9_EfKiuHVdBo2GfHhv6j4_9-hf9OL-97Rw2sBnP6RWnsP-T8zua2Xz5R3CcYnJRNCY8l9IQMmae4aSNcY_aXypYF687EandLvkTdwAn0XNzpQFbTUeFV7qw8_k_ZyeFCa6YoL_c1cwjghtUtXp_8L7tJYpwyppsHWh8f8"
 badge="New"
 badgeColor="bg-blue-500 text-white"
 people="3-4 ppl"
 time="35m"
 icon="sports_esports"
 onAddToCart={() => handleAddToCart('Game Night Snacks')}
 />
 <BundleCard 
 title="Healthy Breakfast"
 price="₦4,200"
 desc="Start your day right. Oatmeal, Fresh Fruit Parfait, and fresh Orange Juice."
 image="https://lh3.googleusercontent.com/aida-public/AB6AXuAADh_95xJWf_8MMXJHj1UiGBaivkDn3LlrijtnNGXBeIJLGUmMah2YDkHP8byJYBhFh_gQ7vO2HzJYsuRK7aYvYghZFiORsXyCUfEp4ohJOPcKZnYbF5c8oaxOl5mon0L4sDSLay5F2BH9AI-5wnGNhLoLcS3vS_bPkKt7NfrzmWV2p7OBv7EEnkGARHAf80W3vlboGiP2-qMCq3DMO1p8dsUiI0S_NtPI76wqGy7XjJAY3s4jBKLDYtj4WfFTN5NJ7YztNNIcRhKF"
 people="1 ppl"
 time="25m"
 icon="spa"
 onAddToCart={() => handleAddToCart('Healthy Breakfast')}
 />
 </>
 )}
 </div>
 <div className="mt-6 flex justify-center">
 <button 
 onClick={() => setShowAllBundles(!showAllBundles)} 
 className="text-foreground/70 hover:text-foreground font-medium text-sm flex items-center border border-border px-4 py-2 rounded-full transition-colors"
 >
 {showAllBundles ? 'View Less' : 'View More'}
 <span className="material-icons text-sm ml-1">{showAllBundles ? 'expand_less' : 'expand_more'}</span>
 </button>
 </div>
 </section>

 {/* Tracking */}
 <section className="mb-16">
  {orders.length === 0 ? (
    <div className="text-center py-12 bg-card rounded-xl border border-border shadow-sm">
      <span className="material-icons text-5xl text-muted-foreground mb-4 opacity-50">local_shipping</span>
      <h2 className="text-xl font-bold text-foreground mb-2">Track Your Order</h2>
      <p className="text-muted-foreground text-sm">When you place an order, track it here.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4">
        <div className="sticky top-24">
          <h2 className="text-2xl font-bold text-foreground mb-3">Track Your Order</h2>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {orders.map(order => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrderId(order.id)}
                className={`bg-card p-5 rounded-xl border cursor-pointer transition-colors ${selectedOrderId === order.id ? 'border-primary shadow-md' : 'border-border shadow-sm hover:border-primary/50'}`}
              >
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-border ">
                  <span className="text-xs text-muted-foreground ">Order ID</span>
                  <span className="font-mono font-bold text-base">{order.id}</span>
                </div>
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-bold text-foreground capitalize">{order.status.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="w-full bg-background h-1.5 rounded-full overflow-hidden mt-2">
                    <div className={`h-full rounded-full bg-primary ${
                      order.status === 'awaiting_chef' ? 'w-1/5' :
                      (order.status === 'preparing' || order.status === 'ten_min_warning' || order.status === 'five_min_warning') ? 'w-2/5' :
                      order.status === 'ready' ? 'w-3/5' :
                      order.status === 'completed' ? 'w-full' : 'w-1/12'
                    }`}></div>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleSupport(); }} className="w-full bg-background hover:bg-background dark:hover:bg-foreground text-background text-foreground font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center text-sm">
                  <span className="material-icons text-xs mr-2">support_agent</span> Contact Support
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-8">
        {selectedOrder && (
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm h-full">
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-background "></div>
              
              <TimelineItem 
                icon="receipt_long" 
                title="Order Placed" 
                time={new Date(selectedOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                text="We have received your order." 
                completed={true} 
                active={selectedOrder.status === 'awaiting_chef'} 
              />
              <TimelineItem 
                icon="skillet" 
                title="Chef Confirmed" 
                text={selectedOrder.chefConfirmedAt ? "The kitchen is preparing your order." : "Waiting for chef to confirm."}
                completed={selectedOrder.status !== 'awaiting_chef' && selectedOrder.status !== 'cancelled'} 
                active={selectedOrder.status === 'preparing' || selectedOrder.status === 'ten_min_warning' || selectedOrder.status === 'five_min_warning'} 
              />
              <TimelineItem 
                icon="check_circle" 
                title="Order is Ready" 
                text="Your order is packed and ready." 
                completed={selectedOrder.status === 'ready' || selectedOrder.status === 'completed'}
                active={selectedOrder.status === 'ready'} 
              />
              <TimelineItem 
                icon="two_wheeler" 
                title="In Transit" 
                text="Driver assigned." 
                completed={selectedOrder.status === 'completed'}
                active={false}
              />
              <TimelineItem 
                icon="home" 
                title="Arrived" 
                text="Enjoy your meal!" 
                completed={selectedOrder.status === 'completed'}
                active={selectedOrder.status === 'completed'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )}
 </section>

 {/* Area Specials */}
 <section>
 <div className="text-center max-w-2xl mx-auto mb-10">
 <h2 className="text-2xl font-bold text-foreground mb-3">Delivery Zones & Fees</h2>
 <p className="text-muted-foreground text-sm">Transparent pricing for every neighborhood in Jos. Fees go directly to supporting our riders.</p>
 </div>
 <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[500px]">
 <thead>
 <tr className="bg-background border-b border-border">
 <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Destination</th>
 <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Est. Time</th>
 <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Delivery Fee</th>
 <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Free Delivery Over</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 <tr className="hover:bg-background/50 transition-colors">
 <td className="py-3 px-4 text-sm font-semibold text-foreground">Rayfield</td>
 <td className="py-3 px-4 text-sm text-foreground">15-25 min</td>
 <td className="py-3 px-4 text-sm font-semibold text-foreground">₦500</td>
 <td className="py-3 px-4 text-sm text-primary">₦5,000</td>
 </tr>
 <tr className="hover:bg-background/50 transition-colors">
 <td className="py-3 px-4 text-sm font-semibold text-foreground flex items-center">
 Tudun Wada
 <span className="ml-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">POPULAR</span>
 </td>
 <td className="py-3 px-4 text-sm text-foreground">30-45 min</td>
 <td className="py-3 px-4 text-sm font-semibold text-foreground">₦700</td>
 <td className="py-3 px-4 text-sm text-primary">₦7,500</td>
 </tr>
 <tr className="hover:bg-background/50 transition-colors">
 <td className="py-3 px-4 text-sm font-semibold text-foreground">Jos South</td>
 <td className="py-3 px-4 text-sm text-foreground">45-60 min</td>
 <td className="py-3 px-4 text-sm font-semibold text-foreground">₦1,200</td>
 <td className="py-3 px-4 text-sm text-primary">₦12,000</td>
 </tr>
 <tr className="hover:bg-background/50 transition-colors">
 <td className="py-3 px-4 text-sm font-semibold text-foreground">Bukuru</td>
 <td className="py-3 px-4 text-sm text-foreground">50-65 min</td>
 <td className="py-3 px-4 text-sm font-semibold text-foreground">₦1,500</td>
 <td className="py-3 px-4 text-sm text-primary">₦15,000</td>
 </tr>
 <tr className="hover:bg-background/50 transition-colors">
 <td className="py-3 px-4 text-sm font-semibold text-foreground">Lamingo</td>
 <td className="py-3 px-4 text-sm text-foreground">25-40 min</td>
 <td className="py-3 px-4 text-sm font-semibold text-foreground">₦800</td>
 <td className="py-3 px-4 text-sm text-primary">₦8,000</td>
 </tr>
 </tbody>
 </table>
 </div>
 </section>
 </div>
 </div>
 {/* Floating Status Widget (Bottom Right) */}
 <div className="fixed bottom-24 right-6 z-40 hidden md:block">
 <div className="bg-card rounded-full shadow-2xl p-1 pr-6 flex items-center space-x-4 border border-primary/20 animate-bounce hover:animate-none transition-all cursor-pointer">
 <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
 <span className="material-icons text-sm">moped</span>
 </div>
 <div className="flex flex-col">
 <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Status</span>
 <span className="text-sm font-bold text-foreground ">Kitchen Prep</span>
 </div>
 </div>
 </div>
 </div>
 );
};

// Helper Components
const TimelineItem = ({ icon, title, time, text, subText, active, completed }: any) => (
 <div className={`relative flex items-start mb-10 ${!active && !completed ? 'opacity-50' : ''}`}>
 <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-4 ${completed ? 'bg-primary border-transparent' : active ? 'bg-card border-primary shadow-md' : 'bg-background border-transparent'}`}>
 <span className={`material-icons text-base ${completed ? 'text-background' : active ? 'text-primary' : 'text-muted-foreground'} ${active && !completed ? 'animate-pulse' : ''}`}>{icon}</span>
 </div>
 <div className="ml-5 pt-0.5">
 <h4 className={`text-base font-bold ${active ? 'text-primary' : 'text-foreground '}`}>{title}</h4>
 {text && <p className="text-muted-foreground text-xs mt-0.5">{text}</p>}
 {subText && <span className="text-[10px] font-semibold text-primary mt-1.5 block">{subText}</span>}
 {time && <span className="text-[10px] text-muted-foreground mt-1.5 block">{time}</span>}
 </div>
 </div>
);

const BundleCard = ({ title, price, desc, image, badge, badgeColor, people, time, icon, onAddToCart }: any) => (
 <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border cursor-pointer">
 <div className="relative h-56 overflow-hidden">
 <img src={image} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt={title} />
 {badge && (
 <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wide ${badgeColor || 'bg-card/90 text-primary'}`}>
 {badge}
 </div>
 )}
 </div>
 <div className="p-5">
 <div className="flex justify-between items-start mb-1.5">
 <h3 className="text-lg font-bold text-foreground ">{title}</h3>
 <span className="text-base font-bold text-primary">{price}</span>
 </div>
 <p className="text-muted-foreground text-xs mb-3.5 line-clamp-2">{desc}</p>
 <div className="flex items-center justify-between">
 <div className="flex items-center text-muted-foreground text-[10px] space-x-2.5">
 <span className="flex items-center"><span className="material-icons text-xs mr-1">{icon || 'group'}</span> {people}</span>
 <span className="flex items-center"><span className="material-icons text-xs mr-1">schedule</span> {time}</span>
 </div>
 <button 
 onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(); }}
 className="bg-primary/10 hover:bg-primary hover:text-white text-primary font-semibold py-1.5 px-3.5 rounded-lg transition-colors text-xs"
 >
 Add to Cart
 </button>
 </div>
 </div>
 </div>
);

export default DeliveryScreen;