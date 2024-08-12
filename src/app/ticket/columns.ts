"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TablaTickets = {
  id: number
  orgId: string
  state: string
  urgency: number
  //createdAt: Date
}

export const columns: ColumnDef<TablaTickets>[] = [
  {
    accessorKey: "orgId",
    header: "Organización",
  },
  {
    accessorKey: "state",
    header: "Estado",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
  },
  {
    accessorKey: "urgency",
    header: "Urgencia",
  },
]

