# Project structure (modules)

## Top level

```text
src/
├── app/           # router, Redux store
├── shared/        # config, i18n, lib, site-chrome, ui, utils
├── layouts/       # PublicLayout, AuthLayout, AppShellLayout
└── modules/
    ├── public/    # marketing site
    ├── auth/      # login, signup
    ├── member/    # photographer app (/admin/* user routes)
    └── admin/     # staff app (/admin/* admin routes)
```

## Inside each module

| Folder | Purpose |
|--------|---------|
| `pages/` | Route files only — router `lazy()` imports here |
| `views/` | Full screens (former `*Content.jsx`) |
| `components/` | Sections, modals, tables (by feature subfolder) |
| `hooks/` | Module-specific hooks |
| `data/` | Static data, assets maps, fixtures |

**Flow:** URL → `pages/X.jsx` (SEO) → `views/XContent` → `components/...`

## Router imports

- `@/modules/public/pages/...`
- `@/modules/auth/pages/...`
- `@/modules/member/pages/...`
- `@/modules/admin/pages/...`

## Cross-module imports

Use `@/modules/<module>/...` or `@/shared/...` — avoid deep relative paths across modules.

## Public module (main additions)

Shared marketing sections live in `modules/public/views/` (e.g. `ActiveCompetitions`, `HowItWorks`, `CommunityWork`, `TopPhotographers`, `GalleryDetailView`). Gallery detail routes use one view with variants (`single`, `six`, `sixBlue`, `twelve`).

## Scripts

- `scripts/migrate-to-modules.js` — one-time structure move
- `scripts/fix-module-imports.js` — repair relative imports after moves
- `scripts/normalize-module-data-hooks.js` — shorten data/hook filenames
