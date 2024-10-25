"use client"
import { api } from '~/trpc/react';
import { Card, CardTitle } from "~/app/_components/ui/tarjeta";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import LayoutContainer from '~/app/_components/layout-container';
import { Messages, MessageTile } from './mensajes';
import { AsignarUsuario } from '../dialogs/asignarUsuario';
import { AsignarPrioridad } from '../dialogs/asigPrioridad';
import { Rechazar } from '../dialogs/rechazar';
import { CrearComentario } from '../dialogs/crearComentario';
import { Aprobar } from '../dialogs/aprobar';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
dayjs.extend(utc);
dayjs.locale("es");

interface UrgenciaMap {
  [key: number]: string;
}
export default function TicketPage(props:{params:{ticketId: string}}) {
  const id = props.params.ticketId
  

  const test = api.images.getByTicket.useQuery({commentId: parseInt(id)});

  const ticket = api.tickets.getById.useQuery({ id: parseInt(id) }).data;
  const org = api.companies.get.useQuery({ id: ticket?.orgId ?? 0 }).data;
  const comments = ticket?.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

const isRechazado = ticket?.state === "Rechazado"; 
const isFinalizado = ticket?.state === "Finalizado";

const { mutateAsync: updateMensaje } = api.comments.update.useMutation();
const queryClient = useQueryClient();
  useEffect( () => {
      if (comments) {
        comments.map(async (comments) => {
          if (comments?.state === "no leido") {
            await updateMensaje({
              id: comments?.id ?? 0,
              state: "leido",
            });
          }
        });
        queryClient.invalidateQueries()
      }
  }, [ticket, updateMensaje]);
  const urgenciaMap: UrgenciaMap = {
    1: "Leve",
    2: "Baja",
    3: "Moderado",
    4: "Alto",
    5: "Urgente",
  };

  const urg:string = urgenciaMap[ticket?.urgency ?? 0] || "Desconocido";

  return (
    <LayoutContainer>
    <div className="">
        {ticket ? (
          <Card>
        <div className='bg-gray-800 p-2 border-collapse text-lg text-wrap '>
          <div className='flex flex-row bg-gray-800 '>
            <div className='w-1/2 px-2'>
            <CardTitle>Ticket N° {ticket?.id} - {ticket?.title}</CardTitle>
            Creado por <b>{org?.name}</b> el <b>{dayjs.utc(ticket.createdAt).format('DD/MM/YYYY')}</b>
            </div>
            <div className='flex flex-auto w-1/2 px-2 justify-end bg-gray-800'>
            Estado: {ticket?.state} <br />
            Urgencia: {urg}
            </div>
            </div>

            <br />
            <div className='px-2'>
            {ticket?.description}
            </div>
          <hr className='mt-3 bg-gray-800'/>
          <div className='flex-wrap place-content-center justify-center p-2 space-y-3'>
          <Aprobar ticket={ticket} isFinalizado ={isFinalizado} isRechazado ={isRechazado}  /> 
          <Rechazar ticket={ticket} isFinalizado ={isFinalizado} isRechazado ={isRechazado} />
          <AsignarUsuario ticketId={parseInt(id)} isFinalizado ={isFinalizado} isRechazado ={isRechazado} />
          <CrearComentario ticketId={parseInt(id)} isFinalizado ={isFinalizado} isRechazado ={isRechazado} />
          <AsignarPrioridad ticket={ticket} isFinalizado ={isFinalizado} isRechazado ={isRechazado} />

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
                img={comments.images?.url}
                user={comments.userName}
                />
           
    
  )) : (
    <p>No hay comentarios</p>
  )}
      </Messages>
        </div>
      </Card>
      
        ): (null)}
        
    </div>
        </LayoutContainer>
  );
}
