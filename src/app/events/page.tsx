"use client"

import { Title } from "~/app/_components/ui/title"
import { DataTable } from "./table"
import { columns } from "./columns"
import { useRouter } from "next/router";
import { api } from "~/trpc/react";
import LayoutContainer from "../_components/layout-container";


export default function Events() {

    const { data: eventsList } = api.events.get.useQuery();
        
      if (!eventsList) return (
    
        <div className="">
            <div className="flex place-content-center flex-column">
            <div>Loading...</div>
            </div>
       </div>
      )

    return (
        <LayoutContainer>
            <div className="flex justify-center align-middle flex-col">
                <div className="flex place-content-center">
                    <Title>Eventos</Title>
                </div>
                <div className="flex  place-content-center">
                    <DataTable
                    columns={columns}
                    data={eventsList}
                    />
                </div>
            </div>
        </LayoutContainer>
    )
}

