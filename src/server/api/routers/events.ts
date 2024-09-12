import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events } from "~/server/db/schema";

export const eventsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userName: z.string().optional(),
        ticketId: z.number().optional(),
        orgId: z.string().optional(),
        type: z.string(),
        description: z.string(),
        commentsId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      await ctx.db.insert(events).values(input);
    }),

  get: publicProcedure.query(async ({ ctx }) => {
    await ctx.db.query.events.findMany();
  }),
});
