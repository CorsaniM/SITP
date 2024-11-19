"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import { Label } from "../_components/ui/label";
import { api } from "~/trpc/react";
import EditarPrueba from "./editar";
import LayoutContainer from "../_components/layout-container";
import Link from "next/link";



export default function Prueba(){ 

    const {mutateAsync:crearReportes,isPending} = api.reportes.create.useMutation()
    const { data: initialReportes } = api.reportes.list.useQuery();
    initialReportes?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const [reportes, setReportes] = useState(initialReportes ?? []);

    useEffect(() => {
        if (initialReportes) {
            setReportes(initialReportes);
        }
    }, [initialReportes]);

    
    async function creartexto(idreportes:number) {
        await crearReportes({
            description: "test",
            createdAt: new Date,
            title: "test",
            ticketId: 1,
            type: "test"
        })
    
    }

    
    
    const { mutateAsync: eliminarReporte, isPending:cargando } =
    api.reportes.delete.useMutation();


    async function eliminarTexto(idReporte:number) {
        await eliminarReporte({
            reporteId: idReporte ?? 0
        })
    }
    


    


return(
    <LayoutContainer>
    <h1 className="text-center text-5xl">registro</h1>
    <EditarPrueba/>
    
    {/* <Button onClick={creartexto}> registrar </Button> */}
    <div className="border border-black ">

    {reportes ? reportes?.map((rep)=>(  
        <div className="flex justify-between w-full hover:text-gray-900 hover:bg-gray-700">
            
            <Link href={`/prueba/${rep.id}`} className="flex justify-between w-3/4 border border-black pl-2  grid grid-cols-3 divide-x divide-black">
            
            <h1 className=" pl-4 pt-2" >{rep.id}</h1>
            <h1 className=" pl-4 pt-2" >{rep.title}</h1>
            <h1 className=" pl-4 pt-2" >{rep.description}</h1>
            
            
        </Link>
            <EditarPrueba reporte={rep}/>


        
        
        
        <Button onClick ={()=>eliminarTexto(rep.id)} disabled={reportes.length === 1}> eliminar  </Button>

        </div>
        
    )): <h1>no existen reportes</h1> }
    </div>
</LayoutContainer>
)
}
