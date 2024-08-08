import { useAuth, useUser } from "@clerk/nextjs";
import { Roles } from "~/types/globals";

export const checkRole = (role: Roles) => {
  const { orgRole } = useAuth();

  console.log(orgRole);

  if (orgRole === role) return true;
  else {
    return false;
  }
};
