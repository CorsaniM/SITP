import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { images } from "~/server/db/schema";
import { utapi } from "~/server/uploadthings";

export const imagesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userName: z.string(),
        commentId: z.number(),
        url: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [respuesta] = await ctx.db.insert(images).values(input).returning();

      if (respuesta?.userName) {
        await ctx.db.insert(schema.events).values({
          userName: respuesta?.userName,
          ticketId: respuesta?.id,
          type: "sent",
          description: "Imagen enviada",
        });
      } else {
        await ctx.db.insert(schema.events).values({
          ticketId: respuesta?.id,
          type: "recieved",
          description: "Imagen recibida",
        });
      }
    }),

  getByTicket: publicProcedure
    .input(
      z.object({
        commentId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const channel = await ctx.db.query.images.findMany({
        where: eq(images.commentId, input.commentId),
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
      const [respuesta] = await db
        .delete(images)
        .where(eq(images.commentId, input.id))
        .returning();
      if (!respuesta?.url) {
        throw new Error("Error al borrar la imagen");
      }
      const url = (
        await utapi.deleteFiles(
          respuesta?.url.replace("https://utfs.io/f/", ""),
        )
      ).deletedCount;
      console.log("url delete", url);
      // return url;
    }),
});
