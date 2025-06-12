#!/usr/bin/env node
import { createMcpServer, parseArgs } from './mcpServer';

export { createMcpServer, parseArgs } from './mcpServer';

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  createMcpServer(options).then((server) => {
    server.start().catch((err: unknown) => {
      console.error('Failed to start MCP server', err);
      process.exit(1);
    });
  });
}
