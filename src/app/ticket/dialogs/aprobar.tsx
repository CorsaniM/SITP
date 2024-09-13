import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { DialogHeader, DialogFooter } from "~/app/_components/ui/dialog";
import { api } from "~/trpc/react";

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

export function Aprobar(props: { ticket: ticket }) {
  const { mutateAsync: cambiar } = api.tickets.update.useMutation();
  
  const [open, setOpen] = useState(false);
const router = useRouter()


const ticket = props.ticket
  async function HandleUpdate() {
    await cambiar({
        id: ticket.id,
        state: "Finalizado",
        updatedAt: new Date,
    });
    router.refresh()
    setOpen(false);
  }

  return (
    <>
    
      <Button
        className="m-2 px-4 py-2 text-white disabled:opacity-50 text-lg rounded-full bg-[#1d661a] border hover:bg-[#288f24] hover:text-black"
        onClick={() => setOpen(true)}
      >
        Aprobar
      </Button>

     
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
         
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

        
          <Dialog.Content className="fixed z-50 inset-0 m-auto flex max-w-lg items-center justify-center">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <Dialog.Title>Aprobar ticket</Dialog.Title>
                <Dialog.Description>
                  Esta acción no se puede deshacer. ¿Estás seguro de que quieres continuar?
                </Dialog.Description>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={HandleUpdate}>Confirmar</Button>
                <Button onClick={() => setOpen(false)}>Cancelar</Button>
              </DialogFooter>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
