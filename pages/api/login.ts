import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { db } from '../../src/lib/db';
import cors, { runMiddleware } from '../../src/lib/cors';

const SECRET = process.env.JWT_SECRET || 'fallback-secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ CORS middleware
  await runMiddleware(req, res, cors);

  // ✅ Risposta preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // ✅ Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Nome e cognome obbligatori' });
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
    const token = jwt.sign(
      { id: user.id, nome: user.nome, cognome: user.cognome },
      SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: 'Errore interno', details: message });
  }
}
