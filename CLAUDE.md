# CLAUDE.md

`@optersoft/astro` — the Optersoft chrome for Astro sites (layout, header,
footer, the light / gray / dark theme, brand stylesheet, fonts). The repo root
is the npm package. **Public, on github.com/optersoft/astro**, because two of
its consumers (`make`, `frontage`) are public and build on GitHub Actions or
Cloudflare's builder. Consumed as `file:../astro` by `site/`, and
`file:../../astro` by `hive/web/`, `make/site/`, `frontage/web/`.

Read `README.md` first — the usage, the table of files, and the two rules
that follow from being consumed through a symlink (no bare-specifier
resolution from inside the package; manifest changes are lockfile changes in
every site).

Conventions:

- **`brand.css` and `theme.css` are copies of `dioxus/dioxus-chrome`'s**
  (the Dioxus apps' canonical: academy, staff). A brand change is made in
  both, same commit. `theme.ts` is `THEME_APPLY_SCRIPT` verbatim.
- **Markup contracts:** `#navbar-menu`, `#theme-details`, `#theme-menu`,
  `.ic-sun/.ic-gray/.ic-moon`, `.opt-light/.opt-gray/.opt-dark`,
  `name="dx-nav-popover"` are what `theme.css` and the scripts key on.
- **Tailwind only generates classes it can read** — the header's breakpoint
  table (`collapse`) is literal class strings per breakpoint for that reason;
  never build a class name from a string at render time.
- Forwarded slots exist even when empty: components key wrappers on the
  slot's rendered content (`Astro.slots.render`), not on `Astro.slots.has`.
- A `.astro` file in this package is compiled by the consuming site's Vite,
  so the source here is what ships; there is no build step and nothing to
  publish.
