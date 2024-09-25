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
    const [isZoomed, setIsZoomed] = useState(false);     
  const [open, setOpen] = useState(false)
  const [transformOrigin, setTransformOrigin] = useState({ x: '50%', y: '50%' });
  const username = props.user ?? ""
  const user = api.clerk.getUsername.useQuery({ username: username }).data;

  const handleZoomToggle = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top; 

    const originX = `${(offsetX / rect.width) * 100}%`;
    const originY = `${(offsetY / rect.height) * 100}%`;

    setTransformOrigin({ x: originX, y: originY });
    setIsZoomed(prev => !prev);
  };

  return (
    <div className='flex flex-col max-w-full p-2 border border-gray-700 border-t last:border-b' role='button'>
      <>
        <div className='flex flex-row m-2 min-w-fit'>
          {user ? (
            <ListTile
              className='p-0 items-center min-w-fit'
              href={`./users/${user?.id}`}
              title={<>{user?.firstName} {user?.lastName}</>}
              leading={
                <div>
                  <img
                    className="h-10 rounded-full"
                    src={user?.imageUrl}
                    alt="User Profile"
                  />
                </div>
              }
            />
          ) : (
            <ListTile className='p-2 items-center min-w-fit' title={<>{username}</>} />
          )}
          {props.title && <div className='flex w-full h-fit p-2'>
            <div className='flex font-medium'>{props.title}</div>
          </div>}
        </div>
        <div className='flex flex-row flex-auto justify-between'>
          {props.description && <div className='flex px-2 flex-1 max-h-60 overflow-y-auto text-justify'>{props.description}</div>}
          {props.img && (
            <div className='flex w-1/4 px-2 max-h-60'>
              <img
                src={props.img}
                alt='image'
                className='flex mx-auto object-contain justify-center'
                onClick={() => setOpen(true)}
              />
            </div>
          )}
        </div>
      </>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex justify-center max-w-[80vw] max-h-[90vh]">
          <div
            className={`flex justify-center ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={handleZoomToggle}
          >
            <img
              src={props.img ?? ""}
              alt='image'
              style={{
                transformOrigin: `${transformOrigin.x} ${transformOrigin.y}`,
                transform: `scale(${isZoomed ? 2.5 : 1})`,
                transition: 'transform 0.5s ease',
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}



            
        