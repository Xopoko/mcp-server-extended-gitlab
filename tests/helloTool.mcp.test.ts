import { jest } from '@jest/globals';

jest.mock('mcp-framework', () => {
  class MCPTool<TInput extends Record<string, unknown> = any> {
    // subclasses override these
    name!: string;
    description!: string;
    protected schema!: { [k in keyof TInput]: { type: any; description: string } };
    async execute(_input: TInput): Promise<unknown> {
      return undefined;
    }
    async toolCall(req: { params: { name: string; arguments?: Record<string, unknown> } }) {
      const result = await this.execute(req.params.arguments as TInput);
      return { content: [{ type: 'text', text: String(result) }] };
    }
    get toolDefinition() {
      return { name: this.name, description: this.description, inputSchema: { type: 'object' } };
    }
  }

  const HelloTool = require('../src/tools/HelloTool').default;

  class MockMCPServer {
    private tools = new Map<string, any>();
    private started = false;
    async start() {
      this.started = true;
      const tool = new HelloTool();
      this.tools.set(tool.name, tool);
    }
    async callTool(name: string, args: Record<string, unknown>) {
      if (!this.started) {
        throw new Error('Server not started');
      }
      const tool = this.tools.get(name);
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }
      return tool.toolCall({ params: { name, arguments: args } });
    }
  }

  return { MCPTool, MCPServer: MockMCPServer };
}, { virtual: true });

describe('MCPServer hello tool', () => {
  it('returns greeting via MCPServer', async () => {
    const { createMcpServer } = await import('../src/mcpServer');
    const server: any = await createMcpServer();
    await expect(server.callTool('hello', { name: 'Alice' })).rejects.toThrow();
    await server.start();
    const response = await server.callTool('hello', { name: 'Alice' });
    expect(response.content).toEqual([{ type: 'text', text: 'Hello, Alice!' }]);
  });
});
