"use client"

import { api } from "~/trpc/react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link";
import { List } from "../_components/list";
import { Card, CardTitle, CardDescription } from "../_components/ui/tarjeta";


export default function Tickets() {
  let ticketsPorUser
  try {
const user = useUser();
ticketsPorUser = api.tickets.getByUser.useQuery({userId: user.user!.id}).data;
  }
  catch { }
     return(
    <div className="px-10 py-4">
        <List>
          {ticketsPorUser 
          && ticketsPorUser?.map((ticket) => {
            return (
              <div className="my-1">
              <Link href={`/ticket/${ticket.id}`} key={ticket.id}>
                 <Card className="hover:bg-stone-100 active:bg-stone-200">
                  <CardTitle>{ticket.title}</CardTitle>
                  <CardDescription>
                  ID:{ticket.id} {ticket.description}
                  </CardDescription>
                </Card>
              </Link>
              </div>
            );
          })}
        </List>
        </div>
    )
}