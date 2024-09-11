"use client";

import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEventHandler } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../_components/ui/dialog";
import { Input } from "../_components/ui/input";
import { Label } from "../_components/ui/label";
import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";
import { useOrganizationList, useUser } from "@clerk/nextjs";


export function AddCompanyDialog() {
  const { createOrganization } = useOrganizationList();
  const { mutateAsync: createCompany, isPending } =
    api.companies.create.useMutation();

  const { mutateAsync: createEvent, isPending: isLoadingEvent } =
    api.events.create.useMutation();

    const user = useUser().user;
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("")
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [phone_number, setPhone_number] = useState("");
  const [razon_social, setRazon_social] = useState("");
  const [state, setState] = useState("");

  const router = useRouter();
  
  const handleCreate: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setError(null);
    let organization: { id: string } | null = null;

  
    if (createOrganization) {
      createOrganization({ name: organizationName })
        .then((org) => {
          organization = org;
          return createCompany({
            orgId: organization.id,
            description,
            name,
            address: address,
            phone_number: phone_number,
            razon_social: razon_social,
            state: state,
            updatedAt: new Date(),
          });
        })
        .then(() => {
          return createEvent({
            orgId: organization?.id ?? "",
            type: "Creado por el administrador",
            description: "Se ha creado una nueva entidad",
            userName: user?.fullName ?? "admin",
          });
        })
        .then(() => {
          setName("");
          setDescription("");
          toast.success("Entidad creada correctamente");
          router.refresh();
          setOpen(false);
        })
        .catch((error) => {
          setError("Ocurrió un error al crear la entidad");
          const errorResult = asTRPCError(error);
          if (errorResult) {
            toast.error(errorResult.message);
          } else {
            console.error("Error conversion failed");
          }
        });
    } else {
      console.warn("createOrganization is undefined");
    }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircleIcon className="mr-2" size={20} />
        Crear entidad
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear nueva entidad</DialogTitle>
            {/* <DialogDescription>
                    
                </DialogDescription> */}
          </DialogHeader>
          <form onSubmit={void handleCreate}>
            <div>
              <Label htmlFor="name">Nombre de la entidad</Label>
              <Input
                id="name"
                placeholder="ej: bitcompay"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setOrganizationName(e.target.value);
                }}
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
           
            <br />
            <DialogFooter>
              <Button disabled={isLoadingEvent || isPending} type="submit">
                Crear entidad
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
