import { useAuth, useUser } from "@clerk/nextjs";
import { Roles } from "~/types/globals";

export const checkRole = (role: Roles) => {
  const { orgRole } = useAuth();

  const user = useUser().user?.publicMetadata;
  console.log(orgRole, "test");

  if (orgRole === role) return true;
  else {
    return false;
  }
};
