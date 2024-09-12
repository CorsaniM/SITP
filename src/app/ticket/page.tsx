"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "../_components/dashboard/dashboard";
import { Button } from "../_components/ui/button";
import { DataTable } from "./table";
import { columns } from "./columns";
import { api } from "~/trpc/react";
import { NumeroGrande } from "../_components/ui/title";
import { useUser } from "@clerk/nextjs";
import { useCheckRole } from "~/lib/react/roles";
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

  // Hook para obtener tickets por organización o por usuario
  const ticketsQuery = isAdmin
    ? api.tickets.list.useQuery()
    : api.tickets.getByUser.useQuery({ userName: user?.username ?? "" });

  // Controlar el estado de carga y los datos
  useEffect(() => {
    if (ticketsQuery.data) {
      setTicketsPorOrg(ticketsQuery.data);
      setLoading(false);
    } else if (ticketsQuery.error) {
      console.error("Error fetching tickets:", ticketsQuery.error);
      setLoading(false);
    }
  }, [ticketsQuery.data, ticketsQuery.error]);

  // const { mutateAsync: CreateTicket } = api.tickets.create.useMutation();

  // const Creator = async () => {
  //   await CreateTicket({
  //     orgId: 2,
  //     state: "test",
  //     urgency: 3,
  //     suppUrgency: 0,
  //     title: "test",
  //     description: "test",
  //   });
  //   router.refresh();
  // };

  if (loading) {
    return (
      <div className="flex flex-1 align-middle justify-center">
        <NumeroGrande>Loading...</NumeroGrande>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-16 flex h-28 place-content-right z-10">
        <Dashboard tickets={ticketsPorOrg}/>
      </div>
      <div className="flex place-content-center flex-column">
        <DataTable columns={columns} data={ticketsPorOrg} />
      </div>
      <div>
        {/* <Button onClick={Creator}>Crear ticket</Button> */}
      </div>
    </div>
  );
}
