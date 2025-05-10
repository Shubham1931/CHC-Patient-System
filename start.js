// Simple start script that doesn't rely on environment variables
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { registerRoutes } from './server/routes.js';

// For Vercel deployment 
export const app = express();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set port for local development
const port = process.env.PORT || 5000;

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
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

(async () => {
  const server = await registerRoutes(app);

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

  // Serve the static files from the client directory
  app.use(express.static(path.join(__dirname, 'client')));
  
  // Serve the simple HTML version
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'simple-index.html'));
  });

  // Catch-all route for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'simple-index.html'));
  });

  // For Vercel, we need to check if we're in production
  if (process.env.VERCEL) {
    // In Vercel, no need to explicitly start the server
    console.log("Running on Vercel - no need to start server explicitly");
    // Export for serverless function
    module.exports = app;
  } else {
    // When running locally, listen on port 5000
    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      console.log(`Server running on port ${port}`);
    });
  }
})();