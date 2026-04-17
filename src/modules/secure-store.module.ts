import * as ExpoSecureStore from "expo-secure-store";

class SecureStore {
  public static async get(key: string): Promise<string | null> {
    return await ExpoSecureStore.getItemAsync(key);
  }

  public static async set(key: string, value: string): Promise<void> {
    await ExpoSecureStore.setItemAsync(key, value);
  }

  public static async delete(key: string): Promise<void> {
    await ExpoSecureStore.deleteItemAsync(key);
  }

  public static async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  public static async setJSON<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }
}

export default SecureStore;
