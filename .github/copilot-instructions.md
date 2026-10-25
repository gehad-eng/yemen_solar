<!--
This file is generated to help AI coding agents be immediately productive in this repository.
It was created by an automated assistant after scanning the workspace; at the time of creation there
were no discoverable project files (README, package manifests, source tree) in the repository root.
If this repository later contains source files the sections below explain exactly what to look for and
how to behave when making changes.
-->

# Copilot / AI Assistant Instructions (concise)

Summary
- Repository scanned: no discoverable source files or agent docs were found at creation time.
- This guidance tells an AI what to look for, how to infer the architecture, and how to propose safe changes.

If you (the agent) find files later, follow this order of operations:
1. Look for language/platform manifests: `package.json`, `pyproject.toml`, `requirements.txt`, `setup.py`, `go.mod`, `Cargo.toml`.
2. Look for entry points: `src/`, `app/`, `cmd/`, `main.go`, `server.js`, `manage.py`, `Dockerfile`.
3. Look for CI and infra: `.github/workflows/`, `azure-pipelines.yml`, `.gitlab-ci.yml`, `Makefile`, `Dockerfile`, `k8s/`.
4. Look for tests: `tests/`, `spec/`, `__tests__`, `pytest.ini`, `jest.config.js`.

Big-picture analysis checklist (what to produce when code exists)
- Identify the primary runtime (Node/Python/Go/Rust). Use the presence of manifests to determine tooling.
- Find the service boundaries: directories named `api`, `worker`, `web`, `cli`, `internal`, or `services` typically map to components.
- Trace data flows by following the main entry point(s) (e.g., `server.js`, `app.py`, `cmd/*`) and note where external calls are made (DB, HTTP clients, message queues).
- Note any non-standard structure (for example, a single `scripts/` folder containing server code) and document it in the PR description.

Project-specific workflows and commands (how to discover and run)
- If `package.json` exists: use `npm ci` (CI) or `npm install` then `npm test` and `npm run build` where available.
- If `pyproject.toml` or `requirements.txt` exists: prefer creating a venv, `python -m venv .venv; .\.venv\Scripts\Activate.ps1` then `pip install -r requirements.txt` or `pip install .` and run `pytest` if present.
- If `go.mod` exists: use `go test ./...` and `go build ./...` from repo root.
- For Docker-based projects: prefer building images locally with `docker build -t repo-name .` when needed.

Guidance for code edits and PRs
- Always create a single, small, testable change. Add or update tests that exercise public behavior.
- If manifest files are present, run the project's test commands locally before opening a PR and report results in the PR body.
- If adding or changing build scripts, preserve existing cross-platform behavior. When in doubt, add PowerShell-friendly alternatives for Windows users.

Patterns and conventions to document when detected
- Node: check for `src/` and `dist/` split, presence of Babel/TypeScript (`tsconfig.json`) indicates compiled JS flow.
- Python: check for `src/` layout vs flat layout; prefer `src/` imports in tests when present.
- Go: `cmd/` for binaries and `internal/` for private packages. `pkg/` indicates exported libraries.
- APIs: controllers named `handlers`, `routes`, or `controllers` often map to the HTTP layer; services live under `service/` or `business/`.

Integration points and common external dependencies to detect
- Databases: look for `*.sql`, `migrations/`, or env variables like `DATABASE_URL`.
- Messaging: look for `rabbitmq`, `kafka`, `redis` clients, or folders named `queue`, `worker`.
- Cloud: presence of `azure-`, `aws-`, or `gcp-` config files, `terraform/`, or provider SDKs.

Behavior when repository is empty or missing docs (current state)
- Do not create large architectural changes without an explicit issue or maintainer instruction.
- When asked to add a feature, start by creating a small proposal PR that includes:
  - a one-paragraph summary of the change,
  - the exact files to be modified or added,
  - how you validated the change (commands/run output), and
  - any follow-ups (testing, CI additions).
- Create a minimal `README.md` and simple `CONTRIBUTING.md` only when requested by maintainers.

Examples of exact file checks (run these programmatically)
- If `package.json` exists, parse `scripts` and run `npm run <script>` that corresponds to `test` or `build`.
- If `pyproject.toml` exists, inspect `[tool.poetry.scripts]` or `entry_points` to find CLI entrypoints.
- If `.github/workflows/` contains workflows, read them to learn CI commands and supported matrix configurations.

If you modify this file
- Merge intelligently: preserve any maintainer-written text already present here and append your additions under a dated subsection.

Contact / feedback
- Repository currently had no discoverable content at the time of generation. Please commit or point to key files (README, language manifest, CI) and I will regenerate a more specific `copilot-instructions.md` with concrete examples from the code.

-- End
