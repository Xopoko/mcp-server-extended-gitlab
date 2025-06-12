#!/usr/bin/env node
import { createMcpServer, parseArgs } from './mcpServer';

export { createMcpServer, parseArgs } from './mcpServer';

export async function runCli(argv: string[] = process.argv.slice(2)) {
  const options = parseArgs(argv);
  try {
    const server = await createMcpServer(options);
    await server.start();
  } catch (err) {
    console.error('Failed to create or start MCP server', err);
    process.exit(1);
  }
}

if (require.main === module) {
  void runCli();
}
