import { datetime } from "drizzle-orm/mysql-core"
import { TablaTickets, columns } from "./columns"
import { DataTable } from "./table"
import Dashboard from "../_components/dashboard/dashboard"
import { Button } from "../_components/ui/button"

async function getData(): Promise<TablaTickets[]> {
  // Fetch data from your API here.
  return [
    {
        id: 1,
        orgId: "dimetallo",
        state: "pending",
        urgency: 0,
        //createdAt: 
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="h-screen w-screen ml-36 mt-16 grid grid-rows-8">
        <div className='flex border-solid ml-1 border-2 border-slate-500 rounded-b-2xl max-h-full place-content-right p-2'>
            <Dashboard/>
        </div>
      <div className='flex row-span-5 place-content-center flex-column'>
          <div className="flex pt-4 flex-col align-center">
              <div className="px-10 py-4">
                <div className="container mx-auto py-10">
                  <DataTable columns={columns} data={data} />
                </div>
            </div>
          </div>
      </div>
  </div>
  )
}
