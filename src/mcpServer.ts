// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

export async function createMcpServer({ port }: { port?: number } = {}) {
  let MCPServer: any;
  try {
    ({ MCPServer } = require('mcp-framework'));
  } catch {
    const importer = new Function('p', 'return import(p)');
    ({ MCPServer } = await importer('mcp-framework'));
  }
  const envPort = Number(process.env.PORT);
  const server = new MCPServer({
    name: pkg.name,
    version: pkg.version,
    basePath: __dirname,
    transport: {
      type: 'sse',
      options: {
        port: port ?? (!Number.isNaN(envPort) ? envPort : 3000),
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
