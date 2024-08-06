import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { events } from "~/server/db/schema";

export const eventsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      ticketId: z.number(),
      type: z.string(),
      description: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      await ctx.db.insert(events).values(input);
    }),
      
    get: publicProcedure.query(async ({ ctx }) => {
     await ctx.db.query.events.findMany();
    }),

});
