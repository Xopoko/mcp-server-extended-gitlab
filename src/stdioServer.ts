const importer = new Function('p', 'return import(p)');
(async () => {
  const { MCPServer } = await importer('mcp-framework');
  const server = new MCPServer({
    basePath: __filename,
    transport: { type: 'stdio' },
  });

  process.on('SIGINT', () => server.stop());
  process.on('SIGTERM', () => server.stop());

  await server.start();
})();
