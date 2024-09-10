import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { comments, images } from "~/server/db/schema";

export const commentsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userName: z.string(),
        ticketId: z.number(),
        type: z.string(), //(Actualización, Ticket Rechazado, Ticket Finalizado)
        state: z.string(), //(leído o no por el creador asignado)
        title: z.string(),
        description: z.string(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [respuesta] = await ctx.db
        .insert(comments)
        .values(input)
        .returning();

        if (respuesta?.userName) {
          await ctx.db.insert(schema.events).values({
            userName: respuesta?.userName,
            ticketId: respuesta?.id,
            type: "sent",
            description: "Comentario enviado" 
          });
          } else {
            await ctx.db.insert(schema.events).values({
              ticketId: respuesta?.id,
              type: "recieved",
              description: "Comentario recibido" 
            });
          }
          
      if (!respuesta) {
        throw new Error("Error al crear el comentario");
      }
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const channel = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, input.id),
      });

      return channel;
    }),

  getByTicketId: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const channel = await ctx.db.query.comments.findMany({
        where: eq(comments.id, input.ticketId),
      });

      return channel;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(comments).where(eq(comments.id, input.id));
    }),
});

// create: publicProcedure
//     .input(z.object({
//       userId: z.string(),
//       ticketId: z.number(),
//       type: z.string(), //(Actualización, Ticket Rechazado, Ticket Finalizado)
//       state: z.string(), //(leído o no por el creador asignado)
//       title: z.string(),
//       description: z.string(),
//       createdAt: z.date(),
//     }))
//     .mutation(async ({ ctx, input }) => {
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       const [respuesta] = await ctx.db
//         .insert(comments)
//         .values(input)
//         .returning();

//         console.log("perro")
//       if (!respuesta) {
//         console.log("perro 2")
//         throw new Error("Error al crear el comentario");
//       }

//       const newComment: comments = {
//         ...input,
//         id: respuesta.id
//       }

//       console.log("Termo")

//       try {
//         console.log(JSON.stringify({newComment}))
//         const response = await fetch("api/hono/comments/post",{
//           method: "POST",
//           body: JSON.stringify({newComment}),
//         })

//         if(!response.ok){
//           const error = await response.json()
//           console.log("Termo")
//           throw new Error(error || "Error al crear el comentario");
//         }

//         const responseData = await response.json()
//         console.log("Ticket creado: ", responseData )
//       }
//       catch (error: any) {
//         console.log("Termo 2")
//         throw new Error(error || "Error al crear el comentario");
//       }

// app.post(`/${orgId}/comments`, async (c) => {
//   const {
//     id, title, description
//   } = await c.req.json();
// } )

//  }),
