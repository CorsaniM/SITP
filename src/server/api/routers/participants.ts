import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { participants } from "~/server/db/schema";

export const participantsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      ticketId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      await ctx.db.insert(participants).values(input);
    }),
      
  getByTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
      }),
    )
  .query(async ({ input, ctx }) => {
    const channel = await ctx.db.query.participants.findMany({
      where: eq(participants.ticketId, input.ticketId),
    });
    return channel;
  }),
  
  getByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
  .query(async ({ input, ctx }) => {
    const ticketWithRelations = await ctx.db.query.participants.findMany({
        where: eq(participants.userId, input.userId),
        with: {ticket: true},
      });
      return ticketWithRelations;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        userId: z.string(),
        ticketId: z.number(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.update(participants).set(input)
      .where(eq(participants.id, input.id));
    }),


    delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(participants)
      .where(eq(participants.id, input.id));
    }),

});