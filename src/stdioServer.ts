import { McpServer } from '@modelcontextprotocol/sdk/dist/cjs/server/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/dist/cjs/server/stdio';
import { z } from 'zod';

const server = new McpServer({
  name: 'mcp-server-extended-gitlab',
  version: '1.0.0',
});

server.tool(
  'hello',
  'Greets the provided name',
  { name: z.string().describe('Name to greet') },
  async ({ name }) => ({
    content: [
      { type: 'text', text: `Hello, ${name}!` },
    ],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  process.on('SIGINT', () => shutdown(transport));
  process.on('SIGTERM', () => shutdown(transport));
  await server.connect(transport);
  console.log('STDIO server started');
}

async function shutdown(transport: StdioServerTransport) {
  console.error('Shutting down...');
  await transport.close();
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to start STDIO server:', err);
  process.exit(1);
});
