import { useUser } from "@clerk/nextjs";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactElement, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { DialogHeader, DialogFooter } from "~/app/_components/ui/dialog";
import { api } from "~/trpc/react";

export function AsignarUsuario(props: { ticketId: number }) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: createParticipants } = api.participants.create.useMutation();
  const user = useUser();

  async function HandleCreate() {
    await createParticipants({
      userName: user.user?.fullName ?? "",
      ticketId: props.ticketId ?? 0,
    });
    setOpen(false); // Cerrar el diálogo tras la creación
  }

  return (
    <>
      {/* Botón que abre el diálogo */}
      <Button
        className="m-2 px-4 py-2 text-white disabled:opacity-50 text-lg rounded-full bg-gray-800 border hover:bg-gray-500 hover:text-black"
        onClick={() => setOpen(true)}
      >
        Asignar usuario
      </Button>

      {/* Dialogo */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          {/* Este contenedor envuelve el contenido y proporciona el fondo con el blur */}
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

          {/* Contenido del diálogo */}
          <Dialog.Content className="fixed z-50 inset-0 m-auto flex max-w-lg items-center justify-center">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <Dialog.Title>Asignar usuario</Dialog.Title>
                <Dialog.Description>
                  Esta acción no se puede deshacer. ¿Estás seguro de que quieres continuar?
                </Dialog.Description>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={HandleCreate}>Confirmar</Button>
                <Button onClick={() => setOpen(false)}>Cancelar</Button>
              </DialogFooter>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
