import * as React from "react"
import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/ui/table";

import {
  Pagination,
  PaginationContent,

  PaginationItem,
 
} from "../_components/ui/pagination"


import { Button } from "../_components/ui/button"
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  

  const handleRowClick = (row: Row<TData> ) => {
        const fila = row.original as {id:number}
    router.push(`/ticket/${fila.id}`);
      };

  return (
    <div>
      <div className="flex items-center m-2 ">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <p className="text-sm font-medium"> Filas</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 8, 10, 12, 15, 30].map((pageSize) => (
                <SelectItem className="hover:bg-gray-500" key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div> 
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
    {table.getRowModel().rows?.length ? (
      table.getRowModel().rows.map((row) => (
        <TableRow
          className="cursor-pointer hover:bg-gray-500 hover:text-gray-900 active:bg-gray-700"
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          onClick={() => handleRowClick(row)}
        >
          {row.getVisibleCells().map((cell) => {
            return (
              <TableCell className="text-center" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center justify-center">
          No results.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
        </Table>
      </div>
      <div className="flex py-4 ">
        <Pagination>
          <PaginationContent>
          <PaginationItem>
            
          </PaginationItem>
            <PaginationItem>
              <Button
              variant="outline"
              size="sm"
              onClick={() => table.firstPage()}
              >
                Primera
              </Button>
            </PaginationItem>

            <PaginationItem>
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
              >
                Anterior
              </Button>
            </PaginationItem>
            <PaginationItem>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium" >
                Página {table.getState().pagination.pageIndex + 1} de {" "}
                {table.getPageCount()}
              </div>
            </PaginationItem>
            <PaginationItem>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
          >
            Siguiente
          </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
              variant="outline"
              size="sm"
              onClick={() => table.lastPage()}
              >
                Última
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
