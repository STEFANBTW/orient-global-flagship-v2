
"use client";

import React from "react";
import DivisionCatalogView from "@/components/dashboard/DivisionCatalogView";
import UserDiningDashboard from "@/components/dashboard/UserDiningDashboard";
import { useRoles } from "@/context/role-context";

export default function DiningDashboard() {
  const { currentUser } = useRoles();
  const isAdminMode = currentUser?.role === "boss" || currentUser?.role === "hod" || currentUser?.role === "staff";

  if (!isAdminMode) {
    return <UserDiningDashboard />;
  }

  return <DivisionCatalogView divisionId="dining" />;
}

