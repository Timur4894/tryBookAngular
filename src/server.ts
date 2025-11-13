import { AngularAppEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  const angularAppEngine = new AngularAppEngine();

  server.use(express.json());

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get(/.*/, async (req, res, next) => {
    try {
      const request = new Request(req.url, {
        method: req.method,
        headers: req.headers as HeadersInit,
      });

      const response = await angularAppEngine.handle(request);

      if (response) {
        // Copy response headers
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });

        // Set status code
        res.status(response.status);

        // Send response body
        const body = await response.text();
        res.send(body);
      } else {
        next();
      }
    } catch (err: unknown) {
      next(err);
    }
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

