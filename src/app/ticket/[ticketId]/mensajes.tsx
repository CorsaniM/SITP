import React, { useState } from 'react'
import { ListTile } from '~/app/_components/ui/list'
import { cn } from '~/lib/utils'
import { clerkClient } from "@clerk/nextjs/server";
// import { getServerAuthSession } from "~/server/auth";
import { useUser } from '@clerk/nextjs';
import { api } from '~/trpc/react';
import {  Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,  } from '~/app/_components/ui/dialog';
import { Button } from '~/app/_components/ui/button';

export type MessagesProps = {
    children?: React.ReactNode
    className?: string
}

export type MessageTileProps = {
    title?: string | null
    subtitle?: string | null
    description?: string | null
    className?: string | null
    from?: string | null
    img?: string | null
    user?: string | null
}

export type UsersType = Awaited<
  ReturnType<typeof clerkClient.users.getUserList>
>["data"][number];

export function Messages(props: MessagesProps) {
    const isEmpty = React.Children.count(props.children) === 0

    return (
        <div className={cn(props.className)}>
            {!isEmpty && <ul>{props.children}</ul>}
            {isEmpty && <div className='rounded-lg border border-dashed text-center text-gray-500'>No hay mensajes</div>}
        </div>
    )
}

export function MessageTile(props: MessageTileProps) {

const [open, setOpen] = useState(false)
    const username = props.user ?? ""
    const user = api.clerk.getUsername.useQuery({ username: username}).data;
    console.log("USER", user, props.user)
    return (
        
        <div className='flex flex-col max-w-full p-2 
        border border-gray-700 border-t last:border-b' role='button' >
        <>
            <div className='flex flex-row m-2 min-w-fit'>
            {user ?
            <ListTile
            className='p-0 items-center min-w-fit'
            href={`./users/${user?.id}`}
            title={<>
                    {user?.firstName} {user?.lastName}
                </>}
                leading={<div>
                    <img
                    className="h-10 rounded-full"
                    src={user?.imageUrl}
                    alt="User Profile"
                    /></div>}
                    />
                : (<ListTile className='p-0 items-center min-w-fit' 
                    title={<>
                        {username}
                    </>}
                    ></ListTile>)}
           {props.title && <div className='flex w-full h-fit p-2'>
                <div className='flex font-medium '>{props.title}</div>
            </div>}
            </div>
<div className='flex flex-row justify-between'>
            {props.description && <div className='flex px-2 max-h-40 overflow-y-auto text-justify'>{props.description}</div>}
            {props.img && <img className='' src={props.img} alt='image' width={300} height={300} onClick={() => setOpen(true)}/>}
</div>

        </>
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          
        <img src={props.img ?? ""} alt='image' width={800} height={800} onClick={() => setOpen(false)}/>
              <Button onClick={() => setOpen(false)}>
               Cerrar
              </Button>
        </DialogContent>

        </Dialog>
        </div>
    )
}



            
        