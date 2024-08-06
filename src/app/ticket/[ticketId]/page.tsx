import TicketPage from "./ticket"

export default function Page(props:{params:{ticketId: string}}) {


    const id = props.params.ticketId 


    console.log(id)
    
if (id) {
   return(
       <TicketPage params={{ticketId:id}} />
   )

}

else {
 return (
    <h1>Este ticket no existe</h1>
 )   
}

}