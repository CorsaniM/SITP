import { auth } from "@clerk/nextjs/server";
import { Roles } from "~/types/globals";

export const UseCheckRole = (role: Roles) => {
  const { sessionClaims } = auth();

  console.log("TEST", sessionClaims?.org_role);
  return sessionClaims?.role === role;
};
// "use server";
// import { useAuth, useUser } from "@clerk/nextjs";
// import { api } from "~/trpc/server";
// import { Roles } from "~/types/globals";

// export async function UseCheckRole(role: Roles) {
//   const user = useUser().user?.id;
//   const usuario = await api.clerk.getUserbyId({ id: user ?? "" });

//   if (usuario.data.find((u) => u.id === user)?.publicMetadata.role === role)
//     return true;
//   else {
//     return false;
//   }
// }
