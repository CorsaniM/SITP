"use client"
import { OrganizationSwitcher, UserButton, useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { checkRole } from "~/lib/react/roles";


export default function Upbar() {
    const { organization } = useOrganization();
    const { user } = useUser()
    const isAdmin = checkRole("Admin")
    let rolPagina
if (!isAdmin) {
    rolPagina = "Admin"
} else {
    rolPagina = "Soporte"
}
    return (
        <div className="flex w-screen h-16 shadow-md justify-between items-center p-5 font-serif">
            <div className="text-lg">
                     <Link href={"/ticket"}> {rolPagina} {user?.fullName}!</Link>
            </div>
            <div className="flex items-center p-4">
                <div className=" rounded-lg bg-gray-400 text-white m-2">
                    <OrganizationSwitcher hidePersonal={true}/>
                </div>
                <UserButton/>
            </div>
        </div>
    );
}
