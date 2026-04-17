import { create } from "zustand";
import SecureStore from "../modules/secure-store.module";

type Credential = {
  email: string;
  password: string;
};

type CredentialsStore = {
  credentials: Record<string, Credential>;
  load: () => Promise<void>;
  set: (site: string, credential: Credential) => Promise<void>;
  delete: (site: string) => Promise<void>;
  get: (site: string) => Credential | null;
};

const STORE_KEY = "credentials";

const useCredentialsStore = create<CredentialsStore>((set, get) => ({
  credentials: {},

  load: async () => {
    const data =
      await SecureStore.getJSON<Record<string, Credential>>(STORE_KEY);
    set({ credentials: data ?? {} });
  },

  set: async (site, credential) => {
    const current = get().credentials;
    const updated = { ...current, [site]: credential };
    await SecureStore.setJSON(STORE_KEY, updated);
    set({ credentials: updated });
  },

  delete: async (site) => {
    const current = get().credentials;
    const { [site]: _, ...rest } = current;
    await SecureStore.setJSON(STORE_KEY, rest);
    set({ credentials: rest });
  },

  get: (site) => {
    return get().credentials[site] ?? null;
  },
}));

export default useCredentialsStore;
