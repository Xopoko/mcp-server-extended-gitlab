import { jest } from '@jest/globals';
import path from 'path';

jest.mock('mcp-framework', () => {
  return {
    MCPServer: class {
      basePath: string;
      constructor(config: any) {
        this.basePath = config.basePath;
      }
    }
  };
}, { virtual: true });

describe('createMcpServer basePath', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('uses file path as basePath', async () => {
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer();
    const expected = path.join(__dirname, '../src/mcpServer.ts');
    expect(server.basePath).toBe(expected);
  });
});
