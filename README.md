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
npm install

npm test

npm run build

npm start
# -> http://localhost:3000/health  => {"status":"ok"}
```

### Environment Variables

Set the following variables to connect to your GitLab instance:

```bash
GITLAB_BASE_URL=https://gitlab.example.com/api/v4
GITLAB_TOKEN=your-private-token
```



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

| Method | Endpoint |
| ------ | -------- |
| GET | `/projects` |
| GET | `/projects/search?q=<query>` |
| GET | `/projects/:id` |
| GET | `/projects/:id/merge_requests` |
| GET | `/projects/:id/merge_requests/:iid` |
| GET | `/projects/:id/merge_requests/:iid/discussions` |
| POST | `/projects/:id/merge_requests` |
| PUT | `/projects/:id/merge_requests/:iid/merge` |
| PUT | `/projects/:id/merge_requests/:iid/close` |
| PUT | `/projects/:id/merge_requests/:iid/reopen` |
| PUT | `/projects/:id/merge_requests/:iid/rebase` |
| GET | `/projects/:id/merge_requests/:iid/changes` |
| GET | `/projects/:id/merge_requests/:iid/discussions/:discussion_id` |
| POST | `/projects/:id/merge_requests/:iid/discussions/:discussion_id/notes` |
| POST | `/projects/:id/merge_requests/:iid/discussions` |
| DELETE | `/projects/:id/merge_requests/:iid/discussions/:discussion_id` |
| PUT | `/projects/:id/merge_requests/:iid/discussions/:discussion_id` |
| PUT | `/projects/:id/merge_requests/:iid/discussions/:discussion_id/resolve` |
| GET | `/projects/:id/merge_requests/:iid/notes/:note_id` |
| POST | `/projects/:id/merge_requests/:iid/notes` |
| PUT | `/projects/:id/merge_requests/:iid/notes/:note_id` |
| DELETE | `/projects/:id/merge_requests/:iid/notes/:note_id` |
| PUT | `/projects/:id/merge_requests/:iid` |
| GET | `/projects/:id/files/<path>?ref=<branch>` |
| POST | `/projects/:id/files/<path>` |
| PUT | `/projects/:id/files/<path>` |
| DELETE | `/projects/:id/files/<path>?branch=<branch>&commit_message=<msg>` |
| GET | `/projects/:id/files?path=<path>&ref=<branch>` |
| GET | `/projects/:id/branches` |
| POST | `/projects/:id/branches` |
| GET | `/projects/:id/branches/:branch` |
| DELETE | `/projects/:id/branches/:branch` |
| GET | `/projects/:id/commits` |
| GET | `/projects/:id/pipelines` |
| GET | `/projects/:id/pipelines/:pipeline_id` |
| POST | `/projects/:id/pipelines` |
| POST | `/projects/:id/pipelines/:pipeline_id/cancel` |
| POST | `/projects/:id/pipelines/:pipeline_id/retry` |
| DELETE | `/projects/:id/pipelines/:pipeline_id` |
| GET | `/projects/:id/pipelines/:pipeline_id/jobs` |
| GET | `/projects/:id/pipelines/:pipeline_id/artifacts` |
| GET | `/projects/:id/releases` |
| GET | `/projects/:id/releases/:tag` |
| POST | `/projects/:id/releases` |
| PUT | `/projects/:id/releases/:tag` |
| DELETE | `/projects/:id/releases/:tag` |
| GET | `/projects/:id/tags` |
| GET | `/projects/:id/tags/:tag` |
| POST | `/projects/:id/tags` |
| DELETE | `/projects/:id/tags/:tag` |
| GET | `/projects/:id/issues` |
| POST | `/projects/:id/issues` |
| GET | `/projects/:id/issues/:issue_id` |
| PUT | `/projects/:id/issues/:issue_id` |
| PUT | `/projects/:id/issues/:issue_id/close` |
| PUT | `/projects/:id/issues/:issue_id/reopen` |
| POST | `/groups` |
| GET | `/groups/:id` |
| DELETE | `/groups/:id` |
| GET | `/groups/:id/members` |

---

## 🏗 Building & Deployment

```bash
npm run build      # run "tsc && mcp-build" to compile and prepare ./dist
npm start          # run compiled server
```

## MCP Client Integrations

This server can be used by any Model‑Context‑Protocol desktop application.

### Running the server

Start the server using the SSE transport so that clients can connect:

```bash
npm run start:mcp
```

It listens on port `3000` (or `PORT`). Ensure `GITLAB_BASE_URL` and `GITLAB_TOKEN` are configured.

### Claude Desktop

1. Launch the server as shown above.
2. Edit your Claude Desktop configuration file:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`
3. Add an entry under `"mcpServers"`:

```json
{
  "mcpServers": {
    "gitlab-server": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server-extended-gitlab/dist/mcpServer.js"]
    }
  }
}
```

After publishing the project to npm you can instead use:

```json
{
  "mcpServers": {
    "gitlab-server": {
      "command": "npx",
      "args": ["mcp-server-extended-gitlab"]
    }
  }
}
```

### Cursor

1. Run `npm run start:mcp`.
2. Create or edit `mcp_servers.json` in your Cursor data directory:
   - **macOS:** `~/Library/Application Support/Cursor/mcp_servers.json`
   - **Windows:** `%APPDATA%/Cursor/mcp_servers.json`
3. Add:

```json
{
  "gitlab-server": {
    "type": "sse",
    "url": "http://localhost:3000"
  }
}
```

Restart Cursor to load the configuration.

### Other MCP clients

Most MCP-capable applications follow the same pattern: point them to `http://localhost:3000` (or your chosen address) and specify the transport type (SSE or STDIO) according to your client's documentation.

---

## 🤝 Contributing

Issues and PRs are welcome! Please follow the existing coding style and include tests for new functionality.

---

## 📜 License

Released under the **MIT License**.
