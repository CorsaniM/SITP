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
      <div className='flex flex-auto p-2 border-solid border-2 border-gray-400 place-content-center bg-gray-800'>
        <h1 className="flex flex-auto basis-1/12 text-xl font-semibold justify-center place-self-center">Tickets</h1>
        <div  className='flex-auto basis-1/3  place-content-center'>
        <NumeroGrande>3{ticketpend?.length}</NumeroGrande>
        <Subtitle>Pendientes</Subtitle>
        </div>
        <div className='flex-auto basis-1/3 place-content-center'>
        <NumeroGrande>6{ticketasig?.length}</NumeroGrande>
        <Subtitle>En espera</Subtitle>
        </div>
        <div className='flex-auto basis-1/3 place-content-center'>
        <NumeroGrande>4{ticketfin?.length}</NumeroGrande>
        <Subtitle>Finalizados</Subtitle>
        </div>
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