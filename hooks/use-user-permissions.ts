"use client";

import { useUserRole } from "@/hooks/use-user-role";

export function useUserPermissions() {
  const { role } = useUserRole();

  return {
    canCustomize: role === "owner" || role === "admin",
    canManageUsers: role === "owner" || role === "admin",
    canManageOrganization: role === "owner",
    canManageSubscription: role === "owner",
    canDeleteAccount: role === "owner",
    canAccessSettings: true, // All roles can access settings
    canManageContent: true, // All roles can manage content
  };
}