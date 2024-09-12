"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
 
import { Button } from "../_components/ui/button"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TablaEvents = {
  id: number
  orgId: string|null
  state: string|null
  urgency: number|null
  suppUrgency: number|null
  createdAt: Date
}

export const columns: ColumnDef<TablaEvents>[] = [
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
      )
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
      )
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
      )
    },
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    accessorKey: "urgency",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Urgencia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    
    cell: ({ row }) => {
      const { suppUrgency, urgency } = row.original;
      return suppUrgency && suppUrgency !== 0 ? suppUrgency : urgency;
    },
  },
  
]

