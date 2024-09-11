"use client";

import { CheckIcon, Loader2, Loader2Icon, UserCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEventHandler, useState } from "react";
import { toast } from "sonner";





import { api, RouterOutputs } from "~/trpc/react";
import LayoutContainer from "~/app/_components/layout-container";
import { Title } from "~/app/_components/ui/title";
import { Button } from "~/app/_components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/app/_components/ui/accordion";
import { List, ListTile } from "~/app/_components/ui/list";
import { Label } from "~/app/_components/ui/label";
import { Switch } from "~/app/_components/ui/switch";
import { Card } from "~/app/_components/ui/card";
import { Input } from "~/app/_components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger } from  "~/app/_components/ui/alert-dialog";
import { AsignarUsuario } from "./asignarUsuarios";


type User = {
  id: string;
  name: string;
  email: string;
};

export default function CompanyPage({
  company,
  userList,
}: {
  company: NonNullable<RouterOutputs["companies"]["get"]>;
  userList: User[];
}) {

  console.log("COMPANY", userList);
  const [phone, setPhone] = useState(company.phone_number ?? "");
  const [state, setState] = useState(company.state ?? "");
  const [name, setname] = useState(
    company.name ?? ""
  );
  const [address, setAddress] = useState(company.address ?? "");
  const [razonSocial, setRazonSocial] = useState(company.razon_social ?? "");

  const [description, setDescription] = useState(company.description ?? "");


  const { mutateAsync: changeCompany, isPending: isLoading } =
    api.companies.update.useMutation();

  async function handleChange() {
    try {
      await changeCompany({
        id: company.id,
        name,
        description,
        razon_social: razonSocial ?? "",
        address: address ?? "",
        state: state,
        updatedAt: new Date,
        phone_number: phone
      });
      toast.success("Se han guardado los cambios");
    } catch (e) {
      toast.error("No se pudieron guardar los cambios");
    }
  }


  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>{company.name}</Title>
          <Button disabled={isLoading} onClick={handleChange}>
            {isLoading ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <CheckIcon className="mr-2" />
            )}
            Aplicar
          </Button>
            <AsignarUsuario orgId={company?.id ?? 0}/>
        </div>

        <Accordion type="single" collapsible className="w-full">
    
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h2 className="text-md">Info. de la entidad</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="razonSocial">Razon social</Label>
                    <Input
                      id="razonSocial"
                      value={razonSocial}
                      onChange={(e) => setRazonSocial(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Direccion</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Celular</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
         
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <h2 className="text-md">Usuarios</h2>
            </AccordionTrigger>
            <AccordionContent>
              <List>
                {userList.map((user) => {
                  return (
                    <ListTile
                      leading={<UserCircleIcon />}
                      title={user?.name}
                      key={user?.id}
                      subtitle={user?.email}
                    />
                  );
                })}
              </List>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6" className="border-none">
            <AccordionTrigger>
              <h2 className="text-md">Eliminar entidad</h2>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-end">
                <DeleteChannel companySubId={company.id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </LayoutContainer>
  );
}

function DeleteChannel(props: { companySubId: number }) {
  const { mutateAsync: deleteChannel, isPending } =
    api.companies.delete.useMutation();

  const router = useRouter();

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    deleteChannel({ id: props.companySubId })
      .then(() => {
        toast.success("Se ha eliminado la entidad correctamente");
        router.push("./");
        router.refresh();
      })
      .catch((e) => {
        toast.error("No se pudo eliminar la entidad");
      });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[160px]">
          Eliminar entidad
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro que querés eliminar la entidad?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Eliminar entidad permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 active:bg-red-700"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && (
              <Loader2Icon className="mr-2 animate-spin" size={20} />
            )}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
