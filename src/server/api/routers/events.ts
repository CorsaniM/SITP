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

  get: publicProcedure
  .query(async ({ ctx }) => {
    const eventsList = await ctx.db.query.events.findMany();

    const sortedEvents = eventsList.map((event) => {
        console.log("Event",event)
        return { ...event, type: event.type, description: event.description, userName: event.userName };  
      
    });

    return sortedEvents;
  }),
});
