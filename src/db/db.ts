import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import Env from "../modules/env.module";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { CategoryTable } from "./models/category.model";
import * as Updates from "expo-updates";

class DrizzleDB {
  private static readonly expoDb = SQLite.openDatabaseSync(Env.DB_NAME);
  public static readonly main = drizzle(this.expoDb, {
    schema: {
      CategoryTable,
    },
  });

  public static async exportMainData() {
    try {
      const zip = new JSZip();
      const tables = Object.entries(this.main.query);

      for (const [name, table] of tables) {
        const data = await table.findMany();
        zip.file(`${name}.json`, JSON.stringify(data, null, 2));
      }

      const zipBase64 = await zip.generateAsync({ type: "base64" });
      const zipPath = `${FileSystem.documentDirectory}export.zip`;
      await FileSystem.writeAsStringAsync(zipPath, zipBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(zipPath, { mimeType: "application/zip" });
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  }

  public static async deleteMain() {
    try {
      const dbPath = `${FileSystem.documentDirectory}SQLite/${Env.DB_NAME}`;

      console.log(dbPath);

      const fileInfo = await FileSystem.getInfoAsync(dbPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(dbPath);
      }

      if (__DEV__) {
        return console.log("DB deleted - restart the app manually");
      }

      await Updates.reloadAsync();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }
}

export default DrizzleDB;
