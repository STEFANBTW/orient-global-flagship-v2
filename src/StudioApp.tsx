import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/role-context';
import { NotificationProvider } from './context/NotificationContext';

import LoginPage from './app/login/page';
import AdminLoginPage from './app/admin-login/page';
import AdminSignupPage from './app/admin-signup/page';
import SignupPage from './app/signup/page';
import DashboardLayout from './app/dashboard/layout';
import DashboardOverview from './app/dashboard/page';

import BakeryDashboard from './app/dashboard/bakery/page';
import DiningDashboard from './app/dashboard/dining/page';
import GamesDashboard from './app/dashboard/games/page';
import LoungeDashboard from './app/dashboard/lounge/page';
import MarketDashboard from './app/dashboard/market/page';
import WaterDashboard from './app/dashboard/water/page';
import InboxPage from './app/dashboard/inbox/page';
import CMSPage from './app/dashboard/cms/page';
import InventoryPage from './app/dashboard/inventory/page';
import OrdersPage from './app/dashboard/orders/page';
import NotificationsPage from './app/dashboard/notifications/page';
import UsersPage from './app/dashboard/users/page';


export default function StudioApp({ onCancel, initialRoute = '/login' }: { onCancel: () => void, initialRoute?: string }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <RoleProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
              <Route path="/login" element={<LoginPage onCancel={onCancel} />} />
              <Route path="/admin-login" element={<AdminLoginPage onCancel={onCancel} />} />
              <Route path="/signup" element={<SignupPage onCancel={onCancel} />} />
              <Route path="/admin-signup" element={<AdminSignupPage />} />
              <Route path="/dashboard" element={<DashboardLayout onCancel={onCancel} />}>
                <Route index element={<DashboardOverview />} />
                <Route path="bakery" element={<BakeryDashboard />} />
                <Route path="dining" element={<DiningDashboard />} />
                <Route path="games" element={<GamesDashboard />} />
                <Route path="lounge" element={<LoungeDashboard />} />
                <Route path="market" element={<MarketDashboard />} />
                <Route path="water" element={<WaterDashboard />} />
                <Route path="inbox" element={<InboxPage />} />
                <Route path="cms" element={<CMSPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </MemoryRouter>
        </RoleProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
