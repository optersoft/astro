# @optersoft/astro

The Optersoft chrome for Astro sites: the document, the sticky header with the
locale switcher and the **light / gray / dark** toggle, the footer with the
company block, the brand typeface and palette, the fonts. optersoft.com,
hive.optersoft.com, make.optersoft.com and frontage.optersoft.com are built on
it, which is what makes the four sites one company on sight — and one theme
preference across them (`localStorage` `color-theme`, the same key the Dioxus
apps read).

## Using it

It is a **`file:` path dependency on a sibling checkout**, the fleet's
convention for its Rust crates applied to npm: nothing to bump, a change here
reaches every site on its next build, uncommitted edits ship with a deploy.
Check this repo out beside the site's repo under `~/optersoft/`, then:

```json
"dependencies": { "@optersoft/astro": "file:../astro" }
```

```js
// astro.config.mjs
import optersoft from "@optersoft/astro/integration";
export default defineConfig({ integrations: [optersoft()] });
```

```css
/* src/styles/global.css — the site's root stylesheet, injected into every page */
@import "tailwindcss";
@plugin "@tailwindcss/typography";   /* only if the site uses `prose` */
@import "@optersoft/astro/styles/chrome.css";
```

```astro
---
import Layout from "@optersoft/astro/Layout.astro";
import Shell from "@optersoft/astro/Shell.astro";
---
<Layout title="…" description="…" canonical="https://…/">
  <Shell header={{ brand: { href: "/", name: "hive" }, links: [{ href: "/#download", label: "Download" }] }}>
    …
  </Shell>
</Layout>
```

The site needs `astro`, `tailwindcss` and `@tailwindcss/vite` in its own
`package.json` (they are peer dependencies here). A CI job checks the two
repos out side by side (`actions/checkout` twice, `path: site` and
`path: astro`) and runs from the site's directory; a builder that has only
the site's repo clones this one first (frontage's `mk site.build` does).

## What is in it

| | |
|---|---|
| `integration.ts` | registers Tailwind's Vite plugin (resolved from the SITE's root — see the note in the file on why) and injects the site's `src/styles/global.css` into every page |
| `Layout.astro` | `<html>` + the common `<head>` (title, description, robots, canonical, Open Graph, Twitter, icons, `theme-color`), the pre-paint theme script, `<body>`. A `head` slot for what only one site emits (hreflang, JSON-LD) |
| `Shell.astro` | Header + `<main id="main">` + Footer, forwarding the `brand`, `actions`, `menu` and `end` slots |
| `Header.astro` | skip link, brand, links, optional locale switcher, theme toggle, an `actions` slot (a sign-in button), the hamburger. `collapse="md" \| "lg"` is a measurement, read the note |
| `ThemeToggle.astro`, `LangSwitcher.astro` | native `<details>` dropdowns, an exclusive accordion between them |
| `Footer.astro` | "Optersoft, S.L.", the social row, two columns of links (default: into optersoft.com), the copyright line, the registry ids |
| `PageHeader.astro`, `HeaderBackdrop.astro`, `NotFound.astro` | the page top every site opens with, its grid backdrop, the 404 body |
| `theme.ts` | `THEME_APPLY_SCRIPT`, `BAR`, `THEME_KEY` — `dioxus_chrome::THEME_APPLY_SCRIPT` verbatim |
| `labels.ts`, `links.ts` | the chrome's accessible names (English; a localised site passes its own) and the company's links and social profiles |
| `styles/chrome.css` | the `.dark` variant, `brand.css`, `theme.css`, `@source` for these components, the base `html`/`body` rules |
| `styles/brand.css`, `styles/theme.css`, `fonts/` | the brand and the three-way theme — **copies of `dioxus/dioxus-chrome`'s**, the canonical for the Dioxus apps; when the brand changes, change both |

## The theme

Three-way, `light` / `gray` / `dark`, as a class on `<html>` (`.dark`, `.gray`).
`gray` is a **light-family** theme — dark text on a muted paper — so only
true `dark` sets `color-scheme: dark`. The pre-paint script in `Layout` reads
`localStorage` (`color-theme`, else the system preference) before first paint;
the toggle writes it. `theme.css` overrides the light surface utilities by
class name under `.gray`, in both the `gray-*` and the `slate-*` spelling
(`brand.css` maps both onto one ramp).

## Working on it

`npm install` here gives you `astro` for editor support and `npm run check`
(`astro check` over `example/`, a one-page site that renders every component
with a locale switcher and both slots filled). The sites are the real test:
`mk build` in `../site`, `mk site.build` in `../hive`, `../make`,
`../frontage`. Two rules the package lives by, because it is consumed through
a symlink whose real path has no `node_modules`:

- **nothing here may resolve a bare module specifier at build time** — no
  `@import "tailwindcss"` in these stylesheets, no runtime `import` of a
  dependency in these components (the integration resolves Tailwind's plugin
  from the site's root by hand), and `tsconfig.json` has no `extends`;
- **`package.json` changes are lockfile changes in every site** — `npm ci`
  refuses a link whose manifest drifted from the lock, so bump nothing
  casually.
