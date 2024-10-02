"use client"

import { NumeroGrande, Title } from "~/app/_components/ui/title"
import { DataTable } from "./table"
import { columns } from "./columns"
import { api } from "~/trpc/react";
import LayoutContainer from "../_components/layout-container";
import { useState } from "react";


export default function Events() {

    const { data: eventsList, isLoading, error } = api.events.get.useQuery();   
    console.log(eventsList)

      if (isLoading) return (
        <LayoutContainer>
            <div className="flex place-content-center flex-column">
            <NumeroGrande>Loading...</NumeroGrande>
            </div>
        </LayoutContainer>
      ); else if (!eventsList) return (
        <LayoutContainer>
            <div className="flex place-content-center flex-column">
            <NumeroGrande> No hay eventos </NumeroGrande>
            </div>
        </LayoutContainer>
      ); else if (error) return (
        <LayoutContainer>
            <div className="flex place-content-center flex-column">
            <NumeroGrande> Error al cargar eventos </NumeroGrande>
            </div>
       </LayoutContainer>
      );

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

