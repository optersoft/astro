// The fleet's three-way colour theme — light / gray / dark — as the two
// browser-side pieces every page needs: the pre-paint script and the values it
// shares with the toggle.
//
// This is `dioxus_chrome::THEME_APPLY_SCRIPT` (dioxus/dioxus-chrome/src/theme.rs)
// verbatim, so an Astro site and a Dioxus app read the same `localStorage` key,
// set the same classes on `<html>` and paint the same bar colour. The two copies
// must stay equal: a reader who picks "Gray" on optersoft.com expects academy
// and the product sites to follow.
//
// ⚠ `gray` is a LIGHT-family theme — dark text on a muted paper — so only true
// `dark` sets `color-scheme: dark`. The class lives on `<html>`; `theme.css`
// keys on it, and Tailwind's `dark:` variant is bound to `.dark` in
// `styles/chrome.css`.

export const THEMES = ["light", "gray", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/** The `localStorage` key the preference is kept under. optersoft.com's cookie
 *  notice names it verbatim — renaming it is a copy change there too. */
export const THEME_KEY = "color-theme";

/** The mobile browser chrome's colour per theme (`<meta name="theme-color">`). */
export const BAR: Record<Theme, string> = { light: "#ffffff", gray: "#d9dde3", dark: "#020617" };

/**
 * The pre-paint script. It has to be inline in `<head>` and run BEFORE first
 * paint — it is what stops a flash of the wrong colour scheme — so `Layout`
 * emits it with `is:inline`, which keeps Astro from bundling and deferring it.
 */
export const THEME_APPLY_SCRIPT = `
(function () {
  const BAR = { light: '#ffffff', gray: '#d9dde3', dark: '#020617' };
  const apply = () => {
    const t = localStorage.getItem('color-theme')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const el = document.documentElement;
    el.classList.toggle('dark', t === 'dark');
    el.classList.toggle('gray', t === 'gray');
    // gray is a LIGHT-family theme (dark text), so only true dark renders dark.
    el.style.colorScheme = t === 'dark' ? 'dark' : 'light';
    // Keep the mobile browser chrome in step with the page.
    let m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
    m.content = BAR[t] || BAR.light;
  };
  apply();
  // Re-run once DOM is ready in case anything else stomped on the class.
  document.addEventListener('DOMContentLoaded', apply);
})();
`.trim();
