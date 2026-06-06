import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./packages/providers/drizzle",
  schema: "./packages/providers/src/database/postgres/schema.ts",
  strict: true,
  verbose: true,
});
