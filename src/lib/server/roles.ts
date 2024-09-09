import { auth } from "@clerk/nextjs/server";
import { Roles } from "~/types/globals";

export const UseCheckRole = (role: Roles) => {
  const { sessionClaims } = auth();

  console.log("TEST", sessionClaims?.org_role);
  return sessionClaims?.role === role;
};
