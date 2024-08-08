"use server"
import { Hono } from 'hono';
import { api } from '~/trpc/server';

const app = new Hono().basePath("api/hono");

app.get('/ticket/:id', async (c, next) => {
    const ticketId = c.req.param('id')

    const ticket = await api.tickets.getById({ id: parseInt(ticketId) });
    if (ticket){
        return c.json(ticket)
    } else {
        return c.json('no existe el ticket ' + ticketId)
    }
})

app.get('/ticket/post/:orgid/:urgency/:title/:description', async (c) => {
    const orgId = c.req.param('orgid');
    const urgency = parseInt(c.req.param('urgency'));
    const title = c.req.param('title');
    const description = c.req.param('description');

    if (!orgId || !title || !description) {
        return c.json({ error: 'Faltan parámetros requeridos' }, 400);
    }

    try {
        const newTicket = await api.tickets.create({
            orgId,
            state: 'nuevo',  // Asignar el estado por defecto
            urgency,
            suppUrgency: 0,  // Asignar suppUrgency por defecto a 0
            title,
            description,
        });
        return c.json("Ticket creado"); // Devuelve el ticket creado con un código 201
    } catch (error) {
        return c.json({ error: 'Error creando el ticket' }, 500);
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
