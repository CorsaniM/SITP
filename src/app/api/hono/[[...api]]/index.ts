import { NextRequest, NextResponse } from 'next/server';
import app from 'hono';

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {
    return app.fetch(req, res);
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
