import http from 'http';
import { createMcpServer } from '../src/mcpServer';

describe('MCPServer SSE transport', () => {
  it.skip('emits endpoint event and accepts messages', (done) => {
    createMcpServer({ port: 0 }).then(async (server) => {
      await server.start();
      const transport = (server as any).transport;
      const actualPort = (transport as any)._server.address().port;

      const req = http.request({
        hostname: '127.0.0.1',
        port: actualPort,
        path: '/sse',
        method: 'GET',
        headers: { Accept: 'text/event-stream' },
      });

      req.on('response', (res) => {
        let buf = '';
        res.on('data', (chunk) => {
          buf += chunk.toString();
          const match = buf.match(/event: endpoint\ndata: (.+)\n\n/);
          if (match) {
            const endpoint = match[1];
            const post = http.request(
              {
                hostname: '127.0.0.1',
                port: actualPort,
                path: endpoint,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              },
              (postRes) => {
                expect(postRes.statusCode).toBe(202);
                req.destroy();
                server.stop().then(() => done());
              },
            );
            post.on('error', () => {});
            post.end(JSON.stringify({ id: 1, method: 'listTools' }));
          }
        });
      });

      req.end();
    });
  });
});
