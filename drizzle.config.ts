import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/models/**/*.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo",
  migrations: {
    prefix: "timestamp",
  },
});
