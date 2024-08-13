"use client"

import { api } from "~/trpc/react"
import { useOrganization, useUser } from "@clerk/nextjs"
import Link from "next/link";
import { List } from "../_components/ui/list";
import { Card, CardTitle, CardDescription } from "../_components/ui/tarjeta";
import { Title } from "../_components/ui/title";
import Dashboard from "../_components/dashboard/dashboard";
import { Button } from "../_components/ui/button";

export default function Page() {
  let orgId = ""
const organization = useOrganization()
if (organization.organization){
orgId = organization!.organization!.id 
}

const ticketsPorOrg = api.tickets.getByOrg.useQuery({orgId: "dimetallo"}).data;

const { mutateAsync: CreateTicket } = api.tickets.create.useMutation()
async function Creator() {
  await CreateTicket ({
    orgId: "dimetallo",
    state: "",
    urgency: 0,
    suppUrgency: 0,
    title: "",
    description: ""
  })
}  
     return(
      <div className="h-screen w-screen ml-36 mt-16 grid grid-rows-8">
        <div className='flex border-solid ml-1 border-2 border-slate-500 rounded-b-2xl max-h-full place-content-right p-2'>
            <Dashboard/>
        </div>
      <div className='flex row-span-5 place-content-center flex-column'>
          <div className="flex pt-4 flex-col align-center">
              <div className="px-10 py-4">
        <List>
          {ticketsPorOrg 
          && ticketsPorOrg?.map((ticket) => {
            return (
              <div className="my-1">
              <Link href={`/ticket/${ticket.id}`} key={ticket.id}>
                <Card className="hover:bg-stone-100 active:bg-stone-200">
                  <CardTitle>{ticket.title}</CardTitle>
                  <CardDescription>
                  ID:{ticket.id} {ticket.description}
                  Organizacion: {ticket.orgId}
                  Fecha: {ticket.createdAt.toISOString()}

                  </CardDescription>
                </Card>
              </Link>
              </div>
            );
          })}
        </List>
        </div>
          </div>
      </div>
      <div>
        <Button onClick={ Creator }>
          Crear ticket
        </Button>
      </div>
  </div>
    )
}