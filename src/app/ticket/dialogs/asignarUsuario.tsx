import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/app/_components/ui/button";
import { DialogHeader, DialogFooter, DialogContent, DialogTitle, Dialog } from "~/app/_components/ui/dialog";
import { api } from "~/trpc/react";

interface User {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
}
// interface ticket {
//   id: number;
//   orgId: number | null;
//   state: string | null;
//   urgency: number | null;
//   suppUrgency: number | null;
//   title: string | null;
//   description: string | null;
//   createdAt: Date;
//   updatedAt: Date | null;
// }

export function AsignarUsuario(props: {
  ticketId: number, isRechazado: boolean, isFinalizado: boolean
}) {
  const isRechazado = props.isRechazado
  const isFinalizado = props.isFinalizado

  const [open, setOpen] = useState(false);
  
  const { mutateAsync: createParticipants, isPending: isLoading } = api.participants.create.useMutation();
  const { data: response } = api.clerk.list.useQuery(); 

  const [availableUsers, setAvailableUsers] = useState<User[]>(response?.data ?? []);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [usuariosAEliminar, setUsuariosAEliminar] = useState<User[]>([]); 

  const { data: participantes } = api.participants.getByTicket.useQuery({ ticketId: props.ticketId ?? 0 });
  const { mutateAsync: deleteParticipantes } = api.participants.deleteByUserAndTicket.useMutation();


  const router = useRouter()
  useEffect(() => {
    if (participantes) {
      const usersInTicket = response?.data?.filter(user => 
        participantes.some(p => p.userName === user.id)
      );
      setSelectedUsers(usersInTicket ?? []);
      setAvailableUsers(response?.data?.filter(user => 
        !participantes.some(p => p.userName === user.id)
      ) ?? []);
    }
  }, [participantes, response]);

  const handleAddUser = (user: User) => {
    setAvailableUsers(availableUsers.filter(u => u.id !== user.id));
    setSelectedUsers([...selectedUsers, user]);
  };

  async function handleRemoveUser(user: User) {
    setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    setAvailableUsers([...availableUsers, user]);
    setUsuariosAEliminar([...usuariosAEliminar, user]); 

    if (participantes?.some((x) => x.userName === user?.id && x.ticketId === props.ticketId)) {
      await deleteParticipantes({
        user: user.id ?? "",
        ticketId: props.ticketId ?? 0,
      });
      toast.message(`Usuario ${user?.fullName ?? user?.firstName + " " + user?.lastName} eliminado`);
    }
  }

  async function handleCreate() {
    if (selectedUsers.length === 0 && usuariosAEliminar.length === 0) {
      return toast.error("Seleccione al menos un usuario");
    }

    for (const selectedUser of selectedUsers) {
      const existingParticipant = participantes?.find(
        (x) => x.userName === selectedUser.id && x.ticketId === props.ticketId
      );
      if (!existingParticipant) {
        await createParticipants({
          userFullName: selectedUser.fullName ?? selectedUser.firstName + " " + selectedUser.lastName,
          userName: selectedUser.id ?? "",
          ticketId: props.ticketId ?? 0,
        });
      } else {
      }


    }
    setOpen(false);
    setUsuariosAEliminar([]);
    router.refresh();
  }

  return (
    <>
      <Button
        className="m-2 px-4 py-2 text-white disabled:opacity-50 text-lg rounded-full bg-gray-800 border hover:bg-gray-500 hover:text-black"
        onClick={() => setOpen(true)}
        disabled={isRechazado|| isLoading  || isFinalizado} 
      >
        Asignar usuario
      </Button>

    <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent className="sm:max-w-[800px] bg-gray-700">
          <DialogHeader>
            <DialogTitle>Asignar usuarios</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row">
            <div className="flex flex-col flex-auto w-1/2 p-4">
              <DialogTitle>Usuarios Disponibles</DialogTitle>
              <ul>
                {availableUsers ? availableUsers.map(user => (
                  <li key={user.id} className="flex justify-between items-center py-2">
                    {user?.fullName ?? user?.firstName + " " + user?.lastName}
                    <Button onClick={() => handleAddUser(user)} disabled={isRechazado}>
                      Agregar</Button>
                  </li>
                )): (<h1>Cargando...</h1>)}
              </ul>
            </div>
            <div className="flex flex-col flex-auto w-1/2 p-4">
              <DialogHeader>
                <DialogTitle>Usuarios Seleccionados</DialogTitle>
              </DialogHeader>
              <ul>
                {selectedUsers.map(user => (
                  <li key={user.id} className="flex justify-between items-center py-2">
                    {user?.fullName ?? user?.firstName + " " + user?.lastName}
                    <Button onClick={() => handleRemoveUser(user)} disabled={isRechazado}>Eliminar</Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button disabled={isRechazado || isLoading} onClick={handleCreate}>
              {isLoading && <Loader2Icon className="mr-2 animate-spin" size={20} />}
              Agregar participantes
            </Button>
            <Button disabled={isLoading} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
