// A one-page site that renders every component, for `astro check` and a
// visual pass: `npm run build` from the repo root, then open example/dist.
import { defineConfig } from "astro/config";
import optersoft from "../src/integration.ts";
export default defineConfig({ integrations: [optersoft({ css: "./src/global.css" })] });
