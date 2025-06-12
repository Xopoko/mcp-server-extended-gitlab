# MCP Server TypeScript Template

A minimal, **test-driven** starter kit for building [Model-Context-Protocol](https://github.com/modelcontextprotocol/) (MCP) servers in TypeScript.

| 🔖 Version | ![npm](https://img.shields.io/badge/template-v1.0.0-blue) |
|-----------|-----------------------------------------------------------|
| 🛠 Build  | `npm run build` |
| 🧪 Tests  | `npm test` |
| 📄 License| MIT |

---

## ✨ Features

* **TypeScript 4+** with strict compiler settings.
* **Express 5** HTTP server scaffold.
* **TDD by default** – Jest + ts-jest pre-configured, first green tests included.
* **Hot-reload** development via `nodemon` + `ts-node`.
* **Local SDK link** – depends on the MCP TypeScript SDK through:
  ```json
  "dependencies": {
    "@modelcontextprotocol/sdk": "file:../typescript-sdk"
  }
  ```
  Replace with the published package name/version when appropriate.
* Example **/health** and **/tool/hello** routes (with tests) demonstrate how to extend.

---

## 🚀 Quick Start

```bash
# Clone or copy the template directory
$ cd /a0/work_dir
$ cp -r mcp-server-typescript-template my-mcp-server && cd my-mcp-server

# Install dependencies
$ npm install

# Run the test suite (should be green)
$ npm test

# Start dev server with hot-reload
$ npm run dev
# → http://localhost:3000/health  ⇒  {"status":"ok"}
```

---

## 📂 Project Structure

```
├── src
│   ├── bootstrapServer.ts   # createApp() – Express factory
│   ├── server.ts            # production entry (npm start)
│   └── tools                # ← add your tool handlers here (optional)
├── tests
│   ├── health.test.ts       # /health integration test
│   └── hello.test.ts        # /tool/hello example test
├── dist                     # compiled JS (npm run build)
├── jest.config.js           # Jest/ts-jest settings
├── tsconfig.json            # TypeScript compiler options
└── package.json             # scripts & deps
```

---

## 🧪 TDD Workflow

1. **Red** – write a failing test in `tests/`.
2. **Green** – implement the minimal code in `src/` to pass it.
3. **Refactor** – clean up & commit.

Example (already implemented):
```ts
// tests/hello.test.ts
request(app)
  .post('/tool/hello')
  .send({ name: 'Alice' })
  .expect(200, { greeting: 'Hello, Alice!' });
```

---

## 🛠 Scripts

| Command            | Purpose                                   |
|--------------------|-------------------------------------------|
| `npm test`         | Run Jest test suite                       |
| `npm run dev`      | Start server with hot-reload              |
| `npm run build`    | Compile TypeScript → `dist/`              |
| `npm start`        | Run compiled server from `dist/`          |

---

## 🔌 Extending with Tools

1. Define a new route inside `createApp()` **or** mount a router under `/tool/*`.
2. Optionally leverage the MCP SDK helpers (`ToolDefinition`, etc.).
3. Add a matching test case.

```ts
// src/tools/myTool.ts (example)
  export function registerMyTool(app: express.Express) {
    app.post('/tool/myTool', (req, res) => {
      // tool logic …
    });
  }
```

## GitLab Routes

The server exposes a subset of GitLab REST API endpoints:

- `GET /projects/:id/merge_requests`
- `GET /projects/:id/merge_requests/:iid/discussions`
- `GET /projects/:id/files/<path>?ref=<branch>`
- `GET /projects/:id/branches`
- `GET /projects/:id/commits`

---

## 🏗 Building & Deployment

```bash
npm run build          # compiles to ./dist
node dist/server.js    # or npm start
```

A simple Dockerfile can be added if containerisation is required.

---

## 🤝 Contributing

Issues and PRs are welcome! Please adhere to the existing coding style and include tests for new features.

---

## 📜 License

This template is released under the **MIT License**.
