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
import { fileURLToPath, pathToFileURL } from "node:url";
import type { AstroIntegration } from "astro";

export interface Options {
  /** The site's root stylesheet, relative to its root. */
  css?: string;
}

export default function optersoft(options: Options = {}): AstroIntegration {
  return {
    name: "@optersoft/astro",
    hooks: {
      "astro:config:setup": async ({ config, updateConfig, injectScript }) => {
        const require = createRequire(new URL("package.json", config.root));
        const { default: tailwindcss } = await import(pathToFileURL(require.resolve("@tailwindcss/vite")).href);
        updateConfig({ vite: { plugins: [tailwindcss()] } });
        const css = fileURLToPath(new URL(options.css ?? "./src/styles/global.css", config.root));
        injectScript("page-ssr", `import ${JSON.stringify(css)};`);
      },
    },
  };
}
