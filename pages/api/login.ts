import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const cors = Cors({
  origin: 'http://localhost:4200',
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

  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: 'Credenziali non valide' });
}
