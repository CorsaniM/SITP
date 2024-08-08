"use client"
import { useRouter } from "next/navigation";
import { api } from '~/trpc/react';
import { Card, CardTitle, CardDescription } from "~/app/_components/ui/tarjeta";
import { List, ListTile } from '~/app/_components/list';
import { Title } from '~/app/_components/ui/title';
import { useUser, useOrganization } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/app/_components/ui/button';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useQueryClient } from "@tanstack/react-query";
dayjs.extend(utc);
dayjs.locale("es");

export default function TicketPage(props:{params:{ticketId: string}}) {
  const id = props.params.ticketId
  const ticket = api.tickets.getById.useQuery({ id: parseInt(id) }).data;
  const { mutateAsync: createMensaje, isPending } = api.comments.create.useMutation();
  const router = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { organization } = useOrganization();

  const [description, setDescription] = useState("")

  async function handleCreate() {
    try {
        await createMensaje({
            userId: user!.id,
            ticketId: ticket!.id,
            type: "actualización",
            state: "no leido",
            title: ticket!.title || "",
            description: description,
            createdAt: new Date,
        })  
         
        toast.success('mensaje enviado')
        router.invalidateQueries()
        setDescription("")

    } catch (e) {
        setError('no se pudo crear el mensaje')
        toast.error('no se pudo crear el mensaje')
    }
}
// const { mutateAsync: updateMensaje} = api.comments.update.useMutation();
// useEffect(()=>{
//   ticket?.comments.map((mensaje)=>{
//     updateMensaje({
//       id: mensaje.id,
//       state: "leido",
//     })
//   })
// })

  return (
    <div className="px-10 py-24 w-full md:px-20 lg:px-32 xl:px-40">
        {ticket ? (
      <Card>
        <div className='bg-stone-100 p-2 '>
          <div className='flex flex-row '>
            <div>
            <CardTitle>ID: {ticket!.id} - {ticket!.title}</CardTitle>
            Fecha de creación: {dayjs.utc(ticket.createdAt).format('DD/MM/YYYY')}
            </div>
            <div className='flex-auto px-16'>
            Estado: {ticket!.state} <br />
            Urgencia: {ticket!.urgency}
            </div>
          </div>

            <br />
            Description: {ticket!.description}
            {ticket.images ? (null) : (
              <h1>No contiene images adheridas</h1>
            )}
          <hr className='mt-3'/>
        </div>
        <div className='p-2'>
          <CardTitle>Mensajes:</CardTitle>
          <List>
            {ticket.comments ? ticket.comments.map((comments) => (
              <ListTile
                key={comments.id}
                title={comments.title}
                leading={comments.description}
              />
            )) : (<h1>No hay notificaciones</h1>)}
          </List>
        </div>
        <div className="h-1/5 flex flex-col m-2 text-center">
                    <h1>Ingrese un nuevo mensaje</h1>
                    <textarea
                        className="resize-y h-14 w-full border border-gray-300 p-2"
                        value={description}
                        placeholder='Mensaje...'
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button 
                      className="m-4 px-4 py-2 text-black rounded disabled:opacity-50 rounded-full bg-slate-200 hover:bg-slate-300"
                      disabled={isPending}
                      onClick={handleCreate}>
                    {isPending ? "Creando..." : "Crear mensaje"} </Button>
                </div>
      </Card>
        ): (null)}
    </div>
  );
}
