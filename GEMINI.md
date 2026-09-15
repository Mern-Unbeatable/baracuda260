# Antigravity Agent Rules

## Excluded Directories

Do NOT read, search, index, or modify files in the following folders:
- `dist/` (compiled build outputs, minified JS/CSS chunks)
- `node_modules/` (third-party package dependencies)
- `luisfernandeslu_frontend/` (reference / legacy repository)
- `.git/` (internal version control files)
- `coverage/` (test reports and coverage artifacts)
- Temporary files, build caches, and logs (`*.log`, `.cache/`, etc.)

## Tool Usage Directives

1. **Grep and Pattern Searches (`grep_search`)**:
   - Scope searches strictly to `src/` (e.g. `SearchPath: "<workspace>/src"`), `public/`, or specific project configuration files at the root.
   - Do NOT run searches across the root directory that include `dist/`, `node_modules/`, or `luisfernandeslu_frontend/`.

2. **File Name Searches (`find_by_name`)**:
   - Scope searches to `src/` or explicitly exclude `["**/dist/**", "**/node_modules/**", "**/luisfernandeslu_frontend/**", "**/.git/**"]`.

3. **Reading Files (`view_file`)**:
   - Do NOT open or inspect minified bundles in `dist/` or external packages in `node_modules/`.
   - Inspect the actual source code under `src/`.

4. **Modifications (`replace_file_content`, `write_to_file`)**:
   - All code changes must be applied strictly to source files under `src/`.
   - Never directly edit files inside `dist/`. If distribution assets need to be updated, rebuild using `npm run build`.
