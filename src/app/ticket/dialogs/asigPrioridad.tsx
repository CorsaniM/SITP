"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/app/_components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Ticket {
  id: number;
  orgId: number | null;
  state: string | null;
  urgency: number | null;
  suppUrgency: number | null;
  title: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export function AsignarPrioridad(props: {
  ticket: Ticket, isRechazado: boolean, isFinalizado: boolean 
}) {
  const isRechazado = props.isRechazado
  const isFinalizado = props.isFinalizado

  const [open, setOpen] = useState(false);
  const { mutateAsync: cambiar, isPending: isLoading } = api.tickets.update.useMutation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const ticket = props.ticket;


  async function HandleUpdate(value: string) {
    const number = Number(value);

    if (isNaN(number)) {
      console.error("Invalid priority number");
      return;
    }

    await cambiar({
      id: ticket.id,
      urgency: number,
      updatedAt: new Date(),
    });
    await queryClient.invalidateQueries();
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="inline-flex m-2 text-white disabled:opacity-50 text-lg w-1/5 bg-gray-800 hover:bg-gray-500 hover:text-black">
        <Select  disabled={isRechazado || isLoading || isFinalizado} open={open} onOpenChange={setOpen} onValueChange={HandleUpdate}>
          <SelectTrigger className="bg-gray-700">
            <SelectValue placeholder="Asignar prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Nivel de urgencia</SelectLabel>
              <SelectItem value="1">Leve</SelectItem>
              <SelectItem value="2">Baja</SelectItem>
              <SelectItem value="3">Moderado</SelectItem>
              <SelectItem value="4">Alto</SelectItem>
              <SelectItem value="5">Urgente</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
