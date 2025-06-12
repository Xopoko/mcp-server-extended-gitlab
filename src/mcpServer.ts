// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

export async function createMcpServer({ port }: { port?: number } = {}) {
  const { createRequire } = require('module');
  const req = createRequire(__dirname);
  // require direct path to bypass ESM loader in tests
  const path = require('path');
  const frameworkPath = path.join(__dirname, '..', 'node_modules', 'mcp-framework', 'dist', 'index.js');
  const { MCPServer } = req(frameworkPath);
  const server = new MCPServer({
    name: pkg.name,
    version: pkg.version,
    basePath: './dist',
    transport: {
      type: 'sse',
      options: {
        port: port ?? (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000),
      },
    },
  });

  return server;
}

if (require.main === module) {
  createMcpServer().then((server) => {
    server.start().catch((err: unknown) => {
      console.error('Failed to start MCP server', err);
      process.exit(1);
    });
  });
}
