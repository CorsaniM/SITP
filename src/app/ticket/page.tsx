"use client";


import { useEffect, useState } from "react";
import Dashboard from "../_components/dashboard/dashboard";
import { DataTable } from "./table";
import { columns } from "./columns";
import { api } from "~/trpc/react";
import { NumeroGrande } from "../_components/ui/title";
import { useUser } from "@clerk/nextjs";
import { useCheckRole } from "~/lib/react/roles";
import LayoutContainer from "../_components/layout-container";
import { useRouter } from "next/navigation";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import Prueba from "../prueba/page";
type Ticket = {
  id: number;
  orgId: number;
  description: string | null;
  state: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  urgency: number | null;
  suppUrgency: number | null;
  title: string | null;
};
export default function Page() {
  const [ticketsPorOrg, setTicketsPorOrg] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const { hasRole: isAdmin } = useCheckRole("Admin");
  const { user } = useUser();

  const router = useRouter();

  const ticketsQuery = isAdmin
    ? api.tickets.list.useQuery()
    : api.tickets.getByUser.useQuery({ userId: user?.id ?? "" });

  useEffect(() => {
    if (ticketsQuery.data) {
      setTicketsPorOrg(ticketsQuery.data);
      setLoading(false);
    } else if (ticketsQuery.error) {
      console.error("Error fetching tickets:", ticketsQuery.error);
      setLoading(false);
    }
  }, [ticketsQuery.data, ticketsQuery.error]);

  const { mutateAsync: CreateTicket } = api.tickets.create.useMutation();

  const Creator = async () => {
    await CreateTicket({
      orgId: 1,
      state: "test",
      urgency: 3,
      suppUrgency: 0,
      title: "test",
      description: "test",

    });
    router.refresh();
  };

  if (loading) {
    return (
      <LayoutContainer>
      <div className="flex flex-1 align-middle justify-center">
        <NumeroGrande>Loading...</NumeroGrande>
      </div>
      </LayoutContainer>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-16 flex h-24 place-content-right z-10">
        <Dashboard tickets={ticketsPorOrg}/>
      </div>
      <div className="flex place-content-center flex-column">
        <DataTable columns={columns} data={ticketsPorOrg} />
      </div>
      <div>
        <Button onClick={Creator}>Crear ticket</Button>
      <Link href={"../prueba"} className="border border-gray-900 bg-gray-900 p-2 hover:bg-gray-800" >ir a prueba</Link>
      </div>
    </div>
  );
}
