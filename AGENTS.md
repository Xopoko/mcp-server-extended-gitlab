# AGENTS.md

Guidance for AI agents (and humans) who interact with this repository.

---

## 📂 Project Structure

* `/src`  – TypeScript source code for the MCP server.
  * `server.ts` – runtime entry point (`npm start`).
  * `bootstrapServer.ts` – **createApp()** factory; add new tool routes here or in sub-modules.
  * `stdioServer.ts` – start the server over STDIO (no HTTP/SSE).
  * `mcpServer.ts` – start the server with the MCP framework SSE transport.
* `/tests` – Jest test suites (**ts-jest**) for TDD.
* `/dist` – Compiled JavaScript output (`npm run build`).
* `README.md` – User-level documentation and GitLab API reference.
* `AGENTS.md` – This file (development & contribution guidance).

Feel free to add extra folders such as `/docs` or `/scripts` as the project grows.

---

## ⚙️ Environment Setup

1. **Node**: use Node.js 18 or later.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure GitLab access in `.env` or the shell:
   ```bash
   GITLAB_BASE_URL=https://gitlab.example.com/api/v4
   GITLAB_TOKEN=your-private-token
   ```
   These variables are required for both the server and test suites.

---

## 🧑‍💻 Coding Conventions

* **Language**: TypeScript ≥ 5, `strict` mode enabled. Use modern ES2021+ features.
* **Style**: Follow ESLint (Airbnb + Prettier) rules once configured. Run linters before commit.
* **Naming**: Descriptive, camelCase for variables/functions, PascalCase for types/classes.
* **Typing**: Prefer explicit types & generics. Avoid `any` unless unavoidable (document why).
* **Project Imports**: Use relative paths (`../`) or path aliases once configured.
* **Commit Messages**: Conventional Commits (`feat: …`, `fix: …`, `test: …`).

---

## 🧪 Testing Instructions

* **Framework**: [Jest](https://jestjs.io/) with `ts-jest` transformer.
* Write tests **first** (Red–Green–Refactor). Place them in `/tests` with suffix `*.test.ts`.

### Running

```bash
# All tests (watch disabled)
npm test

# Jest watch mode
npx jest --watch
```

Tests must pass (CI will block otherwise).

---

## 🔧 Useful npm Scripts

| Command            | Description                                        |
|--------------------|----------------------------------------------------|
| `npm test`         | Run full Jest suite                                |
| `npm run dev`      | Hot-reload server via nodemon                      |
| `npm run build`    | Compile TypeScript to `/dist`                      |
| `npm start`        | Execute compiled server (`dist/`)                  |
| `npm run start:stdio` | Launch the STDIO-based server                    |
| `npm run start:mcp`   | Launch the MCP framework SSE server              |

---

## 📝 Pull Request Guidelines

* **Scope**: Keep PRs focused. Separate refactors from functional changes.
* **Description**: Explain *why* + *how*. Reference issues if applicable.
* **Tests**: Add/adjust tests to cover new or changed behavior.
* **Lint & Format**: Ensure a clean run (`npm run lint` / `npm run format`) once configured.
* **Docs**: Update `README.md` / relevant docs when public API changes.

---

## 🤖 Agent-Specific Tips

* You can run shell commands in the repository folder – avoid destructive ops outside this directory.
* Always prefer **code-execution** over prompting the user to run commands.
* Validate success: run `npm test` after modifications.
* Follow TDD: create failing test → implement code → ensure tests green.
* Persist new files with full paths; do **not** leave placeholders.
* Use the `README.md` for examples of environment setup and available routes.

---

Happy hacking & prompt-engineering! 🚀
