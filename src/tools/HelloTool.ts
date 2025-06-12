import { MCPTool } from 'mcp-framework';
import { z } from 'zod';

const HelloToolSchema = z.object({
  name: z.string().describe('Name to greet'),
});

export default class HelloTool extends MCPTool {
  name = 'hello';
  description = 'Greets the provided name';
  schema = HelloToolSchema;

  async execute(input: { name: string }) {
    return `Hello, ${input.name}!`;
  }
}
