"use client"
import {
    MailCheck,
    MailOpen,
    MailPlus,
    Mails,
    Rows2Icon,
    Rows3,
    User,
    Users,
  } from "lucide-react";
import Sidenav, { SidenavItem } from '../sidenav';
import { useOrganization } from "@clerk/nextjs";

export default function Page() {

    const organization = useOrganization()

    if(organization.organization?.name === "IanTech"){
        return (
            <Sidenav >
                <SidenavItem 
                    icon={<Mails />} 
                    href="/admin">
                        Tickets
                </SidenavItem>
                <SidenavItem
                    icon={<Users />}
                    href="/admin/users">
                        Usuarios
                </SidenavItem>
                <SidenavItem
                    icon={<Rows3 />}
                    href="/admin/events">
                        Eventos
                </SidenavItem>
            </Sidenav>
            )
    }  
    else{
        return (
        <Sidenav>
            <SidenavItem 
                icon={<MailPlus />} 
                href="/support/crear-tickets">
                    Crear ticket
            </SidenavItem>
            <SidenavItem
                icon={<Mails/>}
                href="/support">
                    Tickets
            </SidenavItem>
        </Sidenav>
        )
    } 
}


