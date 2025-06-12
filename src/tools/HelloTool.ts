import { MCPTool } from 'mcp-framework';
import { z } from 'zod';

export default class HelloTool extends MCPTool<{ name: string }> {
  name = 'hello';
  description = 'Greets the provided name';
  protected schema = {
    name: { type: z.string(), description: 'Name to greet' },
  } as const;

  protected async execute(input: { name: string }) {
    return { content: [{ type: 'text', text: `Hello, ${input.name}!` }] };
  }
}
