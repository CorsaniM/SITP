// "use client"
// import { datetime } from "drizzle-orm/mysql-core"
// import { TablaTickets, columns } from "./columns"
// import { DataTable } from "./table"
// import Dashboard from "../_components/dashboard/dashboard"
// import { Button } from "../_components/ui/button"
// import { api } from "~/trpc/react"
// import { useReactTable } from "@tanstack/react-table"

// // async function getData(): Promise<TablaTickets[]> {
// //   // Fetch data from your API here.

// //   const ticketsPorOrg = api.tickets.getByOrg.useQuery({orgId: "dimetallo"}).data;

  
// //   return [
// //     {
// //         id: 1,
// //         orgId: "dimetallo",
// //         state: "pending",
// //         urgency: 0,
// //         createdAt: ticketsPorOrg![0]!.createdAt.toISOString() ?? ""
// //     },
// //     // ...
// //   ]
// // }

// export default function DemoPage() {
//   const ticketsPorOrg = api.tickets.getByOrg.useQuery({orgId: "dimetallo"}).data;
//   const data = useReactTable<TablaTickets[]>(
//    {
//     id: 1,
//         orgId: "dimetallo",
//         state: "pending",
//         urgency: 0,
//         createdAt: ticketsPorOrg![0]!.createdAt.toISOString() ?? ""
//   })



//   return (
//     <div className="h-screen w-screen ml-36 mt-16 grid grid-rows-8">
//         <div className='flex border-solid ml-1 border-2 border-slate-500 rounded-b-2xl max-h-full place-content-right p-2'>
//             <Dashboard/>
//         </div>
//       <div className='flex row-span-5 place-content-center flex-column'>
//           <div className="flex pt-4 flex-col align-center">
//               <div className="px-10 py-4">
//                 <div className="container mx-auto py-10">
//                   <DataTable columns={columns} data={data} />
//                 </div>
//             </div>
//           </div>
//       </div>
//   </div>
//   )
// }

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
        <div className='flex border-solid ml-1 border-2 border-slate-500 
        max-h-full place-content-right p-2'>
            <Dashboard/>
        </div>
      <div className='flex row-span-5 place-content-center flex-column'>
          <div className="flex pt-4 flex-col align-center">
              <div className="px-10 py-4">
        <List>
          {ticketsPorOrg 
          && ticketsPorOrg?.map((ticket) => {
            return (
              <div className="my-1 bg-gray-800">
              <Link href={`/ticket/${ticket.id}`} key={ticket.id}>
                 <Card className="bg-gray-800 hover:bg-gray-500 active:bg-gray-600
                 font-semibold">
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