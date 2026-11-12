/**
 * copy-map-worker.mjs
 *
 * MapLibre GL does its heavy work (parsing map tiles) in a "web worker": a
 * second JavaScript thread, so the page stays responsive. The browser must load
 * the worker from its own URL, and MapLibre 6 cannot find that file by itself
 * once a bundler has repackaged the library. So we copy the worker into
 * /public (served as-is at /vendor/…) and tell MapLibre where it is
 * (see src/components/map/maplibre.ts).
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "node_modules", "maplibre-gl", "dist", "maplibre-gl-worker.mjs");
const targetDir = path.join(root, "public", "vendor");
const target = path.join(targetDir, "maplibre-gl-worker.mjs");

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);
console.log(`map worker copied → public/vendor/maplibre-gl-worker.mjs (${(fs.statSync(target).size / 1024).toFixed(0)} KB)`);
