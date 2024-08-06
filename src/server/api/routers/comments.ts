import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { comments, images } from "~/server/db/schema";

export const commentsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      ticketId: z.number(),
      type: z.string(), //(Actualización, Ticket Rechazado, Ticket Finalizado)
      state: z.string(), //(leído o no por el creador asignado)
      title: z.string(),
      description: z.string(),
      createdAt: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [respuesta] = await ctx.db
        .insert(comments)
        .values(input)
        .returning();

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
