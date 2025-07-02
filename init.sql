CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

INSERT INTO users (id, username, password) VALUES
  ('1', 'admin', 'admin'),
  ('2', 'giulia', 'pass123'),
  ('3', 'luca', 'mypass'),
  ('4', 'elena', 'qwerty'),
  ('5', 'marco', 'ciao123'),
  ('6', 'sofia', 'testpass')
ON CONFLICT(username) DO NOTHING;
