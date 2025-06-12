import http from 'http';
import { createApp } from '../src/createApp';
import nock from 'nock';

jest.setTimeout(30000);

describe('SSE transport', () => {
  beforeAll(() => {
    // Ensure local connections bypass proxy settings used in CI
    process.env.http_proxy = '';
    process.env.HTTP_PROXY = '';
    nock.enableNetConnect();
  });

  afterAll(() => {
    nock.cleanAll();
  });
  it('exposes SSE endpoint and message delivery', async () => {
    const app = createApp();
    const server: http.Server = await new Promise((resolve) => {
      const s = app.listen(() => resolve(s));
    });

    const { port } = server.address() as any;

    await new Promise<void>((resolve, reject) => {
      const req = http.request({
        hostname: '127.0.0.1',
        port,
        path: '/sse',
        method: 'GET',
        headers: { Accept: 'text/event-stream' },
      });

      let finished = false;
      const cleanup = (err?: Error) => {
        if (finished) return;
        finished = true;
        req.destroy();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };

      req.on('response', (res) => {
        try {
          expect(res.statusCode).toBe(200);
          expect(res.headers['content-type']).toContain('text/event-stream');
        } catch (e) {
          cleanup(e as Error);
          return;
        }

        let buf = '';
        res.on('data', (chunk) => {
          buf += chunk.toString();
          if (buf.includes('\n\n')) {
            const match = buf.match(/data: \/messages\/(.*)\n/);
            if (match) {
              const session = match[1];
              const post = http.request(
                {
                  hostname: '127.0.0.1',
                  port,
                  path: `/messages/${session}`,
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                },
                () => {
                  /* noop */
                },
              );
              post.on('error', () => {});
              post.end(JSON.stringify({ hello: 'world' }));
            }
          }

          if (buf.includes('hello')) {
            cleanup();
          }
        });
      });

      req.on('error', cleanup);
      req.end();
    });

    await new Promise((resolve) => server.close(() => resolve(null)));
  });

  it('keeps the connection alive', async () => {
    const app = createApp();
    const server: http.Server = await new Promise((resolve) => {
      const s = app.listen(() => resolve(s));
    });

    const { port } = server.address() as any;

    await new Promise<void>((resolve, reject) => {
      let finished = false;
      const cleanup = (err?: Error) => {
        if (finished) return;
        finished = true;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };

      http
        .get({
          hostname: '127.0.0.1',
          port,
          path: '/sse',
          headers: { Accept: 'text/event-stream' },
        })
        .on('response', (res) => {
          try {
            expect(res.headers.connection).toBe('keep-alive');
            res.destroy();
            cleanup();
          } catch (e) {
            cleanup(e as Error);
          }
        })
        .on('error', cleanup);
    });

    await new Promise((resolve) => server.close(() => resolve(null)));
  });
});
