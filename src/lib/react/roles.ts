"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Roles } from "~/types/globals";

export function useCheckRole(role: Roles) {
  const { user } = useUser();
  const [hasRole, setHasRole] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.publicMetadata) {
      setHasRole(user?.publicMetadata.role === role);
    }
  }, [role, user, hasRole]);

  return { hasRole };
}
