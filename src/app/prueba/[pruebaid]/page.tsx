"use client"

import PruebaPage from "./reporte"


export default function Page(props:{params:{pruebaid: string}}) {
   const id = props.params.pruebaid 

if (id) {
   return(
   <div className="w-full justify-center">
      <PruebaPage pruebaid={id}/>
   </div>
   )

}

else {
return (
   <h1>Este reporte no existe</h1>
)   
}

}