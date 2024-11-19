import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { reportes } from "~/server/db/schema";

export const reportesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
        type: z.string(),
        title: z.string(),
        description: z.string(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {

      const [respuesta] = await ctx.db
        .insert(schema.reportes)
        .values(input)
        .returning();

        return [respuesta]
    }),


    list: publicProcedure.query(async ({}) => {
        const currentAccount = await db.query.reportes.findMany({
        });
        return currentAccount;
      }),


  getById: publicProcedure
    .input(
      z.object({
        idreporte: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const reporte = await ctx.db.query.reportes.findFirst({
        where: eq(reportes.id, input.idreporte),
      });

      return reporte;
    }),

  getByTicketId: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const channel = await ctx.db.query.reportes.findMany({
        where: eq(reportes.ticketId, input.ticketId),
      });

      return channel;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        type: z.string(),
        title: z.string(),
        descripcion: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.update(reportes).set(input).where(eq(reportes.id, input.id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        reporteId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(reportes).where(eq(reportes.id, input.reporteId));
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
//         .insert(reportes)
//         .values(input)
//         .returning();

//         console.log("perro")
//       if (!respuesta) {
//         console.log("perro 2")
//         throw new Error("Error al crear el comentario");
//       }

//       const newreporte: reportes = {
//         ...input,
//         id: respuesta.id
//       }

//       console.log("Termo")

//       try {
//         console.log(JSON.stringify({newreporte}))
//         const response = await fetch("api/hono/reportes/post",{
//           method: "POST",
//           body: JSON.stringify({newreporte}),
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

// app.post(`/${orgId}/reportes`, async (c) => {
//   const {
//     id, title, description
//   } = await c.req.json();
// } )

//  }),
