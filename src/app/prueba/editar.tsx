"use client"

import { useEffect, useState } from "react"
import { Button } from "../_components/ui/button"
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../_components/ui/dialog";
import { Input } from "../_components/ui/input";
import { Label } from "../_components/ui/label";
import { api, RouterOutputs } from "~/trpc/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";



interface editarprops {
  reporte?:RouterOutputs["reportes"]["getById"]
}

export default function PopupReporte({reporte}:editarprops) {
    const {mutateAsync:crearReportes,isPending} = api.reportes.create.useMutation()
    const {mutateAsync:editarReportes,isPending:isEditing} = api.reportes.update.useMutation()
    const {data:ticketList}= api.tickets.list.useQuery()
const router = useRouter()

    async function crear() {
        if (!description || !type || !title || !ticketId){
            toast.message("todos los campos son obligatorios")
            return
        }

        try{
            
          if (reporte){
            await editarReportes ({
              id:reporte.id,
              descripcion: description,
              title: title,
              type
            })
            toast.message("se ha editado el reporte")
          } else{
            await crearReportes({
              description: description,
              createdAt: new Date,
              title: title,
              ticketId: ticketId,
              type
            })
            resetForm()
            toast.message("se ha creado correctamente el reporte")
            }
            
            
            router.refresh()
            setOpen(false)


        }
        catch{
            toast.message("ha ocurrido un error!!") 
            return
        }
            
    }

const resetForm=()=>{
  setticketId(0)
  settype("")
  settitle("")
  setdescription("")
}


const [description,setdescription] = useState(reporte?.description ?? "")
const [type,settype] = useState(reporte?.type ?? "")
const [title,settitle] = useState(reporte?.title ?? "")
const [ticketId,setticketId] = useState(reporte?.ticketId ?? 0)


useEffect (()=>{
  settype(reporte?.type ?? "")
  setdescription(reporte?.description ?? "")
  settitle(reporte?.title ?? "")
  setticketId(reporte?.ticketId ?? 0)
},[reporte])


    const [open, setOpen] = useState(false)

    return (
        <div>
        <Button onClick={()=>setOpen(true)}>
          {reporte?"editar":"crear"}
          </Button>
        {/* <Button onClick={()=>crear(1)}>crear</Button> */}
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {reporte?"editar reporte":"crear nueva entidad"}
            </DialogTitle>
          </DialogHeader>
          
          <Label>description</Label>
    <Input value={description} onChange={(e)=> setdescription(e.target.value)}maxLength={20}></Input>
    <Label>type</Label>
    <Input value={type} onChange={(e)=> settype(e.target.value)}maxLength={20}></Input>
    <Label>title</Label>
    <Input value={title} onChange={(e)=> settitle(e.target.value)}maxLength={20}></Input>
      {!reporte &&
    <div>
    <Label>ticketId</Label> 
    <Select
                value={ticketId.toString()}
                onValueChange={(value) => setticketId(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={"seleccionar id"} />
                </SelectTrigger>
                <SelectContent side="top">
                  {ticketList?.map((x) => (
                    <SelectItem className="hover:bg-gray-500" key={x.id} value={x.id.toString() }>
                      {x.title} {x.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
  </div>
  }

<DialogFooter>
<Button onClick={()=>setOpen(false)}>
                Cancelar
              </Button>
              <Button disabled={ isPending} onClick={crear}>
              {reporte?"confirmar":"crear entidad"}
              </Button>
</DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
    )




}