import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const CategoryTable = sqliteTable("categories", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  color: text("color").$default(() => "#696969"),
});
