"use server";

import { clerkClient } from "@clerk/nextjs/server";
import {} from "next/navigation";
import { UseCheckRole } from "~/lib/server/roles";

export async function SetRole(formData: FormData) {
  if (!UseCheckRole("Admin")) {
    return { message: "Not Authorized" };
  }
  try {
    const res = await clerkClient.users.updateUser(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      },
    );

    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}
