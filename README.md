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
* **GitLab integration** for merge requests, branches, commits, discussions and file content.
* **TDD-first** workflow – Jest + ts-jest preconfigured.
* **Hot reload** in development via `nodemon`.
* Uses the MCP TypeScript SDK via a local path dependency.

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

- `GET /projects/:id/merge_requests`
- `GET /projects/:id/merge_requests/:iid/discussions`
- `GET /projects/:id/files/<path>?ref=<branch>`
- `GET /projects/:id/branches`
- `GET /projects/:id/commits`

Additionally `/tool/hello` demonstrates how to add custom tools.

---

## 🏗 Building & Deployment

```bash
npm run build      # compile to ./dist
npm start          # run compiled server
```

---

## 🤝 Contributing

Issues and PRs are welcome! Please follow the existing coding style and include tests for new functionality.

---

## 📜 License

Released under the **MIT License**.
