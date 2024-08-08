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
import { useOrganization, useUser } from "@clerk/nextjs";
import { checkRole } from "~/lib/react/roles";

export default function Page() {

    const isAdmin = checkRole("Admin");
    
    if(!isAdmin){
        return (
            <Sidenav>
            <SidenavItem icon={<Mails />} href="/ticket">
              Tickets
            </SidenavItem>
            <SidenavItem icon={<Users />} href="/users">
              Usuarios
            </SidenavItem>
            <SidenavItem icon={<Rows3 />} href="/events">
              Eventos
            </SidenavItem>
          </Sidenav>
            )
    }  
    else{
        return (
        <Sidenav>
            <SidenavItem
                icon={<Mails/>}
                href="/ticket">
                    Tickets
            </SidenavItem>
        </Sidenav>
        )
    } 
}


