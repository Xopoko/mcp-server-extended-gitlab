import { parseArgs } from '../src/mcpServer';

describe('parseArgs', () => {
  it('parses includes and excludes', () => {
    const result = parseArgs(['--includes=foo,bar', '--excludes=baz']);
    expect(result.includes).toEqual(['foo', 'bar']);
    expect(result.excludes).toEqual(['baz']);
  });

  it('parses port and config path', () => {
    const result = parseArgs(['--port=4000', '--config=mcp.json']);
    expect(result.port).toBe(4000);
    expect(result.configPath).toBe('mcp.json');
  });
});
