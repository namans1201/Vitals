import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  // Prisma 7's config `datasource` only accepts `url` / `shadowDatabaseUrl` —
  // there is no `directUrl` field (that schema.prisma property was removed in
  // this version; the schema engine errors with "no longer supported in
  // schema files" if you try it). The CLI (this file) is what runs
  // `migrate deploy`, which needs an unpooled connection, so it reads
  // DIRECT_URL when set. The app's own runtime client (src/lib/db.ts) is
  // unaffected by this file — it reads DATABASE_URL directly via
  // @prisma/adapter-pg, and should stay pointed at Neon's pooled connection
  // string. Locally, only DATABASE_URL is set, so this just falls back to it.
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
