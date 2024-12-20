"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Messages } from "~/app/ticket/[ticketId]/mensajes";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { ListTile } from "../ui/list";

export default function NotificationButton() {
    const { data: comments, isLoading } = api.comments.getAllUnseen.useQuery(); 
    const [isOpen, setIsOpen] = useState(false); 
    const router = useRouter();

    const handleClick = (id: number) => {
      router.push(`/ticket/${id}`);
    }
  return (
    <div className="relative hover:bg-gray-700 rounded-full p-1.5 mr-3 ">
      <div
        className="cursor-pointer relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {comments && comments.length > 0 && (
          <span className="absolute bottom-3 left-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {comments.length}
          </span> 
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-600 rounded-md z-60">
          <div className="p-2">
              {isLoading ? (
                <p>Cargando...</p>
              ) : comments ? (
                <Messages className="max-h-96 min-h-full overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id}>
                      <ListTile
                        
                        className='items-center p-2'
                        onClick={() => handleClick(comment.ticketId)}
                        title={<>{comment.userName?.replace("org", "")}</>}
                        subtitle = {<p>{comment.title}</p>}
                        trailing = {<p className="truncate max-w-60">{comment.description}{"..."}</p>}
                      />
                  </div>
                  ))}
                </Messages>
              ) : (
                <p>No hay notificaciones pendientes</p>
              )}
            </div>
          </div>
      )}
    </div>
  );
}
