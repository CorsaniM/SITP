"use client"
import {
    
    Mails,
    Rows3,
    Users,
  } from "lucide-react";
import Sidenav, { SidenavItem } from '../sidenav';
import { useCheckRole } from "~/lib/react/roles";

export default function Page() {

    const isAdmin =  useCheckRole("Admin").hasRole;
    
    if(isAdmin){
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
            <SidenavItem icon={<Rows3 />} href="/empresas">
              Empresas
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


