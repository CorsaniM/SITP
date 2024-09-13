"use server";
import { Hono } from "hono";
import { api } from "~/trpc/server";

const app = new Hono().basePath("api/hono");
// const postDimetallo = new Hono().basePath("api/hono/dimetallo");

app.get("/ticket/:id", async (c) => {
  const ticketId = c.req.param("id");

  const ticket = await api.tickets.getById({ id: parseInt(ticketId) });
  if (ticket) {
    return c.json(ticket);
  } else {
    return c.json("no existe el ticket " + ticketId);
  }
});

app.get("/ticket/get/:orgid/:urgency/:title/:description", async (c) => {
  const orgId = c.req.param("orgid");
  const urgency = parseInt(c.req.param("urgency"));
  const title = c.req.param("title");
  const description = c.req.param("description");

  if (!orgId || !title || !description) {
    return c.json({ error: "Faltan parámetros requeridos" }, 400);
  }

  try {
    const newTicket = await api.tickets.create({
      orgId: parseInt(orgId),
      state: "Pendiente",
      urgency,
      suppUrgency: 0,
      title,
      description,
    });

    return c.json("Ticket creado: " + newTicket); // Devuelve el ticket creado con un código 201
  } catch (error) {
    return c.json({ error: "Error creando el ticket" }, 500);
  }
});

app.get("/comments/get/:ticketId/:title/:description", async (c) => {
  const ticketId = c.req.param("ticketId");
  const title = c.req.param("title");
  const description = c.req.param("description");

  if (!ticketId || !title || !description) {
    return c.json({ error: "Faltan parámetros requeridos" }, 400);
  }

  try {
    const newComment = await api.comments.create({
      state: "no leido",
      title: title,
      description: description,
      createdAt: new Date(),
      userName: "",
      ticketId: parseInt(ticketId),
      type: "recibido",
    });
    return c.json("Comentario creado en Ticket " + ticketId + newComment);
  } catch (error) {
    return c.json({ error: "Error creando el comentario" }, 500);
  }
});

// postDimetallo.post("/comments/post", async (c) => {
//   // const { id, title, description } = await c.req.json();
//   return c.json("Comentario creado");
// });

app.notFound((c) => {
  return c.text("Custom 404 Message", 404);
});

// Exportar las funciones como asíncronas
export const GET = async (request: Request) => app.fetch(request);
export const POST = async (request: Request) => app.fetch(request);
export const PUT = async (request: Request) => app.fetch(request);
export const DELETE = async (request: Request) => app.fetch(request);
export const PATCH = async (request: Request) => app.fetch(request);

// TEST creación de ticket:
// http://localhost:3000/api/hono/ticket/post/dimetallo/2/Test%20Ticket/This%20is%20a%20test%20description
// TEST envío de coment: (funciona)
// http://localhost:3000/api/hono/comments/get/5/ExampleTitle/ExampleDescription
