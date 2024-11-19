"use client"

import { useState } from "react"
import { api } from "~/trpc/react";

export default  function PruebaPage (params:{pruebaid:string}){

    const {data: reporte}  =  api.reportes.getById.useQuery({idreporte:Number(params.pruebaid)})
    const [test, setTest]= useState("")

const validator = true


    return( <div> <h1>hola</h1>

    {reporte && 




<div>
        <h1 className=" pl-4 pt-2" >{reporte?.id}</h1>
        <h1 className=" pl-4 pt-2" >{reporte?.title}</h1>
        <h1 className=" pl-4 pt-2" >{reporte?.description}</h1>
    </div>
}
    </div>
)
}
