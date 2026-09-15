---
trigger: always_on
---

# Excluded Directories Rule

Do NOT read, search, index, or inspect the following build, dependency, or non-source directories:
- `dist/`
- `node_modules/`
- `luisfernandeslu_frontend/`
- `.git/`
- `coverage/`

Always direct all file reading, searches, code navigation, and edits to the source code located in `src/`.
Never edit build artifacts in `dist/` directly.
