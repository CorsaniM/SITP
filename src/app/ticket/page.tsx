"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "../_components/dashboard/dashboard";
import { Button } from "../_components/ui/button";
import { DataTable } from "./table";
import { columns } from "./columns";
import { api } from "~/trpc/react";

export default function Page() {
 
  const { data: ticketsPorOrg } = api.tickets.getByOrg.useQuery({
    orgId: "dimetallo",
  });
  
  const router = useRouter()

  const { mutateAsync: CreateTicket } = api.tickets.create.useMutation();
  
  async function Creator() {
    await CreateTicket({
      orgId: "dimetallo",
      state: "test",
      urgency: 3,
      suppUrgency: 0,
      title: "test",
      description: "test",
    });
    await router.refresh()

  }

   if (!ticketsPorOrg) return (

     <div className="w-screen ml-36 mt-16">
      <div className="flex h-28 place-content-right">
   <div>Loading...</div>;
   </div>
   </div>
  )

  return (
    <div className="w-screen ml-36 mt-16">
      <div className="flex h-28 place-content-right">
        <Dashboard />
      </div>
      <div className="flex place-content-center flex-column">
        <div className="flex min-w-40 flex-col align-center">
          <div className="px-10">
            <div className="container mx-auto py-10 h-fixed ">
              <DataTable
                  columns={columns}
                  data={ticketsPorOrg}
                />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Button onClick={Creator}>Crear ticket</Button>
      </div>
    </div>
  );
}