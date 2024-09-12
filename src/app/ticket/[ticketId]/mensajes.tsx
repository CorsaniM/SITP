import React from 'react'
import { ListTile } from '~/app/_components/ui/list'
import { cn } from '~/lib/utils'
import { clerkClient } from "@clerk/nextjs/server";
// import { getServerAuthSession } from "~/server/auth";
import { useUser } from '@clerk/nextjs';

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
    const { user } = useUser()
    
    return (
        
        <div className='flex flex-col max-w-full p-2 
        border border-gray-700 border-t last:border-b' role='button' >
        <>
            <div className='flex flex-row m-2 min-w-fit'>
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
           {props.title && <div className='flex w-full h-fit p-2'>
                <div className='flex font-medium '>{props.title}</div>
            </div>}
            </div>

            {props.description && <div className='flex px-2 max-h-40 overflow-y-auto text-justify'>{props.description}</div>}
        </>

        </div>
    )
}



            
        