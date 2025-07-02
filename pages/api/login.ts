import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback-secret';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: 'Credenziali non valide' });
}