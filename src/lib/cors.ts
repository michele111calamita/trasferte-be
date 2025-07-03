import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

// Imposta l'origine frontend (diversa in dev vs prod)
const allowedOrigin = process.env.NODE_ENV === 'production'
  ? 'https://trasferte-be.vercel.app'
  : 'http://localhost:4200';

// Inizializza CORS
const cors = Cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default cors;
