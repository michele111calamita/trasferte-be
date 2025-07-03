import { db } from '../../src/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Prima elimina la tabella (se esiste)
    await db.execute('DROP TABLE IF EXISTS users');

    // Poi crea la tabella con la struttura giusta
    await db.execute(`
      CREATE TABLE users (
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

    // (opzionale) Inserisci dati di esempio
    await db.execute(`
      INSERT INTO users (id, cognome, nome, dataNascita, luogoNascita, codiceFiscale, numeroTessera, codiceSicurezza) VALUES
      ('1', 'AMORUSO', 'ARMANDO', '16-6-1974', 'GIOIA DEL COLLE', '1', 'PROVA', 'ABC123'),
      ('2', 'BARI', 'ALESSANDRO', '25-7-1975', 'BARI', '2', 'PROVA', 'ABC124'),
      ('3', 'BARI', 'MIRO FRANCESCO', '27273', 'BARI', '3', 'PROVA', 'ABC125'),
      ('4', 'BATTAGLIA', 'GIUSEPPE', '25-12-1965', 'BARI', '4', 'PROVA', 'ABC126'),
      ('5', 'BITETTI', 'NUNZIO', '29-12-1990', 'SANTERAMO IN COLLE', '5', 'PROVA', 'ABC127'),
      ('6', 'CALAMITA', 'GIUSEPPE', '35374', 'BARI', '6', 'PROVA', 'ABC128'),
      ('7', 'CALAMITA', 'MICHELE', '23-9-1999', 'BARI', '7', 'PROVA', 'ABC129'),
      ('8', 'CALAMITA', 'PASQUALE', '23475', 'BITONTO', '8', 'PROVA', 'ABC130'),
      ('9', 'CARRASSI', 'NICOLA', '16-3-1999', 'BARI', '9', 'PROVA', 'ABC131'),
      ('10', 'CATACCHIO', 'SABINO', '20-7-1992', 'BARI', '10', 'PROVA', 'ABC132'),
      ('11', 'CEO', 'NICOLA', '29442', 'ACQUAVIVA DELLE FONTI', '11', 'PROVA', 'ABC133'),
      ('12', 'CHIARAPPA', 'GIANLUCA', '32966', 'BARI', '12', 'PROVA', 'ABC134'),
      ('13', 'DE GIROLAMO', 'VITANTONIO', '14-5-1996', 'BARI', '13', 'PROVA', 'ABC135'),
      ('14', 'DELLE FOGLIE', 'SIMONE', '24-8-2000', 'BARI', '14', 'PROVA', 'ABC136'),
      ('15', 'DIGIROLAMO', 'GIANLUCA', '26-5-1996', 'GIOIA DEL COLLE', '15', 'PROVA', 'ABC137'),
      ('16', 'DIMAURO', 'ERASMO', '23-8-1988', 'MODUGNO', '16', 'PROVA', 'ABC138'),
      ('17', 'FAVIA', 'MICHELE', '19-12-1966', 'BARI', '17', 'PROVA', 'ABC139'),
      ('18', 'FRASCATI', 'MICHELE', '22-1-1972', 'BARI', '18', 'PROVA', 'ABC140'),
      ('19', 'FILOGRANO', 'FABIO', '35159', 'BARI', '19', 'PROVA', 'ABC141'),
      ('20', 'GIORDANO', 'LUCIANO', '21068', 'BARI', '20', 'PROVA', 'ABC142'),
      ('21', 'GIORDANO', 'DANIELE', '28858', 'BARI', '21', 'PROVA', 'ABC143'),
      ('22', 'GLORIOSO', 'TERESA', '28955', 'BARI', '22', 'PROVA', 'ABC144'),
      ('23', 'LIPPOLIS', 'ELEONORA', '30-6-1999', 'PUTIGNANO', '23', 'PROVA', 'ABC145'),
      ('24', 'LOPRIENO', 'PASQUALE', '29346', 'BARI', '24', 'PROVA', 'ABC146'),
      ('25', 'MAZZONE', 'ROCCO', '30-6-1986', 'MODUGNO', '25', 'PROVA', 'ABC147'),
      ('26', 'MELE', 'GIUSEPPE', '28756', 'BARI', '26', 'PROVA', 'ABC148'),
      ('27', 'MONTEMURRO', 'ROSARIO', '3-7-1995', 'BITONTO', '27', 'PROVA', 'ABC149'),
      ('28', 'PESCARUOLO', 'LUCA', '8-12-1999', 'BARI', '28', 'PROVA', 'ABC150'),
      ('29', 'PIO', 'PASQUALE', '31200', 'BARI', '29', 'PROVA', 'ABC151'),
      ('30', 'PIO', 'SIMONE', '30181', 'BARI', '30', 'PROVA', 'ABC152'),
      ('31', 'PISCITELLA', 'SALVATORE', '31068', 'BARI', '31', 'PROVA', 'ABC153'),
      ('32', 'RIZZO', 'GIOVANNI', '3-2-1999', 'BARI', '32', 'PROVA', 'ABC154'),
      ('33', 'SCARDIGNO', 'PASQUALE', '22-7-1989', 'BARI', '33', 'PROVA', 'ABC155'),
      ('34', 'TAVANI', 'FABIO', '27684', 'BARI', '34', 'PROVA', 'ABC156'),
      ('35', 'TOGNI', 'SIMONE', '29690', 'BARI', '35', 'PROVA', 'ABC157'),
      ('36', 'TOGNI', 'STEFANO', '29832', 'BARI', '36', 'PROVA', 'ABC158'),
      ('37', 'TRAVERSA', 'ANTONIO', '26420', 'BARI', '37', 'PROVA', 'ABC159'),
      ('38', 'TRAVERSA', 'PASQUALE', '26232', 'BARI', '38', 'PROVA', 'ABC160'),
      ('39', 'TRAVERSA', 'VINCENZO', '26512', 'BARI', '39', 'PROVA', 'ABC161'),
      ('40', 'VENA', 'GIOVANNI', '30570', 'BARI', '40', 'PROVA', 'ABC162');
    `);

    res.status(200).json({ message: 'Setup completato' });
  } catch (err) {
    console.error('Errore setup:', err);
  
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
        ? err
        : JSON.stringify(err);
  
    res.status(500).json({ error: 'DB setup fallito', details: message });
  }
}
