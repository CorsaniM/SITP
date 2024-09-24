import { useUser } from "@clerk/nextjs";
import * as Dialog from "@radix-ui/react-dialog";
import {  useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/app/_components/ui/button";
import { DialogHeader, DialogFooter } from "~/app/_components/ui/dialog";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ImageUpload from "~/app/_components/image-upload";

export function CrearComentario(props: { ticketId: number, isRechazado: boolean, isFinalizado: boolean }) {
  const isRechazado = props.isRechazado
  const isFinalizado = props.isFinalizado
  const finish = isRechazado || isFinalizado

  const [open, setOpen] = useState(false);
  const id = props.ticketId
  const ticket = api.tickets.getById.useQuery({ id }).data;
  const { mutateAsync: createMensaje, isPending } = api.comments.create.useMutation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const [description, setDescription] = useState("")
  const [title, setTitle] = useState(ticket?.title ?? "")
  
  // const comments = ticket?.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())



  async function handleCreate() {
    if(!description || !title){
      setError('Todos los campos son obligatorios')
      return toast.error('Todos los campos son obligatorios')
    }
    try {
        await createMensaje({
            title: title || "",
            userName: user!.fullName!,
            ticketId: ticket!.id,
            type: "actualización",
            state: "no leido",
            description: description,
            createdAt: new Date,
            isFinish: finish
        })  
        toast.success('Mensaje enviado')
        await queryClient.invalidateQueries()
        setDescription("")
        setTitle("")
        setOpen(false)
        router.refresh();

    } catch (e) {
        setError('No se pudo crear el mensaje')
        toast.error('No se pudo crear el mensaje')
    }
}
  return (
    <>
      <Button className="m-2 px-4 py-2 text-white disabled:opacity-50 text-lg rounded-full bg-gray-800 border hover:bg-gray-500 hover:text-black"
        onClick={() => setOpen(true)}>
          Agregar comentario
          </Button>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40" />
              <Dialog.Content className="fixed  z-50 m-auto inset-0 flex items-center justify-center">
                <div className="bg-gray-800 w-[50vw] min-w-80 p-6 rounded-lg shadow-lg pb-0">
                  <DialogHeader>
                    <Dialog.Title>Ingrese un nuevo comentario</Dialog.Title>
                    <Dialog.Description className="space-y-3">
                    <h1 className='text-lg'>Titulo</h1>
                    <input className="h-10 w-full border bg-gray-700 p-2 text-lg text-wrap "
                                    value={title}
                                    placeholder='Titulo...'
                                    onChange={(e) => setTitle(e.target.value)}/>
                    {error && <p className="text-red-500">{error}</p>}

                    <h1>Comentario</h1>
                <textarea
                    className="h-[25vh] w-full border bg-gray-700 p-2 text-lg overflow-y-auto"
                    value={description}
                    placeholder='Comentario...'
                    onChange={(e) => setDescription(e.target.value)}
                    />
                    {error && <p className="text-red-500">{error}</p>}

                    <ImageUpload/>

                    </Dialog.Description>
                  </DialogHeader>
                  <DialogFooter>
                      <Button 
                      className="m-4 px-4 py-2 text-white disabled:opacity-50 text-lg 
                      rounded-full bg-gray-800 border hover:bg-gray-500 hover:text-black"
                      disabled={isPending}
                      onClick={handleCreate}>
                    {isPending ? "Creando..." : "Crear"} 
                    </Button>
                    <Button className="m-4 px-4 py-2 text-white disabled:opacity-50 text-lg 
                      rounded-full bg-gray-800 border hover:bg-gray-500 hover:text-black"
                      onClick={() => setOpen(false)}>Cancelar</Button>
                  </DialogFooter>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
    </>
  );
}
