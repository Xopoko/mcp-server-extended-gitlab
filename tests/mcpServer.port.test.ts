import { jest } from '@jest/globals';

jest.mock(
  'mcp-framework',
  () => {
    return {
      MCPServer: class {
        transportConfig: any;
        constructor(config: any) {
          this.transportConfig = config.transport;
        }
      }
    };
  },
  { virtual: true },
);

describe('createMcpServer port handling', () => {
  afterEach(() => {
    jest.resetModules();
    delete process.env.PORT;
  });

  it('uses env PORT when valid', async () => {
    process.env.PORT = '4321';
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer();
    expect(server.transportConfig.options.port).toBe(4321);
  });

  it('falls back to 3000 on invalid env PORT', async () => {
    process.env.PORT = 'abc';
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer();
    expect(server.transportConfig.options.port).toBe(3000);
  });

  it('prefers argument over env', async () => {
    process.env.PORT = '9000';
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer({ port: 1234 });
    expect(server.transportConfig.options.port).toBe(1234);
  });
});
