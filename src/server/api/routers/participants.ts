import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { participants } from "~/server/db/schema";

export const participantsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userFullName: z.string(),
        userName: z.string(),
        ticketId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      await ctx.db.insert(participants).values({
        userName: input.userName, ticketId: input.ticketId});

      const ticket = await ctx.db
        .update(schema.tickets)
        .set({ state: "En curso" })
        .where(eq(schema.tickets.id, input.ticketId));
        console.log("Termo 2", input.userFullName )
        await ctx.db.insert(schema.events).values({
          userName: input.userFullName,
          ticketId: input.ticketId,
          type: "asigned",
          description: "Ticket asignado",
        });

      return ticket;
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
        userName: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const ticketWithRelations = await ctx.db.query.participants.findMany({
        where: eq(participants.userName, input.userName),
        with: { ticket: true },
      });
      return ticketWithRelations;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        userFullName: z.string(),
        userName: z.string(),
        ticketId: z.number(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .update(participants)
        .set(input)
        .where(eq(participants.id, input.id));
        
      await db.insert(schema.events).values({
          userName: input.userFullName,
          ticketId: input.ticketId,
          type: "asigned",
          description: "Ticket asignado",
        });
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(participants).where(eq(participants.id, input.id));
    }),
  deleteByUserAndTicket: publicProcedure
    .input(
      z.object({
        user: z.string(),
        ticketId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(participants)
        .where(
          and(
            eq(participants.ticketId, input.ticketId),
            eq(participants.userName, input.user),
          ),
        );
    }),
});
