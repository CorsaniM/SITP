import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";

export const imagesRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      ticketId: z.number(),
      url: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      await ctx.db.insert(images).values(input);
    }),
      
  getByTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
      }),
    )
  .query(async ({ input, ctx }) => {
    const channel = await ctx.db.query.images.findMany({
      where: eq(images.ticketId, input.ticketId),
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
      await db.delete(images).where(eq(images.id, input.id));
    }),

});
