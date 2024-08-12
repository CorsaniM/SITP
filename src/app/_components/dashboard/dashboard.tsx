"use client"
import React, { useState } from 'react';
import { NumeroGrande, Subtitle, Title } from '../ui/title';
import { api } from '~/trpc/react';
import { useUser } from '@clerk/nextjs';



export default function Dashboard() { 
  
  try{

    const { user } = useUser();
    const tickets =api.tickets.getByUser.useQuery({userId: user!.id}).data
    const ticketpend = tickets?.filter((pend)=> pend.state === "Pendiente")
    const ticketasig = tickets?.filter((asig)=> asig.state === "Asignado")
    const ticketfin = tickets?.filter((fin)=> fin.state === "Finalizado")
    

    return(
      <div className='flex flex-auto p-2 grid grid-cols-4 place-content-center'>
        <h1 className="flex text-xl font-semibold justify-center">Tickets</h1>
        <div  className='place-content-center'>
        <NumeroGrande>3{ticketpend?.length}</NumeroGrande>
        <Subtitle>Pendientes</Subtitle>
        </div>
        
        <h1>En espera
        6{ticketasig?.length}
        </h1>
        <h1>Finalizados
        4{ticketfin?.length}
        </h1>
      </div>
    )
  }
  catch{
return (
  <div>
    No hay tickets creados
  </div>
)
  }
  
  
};