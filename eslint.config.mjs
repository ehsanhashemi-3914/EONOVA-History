import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// ESLint = a static checker that reads the code without running it and flags
// likely bugs and bad patterns. We use the rule sets maintained by Next.js.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "node_modules/**", "data-raw/**", "public/**", "next-env.d.ts", "playwright-report/**", "test-results/**"]),
]);
