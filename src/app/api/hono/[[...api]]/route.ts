import { Hono } from 'hono';
import { api } from '~/trpc/server';

const app = new Hono().basePath("api/hono");

app.get('/ticket/:id', async (c, next) => {
    const ticketId = c.req.param('id')

    const ticket = api.tickets.getById({ id: parseInt(ticketId) });
    if (ticket){
        return c.json(ticket)
    } else {
        return c.json('no existe el ticket ' + ticketId)
    }
})



app.notFound((c) => {
    return c.text('Custom 404 Message', 404)
  })

  export const GET = app.fetch;
  export const POST = app.fetch;
  export const PUT = app.fetch;
  export const DELETE = app.fetch;
  export const PATCH = app.fetch;

//app.get('/posts/:id/comment/:comment_id', (c) => {
//    const { id, comment_id } = c.req.param()  ... })