import { Hono } from "hono";
import { api } from "~/trpc/server";

const app = new Hono().basePath("api/hono");

app.get("/ticket/:id", async (c) => {
  const ticketId = parseInt(c.req.param("id"));

  try {
    const ticket = await api.tickets.getById({ id: ticketId });
    if (ticket) {
      return c.json(ticket);
    } else {
      return c.json({ message: "No existe el ticket " + ticketId });
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return c.json({ message: "Error al obtener el ticket", error }, 500);
  }
});

app.notFound((c) => {
  return c.text("Custom 404 Message", 404);
});

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
export const PATCH = app.fetch;
