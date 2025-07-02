import { db } from '../../src/lib/db'; // se rimane fuori da src/
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
  
  await db.execute(`
    INSERT OR IGNORE INTO users (id, username, password) VALUES
      ('1', 'admin', 'admin'),
      ('2', 'giulia', 'pass123'),
      ('3', 'luca', 'mypass'),
      ('4', 'elena', 'qwerty'),
      ('5', 'marco', 'ciao123'),
      ('6', 'sofia', 'testpass');
  `);
  

    res.status(200).json({ message: 'Setup completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB setup failed' });
  }
}
