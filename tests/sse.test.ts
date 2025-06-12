import http from 'http';
import { createApp } from '../src/createApp';

jest.setTimeout(30000);

describe('SSE transport', () => {
  it('exposes SSE endpoint and message delivery', (done) => {
    const app = createApp();
    const server = app.listen(() => {
      const { port } = server.address() as any;
      const req = http.request({
        hostname: '127.0.0.1',
        port,
        path: '/sse',
        method: 'GET',
        headers: { Accept: 'text/event-stream' },
      });
      req.on('response', (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toContain('text/event-stream');
        let buf = '';
        res.on('data', (chunk) => {
          buf += chunk.toString();
          if (buf.includes('\n\n')) {
            const match = buf.match(/data: \/messages\/(.*)\n/);
            if (match) {
              const session = match[1];
              // send message
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
            req.destroy();
            server.close(() => done());
          }
        });
      });
      req.end();
    });
  });

  it('keeps the connection alive', (done) => {
    const app = createApp();
    const server = app.listen(() => {
      const { port } = server.address() as any;
      http
        .get({
          hostname: '127.0.0.1',
          port,
          path: '/sse',
          headers: { Accept: 'text/event-stream' },
        })
        .on('response', (res) => {
          expect(res.headers.connection).toBe('keep-alive');
          res.destroy();
          server.close(() => done());
        });
    });
  });
});
