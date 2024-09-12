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
  const [address, setAddress] = useState("")
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [phone_number, setPhone_number] = useState("");
  const [razon_social, setRazon_social] = useState("");

  const router = useRouter();
  
  async function handleCreate() {
    try {
      
      let organization;
      if (createOrganization) {
        organization = await createOrganization({ name: organizationName });
      } else {
        console.warn("createOrganization is undefined");
      }
      if (organization) {
        await createCompany({
          orgId: organization.id ?? "",
          description: description,
          name: organizationName,
          state: "activa",
          address: address,
          phone_number: phone_number,

          razon_social: razon_social,
          updatedAt: new Date(),
        });
       
        await createEvent({
          orgId: organization.id,
          type: "Creado por el administrador",
          description: "Se ha creado una nueva entidad",
          userName: user?.fullName ?? "admin",
        });
      }
      setDescription("");
      
      toast.success("Entidad creado correctamente");
      router.refresh();
      setOpen(false);
    } catch (e) {
      setError("ocurrio un error al crear entidad");
      const errorResult = asTRPCError(e);
      if (errorResult) {
        toast.error(errorResult.message);
      } else {
        console.error("Error conversion failed");
      }
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
          <form onSubmit={async (e) => { e.preventDefault();await handleCreate(); }}>
            <div>
              <Label htmlFor="name">Nombre de la entidad</Label>
              <Input
                id="name"
                placeholder="ej: bitcompay"
                value={organizationName}
                onChange={(e) => {
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
            <div>
              <Label htmlFor="phone_number">Telefono</Label>
              <Input
                id="phone_number"
                placeholder="ej: 1140463445"
                value={phone_number}
                onChange={(e) => {
                  setPhone_number(e.target.value);
                }}
              />
            </div>
            <div>
              <Label htmlFor="razon_social">Razon Social</Label>
              <Input
                id="razon_social"
                placeholder="ej: Bitcompay"
                value={razon_social}
                onChange={(e) => {
                  setRazon_social(e.target.value);
                }}
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