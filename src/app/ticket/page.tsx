"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "../_components/dashboard/dashboard";
import { Button } from "../_components/ui/button";
import { DataTable } from "./table";
import { columns } from "./columns";
import { api } from "~/trpc/react";
import { NumeroGrande, Title } from "../_components/ui/title";

export default function Page() {
 
  const { data: ticketsPorOrg } = api.tickets.getByOrg.useQuery({
    orgId: 1,
  });
  
  const router = useRouter()

  const { mutateAsync: CreateTicket } = api.tickets.create.useMutation();
  
  async function Creator() {
    await CreateTicket({
      orgId: 1,
      state: "test",
      urgency: 3,
      suppUrgency: 0,
      title: "test",
      description: "test",
    });
    router.refresh()

  }

   if (!ticketsPorOrg) return (

    <div className="">
          <div className="flex flex-1 align-middle justify-center">
            <NumeroGrande>Loading...</NumeroGrande>
          </div>
   </div>
  )

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-16 flex h-28 place-content-right z-10">
        <Dashboard />
      </div>
      <div className="flex place-content-center flex-column">
              <DataTable
                  columns={columns}
                  data={ticketsPorOrg}
                />
            </div>
      <div>
        <Button onClick={Creator}>Crear ticket</Button>
      </div>
    </div>
  );
}