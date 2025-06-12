import { readFile } from 'fs/promises';

export function parseArgs(argv: string[]) {
  const options: {
    port?: number;
    includes?: string[];
    excludes?: string[];
    configPath?: string;
  } = {};
  argv.forEach((arg) => {
    if (arg.startsWith('--port=')) {
      const val = Number(arg.slice(7));
      if (!Number.isNaN(val)) options.port = val;
    } else if (arg.startsWith('--includes=')) {
      options.includes = arg
        .slice(11)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    } else if (arg.startsWith('--excludes=')) {
      options.excludes = arg
        .slice(11)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    } else if (arg.startsWith('--config=')) {
      options.configPath = arg.slice(9);
    }
  });
  return options;
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

export async function createMcpServer({
  port,
  includes,
  excludes,
  configPath,
}: {
  port?: number;
  includes?: string[];
  excludes?: string[];
  configPath?: string;
} = {}) {
  let MCPServer: any;
  try {
    ({ MCPServer } = require('mcp-framework'));
  } catch {
    const importer = new Function('p', 'return import(p)');
    ({ MCPServer } = await importer('mcp-framework'));
  }
  const envPort = Number(process.env.PORT);
  const server = new MCPServer({
    name: pkg.name,
    version: pkg.version,
    basePath: __dirname,
    transport: {
      type: 'sse',
      options: {
        port: port ?? (!Number.isNaN(envPort) ? envPort : 3000),
      },
    },
  });

  let fileConfig: { includes?: string[]; excludes?: string[] } = {};
  if (configPath) {
    try {
      const data = await readFile(configPath, 'utf8');
      fileConfig = JSON.parse(data);
    } catch (err) {
      throw new Error(`Failed to read config file ${configPath}: ${String(err)}`);
    }
  }

  const parseList = (value?: string | string[]): string[] | undefined => {
    if (!value) return undefined;
    const array = Array.isArray(value) ? value : value.split(',');
    return array.map((v) => v.trim()).filter(Boolean);
  };

  const includesList =
    includes ?? parseList(fileConfig.includes) ?? parseList(process.env.TOOLS_INCLUDE);
  const excludesList =
    excludes ?? parseList(fileConfig.excludes) ?? parseList(process.env.TOOLS_EXCLUDE);

  if (typeof server.start === 'function') {
    const originalStart = server.start.bind(server);
    server.start = async () => {
      await originalStart();
      const map: Map<string, unknown> =
        (server as any).toolsMap || (server as any).tools;
      if (!map) {
        return;
      }
      const entries = Array.from(map.entries()) as [string, unknown][];
      if (includesList?.length) {
        const filtered = new Map(
          entries.filter(([name]) => includesList.includes(name)),
        );
        (server as any).toolsMap = filtered;
        if ((server as any).tools) (server as any).tools = filtered;
      } else if (excludesList?.length) {
        const filtered = new Map(
          entries.filter(([name]) => !excludesList.includes(name)),
        );
        (server as any).toolsMap = filtered;
        if ((server as any).tools) (server as any).tools = filtered;
      }
    };
  }

  return server;
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  createMcpServer(options).then((server) => {
    server.start().catch((err: unknown) => {
      console.error('Failed to start MCP server', err);
      process.exit(1);
    });
  });
}
