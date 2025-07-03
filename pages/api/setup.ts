// import { db } from '../../src/lib/db';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     // Prima elimina la tabella (se esiste)
//     await db.execute('DROP TABLE IF EXISTS users');

//     // Poi crea la tabella con la struttura giusta
//     await db.execute(`
//       CREATE TABLE users (
//         id TEXT PRIMARY KEY,
//         cognome TEXT,
//         nome TEXT,
//         dataNascita TEXT,
//         luogoNascita TEXT,
//         codiceFiscale TEXT,
//         numeroTessera TEXT,
//         codiceSicurezza TEXT
//       )
//     `);

//     // (opzionale) Inserisci dati di esempio
//     await db.execute(`
//       INSERT INTO users (id, cognome, nome, dataNascita, luogoNascita, codiceFiscale, numeroTessera, codiceSicurezza) VALUES
//       ('1', 'Amoruso', 'Armando', '16-6-1974', 'Gioia del Colle', '1', 'PROVA', 'ABC123'),
//       ('2', 'Bari', 'Alessandro', '25-7-1975', 'Bari', '2', 'PROVA', 'ABC124')
//     `);

//     res.status(200).json({ message: 'Setup completato' });
//   } catch (err) {
//     console.error('Errore setup:', err);
//     res.status(500).json({ error: 'DB setup fallito', details: err.message || err.toString() });
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';
import { db } from '../../src/lib/db';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Crea la tabella users (se non esiste)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        cognome TEXT,
        nome TEXT,
        dataNascita TEXT,
        luogoNascita TEXT,
        codiceFiscale TEXT,
        numeroTessera TEXT,
        codiceSicurezza TEXT
      )
    `);

    // Percorso del file Excel
    const filePath = path.join(process.cwd(), 'public', 'Lista 40+.xlsx');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File Excel non trovato' });
    }

    // Leggi file Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    // Inserisci i dati uno a uno (o batch)
    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      // Adatta i nomi delle colonne in base al tuo Excel
      const id = String(i + 1);
      const cognome = row['Cognome'] || '';
      const nome = row['Nome'] || '';
      const dataNascita = row['Data di nascita'] || '';
      const luogoNascita = row['Luogo di nascita'] || '';
      const codiceFiscale = String(row['Codice fiscale'] || '');
      const numeroTessera = row['Numero tessera'] || '';
      const codiceSicurezza = row['Codice sicurezza'] || '';

      await db.execute(
        `INSERT OR IGNORE INTO users (id, cognome, nome, dataNascita, luogoNascita, codiceFiscale, numeroTessera, codiceSicurezza)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, cognome, nome, dataNascita, luogoNascita, codiceFiscale, numeroTessera, codiceSicurezza]
      );
    }

    res.status(200).json({ message: `Importati ${data.length} utenti` });
  } catch (error) {
    console.error('Errore setup:', error);
    res.status(500).json({ error: 'Errore interno al server', details: error.message || error.toString() });
  }
}
