"use client"
import { OrganizationSwitcher, UserButton, useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { checkRole } from "~/lib/react/roles";


export default function Upbar() {
    const { organization } = useOrganization();
    const { user } = useUser()
    const isAdmin = checkRole("owner" || "admin")

    return (
        <div className="flex w-screen h-16 bg-white shadow-md justify-between items-center p-5 font-serif">
            <div className="text-lg">
                {organization?.name === "IanTech" ?(
                    <Link href={"/admin"}>Administrador {user?.fullName}</Link>
                ) : (
                     <Link href={"/support"}>Soporte {user?.fullName}!</Link>
                )} 

            </div>
            <div className="flex items-center p-4">
                <div>
                    <OrganizationSwitcher hidePersonal={true}/>
                </div>
                <UserButton/>
            </div>
        </div>
    );
}
