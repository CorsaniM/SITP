import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "~/server/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { UseCheckRole } from "~/lib/server/roles";
import { userCompanies } from "~/server/db/schema";

export const userCompaniesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userName: z.string(),
        orgId: z.number(),
        updatedAt: z.date(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await ctx.db.insert(userCompanies).values(input);
    }),

  list: protectedProcedure.query(async () => {
    try {
      const response = await clerkClient.users.getUserList();
      return response;
    } catch (e) {
      throw new Error("Error listing users");
    }
  }),
  getByOrg: publicProcedure
    .input(
      z.object({
        orgId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const channel = await ctx.db.query.userCompanies.findMany({
        where: eq(userCompanies.orgId, input.orgId),
      });
      return channel;
    }),
  editUser: protectedProcedure
    .input(
      z.object({
        userId: z.string().nonempty(),
        role: z.string().nonempty(),
        firstName: z.string().optional().nullable(),
        lastName: z.string().optional().nullable(),
        username: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!UseCheckRole("Admin" || "admin")) {
        throw new Error("Not Authorized");
      }
      try {
        const res = await clerkClient.users.updateUser(input.userId, {
          publicMetadata: { role: input.role },
          firstName: input.firstName ?? undefined,
          lastName: input.lastName ?? undefined,
          username: input.username ?? undefined,
        });

        return { res };
      } catch (e) {
        throw new Error("Error updating user");
      }
    }),
  deleteByUserAndOrg: publicProcedure
    .input(
      z.object({
        user: z.string(),
        orgId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(userCompanies)
        .where(
          and(
            eq(userCompanies.orgId, input.orgId),
            eq(userCompanies.userName, input.user),
          ),
        );
    }),
});
