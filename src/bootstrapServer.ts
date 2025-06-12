import express from 'express';

export function createApp() {
  const app = express();

  // JSON body parser
  app.use(express.json());

  // Health-check route
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // /tool/hello route
  app.post('/tool/hello', (req, res) => {
    const { name } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'name required' });
      return; // ensure void return type
    }
    res.json({ greeting: `Hello, ${name}!` });
  });

  return app;
}
