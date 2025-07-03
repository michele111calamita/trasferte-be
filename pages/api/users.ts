import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/lib/db';
import initMiddleware from '../../src/lib/init-middleware';
import Cors from 'cors';

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: '*' // o il dominio frontend per sicurezza
  })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await db.execute('SELECT * FROM users ORDER BY cognome, nome');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Errore API /users:', err);
  
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
        ? err
        : JSON.stringify(err);
  
    res.status(500).json({ error: 'Errore interno al server', details: message });
  }
}
