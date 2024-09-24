"use client";

import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
  const address = ""
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [phone_number, setPhone_number] = useState("");
  const [razon_social, setRazon_social] = useState("");

  const router = useRouter();
  
  async function handleCreate() {
    console.log("Attempting to create organization with:", organizationName);

    try {
        if (!razon_social || !organizationName || !description || !phone_number) {
            setError("Todos los campos son obligatorios");
            toast.error("Todos los campos son obligatorios");
            return;
        }

        let organization;
        if (createOrganization) {
            organization = await createOrganization({ name: organizationName });
            console.log("Organization created:", organization);
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
            console.log("Company created successfully");
        }
        
        // More logic follows...
    } catch (e) {
        console.error("Error creating organization or company:", e);
        setError("ocurrio un error al crear entidad" + e);
        const errorResult = asTRPCError(e);
        if (errorResult) {
            toast.error(errorResult.message);
        } else {
            console.error("Error conversion failed");
        }
    }
}

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
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {error && <p className="text-red-500">{error}</p>}

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
              {error && <p className="text-red-500">{error}</p>}

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
              {error && <p className="text-red-500">{error}</p>}

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
