import { jest } from '@jest/globals';

jest.mock('mcp-framework', () => {
  class MockMCPServer {
    toolsMap = new Map();
    async start() {
      this.toolsMap = new Map([
        ['hello', { name: 'hello' }],
        ['foo', { name: 'foo' }],
        ['bar', { name: 'bar' }],
      ]);
    }
  }
  return { MCPServer: MockMCPServer };
}, { virtual: true });

describe('createMcpServer tool filtering', () => {
  afterEach(() => {
    jest.resetModules();
    delete process.env.TOOLS_INCLUDE;
    delete process.env.TOOLS_EXCLUDE;
  });

  it('keeps only included tools', async () => {
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer({ includes: ['hello', 'bar'] });
    await server.start();
    expect([...server.toolsMap.keys()]).toEqual(['hello', 'bar']);
  });

  it('excludes tools via env variable', async () => {
    process.env.TOOLS_EXCLUDE = 'foo';
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer();
    await server.start();
    expect([...server.toolsMap.keys()]).toEqual(['hello', 'bar']);
  });

  it('includes list overrides excludes', async () => {
    process.env.TOOLS_INCLUDE = 'foo';
    process.env.TOOLS_EXCLUDE = 'foo';
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer();
    await server.start();
    expect([...server.toolsMap.keys()]).toEqual(['foo']);
  });

  it('reads includes from config file', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    const configPath = path.join(__dirname, 'mcp.config.json');
    await fs.writeFile(configPath, JSON.stringify({ includes: ['foo'] }));
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer({ configPath });
    await server.start();
    await fs.unlink(configPath);
    expect([...server.toolsMap.keys()]).toEqual(['foo']);
  });

  it('arguments override config file', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    const configPath = path.join(__dirname, 'mcp.config.json');
    await fs.writeFile(configPath, JSON.stringify({ includes: ['foo'] }));
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer({ includes: ['bar'], configPath });
    await server.start();
    await fs.unlink(configPath);
    expect([...server.toolsMap.keys()]).toEqual(['bar']);
  });

  it('loads all tools by default', async () => {
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer();
    await server.start();
    expect([...server.toolsMap.keys()]).toEqual(['hello', 'foo', 'bar']);
  });
});
