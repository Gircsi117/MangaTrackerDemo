import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import Env from "../modules/env.module";
import { CategoryTable } from "./models/category.model";

const expoDb = SQLite.openDatabaseSync(Env.DB_NAME);
export const db = drizzle(expoDb, {
  schema: {
    CategoryTable,
  },
});
