"use client"
import TicketPage from "./ticket"

export default function Page(props:{params:{ticketId: string}}) {
   const id = props.params.ticketId 

if (id) {
   return(
   <div className="w-full justify-center">
      <TicketPage params={{ticketId:id}} />
   </div>
   )

}

else {
return (
   <h1>Este ticket no existe</h1>
)   
}

}