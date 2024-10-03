import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db, schema } from "~/server/db";
import { tickets, userCompanies } from "~/server/db/schema";

const priority: Record<string, number> = {
  "En curso": 1,
  Pendiente: 2,
  "En espera": 3,
  Finalizado: 4,
  Rechazado: 5,
};

export const ticketsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        orgId: z.number(),
        state: z.string(),
        urgency: z.number(),
        suppUrgency: z.number(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [respuesta] = await ctx.db
        .insert(schema.tickets)
        .values(input)
        .returning();
      await ctx.db.insert(schema.events).values({
        userName: "",
        ticketId: respuesta?.id,
        type: "recieved",
        description: "Ticket creado",
      });
      if (!respuesta) {
        throw new Error("Error al crear el ticket");
      }
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const ticketWithRelations = await ctx.db.query.tickets.findFirst({
        where: eq(tickets.id, input.id),
        with: {
          comments: { with: { images: true } },
          participants: true,
        },
      });

      return ticketWithRelations;
    }),

  list: protectedProcedure.query(async ({}) => {
    const ticketsList = await db.query.tickets.findMany();

    const sortedTickets = ticketsList.sort((a, b) => {
      const priorityA = priority[a.state ?? ""] ?? 6;
      const priorityB = priority[b.state ?? ""] ?? 6;
      const stateComparison = priorityA - priorityB;
      if (stateComparison !== 0) {
        return stateComparison;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sortedTickets;
  }),

  getByOrg: publicProcedure
    .input(
      z.object({
        orgId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const ticketsByOrg = await ctx.db.query.tickets.findMany({
          where: eq(tickets.orgId, input.orgId),
        });

        const sortedTickets = ticketsByOrg.sort((a, b) => {
          const priorityA = priority[a.state ?? ""] ?? 6;
          const priorityB = priority[b.state ?? ""] ?? 6;
          const stateComparison = priorityA - priorityB;
          if (stateComparison !== 0) {
            return stateComparison;
          }
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        return sortedTickets;
      } catch {
        return null;
      }
    }),

  getByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const companie = await ctx.db.query.userCompanies.findMany({
        where: eq(userCompanies.userId, input.userId),
      });

      const companies = companie.map((companie) => companie.orgId ?? 0);

      if (companie.length === 0) {
        return [];
      }

      const ticketsWithRelations = await ctx.db.query.tickets.findMany({
        where: inArray(tickets.orgId, companies),
        with: {
          comments: true,
          participants: true,
        },
      });

      const sortedTickets = ticketsWithRelations.sort((a, b) => {
        const priorityA = priority[a.state ?? ""] ?? 6;
        const priorityB = priority[b.state ?? ""] ?? 6;
        const stateComparison = priorityA - priorityB;
        if (stateComparison !== 0) {
          return stateComparison;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      return sortedTickets;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        orgId: z.number().optional(),
        state: z.string().optional(),
        urgency: z.number().optional(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [respuesta] = await ctx.db
        .update(tickets)
        .set(input)
        .where(eq(tickets.id, input.id))
        .returning();
        if (!respuesta) {
          throw new Error("Error al crear el ticket");
        }
        if (respuesta.state === "En espera") {
          await ctx.db.insert(schema.events).values({
            userName: "",
            ticketId: respuesta?.id,
            type: "on hold",
            description: "Ticket en espera",
          }); 
        }
        if (respuesta.state === "Rechazado") {
          await ctx.db.insert(schema.events).values({
            userName: "",
            ticketId: respuesta?.id,
            type: "rejected",
            description: "Ticket rechazado",
          }); 
        }
        if (respuesta.state === "Finalizado") {
          await ctx.db.insert(schema.events).values({
            userName: "",
            ticketId: respuesta?.id,
            type: "finished",
            description: "Ticket finalizado",
          }); 
        }
        // if (respuesta.state === "En espera") {
        //   await ctx.db.insert(schema.events).values({
        //     userName: "",
        //     ticketId: respuesta?.id,
        //     type: "recieved",
        //     description: "Ticket en espera",
        //   }); 
        // }
        return respuesta;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(tickets).where(eq(tickets.id, input.id));
    }),
});
