# MCP Server Extended GitLab

A small server exposing selected GitLab REST API endpoints as tools for the [Model-Context-Protocol](https://github.com/modelcontextprotocol/). It is built with TypeScript and tested with Jest.

| 🔖 Version | ![npm](https://img.shields.io/badge/project-v1.0.0-blue) |
|-----------|-----------------------------------------------|
| 🛠 Build  | `npm run build` |
| 🧪 Tests  | `npm test` |
| 📄 License| MIT |

---

## ✨ Features

* **TypeScript 5** with strict compiler options.
* **Express 5** server scaffold.
* **GitLab integration** for merge requests, branches, commits, discussions, issues and file content.
* **TDD-first** workflow – Jest + ts-jest preconfigured.
* **Hot reload** in development via `nodemon`.
* Built on the mcp-framework for tools and transports.
* **Server-Sent Events** transport for streaming MCP responses.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start dev server with hot reload
npm run dev
# -> http://localhost:3000/health  => {"status":"ok"}
```

### Environment Variables

Set the following variables to connect to your GitLab instance:

```bash
GITLAB_BASE_URL=https://gitlab.example.com/api/v4
GITLAB_TOKEN=your-private-token
```

### Example MCP configuration

Add this server to your MCP client configuration so tools are discoverable in
**Claude Desktop** and **Cursor**:

```json
{
  "servers": [
    {
      "name": "gitlab-tools",
      "url": "http://localhost:3000"
    }
  ]
}
```

Save the snippet as `claude-desktop.mcp.json` or `cursor.mcp.json` in each
app's configuration directory.

### Running this server via npx

You can also launch **MCP Server Extended GitLab** on demand using an MCP server
entry like the following:

```json
{
  "gitlab-mcp": {
    "command": "npx",
    "args": [
      "-y",
      "mcp-server-extended-gitlab"
    ],
    "env": {
      "GITLAB_BASE_URL": "https://gitlab.example.com/api/v4",
      "GITLAB_TOKEN": "your-private-token"
    }
  }
}
```

### Running via STDIO

You can run the server without any network transport using the STDIO mode.

```bash
npm run build
npm run start:stdio
```

This starts an MCP server that communicates through standard input/output.

### Running via MCP Framework SSE

The server can also be started using the MCP Framework with its built-in SSE
transport.

```bash
npm run build
npm run start:mcp
```

This launches the `mcpServer.ts` entry which uses `MCPServer` to manage the SSE
connection lifecycle.


---

## 📂 Project Structure

```
├── src
│   ├── createApp.ts         # Express factory with GitLab routes
│   ├── bootstrapServer.ts   # initializes and bootstraps the server
│   └── server.ts            # production entry (npm start)
├── tests                    # Jest test suites
├── dist                     # compiled JS output
├── jest.config.js           # Jest/ts-jest settings
├── tsconfig.json            # TypeScript compiler options
└── package.json             # scripts & deps
```

---

## Available GitLab Routes

The server exposes the following endpoints:

- `GET /projects/:id`
- `GET /projects/:id/merge_requests`
- `GET /projects/:id/merge_requests/:iid`
- `GET /projects/:id/merge_requests/:iid/discussions`
- `POST /projects/:id/merge_requests`
- `PUT /projects/:id/merge_requests/:iid/merge`
- `PUT /projects/:id/merge_requests/:iid/close`
- `PUT /projects/:id/merge_requests/:iid/reopen`
- `PUT /projects/:id/merge_requests/:iid/rebase`
- `GET /projects/:id/merge_requests/:iid/changes`
- `GET /projects/:id/merge_requests/:iid/discussions/:discussion_id`
- `POST /projects/:id/merge_requests/:iid/discussions/:discussion_id/notes`
- `POST /projects/:id/merge_requests/:iid/discussions`
- `POST /projects/:id/merge_requests/:iid/discussions/multiline`
- `DELETE /projects/:id/merge_requests/:iid/discussions/:discussion_id`
- `PUT /projects/:id/merge_requests/:iid/discussions/:discussion_id`
- `PUT /projects/:id/merge_requests/:iid/discussions/:discussion_id/resolve`
- `GET /projects/:id/merge_requests/:iid/notes/:note_id`
- `POST /projects/:id/merge_requests/:iid/notes`
- `PUT /projects/:id/merge_requests/:iid/notes/:note_id`
- `DELETE /projects/:id/merge_requests/:iid/notes/:note_id`
- `PUT /projects/:id/merge_requests/:iid` (set labels)
- `GET /projects/:id/files/<path>?ref=<branch>`
- `GET /projects/:id/branches`
- `GET /projects/:id/commits`
- `GET /projects/:id/pipelines`
- `GET /projects/:id/pipelines/:pipeline_id`
- `GET /projects/:id/issues`
- `POST /projects/:id/issues`

Additionally `/tool/hello` demonstrates how to add custom tools.

---

## 🏗 Building & Deployment

```bash
npm run build      # run "tsc && mcp-build" to compile and prepare ./dist
npm start          # run compiled server
```

---

## 🤝 Contributing

Issues and PRs are welcome! Please follow the existing coding style and include tests for new functionality.

---

## 📜 License

Released under the **MIT License**.
