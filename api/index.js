import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { registerRoutes } from '../server/routes.js';
import { createServer } from '@vercel/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

await registerRoutes(app);

app.use((err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`Error processing ${req.method} ${req.path}:`);
  console.error(err.stack);

  res.status(status).json({
    message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// For static HTML serving (you can move files to `/public` and serve automatically)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'simple-index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'simple-index.html'));
});

// Export as a Vercel-compatible handler
export default app;
