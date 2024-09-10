import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { companies } from "~/server/db/schema";

export const companiesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
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
      await db.delete(companies).where(eq(companies.id, input.id));
    }),
});
