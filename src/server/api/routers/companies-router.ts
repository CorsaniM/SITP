import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import {
  companies,
  tickets,
  comments,
  images,
  participants,
  userCompanies,
} from "~/server/db/schema";

export const companiesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        orgId: z.string(),
        name: z.string(),
        razon_social: z.string(),
        description: z.string(),
        state: z.string(),
        phone_number: z.string(),
        address: z.string(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [respuesta] = await ctx.db
        .insert(schema.companies)
        .values(input)
        .returning();

      if (!respuesta) {
        throw new Error("Error al crear el companies");
      }
    }),
  list: protectedProcedure.query(async ({}) => {
    const companies = await db.query.companies.findMany();
    return companies;
  }),
  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const companiesWithRelations = await ctx.db.query.companies.findFirst({
        where: eq(companies.id, input.id),
      });

      return companiesWithRelations;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        razon_social: z.string(),
        description: z.string(),
        state: z.string(),
        phone_number: z.string(),
        address: z.string(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.update(companies).set(input).where(eq(companies.id, input.id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.transaction(async (tx) => {
        await tx.delete(userCompanies).where(eq(userCompanies.orgId, input.id));

        const ticketsToDelete = await tx
          .delete(tickets)
          .where(eq(tickets.orgId, input.id))
          .returning();

        const ticketIds = ticketsToDelete.map((ticket) => ticket.id);

        if (ticketIds.length > 0) {
          await tx
            .delete(comments)
            .where(inArray(comments.ticketId, ticketIds));
          await tx.delete(images).where(inArray(images.ticketId, ticketIds));
          await tx
            .delete(participants)
            .where(inArray(participants.ticketId, ticketIds));
        }

        await tx.delete(companies).where(eq(companies.id, input.id));
      });
    }),
});
