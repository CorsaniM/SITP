"use client"
import Dashboard from "../_components/dashboard/dashboard"
import { Title } from "../_components/ui/title";
import Tickets from "../ticket/page";



export default function Page(){
    return (
        <div className="h-screen w-screen pt-16 grid grid-cols-5 grid-rows-5">
            <div className='flex col-span-4 row-span-5 place-content-center max-h-full flex-column pl-36'>
                <div className="flex pt-4 flex-col align-center">
                    <Title>Tickets</Title>
                    <Tickets/>
                </div>
            </div>
            <div className='flex border-solid border-2 border-slate-500 max-h-full bg-slate-300 place-content-right flex-column p-2'>
                <Dashboard/>
            </div>
        </div>
        )
}