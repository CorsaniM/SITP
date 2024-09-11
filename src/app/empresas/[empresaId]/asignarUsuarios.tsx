"use client"
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "~/app/_components/ui/button";
import { DialogHeader, DialogFooter, DialogTitle, DialogContent, Dialog, DialogTrigger, DialogClose , DialogDescription } from "~/app/_components/ui/dialog";
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
    const { mutateAsync: createUserCompanies, isPending: isLoading } = api.userCompanies.create.useMutation();
  

    const { data: response } = api.clerk.list.useQuery(); 

    // setAvailableUsers(response?.data ?? []);
    // Fetch available users (or any other source of users)
    // useEffect(() => {
    //   const fetchUsers = async () => {
    //     try {
    //       console.log("Testamento", response);
  
    //       if (response) {
    //         setAvailableUsers(response?.data);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching users:", error);
    //     }
    //   };
  
    //   fetchUsers();
    // }, []);
  
    const handleAddUser = (user: User) => {
      setAvailableUsers(availableUsers.filter(u => u.id !== user.id));
      setSelectedUsers([...selectedUsers, user]);
    };
  
    const handleRemoveUser = (user: User) => {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
      setAvailableUsers([...availableUsers, user]);
    };
  
    const handleCreate = async () => {

        console.log("Testamento", selectedUsers);
      try {
        for (const user of selectedUsers) {
          await createUserCompanies({
              userName: user.firstName ?? "",
              orgId: props.orgId,
              updatedAt: new Date,
              userId: user.id ?? "",
          });
        }
        setOpen(false);
      } catch (error) {
        console.error("Error creating participants:", error);
      }
    };
  
    return (
      <>
        <Button
          className="m-2 px-4 py-2 text-black text-lg rounded-full bg-gray-800 border hover:text-black"
          onClick={() => setOpen(true)}
        >
          Asignar usuario
        </Button>
  
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Asignar usuarios a Esta</DialogTitle>
          </DialogHeader>
            <DialogTitle>Usuarios Disponibles</DialogTitle>
                <ul>
                  {response && response?.data.map(user => (
                    <li key={user.id} className="flex justify-between items-center py-2">
                      {user.fullName} - {user.firstName}
                      <Button onClick={() => handleAddUser(user)}>Agregar</Button>
                    </li>
                  ))}
                </ul>
              <div className="w-1/2">
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