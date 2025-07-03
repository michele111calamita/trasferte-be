import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/lib/db';
import Cors from 'cors';
import jwt from 'jsonwebtoken';

const cors = Cors({
  origin: '*', // In produzione metti il dominio frontend
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

const SECRET = process.env.JWT_SECRET || 'fallback-secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password } = req.body; // nome, cognome

  if (!username || !password) {
    return res.status(400).json({ error: 'Nome e cognome sono obbligatori' });
  }

  try {
    const result = await db.execute(
      'SELECT * FROM users WHERE nome = ? AND cognome = ?',
      [username.trim().toUpperCase(), password.trim().toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, nome: user.nome, cognome: user.cognome }, SECRET, { expiresIn: '2h' });

    return res.status(200).json({ token });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err);

    return res.status(500).json({ error: 'Errore interno', details: message });
  }
}
