
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "@/context/role-context";
import { getActiveConsumerUser } from "@/services/userService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Bell, ChevronRight, Store } from "lucide-react";
import { NotificationToggleButton } from "@/components/common/NotificationToggleButton";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { currentUser, notifications } = useRoles();
  const activeConsumer = getActiveConsumerUser() || {
    id: currentUser?.id || "usr_guest",
    name: currentUser?.name || "Guest User",
    email: currentUser?.email || "guest@example.com",
    phone: "",
    deliveryAddress: "",
    role: "customer"
  };

  const unreadCount = notifications.filter(n => !n.read && n.division !== "system").length;

  return (
    <div className="w-full h-full p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 animate-fade-in pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Welcome back, {activeConsumer.name.split(" ")[0]}! ??
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore Orient Global Flagship divisions
          </p>
        </div>
        <div className="flex justify-end">
          <NotificationToggleButton />
        </div>
      </div>

      <section className="mb-8 mt-6">
        <h2 className="text-lg font-bold mb-4">Explore Divisions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { id: "dining", label: "Restaurant", icon: "restaurant", color: "bg-orange-500/10 text-orange-600" },
            { id: "bakery", label: "Bakery", icon: "bakery_dining", color: "bg-amber-500/10 text-amber-600" },
            { id: "market", label: "Supermarket", icon: "store", color: "bg-green-500/10 text-green-600" },
            { id: "water", label: "Water", icon: "water_drop", color: "bg-blue-500/10 text-blue-600" },
            { id: "lounge", label: "Lounge", icon: "wine_bar", color: "bg-purple-500/10 text-purple-600" },
            { id: "games", label: "Games", icon: "sports_esports", color: "bg-red-500/10 text-red-600" }
          ].map(div => (
            <button
              key={div.id}
              onClick={() => navigate(`/dashboard/${div.id}`)}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FFFFFF] hover:bg-slate-50 dark:bg-[#232323] dark:hover:bg-[#2a2a2a] border border-border/40 shadow-sm transition-transform active:scale-95 group"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${div.color}`}>
                <span className="material-icons text-3xl">{div.icon}</span>
              </div>
              <span className="text-sm font-bold text-foreground">{div.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-[#FFFFFF] dark:bg-[#1C1C1C]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Account Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{activeConsumer.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{activeConsumer.email}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm font-medium">{activeConsumer.phone || "Not provided"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-[#FFFFFF] dark:bg-[#1C1C1C]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 opacity-70">
            <span className="material-icons text-4xl text-muted-foreground mb-2">history</span>
            <p className="text-sm text-muted-foreground">No recent global activity</p>
            <p className="text-xs text-muted-foreground mt-1">Visit a division to see specific orders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

