"use client"
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/app/_components/ui/button";
import { DialogHeader, DialogFooter, DialogTitle, DialogContent, Dialog } from "~/app/_components/ui/dialog";
import { api } from "~/trpc/react";


interface User {
  id: string | null;
  firstName: string | null;
  fullName: string | null;
}
export function AsignarUsuario(props: { orgId: number }) {
  const [open, setOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [usuariosAEliminar, setUsuariosAEliminar] = useState<User[]>([]); 

  const { mutateAsync: createUserCompanies, isPending: isLoading } = api.userCompanies.create.useMutation();
  const { mutateAsync: deleteUserCompanies } = api.userCompanies.deleteByUserAndOrg.useMutation();
  const { data: userCompanies } = api.userCompanies.getByOrg.useQuery({ orgId: props.orgId ?? 0 });
  const { data: response } = api.clerk.list.useQuery(); 

  const router = useRouter();

  useEffect(() => {
    if (userCompanies && response) {
      const usersInOrg = response.data.filter(user =>
        userCompanies.some(p => p.userName === user.id)
      );
      setSelectedUsers(usersInOrg);
      setAvailableUsers(response.data.filter(user =>
        !userCompanies.some(p => p.userName === user.id)
      ));
    }
  }, [userCompanies, response]);

  const handleAddUser = (user: User) => {
    setAvailableUsers(prev => prev.filter(u => u.id !== user.id));
    setSelectedUsers(prev => [...prev, user]);
    console.log(availableUsers);
  };

  const handleRemoveUser = async (user: User) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    setAvailableUsers(prev => [...prev, user]);
    setUsuariosAEliminar(prev => [...prev, user]);

    if (userCompanies?.some((x) => x.userName === user.id && x.orgId === props.orgId)) {
      try {
        await deleteUserCompanies({
          user: user.id ?? "",
          orgId: props.orgId ?? 0,
        });
        toast.message(`Usuario ${user.fullName} eliminado`);
      } catch (error) {
        toast.error(`Error al eliminar el usuario ${user.fullName}`);
      }
    }
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0 && usuariosAEliminar.length === 0) {
      return toast.error("Seleccione al menos un usuario");
    }

    for (const selectedUser of selectedUsers) {
      const existingParticipant = userCompanies?.find(
        (x) => x.userName === selectedUser.id && x.orgId === props.orgId
      );
      if (!existingParticipant) {
        try {
          await createUserCompanies({
            userName: selectedUser.firstName ?? "",
            orgId: props.orgId ?? 0,
            updatedAt: new Date(),
            userId: selectedUser.id ?? ""
          });
        } catch (error) {
          toast.error(`Error al asignar el usuario ${selectedUser.fullName}`);
        }
      }
    }

    router.refresh();
    setOpen(false);
    setUsuariosAEliminar([]);
  };



    return (
      <>
        <Button
          className="m-2 px-4 py-2 text-lg rounded-full border hover:text-gray-200 hover:bg-gray-700"
          onClick={() => setOpen(true)}
        >
          Asignar usuario
        </Button>
  
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] bg-gray-700">
          <DialogHeader>
            <DialogTitle>Asignar usuarios a Esta</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row">
          <div className="flex flex-col flex-auto w-1/2 p-4">
            <DialogTitle>Usuarios Disponibles</DialogTitle>
                <ul>
                  {response && response?.data.map(user => (
                    <li key={user.id} className="flex justify-between items-center py-2">
                      {user.fullName} - {user.firstName}
                      <Button onClick={() => handleAddUser(user)}>Agregar</Button>
                    </li>
                  ))}
                </ul>
                </div>
                <div className="flex flex-col flex-auto w-1/2 p-4">
                <DialogHeader>
                  <DialogTitle>Usuarios Seleccionados</DialogTitle>
                </DialogHeader>
                <ul>
                  {selectedUsers.map(user => (
                    <li key={user.id} className="flex justify-between items-center py-2">
                      {user.fullName} - {user.firstName}
                      <Button onClick={() => handleRemoveUser(user)}>Eliminar</Button>
                    </li>
                  ))}
                </ul>
              </div>
          </div>

              <DialogFooter>
            <Button disabled={isLoading} onClick={handleCreate}>
              {isLoading && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar participantes
            </Button>
            <Button disabled={isLoading} onClick={()=>setOpen(false)}>
              
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
    );
  }