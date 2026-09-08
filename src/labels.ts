// The chrome's own words — the accessible names of its controls. English by
// default; a localised site passes its translations to `Header`/`Shell`.

export interface Labels {
  /** WCAG 2.4.1 skip-to-content link, first in the tab order. */
  skip: string;
  /** The hamburger's accessible name. */
  menu: string;
  /** The theme control, and its three options. `gray` is a LIGHT-family
   *  theme — a muted paper, not a second dark. */
  theme: string;
  light: string;
  gray: string;
  dark: string;
  /** The locale switcher's accessible name. */
  language: string;
}

export const LABELS: Labels = {
  skip: "Skip to content",
  menu: "Open menu",
  theme: "Toggle theme",
  light: "Light",
  gray: "Gray",
  dark: "Dark",
  language: "Language",
};
