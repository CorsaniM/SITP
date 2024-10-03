"use client"

import { NumeroGrande, Title } from "~/app/_components/ui/title"
import { DataTable, DataTableComponent } from "./table"
import { api } from "~/trpc/react";
import LayoutContainer from "../_components/layout-container";


export default function Events() {

    const { data: eventsList, isLoading, error } = api.events.get.useQuery();   
    eventsList?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
       

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

      const transformedEventsList = eventsList.map((event) => ({
        ...event,
        id: event.id,
        type: event.type,
        description: event.description,
        username: event.userName,
        createdAt: event.createdAt,
      }));
      
      return (
        <LayoutContainer>
          <div className="flex justify-center align-middle flex-col">
            <div className="flex place-content-center">
              <Title>Eventos</Title>
            </div>
            <div className="flex place-content-center">
              <DataTableComponent data={transformedEventsList} />
            </div>
          </div>
        </LayoutContainer>
      );
    }
    

