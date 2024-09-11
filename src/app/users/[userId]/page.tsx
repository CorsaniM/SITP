"use client";
import { User } from "@clerk/nextjs/server";
import { CheckIcon, Loader2 } from "lucide-react";
import { MouseEventHandler, useState, useEffect } from "react";
import { toast } from "sonner";
import LayoutContainer from "~/app/_components/layout-container";
import { List, ListTile } from "~/app/_components/ui/list";
import { Title } from "~/app/_components/ui/title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/app/_components/ui/alert-dialog";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { Button } from "~/app/_components/ui/button";
import { Card } from "~/app/_components/ui/card";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { Switch } from "~/app/_components/ui/switch";
import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function UserPage(props: { params: { userId: string } }) {
  const router = useRouter();


  const userId = props.params.userId ?? "";
  const users = api.clerk.getUserbyId.useQuery({
    id: userId,
  }).data?.data[0];
  const { mutateAsync: editUser } = api.clerk.editUser.useMutation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [role, SetRole] = useState<string>("");

  useEffect(() => {
    if (users) {
      setFirstName(users?.firstName ?? "");
      setLastName(users?.lastName ?? "");
      setUsername(users?.username ?? "");
      SetRole((users?.publicMetadata.role as string) ?? "");
    }
  }, [users]);

  const user = useUser().user;

  const updateRole = async (newRole: string) => {
    try {
      await user!.update({
        publicMetadata: { role: newRole },
      } as UserUpdatePayload);

      SetRole(newRole);
      toast.success("Se ha guardado el nuevo rol");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  async function handleChange() {
    try {
      await editUser({
        userId: props.params.userId,
        role,
        firstName,
        lastName,
        username,
      } as EditUserPayload);
      
      toast.success("Se han guardado los cambios");
      router.refresh();
    } catch (e) {
      const error = asTRPCError(e)!;
      toast.error(error.message);
    }
  }

  if (!user) return <div> no se encontro usuario </div>;

  return (
    <LayoutContainer>
      <div className="">
      <Title>Usuarios</Title>
      <div className="mt-20">
        {isLoading ? (
          <div> cargando...</div>
        ) : (
          <section className="space-y-2">
            <div className="flex justify-between">
              <Title>
                {firstName} {lastName}
              </Title>
              <Button onClick={handleChange} disabled={isLoading}>
                <CheckIcon className="mr-2" />
                Aplicar
              </Button>
              <Button onClick={() => updateRole(role)} disabled={isLoading}>
                <CheckIcon className="mr-2" />
                Aplicar rol
              </Button>
            </div>
            
            <Accordion type="single" collapsible={true} className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <h2 className="text-md">Info. del usuario</h2>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-5">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                          id="first_name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Apellido</Label>
                        <Input
                          id="last_name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Nombre de usuario</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <h2 className="text-md">Roles</h2>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-5">
                    <div>
                      <Label htmlFor="role">Rol</Label>
                      <Select
                        defaultValue={role}
                        onValueChange={(value) => SetRole(value)}
                      >
                        <SelectTrigger>
                          <SelectValue>{role}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Administrador</SelectItem>
                          <SelectItem value="Soporte">Soporte</SelectItem>
                          <SelectItem value="unauthorized">
                            No autorizado
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        )}
      </div>
      </div>
    </LayoutContainer>
  );
}

// Define los tipos
interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  publicMetadata?: {
    role: string;
  };
}

interface EditUserPayload {
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
  username: string;
}
