"use client"
import React, { useState } from 'react';
import { Title } from '../ui/title';
import { api } from '~/trpc/react';
import { useUser } from '@clerk/nextjs';



export default function Dashboard() { 
  const { user } = useUser();
  const tickets =api.tickets.getByUser.useQuery({userId: user!}).data
  const ticketpend = tickets?.filter((pend)=> pend.state === "Pendiente")
  const ticketasig = tickets?.filter((asig)=> asig.state === "Asignado")
  const ticketfin = tickets?.filter((fin)=> fin.state === "Finalizado")
  
  
  return(
    <div className='flex flex-col'>
      <Title>Dashboard</Title>
      <h1>Tickets creados: 
        {tickets?.length}
      </h1>
      <h1>Tickets pendientes:
      {ticketpend?.length}
      </h1>
      <h1>Tickets asignados:
      {ticketasig?.length}
      </h1>
      <h1>Tickets finalizados:
      {ticketfin?.length}
      </h1>
    </div>
  )
};