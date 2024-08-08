import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { images, participants, tickets } from "~/server/db/schema";

export const ticketsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      orgId: z.string(),
      state: z.string(),
      urgency: z.number(),
      suppUrgency: z.number(),
      title: z.string(),
      description: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
    const [respuesta] = await ctx.db
        .insert(schema.tickets)
        .values(input)
        .returning();

      if (!respuesta) {
        throw new Error("Error al crear el ticket");
      }
    }),
      
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const ticketWithRelations = await ctx.db.query.tickets.findFirst({
        where: eq(tickets.id, input.id),
        with: {
          comments: true,
          images: true,
          participants: true,
        },
      });

      return ticketWithRelations;
    }),

  getByOrg: publicProcedure
    .input(
      z.object({
        orgId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {

      try {
        const ticketWithRelations = await ctx.db.query.tickets.findMany({
          where: eq(tickets.orgId, input.orgId),
          with: {
            comments: true,
            images: true,
            participants: true,
          },
        });
  
        return ticketWithRelations;
      }
     catch {
      return null
      }
    }),

    getByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {      
      const ticketWithRelations = await ctx.db.query.tickets.findMany({
        where: eq(participants.userId, input.userId),
        with: {
          comments: true,
          images: true,
          participants: true,
        },
      });

      return ticketWithRelations;
    }),

    update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        orgId: z.string(),
        state: z.string(),
        suppUrgency: z.number(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.update(tickets).set(input)
      .where(eq(tickets.id, input.id));
    }),

    delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(tickets).where(eq(tickets.id, input.id));
    }),

});
