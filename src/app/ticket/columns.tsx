"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../_components/ui/button";
import { api } from "~/trpc/react"; // Asegúrate de que la importación sea correcta
import { useEffect, useState } from "react";

interface UrgenciaMap {
  [key: number]: string;
}

const urgenciaMap: UrgenciaMap = {
  1: "Leve",
  2: "Baja",
  3: "Moderado",
  4: "Alto",
  5: "Urgente",
};

export type TablaTickets = {
  id: number;
  orgId: number | null;
  state: string | null;
  urgency: number | null;
  suppUrgency: number | null;
  createdAt: Date;
};

export const columns: ColumnDef<TablaTickets>[] = [
  {
    accessorKey: "orgId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Organización
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue, row }) => {
      const orgId = getValue<number | null>();
      const { data: organizations, isLoading } = api.companies.list.useQuery();

      if (isLoading) {
        return "Cargando...";
      }

      const orgMap = organizations?.reduce((acc, org) => {
        acc[org.id] = org.name;
        return acc;
      }, {} as Record<number, string>) || {};

      const organizationName = orgId ? orgMap[orgId] : "Sin organización";

      return organizationName || "Desconocido";
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    accessorKey: "urgency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Urgencia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const valorUrgencia = getValue<number>();
      return urgenciaMap[valorUrgencia] || "Desconocido";
    },
  },
];
