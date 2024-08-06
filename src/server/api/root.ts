
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { imagesRouter } from "./routers/images";
import { ticketsRouter } from "./routers/tickets";
import { commentsRouter } from "./routers/coments";
import { participantsRouter } from "./routers/participants";
import { eventsRouter } from "./routers/events";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tickets: ticketsRouter,
  coments: commentsRouter,
  participants: participantsRouter,
  images: imagesRouter,
  events: eventsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
