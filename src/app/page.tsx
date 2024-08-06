"use client"
import { useOrganization, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = useUser();
  const organization = useOrganization()

  if(organization.organization?.name === "IanTech"){
      return redirect("admin")
  }  
  else{
      return redirect("support")
  }
}
