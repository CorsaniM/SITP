"use client"
import { api } from '~/trpc/react';
import { Card, CardTitle, CardDescription } from "~/app/_components/ui/tarjeta";
import { List, ListTile } from '~/app/_components/ui/list';
import { useUser, useOrganization } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/app/_components/ui/button';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import LayoutContainer from '~/app/_components/layout-container';
import { Messages, MessageTile } from './mensajes';
import { AsignarUsuario } from '../dialogs/asignarUsuario';
import { AsignarPrioridad } from '../dialogs/asigPrioridad';
import { Rechazar } from '../dialogs/rechazar';
import { CrearComentario } from '../dialogs/crearComentario';
import { Aprobar } from '../dialogs/aprobar';
dayjs.extend(utc);
dayjs.locale("es");

export default function TicketPage(props:{params:{ticketId: string}}) {
  const id = props.params.ticketId
  const ticket = api.tickets.getById.useQuery({ id: parseInt(id) }).data;
  const comments = ticket?.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  

// const { mutateAsync: updateMensaje} = api.comments.update.useMutation();
// useEffect(()=>{
//   ticket?.comments.map((mensaje)=>{
//     updateMensaje({
//       id: mensaje.id,
//       state: "leido",
//     })
//   })div
// })

  return (
    <LayoutContainer>
    <div className="w-full md:px-20 lg:px-32 xl:px-40">
        {ticket ? (
          <Card>
        <div className='bg-gray-800 p-2 border-collapse text-lg text-wrap'>
          <div className='flex flex-row bg-gray-800 '>
            <div className='w-1/2 px-2'>
            <CardTitle>ID: {ticket?.id} - {ticket?.title}</CardTitle>
            Fecha de creación: {dayjs.utc(ticket.createdAt).format('DD/MM/YYYY')}
            </div>
            <div className='flex flex-auto w-1/2 px-2 justify-end bg-gray-800'>
            Estado: {ticket?.state} <br />
            Urgencia: {ticket.suppUrgency === 0 ? ticket?.urgency : ticket?.suppUrgency}
            </div>
          </div>

            <br />
            Description: {ticket?.description}
            {ticket.images ? (null) : (
              <h1>No contiene images</h1>
            )}
          <hr className='mt-3 bg-gray-800'/>
          <div className='flex-wrap place-content-center justify-center p-2 space-y-3'>
          <Aprobar ticket={ticket}/> 
          <Rechazar ticket={ticket}/>
          <AsignarUsuario ticketId={parseInt(id)}/>
          <CrearComentario ticketId={parseInt(id)}/>
          <AsignarPrioridad ticket={ticket}/>

          </div>
          
        </div>
        
          <div className='w-full p-2 bg-gray-800 text:border-collapse text-lg'>
          <CardTitle>Comentarios :</CardTitle>
          <Messages className='w-full h-full text-lg overflow-y-auto
          border-collapse border border-gray-700 hover:border-collapse'>
  {comments ? comments.map((comments) => (
          <MessageTile
                key={comments.id}
                title={comments.title}
                description={comments.description}
                from={comments.userName}
              />
          )) : (<h1>No hay mensajes</h1>)}
      </Messages>
        </div>
      </Card>
      
        ): (null)}
        
    </div>
        </LayoutContainer>
  );
}
