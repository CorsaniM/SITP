"use client"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dashboard from "../_components/dashboard/dashboard";
import { Button } from "../_components/ui/button";
import { DataTable } from "./table";
import { columns } from "./columns";
import { api } from "~/trpc/react";

export default function Page() {
  // const router = useRouter();
  
  const { data: ticketsPorOrg } = api.tickets.getByOrg.useQuery({
    orgId: "dimetallo",
  });
  const { mutateAsync: CreateTicket } = api.tickets.create.useMutation();
  
  async function Creator() {
    await CreateTicket({
      orgId: "dimetallo",
      state: "",
      urgency: 0,
      suppUrgency: 0,
      title: "",
      description: "",
    });
  }
   if (!ticketsPorOrg) return <div>Loading...</div>;

  return (
    <div className="w-screen ml-36 mt-16 grid grid-rows-8">
      <div className="flex h-32 place-content-right">
        <Dashboard />
      </div>
      <div className="flex row-span-5 place-content-center flex-column">
        <div className="flex pt-4 flex-col align-center">
          <div className="px-10 py-4">
            <div className="container mx-auto py-10">
              <DataTable
                  columns={columns}
                  data={ticketsPorOrg}
                />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Button onClick={Creator}>Crear ticket</Button>
      </div>
    </div>
  );
}


// "use client"

// import { api } from "~/trpc/react"
// import { useOrganization, useUser } from "@clerk/nextjs"
 import Link from "next/link";
// import { List } from "../_components/ui/list";
// import { Card, CardTitle, CardDescription } from "../_components/ui/tarjeta";
// import { Title } from "../_components/ui/title";
// import Dashboard from "../_components/dashboard/dashboard";
// import { Button } from "../_components/ui/button";

// export default function Page() {
// let orgId = ""
// const ticketsPorOrg = api.tickets.getByOrg.useQuery({orgId: "dimetallo"}).data;
// const { mutateAsync: CreateTicket } = api.tickets.create.useMutation()
// async function Creator() {
//   await CreateTicket ({
//     orgId: "dimetallo",
//     state: "",
//     urgency: 0,
//     suppUrgency: 0,
//     title: "",
//     description: ""
//   })
// }  
//      return(
//       <div className="w-screen ml-36 mt-16 grid grid-rows-8">
//         <div className='flex max-h-full place-content-right'>
//             <Dashboard/>
//         </div>
//       <div className='flex row-span-5 place-content-center flex-column'>
//           <div className="flex pt-4 flex-col align-center">
//               <div className="px-10 py-4">
//         <List>
//           {ticketsPorOrg 
//           && ticketsPorOrg?.map((ticket) => {
//             return (
//               <div className="my-1 bg-gray-800">
//               <Link href={`/ticket/${ticket.id}`} key={ticket.id}>
//                  <Card className="bg-gray-800 hover:bg-gray-500 active:bg-gray-600
//                  font-semibold">
//                   <CardTitle>{ticket.title}</CardTitle>
//                   <CardDescription>
//                   ID:{ticket.id} {ticket.description}
//                   </CardDescription>
//                 </Card>
//               </Link>
//               </div>
//             );
//           })}
//         </List>
//         </div>
//           </div>
//       </div>
//       <div>
//         <Button onClick={ Creator }>
//           Crear ticket
//         </Button>
//       </div>
//   </div>
//     )
// }