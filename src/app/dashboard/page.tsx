'use client';

import React, { useState, useEffect } from 'react';
import Overview_Revamp from "@/components/dashboard/Overview_Revamp";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { useRoles } from "@/context/role-context";
import { getActiveConsumerUser } from "@/services/userService";

export default function DashboardOverview() {
  const { currentUser } = useRoles();

  const isAdminMode = currentUser?.role === 'boss' || currentUser?.role === 'hod' || currentUser?.role === 'staff';

  if (!isAdminMode) {
    return <UserDashboard />;
  }

  return <Overview_Revamp />;
}

