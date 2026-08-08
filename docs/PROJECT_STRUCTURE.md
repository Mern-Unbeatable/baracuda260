# Project structure (modules)

## Top level

```text
src/
├── app/           # router, Redux store
├── shared/        # config, i18n, lib, site-chrome, ui, utils
├── layouts/       # PublicLayout, AuthLayout, AppShellLayout
└── modules/
    ├── public/    # marketing site (route folders — see below)
    ├── auth/      # login, signup
    ├── member/    # photographer app (/admin/* user routes)
    └── admin/     # staff app (/admin/* admin routes)
```

## Public module — route-first layout

Each **URL area** is a folder. The router lazy-loads `{route}/{PageName}.jsx`.

```text
modules/public/
├── home/
│   ├── Home.jsx              # route entry (SEO + layout + compose sections)
│   ├── components/           # e.g. HomeHero
│   ├── sections/             # home-only sections (stats, winners, features, …)
│   └── data/
├── about/
│   ├── About.jsx
│   ├── sections/             # AboutHero, AboutCta, …
│   └── data/
├── competitions/
│   └── Competitions.jsx
├── gallery/
│   ├── Gallery.jsx
│   ├── sections/             # GalleryMain
│   ├── components/           # FavoriteHeartButton
│   └── detail/               # GalleryDetail.jsx, GalleryDetailView, …
├── leaderboard/
│   ├── Leaderboard.jsx
│   └── sections/
├── winners/
├── contact/
├── services/
├── photographer/
├── competition-details/      # shared with member upload flow
├── legal/
│   ├── privacy/
│   ├── terms/
│   ├── cookies/
│   └── data/
└── shared/
    └── sections/             # reused across routes (ActiveCompetitions, HowItWorks, …)
```

**Flow:** URL → `home/Home.jsx` (or `about/About.jsx`, …) → local `sections/` + `components/` + `shared/sections/`.

Cross-route marketing UI: `@/shared/ui/marketing`. **Section header text sizes** are hardcoded in `shared/ui/marketing/SectionHeader.jsx` (badge / `h2` / description `className` strings).

**Section vertical padding:** `section-py` in `src/index.css` (`@apply py-10 sm:py-12 lg:py-14`) on marketing `<section>` elements.

## Other modules (unchanged pattern)

| Folder | Purpose |
|--------|---------|
| `pages/` or route folder | Route files — router `lazy()` imports here |
| `sections/` / `components/` | Page sections and smaller UI |
| `hooks/` | Module-specific hooks |
| `data/` | Static data next to the feature |

## Router imports (public)

Examples:

- `@/modules/public/home/Home`
- `@/modules/public/about/About`
- `@/modules/public/gallery/Gallery`
- `@/modules/public/gallery/detail/GalleryDetail`

## Cross-module imports

Use `@/modules/<module>/...` or `@/shared/...`.

## Scripts

- `scripts/restructure-public-by-route.js` — public route-folder migration (already applied)
- `scripts/migrate-to-modules.js` — legacy module move
- `scripts/fix-module-imports.js` — repair imports after moves
