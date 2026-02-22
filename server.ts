import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('notes.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    context TEXT,
    fontFamily TEXT,
    colorTheme TEXT,
    createdAt INTEGER,
    updatedAt INTEGER
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/notes', (req, res) => {
    try {
      const notes = db.prepare('SELECT * FROM notes ORDER BY updatedAt DESC').all();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

  app.post('/api/notes', (req, res) => {
    const note = req.body;
    try {
      const upsert = db.prepare(`
        INSERT INTO notes (id, title, content, context, fontFamily, colorTheme, createdAt, updatedAt)
        VALUES (@id, @title, @content, @context, @fontFamily, @colorTheme, @createdAt, @updatedAt)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          content = excluded.content,
          context = excluded.context,
          fontFamily = excluded.fontFamily,
          colorTheme = excluded.colorTheme,
          updatedAt = excluded.updatedAt
      `);
      upsert.run(note);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save note' });
    }
  });

  app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM notes WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete note' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
