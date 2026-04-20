import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/models/**/*.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  driver: "expo",
  migrations: {
    prefix: "timestamp",
  },
});
