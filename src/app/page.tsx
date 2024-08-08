"use client"
import { useOrganization, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = useUser();
  const organization = useOrganization()

 
      return redirect("/ticket")
  
}
