// The Astro integration: `integrations: [optersoft()]` is all a site's config
// needs to carry for the chrome to work.
//
// It does two things. It registers Tailwind's Vite plugin — resolved from the
// SITE's root, not from here: this package is consumed as a `file:../astro`
// path dependency, so Node would look for `@tailwindcss/vite` beside the
// symlink's real path, where there is no `node_modules`. And it injects the
// site's root stylesheet into every page, the way `@astrojs/tailwind` did, so
// no page or layout has to remember to import it.
//
// The root stylesheet stays the SITE's file for the same reason: the
// `@import "tailwindcss"` line resolves from the file's real directory, and a
// copy inside this package would not find it. Three lines are enough:
//
//     @import "tailwindcss";
//     @plugin "@tailwindcss/typography";      /* if the site uses `prose` */
//     @import "@optersoft/astro/styles/chrome.css";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

export interface Options {
  /** The site's root stylesheet, relative to its root. */
  css?: string;
}

export default function optersoft(options: Options = {}): AstroIntegration {
  return {
    name: "@optersoft/astro",
    hooks: {
      "astro:config:setup": ({ config, updateConfig, injectScript }) => {
        // `require`, not `await import()`: this hook runs inside Vite's module runner, and a
        // dynamic import whose specifier is computed keeps the runner open past the end of
        // the hook — on a cold builder it is already closed by the time the module lands
        // ("Vite module runner has been closed", Cloudflare Pages, 2026-09-08). Node has
        // required ESM synchronously since 22.12, which this package already asks for.
        const require = createRequire(new URL("package.json", config.root));
        const loaded = require("@tailwindcss/vite");
        const tailwindcss = loaded.default ?? loaded;
        updateConfig({ vite: { plugins: [tailwindcss()] } });
        const css = fileURLToPath(new URL(options.css ?? "./src/styles/global.css", config.root));
        injectScript("page-ssr", `import ${JSON.stringify(css)};`);
      },
    },
  };
}
