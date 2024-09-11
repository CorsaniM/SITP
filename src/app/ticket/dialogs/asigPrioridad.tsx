"use client"
import { useUser } from "@clerk/nextjs";
import { ReactElement, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { api } from "~/trpc/react";
import { DialogHeader, DialogFooter, DialogContent, DialogTitle, Dialog } from "~/app/_components/ui/dialog";
import { Label } from "~/app/_components/ui/label";
import { Input } from "~/app/_components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue  } from "~/app/_components/ui/select";
import { Loader2Icon } from "lucide-react";

interface ticket {
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

export function AsignarPrioridad(props: { ticket: ticket }) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: cambiar, isPending: isLoading } = api.tickets.update.useMutation();

  const [prio, setPrio] = useState(0);

const ticket = props.ticket
  async function HandleUpdate() {
    await cambiar({
        id: ticket.id,
        suppUrgency: prio,
        updatedAt: new Date,
    });
    setOpen(false); // Cerrar el diálogo tras la creación
  }

  return (
    <>
      <div  className="inline-flex m-2 text-white disabled:opacity-50 text-lg w-1/5 bg-gray-800  hover:bg-gray-500 hover:text-black">

              <Select open={open} onOpenChange={setOpen} onValueChange={(e) =>setPrio(Number(e))}>
      <SelectTrigger className=" bg-gray-700">
        <SelectValue placeholder="prio" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel >Nivel de urgencia</SelectLabel>
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
